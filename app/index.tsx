import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useAppSelector, useAppDispatch } from '@/slices';
import { setLoading, setUser, setSession } from '@/slices/authSlice';
import { supabaseService } from '@/services';
import { Loading } from '@/components';
import { colors } from '@/theme';
import { useColorScheme } from '@/hooks';

export default function Index() {
  const { isDark } = useColorScheme();
  const themeColors = colors(isDark);
  const dispatch = useAppDispatch();
  const { user, session, loading } = useAppSelector((state) => state.auth);
  const { hasCompletedOnboarding } = useAppSelector((state) => state.app);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    dispatch(setLoading(true));
    
    try {
      // Get current session
      const { data: { session }, error } = await supabaseService.getClient().auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        dispatch(setLoading(false));
        return;
      }

      if (session) {
        // Transform session to our format
        const transformedSession = supabaseService.transformSession(session);
        const transformedUser = supabaseService.transformUser(session.user);
        
        dispatch(setSession(transformedSession));
        dispatch(setUser(transformedUser));
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <Loading 
          size="large" 
          text="Loading..." 
          color={themeColors.primary}
        />
      </View>
    );
  }

  // Redirect based on authentication state
  if (!user || !session) {
    return <Redirect href="/auth/login" />;
  }

  // If user is authenticated, redirect to main app
  return <Redirect href="/(tabs)/home" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});