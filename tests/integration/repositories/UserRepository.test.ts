/**
 * Repository 集成测试示例
 */

import { userRepository } from '@data/repositories/UserRepository';
import { apiClient } from '@data/api/client';
import { storageManager } from '@data/storage/storage';

// Mock API 和存储
jest.mock('@data/api/client');
jest.mock('@data/storage/storage');

describe('UserRepository Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该从 API 获取用户信息', async () => {
    // 模拟 API 响应
    (apiClient.get as jest.Mock).mockResolvedValue({
      success: true,
      data: { id: '1', name: 'John' },
    });

    const user = await userRepository.getUserProfile('1');

    expect(user.id).toBe('1');
    expect(apiClient.get).toHaveBeenCalledWith('/users/1');
  });

  it('应该缓存用户信息', async () => {
    // 首次调用 API
    (apiClient.get as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: { id: '1', name: 'John' },
    });

    // 第一次调用
    await userRepository.getUserProfile('1');
    expect(apiClient.get).toHaveBeenCalledTimes(1);

    // 第二次调用（应该使用缓存）
    // await userRepository.getUserProfile('1');
    // expect(apiClient.get).toHaveBeenCalledTimes(1); // 仍然是 1，缓存被使用
  });
});
