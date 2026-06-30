# PILOT-008 — Web-First Pilot Recommendation

Document ID : PILOT-008
Title       : First Internal Pilot — Device Recommendation
Version     : 1.0
Status      : Active
Owner       : Release Office
Created     : 2026-06-30
Depends On  : PILOT-001, ADR-002 §3.3

---

## 1. Recommendation

> **The first internal pilot should use a desktop/laptop web browser as the primary device. Mobile browser should be used for secondary validation only.**

---

## 2. Reason

### Stability First

- Store Workbench is a Web SPA (ADR-002 §3.3) — designed and tested for desktop browser viewport
- Desktop Chrome/Safari provides the most stable rendering and JavaScript execution
- Reduces variables during first pilot — isolate system issues from device issues

### Easier Debugging

- Desktop browser DevTools allow real-time inspection (F12) if something goes wrong
- Observer can see the screen alongside staff — better for training observation
- Screenshots are full-resolution and legible for post-pilot review

### Faster Data Entry

- Physical keyboard is faster than mobile touchscreen for text fields (concern description, service detail, feedback)
- Staff can type customer responses in real-time during conversation
- Reduces the "waiting for the computer" feeling that breaks service flow

### Better for First-Run Observation

- Observer standing beside staff can see the full screen
- Easier to point at UI elements during training
- Staff can focus on learning the workflow, not fighting with a small screen

---

## 3. Pilot Device Setup

### Primary Device

| Attribute | Recommendation |
|-----------|---------------|
| Device | Desktop PC or Laptop |
| Screen | ≥ 13 inch display |
| Browser | Chrome (latest) or Safari (latest) |
| Input | Physical keyboard + mouse/trackpad |
| Network | Wired Ethernet preferred; Wi-Fi acceptable |

### Secondary Device (Optional)

| Attribute | Recommendation |
|-----------|---------------|
| Device | Staff's own mobile phone |
| Browser | Mobile Safari (iOS) or Chrome (Android) |
| Purpose | Screenshots of issues, quick check of mobile rendering |
| NOT for | Primary data entry, full loop execution |

### Setup Verification (Before Pilot)

- [ ] Desktop: open `http://<server-ip>` → login page renders correctly
- [ ] Desktop: complete one dry-run loop → all 6 screens render
- [ ] Mobile: open `http://<server-ip>` → login page renders (may be zoomed)
- [ ] Mobile: complete login → verify basic navigation works

---

## 4. Validation Sequence

### Phase 1: Desktop Full Loop (Primary)

1. Staff completes full loop (Steps 1–6) on desktop for all pilot customers
2. Observer watches and takes notes
3. All data entry done via desktop

### Phase 2: Mobile Quick Check (Secondary)

After all customers served, or during a quiet moment:

1. Open the system on mobile browser
2. Check these critical pages:
   - [ ] Login page renders
   - [ ] Customer Search renders
   - [ ] Customer Summary renders (with Timeline)
   - [ ] Service Record form renders
   - [ ] Feedback form renders
3. Note any layout issues or unreadable elements
4. Do NOT attempt full data entry — visual check only

### Phase 3: Documentation

1. Photograph mobile rendering issues (if any)
2. Log in PILOT-007-ISSUE-LOG with severity:
   - P1 if page is unusable on mobile
   - P2 if layout is awkward but functional

---

## 5. Future Decision Rule

### After Pilot, Assess:

| Question | If Answer Is | Then |
|----------|------------|------|
| Do staff primarily use desktop or mobile during service? | Desktop | Keep web-first. Optimize for desktop in Sprint 4. |
| | Mobile | Prioritize PWA/mobile optimization in Sprint 5 (F10). |
| Do staff switch between devices during a single customer? | Yes | Multi-device sync needed — plan for Sprint 5+. |
| Did mobile rendering cause any P1 issues? | Yes | Add mobile responsive fixes to Sprint 4 P1 list. |
| Did mobile rendering cause no issues? | No | Defer mobile optimization to post-MVP. |

### Sprint Planning Impact

```
If DESKTOP-FIRST store:
  → Sprint 4: AI features (no PWA urgency)
  → Sprint 5: PWA as enhancement, not critical path

If MOBILE-FIRST store:
  → Sprint 4: Add mobile responsive fixes to P1 list
  → Sprint 5: PWA becomes P0 (F10 priority raised)
```

---

## 6. End of Document

PILOT-008 recommends desktop-first for the first internal pilot. Reassess after pilot data is collected.
