# ADR-001 Initial Architecture Principles

Document ID : ADR-001  
Title       : Initial Architecture Principles  
Version     : 1.0  
Status      : Baseline  
Owner       : Chief Architect  
Approver    : Founder  
Created     : 2026-06-28  
Updated     : 2026-06-28  
Depends On  : PROJECT-CONTEXT, BP-001, BP-002, BP-003, BP-004  
Related     : RFC-001, Store Workbench, AI Memory, Knowledge Base  

---

## 1. Purpose

This ADR defines the initial architecture principles for Health One before controlled MVP implementation begins.

The purpose is to prevent premature engineering decisions, uncontrolled feature building, and architecture drift.

This ADR does not define the full technical architecture.

It defines the principles that future engineering work must follow.

---

## 2. Decision Status

Status:

> Accepted as Baseline

This ADR should guide all early engineering, product, AI, data, and knowledge base implementation work.

Material changes require review and Founder approval.

---

## 3. Context

Health One has completed:

1. Foundation Baseline.
2. Product and Architecture Blueprint Baseline.
3. PROJECT-CONTEXT.
4. Initial MVP direction.
5. Initial domain model.

The project is now entering:

> Phase C: Execution Preparation

At this stage, the project should prepare controlled MVP implementation, but should not jump into full-scale development.

The architecture must support the first value loop:

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

---

## 4. Core Architecture Decision

Health One architecture should be built around:

> Identity, Memory, Service, Follow-Up, Trust, and Knowledge.

It should not be built primarily around:

1. Transactions.
2. Product sales.
3. Marketing automation.
4. Generic CRM records.
5. Isolated chatbot conversations.
6. Device booking alone.

Transactions, products, CRM, devices, and marketing may exist, but they must serve the first health value loop.

---

## 5. Principle 1: Value Loop First

Every early architecture decision must support the first value loop.

A module should be prioritized only if it strengthens one or more of the following:

1. Customer identity.
2. 健康元 activation.
3. Health memory.
4. Store service record.
5. AI understanding.
6. Follow-up.
7. Customer return.
8. Store operating capability.
9. Knowledge accumulation.

If a module does not support the loop, it should be delayed.

---

## 6. Principle 2: Domain Model Before Database Schema

The domain model should guide the database.

The database should not be designed directly from UI screens, temporary forms, or isolated business ideas.

Priority domain objects include:

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

Database design should be derived from these objects through a separate reviewed document.

---

## 7. Principle 3: Memory Is Infrastructure

Health Memory is not an optional feature.

It is core infrastructure.

Architecture must support:

1. Customer health history.
2. Service records.
3. Feedback.
4. Staff observations.
5. AI summaries.
6. Follow-up results.
7. Time sequence.
8. Uncertainty marking.
9. Authorization scope.
10. Future retrieval.

AI memory should not be random chat history.

It should be structured, explainable, and tied to domain objects.

---

## 8. Principle 4: Authorization From the Beginning

Health One must respect customer ownership of 健康元.

Even in MVP, architecture should distinguish:

1. What the customer owns.
2. What the store may access.
3. What staff may record.
4. What AI may use.
5. What the platform may analyze.
6. What requires permission.

The MVP does not need a complex enterprise permission system, but it must not ignore authorization.

---

## 9. Principle 5: Store Staff Usability Is Critical

The store workbench must be practical.

If store staff do not use the system, the value loop breaks.

Architecture should minimize staff burden.

Store-side workflows should prioritize:

1. Fast customer lookup.
2. Simple health concern intake.
3. Simple service recording.
4. Simple feedback capture.
5. Clear follow-up task.
6. Useful customer context.
7. Minimal required fields.

Engineering should not build staff tools that look complete but are unusable in real store operations.

---

## 10. Principle 6: AI Must Be Grounded

AI should be grounded in:

1. Authorized customer context.
2. Health memory.
3. Store service records.
4. Knowledge base.
5. Service explanations.
6. Follow-up history.
7. Uncertainty boundaries.

AI should not generate unsupported claims.

AI should not act as an unbounded medical authority.

AI should support memory, explanation, follow-up, and staff/customer communication.

---

## 11. Principle 7: Knowledge Base Is a System Component

The Knowledge Base is not only documentation.

It is part of the operating architecture.

It should support:

1. AI responses.
2. Store staff consistency.
3. Service explanations.
4. Follow-up scripts.
5. Product and service knowledge.
6. Training.
7. Internal decision-making.
8. RAG in future phases.

Knowledge should be structured before advanced RAG is built.

---

## 12. Principle 8: Event and Task Tracking Should Exist Early

The MVP should track meaningful events and tasks.

Events may include:

1. Customer activation.
2. AI interaction.
3. Store visit.
4. Service completion.
5. Device usage.
6. Feedback submission.
7. Follow-up sent.
8. Customer return.

Tasks may include:

1. Follow up with customer.
2. Record service.
3. Review feedback.
4. Update memory.
5. Contact inactive customer.
6. Review AI summary.

Events and tasks help convert service into memory and action.

---

## 13. Principle 9: Keep the MVP Architecture Small

The MVP architecture should remain small and controlled.

Do not build:

1. Full marketplace.
2. Full CRM.
3. Full ERP.
4. Full franchise platform.
5. Token or blockchain system.
6. Complex partner settlement.
7. Large-scale automation.
8. Full digital human system.

The early architecture should prove the value loop first.

---

## 14. Principle 10: Separate Project Knowledge From Product Data

Health One currently has two different knowledge/data layers:

1. Project Knowledge Base.
2. Product Customer and Store Data.

Project Knowledge Base includes:

1. Governance documents.
2. Product blueprints.
3. Architecture decisions.
4. Research.
5. Release logs.

Product Data includes:

1. Customers.
2. 健康元.
3. Health memory.
4. Service records.
5. Feedback.
6. Follow-up tasks.

These should not be confused.

Project documents guide the product.

Product data powers the product.

---

## 15. Principle 11: Engineering Must Be Incremental

Engineering should move in controlled increments.

Recommended implementation sequence:

1. Define MVP scope.
2. Define initial data objects.
3. Define store workflow.
4. Define AI memory boundary.
5. Define knowledge base structure.
6. Build minimal store workbench.
7. Build minimal customer identity and 健康元 profile.
8. Build service record.
9. Build follow-up mechanism.
10. Validate with real store use.

Do not build large modules without validation.

---

## 16. Principle 12: Architecture Must Remain Auditable

Health One handles health-related memory and service records.

Architecture should preserve traceability.

Important records should be auditable:

1. Who created a record.
2. When it was created.
3. What service happened.
4. What feedback was given.
5. What AI summarized.
6. What follow-up was sent.
7. What changed in memory.
8. What authorization applied.

Auditability supports trust.

---

## 17. Initial Architecture Layers

The early architecture may be thought of in layers:

1. Identity Layer.
2. Health Memory Layer.
3. Store Service Layer.
4. AI Assistance Layer.
5. Knowledge Base Layer.
6. Follow-Up Layer.
7. Authorization Layer.
8. Event and Task Layer.
9. Reporting and Learning Layer.

These are conceptual layers, not final implementation modules.

---

## 18. Current Engineering Boundary

Allowed after this ADR:

1. Draft RFC-001 MVP Scope Proposal.
2. Draft initial data object design.
3. Draft store workbench workflow.
4. Draft AI memory and RAG boundary.
5. Draft knowledge base structure.
6. Prepare controlled MVP implementation plan.

Not allowed yet:

1. Full production database schema.
2. Full application implementation.
3. Complex CRM/ERP.
4. Marketplace build.
5. Token or blockchain.
6. Full partner platform.
7. Major Baseline document rewrite without review.

---

## 19. Risks

Key architecture risks:

1. Building too much too early.
2. Confusing domain model with database schema.
3. Treating AI chat history as health memory.
4. Ignoring authorization.
5. Making store workflow too complex.
6. Building product sales before service value.
7. Making RAG before knowledge is structured.
8. Losing customer ownership principle.
9. Creating untraceable AI outputs.
10. Allowing engineering to outrun product validation.

These risks should be actively monitored.

---

## 20. Decision

The initial Health One architecture will follow these decisions:

1. Build around the first health value loop.
2. Treat 健康元 as central.
3. Treat Health Memory as infrastructure.
4. Use the domain model to guide data design.
5. Include authorization from the beginning.
6. Keep store staff usability central.
7. Ground AI in authorized memory and knowledge.
8. Treat the Knowledge Base as a system component.
9. Track events and tasks early.
10. Keep the MVP architecture small.
11. Separate project knowledge from product data.
12. Move engineering incrementally.

---

## 21. Consequences

This decision means:

1. Development may appear slower at the beginning.
2. Some attractive features will be delayed.
3. Architecture will be more coherent.
4. MVP scope will remain controlled.
5. Store usability will receive priority.
6. AI memory will be designed more responsibly.
7. Customer trust and ownership will remain central.
8. Future scaling will be easier because the foundation is clearer.

---

## 22. End of Document

ADR-001 establishes the initial architecture principles for Health One.

Future RFCs, data models, AI memory designs, store workflows, and engineering implementation should remain consistent with this ADR.
