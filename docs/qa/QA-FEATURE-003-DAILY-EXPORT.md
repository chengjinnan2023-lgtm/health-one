# QA-FEATURE-003 — Daily Export MVP Review

Document ID : QA-FEATURE-003
Title       : 日报导出 MVP 质量审查
Version     : 2.0
Status      : REJECT — 1 MUST FIX blocks Commit
Owner       : QA Office
Audience    : Development / Product
Created     : 2026-06-30
Updated     : 2026-06-30
Reviewed    : health_one/platform/routers/dashboard.py:152–241, frontend/src/screens/ManagerDashboard.tsx:168–186, frontend/src/api/client.ts

---

## 1. Export API Design

### 1.1 最小导出原则

```
✅ PASS — 符合最小导出原则
```

| 检查点 | 结果 | 说明 |
|--------|------|------|
| 单一端点 | ✅ | 1 个 endpoint，`type` 参数区分 3 种导出 |
| 只读 | ✅ | 纯 SELECT，无副作用 |
| 参数校验 | ✅ | `type` regex `^(customers\|sessions\|followups)$`，`export_date` regex `^\d{4}-\d{2}-\d{2}$` |
| 无额外依赖 | ✅ | 仅 Python 标准库 `csv` 模块 |
| 格式单一 | ✅ | 仅 CSV，不做 PDF/Excel |

### 1.2 `type` 参数

```
⚠️ WARNING — type 参数名覆盖 Python built-in
```

`type: str = Query(...)` 覆盖内置函数 `type()`。不影响运行（FastAPI 映射为 query param `?type=`），但 IDE 警告 + 不符合 Python 命名惯例。建议改为 `export_type`。

### 1.3 `export_date` 参数行为

| type | 使用 export_date | 行为 |
|------|-----------------|------|
| customers | ✅ | 筛选当天创建的客户（`>= day_start AND <= day_end`） |
| sessions | ✅ | 筛选当天创建的服务（`>= day_start AND <= day_end`） |
| **followups** | ❌ | **忽略日期，返回全部 pending**（但文件名含该日期） |

```
⚠️ WARNING — followups 忽略 export_date 但文件名使用该日期
```

若用户调用 `?type=followups&export_date=2026-06-01`，文件名是 `followups-2026-06-01.csv`，但内容仍是全量 pending followup。文件名误导。

**评估：** 对默认值（`date.today()`）无影响。但 API 签名暗示参数生效，实际不生效，是接口契约 bug。

### 1.4 与 Plan 偏差

| Plan 说明 | 实际实现 | 偏差 |
|-----------|---------|------|
| 参数名 `date` | `export_date` | 命名偏差，功能等价 |
| 文件名 `followups-{date}.csv` | 相同 | 一致 |
| `<a>` 标签下载 | 已实现 | 见 §5.1 — 致命问题 |

---

## 2. CSV Usability

### 2.1 中文表头

```
✅ PASS — 表头正确
```

| 导出类型 | 表头 |
|---------|------|
| customers | 姓名、状态、标签、创建时间 |
| sessions | 客户名、服务类型、开始时间、状态 |
| followups | 客户名、随访方式、计划时间、状态 |

全部中文，字段数与内容对应。

### 2.2 UTF-8 + BOM

```
✅ PASS — Excel 兼容
```

```python
buf.write("﻿")  # BOM
Content-Type: text/csv; charset=utf-8
Content-Disposition: attachment; filename=...
```

BOM + UTF-8 + charset header 三重保障，Excel/WPS 打开中文不乱码。

### 2.3 文件命名

```
✅ PASS — 清晰
```

命名模式 `{type}-{date}.csv`，纯 ASCII，无空格，浏览器安全。

### 2.4 字段格式

| 字段 | 格式 | 评价 |
|------|------|------|
| 标签 | `肩颈、老客户`（中文顿号） | ✅ 中文阅读友好 |
| 时间 | `2026-06-30 14:30` | ✅ Excel 可解析 |
| 状态 | `已完成`/`进行中`/`待随访` | ✅ 中文可读 |
| 随访方式 | `电话`/`微信`/`短信`/`到店` | ✅ METHOD_LABELS 映射 |

### 2.5 `planned_at` 截断

```
⚠️ WARNING — 计划时间仅保留日期
```

```python
fu.get("planned_at", "")[:10]  # "2026-07-03T14:00:00" → "2026-07-03"
```

丢失具体时间（如 14:00）。日报级别导出可接受，但若店长需按小时安排随访，精度不足。

---

## 3. Data Consistency

### 3.1 与 Dashboard 口径对比

| 指标 | Dashboard | Export CSV | 一致？ |
|------|----------|-----------|--------|
| 今日新增客户 | `COUNT created_at >= today_start` | `WHERE created_at >= day_start AND <= day_end` | ⚠️ Dashboard 无上界 |
| 今日服务 | `COUNT created_at >= today_start` | `WHERE created_at >= day_start AND <= day_end` | ⚠️ 同上 |
| 待随访 | `pending_followups_count`（实际 pending 数） | 全量 pending | ✅ 一致（Export 更全） |

```
⚠️ WARNING — Dashboard 与 Export 时间边界不完全一致
```

Dashboard 仅用 `>= today_start`（无上界），Export 用 `>= day_start AND <= day_end`。对默认 `date.today()` 无实际影响（`created_at` 不会在未来），但对历史日期查询，Export 更精确。

### 3.2 时区问题

```
⚠️ WARNING — 继承 FEATURE-002 已知时区问题
```

`date.today()` + `tzinfo=utc` 构造——与中国时区 (UTC+8) 存在 8 小时偏移。Pilot 门店营业时间不跨 UTC 日边界，无实际影响。Sprint-4 建议统一引入中国时区。

### 3.3 空数据行为

```
✅ PASS — 空数据导出含表头
```

无匹配数据时 CSV 仅含表头行。用户打开后看到空表（有标题无数据），行为明确，不报错。

---

## 4. Role & Access

### 4.1 前端入口

```
✅ PASS — 仅店长首页可见
```

导出区域位于 `ManagerDashboard` 组件内。`App.tsx:26` 仅 `role === "店长"` 渲染 ManagerDashboard。健康管理师和服务人员正常 UI 路径无法看到导出按钮。

### 4.2 后端保护

```
⚠️ WARNING — API 无 role 校验（与 ROLE-001 一致的已知 Deferred 模式）
```

`GET /api/dashboard/manager/export/csv` 仅要求 JWT 认证，不校验 role。非店长可通过直接 API 调用获取 CSV。暴露数据为客户名+服务类型+随访方式——敏感度 Low。

### 4.3 不影响主操作

```
✅ PASS
```

导出区域位于 ManagerDashboard 底部，3 个 `<a>` 链接，不阻塞页面交互。

---

## 5. Security

### 5.1 🚨 MUST FIX — `<a>` 标签无法携带 JWT Bearer Token

```
❌ MUST FIX — CSV 下载在认证环境下不可用
```

**根因：**

```tsx
// ManagerDashboard.tsx:172-183
<a href={`${import.meta.env.VITE_API_BASE_URL || ""}/api/dashboard/manager/export/csv?type=customers`}
   className="...">
  📄 导出今日客户 CSV
</a>
```

1. 前端 JWT 存储在 `localStorage`（`access_token`），通过 `api.get()` 中的 `Authorization: Bearer <token>` header 携带
2. `<a>` 标签触发浏览器原生导航——浏览器仅自动附加 **Cookie**，不附加自定义 header（`Authorization`）
3. 后端 `get_current_staff` 依赖 `HTTPBearer` 从 header 提取 token → 无 header → `credentials = None` → **HTTP 401**
4. 已验证：无 service worker、无全局 fetch 拦截器、无 cookie 回退

**复现：**
```
1. 登录店长账号 → localStorage 有 access_token
2. 点击 "导出今日客户 CSV"
3. 浏览器导航到 /api/dashboard/manager/export/csv?type=customers
4. 后端返回 401 → 浏览器显示 JSON 错误或空白页
5. 前端 401 handler 触发 → localStorage.removeItem + redirect /login
```

**修复方案（推荐方案 A）：**

方案 A — `fetch` + Blob 下载（不改后端，不改 auth）：

```tsx
async function downloadCSV(type: string) {
  const token = localStorage.getItem("access_token");
  const url = `${import.meta.env.VITE_API_BASE_URL || ""}/api/dashboard/manager/export/csv?type=${type}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Download failed");
  const blob = await res.blob();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "";  // 使用 Content-Disposition filename
  a.click();
  URL.revokeObjectURL(a.href);
}
```

前端改动范围：`ManagerDashboard.tsx` — 3 个 `<a>` 替换为 `<button onClick={...}>`，新增 `downloadCSV` 工具函数。

方案 B — Cookie 双通道（改动更大，不推荐 MVP）：
登录时同时设置 `access_token` cookie，后端同时支持 Cookie 和 Bearer 提取。

### 5.2 CSV Injection

```
⚠️ Security Risk — LOW
```

| 字段 | 注入向量 | 风险 |
|------|---------|------|
| 姓名 (`display_name`) | 可含 `=` `+` `-` `@` | Low — 中文姓名不含公式字符 |
| 标签 (`tags`) | 自由文本 | Low — `=CMD\|'calc'!A0` 可生效，但店员不会注入 |

缓解：Sprint-5+ 对首字符 `=` `+` `-` `@` 前缀 `'` 转义。

### 5.3 路径遍历

```
✅ PASS — 文件名仅含 type-YYYY-MM-DD.csv，无用户输入进入文件系统
```

---

## 6. Code Quality

### 6.1 `_csv_response` 复用

```
✅ PASS
```

`_csv_response(rows, filename)` 消除 3 处重复代码。`METHOD_LABELS` 字典复用中文映射。

### 6.2 SQL 安全

```
✅ PASS — SQLAlchemy 参数化查询
```

无字符串拼接 SQL，无 SQL 注入风险。

### 6.3 Memory

```
⚠️ NOTE — 全量内存加载
```

`StringIO.getvalue()` 将整个 CSV 加载到内存。MVP 单日 < 100 行，< 10KB，可接受。

### 6.4 `StreamingResponse` 误用

```
⚠️ NOTE — _csv_response 不是真正的 streaming
```

`_csv_response` 返回 `StreamingResponse(iter([buf.getvalue()]), ...)`，但 `buf.getvalue()` 是完整字符串。未使用生成器逐行产出。功能正确，但 `StreamingResponse` 名不副实。

---

## 7. Test Impact

### 7.1 当前测试

```
⚠️ WARNING — export endpoint 无专门测试
```

| 测试 | 状态 | 说明 |
|------|------|------|
| test_store_models.py | ✅ 9/9 | 与本功能无关 |
| test_models.py | ✅ 6/6 | 与本功能无关 |
| **export CSV** | ❌ 0 条 | 无测试覆盖 |

15 passed 全部来自已有测试（store models + platform models），无任何测试覆盖 CSV 导出逻辑。
Commit 不阻塞，但需手工验证。

### 7.2 手工验证清单（MUST FIX 修复后）

```
□ 1. 登录店长 → 点击导出按钮 → CSV 下载成功（非 401）
□ 2. 下载 customers CSV → Excel 打开 → 中文表头+数据不乱码
□ 3. 下载 sessions CSV → 字段完整
□ 4. 下载 followups CSV → 仅含 pending 状态
□ 5. 空数据库 → 导出 → CSV 仅含表头行
□ 6. export_date=2026-01-01 → 返回空数据（含表头）
□ 7. 健康管理师登录 → 首页无导出入口
□ 8. 服务人员登录 → 首页无导出入口
```

---

## 8. Findings Summary

| 级别 | 数量 | 编号 |
|------|------|------|
| ✅ PASS | 15 | — |
| ⚠️ WARNING | 7 | W1–W7 |
| ❌ MUST FIX | 1 | M1 |

### MUST FIX

| # | 位置 | 描述 | 影响 |
|---|------|------|------|
| **M1** | `ManagerDashboard.tsx:172-183` | `<a>` 标签无法携带 JWT Bearer token，CSV 下载返回 401 | **功能不可用** — 任何认证环境下导出均失败 |

### WARNING

| # | 位置 | 描述 | 阻塞？ |
|---|------|------|--------|
| W1 | `dashboard.py:174` | `type` 参数覆盖 Python built-in | 否 |
| W2 | `dashboard.py:223-241` | `followups` 忽略 `export_date` 但文件名含该日期 | 否 |
| W3 | `dashboard.py:238` | `planned_at` 截断为日期，丢失具体时间 | 否 |
| W4 | `dashboard.py:187,237` | 继承 FEATURE-002 时区问题（已知） | 否 |
| W5 | `dashboard.py:185-186` | Dashboard `>= today_start` 与 Export `BETWEEN day_start AND day_end` 上界不一致 | 否 |
| W6 | 测试 | export endpoint 无专门测试 | 否 |
| W7 | `dashboard.py:165` | `StreamingResponse` 包裹非流式 StringIO | 否 |

---

## 9. Recommendation

### 9.1 是否建议 Commit

```
⛔ BLOCK COMMIT — 1 MUST FIX (M1)
```

**理由：** M1 导致 CSV 导出在认证环境下功能不可用。`<a>` 标签与 Bearer token 认证机制不兼容——这是设计级 bug，不是体验优化。

### 9.2 修复后即可 Commit

修复 M1（`<a>` → `fetch` + Blob 下载）后：
- 所有 WARNING 均为已知限制，不阻塞 Pilot 实店验证
- 零数据库变更，零 API contract 变更
- 15 条已有测试保持通过

### 9.3 修复预估

| 文件 | 改动 | 时间 |
|------|------|------|
| `frontend/src/screens/ManagerDashboard.tsx` | 3 个 `<a>` → 3 个 `<button>` + `downloadCSV()` | 15 分钟 |
| `docs/qa/QA-FEATURE-003-DAILY-EXPORT.md` | 更新为本报告 | 已完成 |

**不修改后端，不修改 auth，不修改 API。**

### 9.4 Commit 后跟进（P2，不阻塞）

```
1. W1：type → export_type 重命名
2. W2：followups 支持 export_date 过滤，或文档化当前行为
3. W6：补充最小集成测试（1 条 happy path per type）
```

---

## 10. End of Document

QA-FEATURE-003 v2.0 performs independent review of daily CSV export MVP.

**Result: ⛔ BLOCK COMMIT. 1 MUST FIX (M1 — `<a>` tag cannot carry JWT Bearer token).**

**Fix M1 → Approve Commit. 零 backend 变更，15 分钟前端修复。**
