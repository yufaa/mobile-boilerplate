// Export store and types
export { default as store } from './store';
export type { RootState, AppDispatch } from './store';
export { useAppDispatch, useAppSelector } from './store';

// Export slices
export { default as appSlice } from './appSlice';
export { default as authSlice } from './authSlice';

// Export actions
export {
  setOnboardingCompleted,
  setTheme,
  setLanguage,
  setNotificationSettings,
  resetAppState,
} from './appSlice';

export {
  setLoading,
  setUser,
  setSession,
  setError,
  signOut,
  clearError,
} from './authSlice';