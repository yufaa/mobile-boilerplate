import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { colors } from '@/theme';
import { useColorScheme } from '@/hooks';

export interface CardProps extends Omit<TouchableOpacityProps, 'style'> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
  margin?: 'none' | 'small' | 'medium' | 'large';
  borderRadius?: 'none' | 'small' | 'medium' | 'large';
  pressable?: boolean;
  style?: ViewStyle;
}

export default function Card({
  children,
  variant = 'default',
  padding = 'medium',
  margin = 'none',
  borderRadius = 'medium',
  pressable = false,
  style,
  onPress,
  ...props
}: CardProps) {
  const { isDark } = useColorScheme();
  const themeColors = colors(isDark);

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.base,
      ...styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}` as keyof typeof styles],
      ...styles[`margin${margin.charAt(0).toUpperCase() + margin.slice(1)}` as keyof typeof styles],
      ...styles[`radius${borderRadius.charAt(0).toUpperCase() + borderRadius.slice(1)}` as keyof typeof styles],
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          backgroundColor: themeColors.surface,
          shadowColor: themeColors.shadow,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        };
      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: themeColors.background,
          borderWidth: 1,
          borderColor: themeColors.border,
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: themeColors.surface,
        };
    }
  };

  if (pressable && onPress) {
    return (
      <TouchableOpacity
        style={[getCardStyle(), style]}
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[getCardStyle(), style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
  // Padding styles
  paddingNone: {
    padding: 0,
  },
  paddingSmall: {
    padding: 8,
  },
  paddingMedium: {
    padding: 16,
  },
  paddingLarge: {
    padding: 24,
  },
  // Margin styles
  marginNone: {
    margin: 0,
  },
  marginSmall: {
    margin: 8,
  },
  marginMedium: {
    margin: 16,
  },
  marginLarge: {
    margin: 24,
  },
  // Border radius styles
  radiusNone: {
    borderRadius: 0,
  },
  radiusSmall: {
    borderRadius: 4,
  },
  radiusMedium: {
    borderRadius: 8,
  },
  radiusLarge: {
    borderRadius: 16,
  },
});