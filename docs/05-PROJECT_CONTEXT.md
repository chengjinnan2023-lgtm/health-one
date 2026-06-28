# Health One Project Context

Document ID : PROJECT-CONTEXT
Title       : Current Project Context
Version     : 1.0
Status      : Baseline
Owner       : Chief Architect
Approver    : Founder
Created     : 2026-06-28
Updated     : 2026-06-28
Depends On  : README, PROJECT, REL-001, REL-002
Related     : GOV-001, GOV-002, GOV-003, BP-001, BP-002, BP-003, BP-004

> **Canonical Source.** This is the official version of PROJECT-CONTEXT.
> The root `PROJECT-CONTEXT.md` is a redirect stub — always use this file.

---

## 1. Purpose

This document defines the current working context of the Health One project.

It is intended for:

1. Founder.
2. Chief Architect.
3. Claude Code.
4. AI collaborators.
5. Future developers.
6. Future product or business workspaces.

This document should be read before starting new work.

It summarizes the current stage, completed releases, active priorities, prohibited actions, and next recommended work.

---

## 2. Current Project Stage

Current stage:

> Sprint 1: Foundation Build

Completed phases:

1. Phase A: Foundation Baseline.
2. Phase B: Product and Architecture Blueprint Baseline.

Current phase:

> Phase C: Execution Preparation

Phase C is not full engineering implementation.

Phase C prepares the project for controlled MVP execution.

---

## 3. Current Repository Status

As of this context version, the repository has completed:

1. Project structure initialization.
2. Foundation governance.
3. Git governance.
4. AI onboarding governance.
5. Project origin document.
6. Manifesto.
7. Charter.
8. README.
9. Foundation release log.
10. World Model.
11. MVP and First Value Loop.
12. Health One Lifecycle.
13. Domain Model.
14. Repository hygiene with `.gitignore`.
15. Blueprint release log.

The repository is the formal source of truth.

---

## 4. Current Formal Releases

The current formal releases are:

| Release | Title | Status |
|---|---|---|
| REL-001 | Foundation Baseline Release | Baseline |
| REL-002 | Product and Architecture Blueprint Baseline Release | Baseline |

REL-001 established the foundation layer.

REL-002 established the product and architecture blueprint layer.

---

## 5. Current Baseline Documents

Current Baseline documents include:

1. `README.md`
2. `PROJECT.md`
3. `PROJECT-CONTEXT.md`
4. `docs/00_Foundation/Governance/GOV-001-Project-Governance.md`
5. `docs/00_Foundation/Governance/GOV-002-Git-Repository-Governance.md`
6. `docs/03_AI/GOV-003-AI-Onboarding.md`
7. `docs/00_Foundation/MANIFESTO.md`
8. `docs/00_Foundation/CHARTER.md`
9. `docs/99_Log/Release/REL-001-Foundation-Baseline.md`
10. `docs/02_Architecture/BP-001-World-Model.md`
11. `docs/01_Product/BP-002-MVP-and-First-Value-Loop.md`
12. `docs/01_Product/BP-003-Health-One-Lifecycle.md`
13. `docs/02_Architecture/BP-004-Health-One-Domain-Model.md`
14. `docs/99_Log/Release/REL-002-Blueprint-Baseline.md`

---

## 6. Project Identity Summary

The working project name is:

> Health One

The Chinese concept name is:

> 健康元

Health One is a long-term health management ecosystem.

It is not merely:

1. A mini-program.
2. A store SaaS.
3. A CRM.
4. A device booking system.
5. A health product marketplace.
6. An AI chatbot.
7. A short-term marketing tool.

Health One is intended to become:

> A continuously evolving personal health operating system and health ecosystem.

---

## 7. Core Principle Summary

Health One is built around these principles:

1. Health is a continuous relationship.
2. Customers are not merely traffic.
3. Stores are real-world health nodes.
4. AI should serve trust.
5. Memory is infrastructure.
6. The customer owns 健康元.
7. Product development follows the value loop.
8. Premature complexity should be avoided.
9. Knowledge must be accumulated.
10. Git is the formal institutional memory.
11. AI collaboration requires governance.
12. Real service matters.
13. Trust is a core asset.
14. The ecosystem should grow together.

---

## 8. Current MVP Direction

The current MVP should verify the shortest complete health value loop:

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

The MVP is not the smallest number of functions.

The MVP is the shortest complete value loop.

---

## 9. Current MVP Core Components

The current MVP should focus on:

1. Health One identity.
2. 健康元 profile.
3. AI health companion.
4. Store workbench.
5. Service record.
6. Follow-up mechanism.
7. Basic knowledge base.
8. Basic authorization logic.
9. Basic customer return pathway.

---

## 10. Current MVP Exclusions

The current MVP should not prioritize:

1. Full marketplace.
2. Complex franchise system.
3. Token mechanism.
4. Blockchain.
5. Full contribution monetization.
6. Full digital human system.
7. Overbuilt CRM.
8. Overbuilt ERP.
9. Complex membership hierarchy.
10. Large-scale automated marketing.
11. Advanced financial settlement system.
12. Full partner ecosystem management.

These topics may be reserved for later phases.

---

## 11. Current Core Domain Objects

The current domain model includes these priority MVP objects:

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

These objects should guide future database, API, UI, AI memory, RAG, and store workflow design.

---

## 12. Current Working Directory

The local working directory should be:

```text
/Users/jinnanlaoshi/health-one
```

Short path:

```text
~/health-one
```

The repository should not be moved back to Desktop because macOS Desktop permissions may interfere with Git, Claude Code, and shell operations.

A Desktop shortcut or symbolic link may be used for convenience, but formal Git and Claude Code work should run from:

```bash
cd ~/health-one
```

---

## 13. Current Claude Code Role

Claude Code currently acts as:

> Release Engineer

Claude Code is authorized to:

1. Check Git status.
2. Create approved files.
3. Write approved content into Markdown.
4. Commit approved changes.
5. Push approved changes.
6. Report results.
7. Detect repository inconsistencies.

Claude Code is not currently authorized to:

1. Invent business logic.
2. Modify architecture principles.
3. Create unapproved documents.
4. Rename directories.
5. Rewrite Baseline documents.
6. Start engineering implementation without approval.
7. Mix unrelated changes in one commit.

---

## 14. Required Pre-Work Check

Before any formal work, execute:

```bash
git status
git log --oneline -10
```

Work may proceed only if:

1. The branch is `main`.
2. The working tree is clean.
3. The repository is up to date with `origin/main`.
4. The task has been approved.
5. The file path and commit message are clear.

If the repository is not clean, stop and report.

---

## 15. Current Prohibited Actions

At the current stage, do not:

1. Start coding the full system.
2. Create database schema without ADR or RFC.
3. Build UI pages without product workflow.
4. Build AI memory without scope definition.
5. Build RAG before knowledge structure is defined.
6. Add marketplace functions.
7. Add franchise system.
8. Add token or blockchain concepts.
9. Add complex partner settlement.
10. Change Baseline documents without review.
11. Rename directories without approval.
12. Create new document categories without approval.

---

## 16. Current Recommended Next Work

The next recommended work is Phase C: Execution Preparation.

Recommended documents:

1. ADR-001 Initial Architecture Principles.
2. RFC-001 MVP Scope Proposal.
3. Store Workbench initial product outline.
4. MVP data object draft.
5. AI Memory and RAG design draft.
6. Knowledge Base structure design.
7. Store service workflow draft.
8. MVP execution plan.

The next phase should prepare controlled implementation.

It should not jump directly into full engineering development.

---

## 17. Suggested Phase C Order

Recommended order:

1. ADR-001 Initial Architecture Principles.
2. RFC-001 MVP Scope Proposal.
3. Product outline for Store Workbench.
4. AI Memory and Knowledge Base design.
5. Initial data object draft.
6. Store service workflow draft.
7. MVP execution plan.
8. Engineering implementation kickoff.

This order may be adjusted by Founder and Chief Architect.

---

## 18. Current Risks

Current risks include:

1. Moving into coding before MVP scope is fixed.
2. Overbuilding database design.
3. Treating domain model as database schema too early.
4. Making AI memory unstructured.
5. Creating store tools that staff will not use.
6. Losing customer ownership principle.
7. Letting side AI workspaces create conflicting project truth.
8. Expanding business modules before the first service loop is proven.
9. Mixing marketing system with health memory system too early.
10. Allowing documents to grow without release checkpoints.

These risks should be actively managed.

---

## 19. Current Decision Boundary

Allowed now:

1. Prepare execution documents.
2. Draft controlled MVP scope.
3. Define architecture principles.
4. Define initial workflows.
5. Define AI memory boundaries.
6. Define knowledge base structure.
7. Define data object draft.
8. Prepare engineering kickoff.

Not allowed yet:

1. Full-scale product development.
2. Production database implementation.
3. Complex automation.
4. Full partner platform.
5. Full marketplace.
6. Full CRM or ERP.
7. Token, blockchain, or contribution monetization.
8. Unreviewed Baseline modification.

---

## 20. Current Chief Architect Recommendation

The current recommendation is:

> Move from Blueprint Baseline to Execution Preparation.
> Do not start full engineering implementation yet.
> First define architecture principles, MVP scope, store workflow, AI memory boundary, and knowledge base structure.

The project should continue to move step by step:

```text
Foundation
→ Blueprint
→ Execution Preparation
→ Controlled MVP Implementation
→ Real Store Validation
→ Iteration
```

---

## 21. End of Document

PROJECT-CONTEXT.md records the current working state of Health One.

This document should be updated when the project stage, release status, active risks, or next work changes materially.
