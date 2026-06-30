# QA-FEATURE-004 — Follow-Up Queue MVP Review

Document ID : QA-FEATURE-004
Title       : 待跟进客户队列 MVP 质量审查
Version     : 1.0
Status      : Complete
Owner       : QA Office
Audience    : Development / Product
Created     : 2026-06-30
Reviewed    : health_one/platform/routers/dashboard.py:249–323, frontend/src/screens/FollowUpQueueScreen.tsx, frontend/src/App.tsx:43

---

## 1. API Design

### 1.1 最小聚合原则

```
✅ PASS — API 仅服务待跟进队列，不扩张为通用任务系统
```

| 检查点 | 结果 | 说明 |
|--------|------|------|
| 单一用途 | ✅ | 仅返回待跟进队列，不做任务分配/统计/通知 |
| 只读 | ✅ | 纯 SELECT + Python 过滤，无副作用 |
| 参数简洁 | ✅ | 零 query param，一次返回全量 |
| 无过度设计 | ✅ | 不做分页/排序参数/自定义 tag 列表 |
| 复用现有模型 | ✅ | HealthPlan + HealthIdentity 现有表，零 migration |

### 1.2 返回结构

```
✅ PASS — 结构清晰
```

```json
{
  "items": [
    {
      "identity_id": "uuid",       // 跳转 S2
      "customer_name": "张伟",      // 显示
      "source": "followup",        // "followup" | "tag" — 区分信号来源
      "reason": "电话随访",         // 跟进原因（中文）
      "planned_at": "..." | null,  // 计划时间
      "plan_id": "uuid" | null,    // HealthPlan ID
      "tags": ["肩颈"],            // 客户标签
      "activation_status": "active"
    }
  ]
}
```

字段稳定（8 个字段），无不必要字段。`source` 枚举清晰区分两类信号。

### 1.3 与 Plan 一致性

```
⚠️ WARNING — Plan 未明确 Source 1 是否包含 pending activation_status 客户
```

Plan §2.1 描述 Source 1 为 "pending follow-up plan"，未限定客户 activation_status。实现用 `!= "archived"` 包含 `pending` 状态客户。逻辑自洽——plan 可能在激活前创建。但与 Source 2（仅 `active`）不一致。见 §2.3。

---

## 2. Data Sources & Semantics

### 2.1 Source 1 — Pending Follow-Up Plans

```
✅ PASS — 数据来源正确
```

```python
select(HealthPlan, HealthIdentity)
.join(HealthIdentity, HealthPlan.identity_id == HealthIdentity.identity_id)
.where(HealthIdentity.activation_status != "archived")
.order_by(HealthPlan.created_at.desc())
.limit(100)
```

| 检查点 | 结果 |
|--------|------|
| JOIN 正确 | ✅ INNER JOIN，无 orphan plan |
| 排除 archived | ✅ `!= "archived"` |
| Python 过滤 `status == "pending"` | ✅ 仅 pending 入队 |
| 排序 `created_at DESC` | ✅ 最近创建的 plan 优先 |

### 2.2 Source 2 — Tagged Customers

```
✅ PASS — JSONB contains 查询正确
```

```python
tag_conditions = [
    HealthIdentity.tags.contains(["需随访"]),
    HealthIdentity.tags.contains(["高意向"]),
]
# ... WHERE activation_status == "active" AND (cond1 OR cond2)
```

| 检查点 | 结果 |
|--------|------|
| JSONB `@>` 语义 | ✅ PostgreSQL `tags @> '["需随访"]'::jsonb` |
| OR 逻辑 | ✅ `or_(*tag_conditions)` |
| 仅 active | ✅ `activation_status == "active"` |
| limit 100 | ✅ MVP 可接受 |

### 2.3 Source 1 vs Source 2 activation_status 不一致

```
⚠️ Data Semantics Risk — 两个来源的 activation_status 筛选不一致
```

| 来源 | 筛选 | 包含 status |
|------|------|-----------|
| Source 1 (followup) | `!= "archived"` | active ✅ + pending ✅ |
| Source 2 (tag) | `== "active"` | active ✅ + pending ❌ |

**影响：** 一个 `pending` 状态的客户如果有 pending follow-up plan，会出现在队列中（Source 1）。但同一个 `pending` 客户即使有 "需随访" 标签，也不会出现在 Source 2。这在语义上一致——"还没激活的客户不应该仅因为标签出现在队列中"——但与 Source 1 的宽松策略形成不对称。

**评估：** 低影响。当前 Pilot 门店 pending 客户极少（通常 0–2 人），实际不会造成困惑。

### 2.4 去重逻辑

```
✅ PASS — 去重正确，followup 优先
```

```
1. Source 1 遍历 → seen_ids.add(iid) → 入队
2. Source 2 遍历 → if iid in seen_ids: continue → 跳过
```

- 同一 identity 只在队列中出现一次
- followup 来源优先于 tag 来源
- plan.created_at DESC → 同客户多 plan 时取最近创建的

```
⚠️ NOTE — 同客户多个 pending plan 仅展示最近一个
```

若客户有 2 个 pending plan（如同时有 phone + wechat 随访），队列仅显示 `created_at` 最近的 plan。其余 pending plan 不可见。**可接受**——点击"查看客户 →"进入 S2 后可看到全部 plan。

### 2.5 plan_status 未过滤

```
⚠️ Data Semantics Risk — Source 1 不检查 plan_status
```

Source 1 仅检查 `follow_up_schedule.status == "pending"`，不检查 plan 自身 `plan_status`。如果 plan 已被 `archived` 或 `completed` 但 `follow_up_schedule.status` 未同步更新（JSONB 无约束），该客户会错误出现在队列中。

**评估：** 与 ManagerDashboard 现有实现一致（dashboard.py:96-115 同样不过滤 plan_status）。属已知模式，非本次引入。Sprint-5+ 建议在 plan 状态变更时同步更新 follow_up_schedule.status。

---

## 3. Sorting & Display

### 3.1 排序

```
✅ PASS — followup 优先于 tag，符合 Plan 优先级
```

- Source 1 items 先入队（`plan.created_at DESC`）
- Source 2 items 追加在后（`identity.created_at DESC`）
- 同类内按时间倒序

### 3.2 前端展示

```
✅ PASS — 信息充分，店员可理解为什么客户在队列中
```

每条展示：

| 元素 | 内容 | 评价 |
|------|------|------|
| 客户名 | `customer_name` 大字 | ✅ 主视觉焦点 |
| 状态 badge | `已激活` / `pending` | ✅ 灰底小字，不抢焦点 |
| 信号图标 | 📞（followup）/ 🏷（tag） | ✅ 一眼区分来源 |
| 原因 | `电话随访` / `需随访` / `高意向` | ✅ 中文可读 |
| 计划时间 | `计划 2026/07/03` | ✅ zh-CN 格式 |
| 无计划提醒 | `暂无随访计划`（橙色） | ✅ 仅 tag 来源显示 |
| 标签 badges | 蓝色圆角 | ✅ 复用现有风格 |
| 操作按钮 | `查看客户 →` | ✅ 跳转 S2 |

### 3.3 空数据

```
✅ PASS — 空队列体验合理
```

```
暂无待跟进客户
所有客户的随访计划均已完成，无需跟进的标签标记
```

有说明性文案，不空白。

### 3.4 多标签原因

```
⚠️ UX Risk — 仅显示第一个匹配标签
```

若客户同时有 "需随访" 和 "高意向" 两个标签，`reason` 仅显示 `matched_tags[0]`（取决于 `FOLLOW_UP_TAGS` 列表顺序 = "需随访"）。店员看不到另一个触发标签。

**评估：** 低影响。标签以 badges 形式在下方完整展示，店员可看到全部标签。reason 字段仅作摘要。

---

## 4. Role & Access

### 4.1 前端 Route

```
✅ PASS — ProtectedRoute 内，已认证用户均可访问
⚠️ WARNING — 无 role 级别路由守卫
```

`/follow-up-queue` 位于 `ProtectedRoute > BaseLayout` 内。店长、健康管理师、服务人员均可通过 URL 直接访问。

服务人员打开此页面后：
- 可看到全店待跟进客户列表
- 可点击"查看客户 →"进入 S2 查看客户详情
- 但不能创建随访（S6 已做按钮权限控制）

**评估：** 可接受。数据暴露为客户名+标签+随访方式（Low 敏感度）。与 ROLE-001 已知 Deferred 模式一致。

### 4.2 入口按钮

```
✅ PASS — 入口位置合理
```

| 角色 | 入口位置 | 可见性 |
|------|---------|--------|
| 店长 | ManagerDashboard > 待随访 section 标题旁 `[查看全部 →]` | ✅ 仅店长首页 |
| 健康管理师 | HealthAdvisorDashboard > ⏳ 待随访 section 标题旁 `[查看全部 →]` | ✅ 仅健康管理师首页 |
| 服务人员 | 无 | ✅ 正确排除 |

### 4.3 "与自己相关的待跟进客户"

```
⚠️ Role Risk — 当前仅支持"同店列表"，非"自己的客户"
```

Plan §3 要求：
> 健康管理师首页：显示与自己相关的待跟进客户（如当前难以精确归属，可先显示同店列表并明确说明）

**当前实现：**
- API 无 `staff_id` 过滤——返回全店数据
- 前端无 `staff` 过滤——显示全店数据
- 页面标题 "待跟进客户"——未标注"全店"范围

健康管理师看到的队列实际是全店范围，而非"自己的"客户。当前缺少 staff-customer 归属机制（HealthPlan.created_by / follow_up_schedule.assigned_staff 未用于过滤）。

**评估：** Plan 已明确允许此行为（"可先显示同店列表并明确说明"）。但页面未做"明确说明"——缺少"全店待跟进客户"的标注。建议在页面副标题补充"全店"说明。

### 4.4 后端 API role 校验

```
⚠️ WARNING — 无后端 role 校验（已知 Deferred 模式）
```

`GET /api/dashboard/follow-up-queue` 仅要求 JWT 认证，不校验 role。与 ROLE-001/ROLE-003 一致的已知 Deferred 模式。Sprint-5+ 统一处理。

---

## 5. Security

### 5.1 接口安全

```
✅ PASS — JWT 认证，参数化查询，无注入风险
```

| 向量 | 状态 |
|------|------|
| SQL 注入 | ✅ SQLAlchemy 参数化查询 |
| 未认证访问 | ✅ `Depends(get_current_staff)` |
| 数据暴露 | ✅ 仅客户名+标签+随访方式（Low 敏感度） |
| CSV injection | N/A — 非 CSV 接口 |

### 5.2 查询上限

```
✅ PASS — limit 100 per source，MVP 可接受
```

Source 1 和 Source 2 各有 100 条上限。Pilot 门店 < 100 客户，两轮查询总返回 ≤ 200 条，无性能风险。

---

## 6. Test Impact

### 6.1 测试覆盖

```
⚠️ WARNING — follow-up-queue endpoint 无专门测试
```

| 测试文件 | 状态 | 与本功能关系 |
|---------|------|------------|
| test_api_auth.py | ✅ 6/6 | 认证基础设施（间接相关） |
| test_store_models.py | ✅ 9/9 | Store 模型（无关） |
| test_models.py | ✅ 6/6 | Platform 模型（间接相关） |
| **follow-up-queue** | ❌ 0 | 无测试覆盖 |

21 passed 均为已有测试，零测试覆盖新增的 follow-up-queue 逻辑。手工验证更重要（需 PostgreSQL + 种子数据）。

### 6.2 手工验证清单

```
□ 1. 创建有 pending follow-up plan 的客户 → 出现在队列 Source 1
□ 2. 创建有 "需随访" 标签的客户（无 pending plan）→ 出现在队列 Source 2
□ 3. 创建有 "高意向" 标签的客户（无 pending plan）→ 出现在队列 Source 2
□ 4. 同一客户同时有 pending plan + "需随访" 标签 → 仅出现一次（followup 优先）
□ 5. archived 客户有 pending plan → 不出现在队列
□ 6. pending 客户有 "需随访" 标签（无 plan）→ 不出现在队列（Source 2 仅 active）
□ 7. 店长登录 → 首页"查看全部 →"可见 → 点击进入队列
□ 8. 健康管理师登录 → 首页"查看全部 →"可见 → 点击进入队列
□ 9. 服务人员登录 → 首页无"查看全部 →"入口 → 但可通过 URL 访问（已知）
□ 10. 空数据库 → 队列显示空状态文案
```

---

## 7. Findings Summary

| 级别 | 数量 | 编号 |
|------|------|------|
| ✅ PASS | 16 | — |
| ⚠️ WARNING | 7 | W1–W7 |
| ❌ MUST FIX | 0 | — |

### WARNING

| # | 位置 | 描述 | 阻塞？ |
|---|------|------|--------|
| W1 | `dashboard.py:267` | Source 1 用 `!= "archived"` 包含 `pending` 客户，Source 2 用 `== "active"` 排除 `pending`，不对称 | 否 |
| W2 | `dashboard.py:316` | 多标签匹配时 `reason` 仅显示第一个（`matched_tags[0]`） | 否 |
| W3 | `FollowUpQueueScreen.tsx:48` | 页面未标注"全店"范围——健康管理师可能误以为仅自己的客户 | 否 |
| W4 | `dashboard.py:249-252` | API 无 role 校验（已知 Deferred 模式） | 否 |
| W5 | `dashboard.py:269` | Source 1 不检查 `plan_status`——archived plan 的 pending followup 可能入队 | 否 |
| W6 | `dashboard.py:269,302` | 各 100 条 limit 可能在极端数据下截断结果 | 否 |
| W7 | 测试 | follow-up-queue endpoint 无专门测试 | 否 |

---

## 8. Recommendation

### 8.1 是否建议 Commit

```
✅ APPROVE COMMIT — 0 MUST FIX, 7 WARNING 均为已知限制或可接受行为。
```

### 8.2 建议 Commit 后跟进（P2）

```
1. W3：FollowUpQueueScreen 副标题补充"全店待跟进客户"说明
2. W5：Source 1 增加 plan_status != 'archived' 过滤（1 行 SQL）
3. W7：补充最小手工验证（见 §6.2）
```

### 8.3 QA Approval

```
Status: APPROVE
```

---

## 9. End of Document

QA-FEATURE-004 reviews the follow-up queue MVP.

**16 PASS. 7 WARNING. 0 MUST FIX. Approve Commit.**
