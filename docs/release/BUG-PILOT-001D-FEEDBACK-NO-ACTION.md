# BUG-PILOT-001D — Feedback Save Click Does Nothing

Document ID : BUG-PILOT-001D
Title       : S5 Feedback — Click Save Produces No API Request
Severity    : P0 (Blocks service loop)
Status      : Fixed
Created     : 2026-06-30
Related     : BUG-PILOT-001B (S6), BUG-PILOT-001C (S4) — same root cause

---

## 1. Reproduction

**Steps:**
1. Navigate to S5 Feedback page directly (without `?session_id=` query param)
2. Fill in feeling, satisfaction, return willingness
3. Click "保存反馈"

**Expected:** Error message "缺少服务记录信息" or successful save

**Actual:** Nothing happens. No API request. No error.

---

## 2. Root Cause

**File:** `Frontend/src/screens/FeedbackRecordScreen.tsx`, line 16

```tsx
e.preventDefault(); if (!id || !sessionId) return;
```

**Two silent return triggers:**

1. `!sessionId` — `sessionId` defaults to `""` when query param is missing. If S4 fails to pass `?session_id=` or user navigates directly, the form silently does nothing.

2. `!id` — route param missing.

The submit button's `disabled` checks `!feeling || !satisfaction || !returnWillingness` but does NOT check `!sessionId`. So the button appears enabled but form silently fails.

Additionally, unlike S4/S6, S5 had NO validation for the three required fields (`feeling`, `satisfaction`, `returnWillingness`) in the submit handler — only in the button disabled state. If the button's disabled state is bypassed (Enter key), the form would submit with empty required fields.

---

## 3. Fix Applied

**File:** `frontend/src/screens/FeedbackRecordScreen.tsx`

### Change 1: Replace silent returns (line 16)

```tsx
// Before:
e.preventDefault(); if (!id || !sessionId) return;

// After:
e.preventDefault();
if (!sessionId) {
    setError("缺少服务记录信息，请从服务记录页面进入");
    return;
}
if (!feeling || !satisfaction || !returnWillingness) {
    setError("请填写必填项：感受、满意度、回访意愿");
    return;
}
```

### Change 2: Field hints

Added red hints below each required field when validation fails:
- `{error && !feeling && <p>请填写客户即时感受</p>}`
- `{error && !satisfaction && <p>请选择满意度</p>}`
- `{error && !returnWillingness && <p>请选择回访意愿</p>}`

---

## 4. Validation Result

```
Before: Direct URL access → fill fields → click Save → nothing
After:  Direct URL access → fill fields → click Save → "缺少服务记录信息，请从服务记录页面进入"

Before: No fields filled → click Save → nothing  
After:  No fields filled → click Save → "请填写必填项：感受、满意度、回访意愿" + field hints

npm run build: ✓
tsc --noEmit:  ✓
ruff check:    ✓
pytest:        22 passed
```

---

## 5. End of Document

BUG-PILOT-001D fixed.
