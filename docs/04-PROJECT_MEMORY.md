# Health One Project Memory

Document ID : PROJECT-MEMORY
Title       : Health One Project Memory
Version     : 1.0
Status      : Baseline
Owner       : Chief Architect
Approver    : Founder
Created     : 2026-06-28
Updated     : 2026-06-28
Depends On  : README, PROJECT, PROJECT-CONTEXT, REL-001, REL-002, REL-003
Related     : AI_START_HERE, Glossary, GOV-003

> **Canonical Source.** This is the official version of PROJECT-MEMORY.
> The root `PROJECT-MEMORY.md` is a redirect stub — always use this file.

---

## 1. Purpose

This document is the short project memory for Health One.


It exists to help any human or AI collaborator quickly understand the current state of the project without reading every document first.


This document should remain short, current, and operational.


---

## 2. One-Sentence Project Definition

Health One is a long-term health management ecosystem built around personal health identity, health memory, AI assistance, real store service, follow-up, and trust.

Health One is a long-term health management ecosystem built around personal health identity, health memory, AI assistance, real store service, follow-up, and trust.

---

## 3. Current Project Stage

Current completed stages:


1. Phase A: Foundation Baseline.
2. Phase B: Product and Architecture Blueprint Baseline.
3. Phase C: Execution Preparation Baseline.

Current active stage:


> Phase D: Controlled MVP Planning  

The project is not yet in full engineering implementation.


The current goal is to prepare a controlled MVP implementation plan before coding.


---

## 4. Current Releases

Current release logs:


1. REL-001 Foundation Baseline.
2. REL-002 Product and Architecture Blueprint Baseline.
3. REL-003 Execution Preparation Baseline.

Current planned next release:


> REL-004 Controlled MVP Planning Baseline

REL-004 should close Phase D before Sprint 2 implementation begins.

REL-004 Sprint 2 Phase D

---

## 5. Founder

Founder:


-

Founder holds final approval authority over:


1. Project direction.
2. Business positioning.
3. Product priority.
4. Major architecture decision.
5. Baseline document release.
6. External cooperation.
7. Implementation timing.

No AI collaborator may override Founder approval.

AI

---

**2026-06-28**

正式建立 Founder Office。

以后所有重大决策，

统一进入：

`docs/founder/`

---

## 6. Current AI Role Model

Current ChatGPT role:


> Chief Architect

ChatGPT is responsible for:

ChatGPT

1. Product architecture.
2. System architecture.
3. AI architecture.
4. MVP planning.
5. Document drafting.
6. Document review.
7. Release sequencing.
8. Risk control.
9. Strategic coherence.

Current Claude Code role:


> Release Engineer

Claude Code is responsible for:

Claude Code

1. Git status check.
2. File creation.
3. Markdown writing.
4. Commit.
5. Push.
6. Result reporting.
7. Repository consistency check.

Claude Code must not independently create product direction, architecture decisions, or business logic.

Claude Code

---

## 7. Source of Truth

The formal source of truth is:

> The latest approved Git repository content.  

Priority order:

1. Latest approved Git content.
2. Latest committed Baseline document.
3. Release log.
4. Founder's explicit latest instruction.
5. Chief Architect's reviewed recommendation.
6. Informal chat history.
7. AI memory.

If chat conflicts with Git, Git wins.


If AI memory conflicts with Git, Git wins.

AI GitGit

---

## 8. Current Repository Location

Local working directory:


```text
/Users/jinnanlaoshi/health-one
```

Short path:


```text
~/health-one
```

Formal Git and Claude Code work should run from:

Git Claude Code

```bash
cd ~/health-one
```

Do not move the real repository back to Desktop.


A Desktop shortcut or symbolic link may be used only for convenience.


---

## 9. Current MVP Definition

MVP means:

MVP

> The shortest complete value loop that proves Health One can create repeatable health value.
> Health One

MVP does not mean:

MVP

1. The smallest number of screens.
2. A simple booking tool.
3. A generic CRM.
4. A chatbot demo.
5. A marketplace prototype.
6. A device usage log only.

MVP must connect real customer service with long-term health memory.

MVP

---

## 10. First Value Loop

The first value loop is:


```text
Customer Entry
→ Customer Lookup or Creation
→ Activation or Update
→ Health Concern Intake
→ Store Service
→ Service Record
→ Customer Feedback
→ AI Summary
→ Follow-Up Task
→ Customer Return
```

The MVP succeeds only if this loop can be completed in real store conditions.

MVP

---

## 11. Current MVP Scope

The MVP should focus on:


1. Customer.
2. Store Staff.
3. Platform Operator / Founder.
4. Customer identity.
5. profile.
6. Health concern intake.
7. Service record.
8. Feedback record.
9. Follow-up task.
10. AI summary.
11. Knowledge entry.
12. Event logging.
13. Basic authorization.

The MVP should start with one store, one simple service workflow, and limited customer scenarios.

MVP

---

## 12. Current MVP Exclusions

The MVP must not include:


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

These may be future modules, but not MVP modules.

MVP

---

## 13. Current Core Product Objects

Current core objects:


1. Customer
2. Health One Identity
3. Profile
4. Health Concern
5. Health Goal
6. Store
7. Store Staff
8. Service
9. Service Record
10. Feedback Record
11. Follow-Up Task
12. AI Summary AI
13. Knowledge Entry
14. Authorization Record
15. Event

Device and Device Usage Record are optional for the first MVP unless the first service scenario requires them.


---

## 14. Current Store Workbench Screens

The current Store Workbench MVP includes 10 possible screens:

MVP10

1. Dashboard / Today's Tasks
2. Customer Search / Create
3. Customer Summary
4. Health Concern Intake
5. Service Record
6. Feedback Record
7. Follow-Up Task
8. AI Summary Panel AI
9. Knowledge Entry View
10. Operator Review

Minimum manual loop screens:


1. Customer Search / Create.
2. Customer Summary.
3. Health Concern Intake.
4. Service Record.
5. Feedback Record.
6. Follow-Up Task.

AI and Knowledge screens may be added after the manual loop works.

AI

---

## 15. Current Database Direction

The initial database proposal includes 15 core tables:

15

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

Optional tables:


1. devices.
2. device_usage_records.

Database implementation must not begin before technical setup confirmation.


---

## 16. Current AI Direction

AI should support:

AI

1. Customer context summary.
2. Service summary.
3. Follow-up suggestion.
4. Customer-facing explanation draft.
5. Staff-facing note.
6. Knowledge-based answer.
7. Missing information checklist.
8. Uncertainty note.

AI must not:

AI

1. Diagnose disease.
2. Replace medical professionals.
3. Make unsupported claims.
4. Use unauthorized context.
5. Create aggressive sales scripts.
6. Save unreviewed sensitive memory.

AI Memory must be structured, authorized, and traceable.

AI

---

## 17. Current Knowledge Base Direction

Knowledge Base should separate:


1. Project Knowledge
2. Product Knowledge
3. Store Knowledge
4. Service Knowledge
5. Device Knowledge
6. Customer Education Knowledge
7. AI Policy and Prompt Knowledge AI
8. Follow-Up Knowledge
9. Research Knowledge
10. Release Knowledge

MVP Knowledge Base should remain small, useful, and reviewed.

MVP

Advanced RAG should wait until knowledge structure is clear.

RAG

---

## 18. Current Technical Direction

The technical implementation should be incremental.


Recommended implementation sequence:


1. Confirm codebase and tech stack.
2. Confirm local development environment.
3. Confirm database choice.
4. Create database schema proposal.
5. Build Store Workbench skeleton.
6. Build Customer Search / Create.
7. Build Summary.
8. Build Health Concern Intake.
9. Build Service Record.
10. Build Feedback Record.
11. Build Follow-Up Task.
12. Add AI Summary.
13. Add Knowledge Entry View.
14. Add Event Logging.
15. Validate in real store.

Do not skip into full platform development.


---

## 19. Current Active Risks

Active risks:


1. Context loss from long chat.
2. Coding before MVP planning closes.
3. Overbuilding database schema.
4. Building too many screens.
5. Making Store Workbench too complex.
6. Treating AI as generic chatbot.
7. Building RAG before knowledge structure is ready.
8. Losing customer ownership principle.
9. Collecting too much sensitive customer data.
10. Expanding into CRM, ERP, marketplace, franchise, or token systems too early.
11. Letting multiple AI windows create conflicting project truth.
12. Keeping documents English-only and hard for Founder or team to read.

These risks should be actively controlled.


---

## 20. Current Language Policy

Current documents are mostly English.


Future recommended direction:


> English primary term + Chinese annotation.
> +

Example:


```text
Health Memory
Service Record
Follow-Up Task
Knowledge Entry
AI Summary AI
```

Old documents should not be mass-rewritten immediately.


Future documents should gradually adopt bilingual headings and key term annotations.


A Glossary should be created to standardize terms.


---

## 21. Current Next Work

Recommended next work:


1. AI_START_HERE.md.
2. Glossary.md.
3. Finish Phase D remaining planning documents if still needed.
4. REL-004 Controlled MVP Planning Baseline.
5. Sprint 2 Controlled MVP Implementation.

Do not continue unlimited planning documents.


After AI_START_HERE and Glossary, the project should move toward implementation readiness.

AI_START_HEREGlossary

---

## 22. AI Onboarding Rule

Any AI collaborator should read in this order:

AI

1. PROJECT-MEMORY.md.
2. AI_START_HERE.md.
3. PROJECT-CONTEXT.md.
4. README.md.
5. Latest Release Log.
6. Latest RFC or relevant document.
7. Task-specific files.

If an AI lacks context, it should ask for the latest Git status and relevant documents.

AI Git

Do not rely on chat history as formal truth.


---

## 23. Current Git Discipline

Before formal work:


```bash
git status
git log --oneline -12
```

Proceed only if:


1. Branch is main.
2. Working tree is clean.
3. Remote is up to date.
4. Task is approved.
5. File path is clear.
6. Commit message is clear.

Only one Claude Code or Git writing process should operate on this repository at a time.

Claude CodeGit

---

## 24. Current Baseline Documents

Current major Baseline groups:


1. Foundation:

   * GOV-001
   * GOV-002
   * GOV-003
   * PROJECT
   * MANIFESTO
   * CHARTER
   * README

2. Blueprint:

   * BP-001
   * BP-002
   * BP-003
   * BP-004

3. Execution Preparation:

   * PROJECT-CONTEXT
   * ADR-001
   * RFC-001
   * RFC-002
   * PRODUCT-001
   * PRODUCT-002
   * AI-001
   * AI-002
   * REL-003

4. MVP Planning:

   * RFC-003
   * RFC-004
   * RFC-005
   * PRODUCT-003

---

## 25. End of Document

PROJECT-MEMORY.md is the short working memory of Health One.

PROJECT-MEMORY.mdHealth One

It should be updated when:


1. Project phase changes.
2. Release status changes.
3. MVP scope changes materially.
4. Architecture direction changes.
5. AI role changes.
6. Major risks change.
7. Sprint changes.

This document should remain concise.
