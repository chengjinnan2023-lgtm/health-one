# PILOT-006 — Internal Pilot Runbook

Document ID : PILOT-006
Title       : v0.3.1 Internal Pilot — Store Staff Runbook
Version     : 1.0
Status      : Active
Owner       : Release Office
Audience    : Store Staff
Created     : 2026-06-30

> **This runbook is for store staff operating the Health One Store Workbench during internal pilot. No technical knowledge required.**

---

## 1. Pilot Objective

Complete the full Health One service loop with 1–5 real customers. At the end of each customer visit, the system should have:

- Customer identity created (or found)
- Health concern recorded
- Service delivered and recorded
- Customer feedback captured
- Follow-up task created
- All events visible in the Timeline

**Success means:** every step above is completed for at least one real customer, and the system did not block or slow down service.

---

## 2. Daily Startup Checklist

### Before the Store Opens

- [ ] Store computer is turned on
- [ ] Open browser (Chrome or Safari recommended)
- [ ] Go to: `http://<store-server-ip>` (get this from your store manager)
- [ ] You should see the Health One login page

```
┌─────────────────────────────────┐
│                                 │
│         Health One              │
│      Store Workbench            │
│                                 │
│   ┌─────────────────────┐       │
│   │ Username             │       │
│   ├─────────────────────┤       │
│   │ Password             │       │
│   ├─────────────────────┤       │
│   │    [ Sign In ]       │       │
│   └─────────────────────┘       │
│                                 │
└─────────────────────────────────┘
```

**If you don't see this page:** check that the computer is connected to the network. Ask your store manager for help.

---

## 3. Staff Login Instructions

1. Enter your **username** (provided by store manager)
2. Enter your **password** (provided by store manager)
3. Click **Sign In**

**Expected result:** You see the Customer Search page.

**If login fails:**
- Check that username and password are typed correctly
- If still failing, ask store manager to reset your password
- Do NOT share your password with anyone

---

## 4. Full Service Loop Steps

### Overview

```
Customer walks in
  → Step 1: Find or Create Customer
  → Step 2: View Customer Summary
  → Step 3: Record Health Concern
  → Step 4: Record Service
  → Step 5: Capture Feedback
  → Step 6: Create Follow-Up
  → Back to Summary
```

### Step 1: Find or Create Customer

**If customer has visited before:**

1. On the Customer Search page, type the customer's name in the search box
2. Wait 1–2 seconds for results to appear
3. Click on the matching customer name
4. You're now on the Customer Summary page → go to Step 2

**If this is a new customer:**

1. Click the **"+ New Customer"** button
2. Fill in:
   - **Name *** (required) — customer's name or nickname
3. Click **"Create Customer"**
4. You're now on the Customer Summary page → go to Step 2

**Tip:** The search box has a short delay after typing. Type the full name, then wait a moment for results.

### Step 2: View Customer Summary

The Customer Summary page shows:

- **Customer name** and status (pending / active / archived)
- **Health Profile** — basic info, main health concern
- **Service History** — past services and feedback
- **Follow-Up** — active follow-up tasks
- **Recent Timeline** — all events recorded for this customer

**If the customer is new (status shows "pending"):**

1. Click **"Activate 健康元"** button
2. Status changes to "active"

**Explain 健康元 to the customer:**
> "健康元 is your personal health record in our system. It helps us remember your health concerns, services you've received, and follow-up plans. Your information stays private and you control it."

### Step 3: Record Health Concern

1. From the Customer Summary page, click **"Record Concern"**
2. On the Concern Intake page:
   - **Concern Category *** — click one (肩颈 / 腰背 / 疲劳 / 运动恢复 / 体重管理 / 睡眠 / 其他)
   - **Customer Self-Description *** — what did the customer tell you? (e.g. "Long-term neck pain from computer work")
   - **Phone** — customer's phone number
   - **Health Goal** — what does the customer want to achieve?
   - **Birth Year** — optional
   - **Gender** — optional
   - **Staff Observation Notes** — any additional notes you have
3. Click **"Save"**
4. You're back on the Customer Summary page

**Tip:** Only 2 fields are required (category + description). Other fields are optional but helpful.

### Step 4: Record Service

1. From the Customer Summary page, click **"New Service"**
2. On the Service Record page:
   - **Service Type *** — click one (健康舱 / 咨询 / 检测 / 其他)
   - **Pre-Service Notes** — customer's condition before service (e.g. "Shoulder stiffness reported")
   - **Service Detail *** — what service was delivered? (e.g. "Graphene cabin 30 minutes")
   - **Suggested Next Step** — any recommendation
3. Click **"Save Service Record"**
4. You're now on the Feedback page → go to Step 5

**Tip:** Staff name is filled in automatically. You don't need to type it.

### Step 5: Capture Feedback

1. On the Feedback page, fill in:
   - **Immediate Feeling *** — how does the customer feel right now? (e.g. "Relaxed and comfortable")
   - **Comfort Change** — click one (Improved / Same / Worse)
   - **Satisfaction *** — click one (Satisfied / Neutral / Dissatisfied)
   - **Willingness to Return *** — click one (Yes / Maybe / No)
   - **Customer Questions** — any questions the customer raised
   - **Preferred Follow-Up Method** — click one (📞 Phone / 💬 WeChat / 📱 SMS / 🏪 In-Store)
2. Click **"Save Feedback"**
3. You see a confirmation page

**Tip:** Feedback should take less than 1 minute. Only 3 fields are required (feeling + satisfaction + return willingness).

### Step 6: Create Follow-Up

1. After saving feedback, click **"Create Follow-Up →"**
2. On the Follow-Up page:
   - **Reason** — click one (Service follow-up / Health check / Concern review / General check-in)
   - **Follow-Up Method *** — click one (📞 Phone / 💬 WeChat / 📱 SMS / 🏪 In-Store)
   - **Planned Date/Time *** — select when to follow up
   - **Notes** — any script or reminders for the follow-up
3. Click **"Create Follow-Up"**
4. You see a confirmation page
5. Optionally: record the follow-up result now (if customer confirms a plan), or leave for later
6. Click **"Back to Summary"** to return to Customer Summary

**Tip:** Staff name is pre-filled. You only need to choose method + date.

---

## 5. What To Record

### For Every Customer Visit

| Must Record | Where | Example |
|------------|-------|---------|
| Customer name | S1 Create/Search | "Zhang Wei" |
| Health concern | S3 Concern Intake | "肩颈 — long-term neck pain" |
| Service type | S4 Service Record | "健康舱" |
| Service detail | S4 Service Record | "Graphene cabin 30min" |
| Customer feeling | S5 Feedback | "Relaxed, shoulder feels looser" |
| Satisfaction | S5 Feedback | "Satisfied" |
| Return willingness | S5 Feedback | "Yes" |
| Follow-up method | S6 Follow-Up | "📞 Phone" |
| Follow-up date | S6 Follow-Up | "July 3, 10:00 AM" |

### What NOT To Record

- ❌ Medical diagnosis (e.g. "cervical spondylosis")
- ❌ ID numbers
- ❌ Payment information
- ❌ Other customers' information in this customer's record
- ❌ Personal opinions about the customer

---

## 6. Common Errors and What To Do

### "Sign In" doesn't work

**Check:**
1. Is the username typed correctly?
2. Is the password typed correctly? (case sensitive)
3. Is the computer connected to the network?

**If still failing:** Contact store manager. Your password may need to be reset.

### "Activate 健康元" button doesn't work

**Check:**
1. Is the customer status "pending"? (Activate only works for pending customers)
2. Wait a moment and try again.

**If still failing:** Make a note on paper. Continue serving the customer. Report after.

### "Save" button stays on "Saving..." for a long time

**Check:**
1. Wait up to 10 seconds.
2. If still spinning, the system may be slow. Do NOT click Save multiple times.
3. Make a paper note and continue serving the customer.
4. Report to store manager after the customer leaves.

### Wrong information was entered

**What you can fix:**
- Health concern: go back to S3 and update
- Service detail: the session is saved — add notes in a new session

**What you CANNOT fix:**
- Timeline entries cannot be changed. This is by design — they are a permanent record.
- If you entered wrong data, add a new correct entry. The old entry stays as a record.

### Customer doesn't want their data recorded

1. Respect their decision.
2. Do NOT create a customer record.
3. Serve them as usual, but use paper notes.
4. Do not enter their information into the system.

### Page looks wrong or blank

1. Refresh the browser page (F5 or ⌘+R).
2. If still wrong, log out and log back in.
3. If still wrong, report to store manager.

---

## 7. End-of-Day Checklist

### Before You Leave

- [ ] Count how many customers were served today
- [ ] For each customer: verify you can see them in the Customer Search page
- [ ] For each customer: check that Timeline shows today's events
- [ ] Note any errors or difficulties you experienced
- [ ] Log out of the system
- [ ] Tell store manager: "Pilot day complete — [N] customers served"

### Paper Notes Template (if needed)

```
Date: _______________
Staff: _______________

Customer 1: __________________________
  Service: ___________________________
  Feedback: __________________________
  Follow-up: ___ Yes ___ No
  Issues: ____________________________

Customer 2: __________________________
  ...
```

---

## 8. Data Backup Checklist

### For Store Manager Only

At the end of each pilot day, the store manager should:

- [ ] Confirm all customer records are visible in the system
- [ ] Take a screenshot or photo of each customer's Timeline (for backup)
- [ ] Execute database backup (technical procedure — not staff responsibility)
- [ ] Store backup in a safe location
- [ ] Record: date, number of customers, backup location

### If Something Goes Wrong

**Do NOT try to fix the computer yourself.** Contact:
1. Store manager first
2. If manager unavailable: call technical support

---

## 9. Escalation Path

```
Level 1: Store Manager
  → Can help with login issues, basic operations

Level 2: Technical Support
  → System errors, server problems, data issues
  → Contact: _______________

Level 3: Founder
  → Decision to stop pilot
  → Major system failure
  → Data loss incident
```

### When to Escalate Immediately

- System is completely unusable (won't load, won't log in)
- Customer data appears to be missing
- You see another customer's data when you shouldn't
- Any security concern

---

## 10. Success Criteria

### Pilot Day Is Successful If:

- [ ] At least 1 real customer completes the full loop (Steps 1–6)
- [ ] All Timeline entries are present and correct
- [ ] Staff completed the loop without asking for help
- [ ] Staff reports: "The system did not block or slow down my service"
- [ ] No data was lost

### Pilot Day Needs Improvement If:

- [ ] Staff needed help multiple times
- [ ] A step took too long (more than 3 minutes)
- [ ] Staff skipped a step (e.g. no feedback recorded)
- [ ] Staff found the system confusing

### Pilot Day Is Failed If:

- [ ] System was unusable at any point
- [ ] Customer data was lost
- [ ] Staff could not complete the loop
- [ ] Wrong customer's data was visible

---

## Quick Reference Card

```
╔═══════════════════════════════════════════════════╗
║                                                   ║
║  HEALTH ONE — STORE WORKBENCH                     ║
║  Quick Reference                                  ║
║                                                   ║
║  1. Open browser → login                          ║
║  2. Search customer or click "+ New Customer"     ║
║  3. Activate (if pending) → click "Activate 健康元"║
║  4. Record Concern → click category + description ║
║  5. New Service → click type + detail             ║
║  6. Feedback → click feeling + satisfaction       ║
║  7. Follow-Up → click method + date               ║
║  8. Back to Summary → verify Timeline             ║
║                                                   ║
║  Required fields marked with *                    ║
║  Staff name is filled automatically               ║
║  Timeline entries cannot be changed               ║
║                                                   ║
║  Problems? → Store Manager                        ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
```

---

## End of Document

This runbook is for store staff operating the v0.3.1 internal pilot. Keep a printed copy at the store workstation.
