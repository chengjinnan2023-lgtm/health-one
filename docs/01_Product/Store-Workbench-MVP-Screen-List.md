# Store Workbench MVP Screen List

Document ID : PRODUCT-003  
Title       : Store Workbench MVP Screen List  
Version     : 1.0  
Status      : Baseline  
Owner       : Chief Architect  
Approver    : Founder  
Created     : 2026-06-28  
Updated     : 2026-06-28  
Depends On  : PRODUCT-001, PRODUCT-002, RFC-001, RFC-002, RFC-003, RFC-004, RFC-005  
Related     : MVP Technical Implementation Plan, Initial Database Design, AI Memory, Knowledge Base, Real Store Validation Plan  

---

## 1. Purpose

This document defines the first MVP screen list for the Health One Store Workbench.

The purpose is to prevent frontend implementation from becoming a broad CRM, ERP, dashboard, or admin system.

The Store Workbench MVP should include only screens needed to complete and validate the first Health One value loop in a real store scenario.

---

## 2. Screen Design Principle

The screen design principle is:

> Each MVP screen must help store staff complete a real workflow step.

A screen should exist only if it supports:

1. Customer lookup or creation.
2. 健康元 activation or update.
3. Health concern intake.
4. Service record.
5. Feedback capture.
6. Follow-up task.
7. AI summary use.
8. Knowledge use.
9. Operator review.
10. Real store validation.

Do not create screens merely because a complete system might need them later.

---

## 3. MVP Screen Boundary

The first Store Workbench MVP includes these screens:

1. Dashboard / Today's Tasks.
2. Customer Search / Create.
3. Customer 健康元 Summary.
4. Health Concern Intake.
5. Service Record.
6. Feedback Record.
7. Follow-Up Task.
8. AI Summary Panel.
9. Knowledge Entry View.
10. Operator Review.

These are the only required first MVP screens.

---

## 4. Explicit Screen Exclusions

The first MVP should not include:

1. Full CRM pipeline screen.
2. Full sales funnel screen.
3. Full membership hierarchy screen.
4. Full finance dashboard.
5. Full inventory management screen.
6. Full franchise management screen.
7. Full partner settlement screen.
8. Full marketplace admin screen.
9. Full BI analytics dashboard.
10. Full employee performance dashboard.
11. Full medical record screen.
12. Full diagnosis workflow screen.
13. Full digital human management screen.
14. Full marketing automation screen.

These exclusions protect MVP focus.

---

## 5. Screen 1: Dashboard / Today's Tasks

Purpose:

> Show staff what needs attention today.

Primary users:

1. Store Staff.
2. Health Manager.
3. Store Operator.

Core functions:

1. Show today's pending follow-ups.
2. Show recent customers.
3. Show incomplete service records if any.
4. Show quick create customer.
5. Show quick search customer.
6. Show next actions.
7. Show simple workflow status.

Required data:

1. Customer.
2. Follow-Up Task.
3. Service Record.
4. Event.
5. Store Staff.

MVP rule:

> Dashboard should remain simple. It is not a BI dashboard.

---

## 6. Screen 2: Customer Search / Create

Purpose:

> Help staff find or create a customer quickly.

Primary users:

1. Store Staff.
2. Store Operator.

Core functions:

1. Search by name.
2. Search by phone or contact method.
3. Display matching customers.
4. Create new customer.
5. Avoid obvious duplicates.
6. Show activation status.
7. Open customer 健康元 summary.

Required fields for creation:

1. Name or nickname.
2. Phone or contact method.
3. Primary store.
4. Source if available.

Required data:

1. Customer.
2. Health One Identity.
3. Store.

MVP rule:

> If staff cannot find or create a customer quickly, the workflow breaks.

---

## 7. Screen 3: Customer 健康元 Summary

Purpose:

> Show the staff a simple, useful customer context before service.

Primary users:

1. Store Staff.
2. Health Manager.
3. Platform Operator during validation.

Core functions:

1. Show customer basic information.
2. Show 健康元 activation status.
3. Show main health concern.
4. Show main health goal.
5. Show recent service record.
6. Show recent feedback.
7. Show pending follow-up.
8. Show latest AI summary.
9. Show next suggested action.
10. Navigate to concern intake, service record, feedback, or follow-up.

Required data:

1. Customer.
2. Health One Identity.
3. Health One Profile.
4. Health Concern.
5. Health Goal.
6. Service Record.
7. Feedback Record.
8. Follow-Up Task.
9. AI Summary.

MVP rule:

> The summary should be short enough for staff to understand quickly.

---

## 8. Screen 4: Health Concern Intake

Purpose:

> Record why the customer came and what needs attention.

Primary users:

1. Store Staff.
2. Health Manager.

Core functions:

1. Select concern category.
2. Record customer self-description.
3. Record staff note.
4. Record health goal.
5. Link concern to customer.
6. Optionally request AI summary.
7. Save intake.

Recommended categories:

1. Shoulder and neck.
2. Waist and back.
3. Fatigue.
4. Sports recovery.
5. Weight management.
6. Sleep.
7. Energy.
8. Other.

Required data:

1. Customer.
2. Health Concern.
3. Health Goal.
4. Store Staff.
5. Event.

MVP rule:

> Intake is not medical diagnosis. It records service-relevant context.

---

## 9. Screen 5: Service Record

Purpose:

> Record the real store service delivered to the customer.

Primary users:

1. Store Staff.
2. Health Manager.

Core functions:

1. Select customer.
2. Select service type.
3. Select staff.
4. Record service time.
5. Link health concern.
6. Record staff observation.
7. Record customer immediate response.
8. Record next suggested action.
9. Save service record.
10. Optionally generate AI service summary.

Required data:

1. Customer.
2. Store.
3. Store Staff.
4. Service.
5. Service Record.
6. Health Concern.
7. AI Summary.
8. Event.

Optional data:

1. Device.
2. Device Usage Record.

MVP rule:

> Service Record is a core screen. It connects real service to Health Memory.

---

## 10. Screen 6: Feedback Record

Purpose:

> Capture customer feedback after service.

Primary users:

1. Store Staff.
2. Health Manager.

Core functions:

1. Select related service record.
2. Record immediate feeling.
3. Record comfort change.
4. Record satisfaction.
5. Record question or concern.
6. Record willingness to return.
7. Record preferred follow-up method.
8. Save feedback.
9. Trigger follow-up task if needed.

Required data:

1. Customer.
2. Service Record.
3. Feedback Record.
4. Follow-Up Task.
5. Event.

MVP rule:

> Feedback should be quick. It is not a long survey.

---

## 11. Screen 7: Follow-Up Task

Purpose:

> Ensure service does not end when the customer leaves.

Primary users:

1. Store Staff.
2. Health Manager.
3. Platform Operator during validation.

Core functions:

1. Create follow-up task.
2. Link to customer.
3. Link to service record.
4. Set follow-up reason.
5. Set follow-up method.
6. Set planned time.
7. Assign responsible staff.
8. Mark status.
9. Record follow-up result.
10. Record next action.

Required data:

1. Customer.
2. Service Record.
3. Follow-Up Task.
4. Store Staff.
5. AI Summary.
6. Event.

MVP rule:

> Follow-up is part of the value loop, not optional marketing.

---

## 12. Screen 8: AI Summary Panel

Purpose:

> Provide bounded AI assistance to staff.

Primary users:

1. Store Staff.
2. Health Manager.
3. Platform Operator during validation.

Core functions:

1. Show customer context summary.
2. Generate service summary.
3. Generate follow-up suggestion.
4. Show uncertainty note.
5. Show source context note.
6. Save AI summary.
7. Link AI summary to related object.
8. Mark review status if needed.

Required data:

1. Customer.
2. Health Concern.
3. Service Record.
4. Feedback Record.
5. Follow-Up Task.
6. AI Summary.
7. Knowledge Entry.
8. Event.

MVP rule:

> AI supports staff. AI does not replace staff judgment.

---

## 13. Screen 9: Knowledge Entry View

Purpose:

> Provide approved knowledge at the point of use.

Primary users:

1. Store Staff.
2. Health Manager.
3. Platform Operator.
4. AI system.

Core functions:

1. View service explanation.
2. View device explanation.
3. View concern guidance.
4. View follow-up templates.
5. View customer education content.
6. View AI boundary notes.
7. Filter by category.
8. Use knowledge in AI summary or staff explanation.

Required data:

1. Knowledge Entry.
2. Service.
3. Health Concern category.
4. Device type if applicable.

MVP rule:

> Knowledge should be small, useful, and reviewed. It is not a document dump.

---

## 14. Screen 10: Operator Review

Purpose:

> Help Founder or platform operator review MVP loop progress.

Primary users:

1. Founder.
2. Platform Operator.
3. Chief Architect during review.

Core functions:

1. View recent customers.
2. View recent service records.
3. View pending and completed follow-ups.
4. View AI summary usage.
5. View feedback status.
6. View customer return status.
7. View simple event timeline.
8. Identify workflow gaps.
9. Export or summarize validation notes if needed.

Required data:

1. Customer.
2. Service Record.
3. Feedback Record.
4. Follow-Up Task.
5. AI Summary.
6. Event.
7. Knowledge Entry.

MVP rule:

> Operator Review supports learning. It is not a full BI dashboard.

---

## 15. Navigation Structure

Recommended navigation:

```text
Dashboard
├── Customer Search / Create
│   └── Customer 健康元 Summary
│       ├── Health Concern Intake
│       ├── Service Record
│       ├── Feedback Record
│       ├── Follow-Up Task
│       └── AI Summary Panel
├── Knowledge Entry View
└── Operator Review
```

Navigation should be simple.

Store staff should not need to understand the full system architecture.

---

## 16. First Build Priority

Recommended first build order:

1. Customer Search / Create.
2. Customer 健康元 Summary.
3. Health Concern Intake.
4. Service Record.
5. Feedback Record.
6. Follow-Up Task.
7. Dashboard / Today's Tasks.
8. AI Summary Panel.
9. Knowledge Entry View.
10. Operator Review.

The non-AI service loop should be built before advanced AI.

---

## 17. Minimum Screen Set

If the first build must be even smaller, the minimum set is:

1. Customer Search / Create.
2. Customer 健康元 Summary.
3. Health Concern Intake.
4. Service Record.
5. Feedback Record.
6. Follow-Up Task.

This minimum set can complete the first value loop manually.

AI Summary and Knowledge Entry View can be added after the manual loop works.

---

## 18. Screen Review Criteria

Each screen should be reviewed by asking:

1. Does this screen support the value loop?
2. Can staff understand it quickly?
3. Are required fields minimal?
4. Is the next action clear?
5. Does it avoid unnecessary complexity?
6. Does it support real store use?
7. Does it preserve trust?
8. Does it respect authorization?
9. Does it generate useful data?
10. Can it be tested in one store?

If the answer is no, simplify the screen.

---

## 19. Data Entry Rules

Screens should collect minimum useful data.

Rules:

1. Avoid long forms.
2. Avoid unnecessary personal data.
3. Avoid medical diagnosis fields.
4. Separate customer self-report from staff note.
5. Keep AI summary distinct from facts.
6. Link records to source objects.
7. Use status fields where useful.
8. Prefer quick selection where possible.
9. Allow staff notes but do not require too many.
10. Keep the service loop moving.

---

## 20. AI Screen Rules

AI-related UI should follow these rules:

1. AI output should be clearly marked.
2. AI uncertainty should be visible.
3. Source context should be traceable where possible.
4. Staff should review important AI output.
5. AI should not make medical diagnosis.
6. AI should not pressure customers.
7. AI should not overwrite customer facts.
8. AI should support follow-up and explanation.
9. AI should remain bounded in MVP.
10. AI should not become the whole product.

---

## 21. Knowledge Screen Rules

Knowledge UI should follow these rules:

1. Show relevant knowledge at the point of use.
2. Separate customer-facing and internal knowledge.
3. Keep content short and practical.
4. Use categories.
5. Avoid unsupported claims.
6. Allow future review status.
7. Support AI retrieval later.
8. Avoid dumping large documents into staff workflow.
9. Link knowledge to service, concern, or device when useful.
10. Keep MVP knowledge small.

---

## 22. Authorization Considerations

Screens should respect basic authorization:

1. Staff sees service-relevant customer context.
2. Customer-owned health memory should not be unrestricted.
3. Internal-only knowledge should not be shown to customers.
4. AI should only use authorized context.
5. Platform operator review should be bounded.
6. Sensitive information should not be over-collected.

The MVP can implement simple boundaries, but should not ignore them.

---

## 23. Validation Questions

During MVP testing, evaluate:

1. Which screen does staff use first?
2. Which screen causes delay?
3. Which fields are unnecessary?
4. Which screen creates the most value?
5. Can staff complete the full workflow?
6. Does AI Summary help or distract?
7. Does Knowledge Entry View help explanation?
8. Can follow-up be completed?
9. Does Operator Review show useful gaps?
10. Which screen should be simplified first?

These questions should guide iteration.

---

## 24. Success Signals

Success signals include:

1. Staff can create or find customer quickly.
2. Staff can activate or update 健康元.
3. Staff can record concern quickly.
4. Staff can create service record consistently.
5. Staff can capture feedback.
6. Follow-up task is clear.
7. AI summary is useful after manual loop works.
8. Knowledge entries help staff explain.
9. Operator can review loop progress.
10. Customer return can be tracked.

---

## 25. Failure Signals

Failure signals include:

1. Staff cannot find customer quickly.
2. Forms are too long.
3. Staff skip service records.
4. Feedback is not captured.
5. Follow-up task is unclear.
6. AI summary distracts or confuses.
7. Knowledge screen is not used.
8. Operator cannot understand workflow gaps.
9. Screens feel like CRM burden.
10. The loop does not repeat.

Failure should trigger screen simplification.

---

## 26. Current Baseline Screen Decisions

As of this document version, the following screen decisions are Baseline:

1. Store Workbench MVP includes 10 possible screens.
2. The minimum manual loop can be completed with 6 screens.
3. Customer Search / Create and Customer 健康元 Summary are highest priority.
4. Service Record and Feedback Record are core screens.
5. Follow-Up Task is required.
6. AI Summary Panel should come after or alongside the manual loop, not before it.
7. Knowledge Entry View should remain small and practical.
8. Operator Review supports validation, not full BI.
9. Full CRM, ERP, finance, franchise, marketplace, and BI screens are excluded.
10. Staff usability determines screen success.

---

## 27. End of Document

PRODUCT-003 defines the Store Workbench MVP Screen List.

Future frontend implementation, workflow design, data design, AI integration, and store validation should remain consistent with this screen list unless reviewed and approved.
