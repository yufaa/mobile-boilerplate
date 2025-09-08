import { useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

interface UseDataPersistReturn<T> {
  data: T;
  setData: (value: T) => Promise<void>;
  removeData: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

// For web platform, use localStorage as fallback
const webStorage = {
  async getItemAsync(key: string): Promise<string | null> {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(key);
    }
    return null;
  },
  
  async setItemAsync(key: string, value: string): Promise<void> {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, value);
    }
  },
  
  async deleteItemAsync(key: string): Promise<void> {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(key);
    }
  },
};

const storage = Platform.OS === 'web' ? webStorage : SecureStore;

function useDataPersist<T>(
  key: string,
  defaultValue: T
): UseDataPersistReturn<T> {
  const [data, setDataState] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const storedValue = await storage.getItemAsync(key);
        
        if (storedValue !== null) {
          try {
            const parsedValue = JSON.parse(storedValue);
            setDataState(parsedValue);
          } catch (parseError) {
            // If parsing fails, treat as string
            setDataState(storedValue as T);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [key]);

  const setData = useCallback(
    async (value: T) => {
      try {
        setError(null);
        
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        await storage.setItemAsync(key, stringValue);
        
        setDataState(value);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to save data';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [key]
  );

  const removeData = useCallback(async () => {
    try {
      setError(null);
      
      await storage.deleteItemAsync(key);
      setDataState(defaultValue);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove data';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [key, defaultValue]);

  return {
    data,
    setData,
    removeData,
    loading,
    error,
  };
}

export { useDataPersist };