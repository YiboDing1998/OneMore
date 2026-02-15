/**
 * 认证服务 - 业务逻辑层
 * 处理所有与认证相关的业务逻辑
 */

import { apiClient } from '../../data/api/client';
import { storageManager } from '../../data/storage/storage';
import { User, AuthState, ApiResponse } from '../../core/types';
import { config } from '../../core/config/environment';
import { logger } from '../../core/utils/logger';

export class AuthService {
  private authState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };

  /**
   * 登录
   */
  async login(email: string, password: string): Promise<User> {
    try {
      this.authState.isLoading = true;
      this.authState.error = null;

      const response = await apiClient.post<
        ApiResponse<{ user: User; token: string }>
      >('/auth/login', { email, password });

      if (!response.success || !response.data) {
        throw new Error('Login failed');
      }

      const { user, token } = response.data;

      // 保存认证令牌
      apiClient.setAuthToken(token);
      await storageManager.setItem(config.storage.authTokenKey, token);
      await storageManager.setObject(config.storage.userKey, user);

      this.authState.user = user;
      this.authState.isAuthenticated = true;

      logger.info('User logged in', user.email);
      return user;
    } catch (error) {
      this.authState.error =
        error instanceof Error ? error.message : 'Unknown error';
      logger.error('Login error', error);
      throw error;
    } finally {
      this.authState.isLoading = false;
    }
  }

  /**
   * 注册
   */
  async register(
    email: string,
    password: string,
    name: string
  ): Promise<User> {
    try {
      this.authState.isLoading = true;
      this.authState.error = null;

      const response = await apiClient.post<
        ApiResponse<{ user: User; token: string }>
      >('/auth/register', { email, password, name });

      if (!response.success || !response.data) {
        throw new Error('Registration failed');
      }

      const { user, token } = response.data;

      // 自动登录
      apiClient.setAuthToken(token);
      await storageManager.setItem(config.storage.authTokenKey, token);
      await storageManager.setObject(config.storage.userKey, user);

      this.authState.user = user;
      this.authState.isAuthenticated = true;

      logger.info('User registered', user.email);
      return user;
    } catch (error) {
      this.authState.error =
        error instanceof Error ? error.message : 'Unknown error';
      logger.error('Register error', error);
      throw error;
    } finally {
      this.authState.isLoading = false;
    }
  }

  /**
   * 登出
   */
  async logout(): Promise<void> {
    try {
      // 可选：通知服务器登出
      await apiClient.post('/auth/logout', {});
    } catch (error) {
      logger.warn('Logout API error (non-blocking)', error);
    } finally {
      // 清除本地数据
      apiClient.clearAuthToken();
      await storageManager.removeItem(config.storage.authTokenKey);
      await storageManager.removeItem(config.storage.userKey);

      this.authState = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

      logger.info('User logged out');
    }
  }

  /**
   * 初始化认证（从存储恢复）
   */
  async initAuth(): Promise<boolean> {
    try {
      this.authState.isLoading = true;

      const token = await storageManager.getItem(config.storage.authTokenKey);
      const user = await storageManager.getObject<User>(config.storage.userKey);

      if (token && user) {
        apiClient.setAuthToken(token);
        this.authState.user = user;
        this.authState.isAuthenticated = true;
        logger.info('Auth restored from storage');
        return true;
      }

      return false;
    } catch (error) {
      logger.error('Auth init error', error);
      return false;
    } finally {
      this.authState.isLoading = false;
    }
  }

  /**
   * 获取认证状态
   */
  getAuthState(): Readonly<AuthState> {
    return { ...this.authState };
  }

  /**
   * 是否已认证
   */
  isAuthenticated(): boolean {
    return this.authState.isAuthenticated;
  }

  /**
   * 获取当前用户
   */
  getCurrentUser(): User | null {
    return this.authState.user || null;
  }
}

// 导出单例
export const authService = new AuthService();
