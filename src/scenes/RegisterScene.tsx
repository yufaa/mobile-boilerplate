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
import type { RegisterForm } from '@/types';

export default function RegisterScene() {
  const [form, setForm] = useState<RegisterForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<RegisterForm & { confirmPassword: string }>>({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const { isDark } = useColorScheme();
  const themeColors = colors(isDark);
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterForm & { confirmPassword: string }> = {};

    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!form.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof (RegisterForm & { confirmPassword: string }), value: string) => {
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

  const handleRegister = async () => {
    if (!validateForm()) return;

    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const result = await supabaseService.signUp({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      
      if (result.success) {
        if (result.needsEmailConfirmation) {
          setRegistrationSuccess(true);
          Alert.alert(
            'Registration Successful',
            'Please check your email to confirm your account before signing in.',
            [
              {
                text: 'OK',
                onPress: () => router.replace('/auth/login'),
              },
            ]
          );
        } else if (result.user && result.session) {
          dispatch(setUser(result.user));
          dispatch(setSession(result.session));
          router.replace('/(tabs)');
        }
      } else {
        dispatch(setError(result.error || 'Registration failed'));
      }
    } catch (err) {
      dispatch(setError('An unexpected error occurred'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGoogleRegister = async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const result = await supabaseService.signInWithGoogle();
      
      if (!result.success) {
        dispatch(setError(result.error || 'Google sign up failed'));
      }
      // Success will be handled by auth state change listener
    } catch (err) {
      dispatch(setError('An unexpected error occurred'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (registrationSuccess) {
    return (
      <ScreenLayout>
        <View style={styles.successContainer}>
          <Card variant="elevated" padding="large" style={styles.successCard}>
            <Text style={[styles.successTitle, { color: themeColors.success }]}>
              Registration Successful!
            </Text>
            <Text style={[styles.successMessage, { color: themeColors.text }]}>
              We've sent a confirmation email to {form.email}. Please check your email and click the confirmation link to activate your account.
            </Text>
            <Button
              title="Go to Login"
              onPress={() => router.replace('/auth/login')}
              style={styles.successButton}
            />
          </Card>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout
      scrollable
      loading={loading}
      loadingText="Creating account..."
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: themeColors.text }]}>
            Create Account
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            Sign up to get started
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

          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={form.name}
            onChangeText={(value) => handleInputChange('name', value)}
            error={errors.name}
            leftIcon="person"
            autoCapitalize="words"
            autoComplete="name"
            required
          />

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
            placeholder="Create a password"
            value={form.password}
            onChangeText={(value) => handleInputChange('password', value)}
            error={errors.password}
            leftIcon="lock-closed"
            secureTextEntry
            autoComplete="new-password"
            hint="Must contain uppercase, lowercase, and number"
            required
          />

          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={form.confirmPassword}
            onChangeText={(value) => handleInputChange('confirmPassword', value)}
            error={errors.confirmPassword}
            leftIcon="lock-closed"
            secureTextEntry
            autoComplete="new-password"
            required
          />

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            fullWidth
            style={styles.registerButton}
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
            onPress={handleGoogleRegister}
            disabled={loading}
            fullWidth
            style={styles.googleButton}
          />
        </Card>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: themeColors.textSecondary }]}>
            Already have an account?{' '}
          </Text>
          <Link href="/auth/login" asChild>
            <Text style={[styles.link, { color: themeColors.primary }]}>
              Sign In
            </Text>
          </Link>
        </View>

        <View style={styles.terms}>
          <Text style={[styles.termsText, { color: themeColors.textSecondary }]}>
            By creating an account, you agree to our{' '}
            <Text style={[styles.link, { color: themeColors.primary }]}>
              Terms of Service
            </Text>
            {' '}and{' '}
            <Text style={[styles.link, { color: themeColors.primary }]}>
              Privacy Policy
            </Text>
          </Text>
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
  registerButton: {
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
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  footerText: {
    fontSize: 14,
  },
  link: {
    fontSize: 14,
    fontWeight: '600',
  },
  terms: {
    paddingHorizontal: 20,
  },
  termsText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  successCard: {
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  successButton: {
    minWidth: 120,
  },
});