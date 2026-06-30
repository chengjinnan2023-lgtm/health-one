# BUG-PILOT-001C — Service Record Save Click Does Nothing

Document ID : BUG-PILOT-001C
Title       : S4 Service Record — Click Save Produces No API Request
Severity    : P0 (Blocks service loop)
Status      : Fixed
Created     : 2026-06-30
Related     : BUG-PILOT-001B (same root cause, different screen)

---

## 1. Reproduction

**Steps:**
1. Navigate to S4 Service Record (`/customers/:id/service`)
2. Do NOT select a service type
3. Press Enter key while focused in the "服务前备注" or "建议下一步" text field
4. Or: if auth state is missing, button appears enabled but form silently fails

**Expected:** Red error message "请先选择服务类型"

**Actual:** Nothing happens. No API request. No error message.

---

## 2. Root Cause

**File:** `frontend/src/screens/ServiceRecordScreen.tsx`, line 19

```tsx
// BEFORE (broken):
e.preventDefault(); if (!id || !serviceType || !staff) return;
//                      ^^               ^^         ^^^^^
//                      silent return — no user feedback for ANY of the three conditions
```

**Same root cause as BUG-PILOT-001B:** silent early return with zero user feedback. Three conditions can trigger it:

1. `!id` — route param missing (unlikely with normal navigation)
2. `!serviceType` — no chip selected, button IS disabled but Enter key bypasses
3. `!staff` — auth state missing (edge case: button NOT disabled for this condition)

The submit button's `disabled` prop only checked `saving || !serviceType` — it did NOT check `!staff`. If AuthContext hasn't loaded yet, the button appears enabled but the form silently fails.

---

## 3. Fix Applied

**File:** `frontend/src/screens/ServiceRecordScreen.tsx`

### Change 1: Replace silent return (line 19)

```tsx
// Before:
e.preventDefault(); if (!id || !serviceType || !staff) return;

// After:
e.preventDefault();
if (!serviceType) {
    setError("请先选择服务类型");
    return;
}
```

### Change 2: Add button safety for auth state (line 61)

```tsx
// Before:
disabled={saving || !serviceType}

// After:
disabled={saving || !serviceType || !staff}
```

### Change 3: Add field hint (line 44)

```tsx
{error && !serviceType && <p className="text-red-500 text-xs mt-1">请选择服务类型</p>}
```

---

## 4. Validation Result

```
Before:  Press Enter with no service type → nothing happens → Network tab empty
After:   Press Enter → red error "请先选择服务类型" + field hint ✅

npm run build: ✓ built
tsc --noEmit:  ✓
ruff check:    ✓
pytest:        22 passed
```

---

## 5. End of Document

BUG-PILOT-001C fixed. Same silent-return root cause as BUG-PILOT-001B. Form now provides visible validation feedback.
