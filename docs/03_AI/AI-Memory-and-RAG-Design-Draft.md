# AI Memory and RAG Design Draft

Document ID : AI-001  
Title       : AI Memory and RAG Design Draft  
Version     : 1.0  
Status      : Baseline  
Owner       : Chief Architect  
Approver    : Founder  
Created     : 2026-06-28  
Updated     : 2026-06-28  
Depends On  : PROJECT-CONTEXT, BP-004, ADR-001, RFC-001, RFC-002, PRODUCT-001  
Related     : Knowledge Base Structure, Store Workbench, Store Service Workflow, MVP Execution Plan  

---

## 1. Purpose

This document defines the initial AI Memory and RAG design direction for Health One.

The purpose is to prevent Health One from becoming a generic chatbot system.

Health One AI should operate through:

1. Authorized customer context.
2. Structured health memory.
3. Service records.
4. Feedback.
5. Follow-up history.
6. Store knowledge.
7. Project-approved knowledge base.
8. Clear uncertainty boundaries.

This document does not define final AI infrastructure or vendor selection.

It defines the design boundary for AI memory and retrieval in the MVP preparation stage.

---

## 2. Core Principle

The core principle is:

> AI should help Health One remember, understand, explain, follow up, and improve service within authorized boundaries.

AI should not be treated as:

1. A free-form chatbot only.
2. A medical diagnosis engine.
3. A replacement for store staff.
4. A replacement for professionals.
5. A sales script machine.
6. A black-box decision maker.
7. A random memory collector.

AI must serve the Health One value loop.

---

## 3. AI Role in Health One

The AI role in Health One is:

1. Help customer express health concerns.
2. Help staff understand customer context.
3. Summarize service records.
4. Suggest follow-up.
5. Retrieve approved knowledge.
6. Generate customer-friendly explanations.
7. Identify missing information.
8. Mark uncertainty.
9. Support store workflow.
10. Help health memory grow over time.

AI should improve continuity.

AI should not create unsupported certainty.

---

## 4. AI Memory Definition

AI Memory means structured, authorized, useful context that can support future service and follow-up.

AI Memory may include:

1. Customer profile.
2. Health concern.
3. Health goal.
4. Service record.
5. Device usage record.
6. Feedback.
7. Follow-up task and result.
8. AI summary.
9. Staff observation.
10. Customer preference.
11. Event timeline.
12. Insight.

AI Memory is not equal to raw chat history.

Raw chat may be a source, but it should be summarized, structured, authorized, and linked to domain objects.

---

## 5. Memory Ownership

The customer owns 健康元.

Therefore, customer-related AI memory should follow these rules:

1. Customer health context is not unrestricted platform property.
2. Store access should be based on service need and authorization.
3. Staff access should be practical but bounded.
4. AI use should be based on authorized context.
5. Sensitive information should not be collected without purpose.
6. Memory should support service and follow-up.
7. Memory should be explainable to the customer when needed.
8. Memory should not be used for aggressive sales manipulation.

Customer trust is a core architectural requirement.

---

## 6. Memory Sources

AI Memory may be created from:

1. Customer intake.
2. Customer AI conversation.
3. Store staff notes.
4. Service records.
5. Device usage records.
6. Feedback.
7. Follow-up results.
8. Knowledge base usage.
9. Operator review.
10. Customer return history.

Each memory item should have a source when possible.

Source traceability is important.

---

## 7. Memory Types

The MVP should distinguish the following memory types:

1. Customer fact.
2. Customer self-reported concern.
3. Health goal.
4. Staff observation.
5. Service record summary.
6. Feedback summary.
7. Follow-up result.
8. AI-generated summary.
9. Knowledge reference.
10. Uncertainty note.
11. Preference.
12. Event.

These types should not be mixed casually.

For example:

1. "Customer says waist feels tired" is a self-reported concern.
2. "Staff observed customer looked fatigued" is a staff observation.
3. "AI suggests follow-up in 3 days" is an AI suggestion.
4. "Customer completed graphene cabin service" is a service record.

---

## 8. Memory Structure

An MVP memory item should include:

1. Memory ID.
2. Customer ID.
3. Memory type.
4. Content.
5. Source object type.
6. Source object ID.
7. Created time.
8. Created by.
9. Authorization scope.
10. Confidence or uncertainty note.
11. Related health concern.
12. Related service record if applicable.
13. Status.

This structure may later become part of the database design.

At this stage it is a design boundary.

---

## 9. AI Summary

AI Summary is a structured AI-generated output.

AI Summary may include:

1. Customer context summary.
2. Health concern summary.
3. Service summary.
4. Feedback summary.
5. Follow-up suggestion.
6. Staff communication draft.
7. Customer explanation draft.
8. Knowledge-based answer.
9. Missing information note.
10. Uncertainty note.

AI Summary should be traceable to source context.

AI Summary should not be treated as final truth without review where review is needed.

---

## 10. AI Memory Update Rule

AI should not automatically overwrite important customer memory without structure.

Recommended MVP rule:

1. AI may generate a proposed summary.
2. Staff or system may save it as AI Summary.
3. Important memory updates should be linked to source records.
4. Uncertainty should be preserved.
5. Customer facts, staff observations, and AI interpretations should remain distinguishable.
6. Follow-up results should update memory only after they are recorded.
7. Historical memory should not be silently erased.

Memory should grow through traceable updates.

---

## 11. RAG Definition

RAG means Retrieval-Augmented Generation.

In Health One, RAG should mean:

> AI retrieves approved knowledge and authorized context before generating an answer, summary, explanation, or suggestion.

RAG should not mean randomly dumping documents into AI.

RAG should be structured around:

1. Customer context.
2. Service knowledge.
3. Device knowledge.
4. Store workflow.
5. Follow-up templates.
6. AI boundaries.
7. Health concern guidance.
8. Project governance where relevant.

---

## 12. RAG Knowledge Sources

The MVP may use these knowledge sources:

1. Service descriptions.
2. Device descriptions.
3. Common concern explanations.
4. Follow-up templates.
5. Store SOP notes.
6. Staff training notes.
7. Customer education content.
8. AI boundary notes.
9. Project-approved product documents.
10. Architecture and governance documents where relevant.

Not every document should be used for every AI answer.

Retrieval scope should match the task.

---

## 13. Knowledge Source Separation

Health One should separate:

1. Project Knowledge.
2. Product Knowledge.
3. Store Knowledge.
4. Customer Memory.
5. AI Output.

Project Knowledge includes governance, blueprint, architecture, and release documents.

Product Knowledge includes service, device, concern, follow-up, and customer education content.

Store Knowledge includes store-specific SOPs, local operations, staff notes, and store service rules.

Customer Memory includes customer-specific authorized context.

AI Output includes generated summaries, suggestions, and explanations.

These layers should not be mixed without purpose.

---

## 14. MVP RAG Scope

The first MVP RAG scope should remain small.

It should support:

1. Service explanation.
2. Device explanation.
3. Common concern guidance.
4. Follow-up template retrieval.
5. Staff SOP retrieval.
6. Customer education answer.
7. AI response boundary reference.
8. Customer summary support using authorized memory.

Advanced multi-source RAG can be delayed.

---

## 15. RAG Exclusions

The first MVP should not build:

1. Large-scale unstructured document ingestion.
2. Complex vector database architecture before need is clear.
3. Medical diagnosis knowledge engine.
4. Autonomous treatment recommendation engine.
5. Unreviewed internet retrieval for customer health advice.
6. Aggressive sales script retrieval.
7. Complex multi-tenant knowledge permission system.
8. Fully automated AI decision pipeline.

The first version can be lightweight.

---

## 16. Retrieval Context Types

AI retrieval may use:

1. Customer memory context.
2. Recent service record context.
3. Recent feedback context.
4. Follow-up context.
5. Concern-related knowledge.
6. Service-related knowledge.
7. Device-related knowledge.
8. Staff SOP knowledge.
9. AI boundary rules.
10. Store-specific notes if authorized.

The system should avoid giving AI irrelevant context.

---

## 17. AI Output Types

MVP AI outputs may include:

1. Customer context summary.
2. Service summary.
3. Follow-up suggestion.
4. Customer-facing explanation.
5. Staff-facing note.
6. Knowledge-based answer.
7. Missing information checklist.
8. Next action recommendation.
9. Risk or uncertainty note.
10. Memory update suggestion.

Outputs should be short, practical, and traceable.

---

## 18. Customer-Facing AI Boundary

Customer-facing AI should:

1. Use simple language.
2. Avoid medical diagnosis claims.
3. Explain services conservatively.
4. Encourage professional consultation when needed.
5. Reference customer's own goals and concerns.
6. Avoid fear-based or aggressive sales language.
7. Support follow-up and continuity.
8. Respect customer authorization.

Customer-facing AI must maintain trust.

---

## 19. Staff-Facing AI Boundary

Staff-facing AI should:

1. Summarize customer context.
2. Highlight recent service history.
3. Suggest follow-up.
4. Help explain services.
5. Identify missing information.
6. Provide communication drafts.
7. Mark uncertainty.
8. Remind staff to confirm important details.

Staff-facing AI supports staff.

It does not replace staff responsibility.

---

## 20. Platform-Facing AI Boundary

Platform-facing AI may help:

1. Review service records.
2. Identify follow-up gaps.
3. Detect knowledge gaps.
4. Summarize MVP validation signals.
5. Suggest process improvements.
6. Summarize store usage.
7. Support Founder review.
8. Improve knowledge base structure.

Platform-facing AI should not become a complex BI system in MVP.

---

## 21. AI Safety and Trust Rules

AI should follow these rules:

1. Do not diagnose disease.
2. Do not claim guaranteed outcomes.
3. Do not replace medical professionals.
4. Do not fabricate customer history.
5. Do not hide uncertainty.
6. Do not use unauthorized context.
7. Do not pressure customers into purchase.
8. Do not mix AI interpretation with customer facts.
9. Do not make unsupported device claims.
10. Do not produce sensitive health conclusions without basis.

These rules should be applied from MVP stage.

---

## 22. Memory Traceability

Each important AI output should be traceable to source context.

Traceability may include:

1. Related customer.
2. Related health concern.
3. Related service record.
4. Related feedback.
5. Related knowledge entry.
6. Related follow-up task.
7. Prompt or generation context if needed.
8. Created time.
9. Review status.

Traceability supports trust, auditability, and improvement.

---

## 23. Human Review Boundary

Human review should be required when AI output affects:

1. Important customer health memory.
2. Follow-up decision.
3. Sensitive customer communication.
4. Service recommendation.
5. Store operation decision.
6. Knowledge base update.
7. Customer-facing explanation in uncertain cases.

The MVP can use lightweight review.

Not every AI draft requires complex approval.

---

## 24. MVP AI Workflow

Recommended MVP AI workflow:

1. Customer or staff records concern.
2. System retrieves relevant customer context.
3. System retrieves relevant knowledge entries.
4. AI generates summary or suggestion.
5. AI marks uncertainty or missing information.
6. Staff reviews or uses output.
7. Service record is created.
8. Feedback is recorded.
9. AI suggests follow-up.
10. Follow-up result updates memory.
11. Event is recorded.
12. Loop repeats.

This workflow should stay aligned with the Store Workbench.

---

## 25. Knowledge Entry Requirements

Knowledge entries used by AI should include:

1. Title.
2. Category.
3. Content.
4. Usage scope.
5. Related service.
6. Related device.
7. Related concern category.
8. Customer-facing or staff-facing flag.
9. Status.
10. Updated time.

Knowledge should be structured enough for retrieval.

---

## 26. Memory and Knowledge Difference

Memory answers:

> What do we know about this customer over time?

Knowledge answers:

> What approved information can help explain or guide this situation?

They are different.

For example:

1. Customer memory: this customer reported waist fatigue after golf.
2. Knowledge: graphene far-infrared cabin service explanation.
3. AI output: a follow-up message based on both memory and knowledge.

The system should preserve this distinction.

---

## 27. MVP Implementation Options

The first implementation may be lightweight.

Possible options:

1. Markdown-based knowledge entries.
2. Database records for customer memory.
3. Simple retrieval by category and keyword.
4. Manual tagging before vector search.
5. AI summary saved as structured record.
6. Staff-reviewed memory updates.
7. Basic authorization flags.
8. Event logs for AI usage.

Advanced vector database and complex RAG orchestration may be deferred until real usage requires it.

---

## 28. Data Privacy and Sensitivity Boundary

The MVP should avoid unnecessary sensitive data collection.

AI should not store or infer sensitive information unless clearly necessary and authorized.

The system should avoid:

1. Excessive medical detail.
2. Unsupported diagnosis.
3. Sensitive personal conclusions.
4. Hidden profiling.
5. Unclear data usage.
6. Unbounded memory accumulation.

Trust is more important than data volume.

---

## 29. Validation Questions

AI Memory and RAG should be validated by asking:

1. Does AI output help staff serve the customer?
2. Does AI output help customer understand the service?
3. Is the output grounded in memory and knowledge?
4. Is uncertainty visible?
5. Can staff trace where the summary came from?
6. Does follow-up improve?
7. Does memory become more useful after each service?
8. Is the knowledge base actually used?
9. Does AI reduce staff burden?
10. Does AI preserve customer trust?

---

## 30. Success Signals

Success signals include:

1. Staff use AI summaries.
2. Follow-up suggestions are practical.
3. Customers feel more understood.
4. Service records become more useful over time.
5. Knowledge entries reduce explanation inconsistency.
6. AI does not produce risky unsupported claims.
7. Memory improves repeat service.
8. Store operator sees operational value.
9. Customer return is easier to support.
10. AI output can be reviewed and improved.

---

## 31. Failure Signals

Failure signals include:

1. AI output is generic.
2. Staff ignore AI summaries.
3. AI invents customer context.
4. AI gives unsupported health claims.
5. Memory becomes messy chat history.
6. Knowledge base is unused.
7. Retrieval pulls irrelevant information.
8. Customers feel pressured or confused.
9. Follow-up does not improve.
10. Store workflow becomes slower because of AI.

These signals should trigger review.

---

## 32. Current Baseline Decisions

As of this document version, the following AI Memory and RAG decisions are Baseline:

1. AI must serve the Health One value loop.
2. AI Memory is structured authorized context, not raw chat history.
3. Customer owns 健康元.
4. AI should distinguish facts, observations, summaries, and suggestions.
5. RAG should retrieve approved knowledge and authorized customer context.
6. Project Knowledge, Product Knowledge, Store Knowledge, Customer Memory, and AI Output should be separated.
7. MVP RAG should remain lightweight.
8. AI should not diagnose disease or replace professionals.
9. AI output should be traceable.
10. Important memory updates should be structured and reviewable.
11. Knowledge should be structured before advanced RAG is built.
12. Store Workbench is the first practical AI usage context.

---

## 33. End of Document

AI-001 defines the initial AI Memory and RAG design draft for Health One.

Future AI, knowledge base, store workflow, data model, and engineering implementation should remain consistent with this document unless reviewed and approved.
