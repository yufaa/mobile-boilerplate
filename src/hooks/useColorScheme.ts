import { useColorScheme as useNativeColorScheme } from 'react-native';
import { useState, useEffect } from 'react';
import { useDataPersist } from './useDataPersist';

type ColorScheme = 'light' | 'dark' | 'auto';

interface UseColorSchemeReturn {
  colorScheme: 'light' | 'dark';
  isDark: boolean;
  isLight: boolean;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleColorScheme: () => void;
  userPreference: ColorScheme;
}

const COLOR_SCHEME_KEY = 'user_color_scheme';

function useColorScheme(): UseColorSchemeReturn {
  const systemColorScheme = useNativeColorScheme();
  const { data: userPreference, setData: setUserPreference } = useDataPersist<ColorScheme>(
    COLOR_SCHEME_KEY,
    'auto'
  );
  
  const [colorScheme, setColorSchemeState] = useState<'light' | 'dark'>(() => {
    if (userPreference === 'auto') {
      return systemColorScheme || 'light';
    }
    return userPreference;
  });

  useEffect(() => {
    if (userPreference === 'auto') {
      setColorSchemeState(systemColorScheme || 'light');
    } else {
      setColorSchemeState(userPreference);
    }
  }, [userPreference, systemColorScheme]);

  const setColorScheme = (scheme: ColorScheme) => {
    setUserPreference(scheme);
    if (scheme === 'auto') {
      setColorSchemeState(systemColorScheme || 'light');
    } else {
      setColorSchemeState(scheme);
    }
  };

  const toggleColorScheme = () => {
    const newScheme = colorScheme === 'light' ? 'dark' : 'light';
    setColorScheme(newScheme);
  };

  return {
    colorScheme,
    isDark: colorScheme === 'dark',
    isLight: colorScheme === 'light',
    setColorScheme,
    toggleColorScheme,
    userPreference,
  };
}

export default useColorScheme;