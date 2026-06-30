# QA-BATCH-008 — Feedback Screen Review

Document ID : QA-BATCH-008
Title       : Sprint-3 Phase 3 Feedback Screen — UI Review
Version     : 1.0
Status      : Complete
Owner       : QA / Architecture Office
Created     : 2026-06-30
Reviewed    : DEV-035
Depends On  : SPRINT-003-PLAN, PRD-001 §4 F4, QA-BATCH-007

---

## 1. Executive Summary

| Category | Count |
|----------|-------|
| PASS | 10 |
| WARNING | 3 |
| MUST FIX | 0 |
| UX Issues | 1 |
| Test Gaps | 1 |

**Decision: ✅ APPROVE COMMIT**

Zero MUST FIX items. Three WARNINGs are forward-compatibility concerns — S6 route doesn't exist yet (expected), feedback uses structured text (acceptable MVP trade-off), feeling duplicates into post_service_notes (harmless redundancy).

---

## 2. PASS

### 2.1 Sprint-3 P0 Scope Compliance

| PRD-001 Requirement | Implementation | Match? |
|-------------------|---------------|--------|
| F4: Customer Feedback Capture | S5 screen captures feedback after service | ✅ |
| Linked to service record | `session_id` from query param → PATCH /sessions/{id} | ✅ |
| Quick feedback recording | 6 fields, 3 required | ✅ |
| ≤ 1 minute to complete | 3 required fields (chips + 1 textarea) | ✅ |
| ≤ 3 required fields | feeling + satisfaction + return willingness | ✅ |

### 2.2 Only Existing Session PATCH API Used

| API Call | Method | Endpoint | Existing? |
|---------|--------|----------|-----------|
| Save feedback | PATCH | `/api/identities/{id}/sessions/{session_id}` | ✅ DEV-033 |

✅ Zero new backend endpoints. Single PATCH call updates both `customer_feedback` and `post_service_notes`.

### 2.3 No New Database Fields

| Data Stored | Field | Added in This Batch? |
|------------|-------|---------------------|
| customer_feedback | ServiceSession.customer_feedback (Text) | ❌ Created in DEV-032 |
| post_service_notes | ServiceSession.post_service_notes (Text) | ❌ Created in DEV-032 |

✅ S5 only writes to fields that already exist in the ServiceSession model from DEV-032.

### 2.4 S4 → S5 Navigation

| Step | Implementation | Correct? |
|------|---------------|----------|
| S4 creates session | POST /sessions → returns session_id | ✅ |
| S4 navigates to S5 | `navigate(/customers/{id}/feedback?session_id={sid})` | ✅ Query param pattern |
| S5 reads session_id | `useSearchParams().get("session_id")` | ✅ |
| S5 falls back to "" | Default if param missing — fails gracefully (API error) | ⚪ See W-003 |

### 2.5 UI States

| State | Handling |
|-------|---------|
| Form display | All 6 fields visible |
| Loading | "Saving..." button text + disabled |
| Error | Red banner with API error message |
| Success | Green confirmation screen with S2/S6 navigation |
| Empty/missing session_id | PATCH call fails → error banner displayed |
| Skip | "Skip" button → back to S2 |

✅ All states handled.

### 2.6 data-testid Coverage

| Element | testid |
|---------|--------|
| Screen root | `screen-s5` |
| Feeling textarea | `feeling` |
| Comfort chips | `comfort-improved`, `comfort-same`, `comfort-worse` |
| Satisfaction chips | `sat-satisfied`, `sat-neutral`, `sat-dissatisfied` |
| Return chips | `return-yes`, `return-maybe`, `return-no` |
| Questions textarea | `questions` |
| Method chips | `method-phone`, `method-wechat`, `method-sms`, `method-in-store` |
| Save button | `save-feedback-btn` |
| Back to S2 | `back-to-s2` |
| Go to S6 | `go-to-s6` |

✅ All interactive elements have data-testid attributes for Playwright E2E.

### 2.7 customer_feedback / post_service_notes Mapping

| UI Field | Stored In | Format |
|---------|----------|--------|
| feeling | `post_service_notes` | Plain text |
| feeling | `customer_feedback` | `Feeling: {text}` |
| comfortChange | `customer_feedback` | `Comfort: Improved/Same/Worse` |
| satisfaction | `customer_feedback` | `Satisfaction: Satisfied/Neutral/Dissatisfied` |
| questions | `customer_feedback` | `Questions: {text}` |
| returnWillingness | `customer_feedback` | `Return: Yes/Maybe/No` |
| followUpMethod | `customer_feedback` | `FollowUpMethod: phone/wechat/sms/in-store` |

🔶 `feeling` is stored in both `post_service_notes` and `customer_feedback` (see W-002).

---

## 3. WARNING

### W-001: S6 "Create Follow-Up" Button Navigates to Non-Existent Route

| Attribute | Value |
|-----------|-------|
| **Severity** | Low — forward compatibility |
| **File** | `FeedbackRecordScreen.tsx:69` |
| **Finding** | The success screen shows a "Create Follow-Up →" button that navigates to `/customers/{id}/follow-up?session_id={sid}`. This route is for S6 (DEV-038 — not yet implemented). Clicking it will render a 404 or blank page. |
| **Why acceptable** | SPRINT-003-PLAN schedules S6 (Follow-Up Task) as DEV-038 in Phase 4. S5 and S6 are designed to be sequential. The button is correct forward plumbing — it will work as soon as DEV-038 adds the route. |
| **Verdict** | ACCEPTED. Route will resolve when DEV-038 is committed. No action needed. |
| **Tracking** | DEV-038 must add route `/customers/:id/follow-up` to App.tsx. |

### W-002: `feeling` Stored in Both `post_service_notes` and `customer_feedback`

| Attribute | Value |
|-----------|-------|
| **Severity** | Low — data redundancy |
| **File** | `FeedbackRecordScreen.tsx:39-41` |
| **Finding** | The PATCH payload sets both `customer_feedback` (with all structured fields including Feeling) and `post_service_notes` (with the same `feeling` value). This duplicates the customer's immediate feeling across two columns. |
| **Why acceptable** | `post_service_notes` is the staff's clinical observation field per RFC-002. In MVP, staff observation IS the customer's stated feeling, so the mapping is semantically valid. The `customer_feedback` field contains the full structured record. No data is lost — only duplicated. |
| **Verdict** | ACCEPTED for MVP. Sprint 4 may refactor to separate staff observation from customer self-report. |
| **Recommendation** | Add a comment in the code: `// MVP: staff observation = customer stated feeling. Separate in Sprint 4.` |

### W-003: Missing session_id Shows Generic API Error

| Attribute | Value |
|-----------|-------|
| **Severity** | Low — UX edge case |
| **File** | `FeedbackRecordScreen.tsx:11` |
| **Finding** | If S5 is accessed without a `session_id` query param (e.g., direct URL navigation), `sessionId` defaults to `""`. The PATCH call will fail with a 404 or 400, and the error banner will show a generic API error message. There's no specific "Missing session" message. |
| **Why acceptable** | S5 is only reachable via S4's programmatic navigation, which always includes `session_id`. Direct URL access is not a normal user flow. The generic error is sufficient for edge cases. |
| **Verdict** | ACCEPTED. Low-priority improvement: add `if (!sessionId) return <div>Missing session</div>` before the form. |

---

## 4. MUST FIX

**None.** No blocking issues found.

---

## 5. UX Issues

### UX-001: "Comfort Change" Chip Has No Deselect

| Attribute | Value |
|-----------|-------|
| **Severity** | Low |
| **Finding** | Once a comfort change option is selected, clicking it again does not deselect. There's no way to clear the selection. This is consistent with S3 (category selector) but may confuse users who want to skip this field. |
| **Recommendation** | Add click-to-deselect: `onClick={() => setComfortChange(comfortChange === opt ? "" : opt)}`. Same fix applies to Satisfaction and Return Willingness chips. |
| **Verdict** | DEFERRED to Sprint 3 Phase 6 (DEV-031 cleanup scope). Not blocking. |

---

## 6. Test Gaps

### TG-001: No Playwright Test for S4→S5 Flow

| Attribute | Value |
|-----------|-------|
| **Severity** | Low |
| **Finding** | No E2E test covers the S4→S5 navigation and feedback submission. The screens have data-testid attributes ready for Playwright. |
| **Verdict** | ACCEPTED. DEV-041 (E2E Playwright) is scheduled for Phase 6. S5 testids are ready. |

---

## 7. Compliance Matrix

| Source | Requirement | Status |
|--------|------------|--------|
| SPRINT-003-PLAN DEV-035 | S5: Feedback captured via PATCH /sessions | ✅ |
| PRD-001 §4 F4 | Feedback ≤ 1 minute, ≤ 3 required fields | ✅ 3 required (feeling, satisfaction, return) |
| PRD-001 §4 F4 | Linked to service record | ✅ session_id query param |
| PRODUCT-003 §10 | Quick feedback: feeling, comfort, satisfaction, questions, return, method | ✅ All 6 fields |
| SPRINT-003-PLAN | No new backend endpoints | ✅ Uses existing PATCH /sessions |
| SPRINT-003-PLAN | No new database fields | ✅ customer_feedback + post_service_notes exist from DEV-032 |

---

## 8. Recommendation

### ✅ APPROVE COMMIT

S5 Feedback screen:
- Uses only existing Session PATCH API (zero new endpoints)
- Writes only to existing database fields (zero new columns)
- 3 required fields (feeling + satisfaction + return willingness) — matches PRD-001 ≤ 3
- 6 fields total — quick to complete (≤ 1 minute)
- S4→S5 navigation via query param (session_id)
- S6 forward navigation ready (route pending DEV-038)
- Loading/error/success/skip states present
- data-testid attributes on all interactive elements

### Pre-Commit Checklist

- [x] Only existing PATCH API used
- [x] No new DB fields
- [x] 3 required fields per PRD-001
- [x] S4→S5 navigation correct
- [x] Error/loading/success states
- [x] data-testid attributes
- [x] Lint clean + build + tsc
- [ ] W-001: DEV-038 must add `/customers/:id/follow-up` route

---

## 9. End of Document

QA-BATCH-008 completes the UI review of Sprint-3 Phase 3 Feedback Screen (DEV-035).

**Decision: APPROVE COMMIT.**
