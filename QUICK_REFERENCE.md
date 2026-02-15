/**
 * 架构设计总结 - 一页纸快速参考
 */

# 🏗️ 健身应用架构设计 - 快速参考

## 核心架构

```
┌─────────────────────────────────────────────────────────┐
│  📱 Presentation Layer (表现层)                         │
│  • Screens: HomeScreen, TrainingScreen, ProfileScreen  │
│  • Components: Button, Card, Input, etc.               │
│  • Navigation: React Navigation 配置                    │
│  ✅ 职责: UI 渲染和用户交互                             │
└──────────────────────┬──────────────────────────────────┘
                       │ 依赖关系
                       ↓
┌─────────────────────────────────────────────────────────┐
│  🧠 Business Logic Layer (业务逻辑层)                   │
│  • Hooks: useUser(), useTraining(), useAuth()          │
│  • Store: appStore (Zustand) - 全局状态                │
│  • Services: AuthService, TrainingService              │
│  ✅ 职责: 核心业务逻辑处理和状态管理                    │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────┐
│  🗄️ Data Access Layer (数据访问层)                      │
│  • API Client: 统一的 HTTP 请求处理                     │
│  • Storage: 本地存储 (AsyncStorage)                     │
│  • Repositories: UserRepository, WorkoutRepository      │
│  • Mappers: 数据转换和格式化                             │
│  ✅ 职责: 数据获取、缓存和存储                           │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────┐
│  🔧 Core Services Layer (核心服务层)                    │
│  • Types: User, Workout, AuthState, ApiResponse         │
│  • Constants: ROUTES, HTTP_STATUS, CACHE_KEYS           │
│  • Utils: validators, logger, helpers                    │
│  • Config: API_URL, cache settings                      │
│  ✅ 职责: 工具函数、常量和跨切关注点                    │
└─────────────────────────────────────────────────────────┘
```

## 数据流示例：用户登录

```
用户输入 Email & Password
        ↓
   [表现层]
   LoginScreen → 调用 store.login()
        ↓
   [业务逻辑层]
   appStore → 调用 authService.login()
        ↓
   [业务逻辑层]
   AuthService.login() → 调用 apiClient.post()
        ↓
   [数据访问层]
   apiClient.post() → 调用 fetch()
        ↓
   [后端 API]
   /auth/login 返回 { user, token }
        ↓
   [数据访问层]
   保存 token 到 AsyncStorage
        ↓
   [业务逻辑层]
   更新 store 状态
        ↓
   [表现层]
   组件重新渲染，显示登录成功
```

## 项目结构（完整）

```
FitnessAppMobile/
│
├── src/
│   │
│   ├── 📱 presentation/              ← 表现层
│   │   ├── screens/
│   │   │   ├── auth/
│   │   │   ├── training/
│   │   │   ├── community/
│   │   │   └── profile/
│   │   ├── components/
│   │   │   ├── common/               (通用组件)
│   │   │   └── layouts/              (布局组件)
│   │   └── navigation/
│   │
│   ├── 🧠 business-logic/            ← 业务逻辑层
│   │   ├── hooks/                    (自定义 Hook)
│   │   ├── store/                    (Zustand 全局状态)
│   │   ├── services/                 (业务服务)
│   │   └── contexts/                 (React Context)
│   │
│   ├── 🗄️ data/                      ← 数据访问层
│   │   ├── api/                      (HTTP 客户端)
│   │   ├── storage/                  (本地存储)
│   │   ├── repositories/             (数据仓库)
│   │   └── mappers/                  (数据转换)
│   │
│   ├── 🔧 core/                      ← 核心服务层
│   │   ├── types/                    (类型定义)
│   │   ├── constants/                (常量)
│   │   ├── utils/                    (工具函数)
│   │   ├── services/                 (核心服务)
│   │   └── config/                   (配置)
│   │
│   ├── 📦 modules/                   ← 独立功能模块
│   │   ├── training/
│   │   ├── community/
│   │   ├── ai-coach/
│   │   └── profile/
│   │
│   └── App.tsx
│
├── tests/                            ← 测试文件
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docs/                             ← 文档
│   ├── ARCHITECTURE.md               (详细架构)
│   ├── DEVELOPMENT.md                (开发指南)
│   ├── PROJECT_STRUCTURE.md          (项目结构)
│   └── WEB_vs_MOBILE.md              (Web vs Mobile)
│
├── app.json                          (Expo 配置)
├── package.json
├── tsconfig.json
└── README.md
```

## 核心特性

### 1️⃣ 高内聚，低耦合

```
✅ 高内聚: 相关功能集中在一个模块中
├── 训练模块包含所有训练相关的代码
├── 社区模块包含所有社交相关的代码
└── 每个模块内部逻辑紧密

❌ 低耦合: 模块之间的依赖最小
├── 通过 Store 通信
├── 通过导航参数传递数据
└── 不跨模块直接导入业务逻辑
```

### 2️⃣ 易于测试

```
单元测试 (60%)           集成测试 (30%)          E2E 测试 (10%)
├── Hook 测试           ├── Repository 测试      ├── 完整用户流程
├── Service 测试        ├── API 客户端测试       ├── 跨屏幕交互
├── Util 测试           └── Store 测试           └── 真实设备测试
└── Component 测试
```

### 3️⃣ 易于扩展

```
添加新功能 (例如: AI 教练)
├── 1. 创建新模块: modules/ai-coach/
├── 2. 定义类型: core/types/index.ts
├── 3. 创建 Repository (如果需要新 API)
├── 4. 创建 Hook 和 Service
├── 5. 创建 UI 组件和屏幕
└── 6. 在导航中注册
```

### 4️⃣ 便于团队协作

```
Team Members
├── Alice: 认证模块 (Auth)
├── Bob: 训练模块 (Training)
├── Carol: UI 组件库
├── David: API 和存储
└── Eve: 测试工程师

✅ 各团队成员可以独立开发
✅ 减少代码冲突
✅ 定期集成测试
```

## 关键设计决策

| 决策 | 原因 | 替代方案 |
|------|------|--------|
| **Zustand** 状态管理 | 轻量级、易学、TypeScript 支持 | Redux, MobX, Recoil |
| **React Hooks** | 函数式、易于复用逻辑 | Class Components |
| **Repository Pattern** | 隐藏数据源细节 | 直接 API 调用 |
| **多层架构** | 清晰的职责分离 | MVC, MVVM |
| **AsyncStorage** | React Native 标准 | SQLite, Realm |
| **Jest + RTL** | 标准的测试框架 | Mocha, Cypress |

## 快速命令

```bash
# 开发
npm start

# 测试
npm test

# 构建
npm run build:ios
npm run build:android

# 代码检查
npm run lint

# 代码格式化
npm run format
```

## 文件命名约定

```
✅ 正确的命名:
  HomeScreen.tsx          (屏幕)
  Button.tsx              (组件)
  useAuth.ts              (Hook)
  AuthService.ts          (Service)
  UserRepository.ts       (Repository)
  user.types.ts           (类型)
  auth.constants.ts       (常量)
  formatDate.ts           (工具函数)

❌ 错误的命名:
  home.tsx                (缺少 Screen)
  button.tsx              (小写)
  auth.ts                 (不清晰)
  user_service.ts         (使用下划线)
```

## 架构检查清单

启动项目前，验证：

- [ ] 所有文件夹结构已创建
- [ ] tsconfig.json 已配置
- [ ] package.json 已安装必要依赖
- [ ] 环境变量已设置 (.env)
- [ ] API 基础 URL 已配置
- [ ] 本地存储命名空间已定义
- [ ] 导航结构已确定
- [ ] 全局 Store 已初始化
- [ ] 日志系统已配置
- [ ] 测试框架已设置

## 常见问题解答

**Q: 数据应该存在哪里？**
A: 
- 单一屏幕 → useState
- 多个相关屏幕 → Custom Hook
- 全局应用数据 → Zustand Store

**Q: 何时创建 Service？**
A: 当有复杂的业务逻辑，超过一个 Hook 的复杂性时

**Q: 如何处理错误？**
A: 
- 在各层都有 try-catch
- 错误传回上层处理
- 使用统一的错误类 AppError
- 集成错误上报服务

**Q: 如何做离线支持？**
A: Repository 的缓存，加上网络状态检测

## 资源

- 📚 完整文档: [ARCHITECTURE.md](./ARCHITECTURE.md)
- 🚀 开发指南: [DEVELOPMENT.md](./DEVELOPMENT.md)
- 📂 项目结构: [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
- 🌐 Web vs Mobile: [WEB_vs_MOBILE.md](./WEB_vs_MOBILE.md)

---

## 架构优势总结

| 维度 | 收益 |
|------|------|
| 👥 **团队协作** | 模块独立，分工明确，减少冲突 |
| 🧪 **测试覆盖** | 各层可独立测试，提高代码质量 |
| 🚀 **开发效率** | 清晰的架构，快速定位问题 |
| 📦 **代码复用** | Hook、Service、Util 高复用 |
| 🔄 **易于维护** | 职责清晰，改动影响范围小 |
| 📈 **易于扩展** | 新功能只需添加新模块 |
| 🐛 **易于调试** | 错误源头清晰，快速定位 |
| 🎯 **可测试性** | 单元测试、集成测试、E2E 测试完整 |

---

**祝你开发愉快！** 🎉🚀

最后更新: 2026-02-13
