/**
 * 存储配置 - 业务逻辑层
 * 使用 Zustand 进行状态管理（轻量级、易于学习）
 */

import { create } from 'zustand';
import { AuthState, User } from '../../core/types';
import { authService } from '../services/AuthService';

interface AppStore extends AuthState {
  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
}

/**
 * 应用全局 Store
 */
export const useAppStore = create<AppStore>((set) => ({
  // 初始状态
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Auth 操作
  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const user = await authService.login(email, password);
      set({ user, isAuthenticated: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (email: string, password: string, name: string) => {
    try {
      set({ isLoading: true, error: null });
      const user = await authService.register(email, password, name);
      set({ user, isAuthenticated: true });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Registration failed';
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      await authService.logout();
      set({ user: null, isAuthenticated: false, error: null });
    } finally {
      set({ isLoading: false });
    }
  },

  initAuth: async () => {
    try {
      set({ isLoading: true });
      const restored = await authService.initAuth();

      if (restored) {
        const state = authService.getAuthState();
        set({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  setUser: (user: User | null) => set({ user }),
  setError: (error: string | null) => set({ error }),
}));
