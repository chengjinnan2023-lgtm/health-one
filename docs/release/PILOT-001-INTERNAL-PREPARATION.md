# PILOT-001 — Internal Pilot Preparation Plan

Document ID : PILOT-001
Title       : v0.3.1-rc1 Internal Pilot Preparation Plan
Version     : 1.0
Status      : Proposed
Owner       : Release Office
Created     : 2026-06-30
Depends On  : DEPLOYMENT-CHECKLIST, BACKUP-RESTORE, RC-001, RC-002, FD-006

---

## 1. Pilot Goal

> **Deploy v0.3.1-rc1 to one real store server, train one store staff member, and complete the manual service loop with at least one real customer.**

The pilot validates:
- The deployment process works on real hardware
- A real staff member can complete the manual loop independently
- The Timeline records every event without data loss
- The system does not block or slow down store service

**Pilot succeeds if:** the manual loop is completed by real staff with a real customer, all Timeline entries are present, and the staff confirms the system is usable.

**Pilot fails if:** staff cannot complete the loop, data is lost, or the system actively blocks service delivery.

---

## 2. Scope

### In Scope (Pilot)

| Item | Detail |
|------|--------|
| Single store server | One physical or VM server |
| Single store | STORE-001 (pilot store) |
| 1–2 staff accounts | Store manager + health advisor |
| 1–5 real customers | Walk-in customers consenting to pilot |
| Manual service loop | S1→S2→S3→S4→S5→S6→S2 |
| Timeline verification | Every event recorded |
| Staff feedback | Usability, speed, friction points |

### Out of Scope (Pilot)

| Item | Reason |
|------|--------|
| Multi-store deployment | Single-store MVP |
| Customer PWA | Sprint 5 |
| AI features | Sprint 4 |
| Payment / billing | Non-MVP |
| Production SLA | Internal pilot only |
| Real customer data retention beyond pilot | Data purged after pilot unless consent obtained |

---

## 3. Deployment Tasks

### Phase 1: Server Setup (Day 1)

| # | Task | Owner | Est. Time |
|---|------|-------|-----------|
| D1 | Provision server (physical Mac/PC or Ubuntu VM) | DevOps | 2h |
| D2 | Install Ubuntu 24.04 LTS | DevOps | 1h |
| D3 | Install Python 3.12+ + Node.js 20+ | DevOps | 30min |
| D4 | Install PostgreSQL 16 | DevOps | 30min |
| D5 | Install Nginx | DevOps | 15min |
| D6 | Configure firewall (port 443 only) | DevOps | 15min |
| D7 | Generate self-signed SSL cert (or Let's Encrypt) | DevOps | 30min |

### Phase 2: Application Deployment (Day 1)

| # | Task | Owner | Est. Time |
|---|------|-------|-----------|
| D8 | Clone repository at v0.3.1-rc1 tag | DevOps | 10min |
| D9 | Create Python venv + pip install | DevOps | 10min |
| D10 | `npm ci && npm run build` (frontend) | DevOps | 5min |
| D11 | Create `.env` with production secrets | DevOps | 15min |
| D12 | Run Platform DB migration (Alembic) | DevOps | 5min |
| D13 | Run Store DB migration (Alembic) | DevOps | 5min |
| D14 | Run seed script (STORE-001 + staff) | DevOps | 5min |
| D15 | Deploy systemd service + enable | DevOps | 10min |
| D16 | Deploy Nginx config + reload | DevOps | 10min |

### Phase 3: Verification (Day 1)

| # | Task | Owner | Est. Time |
|---|------|-------|-----------|
| D17 | `GET /health` → 200 + v0.2.0 (or v0.3.1) | DevOps | 5min |
| D18 | `GET /health/db` → platform_db=ok | DevOps | 5min |
| D19 | Frontend loads at store URL | DevOps | 5min |
| D20 | Login with seed credentials → JWT returned | DevOps | 5min |
| D21 | Full manual loop dry-run (DevOps as test user) | DevOps | 10min |

**Total estimated: ~7 hours (one day)**

---

## 4. Backup / Restore Drill

Before any real customer data enters the system, verify backup/restore works.

### Drill Procedure (Day 2 Morning)

| Step | Action | Expected |
|------|--------|----------|
| B1 | Create test customer + service + feedback + follow-up | Data in DB |
| B2 | Run `pg_dump health_one_platform > backup.sql` | File created |
| B3 | Copy `data/store-001/store.db` to backup location | File copied |
| B4 | Drop + recreate `health_one_platform` database | DB empty |
| B5 | Delete `data/store-001/store.db` | Store DB gone |
| B6 | Restore from `backup.sql` | `psql ... < backup.sql` |
| B7 | Restore store.db from backup | `cp backup.db data/store-001/store.db` |
| B8 | Restart service + verify test data still present | Data intact |

**Pass criteria:** All test data recoverable after restore. Health check passes.

---

## 5. Staff Training Tasks

### Training Session (Day 2)

| # | Task | Detail | Est. Time |
|---|------|--------|-----------|
| T1 | Explain 健康元 concept | What is Health Identity, why it matters | 10min |
| T2 | Walkthrough: Login → S1 → S2 | Staff logs in, searches/creates customer | 10min |
| T3 | Walkthrough: S3 Concern Intake | Record health concern | 10min |
| T4 | Walkthrough: S4 Service Record | Record service delivery | 10min |
| T5 | Walkthrough: S5 Feedback | Capture customer feedback | 5min |
| T6 | Walkthrough: S6 Follow-Up | Create follow-up task | 10min |
| T7 | Walkthrough: S2 Summary | Read customer state | 5min |
| T8 | Staff completes full loop independently | No coaching | 15min |
| T9 | Staff completes loop a second time | Speed test | 10min |
| T10 | Q&A + feedback collection | Usability notes | 15min |

**Total training: ~2 hours**

### Training Success Criteria

- Staff completes full manual loop in < 8 minutes
- Staff correctly identifies Timeline entries
- Staff reports system does not block service
- Staff can explain 健康元 to a customer in plain language

---

## 6. Test Accounts / Demo Data

### Staff Accounts

| Username | Role | Store | Password |
|----------|------|-------|----------|
| admin | 店长 | STORE-001 | *(set via SEED_STAFF_PASSWORD env var)* |
| staff01 | 健康管理师 | STORE-001 | *(to be created)* |

### Demo Customers (for dry-run)

Create 2–3 demo customers before the pilot session:

```
Demo Customer A: 肩颈 concern, 健康舱 service
Demo Customer B: 疲劳 concern, 咨询 service
Demo Customer C: 运动恢复 concern, 检测 service
```

### Real Customer Consent (for pilot)

Before recording any real customer data:
1. Explain that this is an internal system test
2. Obtain verbal consent to record service and feedback
3. Do NOT collect: ID numbers, medical records, payment information
4. Offer to delete data after pilot if customer requests

---

## 7. Pilot Execution Plan (Day 3)

### Morning: Dry-Run Verification

| Time | Task |
|------|------|
| 09:00 | Server health check (API + DB + frontend) |
| 09:15 | Staff logs in, completes full loop with demo customer |
| 09:30 | Verify Timeline entries, no data loss |
| 09:45 | Fix any issues found |

### Afternoon: Live Pilot

| Time | Task |
|------|------|
| 13:00 | System ready, staff logged in |
| 13:00–17:00 | Real customers served through manual loop |
| Per customer | Staff records service + feedback + follow-up |
| End of day | Verify all Timeline entries, count sessions |

### Evening: Data Verification

| Check | Method |
|-------|--------|
| Total sessions created | `GET /api/identities/{id}/sessions` |
| Total follow-ups created | `GET /api/identities/{id}/plans` |
| Timeline entries per customer | `GET /api/identities/{id}/timeline` |
| No cross-store data leak | Verify staff from other store (if exists) gets 403 |
| Database backup taken | Run backup script |

---

## 8. Daily Operating Checklist (for Pilot Period)

### Start of Day

- [ ] Server running (check `systemctl status health-one-platform`)
- [ ] PostgreSQL running (`pg_isready`)
- [ ] `GET /health` → 200
- [ ] `GET /health/db` → platform_db=ok
- [ ] Frontend loads at store URL
- [ ] Staff can log in

### During Operations

- [ ] Each service recorded within 2 minutes
- [ ] Feedback captured immediately after service
- [ ] Follow-up created before customer leaves
- [ ] Timeline entries verified after each loop
- [ ] Staff notes any friction points

### End of Day

- [ ] All sessions accounted for (count matches staff recollection)
- [ ] Database backup taken (manual or cron)
- [ ] Staff feedback notes collected
- [ ] Any errors in server logs reviewed
- [ ] System left running (or stopped if preferred)

---

## 9. Risk Register

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|------------|
| R1 | PostgreSQL connection fails under load | Low | High | Single-store, low concurrency. Connection pool configured (5+10). Monitor. |
| R2 | Staff forgets workflow steps | Medium | Medium | Printed quick-reference card. Training session before pilot. |
| R3 | Customer refuses data recording | Medium | Low | Verbal consent script prepared. Skip recording for that customer — note in paper log. |
| R4 | Server hardware failure during pilot | Low | High | Daily backups. Rollback plan documented. Can revert to paper + phone for follow-ups. |
| R5 | JWT expires mid-session (8h window) | Low | Low | Staff re-login takes < 30 seconds. Token expiry displayed nowhere — add reminder in Sprint 4. |
| R6 | Network latency makes SPA feel slow | Low | Medium | Frontend is local (same server). API calls are localhost. Should be < 100ms. |
| R7 | Staff enters wrong data, no undo | Medium | Medium | Timeline is append-only. Wrong entry stays. Train staff to double-check before save. Sprint 4: add confirmation dialogs. |
| R8 | Browser compatibility (old browser) | Low | Medium | Test with store's actual browser before pilot. Vite/React supports modern Chrome/Firefox/Safari. |

---

## 10. Exit Criteria

### Pilot Success Criteria

- [ ] ≥ 1 real customer completes full manual loop
- [ ] All Timeline entries present (no data loss)
- [ ] Staff completes loop independently (no coaching)
- [ ] Staff confirms system does not block service
- [ ] No Do-Not-Ship criteria triggered (PRD-001 §7.2)
- [ ] Database backup + restore drill passed
- [ ] Founder observes one complete loop

### Pilot Failure Criteria

- [ ] Staff cannot complete loop independently after training
- [ ] Timeline entries missing or incomplete
- [ ] Data from Store A visible to Store B (if multi-store configured)
- [ ] System crash or unavailability during service hours
- [ ] Staff reports system actively blocks or slows service

### If Pilot Succeeds

→ Request **Founder approval for Pilot → Production** transition (FD-006 §4.3)
→ Begin Sprint-4 AI Integration development
→ Plan second store deployment

### If Pilot Fails

→ Fix identified issues (code or process)
→ Re-run pilot after fixes
→ Do NOT proceed to Production until Pilot passes

---

## 11. Founder Approval Required

Per FD-006 §4.3:

| Transition | Status |
|-----------|--------|
| Development Complete → Release Candidate | ✅ Approved (RC-002) |
| **Release Candidate → Pilot** | **❌ PENDING FOUNDER APPROVAL** |
| Pilot → Production | Blocked by Pilot outcome |

**This plan requires Founder approval before Pilot execution begins.**

---

## 12. Answering Three Questions

### 内部试运行前还缺什么？

```
✅ 代码就绪 — v0.3.1-rc1
✅ 部署文档 — DEPLOYMENT-CHECKLIST
✅ 备份文档 — BACKUP-RESTORE
❌ 服务器硬件 — 需要一台机器（物理或 VM）
❌ SSL 证书 — 自签名或 Let's Encrypt
❌ 培训材料 — 快速参考卡（可从本文档 §5 提取）
❌ Founder Pilot 批准 — FD-006 §4.3 要求
```

### 最小试运行配置是什么？

```
硬件:  任何可运行 Ubuntu 的机器（Mac Mini / PC / 云 VM）
软件:  Ubuntu 24.04 + Python 3.12 + Node.js 20 + PostgreSQL 16 + Nginx
人员:  1 名店员（店长或健康管理师）
客户:  至少 1 名真实到店客户
时间:  部署 1 天 + 培训 2 小时 + 试运行 1 天
```

### 多久可以开始第一次门店内部试运行？

```
Day 1: 服务器部署 (7 小时)
Day 2: 备份演练 + 员工培训 (3 小时)
Day 3: 内部试运行 (1 天)

最快: 3 天（假设服务器已就绪，可压缩到 2 天）
实际: 1 周（包括硬件采购、Founder 审批、缓冲时间）
```

---

## 13. End of Document

PILOT-001 defines the internal pilot preparation plan for v0.3.1-rc1.

**Pilot target: 3–7 days from Founder approval.**
