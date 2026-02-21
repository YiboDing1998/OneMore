/**
 * 全局常量
 */

// HTTP 状态码
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// 错误码
export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

// 事件名称
export const EVENTS = {
  // Auth
  LOGIN_SUCCESS: 'auth:login_success',
  LOGOUT: 'auth:logout',
  SESSION_EXPIRED: 'auth:session_expired',

  // Training
  WORKOUT_STARTED: 'training:workout_started',
  WORKOUT_COMPLETED: 'training:workout_completed',
  WORKOUT_SAVED: 'training:workout_saved',

  // General
  APP_FOREGROUND: 'app:foreground',
  APP_BACKGROUND: 'app:background',
} as const;

// 缓存键
export const CACHE_KEYS = {
  USER_PROFILE: 'user_profile',
  WORKOUTS_LIST: 'workouts_list',
  WORKOUT_HISTORY: 'workout_history',
  USER_STATS: 'user_stats',
} as const;

// 路由名称
export const ROUTES = {
  // Auth
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',

  // Main
  HOME: 'Home',
  TRAINING: 'Training',
  COMMUNITY: 'Community',
  PROFILE: 'Profile',
  AI_COACH: 'AICoach',

  // Details
  WORKOUT_DETAIL: 'WorkoutDetail',
  WORKOUT_EXECUTE: 'WorkoutExecute',
  WORKOUT_COMPLETE: 'WorkoutComplete',
} as const;

// 难度级别
export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const;

// 分页大小
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

// 时间相关
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
} as const;
