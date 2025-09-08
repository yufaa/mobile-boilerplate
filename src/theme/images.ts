import { Image } from 'react-native';

// Image assets interface
export interface ImageAssets {
  logo: any;
  logoLight: any;
  logoDark: any;
  placeholder: any;
  avatar: any;
  onboarding1: any;
  onboarding2: any;
  onboarding3: any;
  googleIcon: any;
  appleIcon: any;
}

// Image assets object
export const images: ImageAssets = {
  logo: require('../../assets/images/logo.png'),
  logoLight: require('../../assets/images/logo-light.png'),
  logoDark: require('../../assets/images/logo-dark.png'),
  placeholder: require('../../assets/images/placeholder.png'),
  avatar: require('../../assets/images/avatar-placeholder.png'),
  onboarding1: require('../../assets/images/onboarding-1.png'),
  onboarding2: require('../../assets/images/onboarding-2.png'),
  onboarding3: require('../../assets/images/onboarding-3.png'),
  googleIcon: require('../../assets/images/google-icon.png'),
  appleIcon: require('../../assets/images/apple-icon.png'),
};

// Image preloading function
export const loadImages = async (): Promise<void> => {
  const imageAssets = Object.values(images);
  
  const cacheImages = imageAssets.map((image) => {
    return Image.prefetch(Image.resolveAssetSource(image).uri);
  });
  
  await Promise.all(cacheImages);
};

// Helper function to get theme-specific logo
export const getLogo = (isDark: boolean) => {
  return isDark ? images.logoDark : images.logoLight;
};

// Image dimensions (for consistent sizing)
export const imageDimensions = {
  logo: { width: 120, height: 40 },
  avatar: { width: 80, height: 80 },
  onboarding: { width: 300, height: 200 },
  icon: { width: 24, height: 24 },
  iconLarge: { width: 32, height: 32 },
};

// Common image styles
export const imageStyles = {
  logo: {
    width: imageDimensions.logo.width,
    height: imageDimensions.logo.height,
    resizeMode: 'contain' as const,
  },
  avatar: {
    width: imageDimensions.avatar.width,
    height: imageDimensions.avatar.height,
    borderRadius: imageDimensions.avatar.width / 2,
    resizeMode: 'cover' as const,
  },
  onboarding: {
    width: imageDimensions.onboarding.width,
    height: imageDimensions.onboarding.height,
    resizeMode: 'contain' as const,
  },
  icon: {
    width: imageDimensions.icon.width,
    height: imageDimensions.icon.height,
    resizeMode: 'contain' as const,
  },
  iconLarge: {
    width: imageDimensions.iconLarge.width,
    height: imageDimensions.iconLarge.height,
    resizeMode: 'contain' as const,
  },
};