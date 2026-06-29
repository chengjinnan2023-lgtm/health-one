# QA-BATCH-001 — Infrastructure Architecture Review

Document ID : QA-BATCH-001
Title       : Sprint-002 Phase 1 Infrastructure — Architecture Review
Version     : 1.0
Status      : Complete
Owner       : QA / Architecture Office
Created     : 2026-06-29
Reviewed    : DEV-001, DEV-002, DEV-003, DEV-004, DEV-005
Depends On  : Constitution v1.0, ARCH-000 (Approved), RFC-001, RFC-002, ADR-002, PRD-001, SPRINT-002-PLAN

---

## 1. Executive Summary

**Review Scope:** All files created by DEV-001 through DEV-005 (49 source files across Python backend, TypeScript frontend, CI/CD, and configuration).

**Review Result:**

| Category | Count |
|----------|-------|
| MUST FIX | 2 |
| WARNING | 4 |
| Architecture Debt | 5 |
| PASS | 16 |

**Decision：APPROVE Batch-2**

All MUST FIX items are code hygiene issues (dynamic import, duplicate dependency) — not architecture violations. They can be fixed in a single commit before DEV-006 starts. No blocking architecture defects found.

---

## 2. PASS

Items that comply with architecture requirements.

### 2.1 Directory Structure Matches ARCH-000 Module Boundary

| Requirement | Source | Evidence |
|------------|--------|----------|
| Three-layer module separation | ARCH-000 §2.2 | `health_one/platform/`, `health_one/store/`, `health_one/shared/` — three Python sub-packages match Platform / Store Local / Shared boundary |
| Frontend independent | ARCH-000 §7.3 | `frontend/` is a separate Vite project, not embedded in Python backend |
| Tests at project root | Convention | `tests/` at repo root, can import from all three modules |
| CI/CD in `.github/` | ADR-002 §3.8 | `.github/workflows/ci.yml` — GitHub Actions |

### 2.2 Database Separation Matches RFC-002 Persistence Boundary

| Requirement | Source | Evidence |
|------------|--------|----------|
| Platform DB = PostgreSQL | RFC-002 §8.1, ADR-002 §3.2 | `platform/database.py` — asyncpg engine, PostgreSQL UUID type |
| Store DB = SQLite | RFC-002 §8.1, ADR-002 §3.2 | `store/database.py` — aiosqlite engine |
| Separate Alembic configs | RFC-002 §8.2 | `platform/alembic/` and `store/alembic/` — independent migration histories |
| WAL mode enabled | Best practice | `store/database.py:38` — `PRAGMA journal_mode=WAL` |
| Foreign keys enforced | Best practice | `store/database.py:39` — `PRAGMA foreign_keys=ON` |

### 2.3 Platform / Store Isolation Enforced

| Check | Result |
|-------|--------|
| `platform/` imports from `store/`? | No direct import |
| `store/` imports from `platform/`? | No direct import |
| Both import from `shared/`? | Not yet (shared/ is empty) |
| Separate `Base` declarative bases | Yes — Platform `Base` uses PostgreSQL types; Store `Base` is plain SQLite-compatible |

### 2.4 Tech Stack Compliance

| Requirement | Source | Evidence |
|------------|--------|----------|
| Python 3.12+ | ADR-002 §3.1 | `pyproject.toml: requires-python = ">=3.12"` |
| FastAPI | ADR-002 §3.1 | `platform/main.py` — FastAPI app with lifespan |
| Uvicorn | ADR-002 §3.1 | `Makefile:25` — `uvicorn health_one.platform.main:app` |
| Pydantic v2 | ADR-002 §3.1 | `requirements.txt:16` — `pydantic>=2.10.0` |
| SQLAlchemy async | ADR-002 §3.2 | Both `platform/database.py` and `store/database.py` use `AsyncSession` |
| pytest | ADR-002 §3.7 | `tests/test_health.py` — pytest + httpx ASGITransport |
| Playwright | ADR-002 §3.7 | `frontend/playwright.config.ts` + `frontend/e2e/smoke.spec.ts` |
| GitHub Actions | ADR-002 §3.8 | `.github/workflows/ci.yml` — lint + test on push/PR |
| ruff | ADR-002 §3.8 | `pyproject.toml: [tool.ruff]` |
| JWT (python-jose) | ADR-002 §3.1 | `requirements.txt:19` |

### 2.5 Frontend Architecture

| Check | Result |
|-------|--------|
| SPA routing covers S1–S3 screens | `App.tsx` — `/customers`, `/customers/:id`, `/customers/:id/concern` |
| Protected routes enforce auth | `ProtectedRoute` wrapper redirects to `/login` |
| JWT token in API client | `client.ts:19` — `Authorization: Bearer ${token}` |
| 401 auto-logout | `client.ts:28-30` — clear token + redirect |
| Vite proxy to Platform API | `vite.config.ts` — `/api` → `localhost:8000` |
| Playwright smoke test | `e2e/smoke.spec.ts` — login screen visibility + redirect |
| `data-testid` attributes | LoginScreen uses `username-input`, `password-input`, `login-button` — good E2E hygiene |

### 2.6 CI/CD

| Check | Result |
|-------|--------|
| Lint job (ruff) | `ci.yml:9-15` — astral-sh/ruff-action@v3 |
| Test job (pytest) | `ci.yml:17-53` — pytest with PostgreSQL service container |
| Coverage gate | `ci.yml:53` — `--cov-fail-under=70` |
| DB migrations in CI | `ci.yml:48-51` — both Platform and Store migrations run before tests |
| PR gate | `ci.yml:5-7` — triggers on `pull_request: branches: [main]` |

### 2.7 Lazy Engine Init Pattern

| Check | Result |
|-------|--------|
| Module importable without DB running | Yes — `_get_engine()` defers `create_async_engine` until first use |
| Test suite runs without PostgreSQL | Yes — health test passes (doesn't hit DB) |
| Health check handles DB down gracefully | `check_db_connection()` returns `{"platform_db": "error", "detail": ...}` — doesn't crash |

---

## 3. MUST FIX

Items that must be fixed before DEV-006 starts.

### MF-001: Dynamic `__import__` in store/database.py

| Attribute | Value |
|-----------|-------|
| **Severity** | Low — code hygiene |
| **File** | `health_one/store/database.py:67` |
| **Finding** | `__import__("sqlalchemy").text("SELECT 1")` — dynamic import at call site |
| **Why wrong** | (a) Unnecessary dynamic import — `sqlalchemy` is already imported at module level via `from sqlalchemy import event` on line 7. (b) `text()` is available as `sqlalchemy.text` — no need to re-import. (c) Style inconsistency — nowhere else in the codebase uses `__import__`. |
| **Fix** | Replace with `from sqlalchemy import text` at module top, then use `text("SELECT 1")` at line 67. |

```python
# Before (line 6-7):
from sqlalchemy import event
...
await conn.execute(__import__("sqlalchemy").text("SELECT 1"))

# After (line 6):
from sqlalchemy import event, text
...
await conn.execute(text("SELECT 1"))
```

### MF-002: Duplicate `httpx` in requirements.txt

| Attribute | Value |
|-----------|-------|
| **Severity** | Low — dependency hygiene |
| **File** | `requirements.txt:23,28` |
| **Finding** | `httpx>=0.28.0` listed twice — once under "HTTP Client" (line 23) and once under "Testing" (line 28) |
| **Why wrong** | Duplicate entries can cause confusion about which version constraint applies. pip resolves to the same version, but it's noise. |
| **Fix** | Remove line 28 (`httpx>=0.28.0             # TestClient for FastAPI`). Keep line 23. Add `# (also used by FastAPI TestClient)` comment on line 23. |

---

## 4. WARNING

Items that are acceptable for Sprint 2 but require explicit acknowledgment and tracking.

### W-001: PlatformSettings contains STORE_DB_BASE_PATH

| Attribute | Value |
|-----------|-------|
| **Severity** | Medium — boundary concern |
| **File** | `health_one/platform/config.py:22` |
| **Finding** | `STORE_DB_BASE_PATH: str = os.getenv("STORE_DB_BASE_PATH", "data")` — Platform configuration knows the filesystem layout of Store DB. |
| **Why concerning** | ARCH-000 §5.3 + RFC-002 §8.2: Platform should not directly access Store DB. However, DEV-015 (JWT Auth) requires Platform API to query Staff credentials from Store DB for login verification. This is an intentional trade-off documented in SPRINT-002-PLAN §9 Risk R3. |
| **Verdict** | ACCEPTED for Sprint 2. **Must be revisited in Sprint 3** when Store Service becomes independently runnable. Future target: Auth service runs as part of Store service, or Platform queries Store via API (not direct DB). |
| **Tracking** | Add `# HACK(sprint-2): Platform reads Store DB for auth. Remove when Store API is available.` comment in config.py. |

### W-002: UUIDMixin column name `id` conflicts with RFC-002 naming convention

| Attribute | Value |
|-----------|-------|
| **Severity** | Medium — naming alignment |
| **File** | `health_one/platform/database.py:81-85` |
| **Finding** | `UUIDMixin` defines PK column as `id`. RFC-002 defines every entity PK with a domain-specific name: `identity_id`, `profile_id`, `timeline_id`, `store_id`, `staff_id`, etc. |
| **Why concerning** | If DEV-006 (Health Identity model) inherits `UUIDMixin`, the PK column will be `id` instead of `identity_id`. This creates a mismatch between: (a) the RFC-002 documented schema, (b) the Pydantic response schema (which may expose `identity_id`), and (c) the actual database column name. |
| **Verdict** | ACCEPTED with condition. **Each model must explicitly name its PK column** to match RFC-002. The `UUIDMixin` is a convenience for common UUID generation logic but should not dictate column naming. Two paths: (a) Don't use UUIDMixin — each model defines its own `*_id` column directly, or (b) Make UUIDMixin's column name configurable via `__abstract__` + `@declared_attr`. |
| **Tracking** | Decision needed in DEV-006 kickoff. |

### W-003: shared/ module has no database access layer

| Attribute | Value |
|-----------|-------|
| **Severity** | Medium — upcoming Sprint 2 work |
| **File** | `health_one/shared/` (currently empty except `__init__.py` and `models/__init__.py`) |
| **Finding** | Shared entities (Health Profile, Health Timeline, etc.) are stored in Platform DB (RFC-002 §8.1). But `shared/` has no `database.py`, no session factory, no Base class. |
| **Why concerning** | DEV-008 (Health Profile model) and DEV-010 (Health Timeline model) are the next tasks. They need to create SQLAlchemy models. Which `Base` do they inherit from? Platform's `Base` (with PostgreSQL UUID type)? Their own? This decision should be made before DEV-008. |
| **Verdict** | Shared models should use `health_one.platform.database.Base` since they reside in Platform DB. OR, extract a common `Base` that both `platform/database.py` and shared models use. **Decide in DEV-008 kickoff.** |

### W-004: Makefile `run-store` is a no-op

| Attribute | Value |
|-----------|-------|
| **Severity** | Low — documentation |
| **File** | `Makefile:28-29` |
| **Finding** | `run-store: @echo "Store service not implemented yet (Sprint 3+)"` — no runnable Store service. |
| **Why concerning** | Store DB exists (SQLite + Alembic) and has a `database.py` module. But there's no FastAPI app for Store. This is correct for Sprint 2 scope (DEV-015 auth runs inside Platform), but the Makefile implies existence of a separate Store service. |
| **Verdict** | ACCEPTED. Store service becomes runnable in Sprint 3 when Service Session API is built. Remove the no-op target or keep as placeholder. |

---

## 5. Architecture Debt

Items that are acceptable now but will need refactoring before or during post-MVP.

### AD-001: No File Store Abstraction

| Attribute | Value |
|-----------|-------|
| **Source** | ADR-002 §3.5 |
| **Finding** | ADR-002 specifies: "FileStore interface abstraction should still be reserved — future migration cost is low." No `FileStore` interface or `LocalFileStore` implementation exists. |
| **When to fix** | Before DEV-012 (Upload Asset) — Sprint 5 or earlier if Upload Asset is accelerated. |
| **Risk** | If Upload Asset implementation starts without the abstraction, migration to S3 later will require rewriting file access code. |
| **Recommendation** | Create `health_one/shared/storage.py` with `class FileStore(ABC)` and `class LocalFileStore(FileStore)` as a P1 task in Sprint 3 or 4. |

### AD-002: Global Lazy-Init Engine Pattern

| Attribute | Value |
|-----------|-------|
| **Source** | Code review |
| **Finding** | Both `platform/database.py` and `store/database.py` use module-level globals (`_engine`, `_session_factory`) with lazy initialization. This pattern: (a) is not thread-safe if used in multi-threaded context (acceptable for asyncio), (b) makes it hard to have multiple engine instances (e.g., multiple Store DBs in one process), (c) complicates testing — can't easily swap engines. |
| **When to fix** | Post-MVP when multi-store or multi-process deployment is needed. |
| **Risk** | Low for MVP — single process, single store. |
| **Recommendation** | Add a `# NOTE(mvp)` comment documenting the trade-off. Consider a factory pattern or dependency injection in Sprint 3+. |

### AD-003: No Token Refresh in Frontend API Client

| Attribute | Value |
|-----------|-------|
| **Source** | Code review |
| **Finding** | `frontend/src/api/client.ts` — JWT token expires after 8 hours. On 401, the client clears the token and redirects to `/login`. There's no refresh token mechanism. |
| **When to fix** | Sprint 3 or 4 if 8-hour sessions prove disruptive for staff workflow. |
| **Risk** | Low — 8 hours covers a full work shift. Staff re-login once per day is acceptable for MVP. |
| **Recommendation** | Track staff feedback during Sprint 2–3 testing. If re-login is a friction point, add refresh token in Sprint 4. |

### AD-004: Store DB Models Lack Standard Mixins

| Attribute | Value |
|-----------|-------|
| **Source** | Code review |
| **Finding** | `platform/database.py` provides `UUIDMixin` and `TimestampMixin`. `store/database.py` provides `utcnow()` but no mixins. Store models (Store, Staff, Device, MemberEntitlement) will need UUID PKs (as String(36) for SQLite) and timestamps — but no reusable mixins exist for SQLite-compatible types. |
| **When to fix** | Before DEV-013 (Store model) — Sprint 2 Phase 3. |
| **Risk** | Medium — DEV-013 will need to implement Store model. Without mixins, the model will either duplicate code or import from Platform (bad). |
| **Recommendation** | Create `store/database.py` mixins for SQLite: `StoreUUIDMixin` (String(36) PK) and `StoreTimestampMixin` (DateTime without timezone). |

### AD-005: CI Runs Both DB Migrations But Only Platform DB Is Used in Tests

| Attribute | Value |
|-----------|-------|
| **Source** | Code review |
| **Finding** | `.github/workflows/ci.yml:48-51` runs both Platform and Store DB migrations. But the test suite (`tests/`) currently only tests the health endpoint. Store DB is migrated but never queried in tests. |
| **When to fix** | Sprint 2 Phase 3 (DEV-013 onward) when Store models exist. |
| **Risk** | Low — migration success proves SQLite connectivity. But it doesn't prove the schema is correct (no model tests). |
| **Recommendation** | Accept for now. Add Store DB model tests in DEV-013. |

---

## 6. Compliance Matrix

| Source | Requirement | Status |
|--------|------------|--------|
| Constitution §7.2 | Modular Design | ✅ Platform / Store / Shared packages separated |
| Constitution §7.4 | Local First | ✅ Store DB per store (SQLite); Store owns local data |
| ARCH-000 §5.3 | Data Ownership 3D | ✅ Platform DB ≠ Store DB; no cross-DB FK |
| ARCH-000 §13 | Implementation Gate — no new domain objects | ✅ Only infrastructure; no domain entities created yet |
| RFC-001 §5 | Platform / Store Local / Shared modules | ✅ Three Python sub-packages |
| RFC-002 §8.1 | Platform DB / Store DB / File Store | ✅ Platform (PostgreSQL) + Store (SQLite) implemented; File Store deferred (AD-001) |
| RFC-002 §8.2 | Cross-Boundary Access Rules | ⚠️ Platform config knows Store DB path (W-001, intentional for MVP auth) |
| ADR-002 §3.1 | Python / FastAPI | ✅ |
| ADR-002 §3.2 | SQLite (Store) + PostgreSQL (Platform) | ✅ |
| ADR-002 §3.3 | Web SPA (React or Vue) | ✅ React + TypeScript + Vite |
| ADR-002 §3.4 | No Vector Store | ✅ Not introduced |
| ADR-002 §3.5 | Local File Storage | ⚠️ No FileStore abstraction yet (AD-001) |
| ADR-002 §3.6 | No Docker | ✅ |
| ADR-002 §3.7 | pytest + Playwright | ✅ |
| ADR-002 §3.8 | GitHub Actions | ✅ |
| FD-005 | Legacy Freeze | ✅ No legacy code referenced |

---

## 7. Naming Consistency Audit

| Concept | RFC-002 Name | Code Name | Consistent? |
|---------|-------------|-----------|-------------|
| Package namespace | — | `health_one` (snake_case) | ✅ Python convention |
| Platform module | Platform | `platform/` | ✅ |
| Store module | Store Local | `store/` | ✅ |
| Shared module | Shared | `shared/` | ✅ |
| Health Identity PK | `identity_id` | `UUIDMixin.id` | ❌ See W-002 |
| Platform config class | — | `PlatformSettings` | ✅ Clear, descriptive |
| Store config class | — | `StoreSettings` | ✅ Clear, descriptive |
| DB session dependency | — | `get_db()` (both modules) | ⚠️ Same function name in two modules — could cause confusion when both are imported |
| API client | — | `api` (lowercase) | ✅ Frontend convention |
| Auth context | — | `AuthContext` / `useAuth` | ✅ React convention |
| Screen components | S1/S2/S3 | `CustomerSearchScreen`, `CustomerSummaryScreen`, `ConcernIntakeScreen` | ✅ Matches SPRINT-002-PLAN + PRODUCT-003 |

---

## 8. Dependency Direction Check

```
health_one/platform/ ──imports──▶ health_one/platform/config.py     ✅ internal
health_one/platform/ ──imports──▶ health_one/platform/database.py   ✅ internal
health_one/store/    ──imports──▶ health_one/store/config.py        ✅ internal
health_one/store/    ──imports──▶ health_one/store/database.py      ✅ internal
health_one/platform/ ──imports──▶ health_one/store/                 ✅ NO — clean
health_one/store/    ──imports──▶ health_one/platform/              ✅ NO — clean
health_one/shared/   ──imports──▶ health_one/platform/              Not yet
health_one/shared/   ──imports──▶ health_one/store/                 Not yet
frontend/            ──imports──▶ health_one/ (Python)              ✅ NO — separate runtime
```

**No cross-module import violations found.**

---

## 9. File Count & Structure

```
health-one/
├── health_one/                    # Python namespace package
│   ├── __init__.py
│   ├── platform/                  # Platform API (ARCH-000 Platform module)
│   │   ├── __init__.py
│   │   ├── config.py              # PlatformSettings
│   │   ├── database.py            # PostgreSQL engine + Base + Mixins
│   │   ├── main.py                # FastAPI app (+ /health, /health/db)
│   │   └── alembic/               # Platform DB migrations
│   ├── store/                     # Store Services (ARCH-000 Store Local module)
│   │   ├── __init__.py
│   │   ├── config.py              # StoreSettings
│   │   ├── database.py            # SQLite engine + Base
│   │   └── alembic/               # Store DB migrations
│   └── shared/                    # Shared domain (ARCH-000 Shared module)
│       ├── __init__.py
│       └── models/
│           └── __init__.py        # Empty — placeholder
├── frontend/                      # Store Workbench SPA (React + TypeScript)
│   ├── src/
│   │   ├── api/client.ts          # API client + JWT + typed interfaces
│   │   ├── auth/AuthContext.tsx    # Auth state management
│   │   ├── layouts/BaseLayout.tsx  # Shell layout
│   │   └── screens/
│   │       ├── LoginScreen.tsx     # Login page
│   │       └── PlaceholderScreens.tsx  # S1/S2/S3 placeholders
│   ├── e2e/smoke.spec.ts          # Playwright smoke test
│   └── playwright.config.ts       # Playwright config
├── tests/                         # Python test suite
│   ├── conftest.py
│   └── test_health.py
├── data/                          # Runtime data (SQLite files, uploads)
│   └── store-001/
│       └── store.db               # Store DB (generated)
├── .github/workflows/ci.yml       # CI/CD pipeline
├── requirements.txt
├── pyproject.toml
├── Makefile
└── .env.example
```

**Assessment:** Structure is clean, predictable, and maps directly to ARCH-000 module boundaries. No orphaned or misplaced files.

---

## 10. Recommendation

### Verdict: ✅ APPROVE Batch-2

No blocking architecture defects found. The two MUST FIX items (MF-001, MF-002) are code hygiene issues — fixable in a single commit before DEV-006 starts.

### Pre-Batch-2 Checklist

Before DEV-006 (Health Identity Model) begins:

- [x] ARCH-000 module boundaries respected — Platform / Store / Shared separated
- [x] RFC-002 persistence boundary implemented — PostgreSQL + SQLite
- [x] ADR-002 tech stack verified — FastAPI, SQLAlchemy, pytest, Playwright, GitHub Actions
- [ ] MF-001 fixed: `__import__` → `from sqlalchemy import text`
- [ ] MF-002 fixed: remove duplicate `httpx` from requirements.txt
- [ ] W-002 resolved: Decide UUID column naming strategy for DEV-006 models
- [ ] W-003 resolved: Decide shared/ database access pattern for DEV-008/DEV-010
- [ ] AD-004 addressed: Create SQLite-compatible mixins before DEV-013

### Next QA Gate

QA-BATCH-002 will review DEV-006 through DEV-012 (Platform API: Identity, Profile, Timeline models + endpoints). Key checks:
- Model column names match RFC-002 entity field names
- Timeline append-only constraint enforced
- API endpoints match SPRINT-002-PLAN endpoint specifications
- Pydantic schemas exclude internal fields (password_hash, etc.)

---

## 11. End of Document

QA-BATCH-001 completes the architecture review of Sprint-002 Phase 1 infrastructure (DEV-001 through DEV-005).

**Decision: APPROVE Batch-2.**
