# PILOT-015 — Pilot #2 Usability Patch

Document ID : PILOT-015
Title       : Pilot #2 Minimal Usability Patch
Version     : 1.0
Status      : Complete
Owner       : Release Office
Created     : 2026-06-30
Depends On  : PILOT-014 Usability Plan, PILOT-013 First-Run Review

---

## 1. Scope

5 changes across 4 screens. All frontend-only. Zero backend changes.

| # | Screen | Change | Category |
|---|--------|--------|----------|
| A | S1 | Default recent customer list on load | P1 usability |
| B1 | S4 | Button "保存服务记录" → "保存并继续 →" + hint | P1 flow |
| B2 | S5 | Success page buttons reorder + auto-redirect to S6 | P1 flow |
| B3 | S5 | 1.5s auto-redirect to S6 after success | P1 flow |
| B4 | S6 | Skip "跳过" → "跳过（稍后补录）" + bottom hint | P1 flow |

---

## 2. Changes Applied

### A: S1 Default List (BUG-PILOT-002)

- `useEffect` on mount loads recent 10 customers via `GET /api/identities/?limit=10`
- Clearing search resets to recent list instead of blank
- True empty state: "暂无客户数据" + "新建第一位客户"

### B1: S4 Button + Hint

```
Before: [保存服务记录]  "必填：服务类型 + 内容 ≤ 5 项"
After:  [保存并继续 →]  "必填：服务类型 + 内容 ≤ 5 项 · 保存后自动进入服务反馈"
```

### B2: S5 Success Page Buttons

```
Before:
  [返回客户总览]  ← blue, first button
  [创建随访 →]    ← indigo, second button

After:
  下一步：为这位客户创建随访计划。1.5 秒后自动跳转…
  [下一步：创建随访 →]  ← blue, primary
  稍后创建随访          ← gray text link
```

### B3: S5→S6 Auto-Redirect

```tsx
useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => navigate(`/customers/${id}/follow-up?...`), 1500);
    return () => clearTimeout(timer);
}, [success]);
```

### B4: S6 Skip + Hint

```
Before: [跳过]
After:  [跳过（稍后补录）]
        "创建随访后可在客户总览页查看和标记完成"
```

---

## 3. Root Cause / Why These Changes

| Problem (Pilot #1) | Root Cause | Fix |
|-------------------|-----------|-----|
| S1 shows blank page | No default data load | Load recent 10 on mount |
| S4 save button causes hesitation | "保存" implies draft, not continue | "保存并继续 →" + hint |
| S5→S6 transition missed | Two equal buttons, wrong default | Primary button + auto-redirect |
| S6 skipped entirely | No guidance that it's part of the loop | Auto-redirect makes it the default path |
| Skip feels too casual | "跳过" implies optional | "跳过（稍后补录）" implies deferred, not optional |

---

## 4. Validation Result

```
npm run build: ✓
tsc --noEmit:  ✓
ruff check:    ✓
pytest:        22 passed
```

### Flow After Patch

```
S4 → [保存并继续 →] → S5 → [保存反馈] → ✓ 成功 → 1.5s → S6 → [创建随访]
                                  ↓                      ↓
                             [下一步：创建随访 →]    [跳过（稍后补录）]
                             [稍后创建随访]
```

---

## 5. Recommendation for Pilot #2

✅ Apply these 5 changes before Pilot #2. Expected improvements:

1. S1 immediately useful — staff sees customers without searching
2. S4→S5→S6 flow feels continuous — reduces hesitation
3. S6 completion rate should increase — auto-redirect makes it the default path

---

## 6. End of Document

PILOT-015 usability patch complete. 5 changes, 4 files, 0 backend changes.
