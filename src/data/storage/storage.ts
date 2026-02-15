/**
 * 本地存储管理 - 数据访问层
 * 使用 AsyncStorage（React Native）或 localStorage（Web）
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '../../core/config/environment';
import { logger } from '../../core/utils/logger';
import { StorageProvider, CacheEntry } from '../../core/types';

class StorageManager implements StorageProvider {
  private namespace: string;

  constructor() {
    this.namespace = config.storage.namespace;
  }

  /**
   * 获取存储项
   */
  async getItem(key: string): Promise<string | null> {
    try {
      const fullKey = this.getFullKey(key);
      const value = await AsyncStorage.getItem(fullKey);
      logger.debug(`Storage GET: ${key}`, value ? 'found' : 'not found');
      return value;
    } catch (error) {
      logger.error(`Storage GET error: ${key}`, error);
      return null;
    }
  }

  /**
   * 获取 JSON 对象
   */
  async getObject<T>(key: string): Promise<T | null> {
    try {
      const value = await this.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error(`Storage GET object error: ${key}`, error);
      return null;
    }
  }

  /**
   * 设置存储项
   */
  async setItem(key: string, value: string): Promise<void> {
    try {
      const fullKey = this.getFullKey(key);
      await AsyncStorage.setItem(fullKey, value);
      logger.debug(`Storage SET: ${key}`);
    } catch (error) {
      logger.error(`Storage SET error: ${key}`, error);
    }
  }

  /**
   * 设置 JSON 对象
   */
  async setObject<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await this.setItem(key, jsonValue);
    } catch (error) {
      logger.error(`Storage SET object error: ${key}`, error);
    }
  }

  /**
   * 删除存储项
   */
  async removeItem(key: string): Promise<void> {
    try {
      const fullKey = this.getFullKey(key);
      await AsyncStorage.removeItem(fullKey);
      logger.debug(`Storage REMOVE: ${key}`);
    } catch (error) {
      logger.error(`Storage REMOVE error: ${key}`, error);
    }
  }

  /**
   * 清除所有存储
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
      logger.debug('Storage CLEARED');
    } catch (error) {
      logger.error('Storage CLEAR error', error);
    }
  }

  /**
   * 获取缓存项（带过期时间检查）
   */
  async getCacheItem<T>(key: string): Promise<T | null> {
    try {
      const entry = await this.getObject<CacheEntry<T>>(key);

      if (!entry) return null;

      // 检查是否过期
      const isExpired = Date.now() - entry.timestamp > entry.ttl;

      if (isExpired) {
        await this.removeItem(key);
        return null;
      }

      return entry.data;
    } catch (error) {
      logger.error(`Storage GET cache error: ${key}`, error);
      return null;
    }
  }

  /**
   * 设置缓存项（带过期时间）
   */
  async setCacheItem<T>(key: string, data: T, ttl?: number): Promise<void> {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl: ttl || config.storage.cacheExpiry,
      };

      await this.setObject(key, entry);
    } catch (error) {
      logger.error(`Storage SET cache error: ${key}`, error);
    }
  }

  /**
   * 组织完整的键名
   */
  private getFullKey(key: string): string {
    return `${this.namespace}${key}`;
  }
}

// 导出单例
export const storageManager = new StorageManager();
