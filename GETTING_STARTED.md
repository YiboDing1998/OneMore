/**
 * 🚀 快速启动指南
 */

# 🚀 FitnessApp Mobile - 快速启动

## ✅ 集成完成！

项目现在使用 **Expo Router + 工业级架构** 的组合。

```
✅ Expo Router        - 屏幕和路由管理
✅ src/ 架构          - 业务逻辑、数据、核心服务
✅ 路径别名           - 简化导入
✅ 文档完整           - 150+ 页技术文档
```

---

## 1️⃣ 安装依赖

```bash
cd FitnessAppMobile
npm install
```

## 2️⃣ 启动开发服务器

```bash
npm start
```

选择：
- `i` → iOS 模拟器
- `a` → Android 模拟器  
- `w` → Web 测试
- `j` → Expo 开发应用

## 3️⃣ 看看现在的样子

打开 `app/(tabs)/index.tsx` 查看新的首页。

---

## 📚 推荐阅读顺序

### 初级 (今天)
1. ✅ **本指南** (你现在看的)
2. 📖 [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - 一页纸速查
3. 📖 [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - 集成说明

### 中级 (本周)
4. 📖 [ARCHITECTURE.md](./ARCHITECTURE.md) - 详细架构
5. 📖 [DEVELOPMENT.md](./DEVELOPMENT.md) - 开发指南

### 高级 (有时间)
6. 📖 [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - 结构详解
7. 📖 [WEB_vs_MOBILE.md](./WEB_vs_MOBILE.md) - Web/Mobile 关系

---

## 📍 项目结构一览

```
FitnessAppMobile/
│
├── app/                    ← Expo Router (屏幕)
│   ├── (tabs)/
│   │   ├── index.tsx      # 首页 ✨ 已更新
│   │   ├── modal.tsx
│   │   └── ...
│   └── _layout.tsx
│
├── components/             ← 可复用 UI 组件
│   ├── themed-text.tsx
│   └── ...
│
├── src/                    ← 业务逻辑和数据
│   ├── business-logic/     (Hook, Store, Service)
│   ├── data/               (API, Storage, Repository)
│   ├── core/               (Type, Constant, Utils)
│   └── modules/            (独立功能模块)
│
└── docs/                   ← 文档
    ├── QUICK_REFERENCE.md
    ├── INTEGRATION_GUIDE.md
    ├── ARCHITECTURE.md
    ├── DEVELOPMENT.md
    └── ...
```

---

## 🎯 核心概念（5 分钟速成）

### 表现层 (app/)
```typescript
// 屏幕 - 只负责 UI
export default function HomeScreen() {
  const { user } = useAppStore();  // ← 从 Hook/Store 获取数据
  return <Text>{user.name}</Text>;
}
```

### 业务逻辑层 (src/business-logic/)
```typescript
// Hook - 处理业务逻辑
export const useUser = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    userRepository.get().then(setUser);
  }, []);
  return { user };
};

// Store - 全局状态管理
export const useAppStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

### 数据层 (src/data/)
```typescript
// Repository - 数据仓库
export class UserRepository {
  async get() {
    const cached = await storage.getCache();
    if (cached) return cached;
    
    const data = await apiClient.get('/user');
    await storage.setCache(data);
    return data;
  }
}
```

### 核心层 (src/core/)
```typescript
// 类型、常量、工具函数
export interface User { ... }
export const ROUTES = { ... }
export const logger = { ... }
```

---

## 💻 常用命令

| 命令 | 说明 |
|------|------|
| `npm start` | 启动开发服务器 |
| `npm test` | 运行测试 |
| `npm run lint` | 代码检查 |
| `npm run build:ios` | 构建 iOS |
| `npm run build:android` | 构建 Android |

---

## 🔥 立即开始

### 选项 1: 查看现有示例

```bash
# 1. 查看首页（已更新的示例）
code app/(tabs)/index.tsx

# 2. 查看 Hook 示例
code src/business-logic/hooks/useUser.ts

# 3. 查看 Repository 示例
code src/data/repositories/UserRepository.ts
```

### 选项 2: 添加新屏幕

1. 创建文件: `app/(tabs)/new-screen.tsx`
2. 复制现有屏幕的代码结构
3. 创建需要的 Hook: `src/business-logic/hooks/useNewFeature.ts`
4. 在 `app/(tabs)/_layout.tsx` 中注册路由

### 选项 3: 修改首页

编辑 `app/(tabs)/index.tsx` 中的注释代码：

```typescript
// 取消注释这行来使用 Store
// const { user, isAuthenticated } = useAppStore();

// 取消注释这行来使用 Hook
// const { user, loading } = useUser(userId);
```

---

## ❓ 常见问题

**Q: 如何导入来自 src 的代码？**

A: 使用路径别名（已在 tsconfig.json 中配置）

```typescript
// ✅ 正确
import { useUser } from '@business-logic/hooks';
import { userRepository } from '@data/repositories/UserRepository';
import { logger } from '@core/utils';

// ❌ 错误
import { useUser } from '../../../src/business-logic/hooks';
```

**Q: 数据应该存在哪里？**

A: 
- 单个屏幕 → `useState`
- 多个屏幕 → Custom Hook (`src/business-logic/hooks/`)
- 全局应用 → Zustand Store (`src/business-logic/store/`)

**Q: 如何调用 API？**

A: 
1. 在 `src/data/repositories/` 创建 Repository
2. 在 `src/business-logic/hooks/` 创建 Hook
3. 在屏幕中使用 Hook

```typescript
// src/data/repositories/ProductRepository.ts
export class ProductRepository {
  async getProducts() {
    return apiClient.get('/products');  // 调用 API
  }
}

// src/business-logic/hooks/useProducts.ts
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    productRepository.getProducts().then(setProducts);
  }, []);
  return { products };
};

// app/(tabs)/products.tsx
export default function ProductsScreen() {
  const { products } = useProducts();  // 使用 Hook
}
```

**Q: 测试怎么写？**

A: 参考 `tests/` 文件夹的示例

```bash
# 运行所有测试
npm test

# 监听模式
npm test -- --watch

# 特定文件
npm test -- useUser.test.ts
```

---

## 🎓 学习路径推荐

### 第 1 天
- ✅ 看本指南
- ✅ 看 QUICK_REFERENCE.md
- ✅ 运行项目
- ✅ 修改首页测试一下

### 第 2-3 天
- 📖 读 INTEGRATION_GUIDE.md
- 💻 添加新屏幕
- 💻 创建新 Hook
- 🧪 运行测试

### 第 4-5 天
- 📖 读 ARCHITECTURE.md
- 💻 整合 API
- 📱 构建 APK/IPA

### 第 1-2 周
- 📖 读 DEVELOPMENT.md
- 💻 实现核心功能
- 👥 与团队协作

---

## 📞 获取帮助

### 查看文档
- 快速问题 → [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
- 如何集成 → [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
- 详细架构 → [ARCHITECTURE.md](./ARCHITECTURE.md)
- 开发工作流 → [DEVELOPMENT.md](./DEVELOPMENT.md)

### 查看代码
- 屏幕示例 → `app/(tabs)/index.tsx`
- Hook 示例 → `src/business-logic/hooks/useUser.ts`
- Service 示例 → `src/business-logic/services/AuthService.ts`
- Repository 示例 → `src/data/repositories/UserRepository.ts`
- 测试示例 → `tests/`

---

## ✨ 你现在拥有

✅ **Expo Router** - 现代的屏幕路由管理  
✅ **工业级架构** - 4 层分离设计  
✅ **完整文档** - 150+ 页技术文档  
✅ **示例代码** - 可复用的代码模板  
✅ **团队协作** - 清晰的工作流程  
✅ **可扩展性** - 易于添加新功能  

---

## 🚀 现在就开始吧！

```bash
# 1. 启动项目
npm start

# 2. 选择模拟器或设备
# i = iOS, a = Android, w = Web

# 3. 打开编辑器修改代码
code .

# 4. 查看更新
# 按 R 刷新，Cmd/Ctrl + D 打开菜单
```

---

**祝你开发愉快！** 🎉💪

最后更新: 2026-02-14

有问题？查看 [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) 或 [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
