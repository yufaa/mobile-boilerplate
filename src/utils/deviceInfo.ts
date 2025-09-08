import { Dimensions, Platform } from 'react-native';
import Constants from 'expo-constants';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

// Platform detection
export const isIos = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isWeb = Platform.OS === 'web';

// Screen dimensions
export { windowWidth, windowHeight, screenWidth, screenHeight };

// Device info
export const deviceInfo = {
  platform: Platform.OS,
  version: Platform.Version,
  isTablet: windowWidth >= 768,
  isSmallScreen: windowWidth < 375,
  isLargeScreen: windowWidth >= 414,
  statusBarHeight: Constants.statusBarHeight,
  deviceName: Constants.deviceName,
  deviceYearClass: Constants.deviceYearClass,
};

// Safe area helpers
export const getSafeAreaInsets = () => {
  if (isIos) {
    return {
      top: Constants.statusBarHeight,
      bottom: windowHeight > 800 ? 34 : 0, // iPhone X and newer
      left: 0,
      right: 0,
    };
  }
  
  return {
    top: Constants.statusBarHeight,
    bottom: 0,
    left: 0,
    right: 0,
  };
};

// Responsive helpers
export const getResponsiveSize = (size: number) => {
  const baseWidth = 375; // iPhone 6/7/8 width
  return (windowWidth / baseWidth) * size;
};

export const isLandscape = () => windowWidth > windowHeight;
export const isPortrait = () => windowHeight > windowWidth;

// Typography scaling
export const getFontScale = () => {
  if (windowWidth < 350) return 0.9;
  if (windowWidth > 500) return 1.1;
  return 1;
};