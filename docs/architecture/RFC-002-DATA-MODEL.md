# RFC-002 Health One Data Model

Document ID : RFC-002
Title       : Health One Data Model
Version     : 1.0
Status      : Proposed
Owner       : Architecture Office
Created     : 2026-06-28
Depends On  : RFC-001 (Domain Model, Single Source of Truth), ARCH-000 (Approved), Constitution v1.0 §7, §8
Related     : RFC-005 (Database Design), ADR Data Sync Strategy, ADR Technical Stack

---

## 1. Design Principles

本 RFC 定义 Health One 的数据模型（Data Model），从 RFC-001 的领域模型导出。

| # | Principle | Source |
|---|-----------|--------|
| P1 | 数据模型服务于领域模型，不直接从 UI 页面或数据库表反推 | Constitution §7.3 |
| P2 | Health Identity（健康元）为唯一聚合根，所有健康数据围绕它组织 | Constitution §4, RFC-001 §2.1 |
| P3 | 数据所有权三维度：Business Ownership / Technical Module / Storage Location | ARCH-000 §5.3 |
| P4 | 不参考 Legacy 数据库 schema；可参考 Legacy 业务概念，不复制表结构 | FD-005, Constitution §7.1 |
| P5 | 模块独立：Platform / Store Local / Shared 三层，通过接口通信 | RFC-001 §5 |
| P6 | AI 不直接操作数据库；AI 通过 AI Capability 调用系统能力 | Constitution §5.4 |
| P7 | 所有健康数据可追溯：Timeline 只追加，不可删除不可修改 | Constitution §8, RFC-001 §4.7 |
| P8 | MVP 范围控制：仅建模 MVP 必需的实体；非 MVP 对象不进入数据模型 | ARCH-000 M1 |

### Non-Goals

本 RFC **不涉及**：

| # | Non-Goal | 后续文档 |
|---|----------|---------|
| N1 | 数据库表结构、字段类型、索引设计 | RFC-005 Database Design |
| N2 | SQL DDL / DML | RFC-005 |
| N3 | ORM 映射 | Implementation |
| N4 | 具体数据库选型（PostgreSQL / MySQL / etc.） | ADR Technical Stack |
| N5 | API 端点设计 | API Specification |
| N6 | 数据迁移方案 | ADR Legacy Migration |

---

## 2. Aggregate Root

### 2.1 Health Identity — 唯一聚合根

```
┌─────────────────────────────────────────────────────────────────┐
│                  Health Identity (健康元)                        │
│                  Aggregate Root                                  │
│                                                                 │
│  identity_id         : UUID          (PK)                       │
│  display_name        : String                                    │
│  activation_status   : Enum (pending / active / archived)       │
│  primary_store_id    : UUID          (FK → Store)               │
│  data_ownership_tag  : Enum (customer / platform)               │
│  created_at          : Timestamp                                 │
│  activated_at        : Timestamp (nullable)                      │
│                                                                 │
│  ─── Owned Entities (1:1) ───                                   │
│  ├── Health Profile    (1:1, cascade)                            │
│  └── Health Timeline   (1:1, cascade, append-only)              │
│                                                                 │
│  ─── Owned Entities (1:N) ───                                   │
│  ├── Health Assessment                                          │
│  ├── Health Plan                                                │
│  ├── Service Session                                            │
│  ├── AI Conversation                                            │
│  ├── Upload Asset                                               │
│  └── Member Entitlement                                         │
│                                                                 │
│  Business Owner : Customer（伦理）                                │
│  Technical Module: Platform                                      │
│  Storage        : Platform DB                                    │
│  Lifecycle      : pending → active → archived                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**聚合规则（来源：RFC-001 §4）：**

| # | Rule |
|---|------|
| A1 | Health Identity 是系统中唯一的聚合根；所有健康实体通过 identity_id 关联 |
| A2 | 外部对象不能直接引用聚合内部实体（必须通过 identity_id 间接引用） |
| A3 | 聚合内部实体之间可以相互引用 |
| A4 | 跨聚合操作必须通过接口，不能通过外键直连 |

---

## 3. Entity Catalog

每个实体标注：Owner（Business Owner）、Aggregate（所属聚合）、Lifecycle（生命周期状态）、Storage（存储位置）、Module（Shared / Local / Platform）。

### 3.1 Health Profile（健康档案）

```
Entity       : Health Profile
Chinese      : 健康档案
Aggregate    : Health Identity (1:1)
Owner        : Customer
Module       : Shared
Storage      : Platform DB

Attributes:
  profile_id            : UUID          (PK)
  identity_id           : UUID          (FK → Health Identity, UNIQUE)
  basic_info            : JSON          (birth_date, gender, height, weight, …)
  medical_summary       : Text          (已知健康状况摘要，非诊断)
  lifestyle_notes       : Text          (运动、饮食、睡眠等)
  primary_concern       : Text          (主要健康关注)
  last_updated_at       : Timestamp

Lifecycle:
  created (随 Health Identity 激活时创建)
    → active (可更新)
    → (不可删除；随 Health Identity archived)

Invariants:
  - 每个 Health Identity 有且只有一个 Health Profile (RFC-001 R1.4)
  - profile 更新时 last_updated_at 必须更新
  - medical_summary 不得包含诊断结论
```

### 3.2 Health Timeline（健康时间线）

```
Entity       : Health Timeline
Chinese      : 健康时间线
Aggregate    : Health Identity (1:1)
Owner        : Customer
Module       : Shared
Storage      : Platform DB

Attributes:
  timeline_id           : UUID          (PK)
  identity_id           : UUID          (FK → Health Identity, UNIQUE)

Lifecycle:
  created (随 Health Identity 激活时创建)
    → active (持续追加 entries)
    → (不可删除；随 Health Identity archived)

Behavior:
  - 只追加 (append-only)
  - 不可修改
  - 不可删除
  - 每次业务事件触发时自动追加 Timeline Entry (Value Object, 见 §4.1)

Invariants:
  - 每个 Health Identity 有且只有一个 Health Timeline
  - entries 顺序由时间戳决定
  - Timeline Entry 不可单独寻址或修改 (RFC-001 R7.3)
```

### 3.3 Health Assessment（健康评估）

```
Entity       : Health Assessment
Chinese      : 健康评估
Aggregate    : Health Identity (1:N)
Owner        : Customer（需 Staff review）
Module       : Shared
Storage      : Platform DB

Attributes:
  assessment_id         : UUID          (PK)
  identity_id           : UUID          (FK → Health Identity)
  assessment_type       : Enum (ai_generated / staff_recorded / combined)
  source_conversation_id: UUID          (FK → AI Conversation, nullable)
  reference_asset_ids   : UUID[]        (FK → Upload Asset, 零个或多个)
  concern_area          : String        (关注的健康领域)
  findings_summary      : Text          (评估发现摘要)
  confidence_level      : Enum (high / medium / low / uncertain)
  recommendation_summary: Text          (建议摘要)
  created_by            : String        (staff_id / ai_capability_id)
  created_at            : Timestamp
  reviewed_by           : UUID          (FK → Staff, nullable)
  reviewed_at           : Timestamp     (nullable)

Lifecycle:
  created (draft)
    → reviewed (Staff 复核完成, reviewed_by + reviewed_at 必填)
    → (不可删除)

Invariants:
  - AI 生成的 Assessment 必须标注 confidence_level (RFC-001 R2.5)
  - MVP 阶段 AI 生成的 Assessment 必须经过 Staff reviewed_by (RFC-001 R2.6)
  - 创建时自动追加 Timeline Entry
```

### 3.4 Health Plan（健康计划）

```
Entity       : Health Plan
Chinese      : 健康计划
Aggregate    : Health Identity (1:N)
Owner        : Customer（Staff/AI 协作制定）
Module       : Shared
Storage      : Platform DB

Attributes:
  plan_id               : UUID          (PK)
  identity_id           : UUID          (FK → Health Identity)
  plan_status           : Enum (draft / active / completed / archived)
  source_assessment_ids : UUID[]        (FK → Health Assessment, 至少一个)
  goals                 : JSON[]        (Value Object: Health Goal, 见 §4.2)
  recommended_services  : String[]      (推荐的服务类型)
  follow_up_schedule    : JSON          (随访计划: 频率/时间/触发条件)
  created_by            : String        (ai_capability_id / staff_id)
  created_at            : Timestamp
  updated_at            : Timestamp

Lifecycle:
  draft
    → active (开始执行)
      → completed (目标达成)
      → archived (提前终止)

Invariants:
  - 必须关联至少一个 Health Assessment 作为依据 (RFC-001 R2.4)
  - 状态变更时自动追加 Timeline Entry
  - completed / archived 后不可回到 active
```

### 3.5 Service Session（服务记录）

```
Entity       : Service Session
Chinese      : 服务记录 / 服务会话
Aggregate    : Health Identity (1:N)
Owner        : Customer + Store（共同事实）
Module       : Shared
Storage      : Platform DB（记录）+ Store DB（执行上下文）

Attributes:
  session_id            : UUID          (PK)
  identity_id           : UUID          (FK → Health Identity)
  store_id              : UUID          (FK → Store)
  staff_id              : UUID          (FK → Staff, 执行服务的人员)
  plan_id               : UUID          (FK → Health Plan, nullable)
  service_type          : String        (服务类型: 健康舱 / 咨询 / 检测 / …)
  device_ids            : UUID[]        (FK → Device, 零个或多个)
  pre_service_notes     : Text          (服务前备注)
  service_detail        : Text          (服务内容描述)
  post_service_notes    : Text          (服务后观察)
  customer_feedback     : Text          (客户当场反馈)
  next_step_suggestion  : Text          (建议下一步)
  entitlement_id        : UUID          (FK → Member Entitlement, nullable)
  started_at            : Timestamp
  completed_at          : Timestamp     (nullable, 完成后必填)
  recorded_by           : UUID          (FK → Staff, 记录人)

Lifecycle:
  created (started_at 已填, completed_at null)
    → in_progress
      → completed (completed_at 必填, 追加 Timeline Entry, 触发 Follow-Up 检查)
      → cancelled (仅限错误记录, 需记录取消原因)

Invariants:
  - 必须属于一个 Health Identity (RFC-001 R3.1)
  - 必须属于一个 Store (RFC-001 R3.2)
  - 必须由至少一个 Staff 执行 (RFC-001 R3.3)
  - completed 后必须产生 Timeline Entry (RFC-001 R3.7)
  - completed 后必须触发 Follow-Up 检查 (RFC-001 R3.8)
  - 核销权益时 used_quota ≤ total_quota (RFC-001 R6.3)
```

### 3.6 Store（门店）

```
Entity       : Store
Chinese      : 门店
Aggregate    : 独立（不属于 Health Identity 聚合；与 Health Identity 关联）
Owner        : Store / Platform（配置）
Module       : Store Local
Storage      : Store DB

Attributes:
  store_id              : UUID          (PK)
  store_name            : String
  store_code            : String        (UNIQUE)
  location              : String        (地址)
  contact_info          : JSON          (电话、营业时间等)
  operating_status      : Enum (active / inactive / pilot)
  store_type            : Enum (直营 / 合作 / 加盟)
  config                : JSON          (Value Object: 门店级配置, 见 §4.3)
  local_knowledge       : JSON          (门店本地知识引用)

Lifecycle:
  pilot (试运营)
    → active (正式运营)
      → inactive (暂停)

Invariants:
  - store_code 全局唯一
  - 每个 Store 管理的 Staff / Device 列表属于 Store 本地数据
```

### 3.7 Staff（员工）

```
Entity       : Staff
Chinese      : 门店员工
Aggregate    : Store (1:N)
Owner        : Store
Module       : Store Local
Storage      : Store DB

Attributes:
  staff_id              : UUID          (PK)
  store_id              : UUID          (FK → Store)
  display_name          : String
  role                  : Enum (店长 / 健康管理师 / 服务人员 / …)
  contact_info          : String
  status                : Enum (active / inactive)
  certifications        : JSON[]        (Value Object, 资质记录)

Lifecycle:
  active → inactive

Invariants:
  - 必须属于一个 Store
  - 只有 active Staff 可以执行 Service Session
  - 只有 active Staff 可以 review Health Assessment
```

### 3.8 Device（设备）

```
Entity       : Device
Chinese      : 健康设备
Aggregate    : Store (1:N)
Owner        : Store
Module       : Store Local
Storage      : Store DB

Attributes:
  device_id             : UUID          (PK)
  store_id              : UUID          (FK → Store)
  device_type           : String        (健康舱 / 检测仪 / …)
  device_code           : String        (UNIQUE within Store)
  operating_status      : Enum (active / maintenance / offline)
  device_config         : JSON          (Value Object, 设备参数)
  maintenance_records   : JSON[]        (Value Object, 维护记录)

Lifecycle:
  active
    → maintenance (维护中)
    → offline
    → active

Invariants:
  - 必须属于一个 Store
  - 只有 active Device 可以被 Service Session 引用
```

### 3.9 AI Conversation（AI 对话）

```
Entity       : AI Conversation
Chinese      : AI 对话
Aggregate    : Health Identity (1:N)
Owner        : Customer
Module       : Shared
Storage      : Platform DB

Attributes:
  conversation_id       : UUID          (PK)
  identity_id           : UUID          (FK → Health Identity)
  conversation_type     : Enum (intake / assessment / follow_up / guidance / check_in)
  capability_ids        : String[]      (调用的 AI Capability 列表)
  context_snapshot      : JSON          (Value Object, 对话时的上下文引用)
  messages              : JSON[]        (Value Object, 对话消息列表)
  summary               : Text          (结构化对话摘要)
  generated_assessment_id: UUID         (FK → Health Assessment, nullable)
  confidence_notes      : Text          (不确定性标注)
  traceability_log      : JSON          (Value Object: 输入/推理/输出)
  started_at            : Timestamp
  ended_at              : Timestamp     (nullable)

Lifecycle:
  started (started_at 已填)
    → in_progress (messages 持续追加)
      → ended (ended_at 必填, 可选择生成 Assessment)

Invariants:
  - 必须属于一个 Health Identity (RFC-001 R4.1)
  - 必须至少调用一个 AI Capability (RFC-001 R4.2)
  - 不得直接操作数据库 (RFC-001 R4.3)
  - 所有输入输出记录在 traceability_log (RFC-001 R4.4)
  - ended 时自动追加 Timeline Entry
```

### 3.10 Upload Asset（上传资产）

```
Entity       : Upload Asset
Chinese      : 上传资产
Aggregate    : Health Identity (1:N)
Owner        : Customer
Module       : Shared
Storage      : File Store (文件) + Platform DB (元数据)

Attributes:
  asset_id              : UUID          (PK)
  identity_id           : UUID          (FK → Health Identity)
  uploader_type         : Enum (customer / staff)
  uploader_id           : String        (customer_id / staff_id)
  asset_type            : Enum (report / image / document / other)
  asset_category        : String        (检测报告 / 体检报告 / 病历 / 其他)
  file_reference        : String        (文件存储引用路径)
  description           : Text          (描述)
  uploaded_at           : Timestamp
  ai_processed          : Bool          (default: false)
  ai_summary            : Text          (nullable, AI 对资产的摘要)

Lifecycle:
  uploaded
    → ai_analyzed (ai_processed = true, ai_summary 已填)
    → (不可删除；可标记为 superseded)

Invariants:
  - 必须属于一个 Health Identity (RFC-001 R5.1)
  - uploader_type 必填 (RFC-001 R5.2)
  - 上传时自动追加 Timeline Entry
```

### 3.11 Member Entitlement（会员权益）

```
Entity       : Member Entitlement
Chinese      : 会员权益
Aggregate    : Health Identity (1:N)
Owner        : Store（发放）/ Customer（持有）
Module       : Store Local
Storage      : Store DB

Attributes:
  entitlement_id        : UUID          (PK)
  identity_id           : UUID          (FK → Health Identity)
  entitlement_type      : Enum (service_package / membership / trial / gifted)
  service_type          : String        (关联的服务类型)
  total_quota           : Integer       (总次数/额度)
  used_quota            : Integer       (已使用次数, default: 0)
  valid_from            : Date
  valid_until           : Date
  source_store_id       : UUID          (FK → Store)
  status                : Enum (active / exhausted / expired / cancelled)

Lifecycle:
  active
    → exhausted (used_quota == total_quota)
    → expired (valid_until 已过)
    → cancelled (手动取消)

Invariants:
  - 必须属于一个 Health Identity (RFC-001 R6.1)
  - source_store_id 必须指向存在的 Store (RFC-001 R6.2)
  - Service Session 核销时 used_quota 不能超过 total_quota (RFC-001 R6.3)
  - expired / cancelled 状态不能再被核销 (RFC-001 R6.4)
  - MVP 阶段不关联支付系统；权益为手动记录
```

### 3.12 Knowledge Base（知识库）

```
Entity       : Knowledge Entry
Chinese      : 知识条目
Aggregate    : 独立（Platform 管理，不属于 Health Identity 聚合）
Owner        : Platform
Module       : Platform
Storage      : Platform DB

Attributes:
  knowledge_entry_id    : UUID          (PK)
  category              : Enum (service / device / follow_up / health_guidance / operation)
  title                 : String
  content               : Text          (结构化知识内容)
  tags                  : String[]
  applicable_stores     : UUID[]        (适用门店范围, 空 = 全局)
  version               : Integer
  reviewed_by           : String
  status                : Enum (draft / published / deprecated)
  created_at            : Timestamp
  updated_at            : Timestamp

Lifecycle:
  draft
    → published (reviewed_by 必填)
      → deprecated (不可回到 published)
      → updated (version ++, 回到 draft)

Invariants:
  - published 的 Entry 必须有 reviewed_by
  - AI Conversation 和 Health Plan 可引用 published 的 Entry
  - 非领域聚合根；独立实体
```

### 3.13 AI Capability（AI 能力）

```
Entity       : AI Capability
Chinese      : AI 能力定义
Aggregate    : 独立（Platform 管理，不属于 Health Identity 聚合）
Owner        : Platform
Module       : Platform
Storage      : Platform DB

Attributes:
  capability_id         : String        (PK, e.g. "summarize_timeline")
  capability_name       : String
  description           : Text
  input_schema          : JSON          (输入参数规范)
  output_schema         : JSON          (输出参数规范)
  required_context      : String[]      (需要的上下文: Profile / Timeline / Assessment / …)
  authorization_level   : Enum (basic / health_read / health_write / admin)
  traceability          : Bool          (是否必须记录可追溯日志)
  status                : Enum (active / deprecated)

Lifecycle:
  active → deprecated (不可删除，历史 Conversation 仍引用)

Invariants:
  - capability_id 全局唯一
  - 每个 Capability 必须有明确的 input_schema 和 output_schema (RFC-001 R4.5)
  - 非领域聚合根；独立实体
  - AI Conversation 通过 capability_ids[] 引用
```

---

## 4. Value Objects

Value Object 无独立 ID，生命周期由其所属 Entity 管理，不可单独寻址。

### 4.1 Timeline Entry

```
Value Object : Timeline Entry
Owned By     : Health Timeline
Storage      : 内嵌于 Health Timeline（JSONB / 子表）

Attributes:
  entry_id              : String        (仅在 Timeline 内唯一)
  timestamp             : Timestamp
  event_type            : Enum (assessment_created / plan_updated / service_completed
                                / ai_conversation_summarized / asset_uploaded / …)
  source_object_type    : String        (HealthAssessment / ServiceSession / AIConversation / …)
  source_object_id      : UUID
  summary_text          : Text
  performed_by          : String        (staff_id / ai_capability_id / identity_id)

Invariants:
  - 不可单独修改或删除 (RFC-001 R7.3)
  - 事件发生时自动追加
```

### 4.2 Health Goal

```
Value Object : Health Goal
Owned By     : Health Plan.goals[]
Storage      : 内嵌于 Health Plan（JSONB）

Attributes:
  goal_description      : String
  target_date           : Date          (nullable)
  progress_status       : Enum (not_started / in_progress / achieved / abandoned)

Invariants:
  - 属于一个 Health Plan
```

### 4.3 Store Config

```
Value Object : Store Config
Owned By     : Store.config
Storage      : 内嵌于 Store（JSONB）

Attributes:
  operating_hours       : JSON
  service_types         : String[]
  notification_prefs    : JSON
  local_settings        : JSON

Invariants:
  - 属于一个 Store
```

### 4.4 Other Value Objects

| Value Object | Owned By | Notes |
|-------------|----------|-------|
| Staff.certifications[] | Staff | 资质记录 |
| Device.device_config | Device | 设备参数 |
| Device.maintenance_records[] | Device | 维护记录 |
| AIConversation.context_snapshot | AI Conversation | 对话时的上下文快照 |
| AIConversation.messages[] | AI Conversation | 对话消息列表 |
| AIConversation.traceability_log | AI Conversation | 可追溯日志 |

---

## 5. Entity Relationship Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                        Platform DB                               │
│                                                                  │
│  ┌─────────────────┐                                             │
│  │ Health Identity  │── 1:1 ──→ Health Profile                   │
│  │  (Aggregate Root)│── 1:1 ──→ Health Timeline                  │
│  │                 │── 1:N ──→ Health Assessment                 │
│  │                 │── 1:N ──→ Health Plan                       │
│  │                 │── 1:N ──→ Service Session                   │
│  │                 │── 1:N ──→ AI Conversation                   │
│  │                 │── 1:N ──→ Upload Asset (meta)               │
│  └────────┬────────┘                                             │
│           │ references                                           │
│           ▼                                                      │
│  ┌─────────────────┐   ┌─────────────────┐                      │
│  │ Knowledge Entry  │   │ AI Capability   │                      │
│  │  (独立实体)       │   │  (独立实体)       │                      │
│  └─────────────────┘   └─────────────────┘                      │
│                                                                  │
│  ┌─────────────────┐                                             │
│  │  File Store      │── Upload Asset (files)                     │
│  └─────────────────┘                                             │
│                                                                  │
└──────────────────────────────┬───────────────────────────────────┘
                               │
                               │ FK references (via API)
                               │
┌──────────────────────────────┴───────────────────────────────────┐
│                        Store DB (per Store)                       │
│                                                                  │
│  ┌──────────┐                                                    │
│  │  Store   │── 1:N ──→ Staff                                    │
│  │          │── 1:N ──→ Device                                   │
│  │          │── 1:N ──→ Member Entitlement                       │
│  └──────────┘                                                    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

跨库引用规则：
  - Platform DB → Store DB: 通过 Store.store_id (FK reference, not DB FK)
  - Store DB → Platform DB: 通过 Health Identity.identity_id (FK reference)
  - 跨库不设数据库级外键约束；引用完整性由应用层保证
```

---

## 6. Data Ownership

每个实体的三维度所有权（来源：ARCH-000 §5.3）：

| # | Entity | Business Owner | Technical Module | Storage |
|---|--------|---------------|------------------|---------|
| 1 | Health Identity | Customer（伦理）/ Platform（基础设施） | Platform | Platform DB |
| 2 | Health Profile | Customer | Shared | Platform DB |
| 3 | Health Timeline | Customer | Shared | Platform DB |
| 4 | Health Assessment | Customer（需 Staff review） | Shared | Platform DB |
| 5 | Health Plan | Customer（Staff/AI 协作制定） | Shared | Platform DB |
| 6 | Service Session | Customer + Store（共同事实） | Shared | Platform DB |
| 7 | Store | Store / Platform（配置） | Store Local | Store DB |
| 8 | Staff | Store | Store Local | Store DB |
| 9 | Device | Store | Store Local | Store DB |
| 10 | AI Conversation | Customer | Shared | Platform DB |
| 11 | Upload Asset | Customer | Shared | File Store + Platform DB |
| 12 | Member Entitlement | Store（发放）/ Customer（持有） | Store Local | Store DB |
| 13 | Knowledge Entry | Platform | Platform | Platform DB |
| 14 | AI Capability | Platform | Platform | Platform DB |

---

## 7. Entity Lifecycle Summary

```
Health Identity   :  pending ──→ active ──→ archived
Health Profile    :  created ──→ active ──→ (archived with Identity)
Health Timeline   :  created ──→ active (append-only) ──→ (archived with Identity)
Health Assessment :  draft ──→ reviewed
Health Plan       :  draft ──→ active ──→ completed ──→ archived
Service Session   :  created ──→ in_progress ──→ completed ──→ (cancelled 例外)
Store             :  pilot ──→ active ──→ inactive
Staff             :  active ──→ inactive
Device            :  active ──→ maintenance ──→ offline ──→ active
AI Conversation   :  started ──→ in_progress ──→ ended
Upload Asset      :  uploaded ──→ ai_analyzed
Member Entitlement:  active ──→ exhausted ──→ expired ──→ cancelled
Knowledge Entry   :  draft ──→ published ──→ deprecated
AI Capability     :  active ──→ deprecated
```

---

## 8. Persistence Boundary

### 8.1 Storage Assignment

```
Platform DB (PostgreSQL / MySQL / etc.):
  ├── Health Identity
  ├── Health Profile
  ├── Health Timeline (含 Timeline Entry)
  ├── Health Assessment
  ├── Health Plan (含 Health Goal)
  ├── Service Session
  ├── AI Conversation (含 messages, traceability_log)
  ├── Upload Asset (元数据)
  ├── Knowledge Entry
  └── AI Capability

Store DB (每 Store 独立实例):
  ├── Store
  ├── Staff
  ├── Device
  └── Member Entitlement

File Store (S3 / MinIO / Local FS):
  └── Upload Asset (文件本体)
```

### 8.2 Cross-Boundary Access Rules

| 访问方向 | 规则 |
|---------|------|
| Platform → Store DB | Platform 不直接访问 Store DB；通过 Store Service API |
| Store → Platform DB | Store 不直接访问 Platform DB；通过 Platform API |
| Customer → Platform DB | Customer 通过 AI Companion (API) 访问自己的数据 |
| AI → Any DB | AI 不直接操作任何数据库；通过 AI Capability → API |

### 8.3 Shared Entity Access

Shared 模块的实体存储在 Platform DB，通过 API 向 Store 和 Customer 暴露：

```
Store Workbench ──API──→ Service Session (Platform DB)
                       → Health Profile (Platform DB, 经授权)
                       → Health Timeline (Platform DB, 经授权)

AI Companion    ──API──→ Health Identity (Platform DB)
                       → Health Profile (Platform DB)
                       → Health Timeline (Platform DB)
                       → AI Conversation (Platform DB)
```

---

## 9. Future Extension

### 9.1 预留但不实现的实体

以下实体在 RFC-001 和 ARCH-000 MVP 排除清单中，数据模型不纳入，但保留扩展点：

| Entity | 当前状态 | 扩展触发条件 |
|--------|---------|------------|
| Device Usage Record | 排除 | MVP 后如设备使用频率需要独立追踪 |
| Feedback Record (独立) | 排除 | Service Session.customer_feedback 足够；独立化当反馈维度扩展 |
| Follow-Up Task (独立实体) | 排除 | Health Plan.follow_up_schedule 足够；独立化当任务系统复杂 |
| Event (独立实体) | 排除 | Health Timeline Entry 足够；独立化当需要跨聚合事件 |
| Product / Order / Transaction | 排除 | 非 MVP；支付系统就绪后引入 |
| Partner / Contribution | 排除 | 生态扩展阶段 |

### 9.2 扩展原则

- 新实体只能通过 RFC 提案引入
- 新实体必须归属于现有聚合根或独立（需 ADR）
- 不允许为 UI 便利直接加表

---

## 10. Open Questions

| # | Question | Context | Priority | Suggested Direction |
|---|----------|---------|----------|---------------------|
| Q1 | Platform DB 与 Store DB 是否是同一数据库软件的不同 schema/实例，还是不同数据库类型？ | ARCH-000 Q2；影响部署架构 | P0 | 建议：MVP 阶段可用同一 PostgreSQL 实例的不同 schema；生产阶段分实例 |
| Q2 | Store 与 Platform 之间数据同步策略？ | ARCH-000 Q3；Shared 实体存在 Platform DB，Store 通过 API 访问 | P0 | 建议：MVP 单店用同步 API 即可；多店时引入最终一致性 |
| Q3 | Health Timeline entries 使用 JSONB 内嵌还是独立子表？ | 影响查询性能和存储策略 | P1 | 建议：MVP 用 JSONB 内嵌；entries 超过阈值后迁子表 |
| Q4 | Upload Asset 的文件存储方案和健康数据合规？ | MVP 可能上传检测报告图片；涉及健康数据存储合规 | P1 | 建议：MVP 用本地文件存储 + 元数据在 Platform DB；生产用 S3 加密 |
| Q5 | Member Entitlement 归属 Store Local，但 identity_id 在 Platform DB，跨库关联如何保证一致性？ | identity_id 是跨库外键引用 | P2 | 建议：identity_id 作为字符串引用存储，应用层验证；不设数据库 FK |

---

## 11. Compliance Check

| Source | Requirement | Status |
|--------|------------|--------|
| RFC-001 §2 | 14 个核心领域对象全部映射 | ✅ 14 实体 + 6 Value Object |
| RFC-001 §5 | Platform / Store Local / Shared 模块边界 | ✅ |
| ARCH-000 §5.3 | 三维度 Data Ownership | ✅ 每个实体标注 Business / Technical / Storage |
| ARCH-000 §13 | Implementation Gate: 不引入新对象 | ✅ 仅建模 RFC-001 的 14 个对象 |
| Constitution §5.4 | AI 不直接操作数据库 | ✅ AI Conversation 通过 API / Capability |
| Constitution §7.4 | Local First | ✅ Store 本地数据在 Store DB |
| Constitution §8 | 可追溯 | ✅ Timeline append-only; traceability_log |
| FD-005 | 不参考 Legacy schema | ✅ 无 Legacy 表结构引用 |

---

## 12. End of Document

RFC-002 defines the Health One data model, derived from RFC-001 domain model and ARCH-000 approved architecture.

All 14 domain entities are modeled with explicit aggregate, lifecycle, storage, and ownership assignments.

This document must be approved before RFC-005 (Database Design) proceeds.
