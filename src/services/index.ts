// Export Supabase service
export { default as supabaseService, supabase } from './supabase';

// Re-export types for convenience
export type {
  User,
  AuthState,
  LoginForm,
  RegisterForm,
  ResetPasswordForm,
  SupabaseAuthResponse,
} from '@/types';