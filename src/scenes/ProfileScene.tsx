import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Switch,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenLayout, Button, Input, Card } from '@/components';
import { colors } from '@/theme';
import { useColorScheme } from '@/hooks';
import { useAppDispatch, useAppSelector } from '@/slices';
import { setLoading, setUser, setError, signOut as signOutAction } from '@/slices/authSlice';
import { setTheme, setNotificationSettings } from '@/slices/appSlice';
import { supabaseService } from '@/services';

export default function ProfileScene() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nameError, setNameError] = useState('');

  const { isDark, toggleColorScheme } = useColorScheme();
  const themeColors = colors(isDark);
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);
  const { theme, notificationSettings } = useAppSelector((state) => state.app);

  React.useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      setNameError('Name is required');
      return;
    }

    if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      return;
    }

    dispatch(setLoading(true));
    setNameError('');

    try {
      // Update user profile in Supabase
      const { error } = await supabaseService.getClient().auth.updateUser({
        data: { full_name: name.trim() }
      });

      if (error) {
        dispatch(setError(error.message));
      } else {
        // Update local user state
        if (user) {
          dispatch(setUser({ ...user, name: name.trim() }));
        }
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully');
      }
    } catch (err) {
      dispatch(setError('Failed to update profile'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            dispatch(setLoading(true));
            try {
              await supabaseService.signOut();
              dispatch(signOutAction());
              router.replace('/auth/login');
            } catch (err) {
              dispatch(setError('Failed to sign out'));
            } finally {
              dispatch(setLoading(false));
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure you want to delete your account?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Contact Support',
              'Please contact our support team to delete your account.',
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };

  const toggleNotifications = (type: keyof typeof notificationSettings) => {
    dispatch(setNotificationSettings({
      ...notificationSettings,
      [type]: !notificationSettings[type],
    }));
  };

  if (!user) {
    return (
      <ScreenLayout>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: themeColors.error }]}>
            User not found. Please sign in again.
          </Text>
          <Button
            title="Sign In"
            onPress={() => router.replace('/auth/login')}
            style={styles.errorButton}
          />
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout
      scrollable
      loading={loading}
      loadingText="Updating profile..."
    >
      <View style={styles.container}>
        {/* Profile Header */}
        <Card variant="elevated" padding="large" style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {user.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: themeColors.primary }]}>
                  <Text style={[styles.avatarText, { color: themeColors.white }]}>
                    {user.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={[styles.userName, { color: themeColors.text }]}>
                {user.name}
              </Text>
              <Text style={[styles.userEmail, { color: themeColors.textSecondary }]}>
                {user.email}
              </Text>
              <View style={styles.providerBadge}>
                <Text style={[styles.providerText, { color: themeColors.primary }]}>
                  {user.provider === 'google' ? 'Google Account' : 'Email Account'}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Edit Profile */}
        <Card variant="elevated" padding="large" style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Profile Information
            </Text>
            <Button
              title={isEditing ? 'Cancel' : 'Edit'}
              variant="ghost"
              size="small"
              onPress={() => {
                setIsEditing(!isEditing);
                if (isEditing) {
                  setName(user.name);
                  setNameError('');
                }
              }}
            />
          </View>

          {isEditing ? (
            <>
              <Input
                label="Full Name"
                value={name}
                onChangeText={(value) => {
                  setName(value);
                  setNameError('');
                }}
                error={nameError}
                placeholder="Enter your full name"
              />
              
              <Input
                label="Email"
                value={email}
                editable={false}
                style={styles.disabledInput}
                hint="Email cannot be changed"
              />

              <View style={styles.editActions}>
                <Button
                  title="Save Changes"
                  onPress={handleSaveProfile}
                  style={styles.saveButton}
                />
              </View>
            </>
          ) : (
            <>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>
                  Full Name
                </Text>
                <Text style={[styles.infoValue, { color: themeColors.text }]}>
                  {user.name}
                </Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>
                  Email
                </Text>
                <Text style={[styles.infoValue, { color: themeColors.text }]}>
                  {user.email}
                </Text>
              </View>
            </>
          )}
        </Card>

        {/* App Settings */}
        <Card variant="elevated" padding="large" style={styles.sectionCard}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            App Settings
          </Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons
                name={isDark ? 'moon' : 'sunny'}
                size={20}
                color={themeColors.primary}
                style={styles.settingIcon}
              />
              <Text style={[styles.settingLabel, { color: themeColors.text }]}>
                Dark Mode
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleColorScheme}
              trackColor={{ false: themeColors.border, true: themeColors.primary }}
              thumbColor={themeColors.white}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons
                name="notifications"
                size={20}
                color={themeColors.primary}
                style={styles.settingIcon}
              />
              <Text style={[styles.settingLabel, { color: themeColors.text }]}>
                Push Notifications
              </Text>
            </View>
            <Switch
              value={notificationSettings.push}
              onValueChange={() => toggleNotifications('push')}
              trackColor={{ false: themeColors.border, true: themeColors.primary }}
              thumbColor={themeColors.white}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons
                name="mail"
                size={20}
                color={themeColors.primary}
                style={styles.settingIcon}
              />
              <Text style={[styles.settingLabel, { color: themeColors.text }]}>
                Email Notifications
              </Text>
            </View>
            <Switch
              value={notificationSettings.email}
              onValueChange={() => toggleNotifications('email')}
              trackColor={{ false: themeColors.border, true: themeColors.primary }}
              thumbColor={themeColors.white}
            />
          </View>
        </Card>

        {/* Account Actions */}
        <Card variant="elevated" padding="large" style={styles.sectionCard}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Account
          </Text>

          <Button
            title="Sign Out"
            variant="outline"
            onPress={handleSignOut}
            fullWidth
            style={styles.actionButton}
          />

          <Button
            title="Delete Account"
            variant="danger"
            onPress={handleDeleteAccount}
            fullWidth
            style={styles.actionButton}
          />
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
  profileCard: {
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 8,
  },
  providerBadge: {
    alignSelf: 'flex-start',
  },
  providerText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionCard: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoRow: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
  },
  disabledInput: {
    opacity: 0.6,
  },
  editActions: {
    marginTop: 8,
  },
  saveButton: {
    alignSelf: 'flex-start',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  actionButton: {
    marginBottom: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  errorButton: {
    minWidth: 120,
  },
});