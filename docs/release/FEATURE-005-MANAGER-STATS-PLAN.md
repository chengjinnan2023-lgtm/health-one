# FEATURE-005 — Manager Stats MVP Plan

Document ID : FEATURE-005
Title       : 店长运营统计页 MVP 执行计划
Version     : 1.0
Status      : Plan
Owner       : Development Office
Created     : 2026-06-30
Depends On  : FEATURE-002 (Manager Dashboard), FEATURE-004 (Follow-Up Queue)

---

## 1. Scope

为店长提供本周 / 本月运营统计页，替换当前禁用的"运营统计"占位按钮。

**In scope:**
- 时间维度切换：本周 / 本月
- 指标：新增客户数、服务记录数、完成随访数
- 结构：标签 Top 5、客户概览（总/已激活/待激活/已归档）
- 独立页面 + 店长首页入口

**Not in scope:**
- 复杂 BI / 图表大屏
- 导出功能
- AI 解读
- 自定义日期范围
- 同比/环比
- 新数据库表

---

## 2. Why New API

### 2.1 当前 Dashboard API 局限

`GET /api/dashboard/manager` 仅提供"今日"数据（`today_new`、`today_sessions`）。不支持本周/本月聚合。

### 2.2 方案

新增 1 个 endpoint：
```
GET /api/dashboard/manager/stats?period=week|month
```

| 参数 | 说明 |
|------|------|
| `period` | `week`（本周一至周日）或 `month`（本月 1 日至末日） |

**客户结构 + 标签 Top 5 复用现有 dashboard 查询逻辑。**

---

## 3. API Design

### 3.1 `GET /api/dashboard/manager/stats?period=week`

**Response:**

```json
{
  "period": "week",
  "period_label": "2026-06-29 ~ 2026-07-05",
  "new_customers": 3,
  "service_sessions": 12,
  "completed_followups": 2,
  "customer_structure": {
    "total": 12,
    "active": 8,
    "pending": 2,
    "archived": 2
  },
  "top_tags": [
    {"tag": "肩颈", "count": 5},
    {"tag": "老客户", "count": 3}
  ]
}
```

### 3.2 查询逻辑（~40 行）

```
1. period 解析 → start_dt, end_dt
2. new_customers: COUNT health_identity WHERE created_at BETWEEN start AND end
3. service_sessions: COUNT service_session WHERE created_at BETWEEN start AND end
4. completed_followups: COUNT health_plan WHERE follow_up_schedule->>'status' = 'completed' AND updated_at BETWEEN start AND end
5. customer_structure: 复用 /manager dashboard 的 4 个 COUNT 查询
6. top_tags: 复用 /manager dashboard 的 JSONB 聚合查询
```

### 3.3 `completed_followups` 口径说明

`follow_up_schedule` JSONB 无 `completed_at` 字段。使用 `HealthPlan.updated_at` 作为完成时间近似——当店员在 S6 标记随访完成时，plan 的 `updated_at` 被更新。

**已知限制：** 若 plan 在完成后因其他原因被更新，`updated_at` 会变化，可能影响跨周期统计。MVP 阶段接受此近似。

---

## 4. Frontend Changes

### 4.1 新增 `ManagerStatsScreen.tsx`

```
┌──────────────────────────────────────────────┐
│ 运营统计                        [店长工作台]   │
│                                              │
│ [本周] [本月]   ← period toggle              │
│                                              │
│ 📊 2026-06-29 ~ 2026-07-05                   │
│                                              │
│ ┌────────┬────────┬────────┐                 │
│ │ 新增客户│ 服务记录│ 完成随访│  3 列指标卡片   │
│ │   3    │   12   │   2    │                 │
│ └────────┴────────┴────────┘                 │
│                                              │
│ 客户结构                                      │
│ 总12 | 已激活8 | 待激活2 | 已归档2            │
│                                              │
│ 标签 Top 5                                    │
│ 肩颈(5) 老客户(3) ...                        │
└──────────────────────────────────────────────┘
```

### 4.2 入口

`ManagerDashboard.tsx` — 将禁用的"运营统计"按钮替换为可用按钮：

```tsx
// BEFORE
<button disabled className="bg-gray-300 ...">
  <p className="font-semibold">运营统计</p>
  <p className="text-sm mt-1">Sprint-4 上线</p>
</button>

// AFTER
<button onClick={() => navigate("/manager/stats")}
  className="bg-green-600 text-white p-4 rounded-lg text-left hover:bg-green-700">
  <p className="font-semibold">运营统计</p>
  <p className="text-sm text-green-100 mt-1">本周 / 本月门店数据</p>
</button>
```

### 4.3 Route

```
App.tsx: + <Route path="/manager/stats" element={<ManagerStatsScreen />} />
```

---

## 5. Files Changed

```
M health_one/platform/routers/dashboard.py        (+~45 行：/manager/stats endpoint)
A frontend/src/screens/ManagerStatsScreen.tsx      (+~130 行：统计页)
M frontend/src/App.tsx                              (+2 行：import + route)
M frontend/src/screens/ManagerDashboard.tsx         (+2 行：激活"运营统计"按钮)
```

---

## 6. No Changes

```
- 数据库结构（零 migration）
- 现有 API（纯新增，不修改任何现有 endpoint）
- HealthPlan / HealthIdentity / ServiceSession 模型
- 健康管理师首页
- RFC / ADR / PRD
```

---

## 7. Risk

| 风险 | 等级 | 缓解 |
|------|------|------|
| completed_followups 使用 updated_at 近似 | Low | MVP 阶段 plan 完成后的额外更新极少 |
| 周/月边界时区问题 | Low | 继承 FEATURE-002 已知时区问题（UTC vs 中国时区 8h 偏移），Pilot 门店营业时间不跨 UTC 日边界 |
| period=month 跨月边界 | Very Low | Python date.replace 处理 |
| 聚合查询性能 | Very Low | MVP < 100 客户，单次查询 < 15ms |

---

## 8. End of Document

FEATURE-005 defines the minimal manager stats page MVP.

**1 new API. 1 new screen. 1 button activation. 0 migrations.**
