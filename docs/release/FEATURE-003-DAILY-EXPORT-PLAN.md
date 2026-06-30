# FEATURE-003 — Daily Export MVP Plan

Document ID : FEATURE-003
Title       : 门店日报导出 MVP 执行计划
Version     : 1.0
Status      : Plan
Owner       : Development Office
Created     : 2026-06-30
Depends On  : FEATURE-002 (Manager Dashboard)

---

## 1. Scope

为店长提供每日运营数据 CSV 导出能力。3 类导出：

| 导出 | 文件名 | 字段 |
|------|--------|------|
| 今日新增客户 | `customers-2026-06-30.csv` | 姓名、状态、标签、创建时间 |
| 今日服务记录 | `sessions-2026-06-30.csv` | 客户名、服务类型、时间、状态 |
| 待随访列表 | `followups-2026-06-30.csv` | 客户名、方式、计划时间、状态 |

---

## 2. Data Source

### 2.1 方案：新增 1 个 CSV 导出 endpoint

当前 dashboard API 返回的数据：
- `customer_counts.today_new` — 只有计数，无今日客户列表
- `today_sessions` — 只有计数，无今日服务列表
- `pending_followups[]` — 有完整列表（可直接导出）

需要新增查询获取今日客户列表和今日服务列表。

### 2.2 API

```
GET /api/dashboard/manager/export/csv?type=customers|sessions|followups
```

| 参数 | 说明 |
|------|------|
| `type` | 导出类型：`customers` / `sessions` / `followups` |
| `date` | 可选，默认今天。格式 `YYYY-MM-DD` |

**返回：**
- `Content-Type: text/csv; charset=utf-8`
- `Content-Disposition: attachment; filename="customers-2026-06-30.csv"`
- BOM `﻿` 前缀确保 Excel 正确识别中文

---

## 3. Implementation

### 3.1 Backend

| 文件 | 变更 |
|------|------|
| `health_one/platform/routers/dashboard.py` | +~60 行：新增 `GET /manager/export/csv` 端点 |

**查询逻辑（复用 FEATURE-002 模式）：**
- `type=customers`：`SELECT * FROM health_identity WHERE created_at >= today_start ORDER BY created_at DESC`
- `type=sessions`：`SELECT s.*, i.display_name FROM service_session s JOIN health_identity i ON ... WHERE s.created_at >= today_start ORDER BY s.created_at DESC`
- `type=followups`：复用现有 pending_followups 查询，格式化为 CSV

### 3.2 Frontend

| 文件 | 变更 |
|------|------|
| `frontend/src/screens/ManagerDashboard.tsx` | +~30 行：3 个导出按钮 + CSV 下载逻辑 |

**入口位置：** ManagerDashboard 底部，"客户管理"和"运营统计"按钮上方，新增"导出日报"区域。

**实现方式：** 纯前端触发后端 CSV 下载。使用 `<a>` 标签 + `href` 指向 CSV endpoint，浏览器自动下载。

```
┌──────────────────────────────────────────────┐
│ ... (当前 ManagerDashboard 全部模块) ...      │
├──────────────────────────────────────────────┤
│ 📥 导出日报                                   │
│ [导出今日客户 CSV] [导出今日服务 CSV]          │
│ [导出待随访 CSV]                              │
├──────────────────────────────────────────────┤
│ [客户管理]  [运营统计(Sprint-4)]              │
└──────────────────────────────────────────────┘
```

---

## 4. No Changes

```
- 数据库结构
- 现有 API（纯新增 endpoint）
- 健康管理师首页
- RFC/ADR/PRD
- 任何 AI 功能
```

---

## 5. Risk

| 风险 | 等级 | 缓解 |
|------|------|------|
| CSV 中文乱码 | Low | BOM + UTF-8 + charset header |
| 大日期范围性能 | Very Low | 仅支持单日导出，数据量 < 100 行 |
| CSV injection | Low | 无公式字段（姓名/标签/服务类型均为纯文本） |
| 非店长访问 | Low | 同 dashboard API，前端 gate（role === "店长"） |

---

## 6. Files Changed

```
M health_one/platform/routers/dashboard.py           (+~60 行)
M frontend/src/screens/ManagerDashboard.tsx           (+~30 行)
```

---

## 7. End of Document

FEATURE-003 defines the minimal daily CSV export for store managers.

**1 new endpoint. 0 migrations. 2 files changed.**
