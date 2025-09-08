export * from './colors';
export * from './fonts';
export * from './images';

import { getColors } from './colors';

// Export colors function for backward compatibility
export const colors = getColors;
import { getFontSizes, getFontWeights, typography } from './fonts';
import { images, imageDimensions, imageStyles } from './images';

// Spacing system
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

// Border radius
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

// Shadows
export const shadows = {
  sm: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Animation durations
export const animations = {
  fast: 150,
  normal: 250,
  slow: 350,
};

// Z-index values
export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  toast: 1700,
};

// Theme object
export const createTheme = (isDark: boolean) => ({
  colors: getColors(isDark),
  fonts: {
    sizes: getFontSizes(),
    weights: getFontWeights(),
    typography,
  },
  images,
  imageDimensions,
  imageStyles,
  spacing,
  borderRadius,
  shadows,
  animations,
  zIndex,
  isDark,
});

export type Theme = ReturnType<typeof createTheme>;