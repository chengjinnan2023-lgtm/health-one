# PRD-001 Health One MVP Definition

Document ID : PRD-001
Title       : Health One MVP Definition
Version     : 1.0
Status      : Proposed
Owner       : Product Office
Created     : 2026-06-28
Depends On  : Constitution v1.0 (§12 MVP Definition), RFC-001 (Domain Model), ARCH-000 (Approved), RFC-002 (Data Model), ADR-002 (Tech Stack), PRODUCT-002 (Store Workflow), PRODUCT-003 (Screen List)
Related     : RFC-003 (MVP Execution Plan), Sprint 2 Planning

---

## 1. MVP Goal

> 完成第一位真实客户的完整健康管理闭环，并在真实门店中验证该闭环可重复。

```
Customer walks in
  → Staff finds/creates Customer
    → Activate/update 健康元
      → Record Health Concern
        → Deliver Store Service
          → Record Service
            → Capture Feedback
              → AI Summary
                → Create Follow-Up Task
                  → Execute Follow-Up
                    → Customer Returns
```

MVP 失败的唯一定义：**闭环未在真实门店中完成。**

MVP 成功的唯一定义：**闭环完成且可重复。**

---

## 2. Target Users

| # | User | Role | Primary Touchpoint | MVP Scope |
|---|------|------|-------------------|-----------|
| 1 | Customer | 健康元 所有者 | PWA (手机端) 或到店 | 到店为主；PWA 为客户信息查看 |
| 2 | Store Staff | 门店服务人员 | Store Workbench (Web SPA) | 核心用户——完成闭环的主要操作者 |
| 3 | Health Manager | 门店健康管理师 | Store Workbench (Web SPA) | 与 Staff 同屏；MVP 阶段可能为同一人 |
| 4 | Founder / Operator | 平台运营者/验证者 | Operator Review Screen | 查看闭环进度、识别缺口 |

**不在 MVP 范围内的用户：**
- 多店 Franchise Owner（单店 MVP）
- Partner / Coach（生态扩展阶段）
- System Admin / DevOps（运营团队）

---

## 3. User Journey

### 3.1 Customer Journey（客户旅程）

```
Awareness ──→ Entry ──→ Assessment ──→ Service ──→ Memory ──→ Return
   │             │           │              │           │           │
   │ 到店/联系     │ 查找/创建   │ 健康关注      │ 门店服务    │ 服务记录    │ 随访触发
   │ 转介绍       │ 健康元激活  │ 目标设定      │ 设备使用    │ AI 总结     │ 再次到店
   │ 随访召回     │            │              │ 当场反馈    │ 随访任务    │ 持续关系
```

### 3.2 Staff Journey（员工操作流）

```
Dashboard ──→ Customer Search ──→ Customer Summary ──→ Concern Intake
                (查找/创建客户)     (健康元总览)          (记录健康关注)

  ──→ Service Record ──→ Feedback Record ──→ Follow-Up Task
      (记录服务)          (记录反馈)          (建立随访)

  ──→ AI Summary Panel (辅助总结) ──→ Dashboard (回到待办)
```

### 3.3 Operator Journey（运营者视角）

```
Operator Review ──→ 查看近期客户 ──→ 查看服务记录 ──→ 查看随访完成率
                   ──→ 识别流程缺口 ──→ 验证闭环 ──→ 记录改进建议
```

---

## 4. Core Features (P0)

P0 = MVP 必须实现。没有 P0 功能，闭环无法完成。

### F1: Customer Identity Management

| Attribute | Value |
|-----------|-------|
| Priority | P0 |
| Owner | Platform |
| Depends On | RFC-001 Health Identity, Store |
| Sprint | Sprint 2 |

**Description:**
- Staff 可以通过姓名/手机号快速查找客户
- 未找到时一键创建新客户
- 客户创建自动生成 Health Identity (健康元)
- 支持激活（activation_status: pending → active）
- 避免明显重复客户
- 涉及实体：Health Identity, Store

**Acceptance:**
- Staff 可在 10 秒内完成客户查找或创建
- 同一客户不会出现两条独立 Health Identity

---

### F2: Health Profile & Concern Intake

| Attribute | Value |
|-----------|-------|
| Priority | P0 |
| Owner | Shared |
| Depends On | F1 (Customer Identity), RFC-001 Health Profile |
| Sprint | Sprint 2 |

**Description:**
- 记录客户基本信息（姓名、联系方式、出生年份、性别）
- 选择健康关注类别（肩颈/腰背/疲劳/运动恢复/体重/睡眠/其他）
- 记录客户自述 + 员工备注
- 记录健康目标（可选）
- 涉及实体：Health Profile, Health Timeline

**Acceptance:**
- 健康关注录入不超过 3 个步骤
- 必填字段 ≤ 4 项

---

### F3: Service Session Recording

| Attribute | Value |
|-----------|-------|
| Priority | P0 |
| Owner | Shared |
| Depends On | F1 (Customer), F2 (Profile), Store + Staff (Store Local) |
| Sprint | Sprint 2–3 |

**Description:**
- 选择服务类型（健康舱/咨询/检测/其他）
- 关联客户和健康关注
- 记录服务时间、执行员工
- 记录员工服务前后观察
- 记录客户当场反应
- 服务完成自动追加 Timeline Entry
- 涉及实体：Service Session, Store, Staff, Health Timeline

**Acceptance:**
- 服务记录可在 2 分钟内完成
- 必填字段 ≤ 5 项

---

### F4: Customer Feedback Capture

| Attribute | Value |
|-----------|-------|
| Priority | P0 |
| Owner | Shared |
| Depends On | F3 (Service Session) |
| Sprint | Sprint 3 |

**Description:**
- 关联到具体服务记录
- 快速记录客户感受（舒适度变化、满意度）
- 记录客户问题或疑虑
- 记录客户回访意愿
- 涉及实体：Service Session (customer_feedback 字段)

**Acceptance:**
- 反馈录入不超过 1 分钟
- 必填字段 ≤ 3 项

---

### F5: Follow-Up Task Management

| Attribute | Value |
|-----------|-------|
| Priority | P0 |
| Owner | Shared |
| Depends On | F3 (Service Session), F4 (Feedback) |
| Sprint | Sprint 3 |

**Description:**
- 基于服务记录创建随访任务
- 设定随访方式（电话/微信/短信/到店）、计划时间、负责人
- 记录随访结果
- 标记任务状态（pending/in_progress/completed）
- 未完成的随访任务在 Dashboard 显示
- 涉及实体：Health Plan (follow_up_schedule), Service Session

**Acceptance:**
- 服务完成后自动提示创建随访
- Dashboard 显示今日待随访客户

---

### F6: AI Summary (Service + Follow-Up)

| Attribute | Value |
|-----------|-------|
| Priority | P0 |
| Owner | AI |
| Depends On | F3 (Service Session), F4 (Feedback), AI Capability, Knowledge Base |
| Sprint | Sprint 4 |

**Description:**
- 基于服务记录和反馈生成客户上下文摘要
- 生成服务摘要（发生了什么）
- 生成随访建议（何时、说什么）
- 标注不确定性和信息来源
- AI 输出明确标记为 "AI 生成"
- Staff 可查看、编辑 AI 摘要再保存
- 涉及实体：AI Conversation, AI Capability, Health Timeline
- 涉及 Capability：summarize_timeline, suggest_follow_up

**Acceptance:**
- AI 摘要生成不超过 5 秒
- Staff 可一键触发、一键编辑
- AI 输出始终标注来源和置信度

---

### F7: Store Staff Authorization

| Attribute | Value |
|-----------|-------|
| Priority | P0 |
| Owner | Platform |
| Depends On | Store + Staff entities |
| Sprint | Sprint 2 |

**Description:**
- Staff 使用账号密码登录 Store Workbench
- 基于 Store 归属区分访问范围（Staff 只能看自己门店数据）
- 简单的 JWT token 认证（不实现复杂 RBAC）
- MVP 不设细粒度权限（店长和员工同等查看权限）
- 涉及实体：Staff, Store

**Acceptance:**
- Staff 登录后可访问本店客户数据
- Staff 不能访问其他门店数据
- Token 过期后需重新登录

---

### F8: Event Logging & Timeline

| Attribute | Value |
|-----------|-------|
| Priority | P0 |
| Owner | Shared |
| Depends On | F1 (Identity), RFC-001 Health Timeline |
| Sprint | Sprint 2–3 |

**Description:**
- 以下事件自动写入 Health Timeline：
  - 健康元激活
  - 健康档案更新
  - 服务完成
  - 反馈记录
  - AI 对话摘要
  - 随访状态变更
- Timeline 只追加、不可修改/删除
- 涉及实体：Health Timeline (含 Timeline Entry Value Object)

**Acceptance:**
- 每个业务事件自动产生 Timeline Entry
- Timeline 记录不可手动修改

---

### F9: Store Workbench — Minimum Screens

| Attribute | Value |
|-----------|-------|
| Priority | P0 |
| Owner | Store |
| Depends On | F1–F8, ADR-002 (Web SPA) |
| Sprint | Sprint 2–4 |

**Description:**

基于 PRODUCT-003 的 10 屏精简为 **6 屏最小手动闭环**：

| # | Screen | 对应 Feature |
|---|--------|-------------|
| S1 | Customer Search / Create | F1 |
| S2 | Customer 健康元 Summary | F1, F2 |
| S3 | Health Concern Intake | F2 |
| S4 | Service Record | F3 |
| S5 | Feedback Record | F4 |
| S6 | Follow-Up Task | F5 |

附加屏幕（AI 和运营相关，手动闭环验证后接入）：
| S7 | AI Summary Panel | F6 |
| S8 | Operator Review | 运营验证 |

**Acceptance:**
- 6 屏可完成完整手动闭环（无 AI 辅助）
- 每屏操作 < 2 分钟
- Staff 无需培训即可完成基本操作

---

## 5. Nice to Have (P1)

P1 = 如果有余力，提升体验和完整性。但缺失不阻塞闭环。

### F10: Customer PWA

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Owner | Platform |
| Depends On | F1 (Health Identity), F6 (AI Summary) |
| Sprint | Sprint 5 |

**Description:**
- 客户通过手机浏览器访问 PWA
- 查看自己的 健康元 摘要
- 查看服务历史
- 查看健康计划（如果有）
- 接收随访提醒

**Defer rationale：** 闭环可以通过到店 + Staff 操作完成；客户自服务是增强而非必需。

---

### F11: Knowledge Entry Management

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Owner | Platform |
| Depends On | Knowledge Base entity |
| Sprint | Sprint 4 |

**Description:**
- 创建/编辑/发布 Knowledge Entry
- 按分类浏览（服务/设备/随访/健康指导/运营）
- 在 Store Workbench 中查看知识条目（Screen S9 per PRODUCT-003）
- AI Companion 可检索知识库回答客户问题

**Defer rationale：** MVP 可以手工回答客户问题；知识库可逐步建设。

---

### F12: Upload Asset (检测报告图片)

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Owner | Shared |
| Depends On | F1 (Identity), File Store |
| Sprint | Sprint 5 |

**Description:**
- Staff 可为客户上传检测报告图片
- 文件存储到 Local File System
- 元数据写入 Platform DB
- 自动追加 Timeline Entry

**Defer rationale：** MVP 通过文本记录即可；图片上传是 nice to have。

---

### F13: Dashboard / Today's Tasks

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Owner | Store |
| Depends On | F5 (Follow-Up), F3 (Service Session) |
| Sprint | Sprint 4 |

**Description:**
- 显示今日待随访客户列表
- 显示近期服务记录
- 显示未完成的操作提醒
- 快速入口：查找客户 / 创建客户

**Defer rationale：** 优先确认单条闭环可用；Dashboard 在闭环验证后加入。

---

### F14: Operator Review Screen

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Owner | Platform |
| Depends On | F3 (Service), F4 (Feedback), F5 (Follow-Up) |
| Sprint | Sprint 5 |

**Description:**
- 查看近期活跃客户列表
- 查看服务记录和反馈统计
- 查看随访完成率
- 识别闭环断裂点

**Defer rationale：** Founder 可通过直接查看数据验证；专用运营屏在闭环确认后开发。

---

## 6. Out of Scope (P2 / Explicitly Excluded)

以下功能明确不在 MVP 范围内。来源：Constitution §12, PROJECT-MEMORY §12, ARCH-000 §13。

| # | Feature | Why Excluded | Future |
|---|---------|-------------|--------|
| X1 | 微信小程序 | 平台绑定；PWA 先验证 | Post-MVP |
| X2 | 原生 App (iOS/Android) | PWA 足够 | Post-MVP |
| X3 | 多店 SaaS | MVP 单店 | Post-MVP |
| X4 | 支付系统 | 非第一闭环 | Post-MVP |
| X5 | 复杂 CRM | MVP 不是 CRM | Post-MVP |
| X6 | 商城 / 产品 SKU | 产品不应主导系统 | Post-MVP |
| X7 | 加盟商管理 | 非 MVP | Post-MVP |
| X8 | BI 仪表盘 | Operator Review 足够 | Post-MVP |
| X9 | 自动诊断 | Constitution 明确禁止 | Never |
| X10 | Token / 区块链 | Constitution 排除 | Never |
| X11 | Full RAG + Vector DB | ADR-002 Deferred | Post-MVP |
| X12 | Docker 部署 | ADR-002 Deferred | Post-MVP |

---

## 7. Acceptance Criteria

### 7.1 MVP Ship Criteria

| # | 条件 | 验证方式 |
|---|------|---------|
| AC1 | 1 位真实客户完成完整闭环（到店→服务→记录→反馈→随访→回访） | 真实门店操作 |
| AC2 | Staff 可在工作日完成完整操作流程（6 屏） | Staff 用时记录 |
| AC3 | AI Summary 生成并在 Staff 审核后存入 Timeline | 数据检查 |
| AC4 | Follow-Up Task 创建并标记完成 | 数据检查 |
| AC5 | Health Timeline 记录每个关键事件 | 数据检查 |
| AC6 | 无数据丢失（所有 Service Session 可追溯） | 审计检查 |
| AC7 | Staff 主观评估：系统未阻塞服务 | Staff 访谈 |

### 7.2 MVP Do-Not-Ship Criteria

| # | 条件（出现任一即不发布） |
|---|----------------------|
| NS1 | Staff 无法完成手动闭环 |
| NS2 | 数据丢失或 Timeline 不完整 |
| NS3 | AI 输出未经标记（混淆事实和 AI 推断） |
| NS4 | 客户数据未经授权可被跨店访问 |

---

## 8. Milestone

### Sprint Plan

| Sprint | Focus | P0 Features | P1 Features | Output |
|--------|-------|-------------|-------------|--------|
| Sprint 2 | Foundation | F1 (Identity), F2 (Profile), F7 (Auth), F8 (Timeline) | — | Platform API + Store DB |
| Sprint 3 | Manual Loop | F3 (Service), F4 (Feedback), F5 (Follow-Up) | — | 可完成手动闭环 |
| Sprint 4 | AI Integration | F6 (AI Summary) | F11 (Knowledge), F13 (Dashboard) | AI 辅助闭环 |
| Sprint 5 | Polish & Validate | — | F10 (PWA), F12 (Upload), F14 (Review) | 真实门店验证 |

### Timeline (目标)

| Milestone | Target | Definition |
|-----------|--------|------------|
| M1: Architecture Freeze | 2026-06-28 | ✅ 已完成（ARCH-000 Approved） |
| M2: Sprint 2 Done | TBD | Platform API + Store DB + Identity 可用 |
| M3: Sprint 3 Done | TBD | 手动闭环可用 |
| M4: Sprint 4 Done | TBD | AI 辅助可用 |
| M5: MVP Validated | TBD | 真实门店闭环完成 |

> Sprint 的绝对日期由 Release & PM 与 Founder 确定后填入。

---

## 9. Release Definition

### REL-005: MVP Release

**发布内容：**
- Platform API（Health Identity, Timeline, Knowledge Base API）
- Store API（Service Session, Follow-Up, 门店数据）
- Store Workbench Web SPA（6 屏最小集 + AI Summary Panel）
- AI Summary Capability（summarize_timeline, suggest_follow_up）
- Store DB（SQLite）+ Platform DB（PostgreSQL）

**发布条件（必须全部满足）：**
- [ ] 全部 P0 Features 完成
- [ ] 全部 Acceptance Criteria 通过
- [ ] 无 Do-Not-Ship 条件触发
- [ ] 真实门店验证完成（≥1 位客户完成完整闭环）
- [ ] Founder 批准发布

**发布方式：** 手动部署（Nginx + systemd），不自动部署。

**回滚方案：** 保留部署前的 git tag + 数据库备份。

---

## 10. Risks

| # | Risk | Severity | Mitigation |
|---|------|----------|------------|
| R1 | Staff 不接受系统——流程太复杂 | High | 最小字段设计；真实 Staff 参与 S2–S4 测试 |
| R2 | AI Summary 质量差——Staff 不信任 | Medium | AI 输出始终可编辑；不确定性标注；S4 重点迭代 |
| R3 | 单店无法代表多店场景 | Medium | 明确 MVP 目标为"验证闭环"，非"验证规模化" |
| R4 | Sprint 2 基础设施耗时超预期 | Medium | 最小技术栈（FastAPI + SQLite）；ORM 降低数据库切换成本 |
| R5 | 客户不关心 健康元——闭环无驱动力 | Medium | 健康元 不是客户可见的 "产品"——Staff 通过服务体验传递价值 |
| R6 | PWA 在中国市场的兼容性 | Low | 目标用户通过浏览器访问；PWA 是渐进增强 |
| R7 | Founder 在 Sprint 执行中修改 MVP 范围 | Medium | PRD-001 批准后，范围变更走 Founder Office + 新 PRD |

---

## 11. Dependencies

```
PRD-001
  ├── Constitution v1.0 (Approved)
  ├── ARCH-000 (Approved)
  ├── RFC-001 (Proposed → 需批准)
  ├── RFC-002 (Proposed → 需批准)
  ├── ADR-002 (Proposed → 需批准)
  ├── PRODUCT-002 (Store Workflow Baseline)
  └── PRODUCT-003 (Screen List Baseline)
```

PRD-001 批准后：
```
PRD-001 (Approved)
  ↓
Sprint 2 Planning
  ↓
Implementation
```

---

## 12. End of Document

PRD-001 defines the Health One MVP: what to build, in what order, for whom, and how to know when it's done.

After approval, this document becomes the product baseline for Sprint 2–5 implementation.

No feature outside this PRD may enter the MVP without Founder approval and a PRD revision.
