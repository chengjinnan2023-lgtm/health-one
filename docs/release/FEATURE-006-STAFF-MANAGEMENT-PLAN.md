# FEATURE-006 — Staff Management MVP Plan

Document ID : FEATURE-006
Title       : 店员管理 MVP 执行计划
Version     : 1.0
Status      : Plan
Owner       : Development Office
Created     : 2026-06-30
Depends On  : MANAGER-001 (Manager Workflow Review), ROLE-001 (Store Roles)

---

## 1. Scope

实现店长可用的最小店员管理能力。

**In scope:**
- 查看本店店员列表（姓名 / 用户名 / 角色 / 状态）
- 新增店员（姓名、用户名、角色、初始密码）
- 启用 / 停用店员（切换 active ↔ inactive）
- 重置店员密码
- 店长首页"店员管理"入口激活

**Not in scope:**
- 编辑店员信息（除状态和密码外）
- 删除店员
- 复杂 RBAC / 权限配置
- 店员绩效统计
- 审计日志
- 总部跨店管理

---

## 2. Data Source

### 2.1 现有 Staff 表（Store DB — SQLite）

| 字段 | 类型 | 说明 |
|------|------|------|
| staff_id | String(36) PK | UUID |
| store_id | String(36) FK | 归属门店 |
| display_name | String(200) | 姓名 |
| username | String(100) UNIQUE | 登录用户名 |
| password_hash | String(200) | bcrypt 哈希 |
| role | Enum(店长/健康管理师/服务人员) | 角色 |
| status | Enum(active/inactive) | 账号状态 |
| created_at | DateTime | 创建时间 |
| updated_at | DateTime | 更新时间 |

**零 migration — Staff 表已存在，字段齐全。**

### 2.2 现有 Schema（`store/schemas/staff.py`）

- `StaffCreate` — 含 store_id / display_name / username / password / role
- `StaffResponse` — 不含 password_hash 的安全响应
- 可复用，无需新增 schema 文件

---

## 3. API Design

### 3.1 新 Router：`health_one/platform/routers/staff.py`

| Method | Path | 说明 | 店长专属 |
|--------|------|------|---------|
| `GET` | `/api/staff/` | 列出本店所有店员 | ✅ |
| `POST` | `/api/staff/` | 新增店员 | ✅ |
| `PATCH` | `/api/staff/{staff_id}` | 更新店员状态 | ✅ |
| `POST` | `/api/staff/{staff_id}/reset-password` | 重置密码 | ✅ |

### 3.2 端点详情

**`GET /api/staff/`**
```
→ 从 JWT 提取 store_id
→ SELECT * FROM staff WHERE store_id = :store_id ORDER BY created_at
→ 返回 StaffResponse[]
```

**`POST /api/staff/`**
```json
Request: {
  "display_name": "王五",
  "username": "staff03",
  "role": "健康管理师",
  "password": "pilot123"
}
```
```
→ store_id 从 JWT 自动注入（不接受请求中的 store_id）
→ bcrypt 哈希密码
→ 插入 staff 表
→ 返回 StaffResponse
```

**`PATCH /api/staff/{staff_id}`**
```json
Request: { "status": "inactive" }
```
```
→ 仅允许更新 status 字段
→ 验证 staff 属于同一 store
→ 不允许店长停用自己
```

**`POST /api/staff/{staff_id}/reset-password`**
```json
Request: { "password": "newpassword123" }
```
```
→ 验证 staff 属于同一 store
→ bcrypt 哈希新密码
→ 更新 password_hash
```

### 3.3 后端角色检查

```python
if staff.role.value != "店长":
    raise HTTPException(status_code=403, detail="仅店长可管理店员")
```

**理由：** 店员管理涉及账号创建和密码修改，必须后端强制校验（非前端门控）。这与 ROLE-001 的"按钮隐藏"不同——后者是 UI 便利，前者是安全底线。

### 3.4 注册 Router

```python
# main.py
from health_one.platform.routers import staff
app.include_router(staff.router)
```

---

## 4. Frontend Changes

### 4.1 新增 `StaffManagementScreen.tsx`

```
┌──────────────────────────────────────────────┐
│ 店员管理                                      │
│                                              │
│ [+ 新增店员]                                  │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ 姓名    │ 用户名   │ 角色       │ 状态   │…│ │
│ ├──────────────────────────────────────────┤ │
│ │ 张三    │ admin   │ 店长       │ 正常   │—│ │
│ │ 李四    │ staff01 │ 健康管理师  │ 正常   │停│ │
│ │ 服务人员 │ staff02 │ 服务人员   │ 已停用  │启│ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ 每行操作：[停用/启用] [重置密码]              │
│ 店长自己：[—] [重置密码]                      │
└──────────────────────────────────────────────┘
```

**新增店员 Modal：**
```
┌──────────────────────────┐
│ 新增店员                  │
│                          │
│ 姓名：[________]         │
│ 用户名：[________]       │
│ 角色：[健康管理师 ▾]     │
│ 密码：[________]         │
│                          │
│ [取消] [确认添加]         │
└──────────────────────────┘
```

### 4.2 入口激活

`BaseLayout.tsx:17` — 将 `<span>` 占位替换为 `<Link to="/staff">`

```tsx
// BEFORE
{isManager && <span className="text-gray-300 cursor-not-allowed" title="Sprint-5 上线">店员管理</span>}

// AFTER
{isManager && <Link to="/staff" className="text-gray-600 hover:text-blue-600">店员管理</Link>}
```

### 4.3 Route

```tsx
// App.tsx
<Route path="/staff" element={<StaffManagementScreen />} />
```

---

## 5. Files Changed

```
A health_one/platform/routers/staff.py              (+~90 行：4 个端点)
M health_one/platform/main.py                        (+2 行：import + include_router)
A frontend/src/screens/StaffManagementScreen.tsx      (+~180 行：列表 + Modal)
M frontend/src/App.tsx                                (+2 行：import + route)
M frontend/src/layouts/BaseLayout.tsx                 (+1 行：激活"店员管理"链接)
```

---

## 6. No Changes

```
- 数据库结构（零 migration — Staff 表已存在）
- 现有 API（纯新增 router，不修改任何现有 endpoint）
- Staff 模型 / Schema
- RFC / ADR / PRD
- 健康管理师首页
- RBAC 引擎（不做）
```

---

## 7. Risk

| 风险 | 等级 | 缓解 |
|------|------|------|
| 店长误停用自己 | Low | PATCH 端点拒绝 staff_id == current staff_id |
| 用户名重复 | Low | SQLite UNIQUE 约束 → 返回 409 |
| 密码明文传输 | Low | HTTPS + bcrypt 存储。MVP 阶段可接受 |
| 跨店越权 | Low | store_id 从 JWT 提取，PATCH 验证同一 store |
| 非店长直接调用 API | Low | 后端 role == "店长" 校验 |
| Store DB 并发 | Very Low | 单店 < 10 店员，SQLite 并发可接受 |

---

## 8. End of Document

FEATURE-006 defines the minimal staff management MVP.

**4 new endpoints. 1 new screen. 1 button activation. 0 migrations.**
