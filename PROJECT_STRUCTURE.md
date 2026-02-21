/**
 * 项目结构总结文档
 */

# 📂 项目结构快速参考

## 层级关系图

```
表现层 (Presentation)
    ↓ (依赖)
业务逻辑层 (Business Logic)
    ↓ (依赖)
数据访问层 (Data Access)
    ↓ (依赖)
核心服务层 (Core Services)
```

**重要规则**：
- ✅ 上层可以依赖下层
- ❌ 下层不能依赖上层
- ❌ 同层之间应该通过接口通信

---

## 各层文件清单

### 表现层 (`src/presentation/`)

| 文件 | 职责 | 示例 |
|------|------|------|
| `screens/` | 完整屏幕/页面 | LoginScreen, HomeScreen |
| `components/` | UI 组件 | Button, Card, Input |
| `navigation/` | 导航配置 | RootNavigator.tsx |

**特点**：
- 只包含 UI 逻辑
- 通过 Props 接收数据
- 通过回调触发操作
- 可以使用 Hooks 共享逻辑

**示例代码**：
```typescript
// ✅ 正确
const ProfileScreen = () => {
  const { user } = useAppStore();
  return <Text>{user.name}</Text>;
};

// ❌ 错误 - 不要直接调用 API
const BadScreen = () => {
  useEffect(() => {
    fetch('/api/user');  // 不应该
  }, []);
};
```

---

### 业务逻辑层 (`src/business-logic/`)

| 文件 | 职责 | 示例 |
|------|------|------|
| `hooks/` | 自定义 React Hook | useUser, useTraining |
| `store/` | 全局状态管理 (Zustand) | appStore |
| `services/` | 业务服务 | AuthService |
| `contexts/` | React Context | (可选) |

**何时使用**：

| 场景 | 方案 |
|------|------|
| 数据由一个组件使用 | 本地 useState |
| 数据由多个相关组件使用 | Custom Hook |
| 数据对整个应用重要 | Store (Zustand) |
| 主题、语言等全局设置 | Context |

**示例**：
```typescript
// Hook - 复用逻辑
export const useUserData = (userId) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    userRepository.get(userId).then(setUser);
  }, [userId]);
  return { user };
};

// Store - 全局状态
const useAppStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

---

### 数据访问层 (`src/data/`)

| 文件 | 职责 | 示例 |
|------|------|------|
| `api/` | HTTP 客户端 | ApiClient, endpoints |
| `storage/` | 本地存储 | StorageManager, cache |
| `repositories/` | 数据仓库 | UserRepository |
| `mappers/` | 数据映射 | UserMapper, WorkoutMapper |

**特点**：
- 隐藏数据来源细节（API/本地存储）
- 提供统一的接口
- 处理缓存和数据转换
- 不包含业务逻辑

**数据流**：
```
Repository
  ↓
API Client / Storage
  ↓
数据源 (服务器/本地)
```

**示例**：
```typescript
// Repository 提供统一接口
class UserRepository {
  async getUser(id) {
    // 1. 尝试缓存
    const cached = await storage.getCache('user_' + id);
    if (cached) return cached;
    
    // 2. 调用 API
    const data = await apiClient.get(`/users/${id}`);
    
    // 3. 缓存结果
    await storage.setCache('user_' + id, data);
    
    return data;
  }
}
```

---

### 核心服务层 (`src/core/`)

| 文件 | 职责 | 示例 |
|------|------|------|
| `types/` | 全局类型定义 | User, Workout, etc |
| `constants/` | 常量 | ROUTES, HTTP_STATUS |
| `utils/` | 工具函数 | validators, helpers |
| `services/` | 核心服务 | AuthService, Logger |
| `config/` | 环境配置 | API_URL, cache 配置 |

**特点**：
- 独立于业务逻辑
- 可被所有层使用
- 通常是单例模式
- 处理跨切关注点

**使用方法**：
```typescript
// 导入和使用
import { logger } from '@core/utils';
import { USER_ROUTES } from '@core/constants';
import { config } from '@core/config';

logger.info('应用启动');
console.log(USER_ROUTES.PROFILE);
```

---

## 模块设计 (`src/modules/`)

独立的功能模块，可以由不同的团队成员负责：

```
modules/
├── training/          # 训练模块
│   ├── screens/       # 屏幕
│   ├── components/    # 组件
│   ├── hooks/         # Hook
│   ├── services/      # 服务
│   ├── store/         # 本地状态
│   ├── types.ts       # 类型定义
│   └── index.ts       # 导出接口
│
├── community/         # 社区模块
├── ai-coach/          # AI 教练模块
└── profile/           # 个人资料模块
```

**模块特性**：
- ✅ 高内聚：所有相关代码在一起
- ✅ 低耦合：通过清晰的导出接口通信
- ✅ 可独立测试
- ✅ 可扩展：新功能只需新增模块
- ✅ 易于协作：不同人可以负责不同模块

---

## 测试组织

```
tests/
├── unit/              # 单元测试 (60%)
│   ├── hooks/
│   ├── services/
│   └── utils/
├── integration/       # 集成测试 (30%)
│   ├── repositories/
│   └── store/
├── e2e/              # 端到端测试 (10%)
│   └── flows/
└── setup.ts          # 测试配置
```

**测试策略**：
```
测试金字塔
  /\
 /  \  端到端 (10%) - 完整用户流程
/────\
      \ 集成 (30%) - 多个单元协作
────────\ 单元 (60%) - 单个函数/类
──────────
```

---

## 常见场景解决方案

### 场景 1: 添加新屏幕

```bash
# 1. 创建屏幕
src/presentation/screens/training/NewTrainingScreen.tsx

# 2. 添加路由
src/presentation/navigation/RootNavigator.tsx

# 3. 创建 Hook（如果需要数据）
src/business-logic/hooks/useNewTraining.ts

# 4. 写测试
tests/unit/screens/NewTrainingScreen.test.tsx

# 5. 提交 PR
```

### 场景 2: 集成新 API

```bash
# 1. 定义类型
src/core/types/index.ts

# 2. 创建 Repository (如果不存在)
src/data/repositories/NewRepository.ts

# 3. 创建 Service（如果需要复杂逻辑）
src/business-logic/services/NewService.ts

# 4. 创建 Hook（暴露给 UI）
src/business-logic/hooks/useNew.ts

# 5. 在屏幕中使用
src/presentation/screens/.../Screen.tsx

# 6. 写测试
tests/integration/repositories/NewRepository.test.ts
```

### 场景 3: 全局状态

```typescript
// 确定是否需要全局状态
// - 多个屏幕需要 ✅ 使用 Store
// - 单个功能模块内 ✅ 使用 Hook
// - 临时状态 ✅ 使用 useState

// 添加到 Store
const useAppStore = create((set) => ({
  newData: null,
  setNewData: (data) => set({ newData: data }),
}));

// 在屏幕中使用
const MyScreen = () => {
  const { newData } = useAppStore();
};
```

---

## 导入别名（可选配置）

在 `tsconfig.json` 中配置别名，简化导入：

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@core/*": ["./src/core/*"],
      "@data/*": ["./src/data/*"],
      "@business-logic/*": ["./src/business-logic/*"],
      "@presentation/*": ["./src/presentation/*"],
      "@modules/*": ["./src/modules/*"]
    }
  }
}
```

**使用别名**：
```typescript
// ✅ 好
import { logger } from '@core/utils';
import { useUser } from '@business-logic/hooks';

// ❌ 不好
import { logger } from '../../../core/utils';
import { useUser } from '../../../business-logic/hooks';
```

---

## 快速检查清单

添加新功能前，检查：

- [ ] **架构设计** - 将在哪一层实现？
- [ ] **类型定义** - 数据类型是否定义在 `@core/types`？
- [ ] **数据访问** - Repository 是否需要新增或修改？
- [ ] **业务逻辑** - 需要新 Hook/Service 吗？
- [ ] **UI 实现** - 屏幕/组件是否在合适的位置？
- [ ] **测试** - 是否有对应的单元/集成测试？
- [ ] **文档** - 复杂功能是否有注释说明？
- [ ] **导入路径** - 是否遵循了导入规范？

---

## 故障排除

**问题：无法找到模块**
```bash
npm start -- --reset-cache
```

**问题：类型不匹配**
```bash
npm run type-check
# 或使用编辑器的 TypeScript 检查
```

**问题：导入循环依赖**
- 检查是否有双向导入
- 使用 Type-Only Import: `import type { ... } from ...`

**问题：Store 不更新**
- 检查是否调用了 set 函数
- 确保状态对象是新的（不是修改原对象）

---

## 最终建议

1. **保持分层** - 不要跨层导入
2. **单一职责** - 每个文件只做一件事
3. **明确命名** - 从名字就能看出用途
4. **充分测试** - 尤其是业务逻辑层
5. **常规文档** - 复杂逻辑需要注释
6. **代码审查** - 互相学习和监督质量

---

祝开发顺利！如有问题，请查阅完整的 [ARCHITECTURE.md](./ARCHITECTURE.md)。 🚀
