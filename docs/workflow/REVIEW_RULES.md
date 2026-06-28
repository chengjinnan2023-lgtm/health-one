# Review Rules v1.0

## Status
Accepted Draft

## Owner
Founder Office

## Effective Date
2026-06-28

---

## Purpose

本文件定义 Health One 项目中所有产出的审查（Review）规则。

所有输出——文档、架构、代码、Release——在被批准前必须经过对应 Review。

---

## 1. 核心原则

### 所有输出进入 Founder Office 审查

Health One 项目中，所有工作产出（文档、架构、设计、代码、Release）最终必须经过 Founder Office 审查。

**没有审查，没有批准。**

### 审查层级

```
Founder Office（终审）
    ↓
专业 Office Review（专业审查）
    ↓
Claude Code / Developer（提交）
```

---

## 2. Review 类型

### 2.1 Architecture Review（架构审查）

**审查对象：**
- ADR（架构决策记录）
- RFC（方案设计）
- 架构文档（`docs/architecture/`）
- 数据模型设计
- 模块边界定义
- 技术选型决策

**审查者：** Architecture Office → Founder Office

**审查要点：**
- [ ] 是否符合 Constitution 架构原则
- [ ] 是否遵循 Domain Driven 设计
- [ ] 是否遵循 Modular Design 原则
- [ ] 是否遵循 Local First 原则
- [ ] 模块边界是否清晰
- [ ] 数据模型是否合理
- [ ] 是否与已有 ADR 一致
- [ ] 是否考虑 Legacy 迁移策略
- [ ] 是否有回滚方案
- [ ] 是否超出 MVP 范围（如超出，是否有批准）

**审查结论：**

| 结论 | 含义 |
|------|------|
| Approved | 批准，可进入下一阶段 |
| Approved with Changes | 批准但需要修改，修改后可进入下一阶段（无需重新审查） |
| Rejected | 拒绝，需重新设计并提交审查 |
| Blocked | 阻塞，需等待其他决策或条件满足 |

### 2.2 Product Review（产品审查）

**审查对象：**
- PRD（产品需求文档）
- 用户流程设计
- 功能需求描述
- 验收标准

**审查者：** Product Office → Founder Office

**审查要点：**
- [ ] 是否服务于真实门店和真实客户
- [ ] 是否在 MVP 闭环范围内
- [ ] 用户流程是否完整、可用
- [ ] 验收标准是否明确、可验证
- [ ] 是否有对应的 ADR/RFC 支撑
- [ ] 是否包含超出 MVP 的内容（商城、教练系统、多门店 SaaS 等）
- [ ] 是否符合 Health Identity 核心定位

**审查结论：**

| 结论 | 含义 |
|------|------|
| Approved | 批准，可进入开发 |
| Approved with Changes | 批准但需修改指定内容 |
| Rejected | 拒绝，需重新设计 |
| Blocked | 阻塞，需等待前置条件 |

### 2.3 QA Review（质量审查）

**审查对象：**
- 功能实现
- 测试报告
- Bug 修复验证
- 数据一致性验证
- 门店场景验证结果

**审查者：** QA Office → Founder Office

**审查要点：**
- [ ] 功能是否可运行
- [ ] 数据是否一致
- [ ] 是否符合 PRD 规格
- [ ] 是否符合 RFC 设计
- [ ] 是否影响旧数据
- [ ] 是否能回滚
- [ ] 是否完成真实门店场景验证
- [ ] 测试覆盖率是否达标
- [ ] 是否有已知未修复 Bug

**审查结论：**

| 结论 | 含义 |
|------|------|
| Approved | 批准，功能可进入 Release |
| Approved with Changes | 批准但需修复指定问题后才可 Release |
| Rejected | 拒绝，需返工 |
| Blocked | 阻塞，依赖未就绪 |

### 2.4 Release Review（发布审查）

**审查对象：**
- Release Note
- 发布内容确认
- 回滚方案
- 部署检查清单

**审查者：** Release & PM → Founder Office

**审查要点：**
- [ ] 是否有 Release Note
- [ ] 是否有 QA Approval
- [ ] 是否有回滚方案
- [ ] 是否有已知风险说明
- [ ] 是否有真实验证结果
- [ ] 是否影响现有用户
- [ ] 是否涉及数据迁移（如有，是否有方案）
- [ ] 部署顺序是否正确

**审查结论：**

| 结论 | 含义 |
|------|------|
| Approved | 批准，可发布 |
| Approved with Changes | 批准但需修改 Release Note 或补充验证 |
| Rejected | 拒绝，不满足发布条件 |
| Blocked | 阻塞，需等待条件满足 |

---

## 3. 审查结论详解

### Approved（批准）

- 产出完全满足审查要点
- 无阻塞性问题
- 可直接进入下一阶段

### Approved with Changes（批准但需修改）

- 整体方向正确，但存在需修改的具体问题
- 修改内容明确、范围有限
- 修改后无需重新审查，由提交者自行验证
- 修改完成后标记为已修改

### Rejected（拒绝）

- 产出不满足核心审查要点
- 存在方向性或根本性问题
- 需要重新设计、重新实现或重新提交
- 拒绝时必须附带明确的拒绝原因和改进方向

### Blocked（阻塞）

- 产出本身可能正确，但依赖未满足
- 需等待其他 ADR/RFC/PRD 先批准
- 需等待技术条件或资源就绪
- 需等待 Founder Office 的特定决策
- 阻塞解除后可继续审查流程

---

## 4. Review 流程

### 标准流程

```
提交者完成任务
    ↓
提交 Review 请求（含任务完成报告）
    ↓
专业 Office 进行专业审查
    ↓
Founder Office 终审
    ↓
输出审查结论
    ↓
Approved → 下一阶段
Approved with Changes → 修改 → 验证 → 下一阶段
Rejected → 返工 → 重新提交
Blocked → 等待 → 解除后继续
```

### 时间要求

- 审查请求必须明确标注优先级
- P0/P1 任务优先审查
- 审查结论必须明确、可执行
- 拒绝必须附带原因

---

## 5. Claude Code 在 Review 中的角色

### Claude Code 负责
- 按规范提交产出（含完整的任务完成报告）
- 响应审查意见进行修改
- 在 Approved with Changes 后自行验证修改

### Claude Code 不负责
- 不得自行审查自己的产出
- 不得代替 Founder Office 做审查决策
- 不得在 Rejected 后自行决定重新提交
- 不得在 Blocked 后自行解除阻塞

---

## 6. Review 检查清单

提交 Review 前，Claude Code 必须自查（Self-Check）：

- [ ] 任务完成报告是否完整
- [ ] 修改文件是否完整列出
- [ ] 未修改内容是否诚实说明
- [ ] 风险是否如实报告
- [ ] `git status` 是否已提供
- [ ] 是否在任务范围内
- [ ] 是否超出 MVP 范围
- [ ] 是否违反已批准 ADR
- [ ] 是否包含禁止提交的内容（见 `COMMIT_RULES.md`）

---

## 7. 绝对禁止

1. 不得跳过 Review 直接进入下一阶段
2. 不得自行批准自己的产出
3. 不得在 Rejected 后不经修改重新提交
4. 不得在 Blocked 后自行解除阻塞继续工作
5. 不得在审查中隐瞒问题
6. 不得在 Approved with Changes 后忽略修改要求
7. 不得未经 Founder Office 终审进入生产发布

---

## Reference

- `BOOT_PROTOCOL.md` — 启动协议
- `CLAUDE_PROTOCOL.md` — Claude Code 职责边界
- `TASK_RULES.md` — 任务执行规则
- `COMMIT_RULES.md` — Git 提交规则
- `docs/01-GOVERNANCE.md` — 完整治理规则
