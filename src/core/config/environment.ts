/**
 * Runtime environment configuration.
 */

import Constants from 'expo-constants';
import { Platform } from 'react-native';

function getDevApiBaseUrl() {
  const envBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (envBaseUrl) return envBaseUrl;

  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest2?.extra?.expoClient?.hostUri ||
    (Constants as any).manifest?.debuggerHost;

  if (!hostUri) {
    const fallbackHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
    return `http://${fallbackHost}:3001/api`;
  }

  const host = String(hostUri).split(':')[0];
  const normalizedHost =
    Platform.OS === 'android' && host === 'localhost' ? '10.0.2.2' : host;

  return `http://${normalizedHost}:3001/api`;
}

export const config = {
  api: {
    baseUrl: __DEV__ ? getDevApiBaseUrl() : 'https://api.fitnessapp.com/api',
    timeout: 30000,
    retryAttempts: 3,
  },

  storage: {
    namespace: 'fitness_app_',
    authTokenKey: 'auth_token',
    userKey: 'user_data',
    cacheExpiry: 3600000,
  },

  logging: {
    enabled: __DEV__,
    level: __DEV__ ? 'debug' : 'error',
  },

  features: {
    offlineMode: true,
    analytics: !__DEV__,
    crashReporting: !__DEV__,
  },
};

export default config;
