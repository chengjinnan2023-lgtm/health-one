# RFC-002 MVP Data Object Draft

Document ID : RFC-002  
Title       : MVP Data Object Draft  
Version     : 1.0  
Status      : Baseline  
Owner       : Chief Architect  
Approver    : Founder  
Created     : 2026-06-28  
Updated     : 2026-06-28  
Depends On  : PROJECT-CONTEXT, BP-004, ADR-001, RFC-001, PRODUCT-001  
Related     : Store Workbench, AI Memory, Knowledge Base, Store Service Workflow  

---

## 1. Purpose

This document defines the first MVP data object draft for Health One.

The purpose is to translate the domain model and MVP scope into a practical data object boundary for controlled implementation.

This document is not a final database schema.

It should guide later database design, API design, store workflow design, AI memory design, and engineering implementation.

---

## 2. Status

Status:

> Accepted as Baseline for MVP data preparation.

This means future MVP engineering work should use this document as the current data object boundary unless reviewed and changed.

---

## 3. Context

Health One has completed:

1. Foundation Baseline.
2. Product and Architecture Blueprint Baseline.
3. PROJECT-CONTEXT.
4. ADR-001 Initial Architecture Principles.
5. RFC-001 MVP Scope Proposal.
6. PRODUCT-001 Store Workbench Initial Product Outline.

The project is now preparing controlled MVP implementation.

Before database tables are created, the MVP needs a clear data object draft.

---

## 4. Data Design Principle

The MVP data design follows this principle:

> Collect the minimum useful data required to complete the first health value loop.

Data should support:

1. Customer understanding.
2. 健康元 activation.
3. Health memory.
4. Store service.
5. Feedback.
6. Follow-up.
7. AI summary.
8. Knowledge retrieval.
9. Customer return.
10. Future learning.

Data should not be collected merely because it is technically possible.

---

## 5. MVP Data Object Boundary

The MVP should focus on these core data objects:

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

These objects are sufficient for the first MVP loop.

---

## 6. Object: Customer

Purpose:

> Represents the human customer served by Health One.

Suggested MVP fields:

1. Customer ID.
2. Name.
3. Phone or contact method.
4. Gender if needed.
5. Age range or birth year if needed.
6. Source.
7. Primary store.
8. Created time.
9. Updated time.
10. Status.

Notes:

1. Customer should not be treated merely as a sales lead.
2. Duplicate customer records should be avoided.
3. The MVP should prioritize fast customer lookup.

---

## 7. Object: Health One Identity

Purpose:

> Represents the customer's recognized identity inside the Health One system.

Suggested MVP fields:

1. Identity ID.
2. Customer ID.
3. Health One activation status.
4. Activation time.
5. Activation store.
6. Activation staff.
7. Contact method.
8. Authorization status.
9. Current lifecycle stage.
10. Status.

Notes:

1. Identity supports long-term recognition.
2. It should connect the customer to 健康元.
3. It should not be reduced to login information only.

---

## 8. Object: 健康元 Profile

Purpose:

> Represents the customer's personal health identity and memory container.

Suggested MVP fields:

1. Health One Profile ID.
2. Customer ID.
3. Main health concern.
4. Main health goal.
5. Current summary.
6. Recent service summary.
7. Recent feedback summary.
8. Follow-up status.
9. AI-generated summary.
10. Last updated time.

Notes:

1. 健康元 Profile should be easy for staff to understand.
2. It should not expose excessive detail in the first version.
3. It is the core customer context object.

---

## 9. Object: Health Concern

Purpose:

> Records the customer's current issue, discomfort, or health management need.

Suggested MVP fields:

1. Concern ID.
2. Customer ID.
3. Concern category.
4. Customer self-description.
5. Staff note.
6. Severity or priority if needed.
7. Start time or duration if known.
8. Related service record.
9. Status.
10. Created time.

Possible concern categories:

1. Shoulder and neck.
2. Waist and back.
3. Fatigue.
4. Sports recovery.
5. Weight management.
6. Sleep.
7. Energy.
8. Other.

Notes:

1. Health Concern is not a medical diagnosis.
2. The system should distinguish customer statement, staff note, and AI interpretation.

---

## 10. Object: Health Goal

Purpose:

> Records what the customer wants to improve or maintain.

Suggested MVP fields:

1. Goal ID.
2. Customer ID.
3. Goal category.
4. Goal description.
5. Priority.
6. Start time.
7. Current status.
8. Related concern.
9. Related service.
10. Updated time.

Possible goal categories:

1. Reduce fatigue.
2. Improve shoulder and neck comfort.
3. Improve waist and back comfort.
4. Support sports recovery.
5. Support weight management.
6. Improve sleep.
7. Improve daily energy.
8. Maintain body condition.

---

## 11. Object: Store

Purpose:

> Represents the real-world health service node.

Suggested MVP fields:

1. Store ID.
2. Store name.
3. Store location.
4. Store type.
5. Contact person.
6. Contact method.
7. Status.
8. Created time.
9. Updated time.

Notes:

1. MVP may start with one or a few stores.
2. Do not build complex multi-store headquarters logic too early.

---

## 12. Object: Store Staff

Purpose:

> Represents the staff member who serves customers and records store activity.

Suggested MVP fields:

1. Staff ID.
2. Store ID.
3. Name.
4. Role.
5. Contact method.
6. Account status.
7. Created time.
8. Updated time.

Possible roles:

1. Reception.
2. Health service staff.
3. Health manager.
4. Store owner.
5. Operator.

Notes:

1. Staff workflow must remain simple.
2. Staff usability is a critical MVP success factor.

---

## 13. Object: Service

Purpose:

> Represents a service item that the store can deliver.

Suggested MVP fields:

1. Service ID.
2. Service name.
3. Service category.
4. Description.
5. Related concern categories.
6. Related device type if applicable.
7. Duration if applicable.
8. Status.
9. Created time.
10. Updated time.

Possible service categories:

1. Graphene far-infrared cabin.
2. Sports recovery.
3. Shoulder and neck comfort.
4. Waist and back comfort.
5. Fatigue recovery.
6. Weight management.
7. Consultation.
8. Follow-up service.

---

## 14. Object: Service Record

Purpose:

> Records a completed or attempted store service.

Suggested MVP fields:

1. Service Record ID.
2. Customer ID.
3. Store ID.
4. Staff ID.
5. Service ID.
6. Service time.
7. Related health concern.
8. Related health goal.
9. Device usage record if applicable.
10. Staff observation.
11. Service summary.
12. Customer immediate response.
13. Next suggested action.
14. AI summary ID if applicable.
15. Created time.
16. Updated time.

Notes:

1. Service Record is a core MVP object.
2. It connects real service to Health Memory.
3. It should be fast to create.

---

## 15. Object: Device

Purpose:

> Represents physical equipment used in store service.

Suggested MVP fields:

1. Device ID.
2. Store ID.
3. Device name.
4. Device type.
5. Device status.
6. Installation time if needed.
7. Maintenance note if needed.
8. Created time.
9. Updated time.

Current important device type:

1. Graphene far-infrared health cabin.

Notes:

1. Device should not dominate the system.
2. Device exists to support service and memory.

---

## 16. Object: Device Usage Record

Purpose:

> Records the customer's use of a device during service.

Suggested MVP fields:

1. Device Usage Record ID.
2. Customer ID.
3. Store ID.
4. Staff ID.
5. Device ID.
6. Related service record.
7. Start time.
8. End time.
9. Duration.
10. Usage note.
11. Customer response.
12. Created time.

Notes:

1. Device usage should enrich Service Record and Health Memory.
2. The MVP does not need advanced IoT integration unless required.

---

## 17. Object: Feedback

Purpose:

> Records the customer's response after service or interaction.

Suggested MVP fields:

1. Feedback ID.
2. Customer ID.
3. Related service record.
4. Feedback time.
5. Immediate feeling.
6. Comfort change.
7. Satisfaction.
8. Question or concern.
9. Willingness to return.
10. Preferred follow-up method.
11. Staff note.
12. Created time.

Notes:

1. Feedback should be easy to capture.
2. It is essential for learning and follow-up.
3. MVP feedback should not become a long survey.

---

## 18. Object: Follow-Up Task

Purpose:

> Records the next action after service.

Suggested MVP fields:

1. Follow-Up Task ID.
2. Customer ID.
3. Related service record.
4. Store ID.
5. Responsible staff.
6. Follow-up reason.
7. Follow-up method.
8. Planned follow-up time.
9. Follow-up status.
10. Follow-up result.
11. Next action.
12. Created time.
13. Updated time.

Possible statuses:

1. Pending.
2. Completed.
3. Delayed.
4. Cancelled.
5. Needs review.

Notes:

1. Follow-up is part of the value loop.
2. It should not be optional in the workflow.

---

## 19. Object: AI Summary

Purpose:

> Stores structured AI-generated summaries and suggestions.

Suggested MVP fields:

1. AI Summary ID.
2. Customer ID.
3. Related object type.
4. Related object ID.
5. Summary type.
6. Summary content.
7. Suggested next action.
8. Uncertainty note.
9. Source context.
10. Created time.
11. Reviewed by staff if applicable.
12. Review status.

Possible summary types:

1. Customer context summary.
2. Service summary.
3. Follow-up suggestion.
4. Health concern summary.
5. Store staff communication draft.

Notes:

1. AI Summary should be traceable.
2. AI output should not be treated as unquestionable truth.
3. AI should mark uncertainty where needed.

---

## 20. Object: Knowledge Entry

Purpose:

> Stores structured knowledge for staff and AI use.

Suggested MVP fields:

1. Knowledge Entry ID.
2. Title.
3. Category.
4. Content.
5. Related service.
6. Related device.
7. Related concern category.
8. Usage scope.
9. Status.
10. Created time.
11. Updated time.

Possible categories:

1. Service explanation.
2. Device explanation.
3. Common concern guidance.
4. Follow-up template.
5. Staff SOP.
6. Customer education.
7. AI boundary note.

Notes:

1. Knowledge Entry can begin as Markdown or lightweight structured content.
2. Advanced RAG should wait until knowledge structure is clearer.

---

## 21. Object: Authorization Record

Purpose:

> Records basic access and permission boundaries.

Suggested MVP fields:

1. Authorization Record ID.
2. Customer ID.
3. Authorized party type.
4. Authorized party ID.
5. Authorization scope.
6. Authorization status.
7. Start time.
8. End time if applicable.
9. Created time.
10. Updated time.

Possible authorized party types:

1. Store.
2. Store Staff.
3. AI.
4. Platform Operator.

Possible scopes:

1. View basic profile.
2. View health memory.
3. Create service record.
4. Create follow-up.
5. Use context for AI summary.
6. Platform review.

Notes:

1. MVP authorization can be simple.
2. Customer ownership of 健康元 should be respected from the beginning.

---

## 22. Object: Event

Purpose:

> Records meaningful actions in the Health One value loop.

Suggested MVP fields:

1. Event ID.
2. Event type.
3. Customer ID if applicable.
4. Store ID if applicable.
5. Staff ID if applicable.
6. Related object type.
7. Related object ID.
8. Event time.
9. Event source.
10. Event note.

Possible event types:

1. Customer created.
2. 健康元 activated.
3. Concern recorded.
4. Service completed.
5. Feedback submitted.
6. Follow-up created.
7. Follow-up completed.
8. AI summary generated.
9. Customer returned.
10. Knowledge used.

Notes:

1. Events support timeline, auditability, and learning.
2. MVP event tracking should remain lightweight.

---

## 23. Object: Insight

Purpose:

> Records useful interpretations derived from customer memory, service records, feedback, AI, or operator review.

Suggested MVP fields:

1. Insight ID.
2. Customer ID if applicable.
3. Store ID if applicable.
4. Insight type.
5. Insight content.
6. Related object type.
7. Related object ID.
8. Source.
9. Confidence or uncertainty note.
10. Suggested action.
11. Created time.

Possible insight types:

1. Customer return signal.
2. Service improvement note.
3. Follow-up priority.
4. Staff observation pattern.
5. AI improvement note.
6. Knowledge gap.
7. Store operation note.

Notes:

1. Insight should be explainable.
2. MVP should keep insights simple.
3. Do not overbuild analytics at this stage.

---

## 24. MVP Minimum Field Set

If the first implementation must be extremely small, the minimum required field set should cover:

1. Customer name.
2. Customer contact.
3. Main health concern.
4. Health goal.
5. Store.
6. Staff.
7. Service type.
8. Service time.
9. Staff observation.
10. Customer feedback.
11. Follow-up status.
12. AI summary.
13. Next action.

This minimum set supports the first value loop.

---

## 25. Data Relationships

Initial relationships:

1. Customer has one or more Health One identities.
2. Customer has one 健康元 Profile.
3. Customer has many Health Concerns.
4. Customer has many Health Goals.
5. Customer has many Service Records.
6. Service Record belongs to Customer.
7. Service Record belongs to Store.
8. Service Record belongs to Store Staff.
9. Service Record may include Device Usage Record.
10. Feedback belongs to Service Record.
11. Follow-Up Task may belong to Service Record.
12. AI Summary may attach to Customer, Service Record, Feedback, or Follow-Up Task.
13. Knowledge Entry may support AI Summary or staff explanation.
14. Authorization Record governs access to customer context.
15. Event records meaningful system actions.
16. Insight may be derived from records, feedback, AI, or operator review.

---

## 26. Data Lifecycle

MVP data lifecycle:

1. Customer is created or found.
2. Health One identity is activated.
3. 健康元 Profile is created or updated.
4. Health Concern is recorded.
5. Health Goal is recorded.
6. Store service happens.
7. Service Record is created.
8. Device Usage Record is added if needed.
9. Feedback is recorded.
10. AI Summary is generated.
11. Follow-Up Task is created.
12. Follow-up result is recorded.
13. Health Memory is updated.
14. Event is recorded.
15. Insight may be created.
16. Customer returns and loop repeats.

---

## 27. Data Collection Boundaries

The MVP should avoid collecting:

1. Excessive personal details.
2. Medical diagnosis data beyond service context.
3. Sensitive health information without clear purpose.
4. Complex financial data.
5. Complex partner settlement data.
6. Large behavioral tracking data.
7. Unreviewed AI memory.
8. Data that staff will not use.
9. Data that customers cannot understand.
10. Data that creates trust risk without value.

---

## 28. AI Memory Boundary

AI memory should use structured MVP objects.

AI should reference:

1. Customer profile.
2. Health Concern.
3. Health Goal.
4. Service Record.
5. Feedback.
6. Follow-Up Task.
7. AI Summary.
8. Knowledge Entry.
9. Authorization Record.
10. Event timeline.

AI should not treat raw conversation history as the only memory source.

---

## 29. Store Workbench Data Boundary

The Store Workbench should display only practical data:

1. Customer basic information.
2. 健康元 summary.
3. Main concern.
4. Health goal.
5. Recent service record.
6. Recent feedback.
7. Pending follow-up.
8. AI summary.
9. Next action.
10. Useful knowledge entry.

Do not overload staff with unnecessary fields.

---

## 30. Database Design Boundary

This document does not authorize final database implementation.

Before database implementation, a separate technical design should clarify:

1. Actual table names.
2. Actual fields.
3. Field types.
4. Required and optional fields.
5. Indexing.
6. Relationships.
7. Migration strategy.
8. Access control.
9. Audit fields.
10. AI context storage.

Engineering should not blindly convert this document into database tables without design review.

---

## 31. Current Baseline Data Decisions

As of this document version, the following data decisions are Baseline:

1. MVP data should support the first value loop.
2. 健康元 Profile, Service Record, Feedback, Follow-Up Task, and AI Summary are core data objects.
3. Data collection should remain minimal and useful.
4. Store staff usability should constrain data fields.
5. AI memory should be structured and traceable.
6. Authorization should exist from the beginning.
7. Events should be tracked lightly.
8. Knowledge Entry should support both staff and AI.
9. Final database schema requires separate design review.
10. The MVP should avoid unnecessary sensitive or unused data.

---

## 32. End of Document

RFC-002 defines the current MVP data object draft for Health One.

Future database, API, UI, AI memory, and store workflow design should remain consistent with this draft unless reviewed and approved.
