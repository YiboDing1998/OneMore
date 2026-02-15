/**
 * 完整的项目架构文档
 */

# 💪 健身应用 - 工业级架构设计

## 📋 目录
1. [架构概述](#架构概述)
2. [各层详述](#各层详述)
3. [模块设计](#模块设计)
4. [工作流程](#工作流程)
5. [团队协作](#团队协作)
6. [最佳实践](#最佳实践)

---

## 架构概述

采用 **多层分离架构**，分为四大层级，确保高内聚、低耦合：

```
┌─────────────────────────────────────────┐
│  Presentation Layer (表现层)            │  ← Screens, Components, Navigation
│  • 仅负责 UI 渲染和用户交互              │
│  • 不包含业务逻辑                        │
├─────────────────────────────────────────┤
│  Business Logic Layer (业务逻辑层)      │  ← Hooks, Services, Store
│  • 核心业务逻辑处理                      │
│  • 状态管理（Zustand）                   │
│  • 数据转换和验证                        │
├─────────────────────────────────────────┤
│  Data Layer (数据访问层)                │  ← API, Storage, Repositories
│  • 数据获取和缓存                        │
│  • 本地存储管理                          │
│  • 提供的统一数据接口                    │
├─────────────────────────────────────────┤
│  Core Services Layer (核心服务层)      │  ← Auth, Logger, Utils, Config
│  • 横切关注点（Authentication, Logging）│
│  • 常用工具函数                          │
│  • 全局配置和常量                        │
└─────────────────────────────────────────┘
```

---

## 各层详述

### 1️⃣ 表现层 (Presentation Layer)

**职责：**
- 渲染 UI 组件
- 捕获用户交互事件
- 将用户输入传递给业务逻辑层

**核心目录：**
```
src/presentation/
├── screens/              # 完整屏幕页面
│   ├── auth/            # 认证相关屏幕
│   ├── training/        # 训练相关屏幕
│   └── ...
├── components/          # 可复用 UI 组件
│   ├── common/          # 通用组件（按钮、输入框等）
│   └── layouts/         # 布局组件（头部、底部等）
└── navigation/          # 导航配置
```

**特点：**
- ✅ 无状态或仅 UI 状态
- ✅ 通过 Props 接收数据
- ✅ 通过 Callbacks 提交操作
- ✅ 易于测试（单元测试和 UI 测试）

**示例 - 屏幕组件：**
```typescript
// ✅ 正确做法
const HomeScreen = () => {
  const { user, logout } = useAppStore();  // 从 store 获取数据
  
  return (
    <View>
      <Text>{user.name}</Text>
      <Button onPress={logout} />
    </View>
  );
};

// ❌ 错误做法 - 不要在屏幕中进行 API 调用
const BadHomeScreen = () => {
  useEffect(() => {
    fetch('/api/user').then(...);  // ❌ 不应该在这里
  }, []);
};
```

---

### 2️⃣ 业务逻辑层 (Business Logic Layer)

**职责：**
- 实现核心业务逻辑
- 管理应用状态
- 协调数据访问层的操作

**核心目录：**
```
src/business-logic/
├── hooks/               # 自定义 React Hooks
│   ├── useUser.ts      # 用户相关 hook
│   └── useTraining.ts  # 训练相关 hook
├── store/              # 全局状态管理（Zustand）
│   └── appStore.ts     # 应用全局 store
├── services/           # 业务服务
│   ├── AuthService.ts  # 认证服务
│   └── TrainingService.ts
└── contexts/           # React Context（可选）
```

**Hooks vs Store：**

| 特性 | Hooks | Store |
|------|-------|-------|
| 作用域 | 组件级别 | 全局 |
| 复用性 | 低 | 高 |
| 性能 | 组件重新渲染 | 订阅优化 |
| 使用场景 | 组件私有数据 | 全局共享数据 |

**示例 - Hook：**
```typescript
// Custom Hook - 复用业务逻辑
export const useUser = (userId: string) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    userRepository.getUserProfile(userId)
      .then(setUser);
  }, [userId]);
  
  return { user, loading: ... };
};

// 在组件中使用
const MyComponent = () => {
  const { user } = useUser('123');
  return <Text>{user.name}</Text>;
};
```

**示例 - Store：**
```typescript
// Zustand Store - 全局状态管理
const useAppStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: async () => {
    await authService.logout();
    set({ user: null });
  },
}));

// 在任何组件中使用
const MyComponent = () => {
  const { user, logout } = useAppStore();
  return <Button onPress={logout} />;
};
```

---

### 3️⃣ 数据访问层 (Data Access Layer)

**职责：**
- 统一的数据获取接口
- 缓存管理
- 离线支持

**核心目录：**
```
src/data/
├── api/                 # API 客户端
│   └── client.ts       # 统一的 HTTP 客户端
├── storage/            # 本地存储
│   └── storage.ts      # AsyncStorage 封装
├── mappers/            # 数据映射（API ↔ 应用）
│   └── UserMapper.ts
└── repositories/       # 数据仓库
    ├── UserRepository.ts
    └── TrainingRepository.ts
```

**仓库模式 (Repository Pattern)：**
```typescript
// Repository 提供统一的数据接口
export class UserRepository {
  async getUserProfile(id: string): Promise<User> {
    // 1. 先尝试本地缓存
    const cached = await storageManager.getCache(key);
    if (cached) return cached;
    
    // 2. 调用 API
    const user = await apiClient.get(`/users/${id}`);
    
    // 3. 缓存结果
    await storageManager.setCache(key, user);
    
    return user;
  }
}

// 业务逻辑层只需调用 Repository
const user = await userRepository.getUserProfile(id);
```

**API 客户端特性：**
- 统一的请求/响应处理
- 自动重试逻辑
- 错误统一管理
- 授权令牌管理

---

### 4️⃣ 核心服务层 (Core Services Layer)

**职责：**
- 跨应用的核心功能
- 工具函数和常用方法
- 全局配置

**核心目录：**
```
src/core/
├── services/           # 核心服务
│   ├── auth/          # 认证管理
│   └── logger/        # 日志记录
├── utils/             # 工具函数
│   ├── validators.ts  # 验证工具
│   └── helpers.ts     # 辅助函数
├── constants/         # 全局常量
├── types/            # 全局类型定义
└── config/           # 环境配置
```

**日志系统：**
```typescript
import { logger } from '@core/utils';

logger.debug('调试信息', data);
logger.info('一般信息');
logger.warn('警告信息');
logger.error('错误信息', error);
```

**验证工具：**
```typescript
import { validators } from '@core/utils';

validators.isEmail(email);
validators.isStrongPassword(password);
validators.isPhoneNumber(phone);
```

---

## 模块设计

### 独立功能模块结构

每个主要功能都可以作为独立模块开发和测试：

```
src/modules/
├── training/           # 训练模块（独立的 feature）
│   ├── screens/       # 自己的屏幕
│   ├── components/    # 自己的组件
│   ├── hooks/         # 自己的 hooks
│   ├── store/         # 自己的状态
│   ├── services/      # 自己的服务
│   ├── types.ts       # 自己的类型定义
│   └── index.ts       # 导出接口
│
├── community/         # 社区模块
├── ai-coach/          # AI 教练模块
└── profile/           # 个人资料模块
```

**模块自治特性：**
- ✅ 模块内部高内聚
- ✅ 模块间低耦合
- ✅ 可独立测试
- ✅ 支持动态加载（代码分割）
- ✅ 便于团队并行开发

**模块导出示例：**
```typescript
// src/modules/training/index.ts
export * from './screens';
export * from './components';
export type TrainingModule = {
  modules: string[];
  version: string;
};
```

---

## 工作流程

### 典型数据流

```
用户操作 
  ↓
[表现层] 屏幕/组件 
  ↓
[表现层] 回调函数 → store.action()/hook 
  ↓
[业务逻辑层] Hook/Service/Store 处理业务逻辑
  ↓
[数据访问层] Repository 获取数据
  ↓
[数据访问层] API/Storage 访问数据源
  ↓
[数据返回] ← ← ← ← ←
  ↓
[UI 更新] 状态改变，重新渲染
```

### 实例：登录流程

```typescript
// 1. 屏幕（表现层）
const LoginScreen = () => {
  const { login, isLoading } = useAppStore();
  const handleLogin = (email, password) => {
    login(email, password);  // 调用 store action
  };
  return <LoginForm onSubmit={handleLogin} />;
};

// 2. Store（业务逻辑层）
const useAppStore = create((set) => ({
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const user = await authService.login(email, password);
      set({ user, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },
}));

// 3. Service（业务逻辑层）
class AuthService {
  async login(email, password) {
    const response = await apiClient.post('/auth/login', { email, password });
    await storageManager.saveToken(response.token);
    return response.user;
  }
}

// 4. API 客户端（数据访问层）
// 在 apiClient 中统一处理 HTTP 请求
```

---

## 团队协作

### 按模块分工

```
Frontend Team
│
├─ User A: Auth 模块
│   └─ 负责：登录、注册、密码重置
│   └─ 文件：src/modules/auth/*
│   └─ 测试：tests/auth/*
│
├─ User B: Training 模块
│   └─ 负责：训练计划、锻炼执行
│   └─ 文件：src/modules/training/*
│   └─ 测试：tests/training/*
│
├─ User C: UI 组件库
│   └─ 负责：通用组件、布局组件
│   └─ 文件：src/presentation/components/*
│   └─ 测试：tests/unit/components/*
│
└─ User D: 基础设施
    └─ 负责：API 客户端、存储、工具
    └─ 文件：src/core/*, src/data/*
    └─ 测试：tests/integration/*
```

### GitHub 工作流程

```bash
# 1. 创建功能分支
git checkout -b feature/training-module

# 2. 开发和测试
# 编辑文件 → 测试 → 提交

# 3. 提交 PR
# 完成 PR 审查 → 合并到 main

# 4. 部署
# 自动化部署流程
```

---

## 最佳实践

### ✅ 代码组织

1. **单一职责原则**
   ```typescript
   // ✅ 好
   const useUserProfile = () => { /* 只负责用户数据 */ };
   const useUserUpdate = () => { /* 只负责更新用户 */ };

   // ❌ 坏
   const useUser = () => { /* 做所有事情 */ };
   ```

2. **显式导入/导出**
   ```typescript
   // ✅ 好
   import { logger } from '@core/utils/logger';

   // ❌ 坏
   import * as utils from '@core/utils';
   ```

3. **类型安全**
   ```typescript
   // ✅ 好 - 强类型
   const response = await apiClient.get<User>('/users/1');

   // ❌ 坏 - any 类型
   const response: any = await apiClient.get('/users/1');
   ```

### ✅ 测试策略

```
测试金字塔
    /\
   /  \  E2E 测试 (10%)
  /────\
 /      \  集成测试 (30%)
/────────\
         \  单元测试 (60%)
──────────

每层独立测试：
- [单元测试] Hook、Service、Util
- [集成测试] Repository、API 文件
- [E2E 测试] 完整用户旅程
```

### ✅ 命名约定

```typescript
// Hook - use开头
useUser()
useTraining()
useAsync()

// Component - PascalCase
<LoginScreen />
<TrainingCard />
<CustomButton />

// Utility - lowercase
formatDate()
validateEmail()

// Constant - UPPER_CASE
HTTP_STATUS
CACHE_KEYS
ROUTES

// Type - PascalCase
interface User { }
type Status = 'pending' | 'success';
```

---

## 常用命令

```bash
# 安装依赖
npm install

# 开发模式
npm start

# 测试
npm test

# 构建
npm run build

# 代码检查
npm run lint
```

---

## 文件夹结构总览

```
FitnessAppMobile/
├── src/
│   ├── presentation/           # 表现层
│   │   ├── screens/
│   │   ├── components/
│   │   └── navigation/
│   │
│   ├── business-logic/         # 业务逻辑层
│   │   ├── hooks/
│   │   ├── store/
│   │   ├── services/
│   │   └── contexts/
│   │
│   ├── data/                   # 数据访问层
│   │   ├── api/
│   │   ├── storage/
│   │   ├── mappers/
│   │   └── repositories/
│   │
│   ├── core/                   # 核心服务层
│   │   ├── services/
│   │   ├── utils/
│   │   ├── constants/
│   │   ├── types/
│   │   └── config/
│   │
│   ├── modules/                # 独立功能模块
│   │   ├── training/
│   │   ├── community/
│   │   ├── ai-coach/
│   │   └── profile/
│   │
│   └── App.tsx
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── app.json
├── package.json
└── tsconfig.json
```

---

## 总结

这个架构设计的核心优势：

| 优势 | 说明 |
|------|------|
| 🎯 **清晰的职责** | 每层只做自己的事情 |
| 🔄 **高复用性** | Hooks、Services 可跨模块使用 |
| 🧪 **易于测试** | 每层都能独立单元测试 |
| 👥 **便于协作** | 模块独立，减少冲突 |
| 📦 **代码分割** | 按需加载功能模块 |
| 🚀 **易于扩展** | 新功能只需添加新模块 |
| 🐛 **便于调试** | 错误源头清晰，容易定位 |

**祝编码愉快！** 🎉
