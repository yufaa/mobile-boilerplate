import Constants from 'expo-constants';

interface Config {
  env: 'development' | 'staging' | 'production';
  apiUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  googleClientId: string;
  appName: string;
  version: string;
}

const getConfig = (): Config => {
  const env = Constants.expoConfig?.extra?.env || 'development';
  
  const baseConfig = {
    appName: Constants.expoConfig?.name || 'Expo Boilerplate',
    version: Constants.expoConfig?.version || '1.0.0',
    env: env as Config['env'],
  };

  switch (env) {
    case 'production':
      return {
        ...baseConfig,
        apiUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.yourapp.com',
        supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
        supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
        googleClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '',
      };
    case 'staging':
      return {
        ...baseConfig,
        apiUrl: process.env.EXPO_PUBLIC_API_URL || 'https://staging-api.yourapp.com',
        supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
        supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
        googleClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '',
      };
    default:
      return {
        ...baseConfig,
        apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
        supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
        supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
        googleClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '',
      };
  }
};

const config = getConfig();

export { getConfig };
export default config;