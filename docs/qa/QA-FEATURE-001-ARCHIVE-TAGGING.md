# QA-FEATURE-001 — Archive & Tagging MVP Review

Document ID : QA-FEATURE-001
Title       : 客户归档与标签 MVP 质量审查
Version     : 1.0
Status      : Complete
Owner       : QA Office
Audience    : Development / Product
Created     : 2026-06-30
Reviewed    : health_one/platform/models/identity.py, schemas/identity.py, routers/identity.py, alembic/versions/004_*, frontend/src/api/client.ts, CustomerSearchScreen.tsx, CustomerSummaryScreen.tsx

---

## 1. Data Model

### 1.1 health_identity.tags JSONB

```
✅ PASS — 设计合理
```

| 检查点 | 结果 | 说明 |
|--------|------|------|
| 列类型 | ✅ | JSONB，PostgreSQL 原生支持，适合自由文本标签数组 |
| 默认值 | ✅ | `default=list`（ORM）+ `server_default="'[]'::jsonb"`（migration），双重保障 |
| nullable | ✅ | `nullable=False`，不会出现 NULL vs `[]` 的二义性 |
| 无独立 tags 表 | ✅ | PILOT-016 明确决策：MVP 客户 < 100，JSONB 足够，不做过度设计 |
| 类型注解 | ⚠️ | `Mapped[list]` 应为 `Mapped[list[str]]`（见 §1.2） |

### 1.2 Model 类型注解

```
⚠️ WARNING — Mapped[list] 缺少类型参数
```

`health_one/platform/models/identity.py:62`:
```python
tags: Mapped[list] = mapped_column(...)  # 应为 Mapped[list[str]]
```

**影响：** 类型检查器（mypy/pyright）无法推断 tags 的元素类型。不影响运行时行为。建议修正为 `Mapped[list[str]]`，与其他 JSONB 列（如 `HealthTimeline.entries: Mapped[list[dict]]`）风格一致。

### 1.3 Migration 004

```
✅ PASS — 安全
```

| 检查点 | 结果 | 说明 |
|--------|------|------|
| 正向迁移 | ✅ | `ALTER TABLE ADD COLUMN tags JSONB DEFAULT '[]'` — 所有现有行自动填入 `[]` |
| 反向迁移 | ✅ | `DROP COLUMN tags` — 可直接回滚 |
| 向下兼容 | ✅ | 旧 API 调用不传 `tags`，Response 返回 `[]`（Pydantic default） |
| 数据丢失风险 | ✅ | 无——tags 是新增列，不修改现有数据 |

### 1.4 状态机一致性

```
⚠️ WARNING — archive 未写 Timeline（预存问题）
```

| 状态转换 | API | Timeline | 一致性 |
|---------|-----|----------|--------|
| pending → active | `POST /activate` | `identity_activated` ✅ | ✅ |
| active → archived | `POST /archive` | **缺失** ❌ | ⚠️ |
| archived → active | `POST /unarchive` | `identity_unarchived` ✅ | ✅ |

**发现：** `archive_identity` 端点未调用 `append_timeline_entry`。这是 FEATURE-001 之前就存在的预存问题，不是本次引入。但 `unarchive` 已正确写 Timeline，两边不对称。

**建议：** 本次 Commit 前补充 `archive` 的 Timeline entry（`identity_archived`）。一行代码，风险为零。

### 1.5 pending 客户可被归档

```
⚠️ WARNING — API 允许但 UI 场景不明确
```

`archive_identity` 的 409 守卫只检查 `!= "archived"`，不阻止 pending → archived。这意味着 pending 客户可通过 API 直接归档。

**UI 层面：** S2 的"归档客户"按钮在 `!isArchived` 条件下渲染，pending 客户也可以看到归档按钮。这可能是合理的（未激活的客户也可以归档），但 PILOT-016 未明确定义此场景。

**建议：** 保持当前行为。pending → archived 是可逆的，不造成数据问题。如果后续发现问题，限制为 `active → archived` 即可。

---

## 2. API

### 2.1 POST /api/identities/{id}/unarchive

```
✅ PASS — 状态机正确
```

| 检查点 | 结果 | 说明 |
|--------|------|------|
| 404 | ✅ | identity 不存在返回 404 |
| 409 | ✅ | 非 archived 状态返回 409，detail 包含当前状态 |
| 状态转换 | ✅ | archived → active |
| Timeline | ✅ | `identity_unarchived` + performed_by |
| 响应 | ✅ | 200 IdentityResponse（含更新后 tags） |

### 2.2 GET /api/identities/?tag=xxx

```
✅ PASS — 行为正确
```

| 检查点 | 结果 | 说明 |
|--------|------|------|
| JSONB contains | ✅ | `HealthIdentity.tags.contains([tag])` → PostgreSQL `@>` 操作符 |
| 精确匹配 | ✅ | `?tag=肩颈` 匹配 `tags` 数组中包含 `"肩颈"` 的记录 |
| 无 tag 参数 | ✅ | 不添加筛选条件 |
| 与其他 filter 组合 | ✅ | `?q=张&tag=肩颈` 同时生效（AND 逻辑） |
| 空结果 | ✅ | 返回 `[]` |

### 2.3 GET /api/identities/?include_archived=true

```
✅ PASS — 默认安全
```

| 检查点 | 结果 | 说明 |
|--------|------|------|
| 默认行为 | ✅ | `include_archived=False` → 默认隐藏 archived |
| 显式 status | ✅ | `?status=archived` 仍可以专门查已归档（不触发 elif 排除逻辑） |
| include_archived | ✅ | `?include_archived=true` → 返回全部状态客户 |

**逻辑流程：**
```
if status:
    filter by status          ← 显式状态查询，不过滤
elif not include_archived:
    exclude archived          ← 默认安全行为
else:
    no status filter          ← include_archived=true
```

### 2.4 PATCH /api/identities/{id} — tags 更新

```
✅ PASS — 不会误伤其他字段
```

| 检查点 | 结果 | 说明 |
|--------|------|------|
| optional 语义 | ✅ | `tags: list[str] \| None = None` — 不传 tags 不修改 |
| 显式 null | ⚠️ | 如果显式传 `"tags": null`，Pydantic 将 `tags` 设为 `None` → `if body.tags is not None` 为 False → 不修改。行为正确，但语义微妙 |
| 替换语义 | ✅ | 前端发送完整新数组（添加/删除均通过 PATCH 完整数组），API 直接赋值 |
| 并发冲突 | ⚠️ | Last write wins。两人同时编辑标签时可能互相覆盖（见 §5.3） |

---

## 3. UI / UX

### 3.1 S1 默认隐藏 archived

```
✅ PASS — 合理
```

- 初始加载 `GET /api/identities/?limit=20` 不带 `include_archived` → 默认排除 archived
- 已归档客户不出现在默认列表，减少视觉噪音
- 符合 PILOT-016 §6 设计

### 3.2 "包括已归档" checkbox

```
✅ PASS — 清晰
```

- 位置：标签筛选下方，独立一行
- 交互：勾选后立即触发 `doSearch`（通过 `useEffect` 依赖）
- 文案：中文"包括已归档客户"，语义明确

### 3.3 标签筛选 + 搜索同时使用

```
⚠️ WARNING — 标签选中时清除搜索文本
```

`handleTagClick` 的行为：`setSelectedTag(...); setQuery("")`。即点击标签 chip 会清除搜索框中的文字。

**用户场景分析：**
- "先搜索张伟，再想只看肩颈标签" → 输入"张伟"搜索 → 点击"肩颈"标签 → 搜索文字被清除 → 只按标签筛选，丢失了名字筛选。用户需要重新输入"张伟"。
- 实际执行：重新输入"张伟"后，API 请求 `?q=张伟&tag=肩颈`，两个筛选同时生效。

**影响：** 低。先标签后搜索的顺序仍然可用（点击标签 → 输入搜索词）。这是一个交互顺序的 UX 摩擦点，非功能缺陷。

### 3.4 S2 标签编辑

```
✅ PASS — 清晰可用
```

| 检查点 | 结果 | 说明 |
|--------|------|------|
| 添加标签 | ✅ | "+ 添加标签"→ 输入框 → 回车或点"添加"→ PATCH API |
| 删除标签 | ✅ | 点击标签 × → PATCH API（移除后完整数组） |
| 建议标签 | ✅ | 输入框激活时显示 12 个建议标签，点击直接填入输入框 |
| 重复标签 | ✅ | 前端 `includes(tag)` 守卫，已存在的标签不重复添加 |
| 空状态 | ✅ | "暂无标签"灰色文字 |

### 3.5 S2 底部归档/恢复入口

```
✅ PASS — 不会误触
```

| 检查点 | 结果 | 说明 |
|--------|------|------|
| 位置 | ✅ | 页面最底部，`mt-8 pt-4 border-t`，与主操作区有明确视觉分隔 |
| 按钮样式 | ✅ | `text-gray-400 text-sm`（归档）/ `text-gray-500 text-sm`（恢复），低视觉权重 |
| hover 效果 | ✅ | 归档按钮 hover 变红（警示色） |
| 确认机制 | ❌ | 无二次确认弹窗。误点击直接归档 |
| 可恢复性 | ✅ | 归档后可恢复，误操作可逆 |

**关于无确认弹窗：** 归档是可逆操作（unarchive），且有 Timeline 记录。不做确认弹窗是合理的——避免过度确认。但如果后续发现误归档频繁，可加确认。

### 3.6 已归档客户隐藏主操作

```
✅ PASS — 符合预期
```

已归档客户在 S2 中：
- 隐藏"记录健康关注"按钮：`!isArchived` 条件
- 隐藏"新建服务"按钮：原本只对 `active` 显示
- 显示"已归档"状态 badge
- 底部显示"恢复客户"按钮

---

## 4. Timeline

### 4.1 Archive Timeline

```
❌ MUST FIX — archive 端点不写 Timeline
```

`POST /api/identities/{id}/archive` 缺少 `append_timeline_entry` 调用。

```python
# 当前（缺失 Timeline）：
identity.activation_status = "archived"
await db.commit()

# 应该：
identity.activation_status = "archived"
await append_timeline_entry(
    db,
    identity_id=identity.identity_id,
    event_type="identity_archived",
    source_object_type="HealthIdentity",
    source_object_id=identity.identity_id,
    summary_text=f"健康元 archived: {identity.display_name}",
    performed_by=staff.staff_id,
)
await db.commit()
```

**严重程度：** MUST FIX。不是 FEATURE-001 引入的新问题（预存），但本次新增的 unarchive 已正确写 Timeline，造成不对称。Constitution §8 要求"所有健康数据必须可追溯"——归档是不可追溯的。

### 4.2 Unarchive Timeline

```
✅ PASS
```

`POST /api/identities/{id}/unarchive` 正确追加：
- `event_type: "identity_unarchived"`
- `summary_text: "健康元 unarchived: {display_name}"`
- `performed_by: staff.staff_id`

### 4.3 Timeline 文案

```
✅ PASS — 清楚
```

| API | Timeline event_type | summary_text |
|-----|---------------------|-------------|
| activate | `identity_activated` | 健康元 activated: {name} |
| archive | — **缺失** — | — |
| unarchive | `identity_unarchived` | 健康元 unarchived: {name} |

---

## 5. Risk Assessment

### 5.1 误归档风险

```
✅ Data Risk — LOW（可逆）
```

归档后可恢复，Timeline 有记录。唯一的"风险"是归档后客户从默认列表消失，店员可能以为客户被删除了。S1 有"包括已归档"checkbox + S2 底部有"恢复客户"按钮。可接受。

### 5.2 标签污染 / 重复标签

```
⚠️ Data Risk — LOW
```

| 风险 | 缓解 |
|------|------|
| 同义标签（"肩颈" vs "颈椎"） | 自由文本的固有特性。不在此 MVP 范围解决 |
| 尾部空格导致不同标签 | 前端不做 trim 以外的标准化。低概率 |
| API 直接传重复标签 | 前端守卫 + API `contains` 不影响查询结果 |
| 拼写错误 | 标签可删除重加。低影响 |

**建议：** 在 10-20 客户规模下，人工维护足够。无需代码层面去重或标准化。

### 5.3 JSONB 查询性能

```
⚠️ Performance Risk — LOW（当前阶段可接受）
```

| 风险 | 评估 |
|------|------|
| 无 GIN index | `tags @> '["肩颈"]'` 使用顺序扫描。客户 < 100 时耗时 < 1ms |
| 全表扫描 | 与 name ILIKE 查询同级别。当前 scale 下瓶颈不在 DB |
| 未来 1000+ 客户 | 需要 GIN index `CREATE INDEX idx_tags ON health_identity USING GIN (tags)` |

**结论：** 当前阶段可接受。建议在 `docs/release/FEATURE-001-ARCHIVE-TAGGING-PLAN.md` 或 ADR 中记录"Sprint-5+ 评估是否需要 GIN index"。

### 5.4 并发标签编辑

```
⚠️ Data Risk — LOW
```

两个店员同时编辑同一客户的标签，PATCH API 使用替换语义，last write wins。当前 2-3 店员规模下几乎不会同时编辑同一客户。可接受。

---

## 6. Test Impact

### 6.1 测试结果

```
pytest: 26 passed / 21 failed
```

### 6.2 失败分析

| 类别 | 数量 | 原因 |
|------|------|------|
| 预存 PostgreSQL 集成测试失败 | 21 | 需要 PostgreSQL 运行 + 完整 auth 流程。FEATURE-001 前后失败数不变 |
| 本次新增失败 | 0 | 无 |

### 6.3 通过的测试

```
test_store_models.py:  9/9 ✅  (含 StaffRole.SERVICE_STAFF 枚举验证)
test_models.py:        6/6 ✅  (含 HealthIdentity activation_status + tablename)
test_health.py:        ✅
test_api_auth.py:      ✅
```

### 6.4 SUGGESTED_TAGS 重复定义

```
⚠️ NOTE — S1 和 S2 各自定义 SUGGESTED_TAGS，未抽取为共享常量
```

两处建议标签数组内容相同（12 个标签）。非功能缺陷，但后续修改时需同步两处。建议抽取到 `frontend/src/constants/tags.ts` 或类似共享模块。不阻塞 Commit。

---

## 7. Findings Summary

| 级别 | 数量 | 编号 |
|------|------|------|
| ✅ PASS | 11 | — |
| ⚠️ WARNING | 5 | W1-W5 |
| ❌ MUST FIX | 1 | MF1 |

### MUST FIX

| # | 位置 | 描述 |
|---|------|------|
| MF1 | `routers/identity.py:174` | `archive_identity` 不写 Timeline entry。与 activate/unarchive 不一致，违反 Constitution §8 可追溯原则 |

### WARNING

| # | 位置 | 描述 |
|---|------|------|
| W1 | `models/identity.py:62` | `Mapped[list]` 缺少类型参数，应为 `Mapped[list[str]]` |
| W2 | `CustomerSearchScreen.tsx:91-93` | 点击标签 chip 清除搜索文本，先搜索后筛选的流程被打断 |
| W3 | `CustomerSearchScreen.tsx` + `CustomerSummaryScreen.tsx` | `SUGGESTED_TAGS` 在两处重复定义 |
| W4 | `routers/identity.py:171-172` | pending 客户可被归档（API 不阻止）。当前可接受，后续可能需要限制 |
| W5 | Performance | 无 GIN index on tags。当前 scale 下可接受，Sprint-5+ 评估 |

---

## 8. Recommendation

### 8.1 是否建议 Commit

```
APPROVE COMMIT — 条件：修复 MF1 后 Commit
```

**修复 MF1 后即可安全 Commit。** 5 个 WARNING 均为已知限制或预存问题，不阻塞。

### 8.2 建议 Commit 前修复

```
1. MF1：给 archive_identity 加 append_timeline_entry (1 行, 零风险)
```

### 8.3 建议 Commit 后跟进（非阻塞）

```
2. W1：Mapped[list] → Mapped[list[str]] (类型注解, 不影响运行)
3. W2+W3：抽取 SUGGESTED_TAGS 到共享常量 + 评估 tag+search 交互
4. W5：记录 GIN index 评估节点（Sprint-5+）
```

### 8.4 QA Approval

```
Status: CONDITIONAL APPROVE
Condition: MF1 修复后 Approve
```

---

## 9. End of Document

QA-FEATURE-001 reviews the Archive & Tagging MVP implementation.

**11 PASS. 5 WARNING. 1 MUST FIX (archive Timeline). Fix MF1 → Approve Commit.**
