import { createClient } from '@supabase/supabase-js';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';
import { getConfig } from '@/utils/config';
import { store } from '@/slices';
import { setUser, setSession, signOut as signOutAction } from '@/slices/authSlice';
import type { User, AuthState, LoginForm, RegisterForm, ResetPasswordForm, SupabaseAuthResponse } from '@/types';

// Initialize Supabase client
const config = getConfig();
const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
  auth: {
    ...(Platform.OS !== 'web' ? { detectSessionInUrl: false } : {}),
  },
});

// Configure WebBrowser for auth redirects
WebBrowser.maybeCompleteAuthSession();

class SupabaseService {
  private static instance: SupabaseService;
  
  public static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  // Get current session
  async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      console.error('Error getting current session:', error);
      return null;
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      
      if (!user) return null;
      
      return {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.full_name || user.user_metadata?.name || '',
        avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
        provider: user.app_metadata?.provider || 'email',
        emailVerified: user.email_confirmed_at !== null,
        createdAt: user.created_at,
        updatedAt: user.updated_at || user.created_at,
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Sign up with email and password
  async signUp({ email, password, name }: RegisterForm): Promise<SupabaseAuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        user: data.user ? await this.transformUser(data.user) : null,
        session: data.session,
        needsEmailConfirmation: !data.session,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  // Sign in with email and password
  async signIn({ email, password }: LoginForm): Promise<SupabaseAuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        user: data.user ? await this.transformUser(data.user) : null,
        session: data.session,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  // Sign in with magic link
  async signInWithMagicLink(email: string): Promise<SupabaseAuthResponse> {
    try {
      const redirectTo = Platform.OS === 'web' 
        ? `${window.location.origin}/auth/callback`
        : makeRedirectUri({ path: '/auth/callback' });

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        message: 'Check your email for the magic link!',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  // Sign in with Google
  async signInWithGoogle(): Promise<SupabaseAuthResponse> {
    try {
      const redirectTo = Platform.OS === 'web'
        ? `${window.location.origin}/auth/callback`
        : makeRedirectUri({ path: '/auth/callback' });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (Platform.OS !== 'web' && data.url) {
        // Open the OAuth URL in the browser
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectTo
        );

        if (result.type === 'success' && result.url) {
          // Handle the redirect URL
          const url = new URL(result.url);
          const params = new URLSearchParams(url.hash.substring(1));
          
          if (params.get('error')) {
            return {
              success: false,
              error: params.get('error_description') || 'Authentication failed',
            };
          }
        }
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  // Reset password
  async resetPassword({ email }: ResetPasswordForm): Promise<SupabaseAuthResponse> {
    try {
      const redirectTo = Platform.OS === 'web'
        ? `${window.location.origin}/auth/reset-password`
        : makeRedirectUri({ path: '/auth/reset-password' });

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        message: 'Check your email for the password reset link!',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  // Update password
  async updatePassword(newPassword: string): Promise<SupabaseAuthResponse> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        message: 'Password updated successfully!',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  // Sign out
  async signOut(): Promise<SupabaseAuthResponse> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  // Initialize auth listener to sync with Redux store
  initializeAuthListener() {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const user = await this.getCurrentUser();
        store.dispatch(setUser(user));
        store.dispatch(setSession(session));
      } else if (event === 'SIGNED_OUT') {
        store.dispatch(signOutAction());
      } else if (event === 'TOKEN_REFRESHED' && session) {
        store.dispatch(setSession(session));
      }
    });
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  // Handle deep link authentication
  async handleDeepLink(url: string): Promise<SupabaseAuthResponse> {
    try {
      const { data, error } = await supabase.auth.getSessionFromUrl({ url });
      
      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        user: data.user ? await this.transformUser(data.user) : null,
        session: data.session,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  // Transform Supabase user to our User type
  private async transformUser(supabaseUser: any): Promise<User> {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || '',
      avatar: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || '',
      provider: supabaseUser.app_metadata?.provider || 'email',
      emailVerified: supabaseUser.email_confirmed_at !== null,
      createdAt: supabaseUser.created_at,
      updatedAt: supabaseUser.updated_at || supabaseUser.created_at,
    };
  }

  // Get the Supabase client (for advanced usage)
  getClient() {
    return supabase;
  }
}

// Export singleton instance
export default SupabaseService.getInstance();
export { supabase };