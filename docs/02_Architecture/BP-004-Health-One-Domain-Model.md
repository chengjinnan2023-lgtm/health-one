# BP-004 Health One Domain Model

Document ID : BP-004  
Title       : Health One Domain Model  
Version     : 1.0  
Status      : Baseline  
Owner       : Chief Architect  
Approver    : Founder  
Created     : 2026-06-28  
Updated     : 2026-06-28  
Depends On  : PROJECT, MANIFESTO, CHARTER, BP-001, BP-002, BP-003  
Related     : WP-001, ADR-001, RFC-001  

---

## 1. Purpose

This document defines the initial domain model of Health One.

The domain model identifies the core objects that should guide future product, architecture, engineering, AI, knowledge base, and business design.

BP-001 defines the World Model.  
BP-002 defines the MVP and First Value Loop.  
BP-003 defines the Health One Lifecycle.  
BP-004 defines the core domain objects that make the world, loop, and lifecycle operable.

This document does not define the final database schema.

It defines the conceptual model that should guide future schema, API, UI, AI memory, RAG, store workflow, and business system design.

---

## 2. Domain Model Principle

The Health One domain model follows this principle:

> Health One should be modeled around long-term health identity, memory, service, follow-up, trust, and ecosystem learning.

The system should not be modeled only around transactions, appointments, products, or marketing leads.

Transactions, appointments, products, and marketing activities may exist, but they should serve the health value loop rather than define the whole system.

---

## 3. Core Domain Objects

The initial Health One domain model includes the following core objects:

1. Customer.
2. Health One Identity.
3. 健康元.
4. Health Memory.
5. Health Goal.
6. Health Concern.
7. AI Health Companion.
8. Store.
9. Store Staff.
10. Health Manager.
11. Service.
12. Service Record.
13. Device.
14. Device Usage Record.
15. Feedback.
16. Follow-Up.
17. Knowledge Base.
18. Authorization.
19. Relationship.
20. Partner.
21. Product.
22. Order or Transaction.
23. Contribution.
24. Growth.
25. Insight.
26. Task.
27. Event.
28. Release Knowledge.

These objects may evolve, but they provide the initial conceptual foundation.

---

## 4. Object: Customer

The Customer is the human subject of the Health One ecosystem.

A Customer is not merely a user account, lead, member card, or transaction record.

A Customer may have:

1. Identity.
2. Health memory.
3. Goals.
4. Concerns.
5. Service history.
6. Store relationships.
7. AI interactions.
8. Feedback.
9. Trust history.
10. Growth trajectory.

The Customer is the center of the Health One value loop.

---

## 5. Object: Health One Identity

Health One Identity is the customer's recognized identity within the Health One system.

It allows the system to recognize the same customer over time.

It may include:

1. Basic identity information.
2. Contact method.
3. Account or member identifier.
4. Store binding.
5. Authorization status.
6. Health One activation status.
7. Relationship history.

The identity should be treated as long-term infrastructure, not merely login information.

---

## 6. Object: 健康元

健康元 is the customer's personal health identity and long-term health memory container inside Health One.

健康元 represents:

1. Who the customer is in a health context.
2. What the customer cares about.
3. What health concerns exist.
4. What goals the customer is pursuing.
5. What services the customer has received.
6. What feedback has been given.
7. What AI understands.
8. How the customer's health journey evolves over time.

健康元 should grow through real interactions.

It is the central object of Health One.

---

## 7. Object: Health Memory

Health Memory is the accumulated context of the customer's health journey.

It may include:

1. Health concerns.
2. Health goals.
3. Service history.
4. Device usage.
5. Customer feedback.
6. Staff observations.
7. AI summaries.
8. Follow-up results.
9. Change over time.
10. Important customer preferences.

Health Memory should be structured enough to support AI, store service, follow-up, and future analysis.

Health Memory should not be collected without purpose.

---

## 8. Object: Health Goal

A Health Goal represents what the customer wants to improve or maintain.

Examples may include:

1. Reduce fatigue.
2. Improve shoulder and neck comfort.
3. Improve waist and back condition.
4. Support sports recovery.
5. Support weight management.
6. Improve sleep quality.
7. Improve daily energy.
8. Maintain long-term body condition.

A Health Goal should connect to services, follow-ups, feedback, and growth.

---

## 9. Object: Health Concern

A Health Concern represents the customer's current issue, discomfort, question, or health management need.

A concern may be:

1. Self-reported by customer.
2. Observed by staff.
3. Discussed with AI.
4. Connected to a service.
5. Tracked over time.

A Health Concern is not necessarily a medical diagnosis.

The system should distinguish customer statements, staff observations, AI interpretations, and professional conclusions.

---

## 10. Object: AI Health Companion

The AI Health Companion is the AI role that interacts with or supports the customer.

It should help with:

1. Intake.
2. Understanding.
3. Explanation.
4. Guidance.
5. Service preparation.
6. Follow-up.
7. Memory summary.
8. Progress review.
9. Knowledge retrieval.
10. Trust-building communication.

The AI Health Companion should operate through authorized context and should not claim unsupported certainty.

---

## 11. Object: Store

A Store is a real-world health service node.

A Store may have:

1. Location.
2. Staff.
3. Devices.
4. Services.
5. Customers.
6. Operating records.
7. Partner relationships.
8. Store knowledge.
9. Service capacity.
10. Business performance.

A Store is not only a sales point.

It is where Health One becomes real through human service.

---

## 12. Object: Store Staff

Store Staff are people who operate in the store and interact with customers.

Store Staff may:

1. Receive customers.
2. Record customer concerns.
3. Explain services.
4. Deliver services.
5. Record observations.
6. Trigger follow-up.
7. Maintain relationships.
8. Use the store workbench.

Store Staff usability is critical.

If Store Staff do not use the system, the value loop breaks.

---

## 13. Object: Health Manager

A Health Manager is a role responsible for more continuous customer health management.

A Health Manager may:

1. Review customer history.
2. Coordinate services.
3. Interpret customer needs.
4. Follow up.
5. Support health planning.
6. Work with AI.
7. Escalate issues when needed.
8. Maintain long-term customer trust.

At the MVP stage, the Health Manager role may overlap with Store Staff.

Later, it may become a distinct professional role.

---

## 14. Object: Service

A Service is a structured health-related offering delivered by a store, staff, device, or partner.

A Service may include:

1. Graphene far-infrared cabin usage.
2. Recovery service.
3. Shoulder and neck comfort service.
4. Waist and back comfort service.
5. Fatigue recovery.
6. Weight management service.
7. Consultation.
8. Follow-up service.

A Service should connect to customer needs and health goals.

---

## 15. Object: Service Record

A Service Record is the structured record of a completed or attempted service.

It may include:

1. Customer.
2. Store.
3. Staff.
4. Service type.
5. Time.
6. Customer concern.
7. Staff observation.
8. Device usage if applicable.
9. Customer feedback.
10. Follow-up plan.
11. AI summary.
12. Next suggested action.

The Service Record is a core object because it turns real-world service into long-term memory.

---

## 16. Object: Device

A Device is a physical equipment object used in store service.

At the current stage, an important Device type is the graphene far-infrared health cabin.

A Device may have:

1. Device ID.
2. Store location.
3. Device type.
4. Operating status.
5. Usage records.
6. Maintenance records.
7. Service capacity.
8. Related service types.

A Device should not be modeled only as equipment.

It is part of the customer service and memory loop.

---

## 17. Object: Device Usage Record

A Device Usage Record records the customer's use of a device.

It may include:

1. Customer.
2. Device.
3. Store.
4. Service record.
5. Start time.
6. End time.
7. Duration.
8. Usage mode if applicable.
9. Staff observation.
10. Customer feedback.

Device usage should enrich Health Memory when relevant.

---

## 18. Object: Feedback

Feedback is the customer's response to a service, AI interaction, follow-up, or experience.

Feedback may include:

1. Immediate feeling.
2. Satisfaction.
3. Change in discomfort.
4. Energy level.
5. Questions.
6. Concerns.
7. Willingness to return.
8. Suggestions.
9. Trust signal.
10. Negative experience.

Feedback is essential for learning.

Without feedback, Health One cannot improve service or AI.

---

## 19. Object: Follow-Up

Follow-Up is an action after service or interaction that maintains continuity.

A Follow-Up may be:

1. AI-generated.
2. Staff-driven.
3. Scheduled.
4. Triggered by service record.
5. Triggered by feedback.
6. Triggered by inactivity.
7. Related to a health goal.
8. Related to a next service.

Follow-Up is not optional.

It is part of the Health One value loop.

---

## 20. Object: Knowledge Base

The Knowledge Base stores structured knowledge used by the project, AI, stores, staff, and future product system.

It may include:

1. Project documents.
2. Store service knowledge.
3. Device knowledge.
4. Health service explanations.
5. Follow-up scripts.
6. Staff training material.
7. Business model documents.
8. Research notes.
9. Product and architecture documents.
10. AI prompts and policies.

The Knowledge Base is the shared brain of Health One.

---

## 21. Object: Authorization

Authorization defines what can be accessed, used, shared, or analyzed.

Authorization may apply to:

1. Customer health memory.
2. Store access.
3. Staff permissions.
4. AI context usage.
5. Partner access.
6. Platform analysis.
7. Service record visibility.
8. Follow-up communication.

Authorization protects trust and customer ownership.

Even in MVP, basic authorization logic should exist.

---

## 22. Object: Relationship

Relationship represents a meaningful connection between participants in the ecosystem.

Examples:

1. Customer and Store.
2. Customer and Staff.
3. Customer and Health Manager.
4. Customer and AI Health Companion.
5. Store and Partner.
6. Coach and Customer.
7. Store and Platform.
8. Device and Store.
9. Service and Health Goal.

Health One should model relationships because health value is created through continuity and trust.

---

## 23. Object: Partner

A Partner is an external or semi-external participant that contributes customers, services, knowledge, channels, or business resources.

Partners may include:

1. Coaches.
2. Sports venues.
3. Health service providers.
4. Supply chain partners.
5. Professional experts.
6. Business channels.
7. Financing resources.
8. Local operators.

Partners should be connected to the ecosystem only when they strengthen customer value, store capability, or platform learning.

---

## 24. Object: Product

A Product is a sellable or service-supporting item inside the Health One ecosystem.

A Product may be:

1. Health product.
2. Service package.
3. Device-related offering.
4. Store package.
5. Partner product.
6. Knowledge product.

Products should support the health value loop.

Health One should not become product-led before service value is proven.

---

## 25. Object: Order or Transaction

An Order or Transaction records payment, purchase, package usage, or settlement.

It may include:

1. Customer.
2. Store.
3. Product or service.
4. Price.
5. Payment status.
6. Package balance.
7. Commission or revenue sharing if applicable.
8. Time.
9. Related service record.

Transactions are important, but they are not the center of the Health One domain model.

They should support service, memory, and trust.

---

## 26. Object: Contribution

Contribution represents value created by participants in the ecosystem.

Contribution may come from:

1. Customer feedback.
2. Store service records.
3. Staff observations.
4. Partner referrals.
5. Knowledge creation.
6. AI interaction improvement.
7. Operational learning.
8. Community sharing.

At the current stage, Contribution should be recorded conceptually but not overbuilt.

Future contribution or value-sharing mechanisms may be explored only after real value creation is proven.

---

## 27. Object: Growth

Growth represents positive development over time.

Growth may apply to:

1. Customer health journey.
2. 健康元 completeness.
3. Store operating capability.
4. Staff service ability.
5. AI usefulness.
6. Knowledge base richness.
7. Partner ecosystem.
8. Platform learning.

Growth should be observed through repeated loops, not declared prematurely.

---

## 28. Object: Insight

An Insight is a structured interpretation generated from data, memory, service, feedback, or AI.

Insights may include:

1. Customer health summary.
2. Service recommendation.
3. Follow-up suggestion.
4. Store operation observation.
5. Customer retention signal.
6. Staff improvement suggestion.
7. Knowledge base update suggestion.
8. Risk or uncertainty note.

Insights should be explainable and traceable.

They should not be treated as unquestionable truth.

---

## 29. Object: Task

A Task is an action that needs to be completed by AI, staff, health manager, store, or platform operator.

Tasks may include:

1. Follow-up customer.
2. Record service.
3. Review feedback.
4. Contact inactive customer.
5. Update health memory.
6. Check device usage.
7. Prepare service explanation.
8. Review AI summary.

Tasks help convert knowledge into action.

---

## 30. Object: Event

An Event is something that happens in the Health One ecosystem.

Events may include:

1. Customer entry.
2. Health One activation.
3. AI conversation.
4. Store visit.
5. Service completion.
6. Device usage.
7. Feedback submission.
8. Follow-up sent.
9. Customer return.
10. Partner referral.
11. Staff action.
12. Knowledge update.

Events are important for timelines, auditability, and learning.

---

## 31. Object: Release Knowledge

Release Knowledge refers to formal project knowledge released into Git.

It includes:

1. Governance documents.
2. Foundation documents.
3. Product blueprints.
4. Architecture blueprints.
5. AI documents.
6. Business documents.
7. Engineering documents.
8. Research documents.
9. Logs.
10. Release records.

This object matters because Health One itself is being developed as a knowledge-driven project.

The project knowledge base is part of the Health One operating model.

---

## 32. Core Relationships

The initial core relationships include:

1. Customer owns 健康元.
2. 健康元 contains Health Memory.
3. Health Memory includes Goals, Concerns, Records, Feedback, and Insights.
4. Customer interacts with AI Health Companion.
5. Customer visits Store.
6. Store Staff serves Customer.
7. Service creates Service Record.
8. Device Usage Record may attach to Service Record.
9. Feedback enriches Health Memory.
10. Follow-Up continues the lifecycle.
11. Store participates in Relationship with Customer.
12. Partner may introduce Customer or Service.
13. Product and Transaction support but do not define the value loop.
14. Knowledge Base supports AI, Staff, and Platform.
15. Authorization governs access.
16. Events record what happens.
17. Tasks convert insights into action.
18. Growth emerges from repeated loops.

---

## 33. MVP Domain Objects

At the MVP stage, the priority domain objects should be:

1. Customer.
2. Health One Identity.
3. 健康元.
4. Health Memory.
5. Health Goal.
6. Health Concern.
7. AI Health Companion.
8. Store.
9. Store Staff.
10. Service.
11. Service Record.
12. Device.
13. Device Usage Record.
14. Feedback.
15. Follow-Up.
16. Knowledge Base.
17. Authorization.
18. Task.
19. Event.
20. Insight.

The MVP should not attempt to fully implement every long-term domain object.

---

## 34. Deferred Domain Objects

The following objects may be deferred or kept simple during MVP:

1. Complex Partner management.
2. Complex Product catalog.
3. Advanced Transaction settlement.
4. Full Contribution mechanism.
5. Advanced Growth analytics.
6. Complex multi-store hierarchy.
7. Full franchise system.
8. Token or blockchain objects.
9. Full digital human identity.
10. Advanced financial model.

These objects should not distract the first value loop.

---

## 35. Domain Model and Database Design

This domain model should guide database design, but it is not itself a database schema.

Database design should later define:

1. Tables.
2. Fields.
3. Relationships.
4. Indexes.
5. Permissions.
6. Data lifecycle.
7. Audit records.
8. AI context storage.
9. Knowledge retrieval structure.
10. Migration strategy.

Engineering should not convert this document directly into tables without design review.

---

## 36. Domain Model and AI Memory

AI memory should align with the domain model.

AI should not store random unstructured context when structured domain objects are available.

AI memory should distinguish:

1. Customer facts.
2. Customer self-reported concerns.
3. Staff observations.
4. Service records.
5. Feedback.
6. AI summaries.
7. Follow-up results.
8. Uncertainty.
9. Authorization scope.
10. Time sequence.

AI memory should be useful, explainable, and bounded.

---

## 37. Domain Model and Store Workbench

The Store Workbench should be designed around practical store objects:

1. Customer.
2. 健康元 summary.
3. Current concern.
4. Service record.
5. Device usage.
6. Staff observation.
7. Feedback.
8. Follow-up task.
9. Customer history.
10. Next action.

The Store Workbench should not expose unnecessary complexity to staff.

It should make the first value loop easier to complete.

---

## 38. Domain Model and Knowledge Base

The Knowledge Base should connect to the domain model.

Knowledge should be organized around:

1. Services.
2. Devices.
3. Health concerns.
4. Follow-up patterns.
5. Store operations.
6. AI guidance.
7. Customer education.
8. Partner cooperation.
9. Product explanations.
10. Governance and architecture.

The Knowledge Base should improve both human and AI work.

---

## 39. Domain Model and Business Design

Business design should respect the domain model.

Revenue should connect to real value objects such as:

1. Service.
2. Service package.
3. Store operating improvement.
4. Customer retention.
5. Partner contribution.
6. Product when it supports health goals.
7. Knowledge or training when useful.
8. Follow-up and long-term relationship.

Business should not be designed only around short-term conversion.

---

## 40. Domain Model Risks

Key risks include:

1. Over-modeling too early.
2. Turning every idea into an object.
3. Confusing domain model with database schema.
4. Ignoring staff usability.
5. Collecting data without service purpose.
6. Treating customer memory as platform property.
7. Making AI memory untraceable.
8. Building transaction logic before service value.
9. Building partner complexity before the core loop works.
10. Losing the customer-centered model.

These risks should be reviewed before engineering implementation.

---

## 41. Current Baseline Domain Decisions

As of this document version, the following domain decisions are Baseline:

1. 健康元 is the central domain object.
2. Customer owns 健康元.
3. Health Memory is core infrastructure.
4. Service Record connects real service to memory.
5. Follow-Up is a core object, not an optional marketing action.
6. Authorization must govern access to health memory.
7. Store Staff usability is critical.
8. AI Health Companion must operate through authorized context.
9. Knowledge Base supports both project development and future product intelligence.
10. Transactions support the value loop but do not define the system.
11. Contribution should be reserved conceptually but not overbuilt in MVP.
12. Domain model should guide but not replace database design.

---

## 42. End of Document

BP-004 defines the initial Health One Domain Model.

Future product, architecture, engineering, AI, and business documents should remain consistent with this model.
