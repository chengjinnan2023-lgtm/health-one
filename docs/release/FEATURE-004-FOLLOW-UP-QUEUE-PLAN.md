# FEATURE-004 — Follow-Up Queue MVP Plan

Document ID : FEATURE-004
Title       : 待跟进客户队列 MVP 执行计划
Version     : 1.0
Status      : Plan
Owner       : Development Office
Created     : 2026-06-30
Depends On  : FEATURE-001 (Archive & Tagging), FEATURE-002 (Manager Dashboard), ROLE-002 (Home Split)

---

## 1. Scope

为店长和健康管理师提供统一的"待跟进客户"视图，合并两个信号源：

| 优先级 | 信号源 | 数据位置 |
|--------|--------|---------|
| 1（主） | pending follow-up plan | `health_plan.follow_up_schedule.status == "pending"` |
| 2（辅） | 标签标记 | `health_identity.tags` JSONB contains "需随访" or "高意向" |

**In scope:**
- 统一待跟进队列页面（FollowUpQueueScreen）
- 聚合 API（合并 pending plans + tagged customers，去重）
- 店长首页入口 + 健康管理师首页入口

**Not in scope:**
- AI 推荐 / 自动排序
- 自动消息提醒 / 推送
- 自动任务分配
- 新数据库表 / migration
- 复杂排序规则

---

## 2. Data Sources

### 2.1 为什么需要新增 API

当前数据分散在两个查询路径：

| 路径 | 问题 |
|------|------|
| `GET /api/dashboard/manager` | pending_followups 只返回 10 条，查询 limit 50 |
| HealthAdvisorDashboard | N+1 查询：获取 identities → 逐个查 plans（最多 5 个客户） |
| `GET /api/identities/?tag=X` | 仅支持单个 tag，无法同时查 "需随访" + "高意向" |

纯前端聚合需要：`GET /api/identities/` + 对每个 active identity 调 `GET /api/identities/{id}/plans` + 对每个 tag 调一次 identities 筛选。N=50 时需要 101+ 次请求。不可接受。

### 2.2 方案：新增 1 个聚合 endpoint

```
GET /api/dashboard/follow-up-queue
```

一次查询返回合并去重后的完整队列。

---

## 3. API Design

### 3.1 `GET /api/dashboard/follow-up-queue`

**Response:**

```json
{
  "items": [
    {
      "identity_id": "uuid",
      "customer_name": "张伟",
      "source": "followup",
      "reason": "电话随访",
      "planned_at": "2026-07-03T14:00:00",
      "plan_id": "uuid",
      "tags": ["肩颈"],
      "activation_status": "active"
    },
    {
      "identity_id": "uuid",
      "customer_name": "李娜",
      "source": "tag",
      "reason": "高意向",
      "planned_at": null,
      "plan_id": null,
      "tags": ["高意向", "肩颈"],
      "activation_status": "active"
    }
  ]
}
```

**字段说明：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `identity_id` | UUID | 客户 ID，用于跳转 S2 |
| `customer_name` | string | 客户显示名 |
| `source` | `"followup"` \| `"tag"` | 信号来源 |
| `reason` | string | 跟进原因：followup=随访方式中文名，tag=标签名 |
| `planned_at` | string \| null | 计划时间（仅 followup 有） |
| `plan_id` | UUID \| null | HealthPlan ID（仅 followup 有） |
| `tags` | string[] | 客户当前标签列表 |
| `activation_status` | string | 客户状态 |

**查询逻辑（backend，~45 行）：**

1. 查询所有 `follow_up_schedule.status == "pending"` 的 HealthPlan，JOIN HealthIdentity 获取 display_name、tags、activation_status
2. 收集已有 pending plan 的 identity_id 集合（用于去重）
3. 查询 `activation_status == "active"` 且 `tags` JSONB 包含 "需随访" 或 "高意向" 的 HealthIdentity，排除已在步骤 2 中的 identity_id
4. 合并两个列表，followup 优先

**性能：** MVP < 100 客户，3 表 JOIN 全扫描 < 15ms。

---

## 4. Frontend Changes

### 4.1 新增 `FollowUpQueueScreen.tsx`

```
┌──────────────────────────────────────────────┐
│ 待跟进客户                        [店长工作台] │
│                                              │
│ 📊 共 N 个待跟进客户                          │
│   随访计划 M 人 · 标签标记 K 人               │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ 张伟                    📞 电话随访       │ │
│ │ 肩颈 · 老客户            计划 2026-07-03  │ │
│ │                          状态：待随访      │ │
│ │                          [查看客户 →]     │ │
│ ├──────────────────────────────────────────┤ │
│ │ 李娜                    🏷 高意向         │ │
│ │ 高意向 · 肩颈            暂无随访计划      │ │
│ │                          状态：已激活      │ │
│ │                          [查看客户 →]     │ │
│ └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

**每条显示：**
- 客户名（大字）
- 跟进原因（📞 电话随访 / 🏷 高意向 / 🏷 需随访）
- 计划时间（如有）
- 当前状态（待随访 / 已激活）
- 标签 badges
- [查看客户 →] 按钮 → 跳转 S2

### 4.2 入口按钮

**ManagerDashboard.tsx：**
- 在"待随访"section 标题旁加 `[查看全部 →]` 按钮
- 或在快捷入口区加"待跟进队列"入口

**HealthAdvisorDashboard.tsx：**
- 在"待随访"section 标题旁加 `[查看全部 →]` 按钮
- 或替换现有 N+1 加载为调用新 API（可选优化）

### 4.3 Route

```
App.tsx: + <Route path="/follow-up-queue" element={<FollowUpQueueScreen />} />
```

ProtectedRoute 内，店长和健康管理师均可访问。

### 4.4 角色差异

| 角色 | 视图 |
|------|------|
| 店长 | 全店待跟进客户 |
| 健康管理师 | 全店待跟进客户（当前无 staff-customer 归属，标注"全店"） |

---

## 5. Files Changed

```
A health_one/platform/routers/dashboard.py   (+~45 行：新增 /follow-up-queue endpoint)
A frontend/src/screens/FollowUpQueueScreen.tsx  (+~120 行：新页面)
M frontend/src/App.tsx                           (+2 行：新 route)
M frontend/src/screens/ManagerDashboard.tsx      (+3 行：入口按钮)
M frontend/src/screens/HealthAdvisorDashboard.tsx (+3 行：入口按钮)
```

---

## 6. No Changes

```
- 数据库结构（零 migration）
- 现有 API（纯新增，不修改现有 endpoint）
- HealthPlan / HealthIdentity 模型
- RFC / ADR / PRD
- 任何 AI 功能
```

---

## 7. Risk

| 风险 | 等级 | 缓解 |
|------|------|------|
| 聚合查询性能 | Very Low | MVP < 100 客户，3 表 JOIN 全扫描 < 15ms |
| 标签 JSONB contains 性能 | Very Low | < 100 客户，全表扫描可接受 |
| 去重遗漏 | Low | 同一 identity_id 以 followup 优先 |
| 健康管理师看到全店客户 | Info | 明确标注"全店"，当前无 staff-customer 归属 |
| 与现有 dashboard API 重复 | Info | follow-up-queue 返回完整列表（不限 10 条），是 dashboard 的超集 |

---

## 8. End of Document

FEATURE-004 defines the minimal follow-up queue MVP.

**1 new API. 1 new screen. 0 migrations. 5 files touched.**
