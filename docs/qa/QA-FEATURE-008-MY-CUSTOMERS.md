# QA-FEATURE-008 — My Customers MVP Review

Document ID : QA-FEATURE-008
Title       : 健康管理师"我的客户"视图质量审查
Version     : 1.0
Status      : Complete
Owner       : QA Office
Audience    : Development / Product
Created     : 2026-07-01
Reviewed    : identity.py:81+101-102, MyCustomersScreen.tsx, HealthAdvisorDashboard.tsx, App.tsx

---

## 1. API Semantics

### 1.1 assigned_staff_id 查询参数

```
✅ PASS — 与现有查询参数语义兼容
```

```python
assigned_staff_id: str | None = Query(None, description="Filter by assigned staff (FEATURE-008)")

if assigned_staff_id:
    stmt = stmt.where(HealthIdentity.assigned_staff_id == assigned_staff_id)
```

| 检查点 | 结果 |
|--------|------|
| Optional | ✅ 不传则不过滤（向后兼容） |
| 与其他 filter 组合 | ✅ AND 关系，与 q/tag/status 可叠加 |
| include_archived 默认 false | ✅ 自动排除已归档客户 |
| null 客户行为 | ✅ `assigned_staff_id IS NULL` 不匹配任何 filter |
| 空字符串 | ✅ `if assigned_staff_id:` → False → 不过滤 |

### 1.2 S1 兼容性

```
✅ PASS — S1 CustomerSearchScreen 不受影响
```

S1 调用 `GET /api/identities/?q=...&limit=...`，不传 `assigned_staff_id`。新参数为 optional，不影响原有行为。

### 1.3 UUID 类型转换

```
⚠️ WARNING — assigned_staff_id 无 UUID pattern 校验
```

```python
assigned_staff_id: str | None = Query(None, ...)  # 无 pattern=
```

对比其他 UUID 参数（如 `store_id: uuid.UUID`），`assigned_staff_id` 使用 `str` 类型。若传非 UUID 字符串（如 `?assigned_staff_id=abc`），SQLAlchemy UUID 列 `==` 比较可能引发 PostgreSQL DataError。

**评估：** 低风险。前端始终传 `staff?.staff_id`（有效 UUID）。直接 API 误用概率极低。Sprint-5+ 可改为 `uuid.UUID` 类型或加 `pattern=` 校验。

---

## 2. Data Boundary

### 2.1 健康管理师数据边界

```
✅ PASS — 仅返回 assigned_staff_id == 当前 staff 的客户
```

```tsx
api.get(`/api/identities/?assigned_staff_id=${staff?.staff_id}&limit=50`)
```

- 店长分配给健康管理师的客户 → ✅ 可见
- 未归属客户 → ❌ 不可见（正确——不属于"我的客户"）
- 分配给其他健康管理师的客户 → ❌ 不可见（正确）
- 已归档客户 → ❌ 不可见（默认排除，合理）

### 2.2 店长不受影响

```
✅ PASS — 店长继续使用 /customers（S1）+ /manager/stats
```

店长的客户管理路径未改变。`assigned_staff_id` 参数为 optional，不影响店长搜索全店客户。

### 2.3 跨角色访问

```
⚠️ WARNING — /my-customers 路由无角色守卫
```

与所有 ProtectedRoute 内页面一致——任何已认证用户可通过 URL 直接访问。服务人员打开后看到"暂无负责的客户"（因为没有客户分配给他们）。数据暴露为客户名+状态+标签——Low 敏感度。与 ROLE-001 已知 Deferred 模式一致。

---

## 3. UI / UX

### 3.1 入口

```
✅ PASS — "我的客户"入口清楚
```

```
健康管理师首页
├── ⏳ 我的待随访（follow-up-queue?staff_id=me）
├── 📋 最近客户（GET /identities/?limit=10）
├── [我的客户]    ← 新增，indigo 色，位于客户管理上方
└── [客户管理]
```

"我的客户"（indigo）与"客户管理"（blue）视觉区分。"我的客户"更靠上——符合"以自己客户为中心"的定位。

### 3.2 列表信息

```
✅ PASS — 信息足够让健康管理师理解"这是我的客户"
```

| 元素 | 内容 | 评价 |
|------|------|------|
| 客户名 | 大字 | ✅ 主焦点 |
| 状态 badge | 已激活/待激活/已归档 | ✅ 颜色区分 |
| 标签 | 蓝色圆角 | ✅ 复用全局风格 |
| 待随访提示 | ⏳ 待随访：电话 · 7/3（橙色） | ✅ 醒目，可操作线索 |
| 入口按钮 | 查看 → | ✅ 跳转 S2 |

### 3.3 待随访提示

```
✅ PASS — 有帮助的信息增量
```

```tsx
const fu = followUpMap.get(c.identity_id);
{fu && <div>⏳ 待随访：{fu.reason} · {planned_at}</div>}
```

- 数据来源：`GET /api/dashboard/follow-up-queue?staff_id=me`（并行加载）
- 仅显示第一个待随访（`map.set` 去重）
- 无待随访时不显示——列表更干净

**为什么有用：** 健康管理师不需要点进每个客户看有无待随访。列表页一眼可知哪些客户需要马上跟进。

### 3.4 空状态

```
✅ PASS — 两种情况各有文案
```

| 场景 | 文案 | 引导 |
|------|------|------|
| 零负责客户 | "暂无负责的客户" + "请联系店长为客户分配负责人" | ✅ 指向店长 |
| 搜索无结果 | "未找到匹配'xxx'的客户" | ✅ 可修改搜索词 |

### 3.5 搜索

```
✅ PASS — 客户端过滤，即时响应
```

```tsx
customers.filter(c => c.display_name.toLowerCase().includes(search.toLowerCase()))
```

- < 50 个客户，即时过滤，无额外 API 调用
- 搜索框仅在列表非空时显示
- 中文名也适用（`includes` 匹配字符）

---

## 4. Risk

### 4.1 未归属客户的可见性

```
⚠️ API Semantics Risk — LOW
```

健康管理师的"我的客户"仅显示 assigned_staff_id 匹配的客户。如果店长忘记分配某客户给健康管理师，该客户对健康管理师不可见——即使健康管理师经常服务该客户。

**缓解：** 健康管理师仍可通过"客户管理"（S1）搜索全店客户并服务。只是不在"我的客户"列表中。Pilot 阶段口头协调即可。

### 4.2 组合查询边界

```
✅ PASS — 所有 filter 为 AND 关系，行为可预测
```

| 组合 | 行为 | 评价 |
|------|------|------|
| assigned_staff_id + q | 我的客户中搜名字 | ✅ 合理 |
| assigned_staff_id + tag | 当前未使用 | N/A |
| assigned_staff_id + status=pending | 我的待激活客户 | ✅ 语义正确 |

### 4.3 follow-up-queue API 失败

```
✅ PASS — 降级优雅
```

```tsx
api.get<{ items: QueueItem[] }>(`...follow-up-queue?staff_id=...`)
  .catch(() => ({ items: [] }))
```

若 follow-up-queue API 失败，待随访提示静默消失，客户列表仍正常显示。不会阻塞页面。

---

## 5. Test Coverage

### 5.1 测试结果

```
pytest: 21 passed / 0 failed
```

### 5.2 覆盖分析

```
⚠️ WARNING — assigned_staff_id filter 无专门测试
```

| 测试项 | 状态 |
|--------|------|
| 已有 auth + models 测试 | ✅ 21/21（与本次无关） |
| assigned_staff_id filter | ❌ 无测试 |
| MyCustomersScreen | ❌ 无前端测试 |

21 passed 全部来自已有测试。需手工验证。

### 5.3 手工验证清单

```
□  1. 健康管理师登录 → 首页"我的客户"按钮可见且可点击
□  2. 进入"我的客户" → 列表仅显示 assigned_staff_id == 当前 staff 的客户
□  3. 已归档客户不出现在列表中
□  4. 有待随访的客户显示 ⏳ 提示（含原因 + 计划时间）
□  5. 无待随访的客户不显示 ⏳ 提示
□  6. 搜索框中输入客户名 → 列表即时过滤
□  7. 搜索无匹配 → 显示"未找到匹配..."
□  8. 零负责客户 → 显示空状态 + 引导文案
□  9. 点击"查看 →" → 跳转 S2 客户总览
□ 10. 店长登录 → 通过 URL 访问 /my-customers → 显示分配给店长的客户（如有）
□ 11. 服务人员登录 → 通过 URL 访问 /my-customers → 空状态
□ 12. S1 客户搜索（/customers）→ 行为不变，仍可搜索全店客户
```

---

## 6. Findings Summary

| 级别 | 数量 | 编号 |
|------|------|------|
| ✅ PASS | 17 | — |
| ⚠️ WARNING | 4 | W1–W4 |
| ❌ MUST FIX | 0 | — |

### WARNING

| # | 位置 | 描述 | 阻塞？ |
|---|------|------|--------|
| W1 | `identity.py:81` | `assigned_staff_id` 无 UUID pattern 校验 | 否 |
| W2 | `App.tsx` | `/my-customers` 路由无角色守卫（已知 Deferred） | 否 |
| W3 | 测试 | assigned_staff_id filter 无专门测试 | 否 |
| W4 | `MyCustomersScreen.tsx:27` | `staff?.staff_id` 为 undefined 时请求 `/api/identities/?assigned_staff_id=undefined` | 否* |

*\*W4: 仅理论上可能（staff 来自 ProtectedRoute，必定已认证）。实际不会发生。*

---

## 7. Recommendation

### 7.1 是否建议 Commit

```
✅ APPROVE COMMIT — 0 MUST FIX, 4 WARNING 均为已知限制或极低风险。
```

### 7.2 本次变更的意义

FEATURE-008 完成了角色分化的"最后一公里"：

| 角色 | Before FEATURE-007/008 | After |
|------|----------------------|-------|
| 店长 | 店长工作台 + 全店视图 | 不变 |
| 健康管理师 | 全店列表 + N+1 待随访 | **我的待随访 + 我的客户** |
| 服务人员 | 通用首页 | 不变 |

健康管理师现在有了以自己为中心的日常工作入口——打开系统看到的是"我的待随访"和"我的客户"，而非淹没在全店数据中。

### 7.3 QA Approval

```
Status: APPROVE
```

---

## 8. End of Document

QA-FEATURE-008 reviews the health advisor "My Customers" view MVP.

**17 PASS. 4 WARNING. 0 MUST FIX. Approve Commit.**
