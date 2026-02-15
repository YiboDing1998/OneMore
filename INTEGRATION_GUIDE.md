/**
 * 🚀 Expo Router + 架构集成指南
 */

# Expo Router + 工业级架构集成

## 项目结构

```
FitnessAppMobile/
│
├── app/                          ← Expo Router (屏幕和路由)
│   ├── (tabs)/
│   │   ├── index.tsx            # 首页
│   │   ├── training.tsx         # 训练
│   │   ├── community.tsx        # 社区
│   │   └── profile.tsx          # 个人资料
│   ├── modal.tsx
│   └── _layout.tsx
│
├── components/                   ← 可复用 UI 组件
│   ├── themed-text.tsx
│   ├── themed-view.tsx
│   └── common/
│       ├── Button.tsx
│       └── Card.tsx
│
├── src/                         ← 业务逻辑和数据
│   ├── business-logic/          (Hook, Store, Service)
│   ├── data/                    (API, Storage, Repository)
│   ├── core/                    (Type, Constant, Utils, Config)
│   └── modules/                 (独立功能模块)
│
├── hooks/                       ← React Hooks (Expo 项目习惯)
├── constants/                   ← 常量 (Expo 项目习惯)
├── assets/                      ← 图片和资源
│
└── tsconfig.json               ← 已配置路径别名

```

---

## 数据流和数据访问

### 1️⃣ 屏幕（表现层）

```typescript
// app/(tabs)/training.tsx - 屏幕文件
import { useWorkout } from '@business-logic/hooks';
import { useAppStore } from '@business-logic/store/appStore';
import { Button } from '@components/common/Button';

export default function TrainingScreen() {
  // ✅ 从 Store 获取全局状态
  const { user } = useAppStore();
  
  // ✅ 使用 Custom Hook 获取业务数据
  const { workouts, loading } = useWorkout();
  
  const handleStartWorkout = (id: string) => {
    // 调用业务逻辑
    startTrainingWorkout(id);
  };
  
  return (
    <View>
      <Text>Hello, {user?.name}</Text>
      <Button onPress={handleStartWorkout} />
    </View>
  );
}
```

### 2️⃣ Hook（业务逻辑层）

```typescript
// src/business-logic/hooks/useWorkout.ts
import { useState, useEffect } from 'react';
import { workoutRepository } from '@data/repositories/WorkoutRepository';

export const useWorkout = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    workoutRepository.getWorkouts()
      .then(setWorkouts)
      .finally(() => setLoading(false));
  }, []);
  
  return { workouts, loading };
};
```

### 3️⃣ 数据仓库（数据访问层）

```typescript
// src/data/repositories/WorkoutRepository.ts
import { apiClient } from '@data/api/client';
import { storageManager } from '@data/storage/storage';

export class WorkoutRepository {
  async getWorkouts() {
    // 先尝试缓存
    const cached = await storageManager.getCacheItem('workouts');
    if (cached) return cached;
    
    // 调用 API
    const data = await apiClient.get('/workouts');
    
    // 缓存结果
    await storageManager.setCacheItem('workouts', data);
    
    return data;
  }
}
```

### 4️⃣ API 客户端（数据访问层）

```typescript
// src/data/api/client.ts
// 已包含在项目中，统一处理 HTTP 请求
```

### 5️⃣ 核心服务（核心服务层）

```typescript
// src/core/types/index.ts - 类型定义
export interface Workout { ... }
export interface User { ... }

// src/core/constants/index.ts - 常量
export const ROUTES = { ... }
export const HTTP_STATUS = { ... }

// src/core/utils/validators.ts - 验证工具
export const validators = { ... }
```

---

## 导入路径别名

### ✅ 正确的导入方式

```typescript
// ✅ 业务逻辑
import { useUser } from '@business-logic/hooks';
import { useAppStore } from '@business-logic/store/appStore';
import { authService } from '@business-logic/services/AuthService';

// ✅ 数据访问
import { userRepository } from '@data/repositories/UserRepository';
import { apiClient } from '@data/api/client';
import { storageManager } from '@data/storage/storage';

// ✅ 核心服务
import { logger } from '@core/utils';
import { validators } from '@core/utils';
import { ROUTES, HTTP_STATUS } from '@core/constants';
import type { User, Workout } from '@core/types';

// ✅ 组件
import { Button } from '@components/common/Button';
import { Card } from '@components/common/Card';

// ✅ Expo 项目结构
import { useColorScheme } from '@hooks/useColorScheme';
import { Colors } from '@constants/Colors';
```

### ❌ 不要这样导入

```typescript
// ❌ 相对路径太长
import { useUser } from '../../../src/business-logic/hooks';

// ❌ 混淆路径
import { useUser } from 'src/business-logic/hooks';
```

---

## 常见任务

### 任务 1: 添加新屏幕

```
1. 创建屏幕文件
   app/(tabs)/new-feature.tsx

2. 创建必要的 Hook（如果需要）
   src/business-logic/hooks/useNewFeature.ts

3. 创建 Repository（如果需要新 API）
   src/data/repositories/NewFeatureRepository.ts

4. 在 app/_layout.tsx 中注册路由
```

**示例：添加购物车屏幕**

```typescript
// app/(tabs)/cart.tsx
import { View, Text } from 'react-native';
import { useCart } from '@business-logic/hooks';
import { Button } from '@components/common/Button';

export default function CartScreen() {
  const { items, total } = useCart();
  
  return (
    <View>
      <Text>🛒 购物车</Text>
      {items.map(item => (
        <CartItem key={item.id} item={item} />
      ))}
      <Button title={`支付 ¥${total}`} />
    </View>
  );
}
```

### 任务 2: 调用 API 获取数据

```
1. 定义类型
   src/core/types/Product.ts

2. 在 apiClient 中添加方法
   src/data/api/client.ts

3. 创建 Repository
   src/data/repositories/ProductRepository.ts

4. 创建 Hook
   src/business-logic/hooks/useProducts.ts

5. 在屏幕中使用
   app/(tabs)/products.tsx
```

**完整示例：**

```typescript
// 1. 定义类型
export interface Product {
  id: string;
  name: string;
  price: number;
}

// 2. API 客户端（已在 client.ts 中）
// apiClient.get('/products')

// 3. Repository
export class ProductRepository {
  async getProducts() {
    return apiClient.get<Product[]>('/products');
  }
}

// 4. Hook
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    productRepository.getProducts().then(setProducts);
  }, []);
  
  return { products };
};

// 5. 屏幕
export default function ProductsScreen() {
  const { products } = useProducts();
  
  return (
    <View>
      {products.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </View>
  );
}
```

### 任务 3: 使用全局状态

```typescript
// src/business-logic/store/appStore.ts
import create from 'zustand';

export const useAppStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

// 在屏幕中使用
import { useAppStore } from '@business-logic/store/appStore';

export default function ProfileScreen() {
  const { user, logout } = useAppStore();
  
  return (
    <View>
      <Text>{user?.name}</Text>
      <Button title="登出" onPress={logout} />
    </View>
  );
}
```

---

## 文件位置决策

### 应该在哪里创建文件？

| 需求 | 位置 | 理由 |
|------|------|------|
| 屏幕 | `app/` | Expo Router 管理 |
| 可复用 UI 组件 | `components/` | Expo 项目习惯 |
| Custom Hook | `src/business-logic/hooks/` | 业务逻辑 |
| 业务 Service | `src/business-logic/services/` | 业务逻辑 |
| API 调用 | `src/data/repositories/` | 数据访问 |
| 本地存储 | `src/data/storage/` | 数据访问 |
| 类型定义 | `src/core/types/` | 核心定义 |
| 常量 | `src/core/constants/` 或 `constants/` | 核心定义 |
| 工具函数 | `src/core/utils/` | 核心服务 |

---

## 路由配置

### Expo Router 结构

```
app/
├── (tabs)/
│   ├── _layout.tsx          # Tab 导航配置
│   ├── index.tsx            # 首页 (/)
│   ├── training.tsx         # 训练 (/training)
│   ├── community.tsx        # 社区 (/community)
│   └── profile.tsx          # 个人资料 (/profile)
├── modal.tsx                # 模态屏幕 (/modal)
├── _layout.tsx              # 根布局
└── +not-found.tsx           # 404 页面
```

### 导航示例

```typescript
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View>
      {/* 导航到其他屏幕 */}
      <Link href="/training">
        <Text>开始训练</Text>
      </Link>
      
      {/* 导航并传递参数 */}
      <Link href={{ pathname: '/modal', params: { id: '123' } }}>
        <Text>详情</Text>
      </Link>
    </View>
  );
}
```

---

## 与原有架构的映射

```
我的架构设计          →    Expo 项目结构
─────────────────────────────────────
src/presentation/     →    app/ + components/
  screens/                 特定路由在 app/
  components/              可复用组件在 components/

src/business-logic/   →    src/business-logic/
  hooks/                   保持不变
  store/                   保持不变
  services/                保持不变

src/data/             →    src/data/
  api/                     保持不变
  storage/                 保持不变
  repositories/            保持不变

src/core/             →    src/core/
  types/                   保持不变
  constants/               保持不变
  utils/                   保持不变
  config/                  保持不变

src/modules/          →    src/modules/
  training/                保持不变
  community/               保持不变
  ai-coach/                保持不变
  profile/                 保持不变
```

---

## 快速检查清单

启动开发前：

- [ ] 已更新 tsconfig.json（路径别名已配置）
- [ ] 理解屏幕文件在 `app/` 中
- [ ] 理解业务逻辑在 `src/business-logic/` 中
- [ ] 理解数据访问在 `src/data/` 中
- [ ] 知道如何导入：`@business-logic/hooks`
- [ ] 知道如何导入：`@data/repositories`
- [ ] 知道如何导入：`@core/utils`

---

## 开始开发！

1. **查看当前的示例**
   - 屏幕: `app/(tabs)/index.tsx`
   - Hook: `src/business-logic/hooks/useUser.ts`
   - Repository: `src/data/repositories/UserRepository.ts`

2. **运行项目**
   ```bash
   npm start
   ```

3. **修改首页**
   编辑 `app/(tabs)/index.tsx` 并取消注释示例代码

4. **添加新屏幕**
   创建 `app/(tabs)/new-screen.tsx` 并在 `_layout.tsx` 中注册

5. **查看文档**
   - 快速参考: `QUICK_REFERENCE.md`
   - 详细架构: `ARCHITECTURE.md`
   - 开发指南: `DEVELOPMENT.md`

---

**祝编码愉快！** 🚀
