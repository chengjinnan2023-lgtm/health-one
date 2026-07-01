# FIX-REVIEW-001 — Open S6 Assignment Dropdown for Health Advisor

Document ID : FIX-REVIEW-001
Title       : 开放健康管理师 S6 随访分配下拉
Version     : 1.0
Status      : Complete
Owner       : Development Office
Created     : 2026-07-01
Depends On  : REVIEW-001 (P1-1)

---

## 1. Root Cause

FEATURE-007 实现 S6 分配下拉时，仅店长（`isManager`）fetch 店员列表：

```tsx
// BEFORE
const isManager = staff?.role === "店长";

useEffect(() => {
  Promise.all([
    api.get(`/api/identities/${id}`),
    isManager ? api.get("/api/staff/") : Promise.resolve([]),  // ← 仅店长
  ]).then(...);
}, [id, isManager]);
```

同时，`GET /api/staff/` 端点要求 `_require_manager(staff)`——健康管理师调用返回 403。

两个限制叠加：前端不 fetch + 后端拒绝 → 健康管理师 S6 只能自分配（disabled input 显示自己名字）。

**为什么需要修复：** 健康管理师可能需要把随访分配给另一位健康管理师或店长——例如替同事创建随访、或有特定专长的同事更适合做某类随访。

## 2. Fix Applied

### 2.1 Backend: GET /api/staff/ 对已认证用户开放

```python
# BEFORE
@router.get("/", response_model=list[StaffResponse])
async def list_staff(staff: Staff = Depends(get_current_staff)):
    """List all staff in the current store. 仅店长."""
    _require_manager(staff)  # ← 403 for non-manager

# AFTER
@router.get("/", response_model=list[StaffResponse])
async def list_staff(staff: Staff = Depends(get_current_staff)):
    """List all staff in the current store. 所有已认证角色可查看（用于分配下拉等场景）."""
    # Note: GET is open to all authenticated roles for assignment dropdowns.
    # POST/PATCH/reset-password remain manager-only.
```

**安全评估：** GET 返回 StaffResponse（姓名、用户名、角色、状态）。这些信息已通过 `assigned_staff_name` 在 S2、队列等页面间接暴露给健康管理师。直接访问不增加新风险。POST/PATCH/reset-password 仍受 `_require_manager` 保护。

### 2.2 Frontend: canManageFollowUp 替代 isManager

```tsx
// BEFORE
const isManager = staff?.role === "店长";
// ...
isManager ? api.get("/api/staff/") : Promise.resolve([])

// AFTER
// isManager removed; canManageFollowUp = staff?.role !== "服务人员"
canManageFollowUp ? api.get("/api/staff/") : Promise.resolve([])
```

| 角色 | Before | After |
|------|--------|-------|
| 店长 | ✅ 分配下拉（全店店员） | ✅ 不变 |
| 健康管理师 | ❌ disabled input（自己） | ✅ 分配下拉（全店店员） |
| 服务人员 | N/A（无 S6 表单） | N/A（不变） |

## 3. Files Changed

```
M health_one/platform/routers/staff.py               (-1: 移除 GET 的 _require_manager)
M frontend/src/screens/FollowUpScreen.tsx              (-2: isManager → canManageFollowUp)
```

## 4. Validation Result

| 检查 | 结果 |
|------|------|
| `npm run build` | ✅ |
| `npx tsc --noEmit` | ✅ |
| `pytest tests/` | ✅ 21 passed |

## 5. Recommendation

```
✅ APPROVE COMMIT — 2 files, 3 lines changed. Resolves REVIEW-001 P1-1.
```

---

## 6. End of Document

FIX-REVIEW-001 opens the S6 assignment dropdown for health advisors.

**2 files. Backend: 1 line removed. Frontend: 2 lines changed.**
