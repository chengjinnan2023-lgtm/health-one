# M0 Founder Review Report
# M0 创始人复盘报告

## Status
Approved Draft

## Date
2026-06-28

## Milestone
M0 — Project Foundation

---

## 1. Executive Summary

M0 的目标是建立 Health One 的项目基础、治理基础、Legacy 迁移原则和 AI 协作规则。

本阶段已经完成，可以进入 M1 Architecture Freeze。

M0 established the project foundation for Health One, including governance structure, Legacy migration principles, and AI collaboration rules. All deliverables for this milestone are complete, and the project is cleared to proceed into M1 Architecture Freeze.

---

## 2. What Was Completed

- Health One 正式主仓库确认：`/Users/jinnanlaoshi/health-one`
- GitHub origin：`chengjinnan2023-lgtm/health-one`
- Legacy 主工程确认：3号工程
- Review/Patch 工程确认：一号工程
- Constitution 建立
- Governance 建立
- Boot Protocol 建立
- Workflow Protocol 建立
- ADR-001 批准
- Legacy Reuse Report 完成
- ChatGPT / Claude Code 分工明确

---

## 3. Key Decisions

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | `health-one` 是唯一正式主仓库 | Single Source of Truth；所有 v2 开发、文档、治理均在此仓库进行 |
| 2 | 3号工程只作为 Legacy 资产库 | 不直接续改；只从中提取可复用资产，经审查后迁移 |
| 3 | 一号工程只作为 Review/Patch 参考 | 不直接合并或依赖；仅用于理解旧系统行为 |
| 4 | 采用 Legacy Migration，不直接续改，不完全重写 | 平衡速度与质量；保留经过验证的业务逻辑，重构不合理的部分 |
| 5 | 第一批 MVP 迁移模块：<br>1. Health Identity<br>2. Health Profile<br>3. Upload Asset<br>4. AI Assistant<br>5. Service Session<br>6. Member Entitlement | 覆盖 v2 核心用户旅程的最小可行模块集合 |
| 6 | Claude Code 只负责执行，不负责 Founder / Product / Architecture 决策 | AI 是执行工具，决策权始终在 Founder Office |
| 7 | Repository is the Single Source of Truth | 所有决策、规范、代码以仓库内容为准；AI 记忆不可替代仓库 |

---

## 4. Security Findings

### SEC-001: Legacy PEM key/certificate committed to Git history

**Finding:**
Legacy 工程中以下文件已被 Git 跟踪：
- `store/key.pem`
- `store/cert.pem`

**Confirmed:**
- 提交 `706dccc` 已进入 `origin/master`
- 提交 `323e78e` 未进入 `origin/master`
- 因此 `store/key.pem` / `store/cert.pem` 必须按已泄露处理

**Decision:**
- 不迁移至 `health-one`
- 不再使用该私钥/证书
- 后续如旧系统继续运行，必须轮换证书/密钥
- 禁止将 `*.pem`、`*.key`、`*.crt`、`*.env`、`*.db`、`*.db-shm`、`*.db-wal`、`uploads/` 提交至 `health-one`

**Risk Level:** High

**Owner:** Development Office / Security Review

**Status:** Open

---

### SEC-002: Runtime secrets exposed in systemd service files

**Finding:**
Legacy server systemd service files contain production-like secrets in Environment variables, including AI provider key, SMTP password, JWT secret, Store API token, and ADP app key.

**Status:** Open

**Risk Level:** High

**Decision:**
- Treat these secrets as exposed.
- Rotate before any continued production use.
- Do not migrate any runtime secrets into health-one.
- Use `.env.example` and secret management in Health One v2.
- All future server config output must be redacted before sharing.

**Owner:** Development Office / Security Review

---

## 5. Risks

| # | Risk | Mitigation |
|---|------|------------|
| 1 | Scope Creep | M0 Freeze Decisions 约束；任何范围变更需 Founder Office 批准 |
| 2 | 文档治理过度复杂 | Freeze 禁止新增非必要规范文档；先架构、再产品、再开发 |
| 3 | Legacy 敏感信息风险 | SEC-001 已识别；禁止迁移敏感文件；建立 `.gitignore` 规则 |
| 4 | 旧系统业务中心与 Health One v2 不一致 | 迁移时逐模块审查；不假设旧逻辑直接适用 |
| 5 | Claude Code 如果未执行 Boot Protocol，可能误操作 | Boot Protocol 作为强制入口；每次新会话必须先加载 |
| 6 | 未完成正式 M0 commit | 本报告即为 M0 正式 closure；后续完成 commit 固化 |

---

## 6. Lessons Learned

1. **任何新建仓库/目录前必须先 Repository Check** — 避免多仓库混乱；确保 Single Source of Truth
2. **AI 记忆不能替代 Repository** — AI 会话上下文是短暂的；仓库是持久的事实来源
3. **Claude Code 必须从 BOOT_PROTOCOL 开始** — 否则缺乏项目上下文和治理约束，容易误操作
4. **Legacy 是资产，但也是风险源** — 包含业务知识，但也包含安全漏洞、过时模式和技术债
5. **先治理、再架构、再产品、再开发** — 这是 M0 验证的正确顺序；跳过治理直接开发会导致返工

---

## 7. Approved State After M0

M0 结束后的稳定状态：

| Item | State |
|------|-------|
| 正式主仓库 | `health-one` |
| 当前阶段 | Sprint 2 — Controlled MVP Implementation |
| 当前 Milestone | Architecture Freeze |
| 下一阶段 | M1 — Architecture Freeze |
| 下一份核心文档 | RFC-001 Core Domain Model |

---

## 8. Freeze Decisions

Until the first real customer loop is completed:

- 不新增 Office
- 不新增治理层级
- 不新增流程
- 不新增非必要规范文档
- 不扩大 MVP 范围
- 不迁移未经审查的 Legacy 代码

These freeze decisions ensure the team stays focused on delivering the MVP and gathering real customer feedback before any structural expansion.

---

## 9. M0.5 Required Before M1

Before entering M1 Architecture Freeze, the project must complete M0.5 Docs Cleanup.

Reason:
- Root-level project documents and docs-numbered documents currently coexist.
- This creates future divergence risk.
- docs/ must become the Canonical Source before architecture work begins.

M0.5 is a documentation cleanup step, not a new governance layer.

---

## 10. Next Milestone: M1 Architecture Freeze

**M1 目标：**
冻结 Health One v2 的核心架构。

**M1 交付物：**

| # | Document | Description |
|---|----------|-------------|
| 1 | RFC-001 Core Domain Model | 核心领域模型定义 |
| 2 | RFC-002 Data Model | 数据模型设计 |
| 3 | RFC-003 AI Architecture | AI 架构设计 |
| 4 | RFC-004 Module Boundary | 模块边界定义 |
| 5 | MVP Migration Plan | MVP 迁移计划 |

---

## 11. Founder Office Approval

**M0 Project Foundation is approved.**

Approved by:
**Founder Office**

Date:
**2026-06-28**
