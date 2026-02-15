/**
 * 开发指南 - 如何使用这个架构
 */

# 🚀 开发指南

## 快速开始

### 1. 项目初始化

```bash
# 安装依赖
cd FitnessAppMobile
npm install

# 或使用 yarn
yarn install
```

### 2. 运行项目

```bash
# 开发模式
npm start

# 或
npx expo start

# 然后选择：
# - i: 启动 iOS 模拟器
# - a: 启动 Android 模拟器
# - w: Web 调试
```

### 3. 构建项目

```bash
# iOS
eas build --platform ios

# Android
eas build --platform android

# 或本地构建
npm run build:ios
npm run build:android
```

---

## 开发工作流

### 添加新的屏幕

1. **在合适的模块中创建屏幕**
   ```
   src/presentation/screens/training/
   └── WorkoutDetailScreen.tsx
   ```

2. **屏幕代码示例**
   ```typescript
   import React from 'react';
   import { View, Text } from 'react-native';
   import { useWorkout } from '../../hooks';  // 导入 hook
   
   const WorkoutDetailScreen = ({ route }) => {
     const { workoutId } = route.params;
     const { workout, loading } = useWorkout(workoutId);  // 使用 hook 获取数据
     
     return (
       <View>
         <Text>{workout?.name}</Text>
       </View>
     );
   };
   
   export default WorkoutDetailScreen;
   ```

3. **在导航中注册屏幕**
   ```typescript
   // src/presentation/navigation/RootNavigator.tsx
   <Stack.Screen 
     name={ROUTES.WORKOUT_DETAIL}
     component={WorkoutDetailScreen}
   />
   ```

### 添加新的数据流

1. **定义类型**
   ```typescript
   // src/core/types/index.ts
   export interface Workout {
     id: string;
     name: string;
     // ...
   }
   ```

2. **创建 API 方法**
   ```typescript
   // 在 ApiClient 中添加相应的方法
   async getWorkouts(): Promise<Workout[]> {
     return this.get<Workout[]>('/workouts');
   }
   ```

3. **创建 Repository**
   ```typescript
   // src/data/repositories/WorkoutRepository.ts
   export class WorkoutRepository {
     async getWorkouts(): Promise<Workout[]> {
       const response = await apiClient.get<ApiResponse<Workout[]>>('/workouts');
       return response.data || [];
     }
   }
   ```

4. **创建 Hook 或 Service**
   ```typescript
   // src/business-logic/hooks/useWorkout.ts
   export const useWorkout = (id: string) => {
     const [workout, setWorkout] = useState<Workout | null>(null);
     
     useEffect(() => {
       workoutRepository.getWorkout(id).then(setWorkout);
     }, [id]);
     
     return { workout };
   };
   ```

5. **在屏幕中使用**
   ```typescript
   const MyScreen = () => {
     const { workout } = useWorkout('123');
     return <Text>{workout?.name}</Text>;
   };
   ```

---

## 编码规范

### 命名规范

```typescript
// ✅ 屏幕 - PascalCase + Screen 后缀
HomeScreen, TrainingScreen, WorkoutDetailScreen

// ✅ 组件 - PascalCase
Button, Card, Header, TrainingCard

// ✅ Hook - use + PascalCase
useUser, useTraining, useAsync

// ✅ 函数 - camelCase
getFormattedDate(), formatDuration(), calculateCalories()

// ✅ 常量 - UPPER_SNAKE_CASE
HTTP_STATUS, CACHE_KEYS, ROUTES

// ✅ 类型 - PascalCase
interface User { }
type Status = 'loading' | 'success' | 'error'

// ✅ 文件名 - 根据导出内容
UserScreen.tsx, useUser.ts, UserRepository.ts
```

### 代码风格

```typescript
// ✅ 使用 TypeScript 类型
const user: User = { ... };
async function fetchData(): Promise<Data> { ... }

// ✅ 使用箭头函数
const handlePress = () => { ... };

// ✅ 使用 async/await
const data = await api.get('/endpoint');

// ✅ 适当的错误处理
try {
  const data = await fetchData();
} catch (error) {
  logger.error('Failed to fetch', error);
  setError(error.message);
}

// ❌ 避免 any 类型
// const data: any = ...

// ❌ 避免深层嵌套
// if (a) { if (b) { if (c) { ... } } }
// 使用 guard 子句而不是嵌套

// ❌ 避免副作用在组件中
// useEffect(() => {
//   api.get('/data');  // ✓ 这样可以
// }, []);
```

---

## 日常任务

### 任务 1: 修复 Bug

```bash
# 1. 创建 bug fix 分支
git checkout -b fix/bug-name

# 2. 定位问题
# - 查看错误日志
# - 设置断点调试
# - 检查 console 输出

# 3. 修复和测试
npm test

# 4. 提交
git add .
git commit -m "fix: 修复描述"
git push origin fix/bug-name

# 5. 创建 PR 并合并
```

### 任务 2: 开发新功能

```bash
# 1. 创建 feature 分支
git checkout -b feature/new-feature

# 2. 设计架构
# - 确定需要的模块
# - 设计数据流
# - 确定新增 hook/service

# 3. 实现代码
# - 先写类型定义
# - 再写数据层
# - 再写业务逻辑
# - 最后写 UI

# 4. 编写测试
npm test

# 5. 代码审查
npm run lint

# 6. 提交 PR
```

### 任务 3: 代码审查

当审查他人代码时，检查：

- [ ] 架构 - 数据是否流向正确的层？
- [ ] 类型 - 是否有足够的类型安全？
- [ ] 测试 - 是否有对应的单元测试？
- [ ] 文档 - 复杂逻辑是否有注释？
- [ ] 命名 - 变量名是否清晰？
- [ ] 错误处理 - 是否处理了所有错误情况？

---

## 调试技巧

### 使用 Chrome DevTools

```bash
# 开发时按 Shift + D（iOS 模拟器）或 Shake 设备（Android）
# 选择 "Debug Remote JS"
```

### 日志记录

```typescript
import { logger } from '@core/utils';

logger.debug('调试信息', data);
logger.info('重要信息');
logger.warn('警告信息');
logger.error('错误信息', error);

// 在 Chrome DevTools 中过滤日志
// [FitnessApp] 前缀帮助快速识别应用日志
```

### 使用 Redux DevTools（如果使用 Redux）

```typescript
// 检查状态变化
// 时间旅行调试
// 分析状态转移
```

---

## 性能优化

### 1. 代码分割

```typescript
// 使用 React.lazy 惰性加载屏幕
const TrainingModule = React.lazy(() =>
  import('../modules/training')
);

// 使用 Suspense 显示加载状态
<Suspense fallback={<Loading />}>
  <TrainingModule />
</Suspense>
```

### 2. 缓存策略

```typescript
// 设置合理的缓存过期时间
await storageManager.setCacheItem(
  CACHE_KEYS.USER_PROFILE,
  userData,
  3600000  // 1 小时
);
```

### 3. 减少重新渲染

```typescript
// 使用 useMemo 缓存计算结果
const memoizedValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);

// 使用 useCallback 缓存函数
const memoizedCallback = useCallback(() => {
  doSomething(value);
}, [value]);
```

### 4. 优化网络请求

```typescript
// 批量请求
Promise.all([
  api.get('/users/1'),
  api.get('/workouts/1'),
  api.get('/stats/1'),
]);

// 请求去重
// 使用 Repository 层的缓存
```

---

## 常见问题

### Q: 如何在模块间通信？

A: 使用全局 Store 或通过导航参数传递数据。

```typescript
// 方式 1: Store
const { setUser } = useAppStore();

// 方式 2: 导航参数
navigation.navigate('Detail', { userId: '123' });
```

### Q: 何时使用 Hook vs Store？

A: 
- **Hook**: 组件级状态、复用逻辑
- **Store**: 全局状态、跨模块共享

### Q: 如何处理离线场景？

A: 使用 Repository 的缓存机制和 Capacitor 的离线模式。

---

## 资源链接

- [React Native 文档](https://reactnative.dev/)
- [Expo 文档](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Zustand 文档](https://github.com/pmndrs/zustand)
- [TypeScript 文档](https://www.typescriptlang.org/)

---

祝编码愉快！有问题请提交 Issue 或联系团队。 🚀
