# Health One Version History

## v0.3.1 — Manual Loop Stabilized

**Release Status:** Release Candidate
**Pilot Status:** Internal Pilot Approved

**Date:** 2026-06-30

**Architecture:** ARCH-000 Approved

### Major Changes

- **BUG-006 fixed** — Timeline enum displays Chinese value (健康舱) not enum name
- **S2 Enhanced Summary** — Service history + follow-up status visible on Customer Summary
- **Integration tests added** — 8 tests for Service Session + Health Plan APIs
- **E2E manual loop test** — Playwright 8-step full loop verification
- **Deployment checklist** — PostgreSQL + Nginx + systemd deployment guide
- **Backup/restore checklist** — pg_dump + SQLite backup with cron schedule

### Previous Sprint-3 Features

- Service Session recording + API (5 endpoints)
- Customer Feedback capture (PATCH /sessions)
- Follow-Up Task / Health Plan (4 endpoints)
- S4–S6 Store Workbench screens
- Auth middleware wired to all routes
- 24 API endpoints total, all JWT-protected

### Database

| Database | Tables | Migration |
|----------|--------|-----------|
| Platform DB (PostgreSQL) | health_identity, health_profile, health_timeline, service_session, health_plan | 001–003 |
| Store DB (SQLite) | store, staff | 001 |

### Known Limitations

- S2 enhanced but service/follow-up data requires API call (loaded async)
- Integration + E2E tests CI-ready (need PostgreSQL + API running)
- No real store deployment yet (checklists prepared)
- Frontend JWT in localStorage (acceptable for internal pilot)
- Single-store only (multi-store post-MVP)

### Git Milestones (Sprint-3)

- `b019b9d` — feat(sprint-3): wire auth middleware (DEV-030-031)
- `a19187d` — feat(sprint-3): Service Session (DEV-032-034)
- `1667d9c` — feat(sprint-3): S5 Feedback (DEV-035)
- `2aab527` — feat(sprint-3): Follow-Up + Health Plan (DEV-036-038)

### QA Reports

- `QA-BATCH-007` — Service Session Review
- `QA-BATCH-008` — Feedback Screen Review
- `QA-BATCH-009` — Follow-Up Review

### Release Gate

- `RELEASE-GATE-002` — Sprint-3 Final Review (GO — Manual Service Loop Complete)
- `DEMO-003` — Manual Loop Validation (PASS — 13/13 checks)

### Next Target

**Sprint-4** — AI Integration (F6 AI Summary, F11 Knowledge, F13 Dashboard)

---

## v0.3.0 — Manual Service Loop Complete

**Release Status:** Development Complete

**Date:** 2026-06-30

**Architecture:** ARCH-000 Approved

### Major Features

- **Manual Service Closed Loop** — S1→S2→S3→S4→S5→S6→S2 full loop functional
- **Service Session** — Record store service delivery (RFC-002 §3.5)
- **Customer Feedback** — Capture post-service feedback (F4)
- **Follow-Up Task** — Health Plan with follow_up_schedule (F5)
- **Auth Middleware** — JWT wired to all 24 API endpoints
- **Sprint-2 Cleanup** — S1 debounce, S2 pending concern, S3 healthGoal/phone

### Database

| Database | Tables | Migration |
|----------|--------|-----------|
| Platform DB (PostgreSQL) | +service_session, +health_plan | 002, 003 |

### API (24 endpoints total, +9 from Sprint-2)

`POST/GET /api/identities/{id}/sessions`, `GET/PATCH /api/identities/{id}/sessions/{sid}`, `POST /api/identities/{id}/sessions/{sid}/complete`, `POST/GET /api/identities/{id}/plans`, `GET/PATCH /api/identities/{id}/plans/{pid}`

---

## v0.2.0 — Sprint-2 Development Complete

**Release Status:** Development Complete / Release Deferred

**Date:** 2026-06-29

**Architecture:** ARCH-000 Approved

### Major Features

- **Infrastructure** — Python/FastAPI monorepo, PostgreSQL + SQLite dual-DB, Vite/React SPA, GitHub Actions CI/CD
- **Platform API** — 15 endpoints: Health Identity CRUD + search + activate/archive, Health Profile upsert, Health Timeline append-only log
- **Store DB** — SQLite per-store database with Store + Staff tables, bcrypt password hashing, seed data
- **JWT Authentication** — Staff login/logout, Bearer token injection, `get_current_staff` + `require_store_access` middleware
- **Store Workbench S1–S3** — Customer Search/Create, Health Identity Summary, Health Concern Intake

### Database

| Database | Tables | Migration |
|----------|--------|-----------|
| Platform DB (PostgreSQL) | health_identity, health_profile, health_timeline | 001_create_core_tables |
| Store DB (SQLite) | store, staff | 001_create_store_tables |

### API (15 endpoints)

`POST /api/auth/login`, `GET /api/auth/me`, `POST/GET /api/identities/`, `GET/PATCH /api/identities/{id}`, `POST /api/identities/{id}/activate`, `POST /api/identities/{id}/archive`, `GET/PUT/PATCH /api/identities/{id}/profile`, `GET /api/identities/{id}/timeline`, `POST /api/identities/{id}/timeline/entries`, `GET /health`, `GET /health/db`

### Known Limitations

- Auth middleware not fully connected to identity/profile/timeline routes
- PostgreSQL integration tests pending (9 tests CI-ready, need DB running)
- Internal demo pending (requires PostgreSQL for full walkthrough)
- Store validation pending (real store not yet connected)
- S1 search has no debounce (fires API on every keystroke)
- Phone field not captured in customer create/concern flow

### Git Milestones

- `2b97012` — feat(sprint-2): establish project infrastructure (DEV-001-005)
- `a56f198` — feat(sprint-2): implement Platform API core (DEV-006-012)
- `9132e9a` — feat(sprint-2): implement Store DB and JWT auth (DEV-013-016)
- `8f1fc16` — feat(sprint-2): implement Store Workbench screens S1-S3 (DEV-017-019)

### QA Reports

- `QA-BATCH-001` — Infrastructure Review
- `QA-BATCH-002` — Platform API Review
- `QA-BATCH-003` — Store/Auth Review
- `QA-BATCH-004` — Store Workbench UI Review

### Release Gate

- `RELEASE-GATE-001` — Sprint-002 Final Review (GO — Conditionally Complete)

### Next Target

**Sprint-3** — Manual Service Loop (F3 Service Session, F4 Feedback, F5 Follow-Up, S4–S6 screens)

---

## v0.1.0 — M0/M1 Foundation

**Release Status:** Architecture Freeze Complete

**Date:** 2026-06-28

**Architecture:** ARCH-000 Approved

### Major Features

- Project governance and constitution established
- Domain model defined (14 entities, RFC-001)
- Data model defined (RFC-002)
- Technical stack selected (ADR-002: Python/FastAPI, PostgreSQL+SQLite, React SPA)
- MVP scope defined (PRD-001: 9 P0 features, 4 sprints)
- Legacy assets documented and frozen (FD-005)

### Git Milestones

- `ea1d5ab` — release: add phase d closure
- `d37ab12` — docs(m0): finalize project foundation and governance
- `519539c` — docs(architecture): approve ARCH-000 core architecture review

---

## Governance

**Reference:** `docs/founder/FD-006-VERSION-GOVERNANCE.md`

- Sprint is a development rhythm. Version represents product state.
- Release Status: Development → Development Complete → Release Candidate → Pilot → Production.
- Release Candidate, Pilot, and Production require **Founder approval**.
- Each Version must have an annotated Git tag.
- `VERSION.md` is the single source of truth for all version information.
