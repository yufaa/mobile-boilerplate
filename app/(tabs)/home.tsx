import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { ScreenLayout, Card, Button } from '@/components';
import { colors } from '@/theme';
import { useColorScheme } from '@/hooks';
import { useAppSelector } from '@/slices';

export default function HomePage() {
  const { isDark } = useColorScheme();
  const themeColors = colors(isDark);
  const { user } = useAppSelector((state) => state.auth);
  const { theme } = useAppSelector((state) => state.app);

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <Card variant="elevated" padding="large" style={styles.welcomeCard}>
          <Text style={[styles.welcomeTitle, { color: themeColors.text }]}>
            Welcome back!
          </Text>
          <Text style={[styles.welcomeSubtitle, { color: themeColors.textSecondary }]}>
            Hello {user?.name || 'User'}, ready to get started?
          </Text>
        </Card>

        <Card variant="elevated" padding="large" style={styles.statsCard}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            App Status
          </Text>
          
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
              Theme:
            </Text>
            <Text style={[styles.statValue, { color: themeColors.text }]}>
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </Text>
          </View>

          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
              Authentication:
            </Text>
            <Text style={[styles.statValue, { color: themeColors.success }]}>
              ✓ Signed In
            </Text>
          </View>

          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
              Provider:
            </Text>
            <Text style={[styles.statValue, { color: themeColors.text }]}>
              {user?.provider === 'google' ? 'Google' : 'Email'}
            </Text>
          </View>
        </Card>

        <Card variant="elevated" padding="large" style={styles.actionsCard}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Quick Actions
          </Text>
          
          <Button
            title="View Profile"
            variant="outline"
            fullWidth
            style={styles.actionButton}
            onPress={() => {
              // Navigation will be handled by tab bar
            }}
          />

          <Button
            title="App Settings"
            variant="ghost"
            fullWidth
            style={styles.actionButton}
            onPress={() => {
              // Could navigate to settings page
            }}
          />
        </Card>

        <Card variant="outline" padding="large" style={styles.infoCard}>
          <Text style={[styles.infoTitle, { color: themeColors.primary }]}>
            🎉 Welcome to Your App!
          </Text>
          <Text style={[styles.infoText, { color: themeColors.textSecondary }]}>
            This is a React Native Expo boilerplate with authentication, 
            state management, and a beautiful UI system. Start building 
            your amazing app from here!
          </Text>
        </Card>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  welcomeCard: {
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
  },
  statsCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionsCard: {
    marginBottom: 16,
  },
  actionButton: {
    marginBottom: 8,
  },
  infoCard: {
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});