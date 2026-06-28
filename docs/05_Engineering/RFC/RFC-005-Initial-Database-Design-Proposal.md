# RFC-005 Initial Database Design Proposal

Document ID : RFC-005  
Title       : Initial Database Design Proposal  
Version     : 1.0  
Status      : Baseline  
Owner       : Chief Architect  
Approver    : Founder  
Created     : 2026-06-28  
Updated     : 2026-06-28  
Depends On  : REL-003, ADR-001, RFC-001, RFC-002, RFC-003, RFC-004, PRODUCT-001, PRODUCT-002, AI-001, AI-002  
Related     : Store Workbench MVP Screen List, MVP Technical Implementation Plan, AI Memory, Knowledge Base, Real Store Validation Plan  

---

## 1. Purpose

This document defines the initial database design proposal for the Health One MVP.

The purpose is to translate the MVP data object draft into a practical database boundary before implementation begins.

This document is still a proposal.

It should guide engineering implementation, but detailed schema, field types, migrations, and indexing may require additional review during implementation.

---

## 2. Design Principle

The initial database design follows this principle:

> Store only the minimum structured data required to complete and validate the first Health One value loop.

The database should support:

1. Customer identity.
2. 健康元 profile.
3. Health concern.
4. Health goal.
5. Store service record.
6. Customer feedback.
7. Follow-up.
8. AI summary.
9. Knowledge entry.
10. Basic authorization.
11. Event logging.
12. MVP validation.

The database should not be designed as a full CRM, ERP, marketplace, finance, franchise, or medical record system.

---

## 3. Database Scope

The first MVP database should include these tables or equivalent collections:

1. customers.
2. health_one_identities.
3. health_one_profiles.
4. health_concerns.
5. health_goals.
6. stores.
7. store_staff.
8. services.
9. service_records.
10. feedback_records.
11. follow_up_tasks.
12. ai_summaries.
13. knowledge_entries.
14. authorization_records.
15. events.

Optional tables if needed by the first store service scenario:

1. devices.
2. device_usage_records.

---

## 4. Table: customers

Purpose:

> Stores the basic human customer record.

Suggested fields:

1. id.
2. name.
3. phone.
4. contact_method.
5. gender.
6. birth_year.
7. source.
8. primary_store_id.
9. status.
10. created_at.
11. updated_at.

Required MVP fields:

1. id.
2. name or nickname.
3. phone or contact method.
4. primary_store_id.
5. status.
6. created_at.

Notes:

1. Avoid duplicate customer records.
2. Do not over-collect personal information in MVP.
3. Customer is not merely a sales lead.

---

## 5. Table: health_one_identities

Purpose:

> Stores the customer's Health One identity and activation state.

Suggested fields:

1. id.
2. customer_id.
3. activation_status.
4. activated_at.
5. activation_store_id.
6. activation_staff_id.
7. authorization_status.
8. lifecycle_stage.
9. status.
10. created_at.
11. updated_at.

Required MVP fields:

1. id.
2. customer_id.
3. activation_status.
4. activated_at.
5. lifecycle_stage.
6. status.

Notes:

1. This table represents identity continuity.
2. It should not be reduced to login-only logic.
3. It links customer to 健康元.

---

## 6. Table: health_one_profiles

Purpose:

> Stores the current summary of the customer's 健康元.

Suggested fields:

1. id.
2. customer_id.
3. identity_id.
4. main_health_concern.
5. main_health_goal.
6. current_summary.
7. recent_service_summary.
8. recent_feedback_summary.
9. follow_up_status.
10. ai_summary_id.
11. last_updated_at.
12. created_at.
13. updated_at.

Required MVP fields:

1. id.
2. customer_id.
3. main_health_concern.
4. main_health_goal.
5. current_summary.
6. follow_up_status.
7. updated_at.

Notes:

1. This table is the practical profile view for staff.
2. It should not try to store every historical detail.
3. Historical records should remain in service, feedback, follow-up, AI summary, and event tables.

---

## 7. Table: health_concerns

Purpose:

> Stores customer-reported concerns and service-relevant needs.

Suggested fields:

1. id.
2. customer_id.
3. concern_category.
4. customer_description.
5. staff_note.
6. priority.
7. duration_note.
8. related_service_record_id.
9. status.
10. created_by_staff_id.
11. created_at.
12. updated_at.

Required MVP fields:

1. id.
2. customer_id.
3. concern_category.
4. customer_description.
5. status.
6. created_at.

Notes:

1. Health concern is not a medical diagnosis.
2. Customer self-report, staff note, and AI interpretation should remain distinguishable.

---

## 8. Table: health_goals

Purpose:

> Stores what the customer wants to improve or maintain.

Suggested fields:

1. id.
2. customer_id.
3. goal_category.
4. goal_description.
5. priority.
6. status.
7. related_concern_id.
8. created_at.
9. updated_at.

Required MVP fields:

1. id.
2. customer_id.
3. goal_category or goal_description.
4. status.
5. created_at.

Notes:

1. Goals should connect to service and follow-up.
2. Do not overbuild progress tracking in the first version.

---

## 9. Table: stores

Purpose:

> Stores the real-world store or service node.

Suggested fields:

1. id.
2. name.
3. location.
4. store_type.
5. contact_person.
6. contact_method.
7. status.
8. created_at.
9. updated_at.

Required MVP fields:

1. id.
2. name.
3. status.
4. created_at.

Notes:

1. MVP may begin with one store.
2. Do not build complex headquarters hierarchy in MVP.

---

## 10. Table: store_staff

Purpose:

> Stores staff users who operate the Store Workbench.

Suggested fields:

1. id.
2. store_id.
3. name.
4. role.
5. contact_method.
6. account_status.
7. created_at.
8. updated_at.

Required MVP fields:

1. id.
2. store_id.
3. name.
4. role.
5. account_status.

Notes:

1. Staff usability is a core MVP constraint.
2. Role model should remain simple at first.

---

## 11. Table: services

Purpose:

> Stores service types available in the MVP.

Suggested fields:

1. id.
2. name.
3. category.
4. description.
5. related_concern_categories.
6. related_device_type.
7. default_duration.
8. status.
9. created_at.
10. updated_at.

Required MVP fields:

1. id.
2. name.
3. category.
4. description.
5. status.

Notes:

1. Service data should support explanation and service records.
2. Do not turn this into full product catalog too early.

---

## 12. Table: service_records

Purpose:

> Stores real store service records and connects service to Health Memory.

Suggested fields:

1. id.
2. customer_id.
3. store_id.
4. staff_id.
5. service_id.
6. service_time.
7. related_concern_id.
8. related_goal_id.
9. staff_observation.
10. service_summary.
11. customer_immediate_response.
12. next_suggested_action.
13. ai_summary_id.
14. status.
15. created_at.
16. updated_at.

Required MVP fields:

1. id.
2. customer_id.
3. store_id.
4. staff_id.
5. service_id.
6. service_time.
7. staff_observation.
8. customer_immediate_response.
9. status.
10. created_at.

Notes:

1. This is one of the core MVP tables.
2. It turns real service into structured memory.
3. It must be fast for staff to create.

---

## 13. Table: feedback_records

Purpose:

> Stores customer feedback after service.

Suggested fields:

1. id.
2. customer_id.
3. service_record_id.
4. feedback_time.
5. immediate_feeling.
6. comfort_change.
7. satisfaction.
8. question_or_concern.
9. willingness_to_return.
10. preferred_follow_up_method.
11. staff_note.
12. created_at.

Required MVP fields:

1. id.
2. customer_id.
3. service_record_id.
4. immediate_feeling.
5. willingness_to_return.
6. created_at.

Notes:

1. Feedback must be simple.
2. Avoid long survey logic in MVP.
3. Feedback should drive follow-up.

---

## 14. Table: follow_up_tasks

Purpose:

> Stores follow-up actions after service.

Suggested fields:

1. id.
2. customer_id.
3. service_record_id.
4. store_id.
5. responsible_staff_id.
6. follow_up_reason.
7. follow_up_method.
8. planned_at.
9. status.
10. result.
11. next_action.
12. created_at.
13. updated_at.

Required MVP fields:

1. id.
2. customer_id.
3. service_record_id.
4. responsible_staff_id.
5. follow_up_reason.
6. planned_at.
7. status.
8. created_at.

Suggested statuses:

1. pending.
2. completed.
3. delayed.
4. cancelled.
5. needs_review.

Notes:

1. Follow-up is part of the value loop.
2. It should not be optional.

---

## 15. Table: ai_summaries

Purpose:

> Stores traceable AI-generated summaries and suggestions.

Suggested fields:

1. id.
2. customer_id.
3. related_object_type.
4. related_object_id.
5. summary_type.
6. summary_content.
7. suggested_next_action.
8. uncertainty_note.
9. source_context_note.
10. review_status.
11. reviewed_by_staff_id.
12. created_at.

Required MVP fields:

1. id.
2. customer_id.
3. related_object_type.
4. related_object_id.
5. summary_type.
6. summary_content.
7. uncertainty_note.
8. created_at.

Suggested summary types:

1. customer_context_summary.
2. service_summary.
3. follow_up_suggestion.
4. health_concern_summary.
5. staff_communication_draft.
6. customer_explanation_draft.

Notes:

1. AI output must be traceable.
2. AI summaries should not overwrite customer facts.
3. AI uncertainty should be preserved.

---

## 16. Table: knowledge_entries

Purpose:

> Stores approved or draft knowledge entries for staff and AI use.

Suggested fields:

1. id.
2. title.
3. layer.
4. category.
5. intended_audience.
6. content.
7. usage_scope.
8. related_service_id.
9. related_device_type.
10. related_concern_category.
11. source.
12. status.
13. review_status.
14. created_at.
15. updated_at.

Required MVP fields:

1. id.
2. title.
3. category.
4. intended_audience.
5. content.
6. status.
7. created_at.

Suggested statuses:

1. draft.
2. review.
3. baseline.
4. deprecated.
5. customer_facing.
6. internal_only.

Notes:

1. Knowledge entries should remain small and structured.
2. Customer-facing and internal knowledge must be distinguished.
3. Advanced RAG should wait until knowledge entries are stable.

---

## 17. Table: authorization_records

Purpose:

> Stores simple access and permission boundaries.

Suggested fields:

1. id.
2. customer_id.
3. authorized_party_type.
4. authorized_party_id.
5. authorization_scope.
6. authorization_status.
7. starts_at.
8. ends_at.
9. created_at.
10. updated_at.

Required MVP fields:

1. id.
2. customer_id.
3. authorized_party_type.
4. authorization_scope.
5. authorization_status.
6. created_at.

Suggested authorized party types:

1. store.
2. store_staff.
3. ai.
4. platform_operator.

Notes:

1. MVP authorization can be simple.
2. Customer ownership of 健康元 must be respected.
3. Do not treat health memory as unrestricted data.

---

## 18. Table: events

Purpose:

> Stores meaningful actions for auditability and MVP validation.

Suggested fields:

1. id.
2. event_type.
3. customer_id.
4. store_id.
5. staff_id.
6. related_object_type.
7. related_object_id.
8. event_source.
9. event_note.
10. occurred_at.
11. created_at.

Required MVP fields:

1. id.
2. event_type.
3. related_object_type.
4. related_object_id.
5. occurred_at.
6. created_at.

Suggested event types:

1. customer_created.
2. health_one_activated.
3. concern_recorded.
4. service_record_created.
5. feedback_recorded.
6. follow_up_created.
7. follow_up_completed.
8. ai_summary_generated.
9. knowledge_entry_used.
10. customer_returned.

Notes:

1. Events support timeline and validation.
2. Keep event logging lightweight.
3. Do not overbuild analytics in MVP.

---

## 19. Optional Table: devices

Purpose:

> Stores physical devices used in store service.

Suggested fields:

1. id.
2. store_id.
3. name.
4. device_type.
5. status.
6. installation_note.
7. maintenance_note.
8. created_at.
9. updated_at.

Notes:

1. Include this table if the first MVP service requires device tracking.
2. The graphene far-infrared health cabin is the current important device type.
3. Device should support service, not dominate the system.

---

## 20. Optional Table: device_usage_records

Purpose:

> Stores customer device usage during service.

Suggested fields:

1. id.
2. customer_id.
3. store_id.
4. staff_id.
5. device_id.
6. service_record_id.
7. start_time.
8. end_time.
9. duration.
10. usage_note.
11. customer_response.
12. created_at.

Notes:

1. Include this if first service validation needs device usage tracking.
2. Advanced IoT integration is not required in MVP.

---

## 21. Relationship Summary

Initial relationships:

1. customers has many health_one_identities.
2. customers has one health_one_profile.
3. customers has many health_concerns.
4. customers has many health_goals.
5. customers has many service_records.
6. stores has many store_staff.
7. stores has many service_records.
8. store_staff has many service_records.
9. services has many service_records.
10. service_records may have many feedback_records.
11. service_records may have many follow_up_tasks.
12. service_records may have many ai_summaries.
13. customers has many ai_summaries.
14. customers has many authorization_records.
15. events can relate to any major object.
16. knowledge_entries may relate to services, concerns, devices, or AI output.

---

## 22. Required Indexes

Initial indexes should support fast MVP operations.

Suggested indexes:

1. customers.phone.
2. customers.name.
3. customers.primary_store_id.
4. health_one_identities.customer_id.
5. health_one_profiles.customer_id.
6. health_concerns.customer_id.
7. health_goals.customer_id.
8. service_records.customer_id.
9. service_records.store_id.
10. service_records.service_time.
11. feedback_records.service_record_id.
12. follow_up_tasks.customer_id.
13. follow_up_tasks.status.
14. follow_up_tasks.planned_at.
15. ai_summaries.customer_id.
16. knowledge_entries.category.
17. knowledge_entries.status.
18. events.event_type.
19. events.customer_id.
20. events.occurred_at.

Indexes should remain practical.

Do not over-index before actual usage.

---

## 23. Required Audit Fields

Most MVP tables should include:

1. id.
2. created_at.
3. updated_at where useful.
4. created_by where useful.
5. status where useful.

For sensitive or important records, preserve:

1. source.
2. related object.
3. staff or operator.
4. time.
5. review status where needed.

Auditability supports trust.

---

## 24. Data Sensitivity Boundary

The MVP database should avoid collecting:

1. Excessive health data.
2. Diagnosis data.
3. Unnecessary medical details.
4. Sensitive personal conclusions.
5. Complex financial records.
6. Complex partner settlement records.
7. Unbounded raw chat history.
8. Unreviewed AI health conclusions.

Health One should collect useful service memory, not uncontrolled sensitive data.

---

## 25. AI Memory Boundary in Database

AI memory should be stored through structured objects.

Recommended storage points:

1. ai_summaries.
2. service_records.
3. feedback_records.
4. follow_up_tasks.
5. health_one_profiles.
6. events.

Do not store AI memory only as raw chat logs.

Do not let AI overwrite customer facts without traceable update logic.

---

## 26. Knowledge Base Boundary in Database

Knowledge entries may be stored in the database or in structured files during MVP.

If stored in database, use knowledge_entries.

If stored in files, future migration should preserve:

1. title.
2. category.
3. audience.
4. content.
5. status.
6. usage scope.
7. related service.
8. related concern.
9. customer-facing flag.
10. internal-only flag.

The MVP should prioritize clarity over technical complexity.

---

## 27. Authorization Boundary in Database

Authorization must exist from the beginning, even if simple.

Minimum implementation:

1. Customer record belongs to a customer identity.
2. Store access is tied to service relationship.
3. Staff access is tied to store role.
4. AI context usage is tied to authorization scope.
5. Internal-only knowledge is not customer-facing.
6. Platform operator review is bounded.

Do not overbuild enterprise RBAC in MVP.

Do not ignore access boundaries.

---

## 28. Migration Boundary

Before implementation, engineering should define:

1. Migration tool.
2. Initial migration file.
3. Seed data approach.
4. Rollback approach if needed.
5. Local development database.
6. Test database if needed.
7. Data reset strategy for MVP testing.
8. No-secret policy.

Migration should be simple and reviewable.

---

## 29. Seed Data Recommendation

Initial seed data may include:

1. One store.
2. One or two staff members.
3. Core service types.
4. Graphene far-infrared cabin service.
5. Common concern categories.
6. Initial knowledge entries.
7. Basic AI boundary notes.

Seed data should support local testing and store validation.

---

## 30. Database Implementation Readiness

Before actual schema implementation, confirm:

1. Tech stack.
2. Database choice.
3. ORM or query approach.
4. Migration approach.
5. Local development setup.
6. Naming convention.
7. Required MVP tables.
8. Optional device tables decision.
9. Seed data approach.
10. Review checkpoint.

Do not start schema implementation without these decisions.

---

## 31. Current Baseline Database Decisions

As of this document version, the following database decisions are Baseline:

1. Database design must support the first value loop.
2. Customer, 健康元 Profile, Service Record, Feedback, Follow-Up Task, AI Summary, Knowledge Entry, Authorization Record, and Event are core.
3. Database should remain minimal in MVP.
4. Device tables are optional unless first service scenario requires them.
5. AI memory must be structured and traceable.
6. Knowledge entries must distinguish audience and status.
7. Authorization boundaries must exist from the beginning.
8. Event logging should be lightweight but present.
9. Sensitive data collection should be limited.
10. Final implementation requires technical setup confirmation.

---

## 32. End of Document

RFC-005 defines the initial database design proposal for Health One MVP.

Future schema, migration, API, Store Workbench, AI memory, knowledge base, and validation work should remain consistent with this proposal unless reviewed and approved.
