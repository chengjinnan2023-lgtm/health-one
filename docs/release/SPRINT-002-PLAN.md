# SPRINT-002 Development Plan

Document ID : SPRINT-002-PLAN
Title       : Sprint-002 Foundation — Development Plan
Version     : 1.0
Status      : Proposed
Owner       : Architecture Office
Created     : 2026-06-28
Depends On  : Constitution v1.0, ARCH-000 (Approved), RFC-001, RFC-002, ADR-002, PRD-001 (Approved)
Sprint      : Sprint 2 (Foundation)
Milestone   : M2

---

## 1. Sprint Goal

> **Establish the technical foundation — Platform API, Store DB, Health Identity management, Health Profile, Staff authentication, and the first 3 screens of Store Workbench.**

At the end of Sprint 2, a Store Staff member shall be able to:

1. Log in to Store Workbench with JWT credentials
2. Search for an existing customer or create a new one
3. Activate the customer's Health Identity (健康元)
4. View the customer's Health Identity summary
5. Record health concern intake (Health Profile + primary concern)

These capabilities form the **Entry** segment of the MVP closed loop (Customer Entry → Lookup/Create → Activate 健康元 → Concern Intake).

**Sprint 2 is the first implementation sprint.** It transitions the project from documentation-only (Markdown) to running code (Python + FastAPI + SQLite/PostgreSQL).

---

## 2. Sprint Scope

### 2.1 In Scope

| Feature | ID | Priority | Source |
|---------|-----|---------|--------|
| Customer Identity Management | F1 | P0 | PRD-001 §4 |
| Health Profile & Concern Intake | F2 | P0 | PRD-001 §4 |
| Store Staff Authorization | F7 | P0 | PRD-001 §4 |
| Event Logging & Timeline | F8 | P0 | PRD-001 §4 |
| Store Workbench Screens S1–S3 | F9 (partial) | P0 | PRD-001 §4 |

### 2.2 Screens Delivered

| # | Screen | Feature | Source |
|---|--------|---------|--------|
| S1 | Customer Search / Create | F1 | PRODUCT-003 §6 |
| S2 | Customer 健康元 Summary | F1, F2 | PRODUCT-003 §7 |
| S3 | Health Concern Intake | F2 | PRODUCT-003 §8 |

### 2.3 APIs Delivered

| API | Endpoint Family | Owner |
|-----|----------------|-------|
| Health Identity API | `/api/identities/*` | Platform |
| Health Profile API | `/api/profiles/*` | Platform |
| Health Timeline API | `/api/timelines/*` | Platform |
| Store API | `/api/stores/*` | Store |
| Staff Auth API | `/api/auth/*` | Platform |

### 2.4 Out of Scope (for Sprint 2)

The following are **explicitly excluded** from Sprint 2:

| Item | Reason | Planned Sprint |
|------|--------|---------------|
| Service Session Recording (F3) | Manual loop — Sprint 3 | Sprint 3 |
| Customer Feedback Capture (F4) | Manual loop — Sprint 3 | Sprint 3 |
| Follow-Up Task Management (F5) | Manual loop — Sprint 3 | Sprint 3 |
| AI Summary (F6) | AI integration — Sprint 4 | Sprint 4 |
| Screens S4–S6 (Service/Feedback/Follow-Up) | Manual loop — Sprint 3 | Sprint 3 |
| Screens S7–S8 (AI/Operator) | Post-manual-loop | Sprint 4–5 |
| Customer PWA (F10) | P1 — Sprint 5 | Sprint 5 |
| Knowledge Entry Management (F11) | P1 — Sprint 4 | Sprint 4 |
| Upload Asset (F12) | P1 — Sprint 5 | Sprint 5 |
| Dashboard / Today's Tasks (F13) | P1 — Sprint 4 | Sprint 4 |
| Operator Review Screen (F14) | P1 — Sprint 5 | Sprint 5 |
| AI Capability implementation | AI starts Sprint 4 | Sprint 4 |
| Vector Store / pgvector | ADR-002 Deferred | Post-MVP |
| Docker deployment | ADR-002 Deferred | Post-MVP |
| Production deployment (Nginx + systemd) | Requires M5 gate | Post-MVP |

---

## 3. User Stories

### US-001: Staff Login
> **As a** Store Staff member, **I want to** log in to Store Workbench with my credentials, **so that** I can access customer data scoped to my store.

**Acceptance:**
- Staff enters username + password → receives JWT token
- Token is validated on every subsequent API request
- Staff can only see data for their own store
- Token expires after configured duration; re-login required
- Invalid credentials return clear error (not system stack trace)

### US-002: Customer Lookup
> **As a** Store Staff member, **I want to** search for a customer by name or phone number, **so that** I can quickly find an existing customer when they walk in.

**Acceptance:**
- Name search returns matching customers (partial match)
- Phone search returns exact or partial matches
- Search completes within 1 second
- Results show: display_name, phone, activation_status, primary_store
- "No results" state shows "Create New Customer" action

### US-003: Customer Creation
> **As a** Store Staff member, **I want to** create a new customer record with minimal fields, **so that** I can register a first-time customer and activate their 健康元.

**Acceptance:**
- Required fields: name (or nickname), phone (or contact method)
- Creation auto-generates Health Identity with status = `pending`
- Staff can activate immediately (status → `active`)
- Creation auto-generates empty Health Profile linked to Identity
- Creation triggers Timeline Entry: `identity_created`
- Duplicate phone number shows warning (soft prevention)

### US-004: Health Identity Activation
> **As a** Store Staff member, **I want to** activate a customer's 健康元, **so that** the customer's health record becomes active and ready for service.

**Acceptance:**
- Activation transitions status: `pending` → `active`
- activated_at timestamp is set
- Timeline Entry: `identity_activated` is auto-appended
- Archived identities cannot be re-activated (explicit rule)

### US-005: View Customer Summary
> **As a** Store Staff member, **I want to** view a customer's 健康元 summary screen, **so that** I can understand the customer's context before service.

**Acceptance:**
- Shows: display_name, activation_status, primary_store
- Shows: basic_info (birth year, gender), primary_concern
- Shows: recent Timeline entries (last 10)
- Summary loads within 1 second
- Navigation: links to Concern Intake screen

### US-006: Health Concern Intake
> **As a** Store Staff member, **I want to** record a customer's health concern and basic profile information, **so that** the system has context for service delivery.

**Acceptance:**
- Select concern category from predefined list (肩颈/腰背/疲劳/运动恢复/体重/睡眠/其他)
- Record customer self-description (free text)
- Record staff observation notes (free text, optional)
- Record health goal (free text, optional)
- Update Health Profile with basic_info
- Timeline Entry: `profile_updated` is auto-appended
- 3-step flow: Category → Description → Confirm
- Required fields ≤ 4

---

## 4. Development Tasks

### 4.1 Task Priority Summary

| Priority | Count | Description |
|----------|-------|-------------|
| P0 | 22 | Must complete for Sprint 2 success |
| P1 | 3 | Quality / DX improvements; can slip to Sprint 3 if needed |

### 4.2 Task List

---

#### Phase 1: Project Infrastructure

##### DEV-001 — Project Scaffolding & Monorepo Structure

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Depends On** | — |
| **Estimated** | M (Medium) |
| **Owner** | Platform |
| **Tags** | `infrastructure` `python` |

**Description:**
Initialize the Health One monorepo with Python/FastAPI project structure. Set up virtual environment, dependency management, and configuration.

**Tasks:**
- Create top-level directory structure: `platform/`, `store/`, `shared/`, `frontend/`, `tests/`
- Initialize `pyproject.toml` or `requirements.txt` with: fastapi, uvicorn, sqlalchemy, alembic, pydantic, python-jose, httpx, pytest, pytest-asyncio
- Create `Makefile` with targets: `install`, `lint`, `test`, `run-platform`, `run-store`
- Set up `ruff` configuration for linting
- Create `.env.example` with DB connection strings, JWT secret placeholder
- Document local development setup in `README.md`

**Deliverable:**
- Runnable `uvicorn platform.main:app --reload` returning 200 on `/health`
- `make install` sets up venv and installs all dependencies
- `make lint` runs ruff without errors (on scaffold code)

---

##### DEV-002 — Platform Database Setup (PostgreSQL)

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Depends On** | DEV-001 |
| **Estimated** | M (Medium) |
| **Owner** | Platform |
| **Tags** | `infrastructure` `database` `postgresql` |

**Description:**
Set up PostgreSQL for Platform DB. Configure SQLAlchemy async engine, Alembic for migrations, and connection management.

**Tasks:**
- Install and configure PostgreSQL (local dev)
- Create `health_one_platform` database
- Configure SQLAlchemy async engine with asyncpg driver
- Set up Alembic with `alembic init`
- Create base model class with UUID PK, created_at, updated_at
- Implement DB session dependency for FastAPI
- Write connection health check endpoint

**Deliverable:**
- `alembic upgrade head` runs successfully (even with zero migrations)
- `/health/db` endpoint returns `{"platform_db": "ok"}`
- SQLAlchemy models importable from `platform.models`

---

##### DEV-003 — Store Database Setup (SQLite)

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Depends On** | DEV-001 |
| **Estimated** | S (Small) |
| **Owner** | Store |
| **Tags** | `infrastructure` `database` `sqlite` |

**Description:**
Set up SQLite for Store DB. Each store gets an independent SQLite file. Configure SQLAlchemy with aiosqlite for async support.

**Tasks:**
- Create store DB directory structure: `data/store-001/`
- Configure SQLAlchemy engine with aiosqlite for Store DB
- Create separate Alembic configuration for Store DB migrations
- Implement DB path resolution: `data/store-{store_code}/store.db`
- Ensure WAL mode is enabled for SQLite (better concurrent read)
- Write connection health check endpoint

**Deliverable:**
- Store DB SQLite file created on first migration
- `/health/db` endpoint returns `{"store_db": "ok"}`
- Store DB models importable from `store.models`

---

##### DEV-004 — CI/CD Pipeline (GitHub Actions)

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Depends On** | DEV-001 |
| **Estimated** | S (Small) |
| **Owner** | Platform |
| **Tags** | `infrastructure` `ci/cd` |

**Description:**
Set up GitHub Actions workflow for continuous integration. Every push and PR triggers lint + test.

**Tasks:**
- Create `.github/workflows/ci.yml`
- Configure `ruff` lint job
- Configure `pytest` test job with PostgreSQL service container
- Set up pytest-cov with minimum coverage threshold (70%)
- Add PR status check requirements

**Deliverable:**
- Push to any branch triggers CI
- PR cannot merge if lint or test fails
- CI completes within 5 minutes

---

##### DEV-005 — Store Workbench SPA Scaffold

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Depends On** | DEV-001 |
| **Estimated** | M (Medium) |
| **Owner** | Store |
| **Tags** | `frontend` `spa` |

**Description:**
Initialize the Store Workbench Web SPA with framework, routing, API client, and auth token management. Framework TBD (React or Vue — per ADR-002 §3.3). This task picks the framework and establishes the frontend foundation.

**Tasks:**
- Select framework (React or Vue) — document decision in task kickoff
- Initialize SPA project with build tooling (Vite)
- Set up routing (react-router or vue-router)
- Create API client module with JWT token injection
- Implement login token storage (localStorage or memory)
- Create base layout component (header, sidebar nav placeholder, main content)
- Set up Playwright for E2E test scaffolding
- Configure dev proxy to Platform API (Vite proxy)

**Deliverable:**
- `npm run dev` serves SPA on localhost:5173
- Login screen renders (not functional until DEV-015)
- API client module ready for screen integration
- Base layout with placeholder navigation

---

#### Phase 2: Platform API — Core Entities

##### DEV-006 — Health Identity Model & Migration

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Depends On** | DEV-002 |
| **Estimated** | M (Medium) |
| **Owner** | Platform |
| **Tags** | `platform` `model` `database` |

**Description:**
Implement the Health Identity SQLAlchemy model and Alembic migration for Platform DB (PostgreSQL). This is the aggregate root — all health entities reference it.

**Model Fields (from RFC-002 §2.1):**
- `identity_id` : UUID, PK
- `display_name` : String, NOT NULL
- `activation_status` : Enum (pending / active / archived), default=pending
- `primary_store_id` : UUID, NOT NULL (FK reference to Store, application-level)
- `data_ownership_tag` : Enum (customer / platform), default=customer
- `created_at` : Timestamp, auto
- `activated_at` : Timestamp, nullable

**Tasks:**
- Define SQLAlchemy model with all RFC-002 fields and constraints
- Write Alembic migration (create table + indexes)
- Add unique constraint on (display_name, primary_store_id) to aid dedup
- Add index on display_name for search
- Implement Pydantic schemas: `IdentityCreate`, `IdentityResponse`, `IdentityUpdate`
- Write model unit tests (field validation, enum constraints)

**Deliverable:**
- `alembic upgrade head` creates `health_identity` table in PostgreSQL
- Pydantic schemas validate RFC-002 constraints
- Model unit tests pass

---

##### DEV-007 — Health Identity API Endpoints

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Depends On** | DEV-006 |
| **Estimated** | M (Medium) |
| **Owner** | Platform |
| **Tags** | `platform` `api` `fastapi` |

**Description:**
Implement REST API endpoints for Health Identity CRUD and search. This is the primary API that Store Workbench screens S1 and S2 depend on.

**Endpoints:**
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/identities/` | Create new Health Identity |
| GET | `/api/identities/{identity_id}` | Get by ID |
| GET | `/api/identities/?q={query}` | Search by name or phone |
| GET | `/api/identities/?store_id={id}` | List by store |
| PATCH | `/api/identities/{identity_id}` | Update (name, store) |
| POST | `/api/identities/{identity_id}/activate` | Activate (pending → active) |
| POST | `/api/identities/{identity_id}/archive` | Archive (active → archived) |

**Tasks:**
- Implement create with auto-generated UUID
- Implement search with SQLAlchemy `ilike` on display_name
- Implement activate endpoint: set activated_at, change status
- Implement archive endpoint: validate not already archived
- Add duplicate detection: warn if same name+store exists (HTTP 409)
- Add pagination (offset/limit, default 20)
- Add request/response validation via Pydantic
- Write API tests with httpx + pytest-asyncio

**Deliverable:**
- All 7 endpoints return correct HTTP status codes
- Search returns results with pagination
- Activate transitions state and sets timestamp
- API tests cover happy path + error cases (404, 409, 422)

---

##### DEV-008 — Health Profile Model & Migration

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Depends On** | DEV-002, DEV-006 |
| **Estimated** | M (Medium) |
| **Owner** | Platform |
| **Tags** | `platform` `model` `database` |

**Description:**
Implement Health Profile SQLAlchemy model and migration. Health Profile is 1:1 with Health Identity. It stores structured health information as defined in RFC-002 §3.1.

**Model Fields (from RFC-002 §3.1):**
- `profile_id` : UUID, PK
- `identity_id` : UUID, FK → Health Identity, UNIQUE
- `basic_info` : JSON (birth_date, gender, height, weight, …)
- `medical_summary` : Text (已知健康状况摘要，非诊断)
- `lifestyle_notes` : Text (运动、饮食、睡眠)
- `primary_concern` : Text (主要健康关注)
- `last_updated_at` : Timestamp

**Tasks:**
- Define SQLAlchemy model with JSONB column for basic_info (PostgreSQL)
- Write Alembic migration
- Add UNIQUE constraint on identity_id
- Implement Pydantic schemas: `ProfileCreate`, `ProfileResponse`, `ProfileUpdate`
- Add validator: medical_summary must not contain diagnostic language (warning-level)
- Write model unit tests

**Deliverable:**
- `alembic upgrade head` creates `health_profile` table
- JSONB column stores/retrieves basic_info correctly
- identity_id uniqueness enforced at DB level

---

##### DEV-009 — Health Profile API Endpoints

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Depends On** | DEV-008 |
| **Estimated** | S (Small) |
| **Owner** | Platform |
| **Tags** | `platform` `api` `fastapi` |

**Description:**
Implement REST API for Health Profile. Profile is auto-created when Identity is created, so the primary operations are read and update. This API serves Screen S2 (Summary) and S3 (Concern Intake).

**Endpoints:**
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/identities/{identity_id}/profile` | Get profile for identity |
| PUT | `/api/identities/{identity_id}/profile` | Create or update profile |
| PATCH | `/api/identities/{identity_id}/profile` | Partial update |

**Tasks:**
- Implement GET: return profile with basic_info, primary_concern, lifestyle_notes
- Implement PUT: upsert (create if not exists, update if exists)
- Implement PATCH: partial update of individual fields
- Auto-set last_updated_at on every write
- Trigger Timeline Entry on profile update (call DEV-011 service)
- Write API tests

**Deliverable:**
- Profile API serves correct data for Screen S2
- Profile update triggers Timeline Entry
- API tests pass for all endpoints

---

##### DEV-010 — Health Timeline Model & Migration

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Depends On** | DEV-002, DEV-006 |
| **Estimated** | M (Medium) |
| **Owner** | Platform |
| **Tags** | `platform` `model` `database` |

**Description:**
Implement Health Timeline and Timeline Entry models. Health Timeline is 1:1 with Health Identity. Timeline Entry is a Value Object stored as JSONB within the Timeline (per RFC-002 §4.1, MVP approach).

**Model Fields (from RFC-002 §3.2 + §4.1):**
- Health Timeline: `timeline_id` (UUID PK), `identity_id` (UUID FK, UNIQUE)
- Timeline Entry (JSONB array): entry_id, timestamp, event_type, source_object_type, source_object_id, summary_text, performed_by

**Tasks:**
- Define SQLAlchemy model for Health Timeline
- Store entries as JSONB column (RFC-002 Q3 decision: MVP uses JSONB inline)
- Write Alembic migration
- Implement Pydantic schemas: `TimelineResponse`, `TimelineEntrySchema`
- Add constraint: entries are append-only (application-level enforcement)
- Write model unit tests

**Deliverable:**
- `alembic upgrade head` creates `health_timeline` table with JSONB entries column
- Timeline model validates append-only constraint
- Model tests pass

---

##### DEV-011 — Health Timeline Auto-Append Service

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Depends On** | DEV-010 |
| **Estimated** | S (Small) |
| **Owner** | Platform |
| **Tags** | `platform` `service` `timeline` |

**Description:**
Implement a service function that auto-appends Timeline Entries when business events occur. This is the implementation of RFC-001 rules R7.1–R7.3.

**Trigger Events (Sprint 2 scope):**
| Event | event_type | Triggered By |
|-------|-----------|-------------|
| Identity created | `identity_created` | DEV-007 POST /identities |
| Identity activated | `identity_activated` | DEV-007 POST /activate |
| Profile updated | `profile_updated` | DEV-009 PUT/PATCH /profile |

**Tasks:**
- Implement `append_timeline_entry(identity_id, event_type, source_object_type, source_object_id, summary_text, performed_by)` service function
- Service validates: entry is only appended, never modified or deleted
- Service validates: identity_id exists
- Integrate into DEV-007 (Identity create, activate) and DEV-009 (Profile update)
- Write service unit tests (append, immutability check, missing identity error)

**Deliverable:**
- Timeline entries auto-appended on Identity creation, activation, and Profile update
- Immutability enforced at service level
- Service unit tests pass

---

##### DEV-012 — Health Timeline API Endpoints

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Depends On** | DEV-010, DEV-011 |
| **Estimated** | S (Small) |
| **Owner** | Platform |
| **Tags** | `platform` `api` `fastapi` |

**Description:**
Implement read-only REST API for Health Timeline. Timeline data is queried by Screen S2 (Customer Summary) to show recent health events.

**Endpoints:**
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/identities/{identity_id}/timeline` | Get timeline entries |
| GET | `/api/identities/{identity_id}/timeline?event_type={type}` | Filter by event type |
| GET | `/api/identities/{identity_id}/timeline?limit={n}` | Limit entries (default 20) |

**Tasks:**
- Implement GET with pagination (default 20, max 100)
- Support filter by event_type
- Return entries in reverse chronological order (newest first)
- Read-only: no POST/PUT/DELETE (Timeline is append-only via service)
- Write API tests

**Deliverable:**
- Timeline API returns entries for Screen S2
- No write endpoints exposed
- API tests pass

---

#### Phase 3: Store DB + Auth

##### DEV-013 — Store Model & Migration

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Depends On** | DEV-003 |
| **Estimated** | S (Small) |
| **Owner** | Store |
| **Tags** | `store` `model` `database` |

**Description:**
Implement Store SQLAlchemy model and migration for Store DB (SQLite). MVP is single-store, but the model supports multi-store from day 1.

**Model Fields (from RFC-002 §3.6):**
- `store_id` : UUID, PK
- `store_name` : String
- `store_code` : String, UNIQUE
- `location` : String
- `contact_info` : JSON (电话、营业时间等)
- `operating_status` : Enum (active / inactive / pilot)
- `store_type` : Enum (直营 / 合作 / 加盟)
- `config` : JSON (Store Config Value Object)
- `local_knowledge` : JSON

**Tasks:**
- Define SQLAlchemy model with JSON columns (SQLite stores JSON as TEXT)
- Write Alembic migration for Store DB
- Create seed data: insert pilot store record
- Implement Pydantic schemas: `StoreResponse`
- Write model unit tests

**Deliverable:**
- `alembic upgrade head` creates `store` table in SQLite
- Seed data includes one pilot store
- Model tests pass

---

##### DEV-014 — Staff Model & Migration

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Depends On** | DEV-013 |
| **Estimated** | S (Small) |
| **Owner** | Store |
| **Tags** | `store` `model` `database` |

**Description:**
Implement Staff SQLAlchemy model and migration for Store DB. Staff is scoped to a single Store. Authentication uses password hash.

**Model Fields (from RFC-002 §3.7):**
- `staff_id` : UUID, PK
- `store_id` : UUID, FK → Store
- `display_name` : String
- `role` : Enum (店长 / 健康管理师 / 服务人员)
- `contact_info` : String
- `status` : Enum (active / inactive)
- `certifications` : JSON (Value Object array)

**Additional fields for auth (not in RFC-002 domain model — implementation concern):**
- `username` : String, UNIQUE (login credential)
- `password_hash` : String (bcrypt hashed)

**Tasks:**
- Define SQLAlchemy model
- Write Alembic migration for Store DB
- Hash password on create/update using passlib[bcrypt]
- Create seed data: one staff record for the pilot store
- Implement Pydantic schemas: `StaffCreate`, `StaffResponse` (NEVER expose password_hash)
- Write model unit tests

**Deliverable:**
- `alembic upgrade head` creates `staff` table in SQLite
- Seed data includes one staff user for pilot store
- Password hashed with bcrypt; never returned in API responses

---

##### DEV-015 — JWT Authentication Service

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Depends On** | DEV-014 |
| **Estimated** | M (Medium) |
| **Owner** | Platform |
| **Tags** | `platform` `auth` `security` |

**Description:**
Implement JWT-based authentication. Staff logs in with username + password, receives a JWT token. Token is validated on subsequent requests. MVP uses simple JWT without refresh tokens (acceptable for MVP store workbench).

**Endpoints:**
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Authenticate, return JWT |
| GET | `/api/auth/me` | Return current staff info from token |

**Tasks:**
- Implement login endpoint: validate username + password against Staff table
- Generate JWT using python-jose with: staff_id, store_id, role, exp
- JWT secret from environment variable (`JWT_SECRET`)
- Token expiry: 8 hours (one work shift)
- Implement `/auth/me` endpoint: decode token, return staff + store info
- Store DB query: since Staff is in Store DB (SQLite), Platform API needs to query Store DB or have the auth service co-located
  - **Architecture decision:** For MVP, auth runs as part of Platform API. Store DB path is configured per-store. Platform API reads Staff credentials from Store DB to verify login.
- Write auth unit tests (valid login, invalid password, expired token, missing token)

**Deliverable:**
- POST `/api/auth/login` returns `{"access_token": "...", "staff": {...}}`
- GET `/api/auth/me` returns staff info from valid token
- Invalid/expired tokens return HTTP 401
- Auth tests pass

---

##### DEV-016 — Auth Middleware & Store-Scoped Access Control

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Depends On** | DEV-015 |
| **Estimated** | S (Small) |
| **Owner** | Platform |
| **Tags** | `platform` `auth` `middleware` |

**Description:**
Implement FastAPI dependency/middleware that extracts and validates JWT from Authorization header. Enforce store-scoped access: staff can only access data for their own store.

**Tasks:**
- Implement `get_current_staff` FastAPI dependency
  - Extract Bearer token from Authorization header
  - Decode JWT, verify expiry
  - Return Staff object (or raise HTTP 401)
- Implement `require_store_access(target_store_id)` dependency
  - Compare token's store_id with target store_id
  - Raise HTTP 403 if mismatch
- Apply middleware to all `/api/` routes except `/api/auth/login` and `/health`
- Write middleware unit tests

**Deliverable:**
- Unauthenticated requests to protected endpoints → HTTP 401
- Staff from Store A accessing Store B data → HTTP 403
- Middleware unit tests pass

---

#### Phase 4: Store Workbench — Screens S1–S3

##### DEV-017 — Screen S1: Customer Search / Create

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Depends On** | DEV-005, DEV-007, DEV-016 |
| **Estimated** | L (Large) |
| **Owner** | Store |
| **Tags** | `frontend` `screen` `customer` |

**Description:**
Build the Customer Search / Create screen (PRODUCT-003 §6). Staff can search for existing customers or create new ones. This is the entry point of the Store Workbench workflow.

**UI Requirements:**
- Search bar: input for name or phone number
- Search results list: display_name, phone, activation_status badge, primary_store
- "No results" state with "Create New Customer" CTA
- "Create Customer" form (modal or inline):
  - Required: name (or nickname), phone (or contact method)
  - Auto-assign to current staff's store
  - On create: navigate to Screen S2 (Customer Summary)
- Activation status badge (color-coded: pending=yellow, active=green, archived=gray)
- Click on search result → navigate to Screen S2

**Technical Tasks:**
- Implement search component with debounced API call (300ms)
- Implement create customer form with Pydantic validation (mirror backend)
- Handle API errors gracefully (network error, duplicate warning 409)
- Store JWT token from login; inject into API client headers
- Implement loading states (search spinner, create button disabled during submit)

**Deliverable:**
- Staff can search customers by name/phone
- Staff can create new customer (Health Identity)
- On create, navigates to Screen S2
- Search < 1 second response time
- Required fields ≤ 3 (name, phone, auto store)

---

##### DEV-018 — Screen S2: Customer 健康元 Summary

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Depends On** | DEV-005, DEV-007, DEV-009, DEV-012, DEV-016 |
| **Estimated** | L (Large) |
| **Owner** | Store |
| **Tags** | `frontend` `screen` `summary` |

**Description:**
Build the Customer 健康元 Summary screen (PRODUCT-003 §7). This screen gives Staff a quick overview of the customer's health context before service.

**UI Requirements:**
- Customer header: display_name, activation_status badge, primary_store
- Health Profile section: basic_info (birth year, gender), primary_concern, lifestyle_notes (if any)
- Recent Timeline section: last 10 entries with timestamp, event_type label, summary
- Health Goal section: current goal (if recorded)
- Action buttons:
  - "Record Concern" → navigate to Screen S3
  - "Activate 健康元" (if status=pending) → calls activate API
  - "Archive 健康元" (if status=active, with confirmation dialog)

**Technical Tasks:**
- Fetch and display Identity data (DEV-007 GET)
- Fetch and display Profile data (DEV-009 GET)
- Fetch and display Timeline entries (DEV-012 GET)
- Implement activate/archive actions
- Loading states for each data section
- Empty states: "No health concern recorded yet" → prompt to S3
- Error state: "Unable to load customer data" with retry button

**Deliverable:**
- Summary screen loads within 1 second
- All three data sources (Identity, Profile, Timeline) display correctly
- Activate button works for pending identities
- Navigate to S3 from summary

---

##### DEV-019 — Screen S3: Health Concern Intake

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Depends On** | DEV-005, DEV-009, DEV-016 |
| **Estimated** | L (Large) |
| **Owner** | Store |
| **Tags** | `frontend` `screen` `intake` |

**Description:**
Build the Health Concern Intake screen (PRODUCT-003 §8). Staff records why the customer came and what health concerns need attention.

**UI Requirements:**
- Concern category selector (chips/buttons):
  - 肩颈 (Shoulder & Neck)
  - 腰背 (Waist & Back)
  - 疲劳 (Fatigue)
  - 运动恢复 (Sports Recovery)
  - 体重管理 (Weight Management)
  - 睡眠 (Sleep)
  - 其他 (Other)
- Customer self-description textarea: "What did the customer say?"
- Staff observation textarea: "Staff notes" (optional)
- Health goal input: "What does the customer want to achieve?" (optional)
- Basic info fields (optional, pre-filled if Profile exists):
  - Birth year
  - Gender
- Save button: updates Health Profile via DEV-009 API
- Post-save: auto-navigate back to Screen S2 (Summary, now updated)

**Technical Tasks:**
- Implement category selector component
- Implement multi-step or single-page form (3 logical steps: Category → Description → Confirm)
- Required field validation (category + self-description required; rest optional)
- API integration with DEV-009 PUT/PATCH
- Auto-save draft? MVP: no — simple save button
- Success feedback: toast "Health concern recorded" + navigate to S2
- Error handling: "Failed to save. Please try again."

**Deliverable:**
- Staff can select concern category, enter description, save
- Required fields ≤ 4 (category, self-description, birth_year, gender)
- 3-step flow or single-page form with clear sections
- Save completes within 1 second
- Timeline Entry auto-generated on save (via DEV-011)

---

#### Phase 5: Integration & Testing

##### DEV-020 — API Integration Tests

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Depends On** | DEV-007, DEV-009, DEV-012, DEV-015 |
| **Estimated** | M (Medium) |
| **Owner** | Platform |
| **Tags** | `testing` `api` `integration` |

**Description:**
Write comprehensive integration tests for all Sprint 2 APIs. Tests run against a real test database (PostgreSQL + SQLite) using pytest fixtures.

**Test Scenarios:**
1. **Identity Flow:** Create → Search → Get → Activate → Archive
2. **Profile Flow:** Create → Update → Get → Verify Timeline Entry
3. **Timeline Flow:** Verify entries append on Identity create/activate, Profile update
4. **Auth Flow:** Login (valid) → Access protected endpoint → Login (invalid) → Expired token → Cross-store access denied
5. **Error Cases:** 404 (not found), 409 (duplicate), 422 (validation), 401 (unauthorized), 403 (forbidden)
6. **Concurrent:** Two rapid Profile updates → both Timeline entries preserved

**Tasks:**
- Set up pytest fixtures: test DB, test client (FastAPI TestClient), auth headers
- Implement fixture for seeded test data (one store, one staff, one identity)
- Write test modules per API family
- Ensure test isolation (each test has clean state or uses transactions)
- Configure pytest-cov; ensure ≥ 80% coverage on API routes

**Deliverable:**
- `pytest tests/api/` passes all integration tests
- Coverage ≥ 80% on API route handlers
- CI runs integration tests with PostgreSQL service container

---

##### DEV-021 — Store Workbench E2E Smoke Test

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Depends On** | DEV-017, DEV-018, DEV-019 |
| **Estimated** | M (Medium) |
| **Owner** | Store |
| **Tags** | `testing` `e2e` `playwright` |

**Description:**
Write Playwright E2E tests that verify the S1→S2→S3 workflow end-to-end. This validates the Store Workbench can complete the Entry segment of the MVP loop.

**Test Scenarios:**
1. **Login → Search → Create → Activate:**
   - Visit Store Workbench → Login with staff credentials
   - Search for non-existent customer → "No results"
   - Create new customer → redirected to S2
   - Customer shows status "pending"
   - Click "Activate" → status changes to "active"
2. **Login → Search → View Summary:**
   - Search for existing customer → click result
   - S2 shows Identity, Profile, Timeline data
3. **Login → Summary → Concern Intake:**
   - From S2, click "Record Concern"
   - S3: select category, enter description, save
   - Redirected back to S2 → Timeline shows new entry
4. **Unauthorized access:** Direct URL access without login → redirected to login

**Tasks:**
- Configure Playwright with Chromium
- Implement page object models for S1, S2, S3
- Write test fixtures: seeded test data, auth state
- Add test IDs (data-testid) to UI components as needed
- Configure Playwright in CI (GitHub Actions)

**Deliverable:**
- `npx playwright test` passes all E2E scenarios
- Tests run in CI (GitHub Actions with Playwright)
- All 4 scenarios verified

---

##### DEV-022 — Sprint 2 Integration Verification

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Depends On** | DEV-020, DEV-021 |
| **Estimated** | S (Small) |
| **Owner** | Platform |
| **Tags** | `testing` `integration` `verification` |

**Description:**
End-to-end manual verification checklist for Sprint 2 deliverables. Confirms all components work together before declaring Sprint 2 done.

**Verification Checklist:**
- [ ] `make install` sets up clean dev environment
- [ ] `make lint` passes (ruff, zero errors)
- [ ] `make test` passes (all unit + integration + E2E)
- [ ] Platform API starts: `make run-platform` → `/health` returns 200
- [ ] Store Workbench starts: `make run-frontend` → serves on localhost:5173
- [ ] Login → Search → Create Customer → Activate → View Summary → Record Concern → Verify Timeline (full manual walkthrough)
- [ ] CI pipeline passes on push (GitHub Actions green)
- [ ] All P0 tasks have passing tests
- [ ] Database migrations run cleanly (both Platform + Store DB)
- [ ] No hardcoded secrets in codebase (JWT_SECRET from env)

**Deliverable:**
- Signed-off verification checklist
- Sprint 2 Demo recording or live demo for Founder review

---

### 4.3 P1 Tasks (Quality / DX)

##### DEV-023 — API Documentation (OpenAPI)

| Attribute | Value |
|-----------|-------|
| **Priority** | P1 |
| **Depends On** | DEV-007, DEV-009, DEV-012, DEV-015 |
| **Estimated** | S (Small) |
| **Owner** | Platform |
| **Tags** | `documentation` `api` |

**Description:**
FastAPI auto-generates OpenAPI docs. Review and enhance docstrings, add examples, tag endpoints by module. Ensure `/docs` is accessible and usable for frontend development.

**Deliverable:**
- `/docs` (Swagger UI) shows all Sprint 2 endpoints with descriptions
- Each endpoint has example request/response
- Endpoints tagged by module: Identity, Profile, Timeline, Auth

---

##### DEV-024 — Developer Setup Script

| Attribute | Value |
|-----------|-------|
| **Priority** | P1 |
| **Depends On** | DEV-001, DEV-002, DEV-003 |
| **Estimated** | S (Small) |
| **Owner** | Platform |
| **Tags** | `dx` `setup` |

**Description:**
Create a one-command developer setup script (`scripts/setup-dev.sh`) that:
- Installs PostgreSQL (if not present)
- Creates databases
- Runs all migrations
- Seeds test data
- Prints "Ready" with next steps

**Deliverable:**
- `./scripts/setup-dev.sh` sets up a ready-to-develop environment

---

##### DEV-025 — Frontend Component Library Foundation

| Attribute | Value |
|-----------|-------|
| **Priority** | P1 |
| **Depends On** | DEV-005 |
| **Estimated** | S (Small) |
| **Owner** | Store |
| **Tags** | `frontend` `components` |

**Description:**
Establish a minimal shared component library for Store Workbench:
- Button (primary, secondary, danger variants)
- Input (text, with label and error state)
- StatusBadge (color-coded: pending/active/archived)
- LoadingSpinner
- Toast/notification component

**Deliverable:**
- 5 base components with consistent API
- Used in S1–S3 screens

---

## 5. Task Dependency Graph

```
Phase 1: Infrastructure
────────────────────────────────────────────────────────────
DEV-001 (Scaffold)
  ├── DEV-002 (Platform DB)
  ├── DEV-003 (Store DB)
  ├── DEV-004 (CI/CD) [parallel]
  └── DEV-005 (SPA Scaffold)

Phase 2: Platform API
────────────────────────────────────────────────────────────
DEV-002 → DEV-006 (Identity Model)
            └── DEV-007 (Identity API)

DEV-002 → DEV-008 (Profile Model)
  DEV-006 ─┘  └── DEV-009 (Profile API)

DEV-002 → DEV-010 (Timeline Model)
  DEV-006 ─┘  └── DEV-011 (Auto-Append Service)
                └── DEV-012 (Timeline API)

Phase 3: Store DB + Auth
────────────────────────────────────────────────────────────
DEV-003 → DEV-013 (Store Model)
            └── DEV-014 (Staff Model)
                  └── DEV-015 (JWT Auth)
                        └── DEV-016 (Auth Middleware)

Phase 4: Store Workbench Screens
────────────────────────────────────────────────────────────
DEV-005 ─┐
DEV-007 ─┼── DEV-017 (S1: Customer Search/Create)
DEV-016 ─┘

DEV-005 ─┐
DEV-007 ─┤
DEV-009 ─┼── DEV-018 (S2: 健康元 Summary)
DEV-012 ─┤
DEV-016 ─┘

DEV-005 ─┐
DEV-009 ─┼── DEV-019 (S3: Concern Intake)
DEV-016 ─┘

Phase 5: Integration & Testing
────────────────────────────────────────────────────────────
DEV-007 ─┐
DEV-009 ─┤
DEV-012 ─┼── DEV-020 (API Integration Tests)
DEV-015 ─┘

DEV-017 ─┐
DEV-018 ─┼── DEV-021 (E2E Smoke Tests)
DEV-019 ─┘

DEV-020 ─┐
DEV-021 ─┴── DEV-022 (Integration Verification)
```

---

## 6. Dependencies

### 6.1 Upstream Dependencies (Must Be Complete Before Sprint 2)

| # | Dependency | Status | Owner |
|---|-----------|--------|-------|
| D1 | Constitution v1.0 | ✅ Approved | Founder |
| D2 | ARCH-000 Core Architecture | ✅ Approved | Founder |
| D3 | RFC-001 Domain Model | ✅ Approved (via ARCH-000) | Architecture Office |
| D4 | RFC-002 Data Model | ✅ Proposed | Architecture Office |
| D5 | ADR-002 Technical Stack | ✅ Proposed | Architecture Office |
| D6 | PRD-001 MVP Definition | ✅ Approved | Product Office |
| D7 | FD-005 Legacy Freeze | ✅ Active | Founder |
| D8 | M1 Architecture Freeze | ✅ Complete (ARCH-000 Approved) | Architecture Office |

### 6.2 External Dependencies

| # | Dependency | Version/Provider | Required For |
|---|-----------|-----------------|-------------|
| E1 | Python | 3.12+ | All backend |
| E2 | PostgreSQL | 16+ | Platform DB (DEV-002) |
| E3 | Node.js | 20+ | Frontend (DEV-005) |
| E4 | Anthropic API Key | — | Not needed in Sprint 2 (AI starts Sprint 4) |

### 6.3 Downstream Dependents (Sprints That Depend on Sprint 2)

| Sprint | Depends On | What It Needs |
|--------|-----------|--------------|
| Sprint 3 | DEV-007, DEV-009, DEV-012, DEV-013, DEV-014, DEV-016 | Identity API, Profile API, Store DB, Auth — to build F3 (Service), F4 (Feedback), F5 (Follow-Up) |
| Sprint 4 | Sprint 3 + DEV-010, DEV-011 | Timeline entries from Sprint 3 actions — to build F6 (AI Summary) |

---

## 7. Deliverables

### 7.1 Code Deliverables

| # | Deliverable | Format | Owner |
|---|------------|--------|-------|
| 1 | Platform API (FastAPI) | Python package `platform/` | Platform |
| 2 | Store DB (SQLite) | Alembic migrations in `store/` | Store |
| 3 | Shared models & schemas | Python package `shared/` | Platform |
| 4 | Store Workbench SPA | Frontend app `frontend/` | Store |
| 5 | CI/CD workflow | `.github/workflows/ci.yml` | Platform |
| 6 | Test suite | `tests/` (unit + integration + E2E) | Platform + Store |

### 7.2 Running Services

| # | Service | Command | Port |
|---|---------|---------|------|
| 1 | Platform API | `make run-platform` | 8000 |
| 2 | Store Workbench (dev) | `make run-frontend` | 5173 |

### 7.3 Database Artifacts

| # | Database | Tables Created |
|---|----------|---------------|
| 1 | Platform DB (PostgreSQL) | health_identity, health_profile, health_timeline |
| 2 | Store DB (SQLite) | store, staff |

### 7.4 API Endpoints Delivered

| # | Endpoint Family | Count | Module |
|---|----------------|-------|--------|
| 1 | Health Identity | 7 | Platform |
| 2 | Health Profile | 3 | Platform |
| 3 | Health Timeline | 3 | Platform |
| 4 | Auth | 2 | Platform |
| **Total** | | **15** | |

### 7.5 Frontend Screens Delivered

| # | Screen | Route | Key Interaction |
|---|--------|-------|----------------|
| S1 | Customer Search / Create | `/customers` | Search → Create → Navigate to S2 |
| S2 | Customer 健康元 Summary | `/customers/:id` | View → Activate → Navigate to S3 |
| S3 | Health Concern Intake | `/customers/:id/concern` | Category → Description → Save → Back to S2 |

---

## 8. Acceptance Criteria

### 8.1 Sprint 2 Done Criteria

| # | Criterion | Verification |
|---|----------|-------------|
| AC1 | All P0 tasks (DEV-001 through DEV-022) complete | Task checklist |
| AC2 | `make test` passes (unit + integration + E2E) | CI green |
| AC3 | `make lint` passes (ruff, zero errors) | CI green |
| AC4 | Full manual walkthrough: Login → Search → Create Customer → Activate → View Summary → Record Concern → Verify Timeline | Manual test |
| AC5 | All API endpoints return documented responses | OpenAPI `/docs` review |
| AC6 | Store-scoped auth enforced (cross-store access denied) | Test case verified |
| AC7 | No hardcoded secrets in repository | Code review |
| AC8 | Database migrations run cleanly on fresh environment | `setup-dev.sh` verified |

### 8.2 Sprint 2 Do-Not-Close Criteria

| # | Condition (any one blocks Sprint 2 closure) |
|---|---------------------------------------------|
| NS1 | Any P0 task incomplete or untested |
| NS2 | Staff auth bypassable (security regression) |
| NS3 | Customer data from Store A visible to Store B |
| NS4 | Health Timeline entries can be modified or deleted |
| NS5 | CI pipeline not passing on main branch |

---

## 9. Risks

| # | Risk | Severity | Likelihood | Mitigation |
|---|------|----------|------------|------------|
| R1 | Frontend framework indecision (React vs Vue per ADR-002) delays DEV-005 start | Medium | Medium | Decide in Sprint 2 kickoff; if no consensus, default to React (larger ecosystem, more AI tooling support) |
| R2 | PostgreSQL setup friction for developers (local install vs Docker) | Low | Medium | Provide `setup-dev.sh` script (DEV-024); document Homebrew install for macOS |
| R3 | JWT auth co-location complexity — Staff table in Store DB (SQLite), auth logic in Platform API | Medium | Medium | Platform reads Store DB path from config; for MVP single-store this is a known trade-off; document in ADR if needed |
| R4 | Timeline JSONB approach hits query performance issues at scale | Low | Low | MVP with single-store, <100 entries per customer; JSONB is adequate; migration path to sub-table defined in RFC-002 Q3 |
| R5 | Store Workbench screen design doesn't match real store workflow — Staff find it confusing | Medium | Medium | Involve real Staff early (show mockup before DEV-017); iterate based on feedback |
| R6 | Scope creep — temptation to start F3 (Service Session) or F6 (AI Summary) before Sprint 2 is solid | High | Medium | Strict Sprint boundary; F3/F4/F5 wait for Sprint 3; AI wait for Sprint 4 |
| R7 | Test environment setup for E2E (Playwright + API + DB) is brittle | Medium | Medium | DEV-021 uses seeded test data; ensure tests are independent and idempotent |

---

## 10. Team & Capacity

### 10.1 Owner Assignment Summary

| Owner | P0 Tasks | P1 Tasks | Total | Primary Responsibility |
|-------|---------|---------|-------|----------------------|
| **Platform** | 12 | 2 | 14 | Platform API, Identity, Profile, Timeline, Auth, CI/CD, Project scaffold |
| **Store** | 10 | 1 | 11 | Store DB, Staff model, Store Workbench SPA, Screens S1–S3, E2E tests |
| **AI** | 0 | 0 | 0 | No AI development in Sprint 2 (starts Sprint 4) |

### 10.2 Effort Summary

| Size | Count | Tasks |
|------|-------|-------|
| S (Small) | 11 | DEV-003, DEV-004, DEV-009, DEV-011, DEV-012, DEV-013, DEV-014, DEV-016, DEV-022, DEV-023, DEV-024, DEV-025 |
| M (Medium) | 9 | DEV-001, DEV-002, DEV-005, DEV-006, DEV-007, DEV-008, DEV-010, DEV-015, DEV-020, DEV-021 |
| L (Large) | 3 | DEV-017, DEV-018, DEV-019 |
| **Total Estimates** | | ~11S + ~9M + ~3L ≈ **3–4 weeks** for 1–2 developers |

---

## 11. Out of Scope

The following are **explicitly excluded** from Sprint 2. Reference: PRD-001 §5 (P1), §6 (Out of Scope), ADR-002 Deferred items.

### 11.1 Deferred to Sprint 3

| Item | Feature ID | Reason |
|------|-----------|--------|
| Service Session Recording | F3 | Manual loop — needs Identity + Profile foundation first |
| Customer Feedback Capture | F4 | Depends on Service Session |
| Follow-Up Task Management | F5 | Depends on Service + Feedback |
| Screens S4–S6 | F9 | Service Record, Feedback Record, Follow-Up Task screens |

### 11.2 Deferred to Sprint 4

| Item | Feature ID | Reason |
|------|-----------|--------|
| AI Summary (Service + Follow-Up) | F6 | AI integration starts Sprint 4 |
| Knowledge Entry Management | F11 | P1, Sprint 4 |
| Dashboard / Today's Tasks | F13 | P1, Sprint 4 |
| Screen S7 (AI Summary Panel) | F9 | AI integration |

### 11.3 Deferred to Sprint 5

| Item | Feature ID | Reason |
|------|-----------|--------|
| Customer PWA | F10 | P1, Sprint 5 |
| Upload Asset | F12 | P1, Sprint 5 |
| Operator Review Screen | F14, S8 | P1, Sprint 5 |

### 11.4 Deferred Post-MVP

| Item | Source | Reason |
|------|--------|--------|
| 微信小程序 | ADR-002 §3.3 | Platform dependency; PWA first |
| 原生 App | ADR-002 §3.3 | PWA sufficient for MVP |
| Vector Store (pgvector/Pinecone) | ADR-002 §3.4 | Premature optimization |
| Docker deployment | ADR-002 §3.6 | Added complexity; manual deploy first |
| Object Storage (S3/MinIO) | ADR-002 §3.5 | Local FS sufficient for MVP |
| 多店 SaaS | PRD-001 §6 | Single-store MVP |
| 支付系统 | PRD-001 §6 | Non-MVP |
| Full RAG + LangChain | ADR-002 §3.4 | Overweight for MVP |

---

## 12. Sprint Cadence

| Phase | Week | Focus | Key Deliverables |
|-------|------|-------|-----------------|
| Phase 1 | Week 1 | Infrastructure | DEV-001–005: Scaffold, DBs, CI/CD, SPA shell |
| Phase 2 | Week 1–2 | Platform API | DEV-006–012: Identity, Profile, Timeline APIs |
| Phase 3 | Week 2 | Store DB + Auth | DEV-013–016: Store, Staff, JWT Auth |
| Phase 4 | Week 2–3 | Store Workbench | DEV-017–019: Screens S1, S2, S3 |
| Phase 5 | Week 3 | Testing & Verify | DEV-020–022: Integration tests, E2E, verification |
| Buffer | Week 3 | Polish & P1 | DEV-023–025: Docs, DX, components |

---

## 13. Next Steps After Sprint 2

1. **Sprint 2 Demo** — Present to Founder: Login → Search → Create → Activate → Summary → Concern Intake
2. **Sprint 2 Retrospective** — What worked, what didn't; inform Sprint 3 planning
3. **Sprint 3 Kickoff** — Manual Loop: F3 (Service), F4 (Feedback), F5 (Follow-Up), Screens S4–S6
4. **Begin Sprint 3 Planning** — `docs/release/SPRINT-003-PLAN.md`

---

## 14. Compliance Check

| Source | Requirement | Status |
|--------|------------|--------|
| Constitution §12 | MVP 完成第一闭环 | ✅ Sprint 2 完成闭环 Entry 段 (查找/创建→激活→健康关注) |
| Constitution §7.2 | Modular Design | ✅ Platform API / Store DB 分离 |
| Constitution §7.3 | Domain Driven | ✅ 所有模型从 RFC-001 领域对象导出 |
| Constitution §7.4 | Local First | ✅ Store DB (SQLite) 每店独立 |
| Constitution §5.4 | AI Capability Based | ✅ Sprint 2 不涉及 AI；AI 从 Sprint 4 开始通过 Capability 调用 |
| ARCH-000 §13 | Implementation Gate | ✅ 不引入新领域对象；仅实现 RFC-001 的 14 个对象中的 5 个 (Identity, Profile, Timeline, Store, Staff) |
| RFC-002 §8 | Persistence Boundary | ✅ Platform DB (PostgreSQL) 存 Identity/Profile/Timeline；Store DB (SQLite) 存 Store/Staff |
| ADR-002 §3.1 | Python / FastAPI | ✅ Platform API 使用 FastAPI + Uvicorn |
| ADR-002 §3.2 | SQLite + PostgreSQL | ✅ Store DB = SQLite, Platform DB = PostgreSQL |
| ADR-002 §3.6 | No Docker (MVP) | ✅ 本地开发不依赖 Docker |
| FD-005 | Legacy Freeze | ✅ 不参考 Legacy 代码/配置/schema |
| PRD-001 §8 | Sprint 2 = Foundation | ✅ F1 + F2 + F7 + F8 + F9(S1–S3) |

---

## 15. End of Document

SPRINT-002-PLAN defines the development plan for Health One Sprint 2 (Foundation).

All tasks are derived from approved architecture (ARCH-000), domain model (RFC-001), data model (RFC-002), technical stack (ADR-002), and product definition (PRD-001).

This plan must be reviewed and approved before implementation begins. No task outside this plan may enter Sprint 2 without a change request and plan revision.
