import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '@/theme';
import { useColorScheme } from '@/hooks';

export interface LoadingProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  overlay?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Loading({
  size = 'large',
  color,
  text,
  overlay = false,
  style,
  textStyle,
}: LoadingProps) {
  const { isDark } = useColorScheme();
  const themeColors = colors(isDark);

  const indicatorColor = color || themeColors.primary;

  const containerStyle: ViewStyle = overlay
    ? {
        ...styles.overlay,
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.9)',
      }
    : styles.container;

  return (
    <View style={[containerStyle, style]}>
      <ActivityIndicator
        size={size}
        color={indicatorColor}
        accessibilityLabel="Loading"
      />
      {text && (
        <Text
          style={[
            styles.text,
            { color: themeColors.text },
            textStyle,
          ]}
        >
          {text}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});