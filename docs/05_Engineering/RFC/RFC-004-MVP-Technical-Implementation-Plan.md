# RFC-004 MVP Technical Implementation Plan

Document ID : RFC-004  
Title       : MVP Technical Implementation Plan  
Version     : 1.0  
Status      : Baseline  
Owner       : Chief Architect  
Approver    : Founder  
Created     : 2026-06-28  
Updated     : 2026-06-28  
Depends On  : REL-003, PROJECT-CONTEXT, ADR-001, RFC-001, RFC-002, RFC-003, PRODUCT-001, PRODUCT-002, AI-001, AI-002  
Related     : Initial Database Design Proposal, Store Workbench MVP Screen List, Knowledge Base MVP Content List, Real Store Validation Plan  

---

## 1. Purpose

This document defines the initial technical implementation plan for the Health One MVP.

The purpose is to translate the MVP execution plan into a controlled technical implementation boundary.

This document should guide:

1. Technical setup.
2. Implementation sequence.
3. Codebase organization.
4. Data implementation priority.
5. Store Workbench build order.
6. AI integration boundary.
7. Knowledge Base implementation boundary.
8. Review checkpoints.
9. Claude Code execution control.

This document does not define final production architecture.

It defines how the first MVP should be built in a small, controlled, reviewable way.

---

## 2. Current Stage

Current completed stages:

1. Phase A: Foundation Baseline.
2. Phase B: Product and Architecture Blueprint Baseline.
3. Phase C: Execution Preparation Baseline.

Current stage:

> Phase D: Controlled MVP Planning

The project may prepare for implementation, but should still avoid uncontrolled coding.

---

## 3. Technical Implementation Principle

The technical implementation principle is:

> Build the smallest reliable technical system that can complete the first Health One value loop in a real store scenario.

The system should be:

1. Small.
2. Reviewable.
3. Incremental.
4. Testable.
5. Usable by store staff.
6. Traceable.
7. Easy to change after validation.

The system should not be overbuilt before real store validation.

---

## 4. MVP Technical Goal

The first technical goal is to support this loop:

```text
Customer created or found
→ 健康元 activated or updated
→ Health concern recorded
→ Store service recorded
→ Feedback captured
→ AI summary generated
→ Follow-up task created
→ Follow-up result recorded
→ Customer return or next action tracked
```

Every technical component should support this loop.

---

## 5. Technical Non-Goals

The first MVP technical implementation should not include:

1. Full CRM.
2. Full ERP.
3. Full marketplace.
4. Full franchise platform.
5. Full payment system.
6. Full inventory system.
7. Complex partner settlement.
8. Token or blockchain.
9. Complex BI dashboard.
10. Full digital human system.
11. Automated diagnosis.
12. Large-scale marketing automation.
13. Complex multi-tenant permission system.
14. Advanced vector database before knowledge structure is validated.

These are outside the first MVP technical boundary.

---

## 6. Recommended Technical Layers

The MVP may be organized into the following conceptual layers:

1. Frontend / Store Workbench.
2. Backend / Application API.
3. Database / MVP data objects.
4. AI Service Boundary.
5. Knowledge Base Content.
6. Authorization Boundary.
7. Event Logging.
8. Review and Validation Tools.

These are implementation layers, not final enterprise architecture.

---

## 7. Frontend Scope

The first frontend should focus on Store Workbench.

Required screens:

1. Dashboard or Today's Tasks.
2. Customer Search / Create.
3. Customer 健康元 Summary.
4. Health Concern Intake.
5. Service Record.
6. Feedback Record.
7. Follow-Up Task.
8. AI Summary Panel.
9. Knowledge Entry View.
10. Operator Review.

The frontend should prioritize staff usability over visual completeness.

---

## 8. Backend Scope

The first backend should support:

1. Customer creation and lookup.
2. 健康元 profile creation and update.
3. Health concern recording.
4. Health goal recording.
5. Store and staff references.
6. Service record creation.
7. Feedback recording.
8. Follow-up task creation and update.
9. AI summary creation and storage.
10. Knowledge entry retrieval.
11. Event logging.
12. Basic authorization boundary.

Backend should remain modular but not over-engineered.

---

## 9. Database Scope

The first database design should implement only the core MVP objects.

Priority objects:

1. Customer.
2. Health One Identity.
3. 健康元 Profile.
4. Health Concern.
5. Health Goal.
6. Store.
7. Store Staff.
8. Service.
9. Service Record.
10. Feedback.
11. Follow-Up Task.
12. AI Summary.
13. Knowledge Entry.
14. Authorization Record.
15. Event.

Device and Device Usage Record may be included if required by the first store service scenario.

Database schema requires a separate design proposal before implementation.

---

## 10. AI Integration Scope

AI integration in the first MVP should support:

1. Customer context summary.
2. Service summary.
3. Follow-up suggestion.
4. Customer-facing explanation draft.
5. Staff-facing note.
6. Missing information checklist.
7. Uncertainty note.
8. Knowledge-based answer.

AI should not be deeply embedded everywhere at first.

AI calls should be explicit, logged, and traceable where possible.

---

## 11. Knowledge Base Technical Scope

The first knowledge base may be lightweight.

Acceptable first options:

1. Markdown files.
2. Structured JSON or YAML entries.
3. Database-backed knowledge entries.
4. Simple category and keyword retrieval.
5. Manual selection by staff.
6. AI retrieval with limited scope.

Advanced RAG should be delayed until:

1. Knowledge categories are stable.
2. Customer-facing and internal content are separated.
3. Review status exists.
4. Retrieval scope is clear.
5. Real usage shows the need.

---

## 12. Authorization Technical Scope

The MVP should include simple authorization logic.

Minimum distinctions:

1. Customer-owned context.
2. Store-accessible context.
3. Staff-editable records.
4. AI-usable authorized context.
5. Platform review access.
6. Internal-only knowledge.

The MVP does not need complex enterprise RBAC.

However, it must not treat all customer health memory as unrestricted data.

---

## 13. Event Logging Scope

The MVP should record meaningful events.

Required event types:

1. Customer created.
2. 健康元 activated.
3. Health concern recorded.
4. Service record created.
5. Feedback recorded.
6. Follow-up task created.
7. Follow-up completed.
8. AI summary generated.
9. Knowledge entry used.
10. Customer returned.

Event logging supports review and validation.

It should remain lightweight.

---

## 14. Recommended Implementation Sequence

Recommended implementation sequence:

1. Confirm existing codebase and stack.
2. Set up clean project structure.
3. Define database schema proposal.
4. Build minimal backend data model.
5. Build Store Workbench skeleton.
6. Implement customer search/create.
7. Implement 健康元 summary.
8. Implement health concern intake.
9. Implement service record.
10. Implement feedback record.
11. Implement follow-up task.
12. Implement AI summary boundary.
13. Implement knowledge entry retrieval.
14. Implement event logging.
15. Test full store workflow.
16. Prepare real store validation.

This sequence should not be skipped without review.

---

## 15. Implementation Slice 1: Technical Setup

Goal:

> Make the project technically ready to build.

Tasks:

1. Confirm tech stack.
2. Confirm package manager.
3. Confirm local environment.
4. Confirm app structure.
5. Confirm development command.
6. Confirm build command.
7. Confirm test or smoke check method.
8. Confirm environment variable handling.
9. Confirm database local setup.
10. Confirm README or developer setup note.

Deliverable:

> A working local development environment.

---

## 16. Implementation Slice 2: Data Foundation

Goal:

> Implement the minimal data foundation for the store workflow.

Tasks:

1. Create database schema proposal.
2. Implement Customer.
3. Implement Health One Identity.
4. Implement 健康元 Profile.
5. Implement Health Concern.
6. Implement Health Goal.
7. Implement Store.
8. Implement Store Staff.
9. Implement Service.
10. Add seed data if needed.

Deliverable:

> Basic customer and store data can be created and retrieved.

---

## 17. Implementation Slice 3: Store Workbench Skeleton

Goal:

> Build the first staff-facing interface.

Tasks:

1. Create layout.
2. Create dashboard.
3. Create navigation.
4. Create customer search page.
5. Create customer summary page.
6. Create service record page.
7. Create feedback page.
8. Create follow-up page.
9. Create knowledge view page.
10. Create operator review page if needed.

Deliverable:

> Staff can navigate the MVP workbench.

---

## 18. Implementation Slice 4: Core Service Loop

Goal:

> Complete the non-AI version of the first service loop.

Tasks:

1. Create or find customer.
2. Activate or update 健康元.
3. Record health concern.
4. Record service.
5. Record feedback.
6. Create follow-up task.
7. Record follow-up result.
8. Show next action.

Deliverable:

> A full store service loop can be completed manually.

This slice should be validated before advanced AI work.

---

## 19. Implementation Slice 5: AI Summary Boundary

Goal:

> Add bounded AI support without turning the system into a generic chatbot.

Tasks:

1. Define AI summary prompt.
2. Define source context.
3. Generate customer context summary.
4. Generate service summary.
5. Generate follow-up suggestion.
6. Save AI Summary record.
7. Mark uncertainty.
8. Show AI output in Store Workbench.
9. Allow staff review where needed.
10. Log AI summary event.

Deliverable:

> AI supports summary and follow-up within traceable boundaries.

---

## 20. Implementation Slice 6: Knowledge Base MVP

Goal:

> Provide approved knowledge for staff and AI.

Tasks:

1. Define knowledge entry format.
2. Add customer education entry: What is 健康元.
3. Add service explanation entry.
4. Add device explanation entry.
5. Add concern intake guide.
6. Add feedback collection guide.
7. Add follow-up templates.
8. Add AI response boundary note.
9. Show knowledge entries in Store Workbench.
10. Support simple retrieval.

Deliverable:

> Staff and AI can use a small approved knowledge base.

---

## 21. Implementation Slice 7: Event and Validation Review

Goal:

> Make MVP usage observable.

Tasks:

1. Log key workflow events.
2. Show recent service records.
3. Show pending follow-ups.
4. Show completed follow-ups.
5. Show customer return status.
6. Show AI summary usage.
7. Show knowledge usage if possible.
8. Prepare validation review note.

Deliverable:

> Founder or operator can review MVP loop progress.

---

## 22. Technical Review Checkpoints

Required checkpoints:

1. After technical setup.
2. After database schema proposal.
3. After Store Workbench skeleton.
4. After customer and 健康元 implementation.
5. After service record implementation.
6. After feedback and follow-up implementation.
7. After AI summary implementation.
8. After knowledge base implementation.
9. After first full workflow test.
10. After first real store validation.

Each checkpoint should report:

1. What was built.
2. What works.
3. What does not work.
4. What is risky.
5. What should be simplified.
6. What should be built next.

---

## 23. Claude Code Coding Permission Boundary

Claude Code may begin coding only after:

1. The technical task is explicitly approved.
2. The repository is clean.
3. The implementation target is clear.
4. The file paths are clear.
5. The expected behavior is clear.
6. The commit message is clear.
7. The change is small enough to review.
8. The task fits the current MVP scope.

Claude Code should not start large coding tasks from general instructions.

---

## 24. Commit Discipline

Technical commits should follow these rules:

1. One logical change per commit.
2. Documentation changes and code changes should usually be separated.
3. Schema changes should be separate from UI changes.
4. AI prompt changes should be separate from unrelated UI changes.
5. Test or smoke check result should be reported.
6. Do not commit generated junk files.
7. Do not commit secrets or environment files.
8. Do not mix refactor and feature work unless approved.

Commit messages should remain specific and consistent.

---

## 25. Testing Boundary

The first MVP should include simple checks.

Possible checks:

1. App starts locally.
2. Customer can be created.
3. Customer can be searched.
4. 健康元 summary can be viewed.
5. Concern can be recorded.
6. Service record can be saved.
7. Feedback can be saved.
8. Follow-up task can be created.
9. AI summary can be generated or mocked.
10. Knowledge entry can be viewed.
11. Event is recorded.
12. Full workflow can be completed.

Testing can start simple.

The project should not skip basic verification.

---

## 26. Environment and Secret Boundary

The project should not commit secrets.

Rules:

1. Use `.env` or `.env.local` for local secrets.
2. Do not commit API keys.
3. Do not commit production credentials.
4. Document required environment variables separately.
5. Keep AI provider credentials outside Git.
6. Keep database credentials outside Git.
7. Use `.gitignore` to prevent accidental commits.

This is mandatory.

---

## 27. Deployment Boundary

The first MVP deployment should be simple.

Possible options:

1. Local-only validation.
2. Internal test deployment.
3. Cloud test environment.
4. Single-store pilot deployment.

Do not design complex production deployment before MVP validation.

Deployment decision should be made after technical setup review.

---

## 28. Real Store Validation Boundary

Technical implementation should prepare for real store validation.

The system should be usable by:

1. One store.
2. One or a few staff members.
3. A limited number of real customers.
4. A limited service set.
5. A limited follow-up process.

The system should capture what happens, not pretend the model is already proven.

---

## 29. Current Technical Risks

Key risks:

1. Starting code before schema proposal.
2. Building too many screens.
3. Making store workflow too complex.
4. Implementing AI too early or too broadly.
5. Creating unstructured AI memory.
6. Building RAG before knowledge is ready.
7. Forgetting authorization.
8. Skipping event logging.
9. Ignoring staff usability.
10. Overbuilding for multi-store before one-store validation.

These risks should be reviewed before each implementation slice.

---

## 30. Current Baseline Technical Decisions

As of this document version, the following technical decisions are Baseline:

1. Build the MVP incrementally.
2. Start with one real store scenario.
3. Prioritize Store Workbench.
4. Implement non-AI service loop before advanced AI.
5. Keep AI summary bounded and traceable.
6. Keep Knowledge Base small and structured.
7. Use simple authorization boundaries from the beginning.
8. Log meaningful events.
9. Require review checkpoints.
10. Keep commits small and reviewable.
11. Do not commit secrets.
12. Do not build excluded modules.

---

## 31. End of Document

RFC-004 defines the initial MVP Technical Implementation Plan for Health One.

Future database design, screen design, AI prompt design, knowledge base content, coding tasks, and deployment decisions should remain consistent with this plan unless reviewed and approved.
