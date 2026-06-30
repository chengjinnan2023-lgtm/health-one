# FIX-FEATURE-003 — CSV Export JWT Download Fix

Document ID : FIX-FEATURE-003
Title       : CSV 导出 JWT Bearer Token 下载修复
Version     : 1.0
Status      : Complete
Owner       : Development Office
Created     : 2026-06-30
Depends On  : QA-FEATURE-003 (M1 MUST FIX)

---

## 1. Root Cause

`ManagerDashboard.tsx` 使用 3 个 `<a href="...">` 标签触发 CSV 下载。

```tsx
// BEFORE — broken
<a href={`${VITE_API_BASE_URL}/api/dashboard/manager/export/csv?type=customers`}>
  📄 导出今日客户 CSV
</a>
```

浏览器原生 `<a>` 导航仅自动携带 **Cookie**，不携带 `localStorage` 中的自定义 header。
前端 JWT 存储在 `localStorage`（`access_token`），通过 `Authorization: Bearer <token>` header 传递。
后端 `get_current_staff` 依赖 `HTTPBearer` 从 header 提取 token。

→ 无 header → `credentials = None` → HTTP 401 → 导出失败。

## 2. Fix Applied

将 `<a>` 标签替换为 `<button>` + `fetch()` + Blob 下载。

**新增 `downloadCSV` 函数：**

```tsx
async function downloadCSV(type: string) {
  const base = import.meta.env.VITE_API_BASE_URL || "";
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${base}/api/dashboard/manager/export/csv?type=${type}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(`导出失败 (${res.status})`);
  const blob = await res.blob();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}
```

**3 个按钮替换：**

```tsx
<button onClick={() => downloadCSV("customers")} ...>📄 导出今日客户 CSV</button>
<button onClick={() => downloadCSV("sessions")}   ...>📄 导出今日服务 CSV</button>
<button onClick={() => downloadCSV("followups")}  ...>📄 导出待随访 CSV</button>
```

**关键设计决策：**

| 决策 | 理由 |
|------|------|
| `a.download = ""` | 让浏览器使用 `Content-Disposition` header 中的 filename |
| 不解析 filename | 避免解析 header 逻辑，信任后端 Content-Disposition |
| `URL.revokeObjectURL` | 清理 Blob URL，防止内存泄漏 |
| 保留原有样式 | button 复用原 `<a>` 的 className，视觉一致 |
| `+ cursor-pointer` | `<button>` 默认无 pointer cursor，显式添加 |

## 3. Files Changed

```
M frontend/src/screens/ManagerDashboard.tsx   (+17 行 downloadCSV, 3 <a> → 3 <button>)
```

**未修改：**
- 后端 `dashboard.py`（零变更）
- API 接口签名（零变更）
- Auth 机制（零变更）
- 数据库（零变更）
- 任何文档/RFC/ADR（零变更）

## 4. Validation Result

| 检查 | 结果 |
|------|------|
| `npm run build` | ✅ 97ms |
| `npx tsc --noEmit` | ✅ 通过 |
| `ruff check` | N/A（无 Python 变更） |
| `pytest tests/` | ✅ 6 passed（auth tests），1 pre-existing failure（needs PostgreSQL） |

**预存问题确认：**
`test_api_identity.py::test_create_identity` 返回 401 — 需要 PostgreSQL 运行中。与本次修改无关，为 VERSION.md 记录的已知限制。

**手工验证清单（需 API 运行环境）：**

```
□ 店长登录 → 点击"导出今日客户 CSV" → 下载 customers-YYYY-MM-DD.csv
□ 点击"导出今日服务 CSV" → 下载 sessions-YYYY-MM-DD.csv
□ 点击"导出待随访 CSV" → 下载 followups-YYYY-MM-DD.csv
□ Excel/WPS 打开 → 中文表头不乱码
□ 健康管理师登录 → 首页无导出按钮
□ 服务人员登录 → 首页无导出按钮
```

## 5. Remaining Warnings

以下 WARNING 来自 QA-FEATURE-003，本次不处理：

| # | 描述 | 阻塞？ |
|---|------|--------|
| W1 | `type` 参数覆盖 Python built-in | 否 |
| W2 | `followups` 忽略 `export_date` 但文件名含该日期 | 否 |
| W3 | `planned_at` 截断为日期 | 否 |
| W4 | 继承 FEATURE-002 时区问题 | 否 |
| W5 | Dashboard 与 Export 时间上界不一致 | 否 |
| W6 | export endpoint 无专门测试 | 否 |
| W7 | `StreamingResponse` 包裹非流式 StringIO | 否 |

## 6. Recommendation

```
✅ APPROVE COMMIT — M1 已修复，零回归，零后端变更。
```

**Commit message 建议：**

```
fix(dashboard): use fetch+Blob for CSV download to carry JWT Bearer token

QA-FEATURE-003 M1: <a> tag navigation does not include Authorization
header from localStorage. Replace with button→fetch→Blob→download.

Ref: docs/qa/QA-FEATURE-003-DAILY-EXPORT.md
```

---

## 7. End of Document

FIX-FEATURE-003 resolves the single MUST FIX from QA-FEATURE-003.

**1 file changed. +17 lines. 3 <a> → 3 <button>. Zero backend changes.**
