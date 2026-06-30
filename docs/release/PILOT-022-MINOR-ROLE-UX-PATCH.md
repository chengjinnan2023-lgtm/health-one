# PILOT-022 — Minor Role UX Patch Before Expanded Pilot

Document ID : PILOT-022
Title       : 角色 UX 小修 — 扩大试运行前
Version     : 1.0
Status      : Complete
Owner       : Release Office
Audience    : Product / Development
Created     : 2026-06-30
Depends On  : PILOT-021 (Role-Aware Pilot Review — 3 P2 issues identified)

---

## 1. Scope

PILOT-021 技术验证发现 3 个 P2 体验问题。本次修复其中 2 个前端 UX 问题，不做任何功能或架构变更：

| # | PILOT-021 编号 | 问题 | 修复方式 |
|---|--------------|------|---------|
| 1 | P2-1 | 服务人员首页标题硬编码为"健康管理师工作台" | 标题改为 `{staff.role}工作台`，角色自适应 |
| 2 | P2-3 | 服务人员 S6 提示文案缺乏行动引导 | 增加副标题引导 + 图标，明确下一步行动 |

**不在本次修复范围：**

- P2-2（admin 密码不一致）→ 试运行 Briefing 时口头告知，不在代码层面修改
- 后端 RBAC → Sprint-5+
- 任何功能开发或架构变更

---

## 2. Changes Applied

### 2.1 Fix 1 — Dashboard 标题角色自适应

**文件：** `frontend/src/screens/HealthAdvisorDashboard.tsx`

```
- <h1>健康管理师工作台</h1>
+ <h1>{staff?.role || "健康管理师"}工作台</h1>
```

**效果：**

| 角色 | 修改前 | 修改后 |
|------|--------|--------|
| 健康管理师 | 健康管理师工作台 | 健康管理师工作台 |
| 服务人员 | 健康管理师工作台 | **服务人员工作台** |
| 其他（未来） | 健康管理师工作台 | {role}工作台 |

### 2.2 Fix 2 — S6 服务人员提示文案改进

**文件：** `frontend/src/screens/FollowUpScreen.tsx`

```diff
  <div className="bg-white border rounded-lg p-6 text-center">
-   <p>随访由店长或健康管理师创建</p>
+   <div>📋</div>
+   <p className="font-medium">随访由店长或健康管理师创建</p>
+   <p>服务完成后，请提醒店长或健康管理师为这位客户创建随访计划</p>
    <button>返回客户总览</button>
  </div>
```

**改进点：**

| 维度 | 修改前 | 修改后 |
|------|--------|--------|
| 视觉层次 | 单行灰色文字 | 图标 + 主标题 + 副标题 |
| 主标题 | 说明事实 | 说明事实（font-medium 强调） |
| 行动引导 | 无 | "服务完成后，请提醒店长或健康管理师为这位客户创建随访计划" |
| 返回按钮 | 不变 | 不变 |

---

## 3. Validation Result

```
npm run build:   ✅ 76ms（vite + tsc -b）
tsc --noEmit:    ✅ 通过（无类型错误）
ruff check:      ✅ All checks passed（无 Python 变更）
pytest:          ✅ 9/9 passed（test_store_models.py）
```

---

## 4. Files Changed

```
M frontend/src/screens/HealthAdvisorDashboard.tsx    (1 行：标题动态化)
M frontend/src/screens/FollowUpScreen.tsx             (3 行：S6 提示文案增强)
```

---

## 5. Recommendation

```
是否建议 Commit：YES

理由：
  - 仅修改 2 个文件，2 行内容变更
  - 不影响任何业务逻辑或权限逻辑
  - 所有 CI 检查通过
  - 修复了 PILOT-021 中识别的 2 个 P2 UX 问题
  - 服务人员首次登录看到"服务人员工作台"而不再是"健康管理师工作台"
  - S6 提示从纯说明变为行动引导
```

---

## 6. Remaining P2

| # | 问题 | 处理 |
|---|------|------|
| P2-2 | admin 密码为 `health123`（非 `pilot123`） | 试运行 Briefing 口头告知；或统一写入 PILOT-006 Runbook |

---

## 7. End of Document

PILOT-022 records the minor role UX patch applied before the expanded internal pilot.

**2 files. 2 fixes. Zero logic changes. Ready for commit.**
