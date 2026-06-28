# Task Rules v1.0

## Status
Accepted Draft

## Owner
Founder Office

## Effective Date
2026-06-28

---

## Purpose

本文件定义 Health One 项目中所有任务的执行规则。

所有窗口、所有 AI、所有开发者的任务执行必须遵守本文件。

---

## 1. 任务编号规则

### 编号格式

所有任务必须编号，格式：

```
[TYPE]-[NNN]
```

示例：
- `ARCH-001`
- `RFC-003`
- `PRD-002`
- `DEV-012`
- `QA-005`
- `REL-001`
- `DOC-008`
- `WF-001`

### 编号要求

- 编号必须唯一，不得重复
- 编号由 Founder Office 分配
- Claude Code 不得自行创建编号
- 任务编号是任务追踪的唯一标识

---

## 2. 任务类型

### ARCH — Architecture Task

架构相关任务：
- ADR 撰写与审批
- 架构决策记录
- 技术选型评估
- 架构文档维护

**要求：** 必须由 Architecture Office 主导，输出为 ADR 文档。

### RFC — Request for Comments

方案设计任务：
- 具体模块设计方案
- 数据模型设计
- API 设计
- 模块边界定义

**要求：** 必须有对应 ADR 或上层文档支撑，输出为 RFC 文档。

### PRD — Product Requirement Document

产品需求任务：
- 用户流程设计
- 功能需求描述
- 验收标准定义
- 用户故事编写

**要求：** 必须由 Product Office 主导，服务于真实门店和真实客户。MVP PRD 不得超出闭环范围。

### DEV — Development Task

开发实现任务：
- 功能代码实现
- Bug 修复
- 代码重构
- 性能优化

**要求：** 必须先有已批准的 PRD/RFC。不得自行决定实现范围。

### QA — Quality Assurance Task

测试与验收任务：
- 功能测试
- 数据一致性验证
- 回归测试
- 门店场景验证

**要求：** 必须有验收标准。必须验证真实门店场景。

### REL — Release Task

发布任务：
- 版本发布
- Release Note 编写
- 回滚方案确认
- 部署检查

**要求：** 必须有 QA Approval。必须可回滚。

### DOC — Documentation Task

文档任务：
- 项目文档编写与更新
- Workflow 协议维护
- 术语表更新
- 技术文档编写

**要求：** 文档必须与 Repository 保持一致。

### WF — Workflow Task

工作流任务：
- Workflow 协议文件编写
- 流程规范制定
- 工作流优化

**要求：** 产出为 `docs/workflow/` 下的 Markdown 文件。

---

## 3. Claude Code 任务执行规则

### 只能执行明确分配的任务

Claude Code **只能**执行 Founder Office 明确分配的任务。

- 任务必须有明确的任务编号
- 任务必须有明确的任务描述
- 任务必须有明确的 Scope 和 Out of Scope
- 任务必须有明确的完成标准

### 不得自行创造新任务

Claude Code **不得**：

- 自行创造新任务编号
- 自行扩大任务范围
- 将建议转为自我分配的任务
- 在完成任务后自行决定下一步做什么
- 猜测 Founder Office 意图并据此行动

### 任务执行流程

```
接收任务
    ↓
执行 Boot Protocol（BOOT_PROTOCOL.md）
    ↓
确认任务 Scope 和限制
    ↓
检查是否存在冲突（如存在 → BLOCKED REPORT）
    ↓
执行任务
    ↓
输出任务完成报告
    ↓
等待下一个任务
```

**不得跳过任何步骤。**

---

## 4. 任务完成报告

每个任务完成后，Claude Code 必须输出以下报告：

### 报告格式

```markdown
## TASK COMPLETE — [TASK-ID]

### 1. 修改文件（Modified Files）
- [file path] — [change description]
- [file path] — [change description]

### 2. 未修改内容（Unchanged）
- [明确列出任务范围内但未修改的内容及原因]

### 3. 风险（Risks）
- [已识别风险及缓解措施]
- [未解决风险及建议]

### 4. Git Status
```
[git status --short 输出]
```

### 5. 下一步建议（Next Steps Recommendation）
- [建议的下一步行动，仅供参考]
- [明确标注：最终由 Founder Office 决定]
```

### 报告要求

- 修改文件列表必须完整，不得遗漏
- 未修改内容必须诚实说明，不得掩盖
- 风险必须如实报告，不得轻描淡写
- `git status` 必须为实际命令输出
- 下一步建议必须标注 "仅供参考"

---

## 5. 任务优先级

任务优先级由 Founder Office 定义。Claude Code 不得自行调整优先级。

| 优先级 | 含义 |
|--------|------|
| P0 | 阻塞性，必须立即完成 |
| P1 | 高优先级，当前 Sprint 必须完成 |
| P2 | 正常优先级，当前 Sprint 计划内 |
| P3 | 低优先级，有余力时完成 |
| P4 | 待定，未来 Sprint 候选 |

---

## 6. 任务状态

| 状态 | 含义 |
|------|------|
| TODO | 已分配，等待执行 |
| IN PROGRESS | 执行中 |
| BLOCKED | 被阻塞，等待解除 |
| COMPLETE | 已完成，等待 Review |
| APPROVED | 已通过 Review |
| REJECTED | 未通过 Review，需返工 |
| CANCELLED | 已取消 |

---

## 7. 绝对禁止

1. 不得执行未分配的任务
2. 不得自行创建任务编号
3. 不得扩大任务范围
4. 不得跳过 Boot Protocol 直接执行任务
5. 不得在任务报告中隐瞒修改内容
6. 不得在任务报告中隐瞒风险
7. 不得在 BLOCKED 状态下继续执行
8. 不得将多个无关修改混在一个任务中

---

## Reference

- `BOOT_PROTOCOL.md` — 启动协议
- `CLAUDE_PROTOCOL.md` — Claude Code 职责边界
- `COMMIT_RULES.md` — Git 提交规则
- `REVIEW_RULES.md` — Review 规则
