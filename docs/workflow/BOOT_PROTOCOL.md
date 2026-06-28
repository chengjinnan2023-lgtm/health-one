# Health One Boot Protocol v1.0

## Status
Accepted Draft

## Owner
Founder Office

## Effective Date
2026-06-28

---

## Purpose

本文件定义 Health One 项目的统一启动协议（Boot Protocol）。

**任何 Claude Code 窗口、任何 AI、任何开发者在 Health One 仓库中开始工作前，必须首先执行本 Boot Protocol。**

本文件是 Health One 项目的入口文件。不执行 Boot Protocol，不得进入任何 Coding 工作。

本文件解决的问题：

- 防止在不了解项目状态的情况下直接 Coding
- 防止在错误分支或错误仓库工作
- 防止忽略已批准的架构决策
- 防止扩大 MVP 范围
- 防止重复创建已有资源

本文件提取自 `docs/01-GOVERNANCE.md` Section 3，并已独立为可执行的工作流文件。

---

## Step 1: Repository Check

确认以下信息：

- [ ] 当前工作目录是否为正式主仓库
- [ ] 当前分支是否为预期分支
- [ ] `git status` 是否干净（无意外未提交变更）
- [ ] 是否存在未跟踪文件需要处理
- [ ] 是否在正确的工作目录（非 Legacy 目录，非其他工程目录）

**当前正式主仓库：**

```
/Users/jinnanlaoshi/health-one
```

**当前 Legacy 主工程（仅供参考，不在此开发）：**

```
/Volumes/data/MacData/Desktop_Workspace/Current/3号工程
```

**当前 Review/Patch 参考工程（仅供审查参考）：**

```
/Volumes/data/MacData/Desktop_Workspace/Current/一号工程
```

**规则：**

- health-one 是新系统唯一主仓库
- Legacy 工程仅作为资产参考，不在其上开发 Health One v2
- 不把旧系统代码直接复制进新系统主干
- 所有迁移必须经过 ADR/RFC 批准

---

## Step 2: Project Documents Check

按以下顺序读取项目文档，建立完整上下文：

1. `docs/00-CONSTITUTION.md` — 项目宪章，最高原则
2. `docs/01-GOVERNANCE.md` — 治理规范，包含完整规则
3. `docs/02-AI_START_HERE.md` — AI 工作入口指南
4. `docs/03-PROJECT_MAP.md` — 项目地图，目录与模块结构
5. `docs/04-PROJECT_MEMORY.md` — 长期项目记忆
6. `docs/05-PROJECT_CONTEXT.md` — 项目上下文与当前状态
7. `docs/06-GLOSSARY.md` — 项目术语表

**读取要求：**

- 必须实际读取文件内容，不得仅检查文件是否存在
- 不得依赖 AI 记忆替代 Repository 文件
- 当 AI 记忆与 Repository 文件冲突时，以 Repository 为准
- 发现文档间不一致时，记录差异并在 BOOT REPORT 中报告

**文档层级关系：**

```
Constitution (最高)
    ↓
Governance
    ↓
ADR
    ↓
RFC
    ↓
PRD
    ↓
Tasks
    ↓
Code
```

下层文档不得违反上层文档。

---

## Step 3: Architecture Check

确认当前架构状态：

- [ ] 读取 `docs/adr/` 下所有已批准（Accepted）ADR
- [ ] 读取 `docs/architecture/` 下所有架构文档
- [ ] 确认当前架构冻结（Architecture Freeze）范围
- [ ] 确认是否有待批准的 RFC
- [ ] 确认是否有已批准但尚未实施的 ADR
- [ ] 确认当前任务是否在已批准架构范围内

**当前架构状态：**

> Phase: Architecture Freeze
>
> Sprint 2 — Controlled MVP Implementation

**检查要点：**

- 任何架构变更必须先有 ADR
- 任何方案设计必须先有 RFC（且 RFC 必须有对应 ADR 或上层文档支撑）
- 不得在未批准 ADR/RFC 的情况下直接修改核心架构
- 不得绕过架构决策直接实现功能

**ADR 状态：**

| 状态 | 含义 |
|------|------|
| Proposed | 提议中，待审批 |
| Accepted | 已批准，可实施 |
| Superseded | 已被后续 ADR 取代 |
| Rejected | 已拒绝 |

---

## Step 4: Sprint Check

确认当前 Sprint 和任务状态：

- [ ] 当前 Sprint 编号与目标
- [ ] 当前 Milestone
- [ ] 当前 Release 状态
- [ ] 当前窗口（Office）职责范围
- [ ] 当前窗口 Scope 与 Out of Scope

**当前阶段：**

> Sprint 2 — Controlled MVP Implementation

**当前 Milestone：**

> Architecture Freeze

**Office 职责分配：**

| Office | 职责 |
|--------|------|
| Founder Office | 决策、协调、最终审批 |
| Product Office | PRD 撰写、用户流程设计 |
| Architecture Office | ADR / RFC / 数据模型 / 技术边界 |
| Development Office | 代码实现 |
| QA Office | 测试与验收 |
| Growth Office | 内容与增长 |
| Brand Office | 品牌与视觉 |
| Release & PM | 排期、里程碑与发布管理 |

**MVP 闭环定义（不可扩大）：**

1. 建立健康元
2. 建立健康档案
3. AI 分析
4. 生成健康建议
5. 预约服务
6. 完成服务
7. 记录结果
8. 形成健康时间线
9. 触发随访

---

## Step 5: Risk Check

开始任何任务前，必须逐项确认以下风险：

- [ ] **业务代码风险**：是否会修改现有业务代码？如是，是否有对应 PRD/RFC？
- [ ] **数据风险**：是否会影响生产数据或客户数据？如是，是否有备份方案？
- [ ] **旧系统风险**：是否会影响 Legacy 系统？如是，是否有隔离方案？
- [ ] **仓库风险**：是否会引入重复仓库或重复目录？
- [ ] **MVP 范围风险**：是否会扩大 MVP 范围？如是，是否经过 Founder Office 批准？
- [ ] **ADR 合规风险**：是否违反任何已批准的 ADR？
- [ ] **依赖风险**：是否会引入新的外部依赖？如是，是否经过评估？
- [ ] **回滚风险**：变更是否可回滚？如否，是否有充分理由和批准？

**高风险操作（必须先获 Founder Office 批准）：**

- MVP 范围扩大
- 数据模型重大调整
- AI 架构调整
- 仓库结构调整
- 生产部署
- 涉及真实客户数据
- 涉及商业模式变化

---

## Step 6: Output BOOT REPORT

完成 Step 1–5 后，必须输出 BOOT REPORT。

BOOT REPORT 格式：

```markdown
## BOOT REPORT — [Date] [Time]

### 1. Repository Status
- 当前仓库：[path]
- 当前分支：[branch]
- Git 状态：[clean / dirty]
- 未提交文件：[list or "none"]

### 2. Documents Status
- 已读取文档：[list]
- 文档一致性：[consistent / inconsistent — describe]

### 3. Architecture Status
- 已批准 ADR：[list]
- 待批准 RFC：[list]
- 架构冻结范围：[describe]

### 4. Sprint Status
- 当前 Sprint：[Sprint X]
- 当前 Milestone：[milestone]
- 当前 Office：[office name]

### 5. Risk Assessment
- 风险等级：[Low / Medium / High / Critical]
- 已识别风险：[list]
- 缓解措施：[list]

### 6. Ready to Work
- [ ] 已完成所有检查
- [ ] 了解当前限制
- [ ] 明确不做什么
```

**没有 BOOT REPORT，不得进入执行。**

---

## Step 7: Wait for Founder Office Task

完成 BOOT REPORT 后：

1. **停止。等待 Founder Office 分配具体任务。**
2. 不得自行决定做什么。
3. 不得自行创建任务。
4. 不得猜测下一步。
5. 如果发现 Repository、ADR、RFC、PRD、当前任务之间存在冲突，必须输出 BLOCKED REPORT（格式见 `CLAUDE_PROTOCOL.md`）并等待 Founder Office 决策。

**原则：**

> 没有明确 Mission，不进入执行。
>
> 明确今天只做什么，不做什么。

---

## 强制规则

### 对 Claude Code 的强制要求

1. **任何 Claude Code 新窗口在 Health One 仓库中必须首先执行本 Boot Protocol。**
2. **不得跳过 Boot Protocol 直接 Coding。**
3. **不得仅凭 AI 记忆判断项目状态。**
4. **不得在未完成 Step 1–6 的情况下开始任何代码修改。**
5. **发现任何冲突或不确定，立即停止并报告，不得猜测。**

### 对所有人的强制要求

1. 本协议适用于所有窗口、所有 AI、所有开发者。
2. Boot Protocol 不是建议，是必须执行的流程。
3. 违反本协议的工作产出，不予通过 Review。

---

## Reference

本文件内容提取自 `docs/01-GOVERNANCE.md` Section 3，并根据 Health One Workflow Protocol 规范独立扩展。

完整治理规则请参考 `docs/01-GOVERNANCE.md`。

相关 Workflow 文件：

- `CLAUDE_PROTOCOL.md` — Claude Code 职责边界
- `TASK_RULES.md` — 任务执行规则
- `COMMIT_RULES.md` — Git 提交规则
- `REVIEW_RULES.md` — Review 规则
