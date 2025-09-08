import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme';
import { useColorScheme } from '@/hooks';
import { Loading } from '@/components/elements';

export interface ScreenLayoutProps {
  children: React.ReactNode;
  scrollable?: boolean;
  loading?: boolean;
  loadingText?: string;
  backgroundColor?: string;
  statusBarStyle?: 'auto' | 'inverted' | 'light' | 'dark';
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  padding?: 'none' | 'small' | 'medium' | 'large';
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

export default function ScreenLayout({
  children,
  scrollable = false,
  loading = false,
  loadingText,
  backgroundColor,
  statusBarStyle = 'auto',
  edges = ['top', 'bottom'],
  padding = 'medium',
  style,
  contentContainerStyle,
}: ScreenLayoutProps) {
  const { isDark } = useColorScheme();
  const themeColors = colors(isDark);

  const bgColor = backgroundColor || themeColors.background;

  const getStatusBarStyle = () => {
    if (statusBarStyle === 'auto') {
      return isDark ? 'light-content' : 'dark-content';
    }
    if (statusBarStyle === 'inverted') {
      return isDark ? 'dark-content' : 'light-content';
    }
    return `${statusBarStyle}-content` as any;
  };

  const getPaddingStyle = (): ViewStyle => {
    switch (padding) {
      case 'none':
        return {};
      case 'small':
        return { padding: 8 };
      case 'large':
        return { padding: 24 };
      default:
        return { padding: 16 };
    }
  };

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: bgColor,
    ...getPaddingStyle(),
  };

  const content = (
    <>
      {loading && (
        <Loading
          overlay
          text={loadingText}
          style={styles.loadingOverlay}
        />
      )}
      {children}
    </>
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: bgColor }]}
      edges={edges}
    >
      <StatusBar
        barStyle={getStatusBarStyle()}
        backgroundColor={Platform.OS === 'android' ? bgColor : undefined}
        translucent={Platform.OS === 'android'}
      />
      
      {scrollable ? (
        <ScrollView
          style={[containerStyle, style]}
          contentContainerStyle={[
            styles.scrollContent,
            contentContainerStyle,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {content}
        </ScrollView>
      ) : (
        <View style={[containerStyle, style]}>
          {content}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingOverlay: {
    zIndex: 1000,
  },
});