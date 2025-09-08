import React, { useState, forwardRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getColors } from '@/theme';
import { useColorScheme } from '@/hooks';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  variant?: 'default' | 'filled' | 'outline';
  size?: 'small' | 'medium' | 'large';
  required?: boolean;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  hintStyle?: TextStyle;
}

const Input = forwardRef<TextInput, InputProps>((
  {
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    onRightIconPress,
    variant = 'outline',
    size = 'medium',
    required = false,
    disabled = false,
    containerStyle,
    inputStyle,
    labelStyle,
    errorStyle,
    hintStyle,
    value,
    onFocus,
    onBlur,
    secureTextEntry,
    ...props
  },
  ref
) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { isDark } = useColorScheme();
  const themeColors = getColors(isDark);

  const isPassword = secureTextEntry;
  const hasError = !!error;
  const hasValue = !!value;

  const handleFocus = (event: any) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: any) => {
    setIsFocused(false);
    onBlur?.(event);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.container,
    };

    return baseStyle;
  };

  const getInputContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.inputContainer,
      ...styles[size],
    };

    switch (variant) {
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: themeColors.surface,
          borderWidth: 0,
          borderBottomWidth: 2,
          borderBottomColor: hasError
            ? themeColors.error
            : isFocused
            ? themeColors.primary
            : themeColors.border,
          borderRadius: 8,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: disabled ? themeColors.textDisabled : themeColors.background,
          borderWidth: 1,
          borderColor: hasError
            ? themeColors.error
            : isFocused
            ? themeColors.primary
            : themeColors.border,
          borderRadius: 8,
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderBottomWidth: 1,
          borderBottomColor: hasError
            ? themeColors.error
            : isFocused
            ? themeColors.primary
            : themeColors.border,
        };
    }
  };

  const getInputStyle = (): TextStyle => {
    return {
      ...styles.input,
      ...styles[`${size}Text` as keyof typeof styles],
      color: disabled ? themeColors.textSecondary : themeColors.text,
    };
  };

  const getLabelStyle = (): TextStyle => {
    return {
      ...styles.label,
      color: hasError
        ? themeColors.error
        : isFocused
        ? themeColors.primary
        : themeColors.textSecondary,
    };
  };

  const getIconColor = () => {
    if (hasError) return themeColors.error;
    if (isFocused) return themeColors.primary;
    return themeColors.textSecondary;
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 24;
      default:
        return 20;
    }
  };

  return (
    <View style={[getContainerStyle(), containerStyle]}>
      {label && (
        <Text style={[getLabelStyle(), labelStyle]}>
          {label}
          {required && <Text style={{ color: themeColors.error }}> *</Text>}
        </Text>
      )}
      
      <View style={getInputContainerStyle()}>
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={getIconSize()}
            color={getIconColor()}
            style={styles.leftIcon}
          />
        )}
        
        <TextInput
          ref={ref}
          style={[getInputStyle(), inputStyle]}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={isPassword && !isPasswordVisible}
          editable={!disabled}
          placeholderTextColor={themeColors.textSecondary}
          selectionColor={themeColors.primary}
          {...props}
        />
        
        {isPassword && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.rightIcon}
            accessibilityRole="button"
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={getIconSize()}
              color={getIconColor()}
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !isPassword && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIcon}
            disabled={!onRightIconPress}
            accessibilityRole={onRightIconPress ? 'button' : 'none'}
          >
            <Ionicons
              name={rightIcon}
              size={getIconSize()}
              color={getIconColor()}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={[styles.error, { color: themeColors.error }, errorStyle]}>
          {error}
        </Text>
      )}
      
      {hint && !error && (
        <Text style={[styles.hint, { color: themeColors.textSecondary }, hintStyle]}>
          {hint}
        </Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';

export default Input;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  small: {
    minHeight: 36,
    paddingHorizontal: 8,
  },
  medium: {
    minHeight: 44,
    paddingHorizontal: 12,
  },
  large: {
    minHeight: 52,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontWeight: '400',
  },
  smallText: {
    fontSize: 14,
    lineHeight: 18,
  },
  mediumText: {
    fontSize: 16,
    lineHeight: 20,
  },
  largeText: {
    fontSize: 18,
    lineHeight: 22,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
    padding: 4,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '400',
  },
  hint: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '400',
  },
});