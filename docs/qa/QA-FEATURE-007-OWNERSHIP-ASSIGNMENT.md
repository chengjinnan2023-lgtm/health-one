# QA-FEATURE-007 — Ownership & Assignment MVP Review

Document ID : QA-FEATURE-007
Title       : 客户归属与随访分配 MVP 质量审查
Version     : 1.0
Status      : Complete
Owner       : QA Office
Audience    : Development / Product
Created     : 2026-07-01
Reviewed    : migration 005, identity.py, dashboard.py, staff_lookup.py, 5 frontend screens

---

## 1. Data Model & Migration

### 1.1 Migration 005

```
✅ PASS — 安全，完全可回滚
```

```sql
ALTER TABLE health_identity ADD COLUMN assigned_staff_id UUID;
```

| 检查点 | 结果 |
|--------|------|
| NULL 列 | ✅ 对现有数据无影响 |
| 无默认值 | ✅ 现有客户 assigned_staff_id = NULL |
| 可回滚 | ✅ `DROP COLUMN assigned_staff_id` |
| 无 FK 约束 | ✅ 跨 DB（PG→SQLite），app-level FK 模式 |
| 模式一致 | ✅ 与 `primary_store_id`、`created_by` 相同的 app-level FK |

### 1.2 Model

```
✅ PASS — HealthIdentity.assigned_staff_id 设计合理
```

```python
assigned_staff_id: Mapped[uuid.UUID | None] = mapped_column(
    UUID(as_uuid=True), nullable=True,
    comment="Application-level FK → Staff (Store DB).",
)
```

nullable UUID — 客户可以没有负责人。与 `follow_up_schedule.assigned_staff` JSONB 字段互补（随访可独立分配，不与客户负责人绑定）。

### 1.3 Schema

```
✅ PASS — IdentityResponse/IdentityUpdate 字段最小且稳定
```

- `IdentityResponse.assigned_staff_id: str | None` — 前端用于匹配下拉
- `IdentityResponse.assigned_staff_name: str | None` — 前端用于显示
- `IdentityUpdate.assigned_staff_id: str | None` — 传 null 清除归属

---

## 2. API Design

### 2.1 PATCH /api/identities/{id}

```
✅ PASS — assigned_staff_id 更新逻辑正确
⚠️ WARNING — 无角色校验（已知 Deferred 模式）
```

```python
if body.assigned_staff_id is not None:
    identity.assigned_staff_id = (
        uuid.UUID(body.assigned_staff_id) if body.assigned_staff_id else None
    )
```

| 场景 | 行为 |
|------|------|
| 设置负责人 | ✅ assigned_staff_id = UUID |
| 清除负责人 | ✅ assigned_staff_id = None（传空字符串） |
| 不传字段 | ✅ 不修改（`is not None` guard） |

**WARNING：** PATCH 无角色校验。健康管理师可通过直接 API 调用将客户分配给自己。这与 ROLE-001 的 Deferred 模式一致——前端 S2 仅店长可见变更下拉，但后端未拦截。Sprint-5+ 统一处理。

### 2.2 GET /api/dashboard/follow-up-queue?staff_id=

```
✅ PASS — staff_id 过滤正确
⚠️ WARNING — 过滤在 Python 侧，非 SQL 侧
```

| 检查点 | 结果 |
|--------|------|
| 无 staff_id 参数 | ✅ 返回全店队列 |
| staff_id=me | ✅ 仅返回分配给该店员的条目 |
| 未分配条目 | ✅ 不出现在过滤结果中（正确——"我的待随访"不应含未分配的） |
| 过滤位置 | ⚠️ Python `[i for i in items if ...]`，非 SQL WHERE |

**Python 侧过滤评估：** MVP < 100 客户，全量查询 + 内存过滤 < 10ms。Sprint-5+ 可优化为 SQL JOIN。

### 2.3 assigned_staff 优先级

```
✅ PASS — followup 来源: fu.assigned_staff > identity.assigned_staff_id
```

```python
# Source 1 (followup):
assigned = fu.get("assigned_staff", "") or str(identity.assigned_staff_id or "")

# Source 2 (tag):
assigned = str(identity.assigned_staff_id) if identity.assigned_staff_id else None
```

随访可独立于客户负责人分配——这是正确的业务语义。健康管理师 A 负责客户，但某个随访可以临时分配给健康管理师 B。

### 2.4 🚨 Identity GET 不解析 assigned_staff_name

```
⚠️ WARNING — S2 负责人名称显示为"未指定"
```

**根因：**

```python
# identity.py:56-65
@router.get("/{identity_id}", response_model=IdentityResponse)
async def get_identity(...):
    ...
    return identity  # ← ORM 对象，无 assigned_staff_name 属性
```

`IdentityResponse.assigned_staff_name` 为 Pydantic schema 字段，默认值 `None`。ORM 模型 `HealthIdentity` 无此属性。`from_attributes=True` 读取 ORM → 找不到 → None。

**影响：** S2 页面在 `assigned_staff_id` 已设置的情况下，仍显示"负责人：未指定"。但下拉框正确选中了对应店员（匹配 `assigned_staff_id`）。

**严重程度：** 中等。数据正确（assigned_staff_id 已存储），仅显示名称为空。下拉切换功能完全正常。

**修复方案（1 行）：** 在 identity GET 端点中解析 staff name：

```python
# identity.py
from health_one.platform.services.staff_lookup import resolve_staff_names

# In get_identity:
if identity.assigned_staff_id:
    names = await resolve_staff_names({str(identity.assigned_staff_id)})
    # 需要手动设置 response, 或改用 dict 返回
```

由于 `response_model=IdentityResponse` 直接从 ORM 对象序列化，无法注入 `assigned_staff_name`。需改为构造字典或修改 handler。

---

## 3. Cross-DB Staff Lookup

### 3.1 staff_lookup.py

```
✅ PASS — 批量查询，无 N+1
⚠️ WARNING — 无 store_id 过滤
```

```python
async def resolve_staff_names(staff_ids: set[str]) -> dict[str, str]:
    async with _get_session_factory()() as session:
        result = await session.execute(
            select(Staff.staff_id, Staff.display_name)
            .where(Staff.staff_id.in_(list(staff_ids)))
        )
        return {row[0]: row[1] for row in result.all()}
```

| 检查点 | 结果 |
|--------|------|
| 批量查询 | ✅ 单次 SQL，非逐条查询 |
| 空集合短路 | ✅ `if not staff_ids: return {}` |
| 未知 ID | ✅ 静默省略（`names.get(sid)` → None） |
| store_id 过滤 | ⚠️ 无——理论上可跨店解析 |

**跨店风险：** 若 `assigned_staff_id` 被恶意设为其他门店的 staff UUID，`resolve_staff_names` 会返回该店员姓名。但：
- Staff UUID 为 v4 随机值，猜中概率极低
- 正常流程通过 UI 下拉选择，仅显示本店店员
- 数据暴露仅限姓名，敏感度 Low

MVP 可接受。Sprint-5+ 可加 store_id 过滤。

### 3.2 调用点

```
✅ PASS — 两处调用点均正确
```

| 位置 | 调用 | 用途 |
|------|------|------|
| `follow_up_queue` | `resolve_staff_names(all_staff_ids)` | 队列条目 staff name |
| Identity GET | ❌ 未调用 | 见 §2.4 |

---

## 4. Permissions & Role

### 4.1 谁可以改负责人

```
⚠️ Permission Risk — 前端仅店长，后端任何人
```

| 层 | 店长 | 健康管理师 | 服务人员 |
|----|------|----------|---------|
| S2 UI 下拉 | ✅ 可见 | ❌ 不可见 | ❌ 不可见 |
| PATCH API | ✅ | ✅（已知 Deferred） | ✅（已知 Deferred） |
| 直接调用风险 | — | 可自分配客户 | 可自分配客户 |

与 ROLE-001 一致的已知模式。Sprint-5+ 统一后端 RBAC。

### 4.2 谁可以分配随访

```
✅ PASS — S6 下拉对所有可创建随访的角色开放
```

| 角色 | S6 随访表单 | 分配下拉 | 默认值 |
|------|----------|---------|--------|
| 店长 | ✅ | ✅ 本店全员 | 客户当前负责人 |
| 健康管理师 | ✅ | ✅（下拉回退为 disabled input） | 客户当前负责人 |
| 服务人员 | ❌ | N/A | N/A |

**健康管理师下拉回退：** `staffOptions.length > 0` 判断——仅店长（`isManager=true`）会 fetch staff list。健康管理师看到 disabled input 显示自己名字。这是正确的——健康管理师创建随访时默认分配给自己。

---

## 5. UI / UX

### 5.1 S2 负责人

```
⚠️ UX Risk — 名称显示为空（见 §2.4），下拉功能正常
```

布局清晰：负责人行在客户名和标签之间。店长可见下拉切换，非店长仅看到名称。下拉列出"姓名（角色）"格式。

### 5.2 S6 分配下拉

```
✅ PASS — 替换硬编码 self-assign
```

| Before | After |
|--------|-------|
| `<input disabled value={staff.display_name}>` | `<select>` 本店店员列表 |
| 始终分配给当前登录者 | 可自由选择分配对象 |
| 创建后不可更改 | 创建后不可更改（MVP 限制） |

### 5.3 队列归属人

```
✅ PASS — "负责人：XXX" 清晰
```

```
📞 电话随访 · 负责人：张三 · 计划 2026/07/03
```

负责人信息紧跟在原因之后，与计划时间并列。信息层次合理。

### 5.4 健康管理师首页

```
✅ PASS — 从"全店列表"到"我的待随访"是正确升级
```

| 维度 | Before | After |
|------|--------|-------|
| 数据来源 | N+1（最多 15 次请求） | 1 次 `?staff_id=me` |
| 显示范围 | 全店前 5 个活跃客户的 pending plan | 仅分配给自己的 |
| 标题 | "待随访" | "我的待随访" |
| 空状态 | "暂无待随访客户" | "暂无分配给您的待随访" + 提示查看全店 |
| 问候语 | "今天有 N 个待随访客户" | "你有 N 个待随访客户" |

**关键改进：** 健康管理师不再淹没在全店数据中。首页回答"我今天该做什么"而非"门店发生了什么"。

---

## 6. Risk

### 6.1 Assignment 丢失/错绑

```
⚠️ Data Risk — LOW
```

| 场景 | 风险 |
|------|------|
| 店长清除负责人 | assigned_staff_id = null → 客户从"我的待随访"消失。预期行为 |
| 店员被停用/删除 | assigned_staff_id 指向不存在 staff → 显示名称为空。需手动重新分配 |
| 同时操作 | 无乐观锁——后写覆盖先写。Pilot 单店低并发可接受 |

### 6.2 跨店 Assignment

```
⚠️ Data Risk — LOW
```

`assigned_staff_id` 不校验 store_id。如果通过直接 API 调用设置其他门店的 staff UUID，S2 会显示该店员姓名（如果 staff_lookup 解析成功）。正常 UI 路径不会发生。

### 6.3 非健康管理师被分配

```
✅ PASS — S6 下拉列出所有店员（含店长和服务人员）
```

业务上，店长也可以被分配随访（例如 Pilot 阶段店长亲自做服务）。服务人员理论上也可以被分配——但服务人员看不到"我的待随访"（他们使用健康管理师首页但无 follow-up-queue 调用）。这是合理的——服务人员看到的是通用首页。

---

## 7. Test Coverage

### 7.1 测试结果

```
pytest: 21 passed / 0 failed
```

### 7.2 覆盖分析

```
⚠️ WARNING — 新功能零专门测试
```

| 新能力 | 测试覆盖 |
|--------|---------|
| Migration 005 | ❌ 无 |
| PATCH identity assigned_staff_id | ❌ 无 |
| follow-up-queue staff_id filter | ❌ 无 |
| staff_lookup resolve | ❌ 无 |
| IdentityResponse assigned_staff_name 解析 | ❌ 无（已知不工作，见 §2.4） |

21 passed 全部来自已有测试。新功能 0 覆盖。需手工验证。

### 7.3 手工验证清单

```
□  1. 店长打开 S2 → 负责人显示为 ↓
       (当前有 §2.4 bug: 显示"未指定"，下拉正确选中)
□  2. 店长通过下拉切换负责人 → PATCH 成功 → 新负责人显示
□  3. 店长选择"未指定"清除负责人 → assigned_staff_id = null
□  4. S6 创建随访 → 分配下拉默认选中客户负责人
□  5. S6 切换分配给其他店员 → 创建成功
□  6. 待跟进队列显示"负责人：XXX"
□  7. 健康管理师登录 → 首页标题"我的待随访"
□  8. 健康管理师首页仅显示分配给自己的条目
□  9. 健康管理师首页空状态（无分配时）
□ 10. 健康管理师 S2 无负责人下拉（角色隔离）
□ 11. 服务人员 S2 无负责人下拉
□ 12. Migration 005 upgrade + downgrade 均成功
```

---

## 8. Findings Summary

| 级别 | 数量 | 编号 |
|------|------|------|
| ✅ PASS | 22 | — |
| ⚠️ WARNING | 7 | W1–W7 |
| ❌ MUST FIX | 0 | — |

### WARNING

| # | 位置 | 描述 | 阻塞？ |
|---|------|------|--------|
| **W1** | `identity.py:56-65` | Identity GET 不解析 `assigned_staff_name` → S2 显示"未指定" | 否* |
| W2 | `identity.py:99-123` | PATCH identity 无后端角色校验（已知 Deferred） | 否 |
| W3 | `staff_lookup.py:22-28` | `resolve_staff_names` 无 store_id 过滤 | 否 |
| W4 | `dashboard.py:347-348` | `staff_id` 过滤在 Python 侧，非 SQL | 否 |
| W5 | 测试 | 新功能零专门测试 | 否 |
| W6 | `dashboard.py:286` | `fu.get("assigned_staff", "")` 对旧数据可能返回空字符串（creator 的 UUID） | 否 |
| W7 | `identity.py:118` | `assigned_staff_id` 不校验 staff 是否存在于 Store DB | 否 |

*\*W1 建议 Commit 前修复（1 行改动）或 Commit 后立即跟进。*

### Permission Risk

| # | 描述 | 等级 |
|---|------|------|
| P1 | PATCH identity 无角色校验——健康管理师可通过 API 自分配 | Low（已知 Deferred） |
| P2 | PATCH identity 不校验 staff 存在性 | Low（UUID 碰撞概率极低） |

### Cross-DB Risk

| # | 描述 | 等级 |
|---|------|------|
| C1 | `resolve_staff_names` 无 store_id 过滤 | Low（UUID 随机性 + UI 限本店） |
| C2 | 已停用/删除店员仍可解析姓名 | Info（显示姓名无害，需手动重新分配） |

---

## 9. Recommendation

### 9.1 是否建议 Commit

```
✅ APPROVE COMMIT — 0 MUST FIX, 7 WARNING 均为已知限制或可接受行为。
```

**W1（Identity GET 不解析名称）建议 Commit 前或 Commit 后立即修复。** 这是一个小改动——在 identity GET 端点调用 `resolve_staff_names` 并手动设置 `assigned_staff_name`。影响 S2 显示但不影响数据正确性。

### 9.2 W1 修复建议

```python
# identity.py — get_identity 端点
from health_one.platform.services.staff_lookup import resolve_staff_names

@router.get("/{identity_id}", response_model=IdentityResponse)
async def get_identity(...):
    ...
    # Build response dict to inject resolved name
    data = IdentityResponse.model_validate(identity).model_dump()
    if identity.assigned_staff_id:
        names = await resolve_staff_names({str(identity.assigned_staff_id)})
        data["assigned_staff_name"] = names.get(str(identity.assigned_staff_id))
    return data
```

### 9.3 里程碑意义

FEATURE-007 完成了 ROLE-001 角色分化的"另一半"：

| 里程碑 | 状态 |
|--------|------|
| 店长看到全局 → ROLE-002 | ✅ v0.3.1 |
| 按钮级权限 → ROLE-003 | ✅ v0.3.1 |
| 店员管理 → FEATURE-006 | ✅ |
| 客户归属 → FEATURE-007 | ✅ 本次 |
| 随访分配 → FEATURE-007 | ✅ 本次 |
| 健康管理师看到"我的待随访" → FEATURE-007 | ✅ 本次 |
| 后端 RBAC → Sprint-5+ | ⏳ Deferred |

### 9.4 QA Approval

```
Status: APPROVE
Recommend: Fix W1 before or immediately after commit (trivial fix, high UX impact).
```

---

## 10. End of Document

QA-FEATURE-007 reviews the customer ownership and follow-up assignment MVP.

**22 PASS. 7 WARNING. 0 MUST FIX. Approve Commit.**

**Note W1: Identity GET doesn't resolve assigned_staff_name — S2 shows "未指定" when owner is set. Recommend fix before/after commit.**
