# RFC-001 Alignment Report

Document ID : RFC-001-ALIGNMENT
Title       : RFC-001 Final Alignment Report
Version     : 1.0
Status      : Draft
Owner       : Architecture Office
Created     : 2026-06-28
Depends On  : RFC-001-DOMAIN-MODEL.md, ARCH-000-CORE-ARCHITECTURE-REVIEW.md
Purpose     : 将 RFC-001 与 ARCH-000 完全对齐，使 RFC-001 成为唯一领域模型事实来源

---

## 1. Scope

本报告对比两份文档：

| Document | Role |
|----------|------|
| RFC-001-DOMAIN-MODEL.md | 领域模型定义（14个核心对象） |
| ARCH-000-CORE-ARCHITECTURE-REVIEW.md | 核心架构审查（引用 RFC-001） |

对比维度：

1. Domain Object 一致性
2. 重复对象
3. 命名冲突
4. 职责重叠
5. 缺失对象
6. HQ / Store / Customer / Health Identity / AI 边界一致性

---

## 2. Differences

### 2.1 Domain Object List — 一致

RFC-001 定义 14 个核心领域对象。ARCH-000 §2.3 显式声明 "来源：RFC-001 §2, 共14个"，逐项列出相同对象。

| # | RFC-001 Object | ARCH-000 Name | Module | Verdict |
|---|---------------|---------------|--------|---------|
| 1 | Health Identity | Health Identity (健康元) | Platform | ✅ 一致 |
| 2 | Health Profile | Health Profile (健康档案) | Shared | ✅ 一致 |
| 3 | Health Timeline | Health Timeline (健康时间线) | Shared | ✅ 一致 |
| 4 | Health Assessment | Health Assessment (健康评估) | Shared | ✅ 一致 |
| 5 | Health Plan | Health Plan (健康计划) | Shared | ✅ 一致 |
| 6 | Service Session | Service Session (服务记录) | Shared | ✅ 一致 |
| 7 | Store | Store (门店) | Store Local | ✅ 一致 |
| 8 | Staff | Staff (员工) | Store Local | ✅ 一致 |
| 9 | Device | Device (设备) | Store Local | ✅ 一致 |
| 10 | AI Conversation | AI Conversation (AI 对话) | Shared | ✅ 一致 |
| 11 | Upload Asset | Upload Asset (上传资产) | Shared | ✅ 一致 |
| 12 | Member Entitlement | Member Entitlement (会员权益) | Store Local | ✅ 一致 |
| 13 | Knowledge Base | Knowledge Base (知识库) | Platform | ✅ 一致 |
| 14 | AI Capability | AI Capability (AI 能力) | Platform | ✅ 一致 |

**结论：14 个核心领域对象完全一致。无缺失、无多余。**

---

### 2.2 ARCH-000 引入的额外概念实体

ARCH-000 在概念层（§2.1）和边界图（§4.1）中引入了 RFC-001 **未定义**的概念：

| # | ARCH-000 Concept | 出现位置 | RFC-001 对应 | 差异性质 |
|---|-----------------|----------|-------------|---------|
| E1 | Follow-Up Task | §2.1 Follow-Up Layer | Health Plan.follow_up_schedule（子字段） | ARCH-000 将子概念提升为层概念 |
| E2 | Event | §2.1 Event & Task Layer | Health Timeline.entries（子对象） | ARCH-000 将 Timeline Entry 称为 Event |
| E3 | Timeline Entry | §2.1 Event & Task Layer | Health Timeline.entries（子对象） | 命名一致，但在 RFC-001 中不是独立对象 |
| E4 | Project Knowledge | §2.1 Knowledge Base Layer | 无（RFC-001 的 Knowledge Base 是产品知识） | 概念区分，不冲突 |
| E5 | AI Health Companion | §4.1 Customer Boundary, §5.1 | 无直接对应（RFC-001 有 AI Conversation + AI Capability） | ARCH-000 新增参与者角色 |
| E6 | Customer App | §7.3 M1 Diagram | 无（RFC-001 Non-Goal N3: UI） | ARCH-000 在部署层引入 UI 概念 |
| E7 | Store Workbench | §7.3 M1 Diagram | 无（RFC-001 Non-Goal N3: UI） | ARCH-000 在部署层引入 UI 概念 |

**结论：ARCH-000 未在领域对象层面新增对象，但在概念层、参与者和部署图中使用了 RFC-001 未定义的术语。**

---

### 2.3 模块归属 — 一致

| Object | RFC-001 §5 Module | ARCH-000 §2.3 Module | Verdict |
|--------|-------------------|---------------------|---------|
| Health Identity | Platform | Platform | ✅ |
| Knowledge Base | Platform | Platform | ✅ |
| AI Capability | Platform | Platform | ✅ |
| Store | Store Local | Store Local | ✅ |
| Staff | Store Local | Store Local | ✅ |
| Device | Store Local | Store Local | ✅ |
| Member Entitlement | Store Local | Store Local | ✅ |
| Health Profile | Shared | Shared | ✅ |
| Health Timeline | Shared | Shared | ✅ |
| Health Assessment | Shared | Shared | ✅ |
| Health Plan | Shared | Shared | ✅ |
| Service Session | Shared | Shared | ✅ |
| AI Conversation | Shared | Shared | ✅ |
| Upload Asset | Shared | Shared | ✅ |

**结论：14 个对象的模块归属完全一致。**

---

### 2.4 数据所有权 — 差异

这是两份文档之间最显著的差异。

**RFC-001 Data Ownership：**

RFC-001 未在文档中显式定义所有权边界。RFC-001 通过以下方式隐含所有权：
- Health Identity.data_ownership_tag = `customer`（§2.1）
- Module Boundary 将对象分为 Platform / Store Local / Shared（§5）
- Domain Rules §4.1：Health Identity 默认 data_ownership_tag 为 customer

**ARCH-000 Data Ownership（§5.3）：**

```
Customer 拥有：Health Identity, Health Profile, Health Timeline, AI Conversation
Store 拥有：Staff, Device, Service Session, Member Entitlement
HQ/Platform 拥有：Health Identity 基础设施, Knowledge Base, AI Capability, 跨店协调, 全局配置
```

**差异分析：**

| Object | ARCH-000 所有权 | RFC-001 模块 | 冲突 |
|--------|----------------|-------------|------|
| Health Identity | Customer 拥有 + Platform 基础设施 | Platform | ⚠️ 双重归属，需明确 |
| Health Profile | Customer 拥有 | Shared | ⚠️ 所有权 vs 模块归属不一致 |
| Health Timeline | Customer 拥有 | Shared | ⚠️ 所有权 vs 模块归属不一致 |
| AI Conversation | Customer 拥有 | Shared | ⚠️ 所有权 vs 模块归属不一致 |
| Service Session | Store 拥有 | Shared | ⚠️ 所有权 vs 模块归属不一致 |
| Member Entitlement | Store 拥有 | Store Local | ✅ 一致 |
| Staff | Store 拥有 | Store Local | ✅ 一致 |
| Device | Store 拥有 | Store Local | ✅ 一致 |
| Knowledge Base | Platform 拥有 | Platform | ✅ 一致 |
| AI Capability | Platform 拥有 | Platform | ✅ 一致 |
| Health Assessment | 未列出 | Shared | ⚠️ 缺失 |
| Health Plan | 未列出 | Shared | ⚠️ 缺失 |
| Upload Asset | 未列出 | Shared | ⚠️ 缺失 |

**结论：ARCH-000 §5.3 Data Ownership Model 与 RFC-001 §5 Module Boundary 存在结构性不一致。**

根源：RFC-001 的 Module Boundary 关注的是部署和管理边界；ARCH-000 的 Data Ownership 关注的是法律和伦理意义上的数据归属。两个维度不同但使用了相似术语（"拥有"），导致混淆。

---

### 2.5 ARCH-000 §4.1 Boundary Map 的呈现问题

ARCH-000 §4.1 的 Boundary Map 将同一组 Shared 对象（Health Profile、Health Timeline、Health Assessment、Health Plan、Service Session、AI Conversation、Upload Asset）同时放置在：

1. Customer Boundary 框内
2. Store Boundary 框内（部分）
3. Shared Domain 框内

这种三重出现不是语义错误（ARCH-000 意图表示"参与者可访问的对象"），但**呈现方式容易误解为对象被复制或归属冲突**。

RFC-001 §5 的 Module Boundary 图更为清晰——每个对象只出现一次。

---

### 2.6 ARCH-000 §2.1 架构分层与 RFC-001 §5 模块边界的维度差异

| 维度 | ARCH-000 §2.1 Layers | RFC-001 §5 Modules |
|------|---------------------|-------------------|
| 组织原则 | 概念层（按功能关注点） | 部署模块（按物理/管理边界） |
| 对象出现 | 可跨层出现 | 每个对象归属唯一模块 |
| 目的 | 帮助理解系统结构 | 指导实现和接口设计 |

这是两种合理的分层方式，但 ARCH-000 未明确说明其 §2.1 Layers 与 RFC-001 §5 Modules 的关系。建议在 ARCH-000 中增加一个映射表。

---

### 2.7 Health Timeline 聚合方式 — 未解决

两份文档都标记了 Health Timeline 的聚合方式为开放问题：

- RFC-001 §7 Q1：Health Timeline 是独立聚合还是 Health Identity 下的值对象？
- ARCH-000 §8 Q1：同一问题，引用 RFC-001

**当前两份文档的默认设计都是"独立聚合"（1:1 关系），但明确标记为待确认。**

**结论：一致，但需要 Founder/Architecture Office 裁决。**

---

### 2.8 AI Companion vs AI Conversation — 概念差异

| 文档 | 术语 | 定义 |
|------|------|------|
| RFC-001 | AI Conversation | 领域对象：一次结构化人机交互记录 |
| RFC-001 | AI Capability | 领域对象：AI 可执行的系统能力单元 |
| ARCH-000 | AI Health Companion | 参与者角色：客户面对的 AI 助手 |

ARCH-000 的 AI Health Companion 是 BP-001 §9 定义的参与者角色，不是领域对象。它与 RFC-001 的 AI Conversation + AI Capability 之间存在映射关系：

```
AI Health Companion (参与者角色)
  ├── 通过 AI Conversation (领域对象) 记录交互
  └── 通过 AI Capability (领域对象) 执行任务
```

**结论：不是冲突，但 ARCH-000 未显式说明 AI Health Companion 与 RFC-001 领域对象的映射关系。**

---

## 3. Recommended Changes

### 3.1 修改 ARCH-000（推荐，不影响 RFC-001）

| # | Change | Section | Reason |
|---|--------|---------|--------|
| C1 | 在 Data Ownership Model 中明确区分 "伦理所有权" 与 "技术模块归属" | §5.3 | 消除与 RFC-001 Module Boundary 的冲突 |
| C2 | 将 Boundary Map 改为单次出现：每个对象只出现在其归属位置，用连线表示访问关系 | §4.1 | 避免 Shared 对象三处出现的混淆 |
| C3 | 增加 "Layers ↔ Modules 映射表" | §2 | 明确概念层与部署模块的关系 |
| C4 | 显式说明 AI Health Companion 与 AI Conversation + AI Capability 的映射 | §5.1 | 消除参与者角色与领域对象的混淆 |
| C5 | 将 Follow-Up Task、Event、Timeline Entry 标注为"概念层术语"而非新领域对象 | §2.1 | 避免误读为新对象定义 |
| C6 | 在 Open Questions Q1 中引用 RFC-001 Q1 的当前默认设计 | §8 | 保持引用一致 |
| C7 | Data Ownership 补充缺失对象：Health Assessment、Health Plan、Upload Asset | §5.3 | 完整性 |

### 3.2 修改 RFC-001（建议性，不强制）

| # | Change | Section | Reason |
|---|--------|---------|--------|
| C8 | 增加显式 "Data Ownership" 章节，定义每个对象的数据伦理归属 | 新增 §4.8 | ARCH-000 提出了 RFC-001 缺失的维度 |
| C9 | 将 Health Timeline Q1 的默认设计从"独立聚合"确认为正式决策 | §7 Q1 | 消除待定状态（或保留但注明推荐方向） |

### 3.3 不采纳的修改

| # | 建议 | 原因 |
|---|------|------|
| — | 将 AI Health Companion 加入 RFC-001 领域对象 | AI Companion 是 BP-001 定义的参与者角色，不是领域对象 |
| — | 将 Follow-Up Task 提升为独立领域对象 | MVP 阶段 Health Plan.follow_up_schedule 足够；避免对象膨胀 |
| — | 将 Event 提升为独立领域对象 | Health Timeline Entry 已覆盖此职责 |

---

## 4. Final Domain Object List

以下为对齐后的最终领域对象列表，可作为 Single Source of Truth。

| # | Object (EN) | Object (CN) | Module | Ownership | Status |
|---|------------|-------------|--------|-----------|--------|
| 1 | Health Identity | 健康元 | Platform | Customer（伦理）/ Platform（基础设施） | Confirmed |
| 2 | Health Profile | 健康档案 | Shared | Customer | Confirmed |
| 3 | Health Timeline | 健康时间线 | Shared | Customer | Confirmed |
| 4 | Health Assessment | 健康评估 | Shared | Customer（需 Staff review） | Confirmed |
| 5 | Health Plan | 健康计划 | Shared | Customer（Staff/AI 协作制定） | Confirmed |
| 6 | Service Session | 服务记录 | Shared | Customer + Store（共同事实） | Confirmed |
| 7 | Store | 门店 | Store Local | Store / Platform（配置） | Confirmed |
| 8 | Staff | 门店员工 | Store Local | Store | Confirmed |
| 9 | Device | 健康设备 | Store Local | Store | Confirmed |
| 10 | AI Conversation | AI 对话 | Shared | Customer | Confirmed |
| 11 | Upload Asset | 上传资产 | Shared | Customer | Confirmed |
| 12 | Member Entitlement | 会员权益 | Store Local | Store（发放）/ Customer（持有） | Confirmed |
| 13 | Knowledge Base | 知识库 | Platform | Platform | Confirmed |
| 14 | AI Capability | AI 能力 | Platform | Platform | Confirmed |

**模块归属规则：**
- **Platform**：总部管理的全局能力，单一实例
- **Store Local**：门店管理的本地数据，每店独立
- **Shared**：跨边界共享对象，通过接口访问，不直接暴露数据库

**所有权规则（新增，待 Founder 确认）：**
- **Customer 伦理拥有**：Health Identity（及其下所有关联数据）
- **Store 业务持有**：Store 本地数据（Staff, Device）和门店侧业务记录（Member Entitlement 发放）
- **Platform 基础设施**：Identity 服务、Knowledge Base、AI Capability
- **共同事实**：Service Session 是 Customer 和 Store 都承认的服务事实

---

## 5. Boundary Alignment Map

对齐后的边界关系：

```
┌─────────────────────────────────────────────────────────────┐
│                     Authorization (贯穿)                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Platform (Cloud)          Store Local          Customer     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────┐ │
│  │ Health Identity  │  │ Store            │  │           │ │
│  │   (基础设施)       │  │ Staff            │  │  AI Health │ │
│  │ Knowledge Base   │  │ Device           │  │  Companion │ │
│  │ AI Capability    │  │ Member           │  │  (参与者)   │ │
│  │                  │  │   Entitlement    │  │           │ │
│  └────────┬─────────┘  └────────┬─────────┘  └─────┬─────┘ │
│           │                     │                   │       │
│           └─────────────────────┼───────────────────┘       │
│                                 │                            │
│                    ┌────────────┴────────────┐              │
│                    │   Shared Domain         │              │
│                    │   (通过接口访问)          │              │
│                    │                         │              │
│                    │  Health Profile         │              │
│                    │  Health Timeline        │              │
│                    │  Health Assessment      │              │
│                    │  Health Plan            │              │
│                    │  Service Session        │              │
│                    │  AI Conversation        │              │
│                    │  Upload Asset           │              │
│                    └─────────────────────────┘              │
│                                                             │
└─────────────────────────────────────────────────────────────┘

连线规则：
  Customer ──owns──→ Health Identity
  Customer ──accesses──→ Shared Domain (via AI Companion)
  Store ──accesses──→ Shared Domain (via Store Workbench, 经授权)
  Platform ──manages──→ Health Identity infrastructure, Knowledge Base, AI Capability
  AI Capability ──invoked by──→ AI Conversation
  AI Conversation ──references──→ Knowledge Base
```

---

## 6. Open Issues

以下问题在当前对齐中尚未解决，需要裁决。最多 5 项。

| # | Issue | Context | Impact | Suggested Resolution |
|---|-------|---------|--------|---------------------|
| O1 | Data Ownership 模型是否作为 RFC-001 的正式章节？ | ARCH-000 §5.3 定义了所有权但 RFC-001 缺失此维度 | 影响后续合规和授权设计 | 建议：RFC-001 新增 §4.8 Data Ownership，参考本报告 §4 所有权规则 |
| O2 | Health Timeline 是独立聚合还是值对象？ | RFC-001 Q1 / ARCH-000 Q1；待裁决 | 影响 RFC-002 数据模型设计 | 建议：确认当前默认设计（独立聚合，1:1 关系），除非 Founder 有不同意见 |
| O3 | Shared Domain 的 "Shared" 一词是否准确？ | Shared 对象既有 Customer 侧又有 Store 侧，可能误导为"共享数据库" | 影响架构沟通 | 建议：讨论是否将 Shared 改为 "Health Domain" 或 "Core Domain" |
| O4 | ARCH-000 的 Layers (§2.1) 与 RFC-001 的 Modules (§5) 的关系是否需要正式定义？ | 两个维度服务于不同目的但都在使用 | 影响后续文档引用 | 建议：ARCH-000 增加 Layers↔Modules 映射表，RFC-001 不修改 |
| O5 | Member Entitlement 的模块归属是否需要重新评估？ | 当前归属 Store Local，但权益可能跨店使用 | 影响多店场景 | 建议：MVP 单店阶段保持 Store Local；多店时通过后续 RFC 升迁 |

---

## 7. Founder Decisions Required

以下问题必须由 Founder 裁决。建议在 ARCH-000 批准前或同时完成。

| # | Decision | Options | Recommendation |
|---|----------|---------|----------------|
| D1 | 是否批准本报告建议的 Final Domain Object List（§4）为 Single Source of Truth？ | Approve / Revise / Reject | **Approve** — 14 个对象无实质争议 |
| D2 | Data Ownership 模型是否进入 RFC-001？ | Yes（新增 §4.8）/ No（保留在 ARCH-000）/ Separate RFC | **Yes** — Data Ownership 是 Constitution §8 的核心要求，应放在领域模型定义中 |
| D3 | Health Timeline 聚合方式？ | 独立聚合 / Health Identity 下的值对象 | **独立聚合** — 与当前设计一致；Time Timeline 有自己的 ID 和独立追加语义 |
| D4 | Shared Domain 命名是否改为 Health Domain 或 Core Domain？ | Keep "Shared" / Rename to "Health Domain" / Rename to "Core Domain" | **Health Domain** — 避免 "Shared" 暗示共享数据库 |
| D5 | 本报告建议的 ARCH-000 修改（C1–C7）是否批准执行？ | Approve all / Approve selected / Reject | **Approve C1–C7** — 消除不一致，不改变架构方向 |
| D6 | ARCH-000 M1 Architecture Review 是否批准？ | Approve / Approve with conditions / Return for revision | **Approve with conditions** — 完成 C1–C7 修改后批准 |

---

## 8. Summary

### Alignment Score

| Dimension | Score | Detail |
|-----------|-------|--------|
| Domain Object List | 🟢 100% | 14 对象完全一致 |
| Object Naming | 🟢 100% | 无命名冲突 |
| Module Assignment | 🟢 100% | Platform/Store Local/Shared 一致 |
| Data Ownership | 🟡 60% | 严重不一致；需通过本报告 §4 对齐 |
| Boundary Presentation | 🟡 50% | ARCH-000 Boundary Map 呈现混淆；需修改 |
| Extra Concepts | 🟢 90% | ARCH-000 额外概念是合理的参与者角色/UI 概念，非领域对象冲突 |
| Open Questions | 🟢 100% | Timeline 聚合问题在两个文档中一致标记 |

### Recommendation

1. **RFC-001 无需修改**（或仅执行 C8 增加 Data Ownership 章节）
2. **ARCH-000 执行 C1–C7 修改**后批准
3. **Founder 裁决 D1–D6**
4. 对齐完成后，**RFC-001 成为唯一领域模型 Single Source of Truth**

---

## 9. End of Document

RFC-001-ALIGNMENT-REPORT.md identifies the discrepancies between RFC-001 and ARCH-000, recommends specific changes to align them, and defines the Final Domain Object List for Founder approval.

After alignment, RFC-001 shall be the single source of truth for the Health One domain model.
