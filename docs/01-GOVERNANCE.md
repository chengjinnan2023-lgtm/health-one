# Health One Governance v1.0
# Health One 项目治理规范 v1.0

## Status
Accepted Draft

## Owner
Founder Office

## Effective Date
2026-06-28

## 1. Purpose（目的）

本文件定义 Health One 项目的统一治理规则。

所有窗口、所有 AI、所有开发任务都必须遵守本文件。

本文件解决的问题：

- 防止重复创建仓库、目录和文档
- 防止 AI 依赖聊天记忆而忽略 Repository
- 防止各窗口各自为政
- 防止旧系统污染新系统
- 防止未审查内容直接进入开发

## 2. Rule-0: Repository is the Single Source of Truth

GitHub Repository 是唯一事实来源。

优先级顺序：

1. Repository 当前文件
2. 已批准 ADR / RFC / PRD
3. PROJECT-MEMORY / PROJECT-MAP / PROJECT-CONTEXT
4. 当前对话上下文
5. AI 记忆

当 AI 记忆与 Repository 冲突时，以 Repository 为准。

## 3. Health One Boot Protocol

任何窗口开始工作前，必须执行 Boot Protocol。

### Step 1: Repository Check

确认：

- 当前主仓库
- 当前分支
- 当前 Git 状态
- 是否存在未提交变更
- 是否在正确目录工作

当前正式主仓库：

/Users/jinnanlaoshi/health-one

当前 Legacy 主工程：

/Volumes/data/MacData/Desktop_Workspace/Current/3号工程

当前 Review/Patch 参考工程：

/Volumes/data/MacData/Desktop_Workspace/Current/一号工程

### Step 2: Project Documents Check

读取：

- docs/00-CONSTITUTION.md
- docs/01-GOVERNANCE.md
- docs/02-AI_START_HERE.md
- docs/03-PROJECT_MAP.md
- docs/04-PROJECT_MEMORY.md
- docs/05-PROJECT_CONTEXT.md
- docs/06-GLOSSARY.md

### Step 3: Memory Check

确认长期项目记忆是否与 Repository 一致。

如果不一致，以 Repository 为准，并在 Review 中记录差异。

### Step 4: Current Sprint Check

确认当前 Sprint、Milestone、Release 状态。

当前阶段：

Sprint 2 — Controlled MVP Implementation

当前 Milestone：

Architecture Freeze

### Step 5: Current Window Check

确认当前窗口职责、Scope、Out of Scope。

例如：

- Founder Office 负责决策与协调
- Product Office 负责 PRD 与用户流程
- Architecture Office 负责 ADR / RFC / 数据模型 / 技术边界
- Development Office 负责代码实现
- QA Office 负责测试与验收
- Growth Office 负责内容与增长
- Brand Office 负责品牌与视觉
- Release & PM 负责排期、里程碑与发布

### Step 6: Risk Check

开始任务前必须确认：

- 是否会修改业务代码
- 是否会影响生产数据
- 是否会影响旧系统
- 是否会引入重复仓库
- 是否会扩大 MVP 范围
- 是否违反已批准 ADR

### Step 7: Today's Mission

明确今天只做什么，不做什么。

没有明确 Mission，不进入执行。

## 4. Project Lifecycle

所有窗口遵循同一生命周期：

Boot
↓
Understand
↓
Plan
↓
Execute
↓
Review
↓
Approve
↓
Release

不同窗口负责不同阶段，但流程一致。

## 5. Document Hierarchy

文档层级如下：

1. Constitution
2. Governance
3. ADR
4. RFC
5. PRD
6. Tasks
7. Code
8. QA Report
9. Release Note

下层文档不得违反上层文档。

## 6. Office Workflow

标准协作流程：

Founder Office
↓
Business Office
↓
Product Office
↓
Architecture Office
↓
Development Office
↓
QA Office
↓
Release & PM
↓
Growth / Brand

Growth 和 Brand 不得宣传尚未验证的核心能力。

Development 不得实现未经 Product / Architecture 明确的功能。

QA 不得跳过验收标准。

## 7. Repository Strategy

正式主仓库：

health-one

Legacy 旧系统仓库：

xixi-health

本机 Legacy 主工程：

/Volumes/data/MacData/Desktop_Workspace/Current/3号工程

本机 Review/Patch 工程：

/Volumes/data/MacData/Desktop_Workspace/Current/一号工程

规则：

- health-one 是新系统唯一主仓库
- xixi-health / 3号工程 只作为 Legacy 资产库
- 一号工程只作为审查、测试、补丁参考
- 不在旧系统继续开发 Health One v2
- 不把旧系统代码直接复制进新系统主干
- 所有迁移必须经过 Reuse Matrix 和 RFC

## 8. ADR Rules

ADR 用于记录不可轻易逆转的架构决策。

ADR 必须包括：

- Status
- Date
- Context
- Decision
- Consequences
- Alternatives Considered
- Scope
- Non-Goals
- Follow-up Documents

ADR 状态：

- Proposed
- Accepted
- Superseded
- Rejected

## 9. RFC Rules

RFC 用于设计具体方案。

RFC 必须先有对应 ADR 或 Constitution / Governance 支撑。

RFC 必须包括：

- Problem
- Scope
- Non-Goals
- Proposed Design
- Data Model
- API / Module Boundary
- Risks
- Open Questions
- Acceptance Criteria

## 10. PRD Rules

PRD 只描述产品需求，不直接决定技术实现。

PRD 必须服务于真实门店和真实客户。

MVP PRD 不得包含商城、教练系统、复杂订阅、多门店 SaaS、安卓 App 等非第一闭环内容。

## 11. Development Rules

Development 必须遵循：

- 先看 Constitution
- 先看 Governance
- 先看 ADR / RFC
- 再写代码
- 小步提交
- 可回滚
- 不碰生产数据
- 不扩大范围

## 12. QA Rules

QA 必须验证：

- 功能是否可运行
- 数据是否一致
- 是否符合 PRD
- 是否符合 RFC
- 是否影响旧数据
- 是否能回滚
- 是否完成真实门店场景验证

## 13. Release Rules

Release 必须满足：

- 有 Release Note
- 有 QA Approval
- 有回滚方案
- 有已知风险说明
- 有真实验证结果

没有真实门店验证，不发布正式版本。

## 14. Change Control

任何涉及以下内容的变更，必须先走 Founder Office 审批：

- MVP 范围扩大
- 数据模型重大调整
- AI 架构调整
- 仓库结构调整
- 生产部署
- 涉及真实客户数据
- 涉及商业模式变化
- 涉及品牌定位变化

## 15. Absolute Prohibitions

绝对禁止：

1. 未检查 Repository 就新建仓库或目录
2. 未经 ADR/RFC 批准直接改核心架构
3. 在旧系统上继续开发 Health One v2
4. 将旧系统代码无审查复制进新系统
5. 使用 AI 记忆替代 Repository 文件
6. 未经 QA 发布 Release
7. 在未验证前宣传尚不存在的能力
8. 未备份情况下操作数据库
9. 未经确认操作生产服务器
10. 扩大 MVP 范围
