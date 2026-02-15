/**
 * 全局类型定义
 * 包含所有跨层级使用的常用类型
 */

// ==================== 用户相关 ====================
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ==================== 训练相关 ====================
export interface Workout {
  id: string;
  name: string;
  description: string;
  duration: number; // 分钟
  exercises: Exercise[];
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
  updatedAt: Date;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  notes?: string;
}

export interface WorkoutRecord {
  id: string;
  workoutId: string;
  userId: string;
  completedAt: Date;
  duration: number;
  calories?: number;
  notes?: string;
}

// ==================== API 响应 ====================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ==================== 存储相关 ====================
export interface StorageProvider {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

// ==================== 错误 ====================
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// ==================== 其他 ====================
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // 毫秒
}
