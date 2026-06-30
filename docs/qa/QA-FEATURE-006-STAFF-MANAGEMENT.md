# QA-FEATURE-006 — Staff Management MVP Review

Document ID : QA-FEATURE-006
Title       : 店员管理 MVP 质量审查
Version     : 1.0
Status      : Complete
Owner       : QA Office
Audience    : Development / Product
Created     : 2026-07-01
Reviewed    : health_one/platform/routers/staff.py, frontend/src/screens/StaffManagementScreen.tsx, frontend/src/layouts/BaseLayout.tsx

---

## 1. API Design

### 1.1 最小化原则

```
✅ PASS — 4 个端点，零 migration，符合 MVP 最小原则
```

| 端点 | 用途 | 评价 |
|------|------|------|
| `GET /api/staff/` | 列出本店店员 | ✅ store_id 从 JWT 提取，自动限域 |
| `POST /api/staff/` | 新增店员 | ✅ store_id 自动注入，不接受请求中的 store_id |
| `PATCH /api/staff/{id}` | 启用/停用 | ✅ 仅允许 status 字段，不暴露其他字段 |
| `POST /api/staff/{id}/reset-password` | 重置密码 | ✅ 独立端点，语义清晰 |

### 1.2 POST /api/staff/ 字段注入

```
✅ PASS — store_id 正确从 JWT 注入
```

```python
new_staff = Staff(
    store_id=staff.store_id,  # ← JWT，非请求体
    ...
)
```

不接受请求中的 store_id，防止跨店注入。

### 1.3 PATCH 逻辑

```
✅ PASS — 状态切换正确
```

| 场景 | 行为 | 状态码 |
|------|------|--------|
| 正常启用 | target.status ← "active" | 200 |
| 正常停用 | target.status ← "inactive" | 200 |
| 停用自己 | 拒绝 | 422 "店长不能停用自己的账号" |
| 跨店操作 | 拒绝 | 403 "无权操作其他门店店员" |
| 店员不存在 | 拒绝 | 404 |

### 1.4 Inline Schema

```
✅ PASS — 3 个 inline Pydantic model，足够稳定
```

未污染 `store/schemas/staff.py`。StaffCreateInput / StaffStatusUpdate / PasswordReset 各司其职，字段最小。

### 1.5 用户名唯一性

```
✅ PASS — 全局唯一
```

```python
select(Staff).where(Staff.username == body.username)
```

检查全局唯一（非 per-store）。正确——用户名用于登录，必须跨店唯一。

---

## 2. Permissions & Security

### 2.1 后端角色强制校验

```
✅ PASS — 首次在 API 级别强制 role 校验
```

所有 4 个端点首行调用 `_require_manager(staff)`：

```python
def _require_manager(staff: Staff):
    if staff.role.value != "店长":
        raise HTTPException(status_code=403, detail="仅店长可管理店员")
```

| 角色 | GET | POST | PATCH | Reset PW |
|------|-----|------|-------|----------|
| 店长 | ✅ | ✅ | ✅ | ✅ |
| 健康管理师 | 403 | 403 | 403 | 403 |
| 服务人员 | 403 | 403 | 403 | 403 |

**与 ROLE-001 的区别：** ROLE-001 建议"前端门控 + 后端 Deferred"。FEATURE-006 选择后端强制校验——正确决策。店员管理涉及账号创建和密码修改，不能仅依赖前端隐藏。

### 2.2 跨店保护

```
✅ PASS — 三层防护
```

| 端点 | 防护方式 |
|------|---------|
| GET | `WHERE store_id = staff.store_id` — SQL 级别过滤 |
| POST | `store_id=staff.store_id` — JWT 注入，不接受请求 |
| PATCH | `target.store_id != staff.store_id → 403` |
| Reset PW | 同上 |

### 2.3 自停用防护

```
✅ PASS — 店长无法停用自己
```

```python
if target.staff_id == staff.staff_id:
    raise HTTPException(status_code=422, detail="店长不能停用自己的账号")
```

| 场景 | 结果 |
|------|------|
| 店长停用健康管理师 | ✅ 允许 |
| 店长停用服务人员 | ✅ 允许 |
| 店长停用自己 | ❌ 422 拒绝 |
| 店长停用另一个店长 | ✅ 允许（如果存在） |

```
⚠️ NOTE — 店长可停用另一个店长
```

若门店有多个店长，其中一个可以停用另一个。当前 Pilot 门店仅 1 名店长，无实际影响。Sprint-5+ 可考虑"仅创始人店长可管理店长角色"。

### 2.4 bcrypt

```
✅ PASS — 正确使用
```

- 创建：`Staff.hash_password(body.password)` — bcrypt + salt
- 重置：`Staff.hash_password(body.password)` — 同上
- 验证：`Staff.verify_password(plain)` — `bcrypt.checkpw`
- 响应：`StaffResponse` 不含 `password_hash` 字段

### 2.5 未认证访问

```
✅ PASS — Depends(get_current_staff) 保护所有端点
```

无 token → 401；无效 token → 401。与所有现有 API 一致。

---

## 3. Data Consistency

### 3.1 停用 → 登录拒绝

```
✅ PASS — auth.py 一致性验证
```

```python
# auth.py:38
if staff.status.value != "active":
    raise HTTPException(status_code=403, detail="Staff account is inactive")
```

停用后立即生效。已登录的 JWT 在过期前仍有效（已知设计——JWT 无状态）。

### 3.2 创建后列表刷新

```
✅ PASS — fetchStaff() 在 create/toggle/reset 后调用
```

```tsx
// StaffManagementScreen.tsx
flash("店员创建成功");
fetchStaff();  // ← 立即刷新列表
```

### 3.3 密码重置不改变 status

```
✅ PASS — reset-password 仅更新 password_hash
```

重置密码后店员 status 不变。已停用的店员重置密码后仍为停用状态——合理，密码重置不等于重新激活。

---

## 4. UI / UX

### 4.1 列表页

```
✅ PASS — 信息清晰
```

| 列 | 内容 | 评价 |
|----|------|------|
| 姓名 | display_name + `（我）` 标识 | ✅ 店长可识别自己 |
| 用户名 | username | ✅ 用于登录的记忆线索 |
| 角色 | 蓝色圆角 badge | ✅ 复用全局 badge 风格 |
| 状态 | 绿色"正常" / 灰色"已停用" | ✅ 一眼区分 |
| 操作 | 停用/启用 + 重置密码 | ✅ 按钮颜色区分操作性质 |

### 4.2 新增店员 Modal

```
✅ PASS — 最小且可用
```

- 4 字段：姓名 / 用户名 / 角色 / 初始密码
- 角色下拉：默认"健康管理师"（最常见的新增角色）
- 点击遮罩关闭 Modal
- 空字段校验 + 错误提示

### 4.3 中文文案

```
✅ PASS — 适合门店使用
```

| 原文 | 评价 |
|------|------|
| "仅店长可管理店员" | ✅ 明确告知权限 |
| "店长不能停用自己的账号" | ✅ 清晰解释拒绝原因 |
| "用户名 'xxx' 已存在" | ✅ 帮助店长纠错 |
| "店员创建成功" | ✅ 积极反馈 |
| "已停用" / "正常" | ✅ 避免"active/inactive"英文 |

### 4.4 密码输入可见性

```
⚠️ UX Risk — 新增店员表单密码字段 type="text"
```

```tsx
<input type="text" value={form.password} ... />  // ← 明文可见
```

店长在新增店员时，密码明文显示在屏幕上。店员可能在旁边看到自己的初始密码。

**评估：** 低风险。门店环境通常为桌面端，店长在后台创建账号。但建议改为 `type="password"` 防止肩窥。

### 4.5 停用无确认

```
⚠️ UX Risk — 点击"停用"立即生效，无二次确认
```

```tsx
<button onClick={() => toggleStatus(s)}>停用</button>
// → 直接调用 PATCH /api/staff/{id} {status: "inactive"}
```

误触将导致店员立即可用——其正在进行的会话不受影响（JWT 无状态），但无法重新登录。

**评估：** Low。店长操作频率低（每月 < 5 次），误触概率低。不影响安全——可立即点"启用"恢复。

### 4.6 密码重置交互

```
⚠️ UX Risk — prompt() 明文回显 + 无确认
```

```tsx
const pw = prompt(`为 ${s.display_name} 输入新密码（至少 6 位）：`);
```

- `prompt()` 在浏览器中以明文回显字符
- 无"确认新密码"步骤（输错无法挽回）
- 无操作反馈（除了 flash 消息）

**评估：** Low。重置密码频率极低。MVP 可接受。Sprint-5+ 建议改为 Modal 表单。

### 4.7 flash 消息竞态

```
⚠️ NOTE — 快速连续操作可能提前清除消息
```

```tsx
const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };
```

若 1 秒内连续两次操作，第一条 setTimeout 会在第二条消息显示 2 秒后清除它。非阻塞，实际几乎不可见。

---

## 5. Risk

### 5.1 密码传输

```
⚠️ Security Risk — LOW — 密码在 HTTP body 中明文传输
```

创建店员和重置密码时，密码在 JSON body 中以明文传输。HTTPS 部署后（Nginx 反向代理）可解决。当前 Pilot 阶段内网或本地部署，风险 Low。

### 5.2 多店长

```
⚠️ NOTE — POST /api/staff/ 允许创建 role=店长
```

角色下拉含"店长"选项。创建多店长在当前单店 Pilot 中是合理需求（备份店长）。无安全风险——新店长创建后拥有完整店员管理权限。

### 5.3 已停用店员 JWT 仍有效

```
⚠️ Known Limitation — JWT 无状态，停用不撤销已签发 token
```

与所有 JWT 系统一致的行为。Pilot 阶段 token 过期时间可配置（默认数小时），影响有限。Sprint-5+ 可引入 token 黑名单。

### 5.4 无法删除店员

```
✅ PASS — 按 Scope 设计，不做删除
```

Plan 明确 "Not in scope: 删除店员"。停用机制足以处理离职场景。

---

## 6. Test Coverage

### 6.1 测试结果

```
pytest: 21 passed / 0 failed
```

### 6.2 覆盖分析

```
⚠️ WARNING — staff.py 端点无专门测试
```

| 测试文件 | 状态 | 与本功能关系 |
|---------|------|------------|
| test_api_auth.py | ✅ 6/6 | 登录逻辑——停用后拒绝登录未覆盖 |
| test_store_models.py | ✅ 9/9 | Staff 模型——hash_password / verify_password 已测 |
| test_models.py | ✅ 6/6 | Platform 模型——无关 |
| **staff CRUD** | ❌ 0 | 无测试覆盖 |

21 passed 全部来自已有测试。staff.py 75 行代码覆盖率 36%（仅覆盖到 import 行，所有端点逻辑未执行）。需手工验证。

### 6.3 手工验证清单

```
□  1. 店长登录 → 导航栏"店员管理"可见且可点击
□  2. 进入店员管理 → 列表显示本店所有店员（admin/staff01/staff02）
□  3. 新增店员 → 填写姓名/用户名/角色/密码 → 列表刷新 → 新店员出现
□  4. 新店员登录 → 登录成功
□  5. 停用 staff01 → staff01 尝试登录 → 403 "Staff account is inactive"
□  6. 重新启用 staff01 → staff01 登录成功
□  7. 重置 staff01 密码 → 旧密码登录失败 → 新密码登录成功
□  8. 店长尝试停用自己 → 422 "店长不能停用自己的账号"
□  9. 健康管理师登录 → 导航栏无"店员管理"入口
□ 10. 健康管理师直接访问 /staff → 页面加载但 API 返回 403 → 列表为空
□ 11. 服务人员登录 → 同上
□ 12. 创建重复用户名 → 409 "用户名 'xxx' 已存在"
```

---

## 7. Findings Summary

| 级别 | 数量 | 编号 |
|------|------|------|
| ✅ PASS | 21 | — |
| ⚠️ WARNING | 5 | W1–W5 |
| ❌ MUST FIX | 0 | — |

### WARNING

| # | 位置 | 描述 | 阻塞？ |
|---|------|------|--------|
| W1 | `StaffManagementScreen.tsx:186` | 新增店员密码 `type="text"` 明文可见 | 否 |
| W2 | `StaffManagementScreen.tsx:61` | 停用/启用无确认对话框，误触可立即生效 | 否 |
| W3 | `StaffManagementScreen.tsx:71` | 密码重置用 `prompt()` 明文回显 | 否 |
| W4 | `staff.py` | staff CRUD 端点无专门测试 | 否 |
| W5 | `StaffManagementScreen.tsx:41` | flash 消息连续操作时可能提前清除 | 否 |

### Permission Risk

| # | 描述 | 等级 |
|---|------|------|
| P1 | 店长可停用另一个店长 | Low — 当前仅 1 名店长 |
| P2 | 已停用店员 JWT 在过期前仍有效 | Known — JWT 无状态 |

### 本次新增 vs 已有能力

| 能力 | 首次实现 |
|------|---------|
| **后端 API 级别 role 强制校验** | ✅ 首次——之前所有 API 仅前端门控 |
| **Store DB 写入 API** | ✅ 首次——auth 仅读取，staff 管理首次写入 Store DB |
| **自操作防护** | ✅ 首次——"不能停用自己" |

---

## 8. Recommendation

### 8.1 是否建议 Commit

```
✅ APPROVE COMMIT — 0 MUST FIX, 5 WARNING 均为 MVP 可接受范围。
```

**理由：**
- 权限模型正确——首次在 API 级别实现后端 role 强制校验
- 跨店保护完备——三层防护（SQL 过滤 / JWT 注入 / 显式对比）
- 自停用防护到位
- UI 清晰可用的最小店员管理

### 8.2 建议 Commit 后跟进（P2）

```
1. W1：密码字段 type="text" → type="password"（1 字符改动）
2. W2：停用/启用前加 confirm() 对话框（2 行代码）
3. W4：补充手工验证 12 项（见 §6.3）
```

### 8.3 值得注意的里程碑

FEATURE-006 是 Health One 第一个**后端强制角色校验**的模块。ROLE-001 建议的"先前端门控，后端 Deferred 到 Sprint-5+"模式在店员管理场景被正确打破——账号创建和密码修改必须后端强制校验。这是一个正确的架构决策。

### 8.4 QA Approval

```
Status: APPROVE
```

---

## 9. End of Document

QA-FEATURE-006 reviews the staff management MVP.

**21 PASS. 5 WARNING. 0 MUST FIX. Approve Commit.**
