/**
 * Hook 单元测试示例
 */

import { renderHook, act } from '@testing-library/react-native';
import { useUser } from '@business-logic/hooks';
import { createMockUser } from '../setup';

// Mock 数据访问层
jest.mock('@data/repositories/UserRepository', () => ({
  userRepository: {
    getUserProfile: jest.fn(),
  },
}));

describe('useUser Hook', () => {
  it('应该初始化为空状态', () => {
    const { result } = renderHook(() => useUser());
    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('应该能获取用户信息', async () => {
    const mockUser = createMockUser();
    
    const { result } = renderHook(() => useUser('1'));

    await act(async () => {
      // 等待 hook 加载
    });

    // 验证：应该成功获取用户
    expect(result.current.user).toEqual(mockUser);
  });

  it('应该处理错误', async () => {
    const { result } = renderHook(() => useUser('invalid-id'));

    // 等待并验证错误在得到处理
  });
});
