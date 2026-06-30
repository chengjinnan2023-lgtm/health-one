# DEMO-003 — v0.3.0 Founder Validation of Manual Service Loop

Document ID : DEMO-003
Title       : v0.3.0 Sprint-3 — Founder Demo & Manual Loop Validation
Version     : 1.0
Status      : Complete
Owner       : Release Office
Created     : 2026-06-30
Target      : v0.3.0 Manual Service Loop Complete

---

## 1. Environment

| Item | Value |
|------|-------|
| Repository | `/Users/jinnanlaoshi/health-one` |
| Branch | `main` |
| Target Version | v0.3.0 |
| PostgreSQL | ✅ Running (Homebrew 16, localhost:5432) |
| Platform API | `uvicorn health_one.platform.main:app --port 8000` |
| Frontend | `npm run dev --port 5173` |
| Seed Data | admin / health123 (店长), STORE-001 |

---

## 2. Validation Checklist

| # | Step | Screen | API Call | HTTP | Result |
|---|------|--------|---------|------|--------|
| 1 | Start services | — | `GET /health` | 200 | ✅ |
| 2 | Login | Login | `POST /api/auth/login` | 200 | ✅ JWT issued |
| 2b | Verify /me | — | `GET /api/auth/me` | 200 | ✅ admin |
| 2c | Auth required | — | `GET /api/auth/me` (no token) | 401 | ✅ |
| 3 | Create customer | S1 | `POST /api/identities/` | 201 | ✅ Demo-103136 |
| 3b | Search customer | S1 | `GET /api/identities/?q=` | 200 | ✅ 1 result |
| 4 | Activate 健康元 | S2 | `POST /identities/{id}/activate` | 200 | ✅ pending→active |
| 5 | Concern intake | S3 | `PUT /identities/{id}/profile` | 200 | ✅ 肩颈 + phone + birth |
| 6 | Service record | S4 | `POST /identities/{id}/sessions` | 201 | ✅ 健康舱 30min |
| 7 | Feedback | S5 | `PATCH /identities/{id}/sessions/{sid}` | 200 | ✅ completed + feedback |
| 8 | Create follow-up | S6 | `POST /identities/{id}/plans` | 201 | ✅ phone 2026-07-03 |
| 8b | Mark completed | S6 | `PATCH /identities/{id}/plans/{pid}` | 200 | ✅ completed + result |
| 9 | Verify state | S2 | Multiple GETs | 200 | ✅ 6 entries + session + plan |

**All 13 checks passed.** ✅

---

## 3. Step-by-Step Results

### Step 2: Login
```
POST /api/auth/login → 200
Staff: 店長 (admin)
Token: eyJhbGciOiJIUzI1NiIs...
/me with token → 200 (admin)
/me without token → 401 ✅
```

### Step 3: Customer Search / Create
```
POST /api/identities/ → 201 Created
Name: Demo-103136
Status: pending
Search: 1 result found ✅
```

### Step 4: Activate 健康元
```
POST /identities/{id}/activate → 200 OK
Status: pending → active ✅
activated_at set ✅
```

### Step 5: Health Concern Intake
```
PUT /identities/{id}/profile → 200 OK
Primary Concern: 肩颈 — 长期低头导致颈椎不适
Phone: 13800000000
Birth Year: 1990
Timeline entry: profile_updated ✅
```

### Step 6: Service Record
```
POST /identities/{id}/sessions → 201 Created
Type: 健康舱
Detail: Graphene far-infrared cabin 30 minutes
Pre-notes: Shoulder stiffness reported
```

### Step 7: Feedback
```
PATCH /identities/{id}/sessions/{sid} → 200 OK
Feedback: Feeling: Relaxed | Comfort: Improved | Satisfaction: Satisfied | Return: Yes
Completed: yes (completed_at set)
Timeline entry: service_completed ✅
```

### Step 8: Follow-Up
```
POST /identities/{id}/plans → 201 Created
Method: phone, Planned: 2026-07-03T10:00:00Z

PATCH /identities/{id}/plans/{pid} → 200 OK
Status: completed
Result: "Customer reports feeling much better. Will return next week."
Timeline entries: plan_updated (create) + plan_updated (complete) ✅
```

### Step 9: Complete State Verification

#### Timeline (6 entries, reverse chronological)
```
1. [plan_updated] Follow-up status: completed — method: phone
2. [plan_updated] Follow-up plan created — method: phone
3. [service_completed] Service completed: ServiceType.HEALTH_CABIN — ...
4. [profile_updated] Health Profile created — primary concern: 肩颈...
5. [identity_activated] 健康元 activated: Demo-103136
6. [identity_created] 健康元 created: Demo-103136
```

✅ All 6 events recorded in append-only Timeline
✅ Reverse chronological order (newest first)
✅ Entry #3 has display bug — see B-001

#### Session State
```
Sessions: 1
Type: 健康舱 | Completed: yes | Feedback: yes
```

✅ Session completed with feedback

#### Plan State
```
Plans: 1
Status: completed | Method: phone
Result: Customer reports feeling much better. Will return next week.
```

✅ Follow-up created and marked completed

#### Profile State
```
Concern: 肩颈 — 长期低头导致颈椎不适
Phone: 13800000000
Birth: 1990
```

✅ Profile persisted with all fields

---

## 4. JWT Lifetime Verification

| Check | Result |
|-------|--------|
| Token issued on login | ✅ |
| Token valid for all 13 API calls | ✅ |
| Token rejected after expiry | Not tested (8h window) |
| /me returns correct staff | ✅ |
| No token → 401 | ✅ |
| Invalid token → 401 | ✅ (verified in test suite) |

---

## 5. Bugs Found

### B-006: Timeline Shows Enum Name Instead of Chinese Value

| Attribute | Value |
|-----------|-------|
| **Severity** | Low — cosmetic |
| **Steps** | Complete a service session → read Timeline |
| **Expected** | `Service completed: 健康舱 — ...` |
| **Actual** | `Service completed: ServiceType.HEALTH_CABIN — ...` |
| **Root Cause** | `routers/session.py` and `routers/plan.py` use `f"{session.service_type}"` which calls `str()` on the enum object. For `str(enum.Enum)` with `values_callable`, the __str__ may return the enum name instead of the value. |
| **Affected** | `session.py` lines 140, 179; `plan.py` currently not affected (uses string values directly) |
| **Fix** | Use `session.service_type.value` instead of `session.service_type` in f-strings. |

```python
# Before:
summary_text=f"Service completed: {session.service_type}"

# After:
summary_text=f"Service completed: {session.service_type.value}"
```

---

## 6. Severity Summary

| Severity | Count | Items |
|----------|-------|-------|
| Critical | 0 | — |
| High | 0 | — |
| Medium | 0 | — |
| Low | 1 | B-006: Timeline enum display |
| **Total** | **1** | |

---

## 7. Recommended Fixes

| Priority | Bug | Fix | Target |
|----------|-----|-----|--------|
| P2 | B-006 | `service_type` → `service_type.value` in Timeline summaries | Sprint 3.1 |

---

## 8. Founder Conclusion

### Validation Result

```
╔═══════════════════════════════════════════════════╗
║                                                       ║
║   ✅  P A S S                                          ║
║                                                       ║
║   v0.3.0 Manual Service Loop — validated.              ║
║                                                       ║
║   All 13 checks pass. 1 cosmetic bug (B-006).          ║
║   Full manual closed loop:                             ║
║   Login→Create→Activate→Concern→Service→Feedback       ║
║   →FollowUp→Complete→Verified                           ║
║                                                       ║
╚═══════════════════════════════════════════════════╝
```

### Answering Three Questions

**1. v0.3.0 是否可用于内部演示？**
✅ Yes. All 8 loop steps execute correctly. 6 Timeline entries generated. Session and Plan state verifiable. The one bug (B-006) is cosmetic — Chinese values display correctly everywhere except Timeline entry #3.

**2. v0.3.0 是否可进入部署准备？**
✅ Yes, with prerequisites:
- [ ] B-006 fix (cosmetic, 1-line change)
- [ ] Deployment checklist (PostgreSQL + Nginx + systemd)
- [ ] Database backup script
- [ ] Staff training walkthrough
- [ ] Sprint 3.1 testing (DEV-040/041/039)

**3. 哪些问题必须在 v0.3.1 修复？**
- B-006: Timeline enum display
- DEV-040: Integration tests for Session + Plan APIs
- DEV-041: E2E Playwright full loop test
- DEV-039: S2 service history + follow-up status display

---

## 9. The Manual Service Loop — Verified

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Customer walks in                                              │
│     ↓                                                           │
│   Staff finds/creates Customer         [S1] ✅                   │
│     ↓                                                           │
│   Activate/update 健康元                [S2] ✅                   │
│     ↓                                                           │
│   Record Health Concern                [S3] ✅                   │
│     ↓                                                           │
│   Deliver Store Service                [S4] ✅                   │
│     ↓                                                           │
│   Record Service                       [S4] ✅                   │
│     ↓                                                           │
│   Capture Feedback                     [S5] ✅                   │
│     ↓                                                           │
│   Create Follow-Up Task                [S6] ✅                   │
│     ↓                                                           │
│   Execute Follow-Up                    [S6] ✅                   │
│     ↓                                                           │
│   Customer Returns                     (next visit)              │
│                                                                 │
│   All events recorded in Timeline      [6 entries verified] ✅   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. End of Document

DEMO-003 completes the v0.3.0 Founder Demo and manual service loop validation.

**Result: PASS.**

The Health One MVP manual closed loop is functional, verifiable, and ready for internal demonstration.
