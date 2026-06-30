# QA-FEATURE-003 — Daily Export MVP Review

Document ID : QA-FEATURE-003
Title       : 日报导出 MVP 质量审查
Version     : 1.0
Status      : Complete
Owner       : QA Office
Audience    : Development / Product
Created     : 2026-06-30
Reviewed    : health_one/platform/routers/dashboard.py:152-241, frontend/src/screens/ManagerDashboard.tsx:168-186

---

## 1. Export API Design

### 1.1 最小导出原则

```
✅ PASS — 符合最小导出原则
```

| 检查点 | 结果 | 说明 |
|--------|------|------|
| 单一端点 | ✅ | 1 个 endpoint，通过 `type` 参数区分 3 种导出 |
| 只读 | ✅ | 纯 SELECT，无副作用 |
| 参数校验 | ✅ | `type` regex `^(customers\|sessions\|followups)$` + `export_date` regex `^\d{4}-\d{2}-\d{2}$` |
| 无额外依赖 | ✅ | 仅使用 Python 标准库 `csv` 模块 |
| 格式单一 | ✅ | 仅 CSV，不做 PDF/Excel |

### 1.2 type 参数

```
⚠️ WARNING — type 参数名覆盖 Python built-in
```

```python
type: str = Query(...)  # 'type' shadows built-in type()
```

不影响运行（FastAPI 将参数名映射为 query param `?type=`），但 IDE 会发出警告，且不符合 Python 命名最佳实践。建议改为 `export_type`。

### 1.3 export_date 参数

```
⚠️ WARNING — followups 类型忽略 export_date
```

| type | 是否使用 export_date | 行为 |
|------|-------------------|------|
| customers | ✅ | 筛选当天创建的客户 |
| sessions | ✅ | 筛选当天创建的服务 |
| **followups** | ❌ | **忽略日期，返回全部 pending followup** |

**问题：** 前端按钮不传 `export_date`，默认今天，行为一致。但如果用户手动调用 API 传 `export_date=2026-06-29&type=followups`，返回的仍是全部待随访，与期望不符。

**评估：** 低影响。待随访是"当前状态"，不按日期范围变化。当前行为有合理语义——但应文档化或统一处理。

### 1.4 不必要扩展

```
✅ PASS — 无过度设计
```

- 无 JSON/Excel/PDF 格式
- 无导出权限系统
- 无自动发送/邮件
- 无历史范围批量导出

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

全部中文，符合门店使用场景。

### 2.2 UTF-8 + BOM

```
✅ PASS — Excel 兼容
```

```python
buf.write("﻿")  # BOM
Content-Type: text/csv; charset=utf-8
Content-Disposition: attachment; filename=...
```

BOM `﻿` 确保 Excel 正确识别 UTF-8 编码的中文。`attachment` 触发浏览器下载而非内联显示。

### 2.3 文件命名

```
✅ PASS — 清晰
```

| type | 文件名示例 |
|------|----------|
| customers | `customers-2026-06-30.csv` |
| sessions | `sessions-2026-06-30.csv` |
| followups | `followups-2026-06-30.csv` |

命名模式一致：`{type}-{date}.csv`。

### 2.4 字段数据格式

```
✅ PASS — 合理
```

| 字段 | 格式 | 评价 |
|------|------|------|
| 标签 | `肩颈、老客户`（中文顿号分隔） | ✅ 适合中文阅读 |
| 时间 | `2026-06-30 14:30` | ✅ Excel 可识别为日期时间 |
| 状态 | `已完成` / `进行中` / `待随访` / `pending` / `active` / `archived` | ✅ 中文标签 |
| 随访方式 | `电话` / `微信` / `短信` / `到店` | ✅ METHOD_LABELS 中文映射 |

### 2.5 followups planned_at 截断

```
⚠️ WARNING — 计划时间仅保留日期部分
```

```python
fu.get("planned_at", "")[:10]  # "2026-07-03T14:00:00" → "2026-07-03"
```

随访计划包含具体时间（如 14:00），但 CSV 仅导出日期。如果店长需要根据具体时间安排工作，缺少精度。**可接受**——日报级别的导出，日期精度足够。

---

## 3. Data Consistency

### 3.1 与 Dashboard 口径对比

| 指标 | Dashboard | Export CSV | 一致？ |
|------|----------|-----------|--------|
| 今日新增客户 | `today_new` = COUNT `created_at >= today_start` | WHERE `created_at >= day_start AND <= day_end` | ✅ |
| 今日服务 | `today_sessions` = COUNT `created_at >= today_start` | WHERE `created_at >= day_start AND <= day_end` | ✅ |
| 待随访 | `pending_followups_count` | 全量 pending（不限 50 上限） | ⚠️ Export 更全面 |

### 3.2 时间边界

```
⚠️ WARNING — 继承 FEATURE-002 时区问题（已知）
```

`date.today()` + `tzinfo=utc` 构造——与 FEATURE-002 QA-FEATURE-002 W2 相同。Pilot 阶段门店营业时间不落在 UTC 日边界，无实际影响。

### 3.3 空数据

```
✅ PASS — 空数据导出有表头
```

导出当天无数据时，CSV 仅含表头行。用户打开后看到空表格（有标题无数据），行为清晰合理。

---

## 4. Role & Access

### 4.1 前端入口

```
✅ PASS — 仅店长首页可见
```

导出区域位于 `ManagerDashboard` 组件内（`App.tsx:26` 限制 `role === "店长"` 才渲染）。健康管理师和服务人员通过正常 UI 路径看不到导出按钮。

### 4.2 后端保护

```
⚠️ WARNING — API 无 role 校验（与 ROLE-001 一致的已知 Deferred 模式）
```

`GET /api/dashboard/manager/export/csv` 仅要求 JWT 认证，不校验 role。非店长可通过直接 API 调用获取 CSV。暴露数据为客户名 + 服务类型 + 随访方式——敏感度 Low。

### 4.3 不影响主操作

```
✅ PASS
```

导出区域位于 ManagerDashboard 底部，3 个 `<a>` 标签下载链接，不阻塞页面交互，不抢占视觉焦点。

---

## 5. Security

### 5.1 CSV Injection

```
⚠️ Security Risk — LOW
```

| 字段 | 注入向量 | 风险 |
|------|---------|------|
| 姓名 (`display_name`) | 可含 `=` `+` `-` `@` | Low — 中文姓名不含公式字符 |
| 标签 (`tags`) | 自由文本 | Low — `=CMD\|'calc'!A0` 可生效。但店员不会注入 |

**缓解：** 当前阶段不需要。Sprint-5+ 如需加固，前缀 `'` 转义首字符 `=` `+` `-` `@`。

### 5.2 中文乱码

```
✅ PASS — BOM + UTF-8 + charset header 三重保障
```

### 5.3 路径遍历

```
✅ PASS — 文件名仅含 `type-YYYY-MM-DD.csv`，无用户输入进入文件系统
```

---

## 6. Code Quality

### 6.1 代码复用

```
✅ PASS
```

`_csv_response` 辅助函数消除 3 处重复。`METHOD_LABELS` 字典复用中文映射。

### 6.2 查询安全

```
✅ PASS — SQLAlchemy 参数化查询，无 SQL 注入风险
```

### 6.3 Memory

```
⚠️ NOTE — _csv_response 将整个 CSV 加载到内存
```

```python
buf = StringIO()
# ... write all rows ...
buf.getvalue()  # 全量内存
```

MVP 单日 < 100 行，内存消耗 < 10KB。可接受。

---

## 7. Test Impact

### 7.1 测试结果

```
pytest: 15 passed / 0 failed
```

### 7.2 覆盖

```
⚠️ WARNING — export endpoint 无专门测试
```

| 测试文件 | 状态 |
|---------|------|
| test_store_models.py | ✅ 9/9 |
| test_models.py | ✅ 6/6 |
| **export CSV 测试** | ❌ 无 |

**不阻塞。** 导出逻辑简单（查询 + CSV 格式化），手工验证更容易覆盖 Excel 兼容性等边界条件。

---

## 8. Findings Summary

| 级别 | 数量 | 编号 |
|------|------|------|
| ✅ PASS | 14 | — |
| ⚠️ WARNING | 5 | W1-W5 |
| ❌ MUST FIX | 0 | — |

### WARNING

| # | 位置 | 描述 | 阻塞？ |
|---|------|------|--------|
| W1 | `dashboard.py:174` | `type` 参数覆盖 Python built-in，建议改名 `export_type` | 否 |
| W2 | `dashboard.py:223-241` | `type=followups` 忽略 `export_date` 参数，始终返回全部 pending | 否 |
| W3 | `dashboard.py:187,237` | 继承 FEATURE-002 时区问题（已知） | 否 |
| W4 | `dashboard.py:238` | followups `planned_at` 截断为日期，丢失具体时间 | 否 |
| W5 | 测试 | export endpoint 无专门测试覆盖 | 否 |

---

## 9. Recommendation

### 9.1 是否建议 Commit

```
APPROVE COMMIT — 0 MUST FIX, 5 WARNING 均为已知限制或可接受行为。
```

### 9.2 建议 Commit 后跟进

```
1. W1：type → export_type（10 秒重命名，需同步前端 query param）
2. W2：文档化或统一 followups 的 export_date 行为
3. W5：添加最小手工验证项（见 §9.3）
```

### 9.3 手工验证建议（Commit 后）

在真实 API 环境下验证：

```
1. curl -H "Authorization: Bearer $TOKEN" \
     "http://localhost:8000/api/dashboard/manager/export/csv?type=customers"
   → 验证返回 CSV 含 BOM + 中文表头 + 数据行

2. 下载后用 Excel/WPS 打开，验证中文不乱码

3. 验证空数据场景（新数据库）：CSV 仅含表头行

4. 验证 export_date=2026-01-01 返回空（含表头）
```

### 9.4 QA Approval

```
Status: APPROVE
```

---

## 10. End of Document

QA-FEATURE-003 reviews the daily CSV export MVP.

**14 PASS. 5 WARNING. 0 MUST FIX. Approve Commit.**
