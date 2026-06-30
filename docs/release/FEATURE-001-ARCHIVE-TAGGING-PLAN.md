# FEATURE-001 — Customer Archive & Tagging MVP Plan

Document ID : FEATURE-001
Title       : 客户归档与标签 MVP 执行计划
Version     : 1.0
Status      : Plan
Owner       : Development Office
Created     : 2026-06-30
Depends On  : PILOT-016, PILOT-017

---

## 1. Scope

实现 PILOT-016 中定义的最小归档+标签+筛选能力。4 个能力：

1. Archive / Unarchive（归档/恢复）
2. Customer Tags（客户标签）
3. S1 Tag Filter（标签筛选）
4. S2 Display & Edit（标签展示+编辑，归档入口）

**不包含：** 永久删除、自动标签、标签统计、批量操作、权限控制。

---

## 2. Data Changes

### 2.1 Migration 004 — add tags to health_identity

```sql
ALTER TABLE health_identity ADD COLUMN tags JSONB NOT NULL DEFAULT '[]';
```

**Migration file:** `health_one/platform/alembic/versions/004_add_tags_to_identity.py`

### 2.2 Model change — HealthIdentity

```python
# health_one/platform/models/identity.py
tags: Mapped[list[str]] = mapped_column(
    JSONB, nullable=False, default=list, server_default="'[]'",
    comment="Customer tags for store-level categorization (free-text)",
)
```

### 2.3 No new tables

标签存储在 JSONB 列，Pilot 阶段客户 < 100 人，无需独立 tags 表。不做 GIN index（MVP 阶段不需要）。

---

## 3. API Changes

### 3.1 NEW: `POST /api/identities/{id}/unarchive`

```
→ activation_status: archived → active
→ Timeline entry: identity_unarchived
→ Response: 200 IdentityResponse
→ Error 409 if not archived
```

### 3.2 MODIFY: `PATCH /api/identities/{id}`

Schema `IdentityUpdate` 新增:
```python
tags: list[str] | None = None  # 替换整个 tags 数组
```

### 3.3 MODIFY: `GET /api/identities/`

新增 query params:
```python
tag: str | None = None          # JSONB contains filter
include_archived: bool = False  # 默认隐藏已归档
```

默认行为: `status` 未指定时，自动排除 archived（除非 `include_archived=true`）。

### 3.4 IdentityResponse 新增字段

```python
tags: list[str]  # default []
```

---

## 4. Frontend Changes

### 4.1 API client (`client.ts`)

`HealthIdentity` 接口新增:
```typescript
tags: string[];
```

### 4.2 S1 CustomerSearchScreen

- 标签筛选栏（chips）：显示已有标签 + 点击筛选
- [包括已归档] 复选框
- 列表中每个客户显示其标签 badges
- 保持现有搜索功能不变

### 4.3 S2 CustomerSummaryScreen

- 客户名下方显示标签 badges + [+ 添加标签] 按钮
- 标签添加：点击 → 输入框 → 回车 → PATCH API
- 标签移除：点击 tag × → PATCH API
- 归档/恢复按钮：放在页面底部（不抢主操作）
- 已归档客户：隐藏"记录健康关注"和"新建服务"按钮，显示 [恢复客户]

---

## 5. Suggested Tags (前端提示)

不限制枚举，但提供 12 个建议标签供快速选择（PILOT-016 §5）。

---

## 6. Risk

| 风险 | 等级 | 缓解 |
|------|------|------|
| Migration 004 执行失败 | Low | JSONB DEFAULT '[]'，对现有数据无影响 |
| tags 字段与现有 PATCH 逻辑冲突 | Low | IdentityUpdate 所有字段 optional，不传 tags 不修改 |
| 标签筛选性能 | Very Low | MVP < 100 客户，JSONB 全表扫描可接受 |
| unarchive 误操作 | Low | 归档/恢复均追加 Timeline，可追溯 |

---

## 7. Validation Checklist

- [ ] Migration 004 可正向/反向执行
- [ ] POST /unarchive 正确切换状态 + 写 Timeline
- [ ] GET /identities/?tag=X 正确筛选
- [ ] GET /identities/ 默认排除 archived
- [ ] GET /identities/?include_archived=true 包含 archived
- [ ] PATCH /identities/{id} 可更新 tags
- [ ] IdentityResponse 包含 tags 字段
- [ ] npm run build 通过
- [ ] tsc --noEmit 通过
- [ ] ruff check 通过
- [ ] pytest 通过

---

## 8. Files Changed (预计)

```
M health_one/platform/models/identity.py          (+tags 列)
M health_one/platform/schemas/identity.py         (+tags 字段)
M health_one/platform/routers/identity.py         (+unarchive, tag筛选, tags处理)
A health_one/platform/alembic/versions/004_...    (migration)
M frontend/src/api/client.ts                      (+tags 类型)
M frontend/src/screens/CustomerSearchScreen.tsx    (+标签筛选 + 已归档)
M frontend/src/screens/CustomerSummaryScreen.tsx   (+标签 + 归档)
```

---

## 9. End of Document

FEATURE-001 defines the implementation plan for customer archive, tagging, and tag filtering MVP.

**7 files. 1 migration. Zero new tables.**
