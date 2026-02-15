/**
 * 环境配置和常量
 */

// 注: 根据运行环境确定配置
// const ENV = process.env.NODE_ENV || 'development';

export const config = {
  // API 配置
  api: {
    baseUrl: __DEV__
      ? 'http://localhost:3000/api'
      : 'https://api.fitnessapp.com/api',
    timeout: 30000,
    retryAttempts: 3,
  },

  // 存储配置
  storage: {
    namespace: 'fitness_app_',
    authTokenKey: 'auth_token',
    userKey: 'user_data',
    cacheExpiry: 3600000, // 1 小时
  },

  // 日志配置
  logging: {
    enabled: __DEV__,
    level: __DEV__ ? 'debug' : 'error',
  },

  // 功能开关
  features: {
    offlineMode: true,
    analytics: !__DEV__,
    crashReporting: !__DEV__,
  },
};

export default config;
