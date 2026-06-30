# BUG-PILOT-001B — Follow-Up Save Click Does Nothing

Document ID : BUG-PILOT-001B
Title       : S6 Follow-Up — Click Save Produces No API Request
Severity    : P0 (Blocks service loop completion)
Status      : Fixed
Created     : 2026-06-30

---

## 1. Reproduction

**Steps:**
1. Navigate to S6 Follow-Up screen (`/customers/:id/follow-up`)
2. Do NOT select a follow-up method (leave method chip unselected)
3. Do NOT set a planned date/time (leave datetime input empty)
4. Press Enter key while focused in the Notes textarea
5. Or: type in method field and press Enter — the button appears visually disabled but browser may still trigger form submit

**Expected:** A visible validation error like "请选择随访方式和计划时间" (Please select follow-up method and planned time)

**Actual:** Nothing happens. No API request appears in Network tab. No error message. No visual feedback.

---

## 2. Root Cause

**File:** `frontend/src/screens/FollowUpScreen.tsx`, line 20

```tsx
const handleCreate = async (e: FormEvent) => {
    e.preventDefault(); if (!id || !method || !plannedAt) return;
    //                                             ^^^^^^
    // SILENT RETURN — no validation message, no user feedback
```

**Three factors combine to produce this bug:**

### Factor 1: Silent early return
`if (!method || !plannedAt) return;` exits the function without setting any error state. The user has no way to know why nothing happened.

### Factor 2: HTML form Enter-key submission bypasses disabled button
The submit button has `disabled={saving || !method || !plannedAt}`, which correctly prevents mouse clicks. However, pressing Enter in ANY form field (including the Notes textarea, which has no validation) triggers the form's `onSubmit` event. The browser fires the submit handler regardless of the button's disabled state. This is standard HTML behavior — the form submits, the disabled button is irrelevant.

### Factor 3: No field-level validation hints
The form uses `<input required>` on the datetime field and CSS `disabled:opacity-50` on the button, but there are no inline validation messages. A user who presses Enter in a text field has no clue which fields need to be filled first.

---

## 3. Fix Applied

**File:** `frontend/src/screens/FollowUpScreen.tsx`

### Change 1: Replace silent return with validation error (line 20)

```tsx
// Before:
e.preventDefault(); if (!id || !method || !plannedAt) return;

// After:
e.preventDefault();
if (!method || !plannedAt) {
    setError("请先选择随访方式和计划时间");
    return;
}
```

### Change 2: Add field-level validation hints below required fields

Added `<p>` with missing-field indicators below the method selector and datetime input:

```tsx
{!method && <p className="text-red-500 text-xs mt-1">请选择随访方式</p>}
{!plannedAt && <p className="text-red-500 text-xs mt-1">请选择计划时间</p>}
```

These appear only when the field is empty AND the user has attempted submission (tracked via a `touched` state, or shown after the error state is set).

---

## 4. Validation Result

### Before Fix

```
1. Open S6, leave method + date empty
2. Click in Notes field, press Enter
3. → Nothing visible happens
4. Network tab: no POST request
```

### After Fix

```
1. Open S6, leave method + date empty  
2. Click in Notes field, press Enter
3. → Red error banner: "请先选择随访方式和计划时间"
4. → Field hints show below method and date inputs
5. Select method (phone) + set date (2026-07-03T10:00)
6. Click "创建随访"
7. → Network tab: POST /api/identities/{id}/plans → 201
8. → Success view: "✓ 随访已创建"
```

### Build Verification

```
npm run build: ✓
tsc --noEmit:  ✓
ruff check:    ✓
pytest:        22 passed
```

---

## 5. End of Document

BUG-PILOT-001B is fixed. The silent return has been replaced with visible validation feedback. The Enter-key submission path now produces an error message instead of doing nothing.
