import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Link, router } from 'expo-router';
import { ScreenLayout, Button, Input, Card } from '@/components';
import { colors } from '@/theme';
import { useColorScheme } from '@/hooks';
import { useAppDispatch, useAppSelector } from '@/slices';
import { setLoading, setUser, setSession, setError } from '@/slices/authSlice';
import { supabaseService } from '@/services';
import type { LoginForm } from '@/types';

export default function LoginScene() {
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<LoginForm>>({});
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const { isDark } = useColorScheme();
  const themeColors = colors(isDark);
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginForm> = {};

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!form.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof LoginForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    // Clear global error
    if (error) {
      dispatch(setError(null));
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const result = await supabaseService.signIn(form);
      
      if (result.success) {
        if (result.user && result.session) {
          dispatch(setUser(result.user));
          dispatch(setSession(result.session));
          router.replace('/(tabs)');
        }
      } else {
        dispatch(setError(result.error || 'Login failed'));
      }
    } catch (err) {
      dispatch(setError('An unexpected error occurred'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleMagicLink = async () => {
    if (!form.email.trim()) {
      setErrors({ email: 'Email is required for magic link' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErrors({ email: 'Please enter a valid email' });
      return;
    }

    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const result = await supabaseService.signInWithMagicLink(form.email);
      
      if (result.success) {
        setMagicLinkSent(true);
        Alert.alert(
          'Magic Link Sent',
          'Check your email for the magic link to sign in.',
          [{ text: 'OK' }]
        );
      } else {
        dispatch(setError(result.error || 'Failed to send magic link'));
      }
    } catch (err) {
      dispatch(setError('An unexpected error occurred'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGoogleLogin = async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const result = await supabaseService.signInWithGoogle();
      
      if (!result.success) {
        dispatch(setError(result.error || 'Google sign in failed'));
      }
      // Success will be handled by auth state change listener
    } catch (err) {
      dispatch(setError('An unexpected error occurred'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <ScreenLayout
      scrollable
      loading={loading}
      loadingText="Signing in..."
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: themeColors.text }]}>
            Welcome Back
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            Sign in to your account
          </Text>
        </View>

        <Card variant="elevated" padding="large" style={styles.formCard}>
          {error && (
            <View style={[styles.errorContainer, { backgroundColor: themeColors.errorBackground }]}>
              <Text style={[styles.errorText, { color: themeColors.error }]}>
                {error}
              </Text>
            </View>
          )}

          {magicLinkSent && (
            <View style={[styles.successContainer, { backgroundColor: themeColors.successBackground }]}>
              <Text style={[styles.successText, { color: themeColors.success }]}>
                Magic link sent! Check your email.
              </Text>
            </View>
          )}

          <Input
            label="Email"
            placeholder="Enter your email"
            value={form.email}
            onChangeText={(value) => handleInputChange('email', value)}
            error={errors.email}
            leftIcon="mail"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            required
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={form.password}
            onChangeText={(value) => handleInputChange('password', value)}
            error={errors.password}
            leftIcon="lock-closed"
            secureTextEntry
            autoComplete="password"
            required
          />

          <View style={styles.forgotPassword}>
            <Link href="/auth/forgot-password" asChild>
              <Text style={[styles.link, { color: themeColors.primary }]}>
                Forgot Password?
              </Text>
            </Link>
          </View>

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            fullWidth
            style={styles.loginButton}
          />

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: themeColors.border }]} />
            <Text style={[styles.dividerText, { color: themeColors.textSecondary }]}>
              or
            </Text>
            <View style={[styles.dividerLine, { backgroundColor: themeColors.border }]} />
          </View>

          <Button
            title="Continue with Google"
            variant="outline"
            onPress={handleGoogleLogin}
            disabled={loading}
            fullWidth
            style={styles.googleButton}
          />

          <Button
            title="Send Magic Link"
            variant="ghost"
            onPress={handleMagicLink}
            disabled={loading}
            fullWidth
            style={styles.magicLinkButton}
          />
        </Card>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: themeColors.textSecondary }]}>
            Don't have an account?{' '}
          </Text>
          <Link href="/auth/register" asChild>
            <Text style={[styles.link, { color: themeColors.primary }]}>
              Sign Up
            </Text>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  formCard: {
    marginBottom: 24,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  successContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  successText: {
    fontSize: 14,
    textAlign: 'center',
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  loginButton: {
    marginBottom: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  googleButton: {
    marginBottom: 8,
  },
  magicLinkButton: {
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
  },
  link: {
    fontSize: 14,
    fontWeight: '600',
  },
});