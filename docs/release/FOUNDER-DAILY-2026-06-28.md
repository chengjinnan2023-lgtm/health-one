# Founder Daily Log
# 创始人日报

## Date
2026-06-28

## Milestone
M0 — Project Foundation (Closure) → M0.5 — Docs Cleanup (Initiated)

---

## 1. Founder Decisions (FD)

| ID | Decision | Status | Reference |
|----|----------|--------|-----------|
| FD-001 | `health-one` 确认为唯一正式主仓库；3号工程为 Legacy 资产库；一号工程为 Review/Patch 参考 | Accepted | M0-FOUNDER-REVIEW §3 |
| FD-002 | 研发进入规则：Constitution → Governance → ADR → RFC → PRD → Task → Code → QA → Release；未经上游文档批准不得进入开发 | Accepted | FD-002-DEVELOPMENT-GATE |
| FD-003 | Legacy Migration 策略：不直接续改，不完全重写；逐模块审查后迁移 | Accepted | M0-FOUNDER-REVIEW §3 |
| FD-004 | 第一批 MVP 迁移模块：Health Identity, Health Profile, Upload Asset, AI Assistant, Service Session, Member Entitlement | Accepted | M0-FOUNDER-REVIEW §3 |
| FD-005 | M0 批准进入 M1；但 M0.5 Docs Cleanup 必须先于 M1 完成 | Accepted | M0-FOUNDER-REVIEW §9 |
| FD-006 | Freeze：首次真实客户闭环前，不新增 Office / 治理层级 / 流程 / 非必要规范文档 / MVP 范围扩大 / 未经审查 Legacy 迁移 | Accepted | M0-FOUNDER-REVIEW §8 |
| FD-007 | `docs/` 编号文件为 Canonical Source；根目录重复文件改为 Redirect | Accepted | M0.5-DOCS-CLEANUP-PLAN |
| FD-008 | SEC-001：Legacy PEM key/cert 按已泄露处理；不迁移；旧系统须轮换；health-one 禁止提交 *.pem, *.key, *.crt, *.env, *.db, *.db-shm, *.db-wal, uploads/ | Accepted | M0-FOUNDER-REVIEW §4 |
| FD-009 | Claude Code 只负责执行已批准任务，不负责 Founder / Product / Architecture 决策 | Accepted | FD-002-DEVELOPMENT-GATE |

---

## 2. Major Findings

### SEC-001: Legacy PEM Key/Certificate in Git History (HIGH)

- **发现时间：** 2026-06-28
- **影响范围：** Legacy 3号工程
- **详情：** `store/key.pem` 和 `store/cert.pem` 已被 Git 跟踪；提交 `706dccc` 已进入 `origin/master`；提交 `323e78e` 未进入 `origin/master`
- **判定：** 按已泄露处理
- **处置：** 不迁移至 health-one；不再使用该私钥/证书；旧系统继续运行须轮换证书/密钥；health-one 建立 .gitignore 规则
- **Owner：** Development Office / Security Review
- **状态：** Open

### FIND-001: Root/Docs Document Duplication Risk

- **发现时间：** 2026-06-28
- **详情：** 根目录存在 `AI_START_HERE.md`, `PROJECT-MAP.md`, `PROJECT-MEMORY.md`, `PROJECT-CONTEXT.md`, `Glossary.md`，同时 `docs/` 下存在编号版本 `02–06`
- **风险：** 长期分叉，事实来源不唯一
- **处置：** FD-007 决定 docs/ 为 Canonical Source；M0.5 执行 Redirect 清理
- **状态：** Open（M0.5 执行中）

### FIND-002: All M0 Work Uncommitted

- **发现时间：** 2026-06-28
- **详情：** 今日所有文档创建、修改均未 commit
- **风险：** 工作成果未固化；存在丢失风险
- **处置：** M0.5 完成后统一进行 M0 Foundation Final Commit
- **状态：** Open

---

## 3. Lessons Learned

| # | Lesson | Source |
|---|--------|--------|
| L1 | 任何新建仓库/目录前必须先 Repository Check — 避免多仓库混乱 | M0 Review |
| L2 | AI 记忆不能替代 Repository — 仓库是持久事实来源 | M0 Review |
| L3 | Claude Code 必须从 BOOT_PROTOCOL 开始 — 否则缺乏治理上下文 | M0 Review |
| L4 | Legacy 是资产也是风险源 — SEC-001 为典型案例 | SEC-001 |
| L5 | 先治理、再架构、再产品、再开发 — 顺序不可颠倒 | M0 Review |
| L6 | 文档分叉是沉默风险 — 发现时已存在 5 个重复文件 | FIND-001 |
| L7 | 每日工作结束前应 commit — FIND-002 为反面案例 | FIND-002 |

---

## 4. Current Project Status

| Item | State |
|------|-------|
| 正式主仓库 | `health-one` |
| 当前 Milestone | M0 → M0.5 transition |
| 下一 Milestone | M1 — Architecture Freeze (blocked by M0.5) |
| 当前 Sprint | Sprint 2 — Controlled MVP Implementation |
| Git 状态 | 多个文件未提交 |
| 安全状态 | SEC-001 Open (High) |
| 阻塞项 | M0.5 Docs Cleanup 未完成 |

---

## 5. Documents Created / Modified Today

### Created

| File | Type |
|------|------|
| `docs/00-CONSTITUTION.md` | Constitution |
| `docs/01-GOVERNANCE.md` | Governance |
| `docs/02-AI_START_HERE.md` | AI Entry Guide |
| `docs/03-PROJECT_MAP.md` | Project Map |
| `docs/04-PROJECT_MEMORY.md` | Project Memory |
| `docs/05-PROJECT_CONTEXT.md` | Project Context |
| `docs/06-GLOSSARY.md` | Glossary |
| `docs/adr/ADR-001-legacy-migration.md` | ADR (placeholder) |
| `docs/workflow/BOOT_PROTOCOL.md` | Boot Protocol |
| `docs/release/DOCS-GOVERNANCE-SETUP-2026-06-28.md` | Governance Setup Report |
| `docs/release/M0-FOUNDER-REVIEW-2026-06-28.md` | M0 Founder Review |
| `docs/release/FD-002-DEVELOPMENT-GATE.md` | Founder Decision |
| `docs/release/M0.5-DOCS-CLEANUP-PLAN.md` | Cleanup Plan |
| `docs/release/FOUNDER-DAILY-2026-06-28.md` | This file |

### Modified

| File | Change |
|------|--------|
| `README.md` | Added project entry section and document index |
| `docs/release/M0-FOUNDER-REVIEW-2026-06-28.md` | Added §9 M0.5 Required Before M1 |

---

## 6. Next Actions (2026-06-29)

| Priority | Action | Owner |
|----------|--------|-------|
| P0 | Execute M0.5 Docs Cleanup Plan — convert root duplicates to Redirects | Knowledge Office |
| P0 | Update README.md document navigation post-cleanup | Knowledge Office |
| P0 | M0 Foundation Final Commit | Development Office |
| P1 | Begin M1 Architecture Freeze — RFC-001 Core Domain Model | Architecture Office |
| P1 | SEC-001 follow-up — verify Legacy key rotation plan | Security Review |
| P2 | Populate remaining empty docs/ directories as needed | Knowledge Office |

---

## 7. End of Log

**Signed:** Founder Office
**Date:** 2026-06-28
