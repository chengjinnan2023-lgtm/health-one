# FEATURE-002 — Manager Dashboard Enhancement MVP Plan

Document ID : FEATURE-002
Title       : 店长首页增强 MVP 执行计划
Version     : 1.0
Status      : Plan
Owner       : Development Office
Created     : 2026-06-30
Depends On  : ROLE-002, FEATURE-001

---

## 1. Scope

将店长首页从"客户计数 + 最近客户列表"升级为包含服务/随访/标签维度的运营总览。

4 个模块：

1. **今日概览** — 今日新增客户 / 今日服务 / 待随访数
2. **最近服务** — 最近 5 条服务记录（含客户名）
3. **待随访** — 待处理随访列表（含客户名、计划时间、方式）
4. **客户结构** — 总客户 / 已激活 / 已归档 + 标签 Top 5

---

## 2. Data Source

### 2.1 为什么需要新增 API

当前 API 均为 per-identity 查询（sessions/plans 挂在 `{identity_id}` 路径下）。
Manager Dashboard 需要跨所有 identity 的聚合视图：

- 最近 5 条服务 → 需要跨所有客户查询 `service_session` 表
- 待随访列表 → 需要跨所有客户查询 `health_plan` 表
- 标签分布 → 需要聚合所有客户的 `tags` 列

如果纯前端实现，需要：
1. `GET /api/identities/?limit=200` → N 个 identity
2. 对每个 identity 调用 `GET /api/identities/{id}/sessions` → N 次请求
3. 对每个 identity 调用 `GET /api/identities/{id}/plans` → N 次请求

N+1 问题。N=50 时需要 101 次 API 请求。不可接受。

### 2.2 方案：新增 1 个聚合 endpoint

```
GET /api/dashboard/manager
```

一次查询返回 Dashboard 所需全部数据。只读聚合，不修改任何数据。

---

## 3. API Changes

### 3.1 新增 `GET /api/dashboard/manager`

**Response:**

```json
{
  "customer_counts": {
    "total": 12,
    "active": 8,
    "pending": 2,
    "archived": 2,
    "today_new": 2
  },
  "today_sessions": 3,
  "pending_followups_count": 4,
  "recent_sessions": [
    {
      "session_id": "...",
      "customer_name": "张伟",
      "identity_id": "...",
      "service_type": "健康舱",
      "started_at": "...",
      "completed_at": "..."
    }
  ],
  "pending_followups": [
    {
      "plan_id": "...",
      "customer_name": "张伟",
      "identity_id": "...",
      "method": "phone",
      "planned_at": "...",
      "status": "pending"
    }
  ],
  "top_tags": [
    { "tag": "肩颈", "count": 5 },
    { "tag": "老客户", "count": 3 }
  ]
}
```

**实现：**
- 新建 `health_one/platform/routers/dashboard.py`
- 在 `main.py` 中注册 router
- 查询逻辑：直接 SQL 聚合 `health_identity` + `service_session` + `health_plan` 三表
- 无需新 schema 文件——用 inline dict 或 Pydantic model

### 3.2 `main.py` — 注册 dashboard router

```python
from health_one.platform.routers import dashboard
app.include_router(dashboard.router)
```

---

## 4. Frontend Changes

### 4.1 `ManagerDashboard.tsx` — 完全重写

替换为 4 模块布局：

```
┌──────────────────────────────────────────────┐
│ 店长工作台                     张三，欢迎回来 │
├──────────────────────────────────────────────┤
│ [今日新增] [今日服务] [待随访]  3 列卡片       │
├──────────────────────────────────────────────┤
│ 客户结构                                      │
│ 总12 | 已激活8 | 已归档2 | 待激活2            │
│ 标签 Top 5: 肩颈(5) 老客户(3) ...            │
├──────────────────────────────────────────────┤
│ 最近服务  |  待随访                           │
│ 张伟-健康舱 | 张伟-phone-7/3                 │
│ 李娜-咨询   | 李娜-wechat-7/4               │
├──────────────────────────────────────────────┤
│ [客户管理]  [运营统计(Sprint-4)]              │
└──────────────────────────────────────────────┘
```

### 4.2 改动范围

```
M frontend/src/screens/ManagerDashboard.tsx   (重写，~140 行 → ~200 行)
```

---

## 5. Backend Changes

```
A health_one/platform/routers/dashboard.py    (新增，~80 行)
M health_one/platform/main.py                  (+2 行：import + include_router)
```

---

## 6. No Changes

```
- 数据库结构（零 migration）
- 现有 API（纯新增，不修改）
- 前端其他页面（仅 ManagerDashboard）
- 健康管理师首页
- RFC/ADR/PRD
```

---

## 7. Risk

| 风险 | 等级 | 缓解 |
|------|------|------|
| 聚合查询性能 | Low | MVP < 100 客户，3 表 JOIN 全扫描 < 10ms |
| 今日新增判断 | Low | `created_at::date = TODAY`，PostgreSQL 索引友好 |
| top_tags 聚合 | Low | Python 内存聚合 JSONB tags，< 100 客户 < 1ms |
| dashboard API 未来与 BI 重叠 | Info | 标注为 MVP dashboard endpoint，Sprint-5+ 可用 BI 查询引擎替代 |

---

## 8. End of Document

FEATURE-002 defines the minimal Manager Dashboard enhancement.

**1 new API. 1 new file. 1 rewritten component. Zero DB changes.**
