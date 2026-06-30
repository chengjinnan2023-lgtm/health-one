# ROLE-003 — Button-Level Permission Control

Document ID : ROLE-003
Title       : 门店按钮级权限控制实施报告
Version     : 1.0
Status      : Complete
Owner       : Product Office
Created     : 2026-06-30
Depends On  : ROLE-001, ROLE-002

---

## 1. Scope

Frontend-only button visibility control based on `staff.role` from JWT. No backend RBAC. No DB changes.

## 2. Buttons Hidden / Shown by Role

| 位置 | 按钮/入口 | 店长 | 健康管理师 | 服务人员 |
|------|---------|------|----------|---------|
| 导航栏 | 客户管理 | ✅ | ✅ | ✅ |
| 导航栏 | 店员管理（占位） | ✅ | ❌ | ❌ |
| S1 | + 新建客户 | ✅ | ✅ | ❌ |
| S6 | 随访表单（创建随访） | ✅ | ✅ | ❌ |
| S6 | 服务人员提示（代替随访表单） | ❌ | ❌ | ✅ |

### 隐藏逻辑

```
服务人员 (staff.role === "服务人员"):
  → S1: 隐藏"+ 新建客户"按钮 + 新建表单
  → S6: 隐藏随访表单，显示"随访由店长或健康管理师创建"

非店长 (staff.role !== "店长"):
  → 导航栏: 隐藏"店员管理"入口
```

## 3. Shared Actions

所有角色的 S1-S6 主流程按钮不受影响：
- S2: 激活健康元、记录健康关注、新建服务
- S3: 保存健康关注
- S4: 保存并继续
- S5: 保存反馈

## 4. Files Changed

```
M frontend/src/layouts/BaseLayout.tsx                (+店长专属导航)
M frontend/src/screens/CustomerSearchScreen.tsx       (+canCreate gate)
M frontend/src/screens/FollowUpScreen.tsx             (+canManageFollowUp gate)
```

## 5. Deferred Permission Work

| 功能 | 原因 | Target |
|------|------|--------|
| 后端 API 角色拦截 | 需要 RBAC 引擎 | Sprint-5+ |
| 归档/恢复按钮权限 | 归档功能尚未实现（PILOT-016） | Sprint-4 |
| 标签编辑权限 | 标签功能尚未实现（PILOT-016） | Sprint-4 |
| 观察者只读模式 | 需要所有页面按钮级控制 | Sprint-5 |
| 权限配置 UI | 过度设计 | Post-MVP |

## 6. Validation Result

```
npm run build: ✓ 76ms
tsc --noEmit:  ✓
ruff check:    ✓
pytest:        22 passed
```

---

## 7. End of Document

ROLE-003 implements minimal button-level permission control per ROLE-001.

**店长 sees everything. 健康管理师 sees customer flow. 服务人员 sees service+feedback only.**
