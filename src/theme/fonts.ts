import * as Font from 'expo-font';
import { Platform } from 'react-native';
import { getFontScale } from '@/utils/deviceInfo';

export interface FontWeights {
  light: string;
  regular: string;
  medium: string;
  semiBold: string;
  bold: string;
}

export interface FontSizes {
  xs: number;
  sm: number;
  base: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
  '4xl': number;
  '5xl': number;
}

// Font families
export const fontFamilies = {
  ios: {
    light: 'System',
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },
  android: {
    light: 'sans-serif-light',
    regular: 'sans-serif',
    medium: 'sans-serif-medium',
    semiBold: 'sans-serif-medium',
    bold: 'sans-serif-black',
  },
  web: {
    light: 'system-ui',
    regular: 'system-ui',
    medium: 'system-ui',
    semiBold: 'system-ui',
    bold: 'system-ui',
  },
};

// Get platform-specific font weights
export const getFontWeights = (): FontWeights => {
  if (Platform.OS === 'ios') {
    return {
      light: '300',
      regular: '400',
      medium: '500',
      semiBold: '600',
      bold: '700',
    };
  }
  
  return fontFamilies[Platform.OS as keyof typeof fontFamilies] || fontFamilies.android;
};

// Base font sizes (scaled for device)
const baseFontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

// Get scaled font sizes
export const getFontSizes = (): FontSizes => {
  const scale = getFontScale();
  const scaledSizes: FontSizes = {} as FontSizes;
  
  Object.entries(baseFontSizes).forEach(([key, value]) => {
    scaledSizes[key as keyof FontSizes] = Math.round(value * scale);
  });
  
  return scaledSizes;
};

// Typography styles
export const typography = {
  h1: {
    fontSize: getFontSizes()['5xl'],
    fontWeight: getFontWeights().bold,
    lineHeight: getFontSizes()['5xl'] * 1.2,
  },
  h2: {
    fontSize: getFontSizes()['4xl'],
    fontWeight: getFontWeights().bold,
    lineHeight: getFontSizes()['4xl'] * 1.2,
  },
  h3: {
    fontSize: getFontSizes()['3xl'],
    fontWeight: getFontWeights().semiBold,
    lineHeight: getFontSizes()['3xl'] * 1.3,
  },
  h4: {
    fontSize: getFontSizes()['2xl'],
    fontWeight: getFontWeights().semiBold,
    lineHeight: getFontSizes()['2xl'] * 1.3,
  },
  h5: {
    fontSize: getFontSizes().xl,
    fontWeight: getFontWeights().medium,
    lineHeight: getFontSizes().xl * 1.4,
  },
  h6: {
    fontSize: getFontSizes().lg,
    fontWeight: getFontWeights().medium,
    lineHeight: getFontSizes().lg * 1.4,
  },
  body: {
    fontSize: getFontSizes().base,
    fontWeight: getFontWeights().regular,
    lineHeight: getFontSizes().base * 1.5,
  },
  bodySmall: {
    fontSize: getFontSizes().sm,
    fontWeight: getFontWeights().regular,
    lineHeight: getFontSizes().sm * 1.5,
  },
  caption: {
    fontSize: getFontSizes().xs,
    fontWeight: getFontWeights().regular,
    lineHeight: getFontSizes().xs * 1.4,
  },
  button: {
    fontSize: getFontSizes().base,
    fontWeight: getFontWeights().medium,
    lineHeight: getFontSizes().base * 1.2,
  },
};

// Font loading function
export const loadFonts = async (): Promise<void> => {
  // Using system fonts for all platforms
  // Custom fonts can be added later by placing font files in assets/fonts/
  // and updating the font loading logic here
  
  // For now, we use system fonts which don't require loading
  return Promise.resolve();
};