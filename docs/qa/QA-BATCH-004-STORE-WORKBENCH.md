# QA-BATCH-004 — Store Workbench UI Review

Document ID : QA-BATCH-004
Title       : Sprint-2 Phase 4 Store Workbench — UI Review
Version     : 1.0
Status      : Complete
Owner       : QA / Architecture Office
Created     : 2026-06-29
Reviewed    : DEV-017, DEV-018, DEV-019
Depends On  : PRD-001, ADR-002, SPRINT-002-PLAN, QA-BATCH-001, QA-BATCH-002, QA-BATCH-003

---

## 1. Executive Summary

| Category | Count |
|----------|-------|
| PASS | 12 |
| WARNING | 4 |
| MUST FIX | 2 |
| UX Issues | 3 |
| Test Gaps | 1 |

**Decision: ✅ APPROVE COMMIT** (with 2 MUST FIX items)

---

## 2. PASS

### 2.1 PRD-001 P0 Scope Compliance

| PRD-001 Feature | Screen | Implemented? | Matches PRD? |
|----------------|--------|-------------|-------------|
| F1: Customer Identity Management | S1 | Search + Create form | ✅ |
| F1: Customer Identity Management | S2 | Activate button | ✅ |
| F2: Health Profile & Concern Intake | S2 | Profile display | ✅ |
| F2: Health Profile & Concern Intake | S3 | Category + description | ✅ |
| F7: Store Staff Authorization | Login | JWT login | ✅ DEV-015 |
| F8: Event Logging & Timeline | S2 | Timeline display | ✅ |
| F9: Store Workbench Screens | S1–S3 | 3 screens | ✅ |

✅ All P0 features assigned to Sprint 2 have frontend coverage.

### 2.2 Only Existing API Called — No New Endpoints

| Screen | API Call | Endpoint | Existing? |
|--------|---------|----------|-----------|
| S1 search | GET | `/api/identities/?q=` | ✅ DEV-010 |
| S1 create | POST | `/api/identities/` | ✅ DEV-010 |
| S2 identity | GET | `/api/identities/{id}` | ✅ DEV-010 |
| S2 profile | GET | `/api/identities/{id}/profile` | ✅ DEV-011 |
| S2 timeline | GET | `/api/identities/{id}/timeline` | ✅ DEV-012 |
| S2 activate | POST | `/api/identities/{id}/activate` | ✅ DEV-010 |
| S3 save | PUT | `/api/identities/{id}/profile` | ✅ DEV-011 |

✅ Zero new backend endpoints. All 7 API calls use existing DEV-010/011/012 endpoints.

### 2.3 All Screens in ProtectedRoute

| Route | Protected? | Evidence |
|-------|-----------|----------|
| `/login` | No (public) | `App.tsx:22` — outside ProtectedRoute |
| `/customers` | Yes | `App.tsx:30` — inside ProtectedRoute |
| `/customers/:id` | Yes | `App.tsx:31` — inside ProtectedRoute |
| `/customers/:id/concern` | Yes | `App.tsx:33` — inside ProtectedRoute |

✅ S1/S2/S3 all require JWT authentication.

### 2.4 JWT via Existing API Client

| Check | Result |
|-------|--------|
| API calls use `api.get/post/put` from `client.ts`? | ✅ |
| `client.ts` injects `Bearer` token from `localStorage`? | ✅ `client.ts:19` |
| Token cleared on 401? | ✅ `client.ts:28-30` |
| Screens import directly from `../api/client` | ✅ |

### 2.5 TypeScript Type Safety

| Check | Result |
|-------|--------|
| `tsc --noEmit` passes | ✅ |
| API responses typed with generics | ✅ `api.get<HealthIdentity[]>()` |
| State variables typed | ✅ `useState<HealthIdentity | null>(null)` |
| Event handlers typed | ✅ `(e: FormEvent)` |

### 2.6 Loading / Error States

| Screen | Loading State | Error State | Empty State |
|--------|-------------|------------|-------------|
| S1 | "Searching..." text | Red error banner | "No customers found" + create CTA |
| S2 | "Loading..." centered | Red error text | "No health profile yet", "No timeline entries yet" |
| S3 | "Saving..." button text | Red error banner | N/A (form) |

✅ All screens handle loading, error, and empty states. Error messages are user-facing (not stack traces).

### 2.7 data-testid Attributes

| Screen | Elements with testid |
|--------|---------------------|
| S1 | `screen-s1`, `search-input`, `create-toggle`, `create-form`, `create-name-input`, `create-phone-input`, `create-submit`, `search-results`, `result-{id}` |
| S2 | `screen-s2`, `activate-btn`, `record-concern-btn` |
| S3 | `screen-s3`, `category-{key}` (7 categories), `self-description`, `staff-notes`, `health-goal`, `birth-year`, `gender`, `save-btn` |

✅ All interactive elements have data-testid for E2E testing.

### 2.8 PlaceholderScreens Deletion Safe

| Check | Result |
|-------|--------|
| `PlaceholderScreens.tsx` deleted? | ✅ `git status` shows `D` |
| Any remaining imports of `PlaceholderScreens`? | ✅ No — `App.tsx` imports from new files |
| Any other file imported from `PlaceholderScreens`? | ✅ No |

### 2.9 Tailwind Configuration

| Check | Result |
|-------|--------|
| Vite plugin configured? | ✅ `vite.config.ts` — `@tailwindcss/vite` |
| CSS imports Tailwind? | ✅ `index.css` — `@import "tailwindcss"` |
| Old CSS removed? | ✅ `App.css` deleted |
| Build succeeds with Tailwind? | ✅ `npm run build` — 94ms |

🔶 `tailwindcss` and `@tailwindcss/vite` are installed in `node_modules` but NOT saved in `package.json` (see MF-001).

---

## 3. WARNING

### W-001: `STATUS_COLORS` Duplicated in S1 and S2

| Attribute | Value |
|-----------|-------|
| **Severity** | Low — DRY violation |
| **Files** | `CustomerSearchScreen.tsx:8-12`, `CustomerSummaryScreen.tsx:12-16` |
| **Finding** | The same `STATUS_COLORS` constant is defined identically in both screens. |
| **Fix** | Extract to `src/components/StatusBadge.tsx` or a shared constants file. |
| **Verdict** | ACCEPTED for Sprint 2. Fix in Sprint 3 when shared components are extracted. |

### W-002: S1 Search Fires API Call on Every Keystroke

| Attribute | Value |
|-----------|-------|
| **Severity** | Medium — performance |
| **File** | `CustomerSearchScreen.tsx:75-77` |
| **Finding** | `onChange={(e) => { setQuery(e.target.value); doSearch(e.target.value); }}` — every keystroke triggers an API call. SPRINT-002-PLAN DEV-017 specified: "Implement search component with debounced API call (300ms)." |
| **Why concerning** | Rapid typing generates many API calls. Each call queries PostgreSQL. In a real store environment with Network latency, this could feel sluggish. |
| **Verdict** | ACCEPTED for commit. Add debounce in a follow-up P1 task (DEV-025 component library). Not blocking — the feature works correctly, just inefficiently. |
| **Tracking** | Create `perf(s1): add 300ms debounce to search input` task. |

### W-003: S3 `healthGoal` Field Collected But Never Sent

| Attribute | Value |
|-----------|-------|
| **Severity** | Medium — data loss |
| **File** | `ConcernIntakeScreen.tsx:24,128-138` |
| **Finding** | `healthGoal` state is captured from user input but NOT included in the `body` object sent to `PUT /api/identities/{id}/profile`. The Profile model has no `health_goal` field (it's part of Health Plan, not Health Profile per RFC-002). The field exists in the UI but the data goes nowhere. |
| **Why concerning** | Staff fills in a health goal, clicks Save, and the goal is silently discarded. This erodes trust in the system. |
| **Fix** | Either: (a) Remove the Health Goal field from S3 (defer to Sprint 3 Health Plan), or (b) Store it in `Profile.lifestyle_notes` or `Profile.primary_concern` as a workaround with a UI note. |
| **Verdict** | **Fix before commit.** Remove the field or store it. Recommendation: include health goal as part of the timeline summary text via `primary_concern` field: `"Goal: {healthGoal} | Concern: {category} — {selfDescription}"`. |

### W-004: S3 Maps `staffNotes` to `lifestyle_notes`

| Attribute | Value |
|-----------|-------|
| **Severity** | Low — semantic mismatch |
| **File** | `ConcernIntakeScreen.tsx:45` |
| **Finding** | `if (staffNotes) body.lifestyle_notes = staffNotes;` — Staff observation notes are stored as lifestyle_notes in the Profile. These are semantically different: lifestyle_notes is for customer's exercise/diet/sleep habits; staff notes are the staff's clinical observations. |
| **Why acceptable** | RFC-002 Health Profile has no dedicated "staff_notes" field. The closest available field is `lifestyle_notes` (Text). For MVP with 4 required fields, this pragmatic mapping is acceptable. |
| **Verdict** | ACCEPTED for MVP. Document the mapping. Sprint 3 Health Assessment entity will have proper staff observation fields. |

---

## 4. MUST FIX

### MF-001: `tailwindcss` and `@tailwindcss/vite` Not in package.json

| Attribute | Value |
|-----------|-------|
| **Severity** | High — build reproducibility |
| **File** | `frontend/package.json` |
| **Finding** | `tailwindcss` and `@tailwindcss/vite` are installed in `node_modules/` (build works) but NOT listed in `package.json` dependencies or devDependencies. A fresh `npm install` would fail because `@tailwindcss/vite` is imported in `vite.config.ts` but the package is unknown to npm. |
| **Why must fix** | This breaks reproducible builds. A new developer running `npm install` would get a Vite error: "Cannot find module '@tailwindcss/vite'". CI would fail. |
| **Fix** | Run: `npm install -D tailwindcss @tailwindcss/vite` (with `--save-dev` flag) in the frontend directory. |

### MF-002: `newPhone` Field Collected But Never Sent

| Attribute | Value |
|-----------|-------|
| **Severity** | Medium — data loss |
| **File** | `CustomerSearchScreen.tsx:22,118-127` |
| **Finding** | The Create Customer form captures a phone number (`newPhone` state + input field) but the `handleCreate` function only sends `display_name` and `primary_store_id`. The phone number is discarded. The code comment says "phone is stored via profile later (S3)" — but S3 has no phone field either. |
| **Why must fix** | Staff enters phone number expecting it to be saved. It's silently lost. This is worse than not having the field — it creates false expectation. |
| **Fix** | Either: (a) Remove the Phone field from the create form (Sprint 2 scope — Profile update in S3 can add it later), or (b) Immediately after creating the identity, call `PUT /profile` to store the phone in `basic_info.phone`. Option (a) is simpler and respects Sprint 2 scope. |
| **Recommendation** | Remove phone field. Re-add in S3 when Profile upsert captures it as `basic_info.phone`. |

---

## 5. UX Issues

### UX-001: S2 "Record Concern" Only Visible When Status = "active"

| Attribute | Value |
|-----------|-------|
| **File** | `CustomerSummaryScreen.tsx:111` |
| **Finding** | `{identity.activation_status === "active" && (<button>Record Concern</button>)}` — the button to record health concern only appears when the identity is active. If status is "pending", the staff must first activate (button visible), then record concern. This adds an unnecessary step. |
| **PRD-001 says** | Concern intake should be available immediately after customer creation (F2). Activation is a separate concern. |
| **Recommendation** | Show "Record Concern" button for both `pending` and `active` statuses. Only `archived` should hide it. |

### UX-002: S3 "healthGoal" Field Has No Effect

| See W-003 — the field is collected but not persisted. |

### UX-003: S2 Activate Button Disappears After Click, But No Confirmation

| Attribute | Value |
|-----------|-------|
| **File** | `CustomerSummaryScreen.tsx:102-109` |
| **Finding** | After clicking "Activate 健康元", the button immediately disappears (status changes to active) and is replaced by "Record Concern". No confirmation dialog, no success feedback. |
| **Recommendation** | Add a brief success indicator (e.g., brief green flash or toast). Low priority for MVP. |

---

## 6. Test Gaps

### TG-001: No Screen-Level Unit Tests

| Attribute | Value |
|-----------|-------|
| **Severity** | Low |
| **Finding** | No Jest/Vitest unit tests for screen components. All testing is manual or via Playwright E2E (not yet updated for new screens). |
| **Why acceptable** | SPRINT-002-PLAN assigns E2E testing to DEV-021 (Phase 5). Screen unit tests are post-MVP. |
| **Verdict** | ACCEPTED. Tracked as DEV-021 (Playwright E2E smoke test update). |

---

## 7. API Call Analysis

| Screen | API Method | Endpoint | Handles Loading? | Handles Error? | Handles Empty? |
|--------|-----------|----------|-----------------|---------------|----------------|
| S1 search | GET | `/api/identities/` | ✅ "Searching..." | ✅ Red banner | ✅ "No customers found" |
| S1 create | POST | `/api/identities/` | ✅ "Creating..." | ✅ Red banner | N/A |
| S2 identity | GET | `/api/identities/{id}` | ✅ Full-page loading | ✅ Red text | N/A |
| S2 profile | GET | `/api/identities/{id}/profile` | ✅ (Promise.all) | ✅ `.catch(() => null)` | ✅ "No health profile yet" |
| S2 timeline | GET | `/api/identities/{id}/timeline` | ✅ (Promise.all) | ✅ `.catch(() => [])` | ✅ "No timeline entries yet" |
| S2 activate | POST | `/api/identities/{id}/activate` | ❌ No loading state | ✅ Red banner | N/A |
| S3 save | PUT | `/api/identities/{id}/profile` | ✅ "Saving..." | ✅ Red banner | N/A |

🔶 S2 activate has no loading indicator. Button text doesn't change during the async operation.

---

## 8. Dependency Check

| Package | In package.json? | Used in code? | Compliant with ADR-002? |
|---------|-----------------|---------------|------------------------|
| react | ✅ | ✅ | ✅ ADR-002 §3.3: React |
| react-dom | ✅ | ✅ | ✅ |
| react-router-dom | ✅ | ✅ | ✅ |
| tailwindcss | ❌ MF-001 | ✅ `index.css` | ✅ CSS framework |
| @tailwindcss/vite | ❌ MF-001 | ✅ `vite.config.ts` | ✅ Vite plugin |
| @playwright/test | ✅ | ✅ | ✅ ADR-002 §3.7 |
| typescript | ✅ | ✅ | ✅ |
| vite | ✅ | ✅ | ✅ |

❌ Tailwind packages missing from package.json.

---

## 9. Compliance Matrix

| Source | Requirement | Status |
|--------|------------|--------|
| PRD-001 §4 F1 | Customer Identity Management | ✅ S1 + S2 |
| PRD-001 §4 F2 | Health Profile & Concern Intake | ✅ S2 + S3 |
| PRD-001 §4 F9 | Store Workbench S1–S3 | ✅ 3 screens |
| PRD-001 §4 F9 AC | 6 屏可完成手动闭环 | ✅ S1–S3 cover Entry segment |
| ADR-002 §3.3 | Web SPA (React) | ✅ React + TypeScript |
| ADR-002 §3.3 | No 微信小程序 | ✅ |
| SPRINT-002-PLAN DEV-017 | Search with debounce | 🔶 No debounce (W-002) |
| SPRINT-002-PLAN DEV-017 | Required fields ≤ 3 | ✅ Name + auto store |
| SPRINT-002-PLAN DEV-019 | Required fields ≤ 4 | ✅ Category + self-description |
| SPRINT-002-PLAN DEV-019 | 3-step flow | ✅ Category → Description → Confirm |

---

## 10. Recommendation

### ✅ APPROVE COMMIT

The three Store Workbench screens correctly implement the PRD-001 P0 scope:
- S1: Search + Create customer
- S2: View health identity summary + profile + timeline
- S3: Record health concern intake

All screens are behind ProtectedRoute, use the existing JWT-injected API client, and call only existing backend endpoints (DEV-010/011/012).

### Pre-Commit Checklist

- [x] All screens in ProtectedRoute
- [x] Only existing API endpoints called
- [x] JWT via existing client.ts
- [x] TypeScript compiles clean
- [x] Loading/error/empty states present
- [x] PlaceholderScreens deleted safely
- [x] data-testid attributes for E2E
- [ ] **MF-001**: Add `tailwindcss` + `@tailwindcss/vite` to `package.json` (`npm install -D --save`)
- [ ] **MF-002**: Remove `newPhone` field from create form OR immediately save to profile
- [ ] W-003: Fix healthGoal field — include in primary_concern or remove
- [ ] UX-001: Show "Record Concern" button for pending status too

### Post-Commit Tracking

| Task | Priority | Sprint |
|------|---------|--------|
| Add 300ms debounce to S1 search | P1 | Sprint 2 (DEV-025) |
| Extract shared STATUS_COLORS constant | P1 | Sprint 3 |
| Update Playwright smoke test for new screens | P0 | Sprint 2 (DEV-021) |
| Add S2 activate loading indicator | P1 | Sprint 2 |

---

## 11. End of Document

QA-BATCH-004 completes the UI review of Sprint-002 Phase 4 Store Workbench (DEV-017 through DEV-019).

**Decision: APPROVE COMMIT.**
