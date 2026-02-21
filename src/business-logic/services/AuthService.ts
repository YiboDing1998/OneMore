/**
 * Authentication service.
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

  async register(email: string, password: string, name: string): Promise<User> {
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

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout', {});
    } catch (error) {
      logger.warn('Logout API error (non-blocking)', error);
    } finally {
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

  async initAuth(): Promise<boolean> {
    try {
      this.authState.isLoading = true;
      this.authState.error = null;

      const token = await storageManager.getItem(config.storage.authTokenKey);
      if (!token) return false;

      apiClient.setAuthToken(token);

      const response = await apiClient.get<ApiResponse<{ user: User }>>('/auth/me');
      if (!response.success || !response.data) {
        throw new Error('Session expired');
      }

      const { user } = response.data;
      await storageManager.setObject(config.storage.userKey, user);

      this.authState.user = user;
      this.authState.isAuthenticated = true;

      logger.info('Auth restored from backend session', user.email);
      return true;
    } catch (error) {
      apiClient.clearAuthToken();
      await storageManager.removeItem(config.storage.authTokenKey);
      await storageManager.removeItem(config.storage.userKey);

      this.authState.user = null;
      this.authState.isAuthenticated = false;
      this.authState.error = null;

      logger.warn('Auth init failed, local session cleared', error);
      return false;
    } finally {
      this.authState.isLoading = false;
    }
  }

  getAuthState(): Readonly<AuthState> {
    return { ...this.authState };
  }

  isAuthenticated(): boolean {
    return this.authState.isAuthenticated;
  }

  getCurrentUser(): User | null {
    return this.authState.user || null;
  }
}

export const authService = new AuthService();
