import React from 'react';
import { Stack } from 'expo-router';
import { useColorScheme } from '@/hooks';
import { colors } from '@/theme';

export default function AuthLayout() {
  const { isDark } = useColorScheme();
  const themeColors = colors(isDark);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: themeColors.background,
        },
        headerTintColor: themeColors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: themeColors.background,
        },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen 
        name="login" 
        options={{ 
          title: 'Sign In',
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="register" 
        options={{ 
          title: 'Create Account',
          headerShown: false,
        }} 
      />
    </Stack>
  );
}