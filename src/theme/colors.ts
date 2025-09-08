export interface ColorScheme {
  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  // Secondary colors
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  
  // Background colors
  background: string;
  surface: string;
  card: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textDisabled: string;
  white: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Border and divider
  border: string;
  divider: string;
  
  // Interactive elements
  link: string;
  linkPressed: string;
  
  // Overlay
  overlay: string;
  
  // Shadow
  shadow: string;
}

const lightColors: ColorScheme = {
  // Primary colors
  primary: '#007AFF',
  primaryLight: '#5AC8FA',
  primaryDark: '#0051D5',
  
  // Secondary colors
  secondary: '#5856D6',
  secondaryLight: '#AF52DE',
  secondaryDark: '#3634A3',
  
  // Background colors
  background: '#FFFFFF',
  surface: '#F2F2F7',
  card: '#FFFFFF',
  
  // Text colors
  text: '#000000',
  textSecondary: '#6D6D70',
  textDisabled: '#C7C7CC',
  white: '#FFFFFF',
  
  // Status colors
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#007AFF',
  
  // Border and divider
  border: '#C6C6C8',
  divider: '#E5E5EA',
  
  // Interactive elements
  link: '#007AFF',
  linkPressed: '#0051D5',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.4)',
  
  // Shadow
  shadow: '#000000',
};

const darkColors: ColorScheme = {
  // Primary colors
  primary: '#0A84FF',
  primaryLight: '#64D2FF',
  primaryDark: '#0056CC',
  
  // Secondary colors
  secondary: '#5E5CE6',
  secondaryLight: '#BF5AF2',
  secondaryDark: '#3634A3',
  
  // Background colors
  background: '#000000',
  surface: '#1C1C1E',
  card: '#2C2C2E',
  
  // Text colors
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  textDisabled: '#48484A',
  white: '#FFFFFF',
  
  // Status colors
  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
  info: '#0A84FF',
  
  // Border and divider
  border: '#38383A',
  divider: '#2C2C2E',
  
  // Interactive elements
  link: '#0A84FF',
  linkPressed: '#409CFF',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.6)',
  
  // Shadow
  shadow: '#000000',
};

export { lightColors, darkColors };

export const getColors = (isDark: boolean): ColorScheme => {
  return isDark ? darkColors : lightColors;
};