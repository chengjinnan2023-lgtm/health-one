# ROLE-002 — Store Home Split by Role

Document ID : ROLE-002
Title       : 门店首页角色分化实施报告
Version     : 1.0
Status      : Complete
Owner       : Product Office
Created     : 2026-06-30
Depends On  : ROLE-001 Store Roles Proposal

---

## 1. Scope

Implement role-based home screens per ROLE-001 MVP recommendation.

**In scope:** Home page renders different content for 店长 vs 健康管理师.
**Not in scope:** RBAC engine, button-level permissions, backend role enforcement.

## 2. Role-Based Home Design

### 店长首页 (`ManagerDashboard`)

```
┌──────────────────────────────────────────┐
│ 店长工作台                                │
│ 张三，欢迎回来                            │
│                                          │
│  [ 客户总数 ]  [ 已激活 ]  [ 待激活 ]      │
│       12          10          2          │
│                                          │
│  [ 客户管理 ]    [ 运营统计(Sprint-4) ]   │
│                                          │
│  最近客户                                 │
│  张伟 — 已激活                            │
│  李娜 — 待激活                            │
└──────────────────────────────────────────┘
```

- 数据来源: `GET /api/identities/?limit=10`
- 显示：客户总数、已激活数、待激活数（实时计数）
- 快捷入口：客户管理、运营统计（占位）
- 客户列表：可直接点击进入 S2

### 健康管理师首页 (`HealthAdvisorDashboard`)

```
┌──────────────────────────────────────────┐
│ 健康管理师工作台                           │
│ 李四，今天有 2 个待随访客户                │
│                                          │
│  ⏳ 待随访                                │
│  张伟 — phone · 7/3                      │
│  李娜 — wechat · 7/4                     │
│                                          │
│  📋 最近客户                              │
│  张伟 — 已激活                            │
│  王五 — 已激活                            │
│                                          │
│  [ 进入客户管理 ]                         │
└──────────────────────────────────────────┘
```

- 待随访：遍历最近 5 个活跃客户，查询 pending 状态的 Plan
- 最近客户：`GET /api/identities/?limit=10`
- 快捷入口：进入客户管理（跳转 S1）

### 路由逻辑 (`HomeScreen`)

```tsx
function HomeScreen() {
  const { staff } = useAuth();
  if (staff?.role === "店长") return <ManagerDashboard />;
  return <HealthAdvisorDashboard />;  // 健康管理师、服务人员、观察者默认
}
```

- 仅店长看到 ManagerDashboard
- 其他所有角色看到 HealthAdvisorDashboard
- 基于现有 JWT `role` 字段判断

## 3. Files Changed

```
A frontend/src/screens/ManagerDashboard.tsx         (店长首页)
A frontend/src/screens/HealthAdvisorDashboard.tsx    (健康管理师首页)
M frontend/src/App.tsx                               (+HomeScreen + route)
```

## 4. Validation Result

```
npm run build: ✓ 75ms
tsc --noEmit:  ✓
ruff check:    ✓
pytest:        22 passed
```

## 5. What Is Still Shared

| 模块 | 店长 | 健康管理师 | 说明 |
|------|------|----------|------|
| S1 客户搜索/新建 | ✅ | ✅ | 完全共用 |
| S2 客户总览 | ✅ | ✅ | 完全共用 |
| S3 健康关注 | ✅ | ✅ | 完全共用 |
| S4 服务记录 | ✅ | ✅ | 完全共用 |
| S5 服务反馈 | ✅ | ✅ | 完全共用 |
| S6 随访 | ✅ | ✅ | 完全共用 |
| 登录/退出 | ✅ | ✅ | 完全共用 |
| **首页** | **店长首页** | **健康管理师首页** | **唯一差异化** |
| 导航 | 客户管理 | 客户管理 | 共用 |

## 6. What Is Deferred

| 功能 | 原因 | 目标 Sprint |
|------|------|-----------|
| 按钮级权限控制（归档、新建客户等） | 前端条件渲染 + 后端校验 | Sprint-5 |
| 真实验证统计数据（非仅计数） | 需要跨 identity 聚合 API | Sprint-4 |
| 运营统计页面 | 需要数据聚合后端 | Sprint-4 |
| 店员管理页面 | 需要 Staff CRUD API | Sprint-5 |
| 观察者只读模式 | 需要按钮级权限 | Sprint-5 |
| 后端 API 角色拦截 | RBAC 引擎 | Sprint-5+ |

---

## 7. End of Document

ROLE-002 implements minimal role-based home page differentiation per ROLE-001.

**店长 sees overview. 健康管理师 sees todo-list. All S1-S6 screens remain shared.**
