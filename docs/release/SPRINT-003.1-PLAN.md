# SPRINT-003.1 — v0.3.1 Stabilization Pack

Document ID : SPRINT-003.1-PLAN
Title       : v0.3.1 Stabilization Pack
Version     : 1.0
Status      : Complete
Owner       : Release Office
Created     : 2026-06-30
Depends On  : RELEASE-GATE-002, DEMO-003

---

## 1. Scope

Stabilization only. No new business features. No AI. No payment. No PWA.

## 2. Tasks

### BUG-006 — Timeline Enum Display Fix

| Attribute | Value |
|-----------|-------|
| **Task ID** | BUG-006 |
| **Scope** | Fix `ServiceType.HEALTH_CABIN` showing as enum name instead of `健康舱` |
| **File** | `health_one/platform/routers/session.py` |
| **Fix** | `{session.service_type}` → `{session.service_type.value}` (2 occurrences) |
| **Acceptance** | Timeline entry shows `Service completed: 健康舱 — ...` |
| **Deliverable** | Code change in session.py |
| **Status** | ✅ DONE |

### DEV-039 — S2 Enhanced Summary

| Attribute | Value |
|-----------|-------|
| **Task ID** | DEV-039 |
| **Scope** | Add service history + follow-up status to Customer Summary screen |
| **File** | `frontend/src/screens/CustomerSummaryScreen.tsx` |
| **Acceptance** | S2 shows: last 5 service sessions (type, date, feedback, completed status) + active follow-up plans (method, planned date, status, result) |
| **Deliverable** | Enhanced S2 with 2-column layout, 3 sections |
| **Status** | ✅ DONE |

### DEV-040 — Integration Tests

| Attribute | Value |
|-----------|-------|
| **Task ID** | DEV-040 |
| **Scope** | Pytest integration tests for Service Session + Health Plan APIs |
| **Files** | `tests/test_api_session.py`, `tests/test_api_plan.py` |
| **Test count** | 8 tests (4 session + 4 plan) |
| **Acceptance** | All tests pass with PostgreSQL running. Coverage: create, list, complete, auth-required. |
| **Deliverable** | 2 test files, 8 test cases |
| **Status** | ✅ DONE |

### DEV-041 — E2E Playwright Test

| Attribute | Value |
|-----------|-------|
| **Task ID** | DEV-041 |
| **Scope** | Playwright API-level E2E test for full manual closed loop |
| **File** | `frontend/e2e/manual-loop.spec.ts` |
| **Steps** | Login → Create → Activate → Concern → Service → Complete+Feedback → Follow-Up → Verify Timeline (8 steps) |
| **Acceptance** | All 8 steps pass. Timeline contains ≥5 event types (identity_created, activated, profile_updated, service_completed, plan_updated). |
| **Deliverable** | 1 E2E spec file, 8 test cases |
| **Status** | ✅ DONE |

### DEV-043 — Deployment Preparation

| Attribute | Value |
|-----------|-------|
| **Task ID** | DEV-043 |
| **Scope** | Deployment checklist + database backup/restore checklist |
| **Files** | `docs/release/DEPLOYMENT-CHECKLIST.md`, `docs/release/BACKUP-RESTORE.md` |
| **Acceptance** | Clear, actionable checklists for store server deployment |
| **Deliverable** | 2 deployment documents |
| **Status** | ✅ DONE |

---

## 3. Completion Summary

| Task | Status |
|------|--------|
| BUG-006 | ✅ |
| DEV-039 | ✅ |
| DEV-040 | ✅ |
| DEV-041 | ✅ |
| DEV-043 | ✅ |

**All 5 tasks complete. v0.3.1 stabilization pack ready.**
