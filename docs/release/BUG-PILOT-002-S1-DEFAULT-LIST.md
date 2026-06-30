# BUG-PILOT-002 — S1 Default Customer List

Document ID : BUG-PILOT-002
Title       : S1 — Show Recent Customers on Initial Load
Severity    : P1 (Usability — empty page confuses staff)
Status      : Fixed
Created     : 2026-06-30

---

## 1. Current Behavior (Before Fix)

1. Staff opens S1 Customer Search page
2. Page shows: search bar + "+ 新建客户" button — **nothing else**
3. Staff thinks: "系统没数据？页面没加载完？"
4. Staff types in search box → customers appear
5. Staff clears search box → **page goes empty again**

## 2. Root Cause

**File:** `CustomerSearchScreen.tsx`, line 32

```tsx
const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    //               ^^^^^^^^^^^^^^^^
    //               When query is empty, clear results and return.
    //               Page shows nothing — no default list.
```

**Three factors:**
1. `doSearch` clears results when query is empty
2. No initial data fetch on mount — results start as `[]`
3. Empty state only shows when `query` is truthy — so empty query = blank page

## 3. Fix Applied

### Change 1: Load recent customers on mount

```tsx
useEffect(() => {
    (async () => {
        const data = await api.get<HealthIdentity[]>("/api/identities/?limit=10");
        setResults(data);
    })();
}, []);
```

### Change 2: Reset to recent list when query cleared

```tsx
if (!q.trim()) {
    // Reset to recent list, not empty
    const data = await api.get<HealthIdentity[]>("/api/identities/?limit=10");
    setResults(data);
    return;
}
```

### Change 3: Empty state for zero customers

When there truly are no customers in the database, show "暂无客户数据" with "新建第一位客户" CTA.

---

## 4. Validation Result

```
Before: Open S1 → blank page → staff confused
After:  Open S1 → recent 10 customers visible → staff can click or search

npm run build: ✓
tsc --noEmit:  ✓
ruff check:    ✓
pytest:        22 passed
```

---

## 5. Recommendation for Pilot #2

✅ This fix directly addresses Pilot #1 observation that staff had to search before seeing anything. Combined with PILOT-014 usability changes, S1 becomes immediately useful on first visit.

---

## 6. End of Document

BUG-PILOT-002 fixed. S1 now shows default customer list on load.
