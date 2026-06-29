# FD-006 — Version Governance

Document ID : FD-006
Title       : Version Governance
Version     : 1.0
Status      : Active
Owner       : Founder Office
Created     : 2026-06-29
Depends On  : Constitution v1.0, GOV-001 Project Governance, GOV-002 Git Repository Governance

---

## 1. Purpose

Define the rules governing version numbering, release status progression, and the relationship between Sprints, Versions, and Releases in the Health One project.

---

## 2. Core Principle

> **Sprint is a development rhythm. Version represents product state.**

A Sprint produces code. A Version represents a coherent, reviewed, and gated increment of the product. Not every Sprint produces a Version. Every Version may span multiple Sprints.

---

## 3. Version Numbering

### 3.1 Scheme

```
v<MAJOR>.<MINOR>.<PATCH>
```

| Component | When It Increments | Authority |
|-----------|-------------------|-----------|
| MAJOR | Architecture change, data model break, or product pivot | Founder |
| MINOR | Sprint completion with new features | Architecture Office + Founder |
| PATCH | Hotfix, security fix, or bugfix release | Architecture Office |

### 3.2 Current Version

| Version | Status | Date |
|---------|--------|------|
| v0.1.0 | M0/M1 Foundation | 2026-06-28 |
| v0.2.0 | Sprint-2 Development Complete | 2026-06-29 |

### 3.3 Planned Versions

| Version | Expected Content | Target Release Status |
|---------|-----------------|----------------------|
| v0.3.0 | Sprint-3 Manual Service Loop | Development Complete |
| v0.4.0 | Sprint-4 AI Integration | Development Complete |
| v0.5.0 | Sprint-5 Polish & Validate | Release Candidate → Pilot |

---

## 4. Release Status Lifecycle

### 4.1 Status Definitions

| Status | Meaning | Who Can Set | Prerequisites |
|--------|---------|------------|---------------|
| **Development** | Active coding in progress | Architecture Office | Sprint plan approved |
| **Development Complete** | Sprint scope delivered, QA passed | Architecture Office | All P0 tasks complete, QA review approved, Release Gate written |
| **Release Candidate** | Feature-complete, ready for internal validation | Founder | All P0+P1 complete, integration tests pass, demo done |
| **Pilot** | Deployed to real store for validation | Founder | Release Candidate approved, deployment checklist complete, rollback plan ready |
| **Production** | Generally available, real customer data | Founder | Pilot validated, 1+ real customer closed loop complete, no Do-Not-Ship criteria triggered |

### 4.2 Progression Rules

1. Status can only move forward (Development → Development Complete → Release Candidate → Pilot → Production).
2. Status can regress from Pilot back to Development Complete if real-store validation fails.
3. Each transition requires explicit approval from the designated authority.
4. A status change is documented in `VERSION.md` with date and approver.

### 4.3 Founder-Only Gates

The following transitions require **Founder approval**:

- Development Complete → **Release Candidate**
- Release Candidate → **Pilot**
- Pilot → **Production**

Architecture Office may approve:
- Development → Development Complete (with QA sign-off)
- Pilot → Development Complete (rollback after validation failure)

---

## 5. Sprint-to-Version Mapping

### 5.1 Rule

Every Sprint completion that produces code **must** update `VERSION.md`. Whether the MINOR version increments depends on the Sprint's output:

| Sprint Output | Version Action |
|--------------|---------------|
| New P0 features delivered | Increment MINOR (v0.2.0 → v0.3.0) |
| Only P1 tasks or fixes | Increment PATCH (v0.2.0 → v0.2.1) |
| No code change (docs only) | No version change |

### 5.2 Checklist Per Sprint Completion

- [ ] All P0 tasks complete or deferred with documented rationale
- [ ] QA review completed (at least one QA-BATCH per phase)
- [ ] Release Gate document written (`docs/release/RELEASE-GATE-XXX.md`)
- [ ] `VERSION.md` updated with new version entry
- [ ] Git tag created matching version number (e.g., `v0.2.0`)
- [ ] Release Gate reviewed by Architecture Office
- [ ] If Release Candidate or higher: Founder approval obtained

---

## 6. Version Authority

### 6.1 Approval Matrix

| Version Component | Proposer | Recommender | Approver |
|------------------|----------|-------------|----------|
| MAJOR | Architecture Office | Architecture Office | **Founder only** |
| MINOR | Architecture Office | Architecture Office | **Founder only** |
| PATCH | Development Office | Architecture Office | **Founder only** |

### 6.2 Release Status Authority

| Status Transition | Approver |
|------------------|----------|
| Development → Development Complete | Architecture Office |
| Development Complete → Release Candidate | **Founder only** |
| Release Candidate → Pilot | **Founder only** |
| Pilot → Production | **Founder only** |
| Pilot → Development Complete (rollback) | Architecture Office |

### 6.3 Principle

> Only Founder may approve Release Candidate, Pilot, and Production status. Architecture Office recommends; Founder decides.

No version increment (MAJOR, MINOR, or PATCH) may be released without Founder approval.

---

## 7. Git Tag Policy

### 7.1 Tag Creation Gate

A Git Tag **MUST** be created only **AFTER** all of the following are complete:

1. QA approved (all QA-BATCH reviews for the Sprint pass)
2. Release Gate approved (RELEASE-GATE document written and reviewed)
3. `VERSION.md` updated and committed
4. Founder approval completed (for the target release status)

Tags created before these gates are satisfied are invalid and must be deleted.

### 7.2 Annotated Tags Only

Every Version entry in `VERSION.md` must have a corresponding **annotated Git tag**. Lightweight tags are prohibited.

```bash
git tag -a v0.2.0 -m "Sprint-2 Development Complete"
```

### 7.3 Tag Naming

| Pattern | Example | Use |
|---------|---------|-----|
| `v<MAJOR>.<MINOR>.<PATCH>` | `v0.2.0` | Standard version tag |
| `v<MAJOR>.<MINOR>.<PATCH>-rc<N>` | `v0.5.0-rc1` | Release Candidate iterations |
| `v<MAJOR>.<MINOR>.<PATCH>-hotfix<N>` | `v0.2.0-hotfix1` | Production hotfix |

### 7.4 Tag Authority

| Tag Type | Who Can Create |
|----------|---------------|
| Development / Development Complete | Architecture Office |
| Release Candidate / Pilot / Production | Founder only |

---

## 8. Version Branch Policy

### 8.1 Branch Roles

| Branch | Purpose | Receives Tags? | Receives New Commits? |
|--------|---------|---------------|----------------------|
| `main` | Latest approved development version | ✅ Yes | ✅ Yes |
| `feature/*` | Active development — merged into `main` | ❌ No | ✅ Yes (temporary) |
| `release/*` | Optional stabilization before Production | ✅ Yes (RC tags) | ✅ Yes (fixes only) |
| `legacy` repositories | Frozen — runtime only | ❌ No | ❌ **Never** |

### 8.2 `main` Branch

> `main` always represents the latest approved development version.

- `main` receives all feature merges after review.
- `main` is the branch from which version tags are created.
- `main` must always build and pass tests.

### 8.3 `feature/*` Branches

- Created from `main` for Sprint work.
- Merged back to `main` after review.
- Deleted after merge.
- Never receive version tags.

### 8.4 `release/*` Branches (Optional)

- May be created from `main` before a Production release for final stabilization.
- Only bugfixes and security patches are committed here.
- Release Candidate tags (`-rc1`, `-rc2`) are created on this branch.
- Merged back to `main` after Production release.

### 8.5 Legacy Repositories

Legacy repositories (3号工程, 1号工程 per FD-005) are **permanently frozen**:

- ❌ Never receive new versions.
- ❌ Never receive new feature development.
- ❌ Never receive version tags.
- ✅ Runtime only — servers continue running as-is until decommissioned.
- ✅ May be read for business logic reference (not code copying).

---

## 9. Release Note Policy

### 9.1 Single Source of Truth

`VERSION.md` is the **single source of truth** for all version information. All Release Notes, changelogs, and external communications reference `VERSION.md`.

### 9.2 Release Note Contents

Each version entry in `VERSION.md` must include:

1. Version number and Release Status
2. Date
3. Architecture baseline (ARCH-xxx reference)
4. Major features delivered
5. Known limitations
6. Git milestone commits
7. QA reports completed
8. Release Gate reference
9. Next target

### 9.3 Prohibition

- Do not create separate `CHANGELOG.md` or `RELEASE_NOTES.md` files.
- Do not duplicate version information across documents.
- Do not reference version numbers in code or config files (use `VERSION.md` as the canonical reference).

---

## 10. Compliance

| Source | Requirement | Status |
|--------|------------|--------|
| GOV-001 | Document hierarchy: Founder Directives override all | ✅ This FD governs version policy |
| GOV-002 | Git repository: annotated tags for releases | ✅ §7.2 |
| PRD-001 | MVP milestones: M1–M5 | ✅ Versions map to milestones |

---

## 11. End of Document

FD-006 establishes version governance for Health One.

All future version changes must comply with this directive. Violations (untagged commits claiming version status, unreviewed Release Candidates, unauthorized Production tags) are rejectable by QA.
