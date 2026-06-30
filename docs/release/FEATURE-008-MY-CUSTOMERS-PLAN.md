# FEATURE-008 — Health Advisor My Customers MVP Plan

Document ID : FEATURE-008
Title       : 健康管理师"我的客户"视图 MVP 执行计划
Version     : 1.0
Status      : Plan
Owner       : Development Office
Created     : 2026-07-01
Depends On  : FEATURE-007 (Customer Ownership), FEATURE-004 (Follow-Up Queue)

---

## 1. Scope

健康管理师以自己负责的客户为中心开展日常工作。

**In scope:**
- 仅显示 assigned_staff_id == 当前健康管理师的客户
- 默认排除已归档
- 显示：客户名、状态、标签、待随访提示
- 搜索客户名（客户端）
- 健康管理师首页入口

**Not in scope:**
- 复杂筛选（多标签组合、日期范围）
- 批量操作
- 最近服务提示（需跨表聚合，成本高）
- AI 总结 / 自动提醒

---

## 2. Data Source

### 2.1 零新 API — 复用已有

| 数据 | API | 参数 |
|------|-----|------|
| 我的客户列表 | `GET /api/identities/` | `assigned_staff_id={me}&limit=50` |
| 待随访提示 | `GET /api/dashboard/follow-up-queue` | `staff_id={me}` |

### 2.2 Backend 改动（1 行）

`GET /api/identities/` 新增 optional query param `assigned_staff_id`:

```python
assigned_staff_id: str | None = Query(None, description="Filter by assigned staff")
```

WHERE 子句:
```python
if assigned_staff_id:
    stmt = stmt.where(HealthIdentity.assigned_staff_id == assigned_staff_id)
```

### 2.3 无新表、无 migration

---

## 3. Frontend Changes

### 3.1 MyCustomersScreen.tsx

```
我的客户
共 5 名负责客户

[搜索客户名...]              ← 客户端过滤

┌──────────────────────────────────────────┐
│ 张伟    [已激活]  肩颈·老客户             │
│ ⏳ 待随访：电话 · 7/3      [查看 →]       │
├──────────────────────────────────────────┤
│ 李娜    [已激活]  高意向                  │
│                         [查看 →]         │
└──────────────────────────────────────────┘
```

- 加载：`GET /api/identities/?assigned_staff_id={me}&limit=50` + `GET /api/dashboard/follow-up-queue?staff_id={me}`
- 待随访提示：前端匹配 follow-up-queue 中的 identity_id → 显示 `⏳ 待随访：{reason} · {planned_at}`
- 搜索：客户端 `display_name.includes(q)` 过滤
- 空状态："暂无负责的客户。请联系店长为客户分配负责人。"

### 3.2 Entry

HealthAdvisorDashboard 快捷入口区新增"我的客户"按钮（位于"进入客户管理"上方）。

### 3.3 Route

```
App.tsx: <Route path="/my-customers" element={<MyCustomersScreen />} />
```

---

## 4. Files Changed

```
M health_one/platform/routers/identity.py              (+3: query param + WHERE)
A frontend/src/screens/MyCustomersScreen.tsx            (+110: list + search + follow-up hints)
M frontend/src/App.tsx                                   (+2: import + route)
M frontend/src/screens/HealthAdvisorDashboard.tsx        (+6: entry button)
```

---

## 5. No Changes

```
- 数据库 / migration
- 新 API endpoint（仅扩展现有 query param）
- Staff / Plan / Session 模型
- 店长首页
- RFC / ADR / PRD
```

---

## 6. Risk

| 风险 | 等级 | 缓解 |
|------|------|------|
| assigned_staff_id filter 无索引 | Very Low | MVP < 100 客户，全表扫描 < 5ms |
| 两次 API 调用（identities + follow-up-queue） | Low | 并行 Promise.all，总时间 < 100ms |
| 客户端搜索性能 | Very Low | < 50 个客户，`includes` 过滤 < 1ms |

---

## 7. End of Document

FEATURE-008 defines the health advisor "My Customers" view MVP.

**1 query param. 1 new screen. 0 migrations. 0 new APIs.**
