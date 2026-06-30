# SPRINT-003 Development Plan — Manual Service Loop

Document ID : SPRINT-003-PLAN
Title       : Sprint-3 Manual Service Loop — Development Plan
Version     : 1.0
Status      : Proposed
Owner       : Architecture Office
Created     : 2026-06-30
Depends On  : VERSION.md v0.2.0, PRD-001, SPRINT-002-PLAN, DEMO-002, RELEASE-GATE-001
Sprint      : Sprint 3 (Manual Loop)
Milestone   : M3
Predecessor : Sprint-2 (v0.2.0 Development Complete)

---

## 1. Sprint Goal

> **Complete the first manual service closed loop — from customer entry through service recording, feedback capture, to follow-up task creation. A Store Staff member can complete the entire Health One value loop without AI assistance.**

At the end of Sprint 3, a Store Staff member shall be able to:

1. Log in (Sprint-2) → Search/Create customer (Sprint-2) → Activate 健康元 (Sprint-2)
2. Record health concern (Sprint-2)
3. **Create a service record** for the customer (NEW)
4. **Capture customer feedback** after service (NEW)
5. **Create a follow-up task** with method, time, and responsible person (NEW)
6. **View the complete customer state** — identity + profile + timeline + services + follow-ups (ENHANCED)
7. **Complete the full manual closed loop** without AI

---

## 2. P0 Scope

### 2.1 Features (from PRD-001 §4)

| Feature | ID | Priority | Owner | Source |
|---------|-----|---------|-------|--------|
| Service Session Recording | F3 | P0 | Shared | PRD-001 §4 |
| Customer Feedback Capture | F4 | P0 | Shared | PRD-001 §4 |
| Follow-Up Task Management | F5 | P0 | Shared | PRD-001 §4 |
| Store Workbench Screens S4–S6 | F9 (partial) | P0 | Store | PRD-001 §4 |
| Auth Middleware Wiring | — | P0 | Platform | RELEASE-GATE-001 (carried forward) |
| Sprint-2 Issue Resolution | — | P1 | Platform/Store | QA-BATCH-004 (carried forward) |

### 2.2 Screens Delivered

| # | Screen | Feature | Source |
|---|--------|---------|--------|
| S4 | Service Record | F3 | PRODUCT-003 §9 |
| S5 | Feedback Record | F4 | PRODUCT-003 §10 |
| S6 | Follow-Up Task | F5 | PRODUCT-003 §11 |
| S2* | Customer Summary (enhanced) | F3/F4/F5 | Adds service history + follow-up status |

### 2.3 APIs Delivered

| API | Endpoint Family | Owner | New? |
|-----|----------------|-------|------|
| Service Session API | `/api/identities/{id}/sessions/*` | Platform | NEW |
| Health Plan API | `/api/identities/{id}/plans/*` | Platform | NEW |
| Enhanced Customer Summary | `/api/identities/{id}/summary` | Platform | NEW (aggregated view) |

### 2.4 Entities Added (from RFC-002)

| Entity | RFC-002 | Module | Storage | Table |
|--------|---------|--------|---------|-------|
| Service Session | §3.5 | Shared | Platform DB | `service_session` |
| Health Plan | §3.4 | Shared | Platform DB | `health_plan` |

---

## 3. User Journey — Manual Closed Loop

```
Staff Login (Sprint-2)
  │
  ▼
Customer Search / Create (S1, Sprint-2)
  │
  ▼
Activate 健康元 (S2, Sprint-2)
  │
  ▼
Record Health Concern (S3, Sprint-2)
  │
  ▼
┌─────────────────────────────────────────────┐
│  DELIVER STORE SERVICE                       │
│  Record: service type, time, staff, device   │
│  Note: pre-service observation               │
│  API: POST /sessions                         │
│  Screen: S4                                  │
└─────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────┐
│  CAPTURE CUSTOMER FEEDBACK                   │
│  Record: feeling, satisfaction, questions    │
│  Note: willingness to return                 │
│  API: PATCH /sessions/{id} (feedback fields) │
│  Screen: S5                                  │
└─────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────┐
│  CREATE FOLLOW-UP TASK                       │
│  Set: method, planned time, responsible staff│
│  Record: follow-up result when completed     │
│  API: POST/PATCH /plans                      │
│  Screen: S6                                  │
└─────────────────────────────────────────────┘
  │
  ▼
Customer Summary (S2 enhanced)
  Shows: Profile + Timeline + Services + Follow-ups
```

---

## 4. Development Tasks

### 4.1 Phase 1: Day 1 — Auth & Cleanup

#### DEV-030 — Wire Auth Middleware to All Routes

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Depends On** | DEV-016 (auth middleware) |
| **Estimated** | S |
| **Owner** | Platform |
| **Tags** | `auth` `middleware` `security` |

**Description:**
Apply `get_current_staff` dependency to all identity, profile, and timeline routes. Currently these routes are unprotected — they accept requests without JWT tokens. The middleware exists (DEV-016) but was not wired to routes in Sprint 2.

**Tasks:**
- Add `staff: Staff = Depends(get_current_staff)` to all identity router endpoints
- Add to all profile router endpoints
- Add to all timeline router endpoints
- Auth endpoints (`/api/auth/login`) remain public
- Health endpoints (`/health`, `/health/db`) remain public
- Update existing API tests to include `Authorization: Bearer` header
- Update E2E tests

**Acceptance Criteria:**
- All `/api/identities/*` endpoints return 401 without valid JWT
- All `/api/identities/*/profile` endpoints return 401 without valid JWT
- All `/api/identities/*/timeline` endpoints return 401 without valid JWT
- `/api/auth/login` remains public
- All existing tests pass with auth headers

---

#### DEV-031 — Resolve Sprint-2 Carried-Forward Issues

| Attribute | Value |
|-----------|-------|
| **Priority** | P1 |
| **Depends On** | DEV-017, DEV-019 |
| **Estimated** | M |
| **Owner** | Store |
| **Tags** | `fix` `frontend` |

**Description:**
Fix four issues identified in QA-BATCH-004 that were deferred to Sprint 3.

**Tasks:**
1. **S1 search debounce (300ms)** — Replace onChange-triggered search with debounced API call in `CustomerSearchScreen.tsx`
2. **S3 healthGoal → include in primary_concern** — Include the health goal text in the profile save payload so it's not silently discarded
3. **S2 "Record Concern" for pending status** — Show the button for both `pending` and `active` statuses, not just `active`
4. **Phone field in S3 profile** — Add a phone input field to the Concern Intake form, stored in `basic_info.phone`

**Acceptance Criteria:**
- S1: Typing "Ali" fires one API call after 300ms pause, not 3 calls for each keystroke
- S3: Health goal text appears in Timeline entry after save
- S2: "Record Concern" button visible immediately after customer creation (pending status)
- S3: Phone number entered is persisted in Profile and visible on S2

---

### 4.2 Phase 2: Service Session (F3)

#### DEV-032 — Service Session Model & Migration

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Depends On** | DEV-006 (Identity model) |
| **Estimated** | M |
| **Owner** | Platform |
| **Tags** | `model` `database` `migration` |

**Description:**
Implement Service Session SQLAlchemy model per RFC-002 §3.5, Pydantic schemas, and Alembic migration.

**Model Fields (RFC-002 §3.5):**
- `session_id` : UUID PK
- `identity_id` : UUID FK → Health Identity
- `store_id` : UUID (app-level FK → Store)
- `staff_id` : UUID (app-level FK → Staff)
- `service_type` : String (健康舱 / 咨询 / 检测 / 其他)
- `pre_service_notes` : Text
- `service_detail` : Text
- `post_service_notes` : Text
- `customer_feedback` : Text (F4 feedback field)
- `next_step_suggestion` : Text
- `started_at` : DateTime
- `completed_at` : DateTime (nullable)
- `recorded_by` : UUID (app-level FK → Staff)
- `created_at` / `updated_at` : DateTime

**MVP simplifications:**
- `plan_id` (FK → Health Plan): deferred — added when Health Plan is created
- `device_ids` : deferred — Sprint 3+ (Devices not implemented)
- `entitlement_id` : deferred — Sprint 3+ (Member Entitlement not implemented)

**Tasks:**
- Define SQLAlchemy model with UUID PK + TimestampMixin
- Write Pydantic schemas: `SessionCreate`, `SessionUpdate`, `SessionResponse`
- Write Alembic migration (002_create_service_session)
- Add `service_type` enum to model
- Add FK constraint to health_identity.identity_id
- Auto-append Timeline entry on service completion
- Write model unit tests

**Acceptance Criteria:**
- Migration creates `service_session` table
- Model validates required fields
- Timeline entry auto-appended when `completed_at` is set

---

#### DEV-033 — Service Session API Endpoints

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Depends On** | DEV-032 |
| **Estimated** | M |
| **Owner** | Platform |
| **Tags** | `api` `fastapi` |

**Description:**
REST API for creating, reading, and updating Service Sessions.

**Endpoints:**
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/identities/{id}/sessions` | Create service session (started) |
| GET | `/api/identities/{id}/sessions` | List sessions for identity |
| GET | `/api/identities/{id}/sessions/{session_id}` | Get session detail |
| PATCH | `/api/identities/{id}/sessions/{session_id}` | Update session (add feedback, complete) |
| POST | `/api/identities/{id}/sessions/{session_id}/complete` | Mark session as completed |

**Tasks:**
- Implement CRUD with auth (DEV-030)
- Complete endpoint: set `completed_at`, auto-append Timeline, trigger Follow-Up check
- List endpoint: pagination, sort by started_at desc
- Write API integration tests

**Acceptance Criteria:**
- POST /sessions → 201 with session data
- GET /sessions → paginated list
- POST /sessions/{id}/complete → sets completed_at + Timeline entry
- All endpoints require auth

---

#### DEV-034 — Screen S4: Service Record

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Depends On** | DEV-033, DEV-030 |
| **Estimated** | L |
| **Owner** | Store |
| **Tags** | `frontend` `screen` |

**Description:**
Build the Service Record screen (PRODUCT-003 §9). Staff records the real store service delivered to the customer.

**UI Requirements:**
- Customer name displayed at top (from S2 context)
- Service type selector (健康舱 / 咨询 / 检测 / 其他)
- Staff name pre-filled (from JWT)
- Service time: started_at (auto) + completed_at (manual or auto)
- Pre-service notes textarea
- Service detail textarea (what was done)
- Post-service observation textarea
- Customer immediate response textarea
- Next step suggestion input
- Save button → creates session + navigates to S5 (Feedback)

**Technical Tasks:**
- Implement form with required field validation (≤ 5 required fields per PRD-001)
- Service type selector as chips (same pattern as S3 categories)
- Auto-fill staff_id from `useAuth().staff`
- API integration with DEV-033 endpoints
- Loading/error/empty states
- `data-testid` attributes for E2E

**Acceptance Criteria:**
- Service record can be completed within 2 minutes
- Required fields ≤ 5 (service_type, service_detail, recorded_by)
- On save, navigates to S5 (Feedback)
- Timeline entry auto-generated by backend on completion

---

### 4.3 Phase 3: Feedback (F4)

#### DEV-035 — Screen S5: Feedback Record

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Depends On** | DEV-033, DEV-034 |
| **Estimated** | M |
| **Owner** | Store |
| **Tags** | `frontend` `screen` |

**Description:**
Build the Feedback Record screen (PRODUCT-003 §10). Staff captures customer feedback after service delivery.

**UI Requirements:**
- Linked to the service session just created
- Quick feedback fields:
  - Immediate feeling (text)
  - Comfort change (select: improved / same / worse)
  - Satisfaction (select: satisfied / neutral / dissatisfied)
  - Customer questions or concerns (text)
  - Willingness to return (yes / maybe / no)
  - Preferred follow-up method (phone / WeChat / SMS / in-store)
- Save button → PATCH session with feedback + navigates to S6 (Follow-Up)

**Technical Tasks:**
- Implement form on top of the service session (PATCH /sessions/{id})
- Feedback stored in ServiceSession.customer_feedback field (JSON-structured text for MVP)
- Select fields for structured data, textarea for open-ended
- Minimal required fields (≤ 3 per PRD-001)
- Navigate to S6 on save

**Acceptance Criteria:**
- Feedback recorded within 1 minute
- Required fields ≤ 3 (feeling, satisfaction, return willingness)
- Auto-navigate to S6 (Follow-Up) on save

---

### 4.4 Phase 4: Follow-Up / Health Plan (F5)

#### DEV-036 — Health Plan Model & Migration

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Depends On** | DEV-006 (Identity model) |
| **Estimated** | M |
| **Owner** | Platform |
| **Tags** | `model` `database` `migration` |

**Description:**
Implement Health Plan SQLAlchemy model per RFC-002 §3.4, focused on follow_up_schedule for Sprint 3.

**Model Fields (RFC-002 §3.4, MVP subset):**
- `plan_id` : UUID PK
- `identity_id` : UUID FK → Health Identity
- `plan_status` : Enum (draft / active / completed / archived)
- `goals` : JSONB (Health Goal value objects, RFC-002 §4.2)
- `follow_up_schedule` : JSONB (frequency, method, time, assigned staff)
- `created_by` : String (staff_id)
- `created_at` / `updated_at` : DateTime

**MVP simplifications:**
- `source_assessment_ids` : empty array — Assessments Sprint 4
- `recommended_services` : empty array — deferred

**Tasks:**
- Define SQLAlchemy model
- Write Pydantic schemas: `PlanCreate`, `PlanUpdate`, `PlanResponse`
- Write Alembic migration (003_create_health_plan)
- Health Goal value object schema
- Write model unit tests

**Acceptance Criteria:**
- Migration creates `health_plan` table
- `follow_up_schedule` JSONB stores method, time, staff, status
- `goals` JSONB stores goal descriptions + progress

---

#### DEV-037 — Health Plan / Follow-Up API Endpoints

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Depends On** | DEV-036 |
| **Estimated** | M |
| **Owner** | Platform |
| **Tags** | `api` `fastapi` |

**Description:**
REST API for Health Plan, focused on follow-up task CRUD for Sprint 3.

**Endpoints:**
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/identities/{id}/plans` | Create health plan (with follow-up) |
| GET | `/api/identities/{id}/plans` | List plans for identity |
| GET | `/api/identities/{id}/plans/{plan_id}` | Get plan detail |
| PATCH | `/api/identities/{id}/plans/{plan_id}` | Update plan (follow-up status, result) |

**Tasks:**
- Create plan: default status = active, populate follow_up_schedule
- Update plan: mark follow-up as completed, record result
- List plans: filter by status (active first)
- Auto-append Timeline on plan status change
- Write API integration tests

**Acceptance Criteria:**
- POST /plans → 201 with follow-up schedule
- PATCH /plans/{id} → updates follow-up status (pending → completed)
- Timeline auto-appended on status change
- All endpoints require auth

---

#### DEV-038 — Screen S6: Follow-Up Task

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Depends On** | DEV-037, DEV-035 |
| **Estimated** | L |
| **Owner** | Store |
| **Tags** | `frontend` `screen` |

**Description:**
Build the Follow-Up Task screen (PRODUCT-003 §11). Staff creates a follow-up plan after service + feedback.

**UI Requirements:**
- Linked to the customer (identity_id from S2)
- Follow-up form:
  - Reason (service follow-up / health check / concern review)
  - Method selector (电话 / 微信 / 短信 / 到店)
  - Planned date/time
  - Assigned staff (pre-filled or selectable)
  - Notes / script
- Save → creates Health Plan with follow_up_schedule
- Post-creation: show "Follow-up created" confirmation
- When follow-up is executed: mark as completed, record result

**Technical Tasks:**
- Create form with POST /plans on save
- Follow-up method selector (same chip pattern as S3)
- Date picker or simple text input for planned time
- Staff assignment dropdown (fetch staff list from store)
- Status display: pending → in_progress → completed
- Navigate back to S2 (Customer Summary) on save

**Acceptance Criteria:**
- Follow-up task created with method + time + responsible person
- Staff can mark follow-up as completed with result notes
- S2 (Customer Summary) shows pending follow-ups

---

### 4.5 Phase 5: Enhanced Customer Summary (S2)

#### DEV-039 — S2 Enhanced: Service History + Follow-Up Status

| Attribute | Value |
|-----------|-------|
| **Priority** | P1 |
| **Depends On** | DEV-033, DEV-037 |
| **Estimated** | M |
| **Owner** | Store |
| **Tags** | `frontend` `screen` `enhancement` |

**Description:**
Enhance the S2 Customer Summary screen to display service history and follow-up status alongside the existing Profile and Timeline sections.

**UI Additions:**
- Service History section: last 5 service sessions with type, date, feedback summary
- Follow-Up section: active follow-up tasks with status, method, planned date
- Quick action: "New Service" button → navigate to S4
- Quick action: "View All Services" → expandable list

**Acceptance Criteria:**
- S2 shows service history (last 5) with feedback summaries
- S2 shows active follow-ups with status badges
- "New Service" button navigates to S4

---

### 4.6 Phase 6: Integration & Testing

#### DEV-040 — Sprint-3 Integration Tests

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Depends On** | DEV-033, DEV-037 |
| **Estimated** | M |
| **Owner** | Platform |
| **Tags** | `testing` `integration` |

**Description:**
Write comprehensive integration tests for Service Session and Health Plan APIs.

**Test Scenarios:**
1. Service Session: Create → Read → Update → Complete → Verify Timeline
2. Health Plan: Create with follow-up → Update status → Verify Timeline
3. Full flow: Session complete → Plan created → Plan completed → Timeline consistency
4. Error cases: missing required fields, invalid status transitions
5. Auth: all endpoints require valid JWT

**Acceptance Criteria:**
- All integration tests pass in CI (PostgreSQL)
- Coverage ≥ 80% on new route handlers

---

#### DEV-041 — E2E Playwright: Full Manual Loop

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Depends On** | DEV-034, DEV-035, DEV-038 |
| **Estimated** | L |
| **Owner** | Store |
| **Tags** | `testing` `e2e` `playwright` |

**Description:**
Write Playwright E2E test for the complete manual closed loop: Login → S1 → S2 → S3 → S4 → S5 → S6 → S2 (enhanced).

**Test Scenario:**
1. Login as admin
2. Search for "Demo Customer" (or create new)
3. View S2 → Activate (if pending) → Navigate to S3
4. S3: Fill concern → Save → Back to S2
5. S2 → "New Service" → S4: Fill service record → Complete
6. S4 → S5: Fill feedback → Save
7. S5 → S6: Create follow-up → Save
8. S2: Verify service history and follow-up status visible

**Acceptance Criteria:**
- Single Playwright test completes the full loop
- All 6 screens render correctly
- No JavaScript errors in console

---

#### DEV-042 — Sprint-3 Integration Verification

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Depends On** | DEV-040, DEV-041 |
| **Estimated** | S |
| **Owner** | Platform |
| **Tags** | `testing` `verification` |

**Description:**
Manual end-to-end verification of the complete manual closed loop. Structured as a checklist identical to DEMO-002.

**Acceptance Criteria:**
- Full manual loop completed without errors
- All Timeline entries present and in correct order
- Demo recording or live demo for Founder review

---

## 5. Task Dependency Graph

```
Phase 1: Auth & Cleanup
────────────────────────────────────────────────────────────
DEV-030 (Auth Wiring) [parallel]
DEV-031 (Sprint-2 Fixes) [parallel]

Phase 2: Service Session (F3)
────────────────────────────────────────────────────────────
DEV-032 (Session Model) → DEV-033 (Session API) → DEV-034 (S4 Screen)

Phase 3: Feedback (F4)
────────────────────────────────────────────────────────────
DEV-033 → DEV-035 (S5 Screen)

Phase 4: Follow-Up / Health Plan (F5)
────────────────────────────────────────────────────────────
DEV-036 (Plan Model) → DEV-037 (Plan API) → DEV-038 (S6 Screen)
DEV-035 → DEV-038

Phase 5: Enhanced Summary
────────────────────────────────────────────────────────────
DEV-033 + DEV-037 → DEV-039 (S2 Enhanced)

Phase 6: Integration & Testing
────────────────────────────────────────────────────────────
DEV-033 + DEV-037 → DEV-040 (Integration Tests)
DEV-034 + DEV-035 + DEV-038 → DEV-041 (E2E Tests)
DEV-040 + DEV-041 → DEV-042 (Verification)
```

---

## 6. Deliverables

| # | Deliverable | Format | Owner |
|---|------------|--------|-------|
| 1 | Service Session API | Python/FastAPI | Platform |
| 2 | Health Plan API | Python/FastAPI | Platform |
| 3 | Screen S4: Service Record | React/TS | Store |
| 4 | Screen S5: Feedback Record | React/TS | Store |
| 5 | Screen S6: Follow-Up Task | React/TS | Store |
| 6 | S2 Enhanced: Service + Follow-Up | React/TS | Store |
| 7 | Integration tests | pytest | Platform |
| 8 | E2E tests | Playwright | Store |
| 9 | Database migrations (2 new tables) | Alembic | Platform |

---

## 7. QA Tasks

| Batch | Scope | Owner |
|-------|-------|-------|
| QA-BATCH-005 | DEV-030–031: Auth wiring + Sprint-2 fixes | QA |
| QA-BATCH-006 | DEV-032–034: Service Session | QA |
| QA-BATCH-007 | DEV-035–038: Feedback + Follow-Up | QA |
| QA-BATCH-008 | DEV-039–042: Integration + E2E | QA |

---

## 8. Demo Criteria

### DEMO-003: Sprint-3 Manual Loop Validation

| # | Step | Screen | API |
|---|------|--------|-----|
| 1 | Login | Login | POST /auth/login |
| 2 | Search/Create customer | S1 | GET /identities |
| 3 | Activate + Summary | S2 | POST /activate |
| 4 | Concern intake | S3 | PUT /profile |
| 5 | **Service record** | S4 | POST /sessions |
| 6 | **Complete service** | S4 | POST /sessions/{id}/complete |
| 7 | **Feedback** | S5 | PATCH /sessions/{id} |
| 8 | **Follow-up** | S6 | POST /plans |
| 9 | **Enhanced summary** | S2 | GET /sessions + /plans |
| 10 | Verify Timeline (all entries) | S2 | GET /timeline |

---

## 9. Release Gate Criteria

### Sprint-3 Done

- [ ] All P0 tasks complete (DEV-030 through DEV-042)
- [ ] Auth middleware wired to all routes
- [ ] 2 new database tables created (service_session, health_plan)
- [ ] 6 new API endpoints operational
- [ ] 3 new screens (S4/S5/S6) + S2 enhanced
- [ ] Full manual loop completable without errors
- [ ] Integration tests pass in CI
- [ ] E2E Playwright test passes
- [ ] 4 QA-BATCH reviews completed
- [ ] DEMO-003 validation passes
- [ ] VERSION.md updated to v0.3.0

### Sprint-3 Do-Not-Close

- [ ] Any P0 task incomplete
- [ ] Manual loop cannot be completed
- [ ] Auth bypassable on any route
- [ ] Timeline missing entries for service events
- [ ] Staff can access other stores' data

---

## 10. Out of Scope

| Item | Reason | Planned |
|------|--------|---------|
| AI Summary (F6) | Sprint 4 | Sprint 4 |
| Knowledge Entry Management (F11) | Sprint 4 | Sprint 4 |
| Health Assessment entity | Sprint 4 (AI required) | Sprint 4 |
| Customer PWA (F10) | Sprint 5 | Sprint 5 |
| Upload Asset (F12) | Sprint 5 | Sprint 5 |
| Operator Review Screen (F14) | Sprint 5 | Sprint 5 |
| Dashboard / Today's Tasks (F13) | Sprint 4 | Sprint 4 |
| Device entity + Device Usage | Post-MVP | Post-MVP |
| Member Entitlement entity | Post-MVP | Post-MVP |
| 微信小程序 | Platform dependency | Post-MVP |
| 支付系统 | Non-MVP | Post-MVP |
| Vector Store / RAG | ADR-002 Deferred | Post-MVP |

---

## 11. Risks

| # | Risk | Severity | Mitigation |
|---|------|----------|------------|
| R1 | Auth wiring breaks existing tests | Medium | Run full test suite after DEV-030; fix tests before proceeding |
| R2 | Service Session model complexity (device, entitlement, plan references) | Medium | MVP simplification: defer optional FK references; implement core fields only |
| R3 | Health Plan scope creep — temptation to implement full plan lifecycle before needed | Medium | Sprint 3 only implements follow_up_schedule; goals[] is optional; no assessment linking |
| R4 | S2 becomes too complex with 4 data sources (identity + profile + timeline + services + plans) | Low | Use tabbed sections or collapsible panels; keep each section minimal |
| R5 | E2E test brittleness (6 screens, multiple API calls) | Medium | Use seeded test data; ensure tests are idempotent; use data-testid consistently |
| R6 | Staff find the workflow too long (S1→S2→S3→S4→S5→S6) | Medium | Keep required fields minimal per PRD-001; measure time-to-complete during DEMO-003 |

---

## 12. Team & Capacity

| Owner | P0 Tasks | P1 Tasks | Total |
|-------|---------|---------|-------|
| Platform | 6 | 0 | 6 (DEV-030, 032, 033, 036, 037, 040, 042) |
| Store | 4 | 1 | 5 (DEV-031, 034, 035, 038, 039, 041) |
| **Total** | **10** | **1** | **13** |

Estimated: 3–4 weeks for 1–2 developers.

---

## 13. End of Document

SPRINT-003-PLAN defines the development plan for Health One Sprint 3 (Manual Service Loop).

All tasks are derived from PRD-001 P0 features (F3, F4, F5, F9-partial) and RFC-002 entities (Service Session, Health Plan). Sprint 3 completes the manual closed loop — the first time the full Health One value loop can be executed without AI assistance.

This plan must be reviewed and approved before implementation begins.
