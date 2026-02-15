/**
 * 用户数据仓库 - 数据访问层
 * 整合 API 和存储，提供统一的数据接口
 */

import { apiClient } from '../api/client';
import { storageManager } from '../storage/storage';
import { User, ApiResponse } from '../../core/types';
import { CACHE_KEYS } from '../../core/constants';

export class UserRepository {
  /**
   * 获取用户信息
   */
  async getUserProfile(userId: string): Promise<User> {
    // 首先尝试从缓存获取
    const cached = await storageManager.getCacheItem<User>(
      CACHE_KEYS.USER_PROFILE
    );

    if (cached) {
      return cached;
    }

    // 从 API 获取
    const response = await apiClient.get<ApiResponse<User>>(
      `/users/${userId}`
    );

    if (!response.success || !response.data) {
      throw new Error('Failed to fetch user profile');
    }

    // 缓存结果
    await storageManager.setCacheItem(CACHE_KEYS.USER_PROFILE, response.data);

    return response.data;
  }

  /**
   * 更新用户信息
   */
  async updateUserProfile(userId: string, data: Partial<User>): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>(
      `/users/${userId}`,
      data
    );

    if (!response.success || !response.data) {
      throw new Error('Failed to update user profile');
    }

    // 更新缓存
    await storageManager.setCacheItem(CACHE_KEYS.USER_PROFILE, response.data);

    return response.data;
  }

  /**
   * 从本地存储加载用户信息
   */
  async loadLocalUser(): Promise<User | null> {
    return storageManager.getObject<User>('current_user');
  }

  /**
   * 保存用户信息到本地存储
   */
  async saveLocalUser(user: User): Promise<void> {
    await storageManager.setObject('current_user', user);
  }

  /**
   * 清除用户信息
   */
  async clearUser(): Promise<void> {
    await storageManager.removeItem(CACHE_KEYS.USER_PROFILE);
    await storageManager.removeItem('current_user');
  }
}

// 导出单例
export const userRepository = new UserRepository();
