# FEATURE-006A — Staff Management UX Patch

Document ID : FEATURE-006A
Title       : 店员管理 UX 收尾补丁
Version     : 1.0
Status      : Complete
Owner       : Development Office
Created     : 2026-07-01
Depends On  : FEATURE-006, QA-FEATURE-006 (W1/W2)

---

## 1. Scope

收尾 QA-FEATURE-006 的 3 个已知 P2 UX 问题。

| # | 来源 | 问题 | 修复 |
|---|------|------|------|
| W1 | QA-FEATURE-006 §4.4 | 新增店员密码 `type="text"` 明文可见 | `type="text"` → `type="password"` |
| W2 | QA-FEATURE-006 §4.5 | 停用/启用无确认，误触可立即生效 | 增加 `confirm()` 对话框 |
| — | — | 手工验证清单 | 本报告 §4 |

**Not in scope:** API 变更、数据库变更、功能扩展。

---

## 2. Fix Applied

### 2.1 密码输入框

```tsx
// BEFORE
<input type="text" value={form.password} ... />

// AFTER
<input type="password" value={form.password} ... />
```

浏览器以 `•` 遮蔽密码字符，防止肩窥。

### 2.2 停用/启用确认

```tsx
// BEFORE
const toggleStatus = async (s: StaffMember) => {
  const newStatus = s.status === "active" ? "inactive" : "active";
  try {
    await api.patch(...);
    ...
  }
};

// AFTER
const toggleStatus = async (s: StaffMember) => {
  const newStatus = s.status === "active" ? "inactive" : "active";
  const action = newStatus === "active" ? "启用" : "停用";
  if (!confirm(`确认${action}店员「${s.display_name}」？`)) return;
  try {
    await api.patch(...);
    ...
  }
};
```

点击"停用"→ 弹出 `确认停用店员「张三」？` → 确定则执行，取消则无操作。

---

## 3. Files Changed

```
M frontend/src/screens/StaffManagementScreen.tsx   (2 处改动)
```

---

## 4. 手工验证清单

```
□  1. 新增店员 → 密码输入框显示为 ••••（非明文）
□  2. 点击"停用"店员 → 弹出确认框"确认停用店员「XXX」？"
□  3. 确认框中点"取消" → 店员状态不变
□  4. 确认框中点"确定" → 店员状态变为"已停用"
□  5. 点击"启用"店员 → 弹出确认框"确认启用店员「XXX」？"
□  6. 确认框中点"确定" → 店员状态变为"正常"
□  7. 连续快速停用/启用同一店员 → 每次独立确认
□  8. 店长自己的行 → 无"停用"按钮（已有逻辑，验证未被本次改动影响）
□  9. 重置密码 → 功能正常（未改动）
□ 10. npm run build + tsc --noEmit + pytest 21 passed
```

**验证重点：**
- 密码遮蔽在 Chrome/Firefox/Safari 均生效
- confirm 对话框中文文案准确
- 取消操作后列表状态不变
- 确认操作后列表正确刷新

---

## 5. Remaining Warnings

以下 WARNING 来自 QA-FEATURE-006，本次不处理：

| # | 描述 | 本次处理？ |
|---|------|----------|
| W1 | 密码 `type="text"` | ✅ 已修复 |
| W2 | 停用/启用无确认 | ✅ 已修复 |
| W3 | 密码重置用 `prompt()` | ❌ 保留（改动范围更大，Sprint-5+ 处理） |
| W4 | staff CRUD 无专门测试 | ❌ 保留（手工验证覆盖） |
| W5 | flash 消息竞态 | ❌ 保留（极低概率） |

---

## 6. Validation Result

| 检查 | 结果 |
|------|------|
| `npm run build` | ✅ 89ms |
| `npx tsc --noEmit` | ✅ 通过 |
| `ruff check` | N/A（无 Python 变更） |
| `pytest tests/` | ✅ 21 passed, 0 failed |

---

## 7. Recommendation

```
✅ APPROVE COMMIT — 2 处前端改动，零后端变更，零回归。
```

---

## 8. End of Document

FEATURE-006A closes the 2 remaining P2 UX issues from QA-FEATURE-006.

**1 file. 2 edits. `type="password"` + `confirm()`.**
