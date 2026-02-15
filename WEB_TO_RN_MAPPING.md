# 🔄 React Web → React Native 映射指南

完整的组件映射和代码转换参考。

---

## 🏗️ 文件结构映射

### Web 应用结构
```
src/
├── app/
│   ├── App.tsx                # 主应用 (Tab 导航)
│   └── components/
│       ├── training/
│       │   └── TrainingModule.tsx
│       ├── record/
│       │   └── RecordModule.tsx
│       ├── ai-coach/
│       │   └── AICoachModule.tsx
│       ├── community/
│       │   └── CommunityModule.tsx
│       ├── profile/
│       │   └── ProfileModule.tsx
│       └── ui/              # UI 组件库
```

### React Native 应用结构
```
FitnessAppMobile/
├── app/(tabs)/
│   ├── _layout.tsx          # 底部标签导航 (Expo Router)
│   ├── training.tsx
│   ├── record.tsx
│   ├── ai-coach.tsx
│   ├── community.tsx
│   └── profile.tsx
├── src/modules/             # 模块内部实现
│   ├── training/screens/TrainingScreen.tsx
│   ├── record/screens/RecordScreen.tsx
│   ├── ai-coach/screens/AICoachScreen.tsx
│   ├── community/screens/CommunityScreen.tsx
│   └── profile/screens/ProfileScreen.tsx
└── components/ui/           # 新 UI 组件库
```

---

## 📦 常见 Web 到 RN 组件映射

### Web 导入
```tsx
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, MessageCircle } from 'lucide-react';
```

### React Native 导入
```tsx
import { Card, Button, Tabs, TabContent } from '@/components/ui';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
```

---

## 🔀 CSS Tailwind 到 React Native StyleSheet 转换

### Web: Tailwind CSS 示例
```tsx
<div className="bg-gradient-to-br from-primary/90 to-primary p-6 rounded-2xl shadow-lg">
  <p className="text-white font-semibold text-lg mb-2">
    你的 AI 私人教练
  </p>
</div>
```

### React Native: StyleSheet 等价物
```tsx
<Card style={[styles.card, styles.gradientCard]}>
  <Text style={styles.title}>你的 AI 私人教练</Text>
</Card>

// styles.ts
const styles = StyleSheet.create({
  card: {
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gradientCard: {
    backgroundColor: '#7c3aed',
  },
  title: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
});
```

---

## 📖 详细组件映射

### 组件 1: Card

#### Web 版本
```tsx
import { Card } from "@/components/ui/card";

export function Example() {
  return (
    <Card className="bg-gradient-to-br from-primary/90 to-primary p-6 shadow-lg">
      <p className="text-sm text-white/80">
        基于你的目标和训练历史
      </p>
    </Card>
  );
}
```

#### React Native 版本
```tsx
import { Card } from '@/components/ui';
import { StyleSheet, View, Text } from 'react-native';

export function Example() {
  return (
    <Card style={[styles.card, styles.gradientCard]}>
      <Text style={styles.description}>
        基于你的目标和训练历史
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 24,
    borderRadius: 12,
  },
  gradientCard: {
    backgroundColor: '#7c3aed',
  },
  description: {
    fontSize: 12,
    color: '#ffffff99',
  },
});
```

---

### 组件 2: Button

#### Web 版本
```tsx
import { Button } from "@/components/ui/button";

export function Example() {
  return (
    <Button className="w-full bg-primary hover:bg-primary/90 h-12 shadow-md">
      <Brain className="w-5 h-5 mr-2" />
      与 AI 教练对话
    </Button>
  );
}
```

#### React Native 版本
```tsx
import { Button } from '@/components/ui';
import { StyleSheet, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export function Example() {
  return (
    <Button style={styles.button}>
      <MaterialCommunityIcons name="brain" size={20} color="#ffffff" />
      <Text style={styles.buttonText}>  与 AI 教练对话</Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});
```

---

### 组件 3: Progress Bar

#### Web 版本
```tsx
import { Progress } from "@/components/ui/progress";

export function Example() {
  return (
    <Progress value={65} className="h-2 bg-slate-200" />
  );
}
```

#### React Native 版本
```tsx
import { Progress } from '@/components/ui';

export function Example() {
  return (
    <Progress value={65} color="#7c3aed" height={8} />
  );
}
```

---

### 组件 4: Icon 使用

#### Web 版本（Lucide React）
```tsx
import { Heart, MessageCircle, TrendingUp } from 'lucide-react';

export function PostActions() {
  return (
    <>
      <Heart className="w-4 h-4" />
      <MessageCircle className="w-4 h-4" />
      <TrendingUp className="w-5 h-5 text-primary" />
    </>
  );
}
```

#### React Native 版本（Expo 图标）
```tsx
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

export function PostActions() {
  return (
    <>
      <MaterialCommunityIcons name="heart-outline" size={16} color="#6b7280" />
      <MaterialCommunityIcons name="message-circle-outline" size={16} color="#6b7280" />
      <MaterialCommunityIcons name="trending-up" size={20} color="#7c3aed" />
    </>
  );
}
```

---

### 组件 5: Tabs

#### Web 版本
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Example() {
  return (
    <Tabs defaultValue="feed">
      <TabsList className="grid w-full grid-cols-2 bg-muted">
        <TabsTrigger value="feed">动态</TabsTrigger>
        <TabsTrigger value="leaderboard">排行榜</TabsTrigger>
      </TabsList>
      
      <TabsContent value="feed" className="space-y-4 mt-4">
        {/* Feed content */}
      </TabsContent>
      
      <TabsContent value="leaderboard" className="space-y-4 mt-4">
        {/* Leaderboard content */}
      </TabsContent>
    </Tabs>
  );
}
```

#### React Native 版本
```tsx
import { Tabs, TabContent } from '@/components/ui';
import { useState } from 'react';
import { View, StyleSheet } from 'react-native';

export function Example() {
  const [activeTab, setActiveTab] = useState('feed');

  return (
    <Tabs
      items={[
        { value: 'feed', label: '动态' },
        { value: 'leaderboard', label: '排行榜' },
      ]}
      defaultValue="feed"
      onValueChange={setActiveTab}
    >
      {activeTab === 'feed' && (
        <View style={styles.content}>
          {/* Feed content */}
        </View>
      )}
      
      {activeTab === 'leaderboard' && (
        <View style={styles.content}>
          {/* Leaderboard content */}
        </View>
      )}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  content: {
    marginTop: 16,
  },
});
```

---

## 🎯 布局转换示例

### Web: Flexbox + Tailwind
```tsx
<div className="flex gap-3 items-center">
  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-xl">
    👨
  </div>
  <div className="flex-1">
    <p className="font-medium">{post.user.name}</p>
    <p className="text-xs text-muted-foreground">
      连续打卡 {post.user.days} 天
    </p>
  </div>
</div>
```

### React Native: StyleSheet
```tsx
<View style={styles.userHeader}>
  <View style={styles.userAvatar}>
    <Text style={styles.avatarText}>👨</Text>
  </View>
  <View style={styles.userInfo}>
    <Text style={styles.userName}>{post.user.name}</Text>
    <Text style={styles.userMeta}>
      连续打卡 {post.user.days} 天
    </Text>
  </View>
</View>

const styles = StyleSheet.create({
  userHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7c3aed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  userMeta: {
    fontSize: 12,
    color: '#6b7280',
  },
});
```

---

## 🔗 事件处理转换

### Web: 事件更简洁
```tsx
// Click handler
<button onClick={() => toggleLike(post.id)}>
  <Heart />
</button>

// Form input
<input
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  className="border rounded px-3 py-2"
/>
```

### React Native: 显式处理
```tsx
// Press handler
<TouchableOpacity onPress={() => toggleLike(post.id)}>
  <MaterialCommunityIcons name="heart" size={20} />
</TouchableOpacity>

// Text input
<TextInput
  value={message}
  onChangeText={setMessage}
  style={styles.input}
/>
```

---

## 📏 尺寸单位转换

| 说明 | Web (Tailwind) | React Native |
|-----|-----|-----|
| 小间距 | `gap-2`, `p-2` | 8px |
| 标准间距 | `gap-3`, `p-4` | 12-16px |
| 大间距 | `gap-6`, `p-6` | 20-24px |
| 按钮高度 | `h-10`, `h-12` | 40px, 48px |
| 卡片圆角 | `rounded-lg`, `rounded-2xl` | 12px, 16px |
| 图标大小 | `w-5`, `w-6` | 20px, 24px |

---

## 🎨 颜色值转换参考

| Tailwind | Hex | RGB | 用途 |
|---------|-----|-----|------|
| `primary` | `#7c3aed` | `124, 58, 237` | 主色 |
| `primary/10` | `#7c3aed19` | 半透明 | 背景 |
| `white/20` | `#ffffff33` | 白色半透明 | 覆盖层 |
| `muted-foreground` | `#6b7280` | `107, 114, 128` | 次要文本 |
| `border` | `#e5e7eb` | `229, 231, 235` | 边框 |
| `green-500` | `#10b981` | `16, 185, 129` | 成功色 |
| `yellow-400` | `#facc15` | `250, 204, 21` | 警告色 |
| `red-500` | `#ef4444` | `239, 68, 68` | 错误色 |

---

## 🚀 状态管理转换

### Web: React Hooks (useState)
```tsx
const [likedPosts, setLikedPosts] = useState<number[]>([]);

const toggleLike = (postId: number) => {
  setLikedPosts((prev) =>
    prev.includes(postId)
      ? prev.filter((id) => id !== postId)
      : [...prev, postId]
  );
};
```

### React Native: 相同写法
```tsx
const [likedPosts, setLikedPosts] = useState<number[]>([]);

const toggleLike = (postId: number) => {
  setLikedPosts((prev) =>
    prev.includes(postId)
      ? prev.filter((id) => id !== postId)
      : [...prev, postId]
  );
};
```

### 使用 Zustand (推荐用于全局状态)
```tsx
// store/communityStore.ts
import { create } from 'zustand';

interface CommunityState {
  likedPosts: number[];
  toggleLike: (postId: number) => void;
}

export const useCommunityStore = create<CommunityState>((set) => ({
  likedPosts: [],
  toggleLike: (postId) =>
    set((state) => ({
      likedPosts: state.likedPosts.includes(postId)
        ? state.likedPosts.filter((id) => id !== postId)
        : [...state.likedPosts, postId],
    })),
}));

// 在组件中使用
const { likedPosts, toggleLike } = useCommunityStore();
```

---

## ✅ 转换检查清单

使用此清单验证每个模块的转换:

- [ ] 所有 Web 导入转换为 RN 导入
- [ ] 所有 CSS Tailwind 类转换为 StyleSheet
- [ ] 所有 Lucide 图标转换为 Expo 图标
- [ ] 所有 onClick 转换为 onPress
- [ ] 所有文本用 `<Text>` 包装
- [ ] 所有容器用 `<View>` 包装
- [ ] 所有按钮用 `<Button>` 或 `<TouchableOpacity>`
- [ ] 所有输入用 `<TextInput>`
- [ ] 所有列表用 `<ScrollView>` 或 `<FlatList>`
- [ ] 所有样式定义在 `StyleSheet.create()`
- [ ] 所有颜色值转换为十六进制代码
- [ ] 所有尺寸转换为像素值
- [ ] 所有响应式设计改为移动优先

---

## 🔍 常见陷阱

### ❌ 错误做法
```tsx
// 不要直接在 React Native 中使用 CSS
<View className="flex gap-3 items-center p-4">
  <Text className="text-lg font-bold">不工作！</Text>
</View>

// 不要忘记包装文本
<View>这样会错</View>

// 不要使用 onClick
<Button onClick={() => doSomething()}>错误</Button>
```

### ✅ 正确做法
```tsx
// 使用 StyleSheet
<View style={styles.container}>
  <Text style={styles.title}>正确！</Text>
</View>

// 总是用 Text 包装文本内容
<View>
  <Text>这样对</Text>
</View>

// 使用 onPress
<Button onPress={() => doSomething()}>正确</Button>
```

---

## 📚 快速参考

### 常用 RN 组件
```tsx
import {
  View,           // 容器（div 替代）
  Text,           // 文本（p/span 替代）
  ScrollView,     // 可滚动容器
  FlatList,       // 列表（高效）
  TouchableOpacity, // 可点击区域
  TextInput,      // 输入框
  Image,          // 图片
  StyleSheet,     // 样式 API
  SafeAreaView,   // 安全区域（处理刘海屏）
} from 'react-native';
```

### 常用 Styles
```tsx
const styles = StyleSheet.create({
  container: {
    flex: 1,                      // 全屏
    backgroundColor: '#ffffff',   // 背景色
    paddingHorizontal: 20,        // 水平内边距
    paddingVertical: 16,          // 垂直内边距
    flexDirection: 'row',         // 行布局
    justifyContent: 'space-between', // 主轴对齐
    alignItems: 'center',         // 交叉轴对齐
    gap: 12,                      // 元素间距
    borderRadius: 12,             // 圆角
    borderWidth: 1,               // 边框
    borderColor: '#e5e7eb',       // 边框色
  },
});
```

---

## 🎓 学习资源

- [React Native 官方文档](https://reactnative.dev/docs/getting-started)
- [Expo Router 导航](https://docs.expo.dev/routing/introduction/)
- [StyleSheet API](https://reactnative.dev/docs/stylesheet)
- [Expo 图标库](https://icons.expo.fyi/)

---

**转换完成！现在你已经了解 Web 到 RN 的所有映射。** 🎉

---

*参考指南 v1.0*  
*最后更新: 2024*
