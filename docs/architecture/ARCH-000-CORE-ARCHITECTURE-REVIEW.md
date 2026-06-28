# ARCH-000 Health One Core Architecture Review

Document ID : ARCH-000
Title       : Health One Core Architecture Review
Version     : 1.0
Status      : Approved
Owner       : Architecture Office
Approver    : Founder
Approved    : 2026-06-28
Created     : 2026-06-28
Depends On  : Constitution v1.0, Governance v1.0, BP-001, BP-004, ADR-001, RFC-001, LEGACY-SERVER-RUNTIME, FD-005
Related     : RFC-002 (Data Model), RFC-005 (Database Design), ADR-001-legacy-migration

---

## Founder Approval

Approved by Founder.

Date: 2026-06-28.

This document is now the governing architecture baseline for Health One M1.

All subsequent RFC, ADR, data model, database design, and code development must comply with this architecture.

---

## 1. Purpose

本文档是对 Health One 当前核心架构的全面审查。

审查范围：
- 当前已定义的架构状态
- Legacy 资产及其复用策略
- 核心领域边界
- 关键实体关系
- 架构风险
- M1 推荐架构
- 开放问题

审查不包括：
- 数据库表设计
- API 端点定义
- 技术栈选型
- 代码实现
- 部署方案

---

## 2. Current Architecture

### 2.1 Architecture Layering

当前文档定义的架构分为以下概念层（来源：ADR-001 §17、Constitution §7）。

> **注意：概念层术语 vs 领域对象。** 以下分层中出现的 "Follow-Up Task"、"Event"、"Timeline Entry"、"Project Knowledge" 均为概念层术语，不是新的领域对象：
> - "Follow-Up Task" 对应 RFC-001 的 Health Plan.follow_up_schedule（子字段）
> - "Event" 和 "Timeline Entry" 对应 RFC-001 的 Health Timeline.entries（子对象）
> - "Project Knowledge" 是项目治理知识（区别于 RFC-001 的 Knowledge Base 产品知识库）
>
> 概念层用于理解系统功能关注点；领域对象定义在 RFC-001 §2。两者服务于不同维度，详见 §2.5 Layers↔Modules 映射表。

```
┌──────────────────────────────────────────┐
│          Authorization Layer              │
│          (贯穿所有层)                       │
├──────────────────────────────────────────┤
│          AI Assistance Layer              │
│   (AI Conversation, AI Capability)        │
├──────────────────────────────────────────┤
│          Health Memory Layer              │
│   (Health Timeline, Health Profile)       │
├──────────────────────────────────────────┤
│          Store Service Layer              │
│   (Service Session, Store, Staff, Device) │
├──────────────────────────────────────────┤
│          Identity Layer                   │
│   (Health Identity / 健康元)              │
├──────────────────────────────────────────┤
│          Knowledge Base Layer             │
│   (Knowledge Base, Project Knowledge)     │
├──────────────────────────────────────────┤
│          Follow-Up Layer                  │
│   (Health Plan, Follow-Up Task)           │
├──────────────────────────────────────────┤
│          Event & Task Layer               │
│   (Event, Timeline Entry)                 │
└──────────────────────────────────────────┘
```

### 2.2 Module Boundary (来源：RFC-001 §5)

```
┌── Platform (Cloud / 总部) ──┐
│  Health Identity             │
│  Knowledge Base              │
│  AI Capability               │
└──────────────────────────────┘
          │
          │ 接口通信
          │
┌── Store Local (门店本地) ──┐
│  Store                      │
│  Staff                      │
│  Device                     │
│  Member Entitlement         │
└──────────────────────────────┘
          │
          │ 接口通信
          │
┌── Shared (共享领域) ────────┐
│  Health Profile             │
│  Health Timeline            │
│  Health Assessment          │
│  Health Plan                │
│  Service Session            │
│  AI Conversation            │
│  Upload Asset               │
└──────────────────────────────┘
```

### 2.3 Core Domain Objects (来源：RFC-001 §2, 共14个)

| # | Object | Module | Role |
|---|--------|--------|------|
| 1 | Health Identity (健康元) | Platform | 聚合根，唯一核心 |
| 2 | Health Profile (健康档案) | Shared | 结构化健康快照 |
| 3 | Health Timeline (健康时间线) | Shared | 只追加事件序列 |
| 4 | Health Assessment (健康评估) | Shared | 阶段性分析 |
| 5 | Health Plan (健康计划) | Shared | 行动载体 |
| 6 | Service Session (服务记录) | Shared | 真实服务事实 |
| 7 | Store (门店) | Store Local | 物理服务节点 |
| 8 | Staff (员工) | Store Local | 人机协同角色 |
| 9 | Device (设备) | Store Local | 服务基础设施 |
| 10 | AI Conversation (AI 对话) | Shared | 结构化 AI 交互 |
| 11 | Upload Asset (上传资产) | Shared | 非结构化数据 |
| 12 | Member Entitlement (会员权益) | Store Local | 服务权益记录 |
| 13 | Knowledge Base (知识库) | Platform | 结构化知识 |
| 14 | AI Capability (AI 能力) | Platform | AI 能力单元 |

### 2.4 Aggregation Root: Health Identity

```
Health Identity (健康元) ─── 聚合根
  │
  ├── Health Profile (1:1)
  ├── Health Timeline (1:1)
  ├── Health Assessment (1:N)
  ├── Health Plan (1:N)
  ├── Service Session (1:N)
  ├── AI Conversation (1:N)
  ├── Upload Asset (1:N)
  └── Member Entitlement (1:N)
```

所有健康数据最终围绕 Health Identity 组织。Health Identity 不是账号、不是客户编号，而是一个人的长期健康数字身份。

### 2.5 Layers ↔ Modules 映射表

概念层（§2.1）与 RFC-001 部署模块（RFC-001 §5）是两个不同维度，映射关系如下：

| 概念层 (ARCH-000 §2.1) | 对应 RFC-001 模块 | 涉及的领域对象 |
|------------------------|-------------------|---------------|
| Identity Layer | Platform | Health Identity |
| Health Memory Layer | Shared | Health Profile, Health Timeline |
| Store Service Layer | Store Local + Shared | Store, Staff, Device, Service Session |
| AI Assistance Layer | Platform + Shared | AI Capability, AI Conversation |
| Knowledge Base Layer | Platform | Knowledge Base (+ Project Knowledge 非领域对象) |
| Follow-Up Layer | Shared | Health Plan (follow_up_schedule 子字段) |
| Event & Task Layer | Shared | Health Timeline (entries 子对象) |
| Authorization Layer | 贯穿所有模块 | 跨切面，不作为独立领域对象 |

**关键规则：**
- 概念层用于理解系统功能关注点；一个领域对象可以出现在多个概念层
- RFC-001 模块用于指导实现和部署；每个领域对象归属唯一模块
- 概念层术语（Follow-Up Task、Event、Timeline Entry）不是独立领域对象，不进入 RFC-001

### 2.6 First Value Loop (来源：PROJECT-MEMORY §10)

```
Customer Entry
  → Customer Lookup or Creation
    → Activation or Update
      → Health Concern Intake
        → Store Service
          → Service Record
            → Customer Feedback
              → AI Summary
                → Follow-Up Task
                  → Customer Return
```

这是MVP必须完成的闭环。架构设计必须支持这一闭环的每一个步骤。

---

## 3. Legacy Reuse Strategy

### 3.1 Legacy Assets (来源：LEGACY-SERVER-RUNTIME-REPORT)

当前 Legacy 生产环境：

```
/www/server/xixi/
├── hq/           → xixi-hq:8001        (identity_sync)
├── admin/        → xixi-admin:8002      (admin_service)
├── stores/
│   ├── store_001 → xixi-store-001:8010  (store_service)
│   ├── store_002 → xixi-store-002:8011  (store_service)
│   └── store_003 → xixi-store-003:8012  (store_service)
└── nginx         → :443/:8080           (reverse proxy)
```

### 3.2 What Legacy Tells Us (可复用的事实，非代码)

| # | Legacy 事实 | Health One 意义 |
|---|------------|----------------|
| 1 | 多门店多实例部署（每个门店独立服务） | 验证了 Local First 方向 |
| 2 | 总部与门店服务分离（hq ↔ store） | 验证了 HQ/Store 分离模式 |
| 3 | identity_sync 作为总部服务 | 健康元需要总部级 Identity 服务 |
| 4 | Nginx 反向代理统一入口 | v2 保留此模式 |
| 5 | 每个门店独立端口 | v2 应规范化为 Store OS 模式 |

### 3.3 What Legacy Must NOT Give Us (禁止事项)

| # | 禁止 | 原因 |
|---|------|------|
| 1 | 直接复制 Legacy 代码 | FD-005 Legacy Freeze；代码质量未知 |
| 2 | 直接复制运行时配置 | SEC-001/002：含密钥和敏感信息 |
| 3 | 假设 3号工程 == 服务器运行时 | 两者可能已分叉 |
| 4 | 在 Legacy 仓库上继续开发 | FD-005：不再作为开发仓库 |
| 5 | 无审查迁移 Legacy 数据 | 需 RFC Legacy Migration |

### 3.4 Recommended Reuse Strategy

```
Legacy 资产用途：

1. 架构模式参考
   - 多门店多实例 → v2 Store OS
   - HQ/Store 分离 → v2 Platform/Store 分离
   - identity_sync → v2 Health Identity Service

2. 业务逻辑参考
   - 门店服务流程
   - 客户管理流程
   - 从 runtime 提取业务规则（逐模块审查）

3. 数据迁移参考
   - 存量客户数据结构
   - 服务记录格式
   - 迁移时需 RFC

4. 不参考的内容
   - 代码实现
   - 安全配置
   - 数据库 schema 直接复制
   - 认证机制
```

---

## 4. Core Domain Boundary

### 4.1 Boundary Map

> **规则：每个领域对象只出现一次，位于其 RFC-001 模块归属位置。**
> 连线表示参与者对领域对象的访问/管理关系（非所有权）。

```
┌─────────────────────────────────────────────────────────────────┐
│                     Authorization (贯穿所有边界)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌── Platform (Cloud / 总部) ──────────────────────────────┐    │
│  │                                                         │    │
│  │  ■ Health Identity (基础设施)                            │    │
│  │  ■ Knowledge Base                                       │    │
│  │  ■ AI Capability                                        │    │
│  │                                                         │    │
│  └──────────┬────────────────────────────────┬─────────────┘    │
│             │ manages                         │ manages          │
│             ▼                                ▼                  │
│  ┌── Store Local (门店本地) ──┐  ┌── Shared Domain ──────────┐  │
│  │                           │  │                            │  │
│  │  ■ Store                  │  │  ■ Health Profile          │  │
│  │  ■ Staff                  │  │  ■ Health Timeline         │  │
│  │  ■ Device                 │  │  ■ Health Assessment       │  │
│  │  ■ Member Entitlement     │  │  ■ Health Plan             │  │
│  │                           │  │  ■ Service Session         │  │
│  │  access ──────────────────┼──▶  ■ AI Conversation         │  │
│  │  (via Store Workbench)    │  │  ■ Upload Asset            │  │
│  │                           │  │                            │  │
│  └───────────────────────────┘  └────────────────────────────┘  │
│           ▲                              ▲                       │
│           │ accesses                     │ accesses              │
│           │ (经授权)                      │ (via AI Companion)    │
│           │                              │                       │
│  ┌────────┴──────────┐          ┌───────┴──────────┐            │
│  │  Store Staff      │          │    Customer      │            │
│  │  (参与者)          │          │    (参与者)        │            │
│  │                   │          │                  │            │
│  │  interacts with → │          │  owns ───────────┼── Health   │
│  │  Shared objects   │          │  Identity        │            │
│  └───────────────────┘          │  (伦理所有权)      │            │
│                                  └──────────────────┘            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

参与者说明：
  - Customer：Health Identity 的伦理所有者；通过 AI Health Companion 访问 Shared Domain
  - Store Staff：通过 Store Workbench 访问 Shared Domain（经授权）
  - Platform：管理 Identity 基础设施、Knowledge Base、AI Capability
  - AI Health Companion：参与者角色（非领域对象），通过 AI Conversation + AI Capability 实现
  - Store Workbench：门店工作台（非领域对象），UI 概念，参见 §7.3

对象归属说明：
  - 每个领域对象只出现在其 RFC-001 模块归属位置
  - Platform 模块：Health Identity, Knowledge Base, AI Capability
  - Store Local 模块：Store, Staff, Device, Member Entitlement
  - Shared 模块：Health Profile, Health Timeline, Health Assessment, Health Plan,
                Service Session, AI Conversation, Upload Asset
```

### 4.2 Boundary Rules

| 规则 | 内容 |
|------|------|
| B1 | Customer 拥有 Health Identity；平台提供 Identity 基础设施 |
| B2 | Store 拥有本地业务数据 (Store, Staff, Device)；Platform 不直接操作 |
| B3 | Platform 管理全局能力 (Identity, Knowledge, AI Capability) |
| B4 | Shared Domain 对象跨边界访问，通过接口而非直接数据库操作 |
| B5 | AI 不直接操作任何数据库；AI 通过 AI Capability 调用系统能力 |
| B6 | 所有边界穿越必须经过授权检查 |

---

## 5. HQ / Store / Customer / AI / Health Identity 关系

### 5.1 Five-Party Relationship Model

> **AI Health Companion 说明。** AI Health Companion 是 BP-001 §9 定义的参与者角色（客户面对的 AI 助手），不是 RFC-001 的领域对象。其功能映射到 RFC-001 领域对象如下：
> ```
> AI Health Companion (参与者角色)
>   ├── AI Conversation (领域对象) — 记录交互
>   └── AI Capability (领域对象) — 执行任务
> ```
> AI Health Companion 通过 AI Capability 调用系统能力，通过 AI Conversation 记录交互历史并写入 Health Timeline。它不直接操作任何数据库。

```
                        ┌──────────────────┐
                        │      HQ          │
                        │   (Platform)     │
                        │                  │
                        │  • Identity 服务  │
                        │  • Knowledge Base │
                        │  • AI Capability  │
                        │  • 全局配置        │
                        │  • 跨店协调        │
                        └───┬──────────┬───┘
                            │          │
              提供 Identity │          │ 提供 AI 能力
              知识同步        │          │ 配置同步
                            │          │
              ┌─────────────┼──────────┼─────────────┐
              │             │          │             │
              ▼             ▼          ▼             ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │ Store A  │  │ Store B  │  │ Store C  │
        │ (门店)    │  │ (门店)    │  │ (门店)    │
        │          │  │          │  │          │
        │ • Staff  │  │ • Staff  │  │ • Staff  │
        │ • Device │  │ • Device │  │ • Device │
        │ • 本地数据 │  │ • 本地数据 │  │ • 本地数据 │
        └────┬─────┘  └────┬─────┘  └────┬─────┘
             │             │             │
             │  提供服务    │  提供服务    │  提供服务
             │  记录反馈    │  记录反馈    │  记录反馈
             │             │             │
             ▼             ▼             ▼
        ┌──────────────────────────────────────┐
        │            Customer                  │
        │                                      │
        │  ┌────────────────────────────┐      │
        │  │     Health Identity        │      │
        │  │        (健康元)             │      │
        │  │                            │      │
        │  │  • 健康档案 (Profile)       │      │
        │  │  • 健康时间线 (Timeline)    │      │
        │  │  • 健康计划 (Plan)          │      │
        │  │  • 服务历史 (Sessions)      │      │
        │  │  • AI 对话 (Conversations)  │      │
        │  │  • 上传资产 (Assets)        │      │
        │  │  • 权益记录 (Entitlements)  │      │
        │  └────────────────────────────┘      │
        │                                      │
        │  ┌────────────────────────────┐      │
        │  │    AI Health Companion     │      │
        │  │                            │      │
        │  │  • 解读健康状态             │      │
        │  │  • 提供健康建议             │      │
        │  │  • 随访提醒                 │      │
        │  │  • 知识问答                 │      │
        │  └────────────────────────────┘      │
        └──────────────────────────────────────┘
```

### 5.2 Relationship Rules

| # | 关系 | 规则 |
|---|------|------|
| R1 | Customer ↔ Health Identity | Customer 拥有 Health Identity；一对一 |
| R2 | Health Identity ↔ Store | 一个 Health Identity 有一个主归属 Store；Store 经授权访问 健康元 数据 |
| R3 | Health Identity ↔ AI | AI 通过 健康元 获取授权上下文；AI 更新 健康元 需经 Capability |
| R4 | Store ↔ HQ | Store 向 HQ 同步必要数据；HQ 向 Store 下发配置和知识 |
| R5 | AI ↔ HQ | AI 调用 HQ 管理的 AI Capability；不直接访问 Store 数据库 |
| R6 | Customer ↔ AI | Customer 首先面对 AI Companion；AI 再协调 Store 和 Platform 能力 |
| R7 | Staff ↔ AI | AI 辅助 Staff 理解客户、记录服务、生成随访建议 |

### 5.3 Data Ownership Model

数据所有权从三个维度定义：

| 维度 | 英文 | 含义 | 决定因素 |
|------|------|------|---------|
| Business Ownership | 业务所有权 | 数据在业务和法律上属于谁 | Constitution §8（数据属于用户） |
| Technical Ownership | 技术归属 | 数据的创建、更新由哪个模块负责 | RFC-001 §5 Module Boundary |
| Storage Ownership | 存储位置 | 数据的物理存储位置 | 部署架构（RFC-002 待定义） |

**三个维度互不冲突。** 一个对象可以由 Customer 业务拥有，同时由 Shared 模块技术管理，存储在 Platform DB。

#### 完整对象所有权矩阵（14个对象）

| # | Domain Object | Business Ownership | Technical Module | Storage (TBD) |
|---|--------------|-------------------|------------------|---------------|
| 1 | Health Identity | Customer（伦理）/ Platform（基础设施） | Platform | Platform DB |
| 2 | Health Profile | Customer | Shared | TBD |
| 3 | Health Timeline | Customer | Shared | TBD |
| 4 | Health Assessment | Customer（需 Staff review） | Shared | TBD |
| 5 | Health Plan | Customer（Staff/AI 协作制定） | Shared | TBD |
| 6 | Service Session | Customer + Store（共同事实） | Shared | TBD |
| 7 | Store | Store / Platform（配置） | Store Local | Store DB |
| 8 | Staff | Store | Store Local | Store DB |
| 9 | Device | Store | Store Local | Store DB |
| 10 | AI Conversation | Customer | Shared | TBD |
| 11 | Upload Asset | Customer | Shared | File Store |
| 12 | Member Entitlement | Store（发放）/ Customer（持有） | Store Local | Store DB |
| 13 | Knowledge Base | Platform | Platform | Platform DB |
| 14 | AI Capability | Platform | Platform | Platform DB |

#### 所有权与模块归属的关系

```
Business Ownership (业务所有权)
  → 决定谁对数据有最终控制权（访问授权、删除、导出）
  → 不决定数据存储在哪个数据库

Technical Module (技术归属，来源：RFC-001 §5)
  → 决定哪个模块负责数据的 CRUD 操作
  → 不改变业务所有权

Storage (存储位置)
  → 由 RFC-002 Data Model 和 ADR Infrastructure 定义
  → 当前 TBD 项将在 M1 内决定
```

关键原则：
- Business Ownership 与 Technical Module 是两个独立维度，使用不同术语避免混淆
- Shared 模块的对象不代表 "Shared Ownership"（共享所有权），仅代表 "Shared Access"（共享访问）
- 所有健康数据（Profile, Timeline, Assessment, Plan, Session, Conversation, Asset）的 Business Ownership 归 Customer
- Service Session 是共同事实：Customer 和 Store 都对服务事实有合法权益

---

## 6. Risks

### 6.1 Architecture Risks (架构层面)

| # | Risk | Severity | Mitigation |
|---|------|----------|------------|
| AR1 | 领域模型过度设计 | High | RFC-001 仅定义 MVP 必需的 14 个对象；已做 Non-Goals 声明 |
| AR2 | RFC-001 与 BP-004 (28对象) 不一致 | Medium | RFC-001 明确声明是对 BP-004 的精简重构 |
| AR3 | AI Capability 抽象层尚未验证 | High | M1 应先实现最小 Capability 集验证模式 |
| AR4 | Platform / Store 边界未在数据层定义 | Medium | 需 RFC-002 Data Model 明确定义同步策略 |
| AR5 | Health Timeline 设计过于理想化 | Medium | 不可变只追加时间线运维成本高；需评估替代方案 |

### 6.2 Legacy Risks (Legacy 相关)

| # | Risk | Severity | Mitigation |
|---|------|----------|------------|
| LR1 | 依赖 Legacy runtime 模式导致设计偏差 | Medium | 仅参考模式，不复制实现 |
| LR2 | 3号工程与服务器 runtime 分叉 | Medium | 以服务器 runtime 为准 |
| LR3 | Legacy 迁移 RFC 未完成 | High | ADR-001-legacy-migration 仍为 placeholder |
| LR4 | Legacy 数据质量未知 | Medium | 迁移前需数据审计 |

### 6.3 Process Risks (流程层面)

| # | Risk | Severity | Mitigation |
|---|------|----------|------------|
| PR1 | 在 MVP Planning 未关闭前开始编码 | High | 严格遵守 Phase D → REL-004 → Sprint 2 |
| PR2 | AI 角色职责边界模糊 | Medium | PROJECT-MEMORY §6 已定义角色分工 |
| PR3 | 多文档版本不一致 | Medium | Repository 为 Single Source of Truth |
| PR4 | Legacy Freeze 执行不彻底 | High | FD-005 已正式建立；需持续审查 |

### 6.4 Technical Risks (技术层面)

| # | Risk | Severity | Mitigation |
|---|------|----------|------------|
| TR1 | 技术栈未选定 | High | 需 ADR Technical Stack |
| TR2 | 数据库选型未定 | High | 需数据库 ADR |
| TR3 | AI 模型未选定 | Medium | 需 AI Specification |
| TR4 | 认证/授权方案未设计 | Medium | 需 RFC Security & Auth |
| TR5 | 部署环境未定义 | Low | 当前不阻塞架构设计 |

---

## 7. Recommended M1 Architecture

### 7.1 M1 Definition

M1 = Architecture Freeze，当前 Milestone（来源：Governance §3.4）。

M1 目标：在开始任何编码之前，冻结核心架构决策。

### 7.2 M1 Architecture Decisions (必须完成)

| # | Decision | Status | Priority |
|---|----------|--------|----------|
| D1 | Health Identity (健康元) 为唯一聚合根 | ✅ Confirmed (RFC-001) | P0 |
| D2 | AI 通过 Capability 模式调用系统能力 | ✅ Confirmed (RFC-001) | P0 |
| D3 | Platform/Store Local/Shared 三层模块边界 | ✅ Confirmed (RFC-001) | P0 |
| D4 | 14 个核心领域对象定义 | ✅ Confirmed (RFC-001) | P0 |
| D5 | 多门店多实例 → Store OS 方向 | ✅ Confirmed (Legacy pattern) | P0 |
| D6 | 技术栈选型 | ❌ Pending | P0 |
| D7 | 数据库选型 | ❌ Pending | P0 |
| D8 | 数据同步策略 (HQ ↔ Store) | ❌ Pending | P1 |
| D9 | 认证与授权方案 | ❌ Pending | P1 |
| D10 | AI 模型与 Prompt 策略 | ❌ Pending | P1 |
| D11 | Legacy 数据迁移策略 | ❌ Pending | P2 |

### 7.3 M1 Architecture Diagram (Conceptual)

```
┌─────────────────────────────────────────────────────────┐
│                     Nginx (统一入口)                      │
│                       :443 / :80                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │  Store Workbench │  │  Customer App    │            │
│  │  (门店工作台)      │  │  (客户端)         │            │
│  │                  │  │                  │            │
│  │  Web SPA         │  │  Mini Program     │            │
│  │  Staff-facing    │  │  Customer-facing  │            │
│  └────────┬─────────┘  └────────┬─────────┘            │
│           │                     │                       │
│           └──────────┬──────────┘                       │
│                      │                                  │
│              ┌───────┴───────┐                          │
│              │   API Layer   │                          │
│              │  (REST/gRPC)  │                          │
│              └───────┬───────┘                          │
│                      │                                  │
│     ┌────────────────┼────────────────┐                 │
│     │                │                │                 │
│  ┌──┴──────────┐ ┌──┴──────────┐ ┌──┴──────────┐      │
│  │ Platform    │ │ Store       │ │ AI          │      │
│  │ Services    │ │ Services    │ │ Services    │      │
│  │             │ │             │ │             │      │
│  │ • Identity  │ │ • Session   │ │ • Companion │      │
│  │ • Knowledge │ │ • Staff     │ │ • Capability│      │
│  │ • Config    │ │ • Device    │ │ • Assessment│      │
│  │ • Sync      │ │ • Entitle.  │ │ • Follow-Up │      │
│  └──┬──────────┘ └──┬──────────┘ └──┬──────────┘      │
│     │                │                │                 │
│     └────────────────┼────────────────┘                 │
│                      │                                  │
│              ┌───────┴───────┐                          │
│              │   Data Layer  │                          │
│              │               │                          │
│              │  • Platform DB│                          │
│              │  • Store DB   │                          │
│              │  • File Store │                          │
│              └───────────────┘                          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 7.4 M1 Minimal Capability Set

MVP 阶段 AI Capability 最小集（来源：RFC-001 §2.14）：

| Capability | 功能 | 优先级 |
|------------|------|--------|
| summarize_timeline | 健康时间线摘要 | P0 |
| generate_assessment | 生成健康评估（需 Staff review） | P0 |
| suggest_follow_up | 随访建议 | P0 |
| answer_from_knowledge_base | 知识库问答 | P1 |
| analyze_uploaded_asset | 上传资产分析 | P2 |

---

## 8. Open Questions

以下问题需要在 M1 关闭前回答。最多列出 10 项。

| # | Question | Context | Priority |
|---|----------|---------|----------|
| Q1 | Health Timeline 是独立聚合还是 Health Identity 下的值对象？ | RFC-001 Q1 未关闭；当前默认设计为独立聚合（1:1 关系，有自己的 ID 和独立追加语义）；影响 RFC-002 Data Model | P1 |
| Q2 | Platform DB 与 Store DB 是同一数据库的不同 schema、不同数据库实例、还是不同数据库类型？ | 影响 Local First 实现方式 | P0 |
| Q3 | Store 与 HQ 之间的数据同步采用什么策略？（实时同步 / 最终一致性 / 事件驱动） | 影响 RFC-002 Data Model | P0 |
| Q4 | MVP 阶段是否需要独立的 Auth 服务，还是内嵌于应用层？ | Governance 要求授权从第一天开始 | P1 |
| Q5 | AI Capability 的实现方式是微服务、Serverless Function、还是应用内模块？ | 影响部署架构 | P1 |
| Q6 | Store Workbench 是单体应用还是每个 Store 独立部署？ | Legacy 是每店独立实例；v2 需决策 | P0 |
| Q7 | Member Entitlement 在 MVP 阶段是否简化为手动记录，还是需要与支付系统集成？ | MVP 不包含支付；但权益核销需基本机制 | P1 |
| Q8 | Knowledge Base 的版本管理和 Store 同步策略？ | RFC-001 Q4；知识库更新频率和分发方式待定 | P2 |
| Q9 | 上传资产 (Upload Asset) 的文件存储方案？ | 涉及健康数据存储合规 | P2 |
| Q10 | M1 完成后、Sprint 2 开始前，是否需要完成所有 P0 ADR 还是可以部分 P0 在 Sprint 中并行完成？ | 影响项目排期 | P0 |

---

## 9. Architecture Compliance Check

对照 Constitution v1.0 的架构原则逐项检查：

| Constitution Principle | Status | Evidence |
|------------------------|--------|----------|
| §4 Health Identity 核心 | ✅ | RFC-001 定义 健康元 为唯一聚合根 |
| §5.4 AI Capability Based | ✅ | AI Conversation 通过 AI Capability 执行 |
| §7.1 Legacy Migration | ⚠️ | 方向明确，但迁移 RFC 未完成 |
| §7.2 Modular Design | ✅ | 14 对象明确模块边界；Platform/Store/Shared 分离 |
| §7.3 Domain Driven | ✅ | 领域模型围绕业务设计，非页面设计 |
| §7.4 Local First | ⚠️ | 方向明确，但数据同步策略未定义 (Q2, Q3) |
| §7.5 Cloud Coordination | ✅ | Platform 负责 Identity/AI/Knowledge，不接管门店数据 |
| §8 数据属于用户 | ✅ | data_ownership_tag: customer；授权访问模型 |
| §8 可追溯 | ✅ | Health Timeline + traceability_log |
| §8 可解释 | ✅ | AI Conversation 记录输入/推理/输出 |
| §8 最小必要 | ✅ | 15 表 MVP 范围控制 |

---

## 10. Summary

### 10.1 Architecture Health Score

| Dimension | Score | Note |
|-----------|-------|------|
| 核心概念清晰度 | 🟢 Good | 健康元、AI Capability、价值闭环定义明确 |
| 文档一致性 | 🟡 Fair | RFC-001 与 BP-004 存在不一致，需统一 |
| Legacy 策略 | 🟢 Good | FD-005 + LEGACY-SERVER-RUNTIME 建立清晰边界 |
| 可执行性 | 🟡 Fair | 多个 P0 决策未完成，尚不能进入编码 |
| MVP 聚焦度 | 🟢 Good | 严格控制范围，排除清单明确 |
| 风险可见性 | 🟢 Good | 多层面风险已识别 |

### 10.2 M1 Go/No-Go Criteria

M1 完成的标准：

- [ ] 所有 P0 架构决策完成并文档化
- [ ] Q2 (Platform DB vs Store DB) 已回答
- [ ] Q3 (数据同步策略) 已回答
- [ ] Q6 (Store Workbench 部署模式) 已回答
- [ ] Q10 (M1 完成标准) 已与 Founder 对齐
- [ ] RFC-001 与 BP-004 差异已解决
- [ ] ADR-001-legacy-migration placeholder 已填写

---

## 11. Next Steps

### Immediate (M1 内)

1. **ADR Technical Stack** — 选定语言、框架、数据库
2. **ADR Data Sync Strategy** — 定义 HQ ↔ Store 数据同步
3. **RFC-002 Data Model** — 从 RFC-001 导出数据库模型
4. **RFC Security & Auth** — 认证授权方案
5. **关闭 RFC-001 Open Questions** — Q1 (Timeline 聚合方式)
6. **完成 ADR-001-legacy-migration** — 填写迁移策略

### Short-term (Sprint 2 准备)

7. 完成 REL-004 Controlled MVP Planning Baseline
8. 完成所有 P0 和 P1 ADR
9. Store Workbench 原型验证
10. AI Capability 最小集 PoC

### Not Now

- 数据库实现
- 应用代码编写
- API 端点实现
- 生产部署

---

## 12. End of Document

ARCH-000 is the opening architecture review for Health One M1.

It identifies the current architecture state, surfaces risks, defines the M1 target, and lists open questions that must be answered before architecture freeze is complete.

This document should be reviewed by Architecture Office and approved by Founder before M1 proceeds to closure.

---

## 13. Implementation Gate

本架构批准后，以下后续工作必须遵循 ARCH-000：

| # | 后续文档 | 约束 |
|---|---------|------|
| 1 | RFC-002 Data Model | 必须从 RFC-001 的 14 个领域对象导出；不得引入新对象 |
| 2 | ADR Technical Stack | 技术选型必须支持 Platform / Store Local / Shared 三层模块边界 |
| 3 | ADR Data Sync Strategy | 必须遵循 §5.3 Data Ownership 三维度模型 |
| 4 | RFC Security & Auth | 必须遵循 §5.3 Business Ownership 归属 |
| 5 | RFC-005 Database Design | 表结构必须从 RFC-001 领域对象导出；不得从 UI 页面反推 |
| 6 | 代码开发 | 必须先完成对应 ADR/RFC 批准 |
| 7 | AI Implementation | AI 必须通过 AI Capability 调用系统能力（Constitution §5.4）；不得直接操作数据库 |

**违反本架构的开发活动，QA 必须拒绝验收。**

---

## End of Document
