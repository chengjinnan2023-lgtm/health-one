# RFC-001 MVP Scope Proposal

Document ID : RFC-001  
Title       : MVP Scope Proposal  
Version     : 1.0  
Status      : Baseline  
Owner       : Chief Architect  
Approver    : Founder  
Created     : 2026-06-28  
Updated     : 2026-06-28  
Depends On  : PROJECT-CONTEXT, ADR-001, BP-001, BP-002, BP-003, BP-004  
Related     : Store Workbench, AI Memory, Knowledge Base, MVP Execution Plan  

---

## 1. Purpose

This RFC defines the proposed scope for the first Health One MVP.

The purpose is to convert the existing blueprint documents into an executable MVP boundary.

This RFC should guide:

1. Product workflow design.
2. Store workbench design.
3. Initial data object design.
4. AI memory boundary.
5. Knowledge base structure.
6. Controlled engineering implementation.
7. Real store validation.

This RFC does not define final implementation details.

It defines what should be included and excluded in the first MVP scope.

---

## 2. RFC Status

Status:

> Accepted as Baseline for MVP scope preparation.

This means the project may use this document as the current MVP scope baseline.

Material changes require review and Founder approval.

---

## 3. Context

Health One has completed:

1. Foundation Baseline.
2. Product and Architecture Blueprint Baseline.
3. PROJECT-CONTEXT.
4. ADR-001 Initial Architecture Principles.

The current project stage is:

> Sprint 1 / Phase C: Execution Preparation

The project is preparing for controlled MVP implementation.

The MVP must not become a broad feature set.

The MVP must prove the first complete health value loop.

---

## 4. MVP Definition

In Health One, MVP means:

> The shortest complete value loop that proves Health One can create repeatable health value through identity, memory, AI, store service, follow-up, and return.

MVP does not mean:

1. The smallest number of screens.
2. The simplest booking tool.
3. A generic CRM.
4. A chatbot demo.
5. A marketplace prototype.
6. A device usage log only.

The MVP must connect real customer service with long-term health memory.

---

## 5. First Value Loop

The first value loop is:

1. Customer creates or activates a Health One identity.
2. AI builds initial health understanding.
3. AI provides personalized guidance.
4. Customer books or receives store service.
5. Store completes the service.
6. Service result is recorded.
7. AI follows up.
8. Health memory grows.
9. Customer returns.
10. The loop repeats.

The MVP must support this loop end to end.

---

## 6. MVP Primary Scenario

The first MVP should focus on one practical store scenario:

> A customer enters or contacts a health management store, activates 健康元, receives a real store service, leaves a simple feedback record, receives follow-up, and is guided toward return.

This scenario may involve:

1. Existing health management store.
2. Store staff.
3. Customer with shoulder, neck, waist, back, fatigue, sports recovery, or weight management concern.
4. Graphene far-infrared health cabin or another approved service.
5. Simple service record.
6. AI or staff follow-up.
7. Customer return signal.

This scenario is enough to test the core loop.

---

## 7. MVP Target Users

The first MVP should support three user roles:

1. Customer.
2. Store Staff.
3. Platform Operator / Founder.

Optional future roles should not be built in the first scope unless necessary.

---

## 8. Customer Scope

Customer-side MVP should support:

1. Customer identity activation.
2. Basic 健康元 profile.
3. Main health concern intake.
4. Health goal recording.
5. Basic AI conversation or AI-generated summary.
6. Service history viewing in simple form.
7. Follow-up message receiving.
8. Basic feedback submission.
9. Return or next-action pathway.

Customer-side MVP should not require a complex app experience at the beginning.

The first version may be simple.

The goal is to prove value, not interface completeness.

---

## 9. Store Staff Scope

Store Staff MVP should support:

1. Customer lookup or creation.
2. Basic customer context viewing.
3. Health concern intake.
4. Service recommendation note.
5. Service record creation.
6. Device usage note if applicable.
7. Staff observation note.
8. Customer feedback recording.
9. Follow-up task creation.
10. View next action.

The store workflow must remain simple.

If staff cannot complete the workflow quickly, the MVP fails.

---

## 10. Platform Operator Scope

Platform Operator MVP should support:

1. View customer list.
2. View store list.
3. View service records.
4. View follow-up status.
5. View basic operational summary.
6. Manage basic knowledge entries.
7. Review AI summaries.
8. Monitor MVP loop completion.

The platform operator view should support learning and validation.

It does not need full admin complexity.

---

## 11. Core MVP Objects

The first MVP should include these core objects:

1. Customer.
2. Health One Identity.
3. 健康元.
4. Health Memory.
5. Health Goal.
6. Health Concern.
7. Store.
8. Store Staff.
9. Service.
10. Service Record.
11. Device.
12. Device Usage Record.
13. Feedback.
14. Follow-Up.
15. Knowledge Base.
16. Authorization.
17. Task.
18. Event.
19. Insight.

These objects may begin with minimal fields.

They should not be overbuilt in the first implementation.

---

## 12. Required MVP Functions

The MVP should include the following required functions.

### 12.1 Identity and 健康元

1. Create customer.
2. Activate 健康元.
3. Record basic profile.
4. Record main health concern.
5. Record health goal.
6. View customer 健康元 summary.

### 12.2 Store Service

1. Create service record.
2. Select service type.
3. Record store and staff.
4. Record device usage if applicable.
5. Record staff observation.
6. Save service summary.

### 12.3 Feedback

1. Record simple feedback.
2. Record immediate customer feeling.
3. Record willingness to return.
4. Link feedback to service record.

### 12.4 Follow-Up

1. Create follow-up task.
2. Mark follow-up status.
3. Record follow-up result.
4. Update customer memory.

### 12.5 AI Assistance

1. Generate customer summary.
2. Generate service summary.
3. Generate follow-up suggestion.
4. Retrieve basic knowledge base entries.
5. Mark uncertainty where needed.

### 12.6 Knowledge Base

1. Store basic service explanations.
2. Store device explanations.
3. Store follow-up templates.
4. Store common concern guidance.
5. Support AI retrieval in simple form.

---

## 13. Optional MVP Functions

Optional functions may be considered only if they do not delay the first loop.

Possible optional functions:

1. Simple appointment record.
2. Simple package balance note.
3. Simple customer tag.
4. Simple store dashboard.
5. Simple export.
6. Simple reminder message template.

Optional functions should not become the project center.

---

## 14. Explicit MVP Exclusions

The first MVP must exclude:

1. Full marketplace.
2. Full CRM.
3. Full ERP.
4. Full franchise system.
5. Token mechanism.
6. Blockchain.
7. Full contribution monetization.
8. Full digital human system.
9. Complex partner settlement.
10. Complex membership hierarchy.
11. Large-scale automated marketing.
12. Multi-store headquarters system.
13. Advanced BI dashboard.
14. Complex payment and finance system.
15. Medical diagnosis engine.
16. Doctor replacement logic.

These exclusions protect focus.

---

## 15. Data Scope

The MVP should collect only minimum useful data.

Initial data should include:

1. Customer identifier.
2. Contact method.
3. Main health concern.
4. Health goal.
5. Store.
6. Staff.
7. Service type.
8. Service time.
9. Device usage if applicable.
10. Staff observation.
11. Customer feedback.
12. Follow-up status.
13. AI summary.
14. Next suggested action.

More data should be added only after real store use shows necessity.

---

## 16. AI Scope

AI in MVP should support:

1. Intake structuring.
2. Customer context summary.
3. Service explanation.
4. Follow-up suggestion.
5. Simple knowledge retrieval.
6. Staff communication assistance.
7. Customer-facing explanation.
8. Memory update summary.

AI in MVP should not:

1. Diagnose disease.
2. Replace medical professionals.
3. Make unsupported health claims.
4. Generate aggressive sales scripts.
5. Operate without authorized context.
6. Store random unstructured memory without review.

---

## 17. Knowledge Base Scope

The MVP Knowledge Base should include:

1. Service descriptions.
2. Device descriptions.
3. Common health concern explanations.
4. Store service SOP notes.
5. Follow-up templates.
6. AI response boundaries.
7. Staff training notes.
8. Customer education content.

The first version can be Markdown-based or lightweight structured content.

Advanced RAG should wait until knowledge structure is clear.

---

## 18. Authorization Scope

The MVP should include basic authorization distinctions:

1. Customer-owned health identity.
2. Store-accessible customer context.
3. Staff-editable service record.
4. AI-usable authorized context.
5. Platform review access.
6. Sensitive information boundary.

The MVP does not require a complex enterprise RBAC system.

But it must not ignore customer ownership or context boundaries.

---

## 19. Store Workflow Scope

The MVP store workflow should be simple:

1. Customer arrives or contacts store.
2. Staff finds or creates customer.
3. Staff records main concern.
4. Staff activates or updates 健康元.
5. Staff records service.
6. Staff records feedback.
7. System or AI creates follow-up.
8. Staff or AI follows up.
9. Customer returns or next action is recorded.

This workflow should be tested in a real store scenario.

---

## 20. Validation Scope

The MVP should validate:

1. Customers understand 健康元.
2. Staff can complete service record.
3. AI summary is useful.
4. Follow-up actually happens.
5. Customer feedback is captured.
6. Health memory grows.
7. Customer has reason to return.
8. Store sees operating value.
9. The loop can repeat.
10. The system does not overload staff.

These validation signals matter more than interface completeness.

---

## 21. MVP Success Criteria

The MVP may be considered successful if:

1. At least one real store can use the workflow.
2. Staff can create and update customer records.
3. Service records are captured consistently.
4. AI follow-up summaries are useful.
5. Customers can understand the value of 健康元.
6. Follow-up leads to return or continued relationship.
7. Store operator sees practical value.
8. The system reveals what should be improved next.

---

## 22. MVP Failure Signals

The MVP may be failing if:

1. Staff avoid using the system.
2. Data entry takes too long.
3. Customers do not understand 健康元.
4. AI output is generic or untrusted.
5. Follow-up is not performed.
6. Service records do not improve future service.
7. The system becomes only a booking tool.
8. The system becomes only a sales tool.
9. The first loop does not repeat.
10. Founder or operator cannot learn from real use.

---

## 23. Engineering Scope

Engineering should prepare only what is needed for MVP validation.

Allowed engineering scope:

1. Basic data model draft.
2. Basic customer profile.
3. Basic store workbench.
4. Basic service record.
5. Basic follow-up task.
6. Basic feedback record.
7. Basic knowledge content store.
8. Basic AI summary integration.
9. Basic event tracking.
10. Basic authorization boundary.

Engineering should not implement excluded modules.

---

## 24. Implementation Boundary

Before implementation begins, the following should be clarified:

1. Store workflow draft.
2. Initial data object draft.
3. AI memory boundary.
4. Knowledge base structure.
5. Service record fields.
6. Follow-up process.
7. Customer activation process.
8. First real store test scenario.

If these are unclear, coding should not start.

---

## 25. Recommended Next Documents

After this RFC, recommended documents are:

1. Store Workbench Initial Product Outline.
2. MVP Data Object Draft.
3. AI Memory and RAG Design Draft.
4. Knowledge Base Structure Design.
5. Store Service Workflow Draft.
6. MVP Execution Plan.

These documents should prepare controlled implementation.

---

## 26. Current Baseline Scope Decisions

As of this document version, the following MVP scope decisions are Baseline:

1. MVP must prove the first complete health value loop.
2. MVP should focus on Customer, Store Staff, and Platform Operator roles.
3. Store workflow must remain simple.
4. 健康元, service record, feedback, follow-up, AI summary, and knowledge base are core.
5. Marketplace, franchise, token, blockchain, and complex settlement are excluded.
6. AI must support memory, explanation, and follow-up within boundaries.
7. Knowledge base should begin lightweight and structured.
8. Authorization must exist from the beginning.
9. Engineering should remain incremental.
10. Real store validation is required before expansion.

---

## 27. End of Document

RFC-001 defines the current MVP scope proposal for Health One.

Future product, architecture, AI, knowledge base, and engineering work should stay within this scope unless reviewed and approved.
