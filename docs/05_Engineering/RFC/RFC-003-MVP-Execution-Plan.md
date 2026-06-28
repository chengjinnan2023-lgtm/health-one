# RFC-003 MVP Execution Plan

Document ID : RFC-003  
Title       : MVP Execution Plan  
Version     : 1.0  
Status      : Baseline  
Owner       : Chief Architect  
Approver    : Founder  
Created     : 2026-06-28  
Updated     : 2026-06-28  
Depends On  : REL-003, PROJECT-CONTEXT, ADR-001, RFC-001, RFC-002, PRODUCT-001, PRODUCT-002, AI-001, AI-002  
Related     : MVP Technical Implementation Plan, Initial Database Design, Store Workbench MVP Screens, Real Store Validation Plan  

---

## 1. Purpose

This document defines the controlled MVP execution plan for Health One.

The purpose is to move from execution preparation into controlled MVP planning without jumping into uncontrolled coding.

This document should guide:

1. MVP implementation sequence.
2. Store Workbench first build.
3. Data object implementation priority.
4. AI memory and RAG implementation boundary.
5. Knowledge base MVP content preparation.
6. Real store validation.
7. Claude Code execution permissions.
8. Review checkpoints.

This document does not define final technical implementation details.

It defines the execution order and control boundary.

---

## 2. Current Stage

Current completed stages:

1. Phase A: Foundation Baseline.
2. Phase B: Product and Architecture Blueprint Baseline.
3. Phase C: Execution Preparation Baseline.

Current stage:

> Phase D: Controlled MVP Planning

Phase D prepares the project for limited implementation.

Phase D should not become uncontrolled full-scale development.

---

## 3. MVP Execution Principle

The MVP execution principle is:

> Build only what is necessary to complete and validate the first Health One value loop in a real store scenario.

The MVP should not try to become a complete platform.

The first implementation must remain small, observable, and usable.

---

## 4. First MVP Goal

The first MVP goal is to validate this loop:

```text
Customer Entry
→ Customer Lookup or Creation
→ 健康元 Activation or Update
→ Health Concern Intake
→ Store Service
→ Service Record
→ Customer Feedback
→ AI Summary
→ Follow-Up Task
→ Customer Return
```

The MVP succeeds only if this loop can be completed in real store conditions.

---

## 5. First Validation Scenario

The first validation scenario should be:

> A real store staff member uses Health One to create or find a customer, record a health concern, complete a store service, record feedback, trigger follow-up, and support customer return.

The first scenario should focus on:

1. One store.
2. One or a few staff members.
3. One primary service workflow.
4. One limited set of health concerns.
5. One follow-up process.
6. One simple AI summary flow.
7. One small knowledge base.

The first scenario should not involve all stores or all services.

---

## 6. MVP User Roles

The first MVP should support three roles:

1. Customer.
2. Store Staff.
3. Platform Operator / Founder.

Do not add complex role systems in the first execution.

Store Staff and Health Manager may be the same person.

Platform Operator and Founder may be the same person during validation.

---

## 7. Phase D Work Breakdown

Phase D should include the following planning work:

1. MVP Technical Implementation Plan.
2. Initial Database Design Proposal.
3. Store Workbench MVP Screen List.
4. Knowledge Base MVP Content List.
5. AI Prompt and Memory Policy Draft.
6. Real Store Validation Plan.
7. MVP Build Task List.
8. Phase D Release Log.

These documents should prepare controlled implementation.

---

## 8. MVP Build Sequence

The recommended MVP build sequence is:

1. Project technical setup review.
2. Initial database design.
3. Store Workbench screen skeleton.
4. Customer create/search.
5. 健康元 profile summary.
6. Health concern intake.
7. Service record.
8. Feedback record.
9. Follow-up task.
10. AI summary integration.
11. Knowledge base MVP content.
12. Event tracking.
13. Basic authorization boundary.
14. Real store validation workflow.
15. Iteration after validation.

This order may be adjusted after technical review.

---

## 9. Implementation Slice 1: Foundation Setup

Purpose:

> Prepare the technical project for controlled implementation.

Possible tasks:

1. Confirm current codebase state if any exists.
2. Confirm tech stack.
3. Confirm local development environment.
4. Confirm deployment target if needed.
5. Confirm database choice.
6. Confirm AI provider boundary.
7. Confirm repo structure for code.
8. Confirm testing approach.

This slice should not build product features yet.

---

## 10. Implementation Slice 2: Customer and 健康元

Purpose:

> Create the minimum customer identity and 健康元 profile capability.

Required functions:

1. Create customer.
2. Search customer.
3. View customer basic information.
4. Activate 健康元.
5. Record main health concern.
6. Record main health goal.
7. View 健康元 summary.

This is the first product capability.

---

## 11. Implementation Slice 3: Store Service Record

Purpose:

> Record real store service and turn it into health memory.

Required functions:

1. Select customer.
2. Select store.
3. Select staff.
4. Select service type.
5. Record service time.
6. Record staff observation.
7. Record customer immediate response.
8. Save service summary.
9. Link service to customer memory.

This slice is central to Health One.

---

## 12. Implementation Slice 4: Feedback and Follow-Up

Purpose:

> Continue the service loop after the store service.

Required functions:

1. Record feedback.
2. Record willingness to return.
3. Create follow-up task.
4. Assign responsible staff.
5. Set follow-up time.
6. Mark follow-up status.
7. Record follow-up result.
8. Update next action.

This slice tests continuity.

---

## 13. Implementation Slice 5: AI Summary

Purpose:

> Use AI to support staff and customer continuity.

Required functions:

1. Generate customer context summary.
2. Generate service summary.
3. Generate follow-up suggestion.
4. Mark uncertainty.
5. Save AI Summary.
6. Link AI Summary to source object.
7. Allow staff review where needed.

AI should stay bounded and traceable.

---

## 14. Implementation Slice 6: Knowledge Base MVP

Purpose:

> Provide small, approved knowledge for staff and AI.

Required content:

1. What is 健康元.
2. Store reception SOP.
3. Health concern intake guide.
4. Service record guide.
5. Graphene far-infrared cabin explanation.
6. Feedback collection guide.
7. Follow-up templates.
8. AI response boundaries.
9. Staff quick guide.
10. Customer education note.

The first knowledge base should be small and usable.

---

## 15. Implementation Slice 7: Event and Review

Purpose:

> Make MVP use observable.

Required functions:

1. Record customer creation event.
2. Record 健康元 activation event.
3. Record service completion event.
4. Record feedback event.
5. Record follow-up task event.
6. Record follow-up completion event.
7. Record AI summary event.
8. Provide simple operator review.

This helps Founder and operator learn from real use.

---

## 16. MVP Screen Boundary

The first MVP should limit screens to:

1. Login or staff entry if needed.
2. Dashboard / Today's Tasks.
3. Customer Search / Create.
4. Customer 健康元 Summary.
5. Health Concern Intake.
6. Service Record.
7. Feedback Record.
8. Follow-Up Task.
9. AI Summary Panel.
10. Knowledge Entry View.
11. Operator Review.

Do not build unnecessary screens.

---

## 17. MVP Data Boundary

The first MVP should implement only the minimum data needed for the loop.

Priority data objects:

1. Customer.
2. Health One Identity.
3. 健康元 Profile.
4. Health Concern.
5. Health Goal.
6. Store.
7. Store Staff.
8. Service.
9. Service Record.
10. Feedback.
11. Follow-Up Task.
12. AI Summary.
13. Knowledge Entry.
14. Authorization Record.
15. Event.

Device and Device Usage Record may be included if the first service requires it.

---

## 18. MVP AI Boundary

AI in the MVP should only support:

1. Customer context summary.
2. Service summary.
3. Follow-up suggestion.
4. Customer-facing explanation draft.
5. Staff-facing note.
6. Knowledge-based answer.
7. Missing information checklist.
8. Uncertainty note.

AI should not:

1. Diagnose disease.
2. Replace medical professionals.
3. Make unsupported claims.
4. Use unauthorized context.
5. Create aggressive sales scripts.
6. Save unreviewed sensitive memory.

---

## 19. MVP Knowledge Boundary

Knowledge Base MVP should begin with a limited content set.

Required knowledge categories:

1. Customer education.
2. Store SOP.
3. Service explanation.
4. Device explanation.
5. Follow-up template.
6. AI boundary.
7. Staff training.

Advanced RAG is not required before these entries are structured.

---

## 20. MVP Authorization Boundary

The first MVP should include simple authorization boundaries:

1. Customer owns 健康元.
2. Store may access customer context for service.
3. Staff may create and update service-related records.
4. AI may use authorized context.
5. Platform operator may review MVP validation data.
6. Internal knowledge should not be exposed to customer-facing AI.

A complex enterprise permission system is not required yet.

---

## 21. Real Store Validation Requirements

The MVP should be validated in real store conditions.

Validation should check:

1. Can staff use the workflow?
2. Can staff create records quickly?
3. Can customers understand 健康元?
4. Can service records improve future service?
5. Can feedback be captured?
6. Can follow-up actually happen?
7. Does AI help staff?
8. Does knowledge help explanation?
9. Does customer return become easier?
10. Does the loop repeat?

Validation is required before scaling.

---

## 22. Review Checkpoints

Recommended review checkpoints:

1. After technical setup.
2. After customer and 健康元 functions.
3. After service record function.
4. After feedback and follow-up function.
5. After AI summary integration.
6. After knowledge base content.
7. After first real store test.
8. After first full loop completion.
9. After 10 customer records.
10. After first iteration plan.

Each checkpoint should produce a short review note.

---

## 23. Claude Code Execution Boundary

Claude Code may execute tasks only when:

1. The task is approved by Founder or Chief Architect.
2. The repository is clean.
3. The file path is clear.
4. The expected change is clear.
5. The commit message is clear.
6. The task does not mix unrelated changes.
7. The task stays within current MVP scope.
8. The task reports status after completion.

Claude Code must not:

1. Invent product direction.
2. Add large modules without approval.
3. Change Baseline documents without review.
4. Start full implementation without a plan.
5. Mix documentation and code changes unnecessarily.
6. Push unreviewed major architecture changes.

---

## 24. MVP Success Criteria

The MVP may be considered successful if:

1. One real store can use the workflow.
2. Store staff can create or find customer records.
3. 健康元 can be activated or updated.
4. Service records are created consistently.
5. Feedback is captured.
6. Follow-up tasks are completed.
7. AI summaries are useful.
8. Knowledge entries improve explanation.
9. Customers understand the value of 健康元.
10. At least some customers return or continue communication.

---

## 25. MVP Failure Signals

Failure signals include:

1. Staff avoid using the system.
2. Data entry is too slow.
3. Customers do not understand 健康元.
4. Service records are not useful.
5. Feedback is missing.
6. Follow-up does not happen.
7. AI output is generic or risky.
8. Knowledge base is unused.
9. The system becomes only a booking tool.
10. The first loop does not repeat.

Failure should trigger simplification.

---

## 26. Explicit Non-Goals

The MVP execution plan excludes:

1. Full CRM.
2. Full ERP.
3. Full marketplace.
4. Full franchise system.
5. Token mechanism.
6. Blockchain.
7. Full contribution monetization.
8. Complex partner settlement.
9. Complex payment system.
10. Advanced BI dashboard.
11. Full medical record system.
12. Automated diagnosis.
13. Large-scale marketing automation.
14. Full digital human system.

These should not enter MVP execution.

---

## 27. Phase D Deliverables

Phase D should produce:

1. MVP Execution Plan.
2. MVP Technical Implementation Plan.
3. Initial Database Design Proposal.
4. Store Workbench MVP Screen List.
5. Knowledge Base MVP Content List.
6. AI Prompt and Memory Policy Draft.
7. Real Store Validation Plan.
8. Phase D Release Log.

These deliverables prepare the project for controlled implementation.

---

## 28. Current Baseline Execution Decisions

As of this document version, the following execution decisions are Baseline:

1. MVP execution should begin with one real store scenario.
2. The first build should focus on the store service loop.
3. Customer, 健康元, Service Record, Feedback, Follow-Up, AI Summary, and Knowledge Entry are the first build priorities.
4. Store Workbench is the first practical execution interface.
5. AI should support but not dominate the workflow.
6. Knowledge Base should begin small and structured.
7. Review checkpoints are required.
8. Claude Code must operate within approved tasks.
9. Real store validation is required before scaling.
10. The project should not jump into full platform development.

---

## 29. End of Document

RFC-003 defines the initial MVP Execution Plan for Health One.

Future technical implementation, screen design, database design, AI prompt design, and validation work should remain consistent with this plan unless reviewed and approved.
