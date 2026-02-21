/**
 * 测试配置示例
 */

// 测试工具库导入
export { render, fireEvent, waitFor } from '@testing-library/react-native';
export { default as jest } from 'jest';

// 测试辅助函数
export const createMockUser = () => ({
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const createMockWorkout = () => ({
  id: '1',
  name: 'Push Ups',
  description: 'Upper body workout',
  duration: 30,
  difficulty: 'medium',
  exercises: [],
  createdAt: new Date(),
  updatedAt: new Date(),
});
