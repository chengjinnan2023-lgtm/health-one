# Store Service Workflow Draft

Document ID : PRODUCT-002  
Title       : Store Service Workflow Draft  
Version     : 1.0  
Status      : Baseline  
Owner       : Chief Architect  
Approver    : Founder  
Created     : 2026-06-28  
Updated     : 2026-06-28  
Depends On  : PROJECT-CONTEXT, BP-002, BP-003, BP-004, RFC-001, RFC-002, PRODUCT-001, AI-001, AI-002  
Related     : Store Workbench, MVP Execution Plan, AI Memory, Knowledge Base  

---

## 1. Purpose

This document defines the initial store service workflow for the Health One MVP.

The purpose is to convert the Health One value loop into a practical store-side operating process.

This workflow should guide:

1. Store Workbench design.
2. Store staff operation.
3. Service record design.
4. Feedback capture.
5. Follow-up task design.
6. AI summary usage.
7. Knowledge base usage.
8. MVP validation.

This document does not define final UI screens or database schema.

It defines the practical workflow that the MVP must support.

---

## 2. Core Workflow Principle

The core principle is:

> Store workflow should help staff complete real service, record useful memory, and trigger follow-up with the lowest practical burden.

The workflow should not turn staff into data-entry workers.

The workflow should help staff serve customers better.

---

## 3. MVP Store Workflow Summary

The MVP store workflow is:

```text
Customer Entry
→ Customer Lookup or Creation
→ 健康元 Activation or Update
→ Health Concern Intake
→ Service Preparation
→ Store Service
→ Service Record
→ Customer Feedback
→ AI Summary
→ Follow-Up Task
→ Customer Return
```

The workflow must support the first Health One value loop.

---

## 4. Target Store Scenario

The first MVP should focus on one practical scenario:

> A customer enters or contacts a health management store, expresses a health concern, receives a store service, provides feedback, receives follow-up, and returns or continues the health journey.

Typical concerns may include:

1. Shoulder and neck discomfort.
2. Waist and back fatigue.
3. Sports recovery.
4. General fatigue.
5. Weight management.
6. Sleep or energy issues.
7. Post-exercise recovery.
8. Long-term body condition maintenance.

The workflow should remain practical for real store use.

---

## 5. Roles in Workflow

The workflow includes the following roles:

1. Customer.
2. Store Staff.
3. Health Manager if available.
4. AI Health Companion.
5. Platform Operator or Founder during validation.

In MVP, Store Staff and Health Manager may be the same person.

The workflow should not depend on a large team.

---

## 6. Step 1: Customer Entry

Customer Entry occurs when a customer:

1. Walks into the store.
2. Contacts the store by phone or message.
3. Is referred by a coach or partner.
4. Returns after previous service.
5. Responds to follow-up.
6. Participates in store activity.

The system should support both new customers and returning customers.

The staff should quickly identify whether this is a new or existing customer.

---

## 7. Step 2: Customer Lookup or Creation

Staff should search for the customer first.

Search methods may include:

1. Name.
2. Phone.
3. Contact method.
4. Store member note.
5. Recent visit record.

If no customer exists, staff creates a new customer record.

Minimum new customer information:

1. Name or nickname.
2. Contact method.
3. Source if known.
4. Primary store.
5. Initial note if needed.

The workflow must avoid duplicate customer records where possible.

---

## 8. Step 3: 健康元 Activation or Update

After customer identification, staff should activate or update the customer's 健康元.

For a new customer, activation may include:

1. Explaining what 健康元 is.
2. Confirming customer willingness.
3. Recording main concern.
4. Recording health goal.
5. Creating initial health profile.
6. Recording basic authorization.

For a returning customer, update may include:

1. Reviewing recent service history.
2. Reviewing recent feedback.
3. Checking follow-up status.
4. Updating concern or goal.
5. Confirming current need.

Activation should be simple.

Staff should be able to explain 健康元 in plain language.

---

## 9. Step 4: Health Concern Intake

Staff records the customer's main concern.

Recommended intake information:

1. Main concern category.
2. Customer self-description.
3. Current discomfort or need.
4. Duration or recent trigger if known.
5. Health goal.
6. Staff note.
7. Whether service is suitable.
8. Whether AI summary is needed.

The intake is not a medical diagnosis.

The system should distinguish:

1. Customer self-report.
2. Staff observation.
3. AI interpretation.
4. Professional conclusion if any.

---

## 10. Step 5: Service Preparation

Before service, staff should prepare the service context.

Preparation may include:

1. Review customer summary.
2. Review main concern.
3. Review previous service record if returning.
4. Review relevant knowledge entry.
5. Select service type.
6. Confirm device availability if needed.
7. Explain service briefly to customer.
8. Confirm any basic precautions.

Service explanation should be conservative and trust-building.

It should avoid exaggerated claims.

---

## 11. Step 6: Store Service

Store Service is the real service delivered to the customer.

Examples:

1. Graphene far-infrared cabin service.
2. Sports recovery service.
3. Shoulder and neck comfort service.
4. Waist and back comfort service.
5. Fatigue recovery service.
6. Weight management support service.
7. Consultation or guidance.
8. Follow-up service.

The service should connect to the customer's concern or goal.

The service event should later become a Service Record.

---

## 12. Step 7: Device Usage if Applicable

If a device is used, staff should record simple device usage.

Possible fields:

1. Device used.
2. Start time.
3. End time.
4. Duration.
5. Usage note.
6. Customer response.
7. Related service record.

At the current stage, advanced IoT integration is not required.

Device usage should support service memory, not dominate the workflow.

---

## 13. Step 8: Service Record

After or during service, staff creates a Service Record.

Minimum required information:

1. Customer.
2. Store.
3. Staff.
4. Service type.
5. Service time.
6. Related concern.
7. Staff observation.
8. Customer immediate response.
9. Next suggested action.

Optional information:

1. Device usage.
2. Duration.
3. Service detail.
4. AI-generated service summary.
5. Follow-up suggestion.
6. Related knowledge entry.

Service Record is a core object.

It turns real service into Health Memory.

---

## 14. Step 9: Customer Feedback

Staff should capture simple customer feedback.

Minimum feedback:

1. Immediate feeling.
2. Satisfaction or comfort change.
3. Question or concern.
4. Willingness to return.
5. Preferred follow-up method.

Feedback should be easy to record.

The MVP should not use a long survey.

Feedback should help decide follow-up and next service.

---

## 15. Step 10: AI Summary

AI may generate a structured summary.

Possible AI outputs:

1. Customer context summary.
2. Service summary.
3. Follow-up suggestion.
4. Customer-facing explanation.
5. Staff-facing next action.
6. Missing information note.
7. Uncertainty note.

AI Summary should use:

1. Authorized customer context.
2. Current service record.
3. Customer feedback.
4. Relevant knowledge entries.
5. Follow-up history if available.

AI Summary should be traceable.

Staff should review important AI output before using it in sensitive customer communication.

---

## 16. Step 11: Follow-Up Task

After service and feedback, staff or AI creates a Follow-Up Task.

Follow-up task should include:

1. Customer.
2. Related service record.
3. Follow-up reason.
4. Follow-up method.
5. Planned follow-up time.
6. Responsible person.
7. Follow-up status.
8. Next action.

Follow-up is part of the value loop.

It should not be treated as optional marketing.

---

## 17. Step 12: Follow-Up Execution

Follow-up may be performed by:

1. Store staff.
2. Health manager.
3. AI-assisted message.
4. Platform operator during MVP validation.

Follow-up may ask:

1. How the customer feels after service.
2. Whether the concern improved.
3. Whether there are new questions.
4. Whether the customer wants to return.
5. Whether a next service should be arranged.

Follow-up result should update customer memory.

---

## 18. Step 13: Customer Return

Customer Return occurs when the customer:

1. Books another service.
2. Comes back to the store.
3. Responds positively to follow-up.
4. Continues communication.
5. Updates health concern or goal.
6. Participates in another service loop.

Customer Return is a key validation signal.

The MVP should measure whether the loop can repeat.

---

## 19. Step 14: Memory Update

After service, feedback, and follow-up, the system should update Health Memory.

Memory update may include:

1. Updated main concern.
2. Updated health goal.
3. New service record.
4. Feedback summary.
5. Follow-up result.
6. AI summary.
7. Staff observation.
8. Next action.

Memory update should preserve source traceability.

AI-generated memory should remain distinguishable from customer facts and staff observations.

---

## 20. Workflow States

A customer service loop may have these states:

1. New customer.
2. Existing customer.
3. 健康元 activated.
4. Concern recorded.
5. Service prepared.
6. Service completed.
7. Feedback recorded.
8. Follow-up pending.
9. Follow-up completed.
10. Return planned.
11. Loop repeated.
12. Needs review.

These states can guide Store Workbench status display.

---

## 21. Required Store Workbench Support

The Store Workbench should support this workflow through:

1. Customer search or creation.
2. 健康元 summary.
3. Concern intake.
4. Service record.
5. Device usage note.
6. Feedback record.
7. AI summary panel.
8. Follow-up task.
9. Today's tasks.
10. Customer next action.

The interface should remain simple.

---

## 22. Required Data Objects

This workflow depends on these data objects:

1. Customer.
2. Health One Identity.
3. 健康元 Profile.
4. Health Concern.
5. Health Goal.
6. Store.
7. Store Staff.
8. Service.
9. Service Record.
10. Device.
11. Device Usage Record.
12. Feedback.
13. Follow-Up Task.
14. AI Summary.
15. Knowledge Entry.
16. Authorization Record.
17. Event.
18. Insight.

The workflow should not require unnecessary additional objects in MVP.

---

## 23. Required Knowledge Support

The workflow should use knowledge entries for:

1. What is 健康元.
2. Service explanation.
3. Device explanation.
4. Common concern guidance.
5. Staff SOP.
6. Feedback collection.
7. Follow-up templates.
8. AI response boundaries.
9. Customer education.
10. Store validation notes.

Knowledge should appear at the point of use.

---

## 24. Required AI Support

AI should support the workflow by:

1. Summarizing customer context.
2. Helping structure concern intake.
3. Explaining service knowledge.
4. Summarizing service record.
5. Suggesting follow-up.
6. Drafting customer-friendly messages.
7. Identifying missing information.
8. Marking uncertainty.
9. Helping staff prepare next action.
10. Supporting customer return.

AI should not replace staff judgment.

---

## 25. Authorization Boundary

The workflow should respect authorization.

Basic rules:

1. Customer owns 健康元.
2. Store accesses customer context for service.
3. Staff records service-related information.
4. AI uses authorized context.
5. Platform reviews data for MVP validation.
6. Sensitive information should not be collected without purpose.
7. Internal knowledge should not be exposed to customers.

The MVP can use simple authorization, but should not ignore it.

---

## 26. Minimum Viable Workflow

If the first version must be extremely small, the minimum viable workflow is:

1. Create or find customer.
2. Record main concern.
3. Activate or update 健康元.
4. Record service.
5. Record feedback.
6. Generate or write summary.
7. Create follow-up task.
8. Record follow-up result.
9. Mark next action.

This minimum workflow still completes the value loop.

---

## 27. Workflow Exclusions

The first workflow should not include:

1. Full CRM pipeline.
2. Full sales funnel.
3. Full payment system.
4. Full membership hierarchy.
5. Full inventory process.
6. Full franchise operations.
7. Complex partner settlement.
8. Complex BI dashboard.
9. Full medical record system.
10. Automated diagnosis or treatment recommendation.

These are outside the MVP workflow.

---

## 28. Staff Usability Requirements

The workflow must satisfy:

1. Staff can find customer quickly.
2. Staff can record concern quickly.
3. Staff can create service record quickly.
4. Feedback can be captured simply.
5. Follow-up task is clear.
6. AI summary is useful but not disruptive.
7. Required fields are limited.
8. Next action is visible.
9. The process works during real store service.
10. Staff do not feel the system blocks service.

If staff resist the workflow, simplify it.

---

## 29. Customer Experience Requirements

The workflow should help customers feel:

1. They are remembered.
2. Their concern is understood.
3. The store service has continuity.
4. Follow-up is useful.
5. 健康元 has value.
6. AI supports service rather than replaces people.
7. Their information is treated carefully.
8. Returning has clear value.

Customer trust is more important than feature quantity.

---

## 30. Validation Questions

This workflow should be validated by asking:

1. Can staff complete the workflow in real service conditions?
2. Which step slows staff down?
3. Which step creates real customer value?
4. Does the customer understand 健康元?
5. Does the service record help the next service?
6. Does feedback improve follow-up?
7. Does AI summary help or distract?
8. Does follow-up actually happen?
9. Does the customer return?
10. Does the store operator see practical value?

These questions should guide MVP testing.

---

## 31. Success Signals

Success signals include:

1. Staff complete records consistently.
2. Customers accept 健康元 explanation.
3. Service records contain useful memory.
4. Feedback is captured.
5. Follow-up tasks are completed.
6. AI summaries are used.
7. Knowledge entries help staff explain.
8. Customers return or continue communication.
9. Store sees improved customer management.
10. The loop repeats.

---

## 32. Failure Signals

Failure signals include:

1. Staff skip the workflow.
2. Customer lookup is slow.
3. Too many fields are required.
4. Service records are low quality.
5. Feedback is missing.
6. Follow-up is not performed.
7. AI output is ignored or risky.
8. Customer does not understand 健康元.
9. The system becomes only a record burden.
10. The loop does not repeat.

Failure signals should trigger workflow review.

---

## 33. Current Baseline Decisions

As of this document version, the following workflow decisions are Baseline:

1. Store service workflow must support the first Health One value loop.
2. Staff usability is a core constraint.
3. 健康元 activation or update is part of the store workflow.
4. Health Concern Intake, Service Record, Feedback, Follow-Up, and Memory Update are core steps.
5. AI supports summary, explanation, follow-up, and missing information detection.
6. Knowledge should appear at the point of use.
7. Customer return is a key validation signal.
8. The first workflow should exclude full CRM, ERP, finance, franchise, and medical diagnosis systems.
9. Minimum viable workflow must still complete the loop.
10. Real store validation is required.

---

## 34. End of Document

PRODUCT-002 defines the initial Store Service Workflow Draft for Health One.

Future Store Workbench, data, AI, knowledge base, and MVP execution designs should remain consistent with this workflow unless reviewed and approved.
