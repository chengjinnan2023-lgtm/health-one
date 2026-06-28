# Store Workbench Initial Product Outline

Document ID : PRODUCT-001  
Title       : Store Workbench Initial Product Outline  
Version     : 1.0  
Status      : Baseline  
Owner       : Chief Architect  
Approver    : Founder  
Created     : 2026-06-28  
Updated     : 2026-06-28  
Depends On  : PROJECT-CONTEXT, BP-002, BP-003, BP-004, ADR-001, RFC-001  
Related     : MVP Data Object Draft, AI Memory, Store Service Workflow  

---

## 1. Purpose

This document defines the initial product outline for the Health One Store Workbench.

The Store Workbench is the store-side operating tool for the first MVP.

Its purpose is to help store staff complete the first Health One value loop:

1. Recognize or create customer.
2. Activate or update 健康元.
3. Record customer health concern.
4. Record service.
5. Record feedback.
6. Trigger follow-up.
7. Support customer return.

This document does not define final UI design or engineering implementation.

It defines the first product boundary for store-side usage.

---

## 2. Product Principle

The Store Workbench follows one core principle:

> Help store staff complete the value loop with the lowest practical burden.

The Store Workbench should not become a complex CRM, ERP, sales system, or headquarters management platform in the MVP.

It should help real store staff serve real customers more consistently.

---

## 3. Target User

The primary user is:

> Store Staff

In the MVP stage, Store Staff may include:

1. Store receptionist.
2. Health service staff.
3. Health manager.
4. Store owner.
5. Founder or operator during validation.

The system should assume the user may not have strong technical ability.

The workflow must be simple, fast, and clear.

---

## 4. Core Store Scenario

The first Store Workbench scenario is:

1. Customer arrives at store or contacts store.
2. Staff searches or creates customer.
3. Staff records main health concern.
4. Staff activates or updates 健康元.
5. Staff delivers or records store service.
6. Staff records customer feedback.
7. Staff creates or confirms follow-up.
8. AI generates summary or suggestion.
9. Staff sees next action.
10. Customer returns or continues the health journey.

The workbench must support this scenario before adding broader functions.

---

## 5. What Store Workbench Is

The Store Workbench is:

1. A customer service context tool.
2. A 健康元 activation tool.
3. A service record tool.
4. A feedback capture tool.
5. A follow-up coordination tool.
6. A store-side AI assistance entry.
7. A basic operating memory tool.

It is the store-side execution interface of the Health One value loop.

---

## 6. What Store Workbench Is Not

In the MVP stage, the Store Workbench is not:

1. Full CRM.
2. Full ERP.
3. Full membership system.
4. Full marketplace backend.
5. Full finance system.
6. Full franchise management system.
7. Full employee management system.
8. Full BI dashboard.
9. Full marketing automation system.
10. Full medical diagnosis system.

These may be future modules, but they should not enter the MVP store workbench.

---

## 7. Core Screens

The MVP Store Workbench may include the following core screens:

1. Dashboard.
2. Customer Search / Create.
3. Customer Health One Summary.
4. Health Concern Intake.
5. Service Record.
6. Feedback Record.
7. Follow-Up Task.
8. Knowledge / Service Explanation.
9. AI Summary Panel.
10. Today's Tasks.

These screens should remain lightweight.

---

## 8. Screen: Dashboard

The Dashboard should show a simple operating overview.

Possible elements:

1. Today's customers.
2. Pending follow-ups.
3. Recent service records.
4. Customers needing attention.
5. Quick create customer.
6. Quick service record.
7. Basic loop completion status.

The Dashboard should not become a complex analytics system in MVP.

---

## 9. Screen: Customer Search / Create

This screen should help staff quickly identify the customer.

Required capabilities:

1. Search by name.
2. Search by phone or contact method.
3. Create new customer.
4. Avoid duplicate customer records.
5. Show basic customer status.
6. Show whether 健康元 has been activated.

The goal is speed.

If staff cannot find or create a customer quickly, the workflow breaks.

---

## 10. Screen: Customer Health One Summary

This screen shows the customer's basic 健康元 summary.

It may include:

1. Customer name.
2. Main health concern.
3. Health goal.
4. Recent service history.
5. Recent feedback.
6. Follow-up status.
7. AI summary.
8. Next suggested action.

This screen should not show too much information.

It should help staff quickly understand the customer before service.

---

## 11. Screen: Health Concern Intake

This screen records why the customer came.

Recommended fields:

1. Main concern.
2. Concern category.
3. Customer self-description.
4. Duration or recent occurrence.
5. Health goal.
6. Staff note.
7. Whether AI summary is needed.

The intake should not imitate a medical diagnosis form.

It should record service-relevant context.

---

## 12. Screen: Service Record

This screen records the service delivered.

Recommended fields:

1. Customer.
2. Store.
3. Staff.
4. Service type.
5. Service time.
6. Device used if applicable.
7. Duration if applicable.
8. Customer concern linked to service.
9. Staff observation.
10. Service summary.
11. Next suggested action.

This is one of the most important screens.

The Service Record connects real store activity to Health Memory.

---

## 13. Screen: Feedback Record

This screen captures customer feedback.

Recommended fields:

1. Immediate feeling.
2. Comfort change.
3. Satisfaction.
4. Question or concern.
5. Willingness to return.
6. Preferred follow-up method.
7. Staff note.

Feedback should be easy to record.

The MVP does not need complex survey logic.

---

## 14. Screen: Follow-Up Task

This screen manages follow-up.

Recommended fields:

1. Customer.
2. Related service record.
3. Follow-up reason.
4. Follow-up time.
5. Responsible person.
6. Follow-up method.
7. Follow-up status.
8. Follow-up result.
9. Next action.

Follow-up is part of the Health One value loop.

It should not be treated as optional.

---

## 15. Screen: Knowledge / Service Explanation

This screen helps staff explain services consistently.

It may include:

1. Service descriptions.
2. Device descriptions.
3. Common concern guidance.
4. Precaution notes.
5. Follow-up templates.
6. Customer education material.
7. Internal staff notes.

This screen can begin as a simple structured knowledge list.

Advanced RAG is not required at the first MVP stage.

---

## 16. Screen: AI Summary Panel

The AI Summary Panel supports staff and customer communication.

It may provide:

1. Customer context summary.
2. Service summary.
3. Follow-up suggestion.
4. Explanation draft.
5. Staff communication prompt.
6. Uncertainty note.
7. Knowledge reference.

AI output should be clearly marked as AI-generated.

AI should not claim medical certainty.

---

## 17. Screen: Today's Tasks

This screen shows what staff need to do.

Possible tasks:

1. Follow up with customer.
2. Complete service record.
3. Review feedback.
4. Contact inactive customer.
5. Confirm next service.
6. Review AI summary.
7. Update customer concern.

Tasks help convert system memory into real action.

---

## 18. MVP Store Workflow

The MVP workflow should be:

1. Staff opens Store Workbench.
2. Staff searches or creates customer.
3. Staff views or activates 健康元.
4. Staff records customer concern.
5. Staff records service.
6. Staff records feedback.
7. AI generates summary or follow-up suggestion.
8. Staff confirms follow-up task.
9. Customer receives follow-up.
10. Staff sees next action.

This workflow should be tested in real store conditions.

---

## 19. Required MVP Functions

The Store Workbench MVP must support:

1. Customer create/search.
2. 健康元 summary.
3. Health concern record.
4. Service record.
5. Feedback record.
6. Follow-up task.
7. AI summary.
8. Basic knowledge access.
9. Next action display.
10. Basic status tracking.

These are required because they support the first value loop.

---

## 20. Optional Functions

Optional functions may include:

1. Simple appointment note.
2. Simple package usage note.
3. Simple customer tag.
4. Simple store summary.
5. Simple export.
6. Simple message template.

Optional functions should not delay the required loop.

---

## 21. Explicit Exclusions

Do not build the following in the first Store Workbench MVP:

1. Full CRM.
2. Full ERP.
3. Full finance system.
4. Full inventory system.
5. Full membership hierarchy.
6. Full franchise management.
7. Complex sales funnel.
8. Complex commission settlement.
9. Complex marketing automation.
10. Complex BI dashboard.

These exclusions protect the MVP.

---

## 22. Staff Usability Requirements

The Store Workbench must meet these usability requirements:

1. Fast to open.
2. Easy to understand.
3. Minimal required fields.
4. Clear next action.
5. Easy service record creation.
6. Easy feedback capture.
7. No unnecessary complexity.
8. Useful AI summary.
9. Simple task list.
10. Practical for real store operations.

If staff avoid using it, the product design must be reviewed.

---

## 23. Data Entry Principle

The workbench should collect minimum useful data.

Data should be collected only when it supports:

1. Customer service.
2. Health memory.
3. Follow-up.
4. AI summary.
5. Store operation.
6. Trust.
7. Future learning.

Avoid collecting data that no one uses.

---

## 24. AI Integration Principle

AI should support the Store Workbench by:

1. Summarizing customer context.
2. Generating service summary.
3. Suggesting follow-up.
4. Explaining service knowledge.
5. Helping staff communicate.
6. Identifying missing information.
7. Marking uncertainty.

AI should not replace staff judgment.

AI should not create unsupported medical conclusions.

---

## 25. Knowledge Integration Principle

The Store Workbench should connect to the Knowledge Base.

The first version may use simple structured Markdown or lightweight content entries.

Knowledge should help staff:

1. Explain services.
2. Answer common questions.
3. Follow standard language.
4. Use follow-up templates.
5. Understand device and service notes.

Knowledge should improve consistency.

---

## 26. Authorization Principle

The Store Workbench should respect basic authorization boundaries.

Staff should access only what is needed for service.

AI should use only authorized customer context.

Customer health memory should not be treated as unrestricted store property.

The MVP should begin with simple but clear access boundaries.

---

## 27. Validation Questions

The first Store Workbench should be validated by asking:

1. Can staff find or create a customer quickly?
2. Can staff explain 健康元 simply?
3. Can staff record a service without burden?
4. Can staff capture feedback easily?
5. Can follow-up actually happen?
6. Does AI summary help staff?
7. Does the customer feel more understood?
8. Does the store see practical value?
9. Does the loop repeat?
10. What slows down real store use?

These questions should guide MVP iteration.

---

## 28. Success Signals

Success signals include:

1. Staff use the workbench without strong resistance.
2. Service records are created consistently.
3. Feedback is captured.
4. Follow-up tasks are completed.
5. Customers understand the value of 健康元.
6. AI summaries are useful.
7. Store operator sees improved customer management.
8. Customers return or continue the health journey.
9. Data helps next service.
10. The workflow can be repeated.

---

## 29. Failure Signals

Failure signals include:

1. Staff avoid the system.
2. Data entry takes too long.
3. Customer lookup is difficult.
4. Service record is incomplete.
5. Feedback is not captured.
6. Follow-up does not happen.
7. AI output is ignored.
8. Staff feel burdened.
9. Customer does not understand the value.
10. System becomes only a record-keeping burden.

These signals should trigger product review.

---

## 30. Current Baseline Decisions

As of this document version, the following Store Workbench decisions are Baseline:

1. Store Workbench is the store-side execution tool for the first value loop.
2. Store Staff is the primary user.
3. The MVP workbench must remain simple.
4. Service Record, Feedback, Follow-Up, AI Summary, and Knowledge Access are core.
5. The workbench must not become full CRM, ERP, finance, franchise, or marketplace system in MVP.
6. Staff usability is a critical success factor.
7. AI supports staff but does not replace staff judgment.
8. Knowledge Base should support consistent service explanation.
9. Authorization boundaries should exist from the beginning.
10. Real store validation is required.

---

## 31. End of Document

This document defines the initial product outline for the Health One Store Workbench.

Future UI, workflow, data, AI, and engineering designs should remain consistent with this outline.
