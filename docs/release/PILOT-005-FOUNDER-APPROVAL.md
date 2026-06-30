# PILOT-005 — Founder Approval for Internal Pilot

Document ID : PILOT-005
Title       : v0.3.1-rc1 Internal Pilot — Founder Approval
Version     : 1.0
Status      : Approved
Owner       : Founder Office
Approver    : Founder
Created     : 2026-06-30
Depends On  : PILOT-001, PILOT-002, PILOT-003, PILOT-004, FD-006

---

## 1. Version

```
v0.3.1-rc1 — Manual Loop Stabilized
Status: Internal Pilot Approved
```

### Status Progression (FD-006 §4)

```
Development → Development Complete → Release Candidate → [Pilot] → Production
                                                              ↑ APPROVED HERE
```

Per FD-006 §4.3: **"Only Founder may approve Release Candidate → Pilot transition."**

## 2. Approval Basis

### Evidence Package

| Document | Content | Status |
|----------|---------|--------|
| RC-001 | Release Candidate preparation | ✅ |
| RC-002 | RC formal approval | ✅ |
| PILOT-001 | Internal pilot preparation plan | ✅ |
| PILOT-002 | Deployment rehearsal plan (21 steps) | ✅ |
| PILOT-003 | Deployment rehearsal execution (PASS) | ✅ |
| PILOT-004 | Final pre-pilot validation (PASS) | ✅ |

### Validation Summary

| Category | Result |
|----------|--------|
| API endpoints | 24, all JWT-protected |
| Manual loop | 9/9 steps verified |
| Data persistence | Confirmed on refresh |
| Auth enforcement | 401 for unauthorized access |
| Timeline | 6 events per loop, append-only |
| Backup/restore | pg_dump + SQLite verified |
| Version | 0.3.1 unified across all components |
| Bugs | 6 found, 6 fixed |
| QA reviews | 10/10 APPROVED |

## 3. Scope of Pilot

### What Is Authorized

- Deploy v0.3.1-rc1 to **one** store server
- **One** pilot store (STORE-001)
- **1–2** trained staff members
- **1–5** consenting real customers
- Manual service loop only (S1→S2→S3→S4→S5→S6→S2)
- Data stored in PostgreSQL (Platform DB) + SQLite (Store DB)
- Pilot duration: 1–3 days

### What Is NOT Authorized

- Multi-store deployment
- Customer-facing PWA
- AI features (Sprint 4)
- Payment / billing integration
- Production SLA or uptime guarantee
- Customer data retention beyond pilot period (purge after unless consent obtained)
- Public announcement or marketing
- Real medical diagnosis or treatment recommendation

## 4. Pilot Constraints

| # | Constraint | Rationale |
|---|-----------|-----------|
| C1 | Internal pilot only — not a product launch | System is feature-incomplete (no AI, no PWA) |
| C2 | Single store, single server | Multi-store not tested |
| C3 | Staff must complete training before pilot | Untrained staff → invalid results |
| C4 | Customer consent required before data recording | Ethics + data privacy |
| C5 | No medical diagnosis in system | Constitution explicitly prohibits |
| C6 | Daily database backups | Data loss during pilot is unacceptable |
| C7 | Pilot can be terminated at any time by Founder | Risk management |
| C8 | AI features explicitly excluded from pilot scope | Sprint 4 scope |

## 5. Risks Accepted

| # | Risk | Accepted Because |
|---|------|-----------------|
| R1 | Single server — no high availability | Internal pilot, low stakes |
| R2 | JWT in localStorage — XSS risk | Trusted store network, internal only |
| R3 | No monitoring/alerting | Staff will report issues directly |
| R4 | Self-signed SSL certificate | Internal network, no public access |
| R5 | Staff may find UI confusing | Training session mitigates; feedback will improve |
| R6 | Customer may refuse data recording | Verbal consent script; skip if refused |

## 6. Exit Criteria

### Pilot Success

- [ ] ≥ 1 real customer completes full manual loop
- [ ] All 6 Timeline entries present per customer
- [ ] Staff completes loop independently
- [ ] Staff confirms system does not block service
- [ ] No Do-Not-Ship criteria triggered (PRD-001 §7.2)
- [ ] Database backup + restore verified on target server

### Pilot Failure

- [ ] Staff cannot complete loop independently
- [ ] Timeline entries missing or incomplete
- [ ] Cross-store data leak detected
- [ ] System crash during service hours
- [ ] Staff reports system blocks or slows service

### After Pilot

| If Pilot Succeeds | If Pilot Fails |
|------------------|---------------|
| → Founder approves Production transition | → Fix identified issues |
| → Begin Sprint-4 AI development | → Re-run pilot after fixes |
| → Plan second store deployment | → Do NOT proceed to Production |

## 7. Founder Approval

```
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   Founder Approval — Internal Pilot                    ║
║                                                       ║
║   I approve v0.3.1-rc1 to enter internal pilot         ║
║   at one store, with trained staff, for 1–3 days,      ║
║   under the constraints defined in this document.       ║
║                                                       ║
║   This approval DOES NOT authorize:                    ║
║   - Production deployment                              ║
║   - Multi-store rollout                                ║
║   - AI feature activation                              ║
║   - Public announcement                                ║
║                                                       ║
║   Production requires a separate approval              ║
║   after successful pilot completion.                   ║
║                                                       ║
║   Approved by: ___________________________              ║
║   Date: ___________________________________              ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

## 8. Next Steps

| Priority | Action | Owner |
|----------|--------|-------|
| P0 | Deploy v0.3.1-rc1 to store server (PILOT-002 S-001 through S-021) | DevOps |
| P0 | Staff training session (PILOT-001 §5) | Store Manager |
| P0 | Execute internal pilot (PILOT-001 §7) | Store Staff |
| P1 | Sprint-4 planning (AI features) | Architecture Office |
| — | After pilot: Founder reviews results → Production decision | Founder |

---

## 9. End of Document

PILOT-005 records Founder approval for v0.3.1-rc1 internal pilot.

**Status: Internal Pilot Approved. Production requires separate Founder approval.**
