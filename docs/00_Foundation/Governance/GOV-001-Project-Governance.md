# GOV-001 Project Governance

Document ID : GOV-001  
Title       : Project Governance  
Version     : 1.0  
Status      : Baseline  
Owner       : Chief Architect  
Approver    : Founder  
Created     : 2026-06-28  
Updated     : 2026-06-28  
Depends On  : None  
Related     : GOV-002, GOV-003, PROJECT, README  

---

## 1. Purpose

This document defines the basic governance rules for the Health One project.

Health One is not managed as a casual chat-based project. It is managed as a long-term knowledge, product, engineering, and business system.

The purpose of this governance document is to ensure that:

1. Important decisions are recorded.
2. Formal documents are versioned.
3. AI collaborators follow the same project rules.
4. Git remains the official source of truth.
5. The project can evolve without losing structure, context, or accountability.

---

## 2. Project Governance Principle

Health One follows one central governance principle:

> Discussion happens in conversation.  
> Decisions are reviewed.  
> Approved decisions are released into Git.  
> Git is the formal source of truth.

Chat records are not official project documents.

A document becomes official only after it has been reviewed, approved, committed, and pushed to the Git repository.

---

## 3. Roles

### 3.1 Founder

The Founder is the final decision maker of the Health One project.

Responsibilities:

1. Approve or reject major project decisions.
2. Confirm business direction.
3. Confirm release of Baseline documents.
4. Decide when to move from planning to execution.
5. Hold final authority over product, business, and strategic priorities.

Current Founder:

- 近南 陈

---

### 3.2 Chief Architect

The Chief Architect is responsible for the overall structure of the Health One project.

Responsibilities:

1. Maintain project architecture.
2. Review strategic consistency.
3. Define document structure.
4. Identify risks and inconsistencies.
5. Decide whether a topic is ready for Release.
6. Protect the long-term coherence of the project.

The Chief Architect does not replace the Founder.  
The Chief Architect provides structure, review, and architectural judgment.

---

### 3.3 Release Engineer

The Release Engineer is responsible for formal document release and Git operations.

Responsibilities:

1. Check repository status before every operation.
2. Create or update approved files.
3. Preserve approved document content.
4. Commit changes using approved commit messages.
5. Push changes to the remote repository.
6. Report operation results clearly.

The Release Engineer must not:

1. Invent business logic.
2. Change architecture principles.
3. Rename directories without approval.
4. Modify Baseline documents without review.
5. Create unapproved documents.

---

### 3.4 AI Collaborators

AI collaborators may support research, writing, analysis, development, and review.

All AI collaborators must follow the project governance rules.

No AI collaborator may treat its own conversation output as official project truth unless that output has been reviewed, approved, committed, and pushed to Git.

---

## 4. Document Status

All formal Health One documents must use one of the following statuses.

### 4.1 Draft

A document is still being created or discussed.

Draft documents may contain incomplete ideas, unresolved questions, or alternative options.

Draft documents are not binding.

---

### 4.2 Review

A document is ready for review.

Review documents should be internally coherent but may still be revised before release.

---

### 4.3 Baseline

A document has been approved and becomes part of the formal project foundation.

Baseline documents should not be modified casually.

Any material change to a Baseline document requires review and a new commit.

---

### 4.4 Deprecated

A document is no longer active but is retained for historical reference.

Deprecated documents should not be deleted unless the Founder and Chief Architect approve removal.

---

## 5. Document Categories

Health One documents are organized by category.

### 5.1 Foundation Documents

Foundation documents define the project identity, principles, governance, and operating rules.

Examples:

- PROJECT
- README
- Manifesto
- Charter
- GOV documents

---

### 5.2 Product Documents

Product documents define user value, product scope, MVP, user flows, service flows, and product strategy.

Examples:

- White Papers
- Product Blueprints
- MVP definitions
- User journey documents

---

### 5.3 Architecture Documents

Architecture documents define system structure, domain models, data models, modules, dependencies, and technical principles.

Examples:

- World Model
- Domain Model
- System Architecture
- Data Architecture
- Integration Architecture

---

### 5.4 AI Documents

AI documents define how AI agents, memory, RAG, prompts, model usage, and AI collaboration work inside Health One.

Examples:

- AI Onboarding
- Agent Instructions
- AI Memory Design
- RAG Strategy
- Prompt Governance

---

### 5.5 Business Documents

Business documents define business model, store model, partner model, pricing, revenue structure, and go-to-market strategy.

Examples:

- Store Cooperation Plans
- Coach Partner Plans
- Franchise Model
- Financing Materials
- Business Proposals

---

### 5.6 Engineering Documents

Engineering documents define implementation decisions, development processes, repository rules, ADRs, RFCs, and release procedures.

Examples:

- ADR
- RFC
- Engineering Standards
- Git Governance
- Deployment Notes

---

### 5.7 Research Documents

Research documents collect market research, competitive analysis, policy research, technology research, and external references.

Research documents are supporting materials.  
They are not automatically project decisions.

---

### 5.8 Log Documents

Log documents record daily work, release history, milestone reviews, and important project changes.

Examples:

- Daily logs
- Release logs
- Sprint summaries
- Decision logs

---

## 6. Document Numbering

Formal documents should use clear numbering.

Recommended prefixes:

| Prefix | Meaning |
|---|---|
| GOV | Governance |
| BP | Blueprint |
| WP | White Paper |
| ADR | Architecture Decision Record |
| RFC | Request for Comments |
| AI | AI System / AI Collaboration |
| BUS | Business |
| LOG | Log |
| REL | Release |

Document numbers should be unique within their category.

Examples:

- GOV-001
- BP-001
- WP-001
- ADR-001
- RFC-001

---

## 7. Release Process

A formal document release should follow this process:

1. Discussion
2. Draft
3. Review
4. Founder approval
5. Release Engineer execution
6. Git commit
7. Push to remote repository
8. Verification

No document should be treated as official before this process is complete.

---

## 8. Git as Source of Truth

The Git repository is the formal source of truth for Health One.

This means:

1. Chat discussions are not formal records.
2. Local notes are not formal records.
3. AI memory is not the formal source of truth.
4. Git commits are the auditable project history.
5. The latest approved content in Git has priority over informal conversation context.

If there is a conflict between conversation memory and Git, Git wins.

---

## 9. Baseline Document Rules

Baseline documents are protected.

A Baseline document may be changed only when:

1. The reason for change is clear.
2. The change has been reviewed.
3. The Founder approves the change.
4. The update is committed with a clear commit message.

Material changes to Baseline documents should preserve traceability.

---

## 10. AI Collaboration Rules

All AI collaborators must follow these rules:

1. Read project context before working.
2. Do not assume missing project facts.
3. Ask for clarification when project state is unclear.
4. Do not create official documents without approval.
5. Do not modify Baseline documents casually.
6. Do not treat generated content as approved content.
7. Report uncertainty clearly.
8. Preserve document IDs and status fields.

---

## 11. Change Control

When a major project direction changes, the change should be recorded through one of the following:

1. Updated Baseline document.
2. New ADR.
3. New RFC.
4. Release log.
5. Daily log.

Major changes should not exist only in chat history.

---

## 12. Governance Boundary

This document governs project operations.

It does not define:

1. The full business model.
2. The complete product architecture.
3. The technical implementation.
4. The final brand strategy.
5. The financial or legal structure.

Those topics should be handled in their own formal documents.

---

## 13. Current Baseline Decision

As of this document version, the following governance decisions are Baseline:

1. Health One is managed as a long-term project, not a casual chat project.
2. Git is the formal source of truth.
3. All formal documents require review before release.
4. Baseline documents require explicit approval before material change.
5. AI collaborators must follow project governance.
6. Claude Code initially acts as Release Engineer, not autonomous architect.
7. The Founder retains final approval authority.
8. The Chief Architect protects structure, consistency, and long-term coherence.

---

## 14. End of Document

GOV-001 establishes the first formal governance foundation of the Health One project.
