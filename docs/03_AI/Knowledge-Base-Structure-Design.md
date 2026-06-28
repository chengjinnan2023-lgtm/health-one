# Knowledge Base Structure Design

Document ID : AI-002  
Title       : Knowledge Base Structure Design  
Version     : 1.0  
Status      : Baseline  
Owner       : Chief Architect  
Approver    : Founder  
Created     : 2026-06-28  
Updated     : 2026-06-28  
Depends On  : PROJECT-CONTEXT, ADR-001, RFC-001, RFC-002, AI-001  
Related     : Store Workbench, AI Memory, RAG, Store Service Workflow, MVP Execution Plan  

---

## 1. Purpose

This document defines the initial Knowledge Base structure for Health One.

The purpose is to make Health One knowledge usable by:

1. Founder.
2. Store staff.
3. Health managers.
4. AI Health Companion.
5. Platform operator.
6. Future developers.
7. Future RAG system.

This document does not define the final technical RAG architecture.

It defines how knowledge should be categorized, structured, governed, and used during MVP preparation.

---

## 2. Core Principle

The core principle is:

> The Knowledge Base should make service, AI, store operation, customer education, and project execution more consistent.

Knowledge should not be a random collection of documents.

Knowledge should be structured around practical use.

---

## 3. Knowledge Base Role

The Health One Knowledge Base should support:

1. Project governance.
2. Product design.
3. Architecture decisions.
4. Store service explanation.
5. Device explanation.
6. Staff training.
7. Customer education.
8. AI responses.
9. Follow-up templates.
10. Store workflow consistency.
11. MVP validation.
12. Future RAG retrieval.

The Knowledge Base is part of the Health One operating system.

---

## 4. Knowledge Layer Separation

Health One should separate the following knowledge layers:

1. Project Knowledge.
2. Product Knowledge.
3. Store Knowledge.
4. Service Knowledge.
5. Device Knowledge.
6. Customer Education Knowledge.
7. AI Policy and Prompt Knowledge.
8. Follow-Up Knowledge.
9. Research Knowledge.
10. Release Knowledge.

These layers may connect, but should not be mixed without structure.

---

## 5. Layer: Project Knowledge

Project Knowledge includes formal documents that guide the project itself.

Examples:

1. Governance documents.
2. Manifesto.
3. Charter.
4. Project origin.
5. Project context.
6. Release logs.
7. Product blueprints.
8. Architecture blueprints.
9. ADRs.
10. RFCs.

Current location:

```text
README.md
PROJECT.md
PROJECT-CONTEXT.md
docs/00_Foundation/
docs/01_Product/
docs/02_Architecture/
docs/05_Engineering/
docs/99_Log/
```

Purpose:

1. Keep project direction clear.
2. Keep AI collaborators aligned.
3. Prevent architecture drift.
4. Preserve decision history.

Project Knowledge should not be directly shown to customers unless rewritten into customer-facing content.

---

## 6. Layer: Product Knowledge

Product Knowledge defines how Health One product works.

Examples:

1. MVP scope.
2. Store Workbench design.
3. Customer journey.
4. 健康元 lifecycle.
5. Product workflows.
6. Feature boundaries.
7. Product terminology.
8. User roles.
9. Validation criteria.
10. Product exclusions.

Purpose:

1. Guide product design.
2. Guide UI and workflow.
3. Guide engineering scope.
4. Guide MVP validation.

Product Knowledge should be concise, structured, and versioned.

---

## 7. Layer: Store Knowledge

Store Knowledge supports real store operation.

Examples:

1. Store service SOP.
2. Customer reception process.
3. Staff operating rules.
4. Service recording standards.
5. Feedback collection process.
6. Follow-up process.
7. Store-specific notes.
8. Common staff questions.
9. Store role responsibilities.
10. Daily task guidance.

Purpose:

1. Help staff use Store Workbench.
2. Reduce training burden.
3. Make service more consistent.
4. Support real store validation.

Store Knowledge should be practical and staff-friendly.

---

## 8. Layer: Service Knowledge

Service Knowledge explains Health One services.

Examples:

1. Service name.
2. Service purpose.
3. Suitable customer concerns.
4. Service process.
5. Customer explanation.
6. Staff explanation.
7. Service precautions.
8. Follow-up notes.
9. Related devices.
10. Related health goals.

Service Knowledge should support:

1. Staff explanation.
2. AI explanation.
3. Customer education.
4. Service record consistency.
5. Follow-up suggestions.

Service Knowledge must avoid unsupported medical claims.

---

## 9. Layer: Device Knowledge

Device Knowledge explains physical devices used in services.

Current important device:

> Graphene far-infrared health cabin.

Device Knowledge may include:

1. Device name.
2. Device type.
3. Basic explanation.
4. Service use cases.
5. Operating notes.
6. Staff precautions.
7. Customer explanation.
8. Common questions.
9. Maintenance notes if needed.
10. Related services.

Device Knowledge should support service and trust.

It should not become exaggerated product promotion.

---

## 10. Layer: Customer Education Knowledge

Customer Education Knowledge is content that can be shown or explained to customers.

Examples:

1. What is 健康元.
2. Why health memory matters.
3. How follow-up helps.
4. What a service record means.
5. How store service supports long-term health management.
6. What graphene far-infrared service is.
7. Common concerns explanation.
8. How to give feedback.
9. How return visits improve continuity.
10. What AI can and cannot do.

Customer Education Knowledge should use simple language.

It should build trust, not pressure.

---

## 11. Layer: AI Policy and Prompt Knowledge

AI Policy and Prompt Knowledge guides AI behavior.

Examples:

1. AI response boundaries.
2. Medical claim restrictions.
3. Customer-facing style.
4. Staff-facing style.
5. Follow-up suggestion rules.
6. Memory update rules.
7. Uncertainty marking.
8. Retrieval scope rules.
9. Prompt templates.
10. Human review triggers.

Purpose:

1. Keep AI grounded.
2. Prevent unsupported claims.
3. Maintain consistency.
4. Support safe AI use.
5. Support future prompt engineering.

This layer should be controlled carefully.

---

## 12. Layer: Follow-Up Knowledge

Follow-Up Knowledge supports customer continuity.

Examples:

1. Follow-up timing guidance.
2. Follow-up message templates.
3. Follow-up reason categories.
4. Customer return guidance.
5. Staff follow-up checklist.
6. AI follow-up suggestion rules.
7. Feedback-based follow-up.
8. Inactive customer follow-up.
9. Post-service care explanation.
10. Follow-up result recording.

Follow-up is part of the Health One value loop.

Follow-Up Knowledge should remain service-oriented, not aggressive sales-oriented.

---

## 13. Layer: Research Knowledge

Research Knowledge includes external or internal learning materials.

Examples:

1. Health management research notes.
2. Industry trend notes.
3. Policy notes.
4. Case studies.
5. Device-related research.
6. Service model research.
7. AI health management notes.
8. Competitive analysis.
9. Store operation research.
10. Customer behavior insights.

Research Knowledge should be labeled clearly.

Research notes should not automatically become customer-facing claims.

---

## 14. Layer: Release Knowledge

Release Knowledge includes formal records of what has been approved.

Examples:

1. Release logs.
2. Baseline decisions.
3. Commit history summaries.
4. Phase completion records.
5. Change records.
6. Deprecated document notes.
7. Project status snapshots.

Purpose:

1. Preserve institutional memory.
2. Support AI onboarding.
3. Keep project history traceable.
4. Prevent repeated decisions.

Release Knowledge belongs to the formal project knowledge base.

---

## 15. Knowledge Entry Structure

Each Knowledge Entry should ideally include:

1. Knowledge Entry ID.
2. Title.
3. Layer.
4. Category.
5. Intended audience.
6. Content.
7. Usage scope.
8. Related service.
9. Related device.
10. Related concern category.
11. Source.
12. Status.
13. Created time.
14. Updated time.
15. Review status.

This structure supports future retrieval.

---

## 16. Suggested Knowledge Entry Audiences

Knowledge entries may target:

1. Founder.
2. Platform operator.
3. Store owner.
4. Store staff.
5. Health manager.
6. Customer.
7. AI.
8. Developer.
9. Partner.

Audience should be explicit when possible.

The same knowledge may need different versions for different audiences.

---

## 17. Suggested Knowledge Categories

Initial categories may include:

1. Project governance.
2. Product design.
3. Architecture.
4. Store SOP.
5. Service explanation.
6. Device explanation.
7. Common health concern.
8. Follow-up template.
9. Customer education.
10. AI boundary.
11. Staff training.
12. Research note.
13. Release record.

Categories should remain simple at first.

---

## 18. Knowledge Status

Knowledge entries should have statuses.

Suggested statuses:

1. Draft.
2. Review.
3. Baseline.
4. Deprecated.
5. Customer-facing.
6. Internal-only.

Status helps prevent unfinished knowledge from being used incorrectly.

---

## 19. Customer-Facing vs Internal Knowledge

Health One should distinguish customer-facing and internal knowledge.

Customer-facing knowledge should be:

1. Clear.
2. Conservative.
3. Easy to understand.
4. Free of unsupported claims.
5. Trust-building.
6. Service-oriented.

Internal knowledge may include:

1. Operational details.
2. Architecture decisions.
3. Business reasoning.
4. Staff notes.
5. Process issues.
6. AI rules.
7. Risk notes.

AI should not expose internal-only knowledge to customers.

---

## 20. Knowledge and AI Retrieval

AI retrieval should use knowledge according to task.

For example:

1. Customer explanation should retrieve customer-facing service knowledge.
2. Staff support should retrieve staff SOP and service knowledge.
3. Follow-up suggestion should retrieve follow-up templates and customer memory.
4. Product design discussion should retrieve project and product knowledge.
5. Engineering work should retrieve ADR, RFC, and data object documents.

Retrieval scope matters.

More context is not always better.

---

## 21. Knowledge and Customer Memory

Knowledge and Customer Memory are different.

Knowledge answers:

> What approved information do we know generally?

Customer Memory answers:

> What do we know about this customer over time?

They should be combined only when needed.

Example:

1. Customer Memory: customer reported shoulder and neck fatigue after playing golf.
2. Knowledge: shoulder and neck comfort service explanation.
3. AI Output: customer-specific follow-up message.

The system should preserve the distinction.

---

## 22. Knowledge and Store Workbench

Store Workbench should access knowledge in practical ways.

Possible uses:

1. Service explanation.
2. Device explanation.
3. Customer FAQ.
4. Staff SOP.
5. Follow-up template.
6. Common concern guidance.
7. AI summary support.
8. Training note.

Knowledge should appear at the point of use.

Staff should not need to search a large document library manually during service.

---

## 23. Knowledge and RAG

Future RAG should retrieve from structured knowledge entries.

Before advanced RAG, Health One should prepare:

1. Clear knowledge layers.
2. Entry categories.
3. Intended audiences.
4. Usage scopes.
5. Customer-facing flags.
6. Internal-only flags.
7. Related service tags.
8. Related concern tags.
9. Related device tags.
10. Review status.

This preparation is more important than choosing vector database too early.

---

## 24. MVP Knowledge Base Scope

The MVP Knowledge Base should include:

1. What is 健康元.
2. Store reception SOP.
3. Health concern intake guide.
4. Service record guide.
5. Graphene far-infrared cabin explanation.
6. Basic service explanation.
7. Feedback collection guide.
8. Follow-up templates.
9. AI response boundaries.
10. Staff training quick guide.

This is enough for the first MVP loop.

---

## 25. MVP Knowledge Base Exclusions

The MVP Knowledge Base should not try to include:

1. Full medical knowledge library.
2. Full health encyclopedia.
3. Large internet-scraped content.
4. Unreviewed treatment guidance.
5. Complex disease diagnosis content.
6. Large sales script library.
7. Full franchise training system.
8. Full partner knowledge system.
9. Complex policy database.
10. Overbuilt knowledge graph.

The first knowledge base should be small and useful.

---

## 26. Knowledge Review Principle

Knowledge should be reviewed before being used in customer-facing AI output.

Review should check:

1. Is the content accurate enough for its use?
2. Is the claim too strong?
3. Is the audience correct?
4. Is it customer-facing or internal?
5. Is the language clear?
6. Does it align with Health One principles?
7. Does it avoid unsupported medical claims?
8. Does it support the value loop?
9. Is it linked to the correct service, device, or concern?
10. Should it be Baseline or Draft?

Review protects trust.

---

## 27. Knowledge Entry Examples

Example 1:

```text
Title: What is 健康元
Layer: Customer Education Knowledge
Audience: Customer
Category: Customer education
Usage Scope: Customer explanation, AI customer-facing answer
Status: Baseline
```

Example 2:

```text
Title: Graphene Far-Infrared Cabin Basic Explanation
Layer: Device Knowledge
Audience: Store staff, Customer, AI
Category: Device explanation
Usage Scope: Service explanation, customer education
Status: Review
```

Example 3:

```text
Title: Post-Service Follow-Up Template
Layer: Follow-Up Knowledge
Audience: Store staff, AI
Category: Follow-up template
Usage Scope: Follow-up suggestion
Status: Baseline
```

---

## 28. Initial File Organization Recommendation

For MVP preparation, knowledge files may later be organized as:

```text
docs/06_Research/
docs/03_AI/
docs/01_Product/
docs/04_Business/
docs/05_Engineering/
```

If a product-facing knowledge library is created later, possible structure:

```text
knowledge/
├── customer-education/
├── services/
├── devices/
├── store-sop/
├── follow-up/
├── ai-boundaries/
└── research-notes/
```

This structure is only a future recommendation.

It does not authorize creating a new `knowledge/` directory yet.

---

## 29. RAG Implementation Readiness

Before implementing RAG, the project should clarify:

1. Knowledge entry format.
2. Knowledge categories.
3. Customer-facing vs internal flags.
4. Retrieval scope.
5. Authorization logic.
6. Memory and knowledge separation.
7. Review status.
8. AI output types.
9. Source citation behavior.
10. Logging and traceability.

RAG should not be implemented before these boundaries are clear.

---

## 30. Validation Questions

Knowledge Base structure should be validated by asking:

1. Can staff find useful explanations?
2. Can AI retrieve the correct knowledge?
3. Can customer-facing content be separated from internal content?
4. Are service and device explanations consistent?
5. Do follow-up templates improve continuity?
6. Does knowledge reduce staff training burden?
7. Does knowledge improve AI reliability?
8. Is the structure simple enough to maintain?
9. Are unsupported claims avoided?
10. Does the knowledge base support the first value loop?

---

## 31. Success Signals

Success signals include:

1. Staff use knowledge during service.
2. AI outputs become more consistent.
3. Customer explanations improve.
4. Follow-up messages become easier to generate.
5. Knowledge entries are easy to update.
6. Internal and customer-facing knowledge remain separated.
7. Service records become more consistent.
8. Store training becomes simpler.
9. RAG preparation becomes clearer.
10. Founder can review knowledge quality.

---

## 32. Failure Signals

Failure signals include:

1. Knowledge becomes a messy document dump.
2. AI retrieves irrelevant knowledge.
3. Staff do not use knowledge.
4. Customer-facing content contains unsupported claims.
5. Internal knowledge leaks into customer answers.
6. Knowledge categories become too complex.
7. RAG is built before content is structured.
8. Knowledge is outdated but still used.
9. Store workflow becomes slower.
10. No one owns review responsibility.

These signals should trigger review.

---

## 33. Current Baseline Decisions

As of this document version, the following Knowledge Base decisions are Baseline:

1. Knowledge Base is a system component, not only documentation.
2. Knowledge should be layered.
3. Project Knowledge, Product Knowledge, Store Knowledge, Customer Memory, and AI Output must be distinguished.
4. Customer-facing and internal knowledge must be separated.
5. MVP knowledge base should stay small and useful.
6. Advanced RAG should wait until knowledge structure is clear.
7. Knowledge entries should have audience, category, usage scope, and status.
8. AI retrieval should use task-appropriate knowledge.
9. Knowledge review protects customer trust.
10. The first knowledge base should support the first value loop.

---

## 34. End of Document

AI-002 defines the initial Knowledge Base structure for Health One.

Future AI, RAG, store workflow, product design, and engineering implementation should remain consistent with this document unless reviewed and approved.
