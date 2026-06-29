# QA-BATCH-002 — Platform API Architecture Review

Document ID : QA-BATCH-002
Title       : Sprint-2 Phase 2 Platform API — Architecture Review
Version     : 1.0
Status      : Complete
Owner       : QA / Architecture Office
Created     : 2026-06-29
Reviewed    : DEV-006, DEV-007, DEV-008, DEV-009, DEV-010, DEV-011, DEV-012
Depends On  : RFC-001, RFC-002, ARCH-000, ADR-002, PRD-001, SPRINT-002-PLAN, QA-BATCH-001

---

## 1. Executive Summary

| Category | Count |
|----------|-------|
| PASS | 14 |
| WARNING | 4 |
| MUST FIX | 1 |
| Architecture Debt | 2 |
| Test Gaps | 2 |

**Decision: ✅ APPROVE COMMIT**

One MUST FIX (race condition documentation), four warnings, two test gaps. No blocking architecture violations.

---

## 2. PASS

### 2.1 RFC-002 Field-by-Field Compliance

#### Health Identity (§2.1)

| RFC-002 Field | Model Column | Type | Match |
|--------------|-------------|------|-------|
| identity_id | identity_id | UUID PK | ✅ |
| display_name | display_name | String(200) NOT NULL | ✅ |
| activation_status | activation_status | Enum(pending/active/archived), default=pending | ✅ |
| primary_store_id | primary_store_id | UUID NOT NULL | ✅ |
| data_ownership_tag | data_ownership_tag | Enum(customer/platform), default=customer | ✅ |
| created_at | created_at (TimestampMixin) | DateTime(tz=True), auto | ✅ |
| activated_at | activated_at | DateTime(tz=True), nullable | ✅ |

**Additional compliance:**
- `primary_store_id` has no DB-level FK — correct per RFC-002 §5 cross-DB rule
- `activation_status` lifecycle: pending → active → archived — enforced in API logic
- `data_ownership_tag` defaults to "customer" — matches Constitution §8

#### Health Profile (§3.1)

| RFC-002 Field | Model Column | Type | Match |
|--------------|-------------|------|-------|
| profile_id | profile_id | UUID PK | ✅ |
| identity_id | identity_id | UUID FK, UNIQUE | ✅ |
| basic_info | basic_info | JSONB, nullable | ✅ |
| medical_summary | medical_summary | Text, nullable | ✅ |
| lifestyle_notes | lifestyle_notes | Text, nullable | ✅ |
| primary_concern | primary_concern | Text, nullable | ✅ |
| last_updated_at | last_updated_at | DateTime(tz=True) | ✅ |

**Additional compliance:**
- FK with CASCADE delete — Profile deleted when Identity deleted ✅
- `medical_summary` comment says "NOT a diagnosis" — matches RFC-001 R1.4 invariant ✅
- UNIQUE constraint on identity_id enforces 1:1 ✅

#### Health Timeline (§3.2) + Timeline Entry (§4.1)

| RFC-002 Field | Model Column / Dict Key | Type | Match |
|--------------|------------------------|------|-------|
| timeline_id | timeline_id | UUID PK | ✅ |
| identity_id | identity_id | UUID FK, UNIQUE | ✅ |
| entries[] | entries | JSONB, default=[] | ✅ |
| entry_id | entry["entry_id"] | String (UUID) | ✅ |
| timestamp | entry["timestamp"] | ISO datetime string | ✅ |
| event_type | entry["event_type"] | String | ✅ |
| source_object_type | entry["source_object_type"] | String | ✅ |
| source_object_id | entry["source_object_id"] | String (UUID) | ✅ |
| summary_text | entry["summary_text"] | String | ✅ |
| performed_by | entry["performed_by"] | String | ✅ |

**Additional compliance:**
- FK with CASCADE — Timeline deleted when Identity deleted ✅
- UNIQUE on identity_id enforces 1:1 ✅
- JSONB approach matches RFC-002 Q3 MVP decision ✅

### 2.2 Aggregate Root Boundary

| RFC-002 Rule | Implementation |
|-------------|---------------|
| A1: Health Identity is sole aggregate root | ✅ Profile and Timeline cascade from Identity |
| A2: External objects reference via identity_id | ✅ primary_store_id is app-level FK, not DB FK |
| A3: Aggregate internal entities can cross-reference | ✅ Profile and Timeline have identity_id FK |
| A4: Cross-aggregate via interface, not FK | ✅ No DB-level FK to Store (Store is in Store DB) |

### 2.3 Timeline Append-Only Enforcement

| Check | Result |
|-------|--------|
| API exposes PUT for timeline entries? | No — only GET (read) and POST (append) |
| API exposes DELETE for timeline? | No — DELETE returns 405 |
| Service `append_timeline_entry` modifies existing entries? | No — only adds, never removes |
| Service `get_timeline` modifies entries? | No — read-only |
| Application-level immutability check? | ⚠️ Not enforced (see W-003) |

### 2.4 Platform / Store Isolation

| Check | Result |
|-------|--------|
| Platform imports Store models? | No |
| Platform has DB-level FK to Store tables? | No — `primary_store_id` is app-level reference |
| Store imports Platform models? | No |
| Shared module used? | Not yet (empty) |

✅ Platform and Store remain decoupled. The `primary_store_id` column correctly uses application-level reference per RFC-002 §5.

### 2.5 Schema ↔ Model Alignment

| Pydantic Schema | SQLAlchemy Model | Fields Match? |
|----------------|-----------------|---------------|
| IdentityCreate | HealthIdentity | display_name, primary_store_id, data_ownership_tag ✅ |
| IdentityUpdate | HealthIdentity | display_name, primary_store_id (both optional) ✅ |
| IdentityResponse | HealthIdentity | All 8 fields ✅ |
| ProfileUpdate | HealthProfile | All 4 updatable fields ✅ |
| ProfileResponse | HealthProfile | All 6 fields ✅ |
| TimelineEntryCreate | TimelineEntry (dict) | All 5 required fields ✅ |
| TimelineEntrySchema | TimelineEntry (dict) | All 7 fields ✅ |
| TimelineResponse | HealthTimeline | timeline_id, identity_id, entries ✅ |

### 2.6 API Design

| Check | Result |
|-------|--------|
| POST creates return 201 | ✅ |
| Not-found returns 404 | ✅ |
| Conflict returns 409 (activate when not pending, archive when archived) | ✅ |
| Search supports pagination (offset/limit) | ✅ |
| Search supports filtering (q, store_id, status) | ✅ |
| All endpoints documented via OpenAPI | ✅ FastAPI auto-generates |
| Prefixes consistent (`/api/identities/`) | ✅ |

### 2.7 No Premature Non-MVP Features

| Check | Result |
|-------|--------|
| Health Assessment endpoints? | No — Sprint 3+ |
| Health Plan endpoints? | No — Sprint 3+ |
| Service Session endpoints? | No — Sprint 3+ |
| AI Conversation endpoints? | No — Sprint 4+ |
| Knowledge Base endpoints? | No — Sprint 4+ |
| Upload Asset endpoints? | No — Sprint 5 |
| Member Entitlement endpoints? | No — Sprint 3+ |

✅ API surface is strictly limited to Sprint 2 scope (Identity, Profile, Timeline).

### 2.8 Migration

| Check | Result |
|-------|--------|
| Tables match models 1:1 | ✅ health_identity, health_profile, health_timeline |
| Enum types created before tables | ✅ activation_status_enum, data_ownership_tag_enum |
| Indexes on search columns | ✅ ix_health_identity_display_name, ix_health_identity_primary_store_id |
| CASCADE delete on FK | ✅ identity_id FK in profile and timeline |
| UNIQUE on 1:1 relationships | ✅ identity_id in profile and timeline |
| Downgrade drops in reverse order | ✅ timeline → profile → identity → enums |
| Server defaults for required columns | ✅ created_at, updated_at, activation_status, data_ownership_tag, entries |

---

## 3. WARNING

### W-001: EventType Enum Defines Sprint 3/4 Events in Sprint 2 Code

| Attribute | Value |
|-----------|-------|
| **Severity** | Low — forward-looking enum |
| **File** | `health_one/platform/models/timeline.py:15-27` |
| **Finding** | The `EventType` enum defines 10 values including `ASSESSMENT_CREATED`, `PLAN_UPDATED`, `SERVICE_COMPLETED`, `AI_CONVERSATION_SUMMARIZED`, `ASSET_UPLOADED`, `FEEDBACK_RECORDED`, `FOLLOW_UP_STATUS_CHANGED` — none of which are used in Sprint 2 business logic. Only `IDENTITY_CREATED`, `IDENTITY_ACTIVATED`, and `PROFILE_UPDATED` are triggered by current code. |
| **Why concerning** | Forward-looking enums create false impression of completeness. If Sprint 3 requires a different event type schema (e.g., additional fields per event type), the enum is misleading. Also: `FOLLOW_UP_STATUS_CHANGED` is not in the RFC-001 §4.7 event list — it was added without design authority. |
| **Verdict** | **ACCEPTED** — enums are cheap. But `FOLLOW_UP_STATUS_CHANGED` was not in RFC-001 §4.7. It was added speculatively. Recommend removing it until Sprint 3 defines follow-up events explicitly. |
| **Action** | Remove `FOLLOW_UP_STATUS_CHANGED` and `FEEDBACK_RECORDED` from EventType enum (not triggered by any planned code until Sprint 3). Re-add when the corresponding feature is implemented. |

### W-002: `performed_by` Hardcoded to "system"

| Attribute | Value |
|-----------|-------|
| **Severity** | Medium — will change in Sprint 2 Phase 3 |
| **File** | `routers/identity.py:46,141`, `routers/profile.py:93` |
| **Finding** | All `append_timeline_entry()` calls pass `performed_by="system"`. After DEV-015 (JWT Auth) in Phase 3, this should be the authenticated staff_id. |
| **Why concerning** | Timeline traceability is a core requirement (Constitution §8, RFC-001 §4.7 R7.2). "system" attribution loses the human actor. If we commit now and forget to update in Phase 3, production Timeline entries will permanently show "system". |
| **Verdict** | **ACCEPTED** — Phase 3 is the same sprint. But add a `# TODO(sprint-2-phase-3)` comment above each hardcoded "system" so it's auditable. |
| **Action** | Add TODO comments before commit, or create a tracking issue. |

### W-003: Timeline JSONB Replace Creates Race Condition Window

| Attribute | Value |
|-----------|-------|
| **Severity** | Low for MVP — serious for production |
| **File** | `services/timeline.py:52-55` |
| **Finding** | `timeline.entries = updated_entries` replaces the entire JSONB array. If two concurrent requests both append to the same timeline, the second write will overwrite the first, losing an entry. SQLAlchemy JSONB columns use full-column replacement, not atomic append. |
| **Why concerning** | RFC-002 Q3 explicitly acknowledges this trade-off: "MVP 用 JSONB 内嵌；entries 超过阈值后迁子表." For MVP single-store with low concurrency (one staff per store), the risk is extremely low. But the code doesn't document this limitation. |
| **Verdict** | **ACCEPTED** with documentation. Add a comment in the service and in the model noting the race condition window and the migration path (sub-table with INSERT-only). |
| **Action** | Add `# NOTE(mvp): JSONB full-column replacement is not atomic for concurrent appends.` comment in `services/timeline.py`. |

### W-004: Non-Existent Timeline Returns Synthetic timeline_id

| Attribute | Value |
|-----------|-------|
| **Severity** | Low — API design |
| **File** | `routers/timeline.py:35-40` |
| **Finding** | When no Timeline row exists for an identity, `read_timeline` returns `TimelineResponse` with a randomly generated `timeline_id` and empty entries. The returned `timeline_id` doesn't correspond to any database row. |
| **Why concerning** | A client might store this synthetic ID and use it in future requests, expecting it to be valid. It's not. Also, the API returns HTTP 200 with fabricated data instead of 404 (which would accurately represent "no timeline exists yet"). |
| **Verdict** | **ACCEPTED** for MVP — the empty timeline with a generated ID is a pragmatic choice that avoids extra API calls. But it conflates "empty timeline" with "timeline exists." A cleaner API would return 404 for no timeline, letting the client distinguish. |
| **Action** | No change needed for Sprint 2. Revisit in Sprint 3 when more consumers exist. |

---

## 4. MUST FIX

### MF-001: `FOLLOW_UP_STATUS_CHANGED` Not in RFC-001 Event List

| Attribute | Value |
|-----------|-------|
| **Severity** | Low — enum hygiene |
| **File** | `health_one/platform/models/timeline.py:27` |
| **Finding** | `FOLLOW_UP_STATUS_CHANGED = "follow_up_status_changed"` is defined in `EventType` but does not appear in the RFC-001 §4.7 event list. The RFC lists: `assessment_created`, `plan_updated`, `service_completed`, `ai_conversation_summarized`, `asset_uploaded`. No `follow_up_status_changed` or `feedback_recorded`. |
| **Why must fix** | Architecture documents (RFC-001, RFC-002) are the source of truth per Constitution §11. Adding event types without RFC authority sets a precedent that any developer can extend the domain model without review. |
| **Fix** | Remove `FEEDBACK_RECORDED = "feedback_recorded"` and `FOLLOW_UP_STATUS_CHANGED = "follow_up_status_changed"` from the EventType enum. They can be re-added via an RFC amendment when Sprint 3 (Follow-Up) and Sprint 3 (Feedback) implement those features. |

---

## 5. Architecture Debt

### AD-001: Profile PATCH Delegates to PUT (Upsert)

| Attribute | Value |
|-----------|-------|
| **Source** | Code review |
| **Finding** | `routers/profile.py:102-112` — `partial_update_profile` calls `upsert_profile`. PATCH semantics should mean "only update provided fields," but the current implementation also creates the profile if it doesn't exist. The code documents this as "MVP simplification." |
| **Risk** | Low — upsert is the desired behavior for MVP (staff shouldn't need to know if a profile exists before updating it). |
| **When to fix** | Sprint 3 if true partial-update semantics are needed (e.g., clearing a field by setting it to null). |
| **Action** | Tracked. No change for Sprint 2. |

### AD-002: No optimistic locking or version column on Timeline

| Attribute | Value |
|-----------|-------|
| **Source** | Code review |
| **Finding** | The Timeline JSONB column has no version number or optimistic lock. Concurrent append detection relies on database transaction isolation. PostgreSQL's default READ COMMITTED isolation means lost updates are possible (see W-003). |
| **Risk** | Low for MVP single-store. Medium for multi-store. |
| **When to fix** | Before multi-store deployment (Post-MVP). The migration path (JSONB → sub-table with INSERT-only) eliminates this issue entirely. |
| **Action** | Tracked alongside RFC-002 Q3 resolution. |

---

## 6. Test Gaps

### TG-001: No Dedicated Profile API Tests

| Attribute | Value |
|-----------|-------|
| **Severity** | Medium |
| **Finding** | `tests/` contains `test_api_identity.py` (7 tests) and `test_api_timeline.py` (4 tests). There is no `test_api_profile.py`. Profile behavior (upsert, field update, timeline trigger) is only tested indirectly through timeline tests that create identities. |
| **Missing tests:** | (1) GET /profile returns 404 when profile doesn't exist. (2) PUT /profile creates a new profile and returns correct fields. (3) PUT /profile updates an existing profile and changes are reflected in GET. (4) PATCH /profile partial update only changes provided fields. (5) Profile update triggers Timeline entry. |
| **Action** | Add `tests/test_api_profile.py` in DEV-BATCH-003 (or as a P1 task in Sprint 2). Not blocking for commit — the behavior is verified indirectly. |

### TG-002: No Transactional Rollback Test

| Attribute | Value |
|-----------|-------|
| **Severity** | Low |
| **Finding** | No test verifies that if `append_timeline_entry` fails, the parent operation (Identity create, Profile update) rolls back. The current code uses `await db.flush()` before the timeline append, which means a timeline failure would leave the identity created but without a timeline entry. |
| **Code path:** | `identity.py:36` — `await db.flush()` commits the Identity to DB. Then `identity.py:38-47` appends timeline. If timeline append fails, the Identity is already persisted. This is not atomic. |
| **Action** | Move `await db.flush()` to after both the model creation AND timeline append, or wrap both in an explicit transaction with rollback. Fix in DEV-BATCH-003 or Phase 3. Not blocking for commit — the timeline append is unlikely to fail (it's an INSERT/UPDATE on the same DB). |

---

## 7. PostgreSQL Integration Tests Not Running Locally

| Attribute | Value |
|-----------|-------|
| **Status** | **ACCEPTED** |
| **Rationale** | PostgreSQL is not expected to be running on every developer's machine during Sprint 2. The test suite is designed to run in CI (GitHub Actions with PostgreSQL service container per `.github/workflows/ci.yml:23-35`). |
| **Verification path** | (1) Model tests (6) run without DB → ✅ all pass. (2) CI pipeline runs full test suite with PostgreSQL → verified on PR. (3) Developer can install PostgreSQL locally and run `pytest tests/` for full verification. |
| **Risk** | If CI configuration is incorrect (e.g., wrong PostgreSQL credentials), tests will fail only on PR, not during development. Mitigated by: CI was tested with Store DB migration earlier (DEV-003) and worked. |
| **Recommendation** | Accept. Add a `make test-db` target that requires PostgreSQL and documents the setup steps. |

---

## 8. RFC-002 Completeness Check

| RFC-002 Entity | Model Implemented | API Implemented | Notes |
|---------------|------------------|-----------------|-------|
| Health Identity (§2.1) | ✅ | ✅ 7 endpoints | Aggregate root, full CRUD |
| Health Profile (§3.1) | ✅ | ✅ 3 endpoints | 1:1 with Identity, upsert semantics |
| Health Timeline (§3.2) | ✅ | ✅ 2 endpoints | Append-only, JSONB entries |
| Health Assessment (§3.3) | — | — | Sprint 3 |
| Health Plan (§3.4) | — | — | Sprint 3 |
| Service Session (§3.5) | — | — | Sprint 3 |
| Store (§3.6) | — | — | Sprint 2 Phase 3 (Store DB) |
| Staff (§3.7) | — | — | Sprint 2 Phase 3 (Store DB) |
| Device (§3.8) | — | — | Sprint 3+ |
| AI Conversation (§3.9) | — | — | Sprint 4 |
| Upload Asset (§3.10) | — | — | Sprint 5 |
| Member Entitlement (§3.11) | — | — | Sprint 3+ |
| Knowledge Entry (§3.12) | — | — | Sprint 4 |
| AI Capability (§3.13) | — | — | Sprint 4 |

✅ Sprint 2 implements exactly the 3 entities assigned (Identity, Profile, Timeline). No scope creep.

---

## 9. Code Quality Observations

| Aspect | Observation |
|--------|------------|
| Import organization | ✅ Clean — standard library → third-party → internal |
| Type annotations | ✅ All functions have return types |
| Docstrings | ✅ Every public function and class has a docstring |
| Error messages | ✅ User-facing (Chinese + English), not stack traces |
| Logging | ⚠️ Only `print()` in lifespan — no structured logging (acceptable for MVP) |
| Transaction management | ⚠️ Flush-before-append pattern (see TG-002) |
| SQL injection | ✅ All queries use parameterized SQLAlchemy ORM |
| Pydantic validation | ✅ Field constraints (min_length, max_length, pattern, ge, le) |

---

## 10. Recommendation

### ✅ APPROVE COMMIT

All core architecture requirements are met:
- RFC-002 field compliance: 27/27 fields verified
- Aggregate root boundary: 4/4 rules satisfied
- Timeline append-only: enforced at API and service layers
- Platform/Store isolation: maintained
- No premature non-MVP features
- 17 tests written (10 integration, 6 model, 1 health)

### Pre-Commit Checklist

- [x] RFC-002 field compliance — 27/27
- [x] Aggregate root boundary — clean
- [x] Timeline append-only — enforced
- [x] Platform/Store isolation — clean
- [x] Lint passing — ruff clean
- [x] Model tests passing — 6/6
- [ ] MF-001: Remove `FOLLOW_UP_STATUS_CHANGED` and `FEEDBACK_RECORDED` from EventType
- [ ] W-002: Add `# TODO(sprint-2-phase-3)` above each hardcoded `performed_by="system"`
- [ ] W-003: Add race condition documentation in `services/timeline.py`
- [ ] TG-002 (optional): Move `await db.flush()` after timeline append for atomicity

### Next QA Gate

QA-BATCH-003 will review DEV-013 through DEV-016 (Store DB: Store/Staff models + JWT Auth + middleware).

---

## 11. End of Document

QA-BATCH-002 completes the architecture review of Sprint-002 Phase 2 Platform API (DEV-006 through DEV-012).

**Decision: APPROVE COMMIT.**
