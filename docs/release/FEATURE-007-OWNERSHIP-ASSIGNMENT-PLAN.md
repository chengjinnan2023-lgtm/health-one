# FEATURE-007 — Customer Ownership & Follow-Up Assignment MVP Plan

Document ID : FEATURE-007
Title       : 客户归属与随访分配 MVP 执行计划
Version     : 1.0
Status      : Plan
Owner       : Development Office
Created     : 2026-07-01
Depends On  : FEATURE-006 (Staff Management), FEATURE-004 (Follow-Up Queue), MANAGER-001

---

## 1. Scope

实现客户归属与随访分配的最小 MVP。完成角色分化的"另一半"——让健康管理师看到自己的客户和随访。

**In scope:**
- 客户可指定 1 位健康管理师作为负责人（`assigned_staff_id`）
- 店长可在 S2 设置/变更负责人
- 随访可分配给健康管理师（复用已有 `follow_up_schedule.assigned_staff`）
- 待跟进队列显示归属人
- 健康管理师首页使用 follow-up-queue API 优先展示分配给自己的待跟进

**Not in scope:**
- 自动分配 / 轮询分配
- 通知提醒
- 复杂历史审计
- 服务人员分配（仅健康管理师和店长）
- 总部跨店

---

## 2. Data Changes

### 2.1 Migration 005 — add assigned_staff_id to health_identity

```sql
ALTER TABLE health_identity
  ADD COLUMN assigned_staff_id UUID;
```

**Nullable.** 现有客户不受影响。无 FK 约束（Staff 在 SQLite Store DB，无法跨 DB 建立 FK）。
与 `HealthPlan.created_by` 相同的 app-level FK 模式。

### 2.2 Model change

```python
# health_one/platform/models/identity.py
assigned_staff_id: Mapped[uuid.UUID | None] = mapped_column(
    UUID(as_uuid=True), nullable=True,
    comment="Application-level FK → Staff (Store DB). The health advisor responsible for this customer.",
)
```

### 2.3 No changes to HealthPlan model

`follow_up_schedule.assigned_staff` 字段已存在于 JSONB schema 中（`plan.py:FollowUpSchedule.assigned_staff`），无需模型变更。

---

## 3. API Changes

### 3.1 Schema: IdentityResponse + IdentityUpdate

```python
# IdentityResponse — 新增 2 字段
assigned_staff_id: str | None = None
assigned_staff_name: str | None = None  # 前端展示用

# IdentityUpdate — 新增 1 字段
assigned_staff_id: str | None = None    # 传 null 清除归属
```

### 3.2 PATCH /api/identities/{id}

接受 `assigned_staff_id`。验证 staff_id 存在于 Store DB（同一门店）。

### 3.3 GET /api/dashboard/follow-up-queue

新增 optional query param: `staff_id`（过滤分配给指定店员的待跟进）。

每项 response 新增:
```json
{
  "assigned_staff_id": "uuid" | null,
  "assigned_staff_name": "张三" | null
}
```

- `source=followup`: 从 `follow_up_schedule.assigned_staff` 读取
- `source=tag`: 从 `health_identity.assigned_staff_id` 读取
- 通过 Store DB 批量查询 staff 姓名

### 3.4 Staff name resolution helper

新增 `_resolve_staff_names(staff_ids: set[str]) -> dict[str, str]`:
- 批量查询 Store DB 的 staff 表
- 返回 `{staff_id: display_name}` 映射
- 在 `follow-up-queue` 和 `identity` 响应中使用

---

## 4. Frontend Changes

### 4.1 S2 — CustomerSummaryScreen

在客户名下方新增负责人显示：
```
张伟                            [已激活]
负责人：张三（健康管理师）[变更 ▾]   ← 仅店长可见
```

- 显示当前负责人姓名 + 角色
- 店长可见 [变更] 下拉：列出本店健康管理师 + 店长
- 选择后 PATCH /api/identities/{id} {assigned_staff_id: "..."}

### 4.2 FollowUpQueueScreen

每项新增归属人显示：
```
张伟                    [已激活]
📞 电话随访 · 负责人：张三 · 计划 2026/07/03
```

### 4.3 S6 — FollowUpScreen

创建随访表单新增"分配给"下拉：
```
随访方式：[电话 ▾]
计划时间：[2026-07-03]
分配给：  [张三（健康管理师）▾]   ← 新增
```

下拉列出本店健康管理师 + 店长。默认选中当前客户的 assigned_staff_id（如有）。

### 4.4 HealthAdvisorDashboard

改为调用 follow-up-queue API（替代现有 N+1 查询）:

```tsx
// BEFORE: N+1 — get identities → for each get plans
// AFTER: Single call
const data = await api.get<QueueData>(
  `/api/dashboard/follow-up-queue?staff_id=${staff.staff_id}`
);
```

这是本次改动中最大的优化——健康管理师首页从 N+1（最多 5×3=15 次请求）变为 1 次请求。店长首页保持不变（仍使用 manager dashboard API）。

### 4.5 StaffManagementScreen

无需改动。`assigned_staff_id` 是逻辑引用——删除店员前店长应手动重新分配其负责的客户。MVP 不做级联校验。

---

## 5. Files Changed

```
A health_one/platform/alembic/versions/005_add_assigned_staff.py  (migration)
M health_one/platform/models/identity.py                          (+4: column)
M health_one/platform/schemas/identity.py                         (+2: schema fields)
M health_one/platform/routers/identity.py                         (+15: handle assigned_staff_id in PATCH + resolve name in GET)
M health_one/platform/routers/dashboard.py                        (+30: staff_id filter + resolve names)
M frontend/src/screens/CustomerSummaryScreen.tsx                  (+30: owner display + change dropdown)
M frontend/src/screens/FollowUpQueueScreen.tsx                    (+5: assignee display)
M frontend/src/screens/FollowUpScreen.tsx                         (+20: assign dropdown)
M frontend/src/screens/HealthAdvisorDashboard.tsx                 (+30: use follow-up-queue API, replace N+1)
```

---

## 6. No Changes

```
- HealthPlan 模型 / 表结构
- follow_up_schedule JSONB schema（已含 assigned_staff）
- 服务人员相关逻辑
- RFC / ADR / PRD
- AI 功能
```

---

## 7. Risk

| 风险 | 等级 | 缓解 |
|------|------|------|
| Migration 005 失败 | Low | ADD COLUMN nullable，对现有数据无影响 |
| assigned_staff_id 指向不存在的 staff | Low | API 写入时验证 staff 存在；读取时 display "未知" |
| 跨 DB（PG→SQLite）staff name 查询性能 | Very Low | < 10 店员，单次查询 < 5ms |
| 店长删除店员后有孤儿 assigned_staff_id | Low | MVP 接受——前端显示"已离职"，店长手动重新分配 |
| 健康管理师 Dashboard N+1→1 行为变化 | Low | follow-up-queue 返回全量 + staff_id 过滤，更准确 |

---

## 8. End of Document

FEATURE-007 defines the customer ownership and follow-up assignment MVP.

**1 migration. 2 model/schema changes. 9 files touched. Completes the role differentiation started in ROLE-001.**
