import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '@/types';

const initialState: AppState = {
  isOnboardingCompleted: false,
  theme: 'auto',
  language: 'en',
  notifications: {
    push: true,
    email: true,
    marketing: false,
  },
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setOnboardingCompleted: (state, action: PayloadAction<boolean>) => {
      state.isOnboardingCompleted = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'auto'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    updateNotificationSettings: (
      state,
      action: PayloadAction<Partial<AppState['notifications']>>
    ) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    resetAppState: () => initialState,
  },
});

export const {
  setOnboardingCompleted,
  setTheme,
  setLanguage,
  updateNotificationSettings,
  resetAppState,
} = appSlice.actions;

export default appSlice.reducer;