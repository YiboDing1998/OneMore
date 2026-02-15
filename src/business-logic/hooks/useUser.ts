/**
 * 用户 Hook - 业务逻辑层
 * 包含与用户相关的业务逻辑和状态管理
 */

import { useState, useCallback, useEffect } from 'react';
import { userRepository } from '../../data/repositories/UserRepository';
import { User, AppError } from '../../core/types';
import { logger } from '../../core/utils/logger';

export interface UseUserReturn {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  fetchUser: (userId: string) => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  clearUser: () => Promise<void>;
}

/**
 * 获取和管理用户信息
 */
export const useUser = (userId?: string): UseUserReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(
    async (id: string) => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);
        const userData = await userRepository.getUserProfile(id);
        setUser(userData);
      } catch (err) {
        const message =
          err instanceof AppError ? err.message : 'Failed to fetch user';
        setError(message);
        logger.error('fetchUser error', err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateUser = useCallback(async (data: Partial<User>) => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);
      const updated = await userRepository.updateUserProfile(user.id, data);
      setUser(updated);
    } catch (err) {
      const message =
        err instanceof AppError ? err.message : 'Failed to update user';
      setError(message);
      logger.error('updateUser error', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const clearUser = useCallback(async () => {
    try {
      await userRepository.clearUser();
      setUser(null);
      setError(null);
    } catch (err) {
      logger.error('clearUser error', err);
    }
  }, []);

  // 初始化加载
  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    }
  }, [userId, fetchUser]);

  return {
    user,
    isLoading,
    error,
    fetchUser,
    updateUser,
    clearUser,
  };
};
