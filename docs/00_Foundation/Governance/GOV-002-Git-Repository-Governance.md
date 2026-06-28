# GOV-002 Git Repository Governance

Document ID : GOV-002  
Title       : Git Repository Governance  
Version     : 1.0  
Status      : Baseline  
Owner       : Chief Architect  
Approver    : Founder  
Created     : 2026-06-28  
Updated     : 2026-06-28  
Depends On  : GOV-001  
Related     : GOV-003, README, PROJECT  

---

## 1. Purpose

This document defines the Git repository governance rules for the Health One project.

The purpose of this document is to ensure that the Health One repository remains:

1. Clean.
2. Traceable.
3. Reviewable.
4. Recoverable.
5. AI-collaboration friendly.
6. Suitable for long-term product, business, and engineering evolution.

Git is not only used as a code storage tool in Health One.

Git is used as the formal knowledge, decision, document, and engineering history of the project.

---

## 2. Core Principle

Health One follows one central Git principle:

> Git is the formal source of truth.  
> Every formal change must be reviewable, committed, pushed, and traceable.

If a decision, document, architecture rule, or project milestone is not in Git, it is not considered formal project truth.

---

## 3. Repository Role

The Health One repository serves multiple roles:

1. Project knowledge base.
2. Formal document archive.
3. Architecture decision record.
4. AI onboarding source.
5. Product and business planning record.
6. Engineering implementation repository.
7. Release and milestone history.

The repository must therefore be treated as a long-term institutional memory system, not a temporary working folder.

---

## 4. Branch Governance

### 4.1 main Branch

The `main` branch is the official Baseline branch.

Rules:

1. `main` must always remain stable.
2. `main` must contain only reviewed or approved content.
3. Direct changes to `main` should be limited.
4. Every commit on `main` should have a clear purpose.
5. Broken, experimental, or uncertain content should not be committed directly to `main`.

At the current early stage, controlled direct commits to `main` are allowed only when:

1. The Founder approves the release.
2. The Chief Architect provides or approves the content.
3. The Release Engineer checks Git status before and after the operation.
4. The commit is small, clear, and traceable.

---

### 4.2 Future Branches

As the project grows, the following branch structure may be introduced:

| Branch | Purpose |
|---|---|
| main | Official Baseline |
| review | Documents or changes under review |
| dev | Active development integration |
| feature/* | Specific features or modules |
| hotfix/* | Urgent fixes |

These branches should not be created casually.

A new branch type should be introduced only when there is a clear operational need.

---

## 5. Commit Governance

Every commit should represent one clear unit of change.

A commit should not mix unrelated changes.

Examples of good commits:

```text
docs: add GOV-001 project governance
docs: add GOV-002 git repository governance
docs: add AI onboarding guide
architecture: add BP-001 world model
business: add coach partner cooperation model
engineering: add initial database schema
```

Examples of bad commits:

```text
update files
fix stuff
add many things
today work
misc changes
```

---

## 6. Commit Message Format

Recommended commit message format:

```text
<type>: <short description>
```

Recommended commit types:

| Type         | Meaning                                            |
| ------------ | -------------------------------------------------- |
| docs         | Documentation                                      |
| architecture | Architecture documents or diagrams                 |
| business     | Business model or cooperation documents            |
| product      | Product design or product definition               |
| engineering  | Engineering standards or implementation            |
| ai           | AI system, prompt, RAG, agent, or memory documents |
| chore        | Repository maintenance                             |
| fix          | Correction                                         |
| refactor     | Structural improvement without changing meaning    |
| release      | Release log or milestone                           |

The commit message should be short, clear, and specific.

---

## 7. Pre-Operation Check

Before creating, modifying, deleting, committing, or pushing any file, the Release Engineer must run:

```bash
git status
git log --oneline -5
```

The operation may proceed only when:

1. The working tree is clean.
2. The branch is correct.
3. The repository is up to date with the remote branch.
4. The intended change has been approved.

If the working tree is not clean, the Release Engineer must stop and report.

---

## 8. Post-Operation Check

After every file operation and before commit, the Release Engineer must run:

```bash
git status
```

The Release Engineer must confirm that only expected files have changed.

If unexpected files appear, the operation must stop.

---

## 9. Commit and Push Process

A standard Release Engineer commit process is:

```bash
git status
git log --oneline -5
```

Then create or modify the approved file.

Then run:

```bash
git status
git add <approved-file-path>
git commit -m "<approved-commit-message>"
git push origin main
git status
git log --oneline -5
```

The Release Engineer must report:

1. Changed file path.
2. Commit hash.
3. Commit message.
4. Push result.
5. Final Git status.
6. Recent commit history.

---

## 10. File Creation Rules

New files must follow approved directory structure and naming rules.

A formal document file name should include:

1. Document ID.
2. Short English title.
3. Markdown extension.

Example:

```text
GOV-001-Project-Governance.md
GOV-002-Git-Repository-Governance.md
BP-001-World-Model.md
WP-001-Health-One-White-Paper.md
ADR-001-Initial-Architecture-Principles.md
```

Do not create duplicate files with similar meanings.

Do not create vague file names such as:

```text
new.md
test.md
final.md
final-final.md
notes.md
```

---

## 11. Directory Governance

Current directory structure:

```text
docs/
├── 00_Foundation/
├── 01_Product/
│   └── WhitePaper/
├── 02_Architecture/
├── 03_AI/
├── 04_Business/
├── 05_Engineering/
│   ├── ADR/
│   └── RFC/
├── 06_Research/
└── 99_Log/
    ├── Daily/
    └── Release/
```

Directory changes require approval.

The Release Engineer must not rename, move, or delete directories without explicit instruction.

---

## 12. Baseline Document Protection

Baseline documents are protected.

A Baseline document may not be modified casually.

Material changes require:

1. Reason for change.
2. Review.
3. Founder approval.
4. Clear commit message.
5. Traceable history.

If a Baseline document needs revision, the Release Engineer should not decide independently.

The Release Engineer must wait for approved content from the Chief Architect and Founder.

---

## 13. AI Collaboration Rules in Git

AI collaborators must follow these rules when working with Git:

1. Check repository status before work.
2. Do not assume repository state.
3. Do not generate unapproved official files.
4. Do not overwrite human-approved documents.
5. Do not rename directories without approval.
6. Do not combine unrelated changes in one commit.
7. Do not treat chat output as formal truth unless committed.
8. Report uncertainty instead of guessing.
9. Prefer small, reviewable changes.
10. Stop immediately when Git state is unclear.

---

## 14. Conflict Resolution

If conversation memory, AI memory, local notes, and Git content conflict, the priority order is:

1. Latest approved Git content.
2. Latest committed Baseline document.
3. Approved Release log.
4. Founder's explicit latest instruction.
5. Chief Architect's reviewed recommendation.
6. Informal chat history.
7. AI memory.

Git has priority over informal context.

---

## 15. Repository Health Check

A standard repository health check includes:

```bash
git status
git log --oneline -5
git remote -v
```

Optional checks:

```bash
find . -maxdepth 3 -type f
```

A healthy repository should show:

1. Correct branch.
2. Clean working tree.
3. Remote connection exists.
4. Recent commits are clear.
5. No unexpected files.
6. Directory structure remains consistent.

---

## 16. Release Engineer Boundary

The Release Engineer is allowed to:

1. Create approved files.
2. Modify approved files.
3. Commit approved changes.
4. Push approved changes.
5. Report Git status.
6. Report file structure.
7. Detect inconsistencies.

The Release Engineer is not allowed to:

1. Decide product direction.
2. Change business logic.
3. Modify architecture principles.
4. Create new governance rules without approval.
5. Rewrite Baseline documents independently.
6. Delete files without approval.
7. Merge large changes without review.

---

## 17. Current Baseline Decision

As of this document version, the following Git governance decisions are Baseline:

1. Git is the formal source of truth for Health One.
2. `main` is the official Baseline branch.
3. Commit history must remain clear and traceable.
4. Each commit should contain one clear unit of change.
5. Release Engineer must check Git status before and after operations.
6. Unexpected file changes must stop the release process.
7. Baseline documents are protected.
8. AI collaborators must not independently rewrite project truth.
9. Repository structure changes require approval.
10. Git has priority over informal conversation memory.

---

## 18. End of Document

GOV-002 establishes the Git repository governance foundation of the Health One project.
