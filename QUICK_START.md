# 🚀 React Native 健身应用 - 快速入门

## 📋 项目概览

这是一个全功能的 React Native 健身应用，从原始 React Web 应用完整迁移而来，保留了所有原始 UI 设计。

**核心模块：**
- 🏋️ **训练** - 查看训练计划和今日训练状态
- 📊 **记录** - 营养追踪和训练历史
- 🧠 **AI教练** - 获取 AI 驱动的个性化建议
- 👥 **社区** - 分享成就和查看排行榜
- 👤 **个人资料** - 用户信息和设置

## 🎯 开始

### 前置要求
- Node.js 16+
- npm 或 yarn
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### 安装和运行

```bash
# 进入项目目录
cd FitnessAppMobile

# 安装依赖
npm install

# 启动开发服务器
npx expo start
```

### 运行应用

启动后，Expo Metro 将显示以下选项：

```
Press i │ open iOS Simulator
Press a │ open Android Emulator
Press w │ open web
Press e │ toggle development mode
Press j │ open debugger
Press r │ reload app
Press s │ stop
```

选择你的平台：
- **iOS**: 按 `i` (需要 macOS)
- **Android**: 按 `a` (需要 Android Studio)
- **Web**: 按 `w` (快速预览)
- **物理设备**: 使用 Expo Go 应用扫描二维码

## 📁 项目结构

```
FitnessAppMobile/
├── app/                          # Expo Router 路由 (导航层)
│   └── (tabs)/
│       ├── _layout.tsx          # 底部标签导航配置
│       ├── training.tsx         # 训练模块入口
│       ├── record.tsx           # 记录模块入口
│       ├── ai-coach.tsx         # AI教练模块入口
│       ├── community.tsx        # 社区模块入口
│       └── profile.tsx          # 个人资料模块入口
│
├── src/                          # 应用逻辑层
│   ├── core/                     # 核心工具
│   │   ├── constants/           # 常量定义
│   │   ├── utils/               # 工具函数
│   │   └── types/               # TypeScript 类型
│   ├── data/                     # 数据访问层
│   │   ├── api/                 # API 客户端
│   │   ├── storage/             # 本地存储
│   │   └── repositories/        # 数据仓库
│   ├── business-logic/           # 业务逻辑层
│   │   ├── hooks/               # 自定义 Hooks
│   │   ├── services/            # 业务服务
│   │   └── store/               # Zustand 状态管理
│   └── modules/                  # 功能模块 (显示层)
│       ├── training/
│       ├── record/
│       ├── ai-coach/
│       ├── community/
│       └── profile/
│
├── components/                   # 共享组件
│   ├── ui/                       # UI 组件库
│   │   ├── Card.tsx            # 卡片组件
│   │   ├── Button.tsx          # 按钮组件
│   │   ├── Badge.tsx           # 徽章组件
│   │   ├── Progress.tsx        # 进度条
│   │   ├── Tabs.tsx            # 标签页
│   │   ├── TextInput.tsx       # 文本输入
│   │   └── index.ts            # 组件导出
│   └── ...其他通用组件
│
├── MIGRATION_COMPLETE.md        # 迁移完成报告
├── QUICK_START.md               # 本文档
├── app.json                      # Expo 配置
├── package.json                  # 依赖管理
├── tsconfig.json               # TypeScript 配置
└── README.md                    # 项目说明

```

## 🎨 UI 组件库

所有 UI 组件都在 `components/ui/` 中，支持开箱即用：

```tsx
import { Card, Button, Badge, Progress, Tabs, TabContent } from '@/components/ui';

// Card 组件
<Card style={styles.card}>
  <Text>内容</Text>
</Card>

// Button 组件（3种变体）
<Button variant="default">主要按钮</Button>
<Button variant="outline">次要按钮</Button>
<Button variant="ghost">幽灵按钮</Button>

// Badge 组件
<Badge variant="secondary">标签</Badge>

// Progress 组件
<Progress value={65} color="#7c3aed" />

// Tabs 组件
<Tabs items={[
  { value: 'tab1', label: '标签1' },
  { value: 'tab2', label: '标签2' },
]}>
  {/* 内容 */}
</Tabs>
```

## 📱 屏幕导航

应用使用底部标签导航，快速访问所有模块：

| 图标 | 模块 | 路径 |
|------|------|------|
| 🏋️ | 训练 | `app/(tabs)/training` |
| 📊 | 记录 | `app/(tabs)/record` |
| 🧠 | AI教练 | `app/(tabs)/ai-coach` |
| 👥 | 社区 | `app/(tabs)/community` |
| 👤 | 个人资料 | `app/(tabs)/profile` |

## 🔧 开发指南

### 添加新屏幕

1. 创建模块文件夹
```bash
mkdir -p src/modules/new-module/screens
```

2. 创建屏幕文件
```tsx
// src/modules/new-module/screens/NewModuleScreen.tsx
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';

export default function NewModuleScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>新模块</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
});
```

3. 添加到导航 (如果需要新标签)
```tsx
// app/(tabs)/_layout.tsx 中添加
<Tabs.Screen
  name="new-module"
  options={{
    title: '新模块',
    tabBarIcon: ({ color, size }) => (
      <MaterialCommunityIcons name="icon-name" color={color} size={size} />
    ),
  }}
/>
```

4. 创建入口文件
```tsx
// app/(tabs)/new-module.tsx
import NewModuleScreen from '@/src/modules/new-module/screens/NewModuleScreen';
export default NewModuleScreen;
```

### 使用状态管理（Zustand）

```tsx
// src/business-logic/store/moduleStore.ts
import { create } from 'zustand';

interface ModuleState {
  count: number;
  increment: () => void;
}

export const useModuleStore = create<ModuleState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

// 在组件中使用
import { useModuleStore } from '@/src/business-logic/store/moduleStore';

export default function SomeScreen() {
  const { count, increment } = useModuleStore();
  
  return (
    <Button onPress={increment}>
      Count: {count}
    </Button>
  );
}
```

### 使用 API 客户端

```tsx
// src/data/api/client.ts
export const apiClient = {
  async fetchTrainingPlans() {
    // 实现 API 调用
  },
};

// 在服务中使用
import { apiClient } from '@/src/data/api/client';

export const trainingService = {
  async getPlans() {
    return await apiClient.fetchTrainingPlans();
  },
};
```

## 🎯 接下来做什么

### 第1步: 配置 API (必需)
更新 `src/data/api/client.ts` 中的 API 端点

### 第2步: 实现数据流
在各模块的 `screens/` 中集成 hooks 和 store

### 第3步: 添加本地存储
使用 AsyncStorage 在 `src/data/storage/` 中存储用户数据

### 第4步: 添加身份验证
实现登录/注册流程

### 第5步: 部署
使用 EAS Build 为 iOS/Android 构建

## 📚 有用的资源

- [Expo 文档](https://docs.expo.dev/)
- [Expo Router 指南](https://docs.expo.dev/routing/introduction/)
- [React Native 文档](https://reactnative.dev/)
- [Zustand 文档](https://github.com/pmndrs/zustand)
- [TypeScript React Native](https://react-native.dev/docs/typescript)

## 🐛 调试

### Metro Bundler 调试
按 `j` 在 Expo Metro 中打开调试器

### 开发者菜单
- iOS: `Cmd + D` 或摇晃设备
- Android: `Cmd + M` (Mac) 或 `Ctrl + M` (Windows/Linux)

## ⚙️ 常见问题

**Q: 应用无法启动？**
A: 
```bash
# 清理缓存并重新安装
rm -rf node_modules package-lock.json
npm install
npx expo start --clear
```

**Q: 如何在设备上运行？**
A: 
1. 安装 Expo Go 应用
2. 运行 `npx expo start`
3. 扫描 Metro Bundler 显示的二维码

**Q: 如何更改主题颜色？**
A: 编辑各个文件中的颜色常量，主色为 `#7c3aed`

## 📞 获取帮助

- 查看 `MIGRATION_COMPLETE.md` 了解完整迁移细节
- 检查 `app.json` 了解 Expo 配置
- 阅读各个模块中的代码注释

---

**准备好了吗？运行 `npx expo start` 开始吧！** 🚀

**祝你开发愉快！** ✨
