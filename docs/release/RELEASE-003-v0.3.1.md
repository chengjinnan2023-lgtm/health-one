# RELEASE-003 — v0.3.1 Stabilization Release

Document ID : RELEASE-003
Title       : v0.3.1 Manual Loop Stabilized — Release Note
Version     : 1.0
Status      : Complete
Owner       : Release Office
Created     : 2026-06-30
Target      : v0.3.1

---

## 1. Version

```
v0.3.1 — Manual Loop Stabilized
Release Status: Release Candidate Preparation
Date: 2026-06-30
```

## 2. Scope

v0.3.1 is a stabilization release. No new business features. Scope limited to:

| Category | Items |
|----------|-------|
| Bug Fix | BUG-006: Timeline enum display |
| Enhancement | DEV-039: S2 service history + follow-up status |
| Testing | DEV-040: 8 integration tests for Session + Plan APIs |
| Testing | DEV-041: E2E Playwright 8-step manual loop |
| DevOps | DEV-043: Deployment + backup/restore checklists |

## 3. Fixed Items

### BUG-006 — Timeline Enum Display

| Before | After |
|--------|-------|
| `Service completed: ServiceType.HEALTH_CABIN — ...` | `Service completed: 健康舱 — ...` |

**Root cause:** `f"{session.service_type}"` called `str()` on enum object, returning name instead of value.

**Fix:** `session.service_type` → `session.service_type.value` (2 occurrences in `routers/session.py`).

### Full Bug History (Sprint-2 through Sprint-3.1)

| ID | Severity | Description | Status |
|----|----------|------------|--------|
| B-001 | Critical | PostgreSQL unavailable | ✅ RESOLVED (DEV-026) |
| B-002 | Low | API version mismatch | ✅ RESOLVED (DEV-028) |
| B-003 | Low | /health/db wrong status code | ✅ RESOLVED (DEV-027) |
| B-004 | High | Migration enum double-create | ✅ RESOLVED |
| B-005 | Critical | Python enum name/value mismatch | ✅ RESOLVED |
| B-006 | Low | Timeline enum display | ✅ RESOLVED (v0.3.1) |
| **Total** | | | **6 found, 6 fixed** |

## 4. Validation Summary

### DEMO-003 — Manual Service Loop

```
13/13 checks PASSED

Login → Create → Activate → Concern → Service → Feedback → Follow-Up → Timeline
  200     201      200       200       201       200        201         200
```

All 8 loop steps verified. 6 Timeline entries generated in correct order. Session completed with feedback. Plan created and marked completed with result.

### Test Coverage

| Layer | Tests | Status |
|-------|-------|--------|
| Model unit tests | 15 | ✅ Pass |
| Auth API tests | 6 | ✅ Pass |
| Health endpoint | 1 | ✅ Pass |
| Identity API | 7 | CI-ready |
| Profile API | 6 | CI-ready |
| Session API | 4 | CI-ready (new) |
| Plan API | 4 | CI-ready (new) |
| E2E Playwright | 8 | CI-ready (new) |
| **Total** | **51** | **22 pass / 29 CI-ready** |

## 5. Known Limitations

| # | Limitation | Impact | Target |
|---|-----------|--------|--------|
| 1 | Integration tests need PostgreSQL in CI | Full coverage only in CI | Sprint-4 CI |
| 2 | E2E Playwright needs API running | Manual run or CI job | Sprint-4 CI |
| 3 | S2 loads service/follow-up data async | Brief loading flash | Acceptable |
| 4 | JWT in localStorage | XSS risk on untrusted network | Post-MVP |
| 5 | Single-store only | No multi-store isolation testing | Post-MVP |
| 6 | No production deployment | Checklists prepared, not executed | Deployment sprint |
| 7 | No AI features | Sprint-4 scope | Sprint-4 |

## 6. Deployment Readiness

### ✅ Ready for Deployment Dry-Run

- [x] Deployment checklist written (Nginx + systemd + PostgreSQL)
- [x] Backup/restore checklist written (pg_dump + SQLite + cron)
- [x] Seed data script ready
- [x] Migration scripts tested (3 Platform + 1 Store)
- [x] Environment configuration documented (.env.example)
- [x] Rollback procedure documented

### ❌ Not Yet Ready for Production

- [ ] Real store server not configured
- [ ] SSL certificates not provisioned
- [ ] Database backup cron not scheduled
- [ ] Monitoring/alerting not configured
- [ ] Staff training not conducted

## 7. Release Recommendation

### ✅ GO — v0.3.1 is ready for Release Candidate

```
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   v0.3.1 — Manual Loop Stabilized                     ║
║                                                       ║
║   ✅ All Sprint-2 + Sprint-3 P0 features complete      ║
║   ✅ 6 bugs found, 6 fixed                             ║
║   ✅ 24 API endpoints, all JWT-protected               ║
║   ✅ 7 Store Workbench screens (Login + S1–S6)         ║
║   ✅ 51 tests (22 pass, 29 CI-ready)                   ║
║   ✅ Deployment + backup checklists ready              ║
║   ✅ 10 QA reviews, all APPROVED                       ║
║                                                       ║
║   RECOMMENDATION: GO                                   ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

### Answering Three Questions

**1. v0.3.1 是否可作为 Release Candidate 候选？**
✅ Yes. All P0 features complete (F1–F9). 6/6 bugs fixed. Manual service loop verified end-to-end. Deployment documentation ready. The codebase is stable — no known blocking defects.

**Prerequisite for RC:** Founder approval per FD-006 §4.3 — "Release Candidate transition requires Founder approval."

**2. 还有哪些阻塞项？**
No code-level blockers. Infrastructure blockers for Production:
- Real store server setup (hardware/network)
- SSL certificate provisioning
- Staff training
- Database backup automation (cron)

These are deployment/infrastructure concerns, not code defects. They do not block the Release Candidate decision — they block the Pilot decision (which also requires Founder approval).

**3. 下一步是否进入部署演练而不是 Sprint-4 功能开发？**
Recommendation: **Proceed in parallel.**

- **Deployment track:** Execute deployment dry-run on a store server using the deployment checklist. Conduct staff training demo. Validate that the manual loop works in a real store environment.
- **Development track:** Begin Sprint-4 planning (AI Summary, Knowledge Base, Dashboard) in parallel. Sprint-4 does not depend on deployment completion — it can proceed on the development machine.

The deployment track unblocks the Pilot decision. The development track continues toward MVP completeness. They are independent workstreams.

---

## 8. End of Document

RELEASE-003 completes the v0.3.1 stabilization release.

**Decision: GO. v0.3.1 is ready for Release Candidate.**
