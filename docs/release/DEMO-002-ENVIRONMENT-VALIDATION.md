# DEMO-002 — v0.2.0 Environment Completion & Full E2E Validation

Document ID : DEMO-002
Title       : v0.2.0 Sprint-2.1 — Environment Completion & End-to-End Validation
Version     : 1.0
Status      : Complete
Owner       : Release Office
Created     : 2026-06-30
Target      : DEV-026, DEV-027, DEV-028

---

## 1. Fixed Items

### DEV-026: PostgreSQL Environment Setup

| Step | Result |
|------|--------|
| PostgreSQL 16 installed (Homebrew) | ✅ `/opt/homebrew/opt/postgresql@16` |
| Service started | ✅ `brew services start postgresql@16` |
| Database `health_one_platform` created | ✅ |
| Migration `001_create_core_tables` applied | ✅ 3 tables + alembic_version |
| Identity API verified | ✅ `POST /api/identities/` → 201 Created |

**Bug found and fixed during setup:** Migration enum creation used `create_type=True` + explicit `.create()` causing `DuplicateObjectError` on re-run. Fixed by setting `create_type=False`.

**Bug found and fixed during setup:** Python `str` enum member names ("PENDING") mismatched PostgreSQL enum values ("pending"). Fixed by adding `values_callable=lambda obj: [e.value for e in obj]` to `Enum()` column definitions in `health_one/platform/models/identity.py`.

### DEV-027: Health Endpoint Improvement

| Before | After |
|--------|-------|
| `GET /health/db` returns 200 even when DB is down | `GET /health/db` returns **503** when DB is unavailable |
| `{"status":"ok","platform_db":"error","detail":"..."}` | `HTTPException(status_code=503, detail=db_status)` |
| File: `health_one/platform/main.py:41-46` | Added `HTTPException` import + conditional check |

### DEV-028: Version Synchronization

| Component | Before | After |
|-----------|--------|-------|
| `VERSION.md` | v0.2.0 ✅ | v0.2.0 (unchanged) |
| `platform/config.py` APP_VERSION | "0.1.0" ❌ | **"0.2.0"** ✅ |
| `frontend/package.json` version | "0.0.0" ❌ | **"0.2.0"** ✅ |
| OpenAPI `/health` version | "0.1.0" ❌ | **"0.2.0"** ✅ (from config) |

---

## 2. Full E2E Validation

### Environment

| Item | Value |
|------|-------|
| PostgreSQL | ✅ Running — localhost:5432 |
| Platform DB URL | `postgresql+asyncpg://localhost/health_one_platform` |
| Store DB | `data/store-001/store.db` (SQLite, seeded) |
| API | `uvicorn health_one.platform.main:app --port 8000` |

### Step-by-Step Results

#### Step 1: Login — PASS ✅

```
POST /api/auth/login → 200
Token: eyJhbGciOiJIUzI1NiIs...
Staff: 店长 (store: aaa91dd7...)
```

#### Step 2: Create Health Identity — PASS ✅

```
POST /api/identities/ → 201 Created
Identity: 1ab7ffc9-44c5-4d86-aa19-083753d5f1b9
Status: pending
```

#### Step 3: Activate Health Identity — PASS ✅

```
POST /api/identities/{id}/activate → 200 OK
Status: active
activated_at: 2026-06-30T00:59:20
```

#### Step 4: Create Health Profile — PASS ✅

```
PUT /api/identities/{id}/profile → 200 OK
Profile: 9023a9da...
Primary Concern: 肩颈 — 长期低头工作导致颈椎不适
Basic Info: {"birth_year": "1990", "gender": "male"}
```

#### Step 5: Read Timeline — PASS ✅

```
GET /api/identities/{id}/timeline?limit=10 → 200 OK
3 entries:

[profile_updated] Health Profile created — primary concern: 肩颈...
[identity_activated] 健康元 activated: Demo Customer
[identity_created] 健康元 created: Demo Customer
```

✅ Entries are in reverse chronological order (newest first).
✅ All three auto-append triggers fired correctly (create → activate → profile).
✅ Timeline is append-only — no duplicate or modified entries.

#### Step 6: Search — PASS ✅

```
GET /api/identities/?q=Demo → 200 OK
Found 1 result:
  Demo Customer (active)
```

#### Step 7: Version Verification — PASS ✅

```
GET /health → {"version":"0.2.0"}  ✅
GET /health/db → {"platform_db":"ok"} ← would be 503 if down ✅
```

### Validation Checklist

| # | Step | API Call | Status | HTTP |
|---|------|---------|--------|------|
| 1 | Login | POST /api/auth/login | ✅ | 200 |
| 2 | Create Identity | POST /api/identities/ | ✅ | 201 |
| 3 | Activate | POST /api/identities/{id}/activate | ✅ | 200 |
| 4 | Create Profile | PUT /api/identities/{id}/profile | ✅ | 200 |
| 5 | Read Timeline | GET /api/identities/{id}/timeline | ✅ | 200 |
| 6 | Search | GET /api/identities/?q= | ✅ | 200 |
| 7 | Health | GET /health | ✅ | 200 |
| 8 | DB Health | GET /health/db | ✅ | 200 |
| 9 | Version | — | ✅ | v0.2.0 |
| 10 | Lint | ruff check | ✅ | All passed |

---

## 3. Bugs Found During Validation

### B-004: Migration Enum Double-Create (FIXED)

| Attribute | Value |
|-----------|-------|
| **Severity** | High — blocks migration |
| **Root Cause** | `create_type=True` in `ENUM()` + explicit `.create()` caused `DuplicateObjectError` |
| **Fix** | Set `create_type=False` in migration `001_create_core_tables.py` |

### B-005: Python Enum Name/Value Mismatch with PostgreSQL (FIXED)

| Attribute | Value |
|-----------|-------|
| **Severity** | Critical — blocks all INSERT operations |
| **Root Cause** | SQLAlchemy native PostgreSQL `Enum` sends Python enum `.name` ("PENDING") instead of `.value` ("pending"). PostgreSQL rejects it. |
| **Fix** | Add `values_callable=lambda obj: [e.value for e in obj]` to `Enum()` column definitions in `HealthIdentity` model |

---

## 4. Updated Bug Summary (Across DEMO-001 + DEMO-002)

| ID | Severity | Description | Status |
|----|----------|------------|--------|
| B-001 | Critical | PostgreSQL unavailable | ✅ RESOLVED — installed + configured |
| B-002 | Low | API version mismatch (0.1.0 vs 0.2.0) | ✅ RESOLVED — config.py + package.json synced |
| B-003 | Low | /health/db returns 200 when DB is down | ✅ RESOLVED — now returns 503 |
| B-004 | High | Migration enum double-create | ✅ RESOLVED — create_type=False |
| B-005 | Critical | Python enum name/value mismatch | ✅ RESOLVED — values_callable added |
| **Total** | | | **5 found, 5 fixed** |

---

## 5. Files Modified in DEV-BATCH-005

| File | Change |
|------|--------|
| `health_one/platform/main.py` | `/health/db` returns 503 on DB error; added HTTPException import |
| `health_one/platform/config.py` | APP_VERSION: "0.1.0" → "0.2.0" |
| `health_one/platform/models/identity.py` | Added `values_callable` to both `Enum()` columns |
| `health_one/platform/alembic/versions/001_create_core_tables.py` | `create_type=True` → `create_type=False` |
| `frontend/package.json` | version: "0.0.0" → "0.2.0" |

---

## 6. Conclusion

### Validation Result

```
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   ✅  P A S S                                          ║
║                                                       ║
║   v0.2.0 passes full end-to-end validation.            ║
║                                                       ║
║   All 10 validation steps pass.                        ║
║   All 5 bugs from DEMO-001/002 resolved.               ║
║   Version unified to 0.2.0 across all components.      ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

### What Was Validated

```
Login (JWT) → Create Identity → Activate 健康元 → Create Profile → Timeline (3 entries) → Search → Health Check
     ✅              ✅               ✅              ✅              ✅                ✅          ✅
```

### DEMO-001 Issues Resolved

| DEMO-001 Blocker | Resolution |
|-----------------|------------|
| PostgreSQL not installed | ✅ Homebrew PostgreSQL 16 installed |
| No graceful DB degradation | ✅ /health/db now returns 503 |
| Version mismatch | ✅ v0.2.0 unified |
| Platform DB migration failing | ✅ Enum + migration bugs fixed |

### Ready for Sprint-3

v0.2.0 is fully operational. The full Entry segment of the MVP closed loop (Customer Entry → Lookup/Create → Activate 健康元 → Concern Intake → Timeline) has been verified end-to-end. Sprint-3 can begin on this foundation.

---

## 7. End of Document

DEMO-002 completes the v0.2.0 environment setup and full end-to-end validation.

**Result: PASS.**
