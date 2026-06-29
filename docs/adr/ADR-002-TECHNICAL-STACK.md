# ADR-002 Technical Stack Decision

Document ID : ADR-002
Title       : Health One Technical Stack Decision
Version     : 1.0
Status      : Proposed
Owner       : Architecture Office
Created     : 2026-06-28
Depends On  : Constitution v1.0, ARCH-000 (Approved), RFC-001, RFC-002, Legacy Runtime Report, FD-005
Related     : ADR-001 (Initial Architecture Principles), ADR-001-legacy-migration

---

## 1. Status

Proposed — 待 Founder 批准。

---

## 2. Context

Health One 已完成：
- RFC-001 领域模型（14 个核心对象）
- ARCH-000 核心架构审查（Platform / Store Local / Shared 三层）
- RFC-002 数据模型（Platform DB / Store DB / File Store）

当前需要选定技术栈以支持 M1 之后的 Sprint 2 实现。

约束：
- M1 Architecture Freeze 之后才能开始编码
- MVP 范围：单店、单服务场景、6 屏 Store Workbench
- FD-005 Legacy Freeze：不复制 Legacy 代码和技术栈
- Legacy 运行时可作为模式参考（Nginx + systemd 已验证），不复制配置
- Constitution: AI First, Local First, Modular Design, 最小必要

---

## 3. Decision

### 3.1 Backend — Python / FastAPI / Uvicorn

| Item | Decision | Version / Notes |
|------|----------|-----------------|
| Language | Python | 3.12+ |
| Framework | FastAPI | latest stable |
| ASGI Server | Uvicorn | production mode |
| Validation | Pydantic v2 | 内置于 FastAPI |
| Async | asyncio + httpx | 用于外部 API 调用（LLM Provider 等） |
| API Docs | OpenAPI (auto) | FastAPI 自动生成 |
| Auth (MVP) | python-jose (JWT) | 简单 JWT；完整 Auth 方案见 RFC Security |

**Why now：**
- Python 是 AI 原生语言——所有主流 LLM SDK（Anthropic、OpenAI）均为 Python-first
- FastAPI 提供 async 支持、自动 OpenAPI 文档、Pydantic 验证——与领域模型的数据契约天然对齐
- FastAPI + Uvicorn 性能足以支撑 MVP 并发需求
- 学习曲线低，适合小团队快速迭代

**Why not alternatives：**

| Alternative | Rejection Reason |
|-------------|-----------------|
| Node.js / Express | 非 AI 原生；JS 生态在 LLM/RAG/Embedding 方面弱于 Python |
| PHP / Laravel | Legacy 技术栈（3号工程为 PHP）；FD-005 禁止复制 Legacy |
| Go / Gin | 性能过剩；AI 生态不成熟；MVP 开发速度慢于 Python |
| Java / Spring Boot | 过重；不适合 MVP 快速迭代 |
| Ruby on Rails | AI 生态弱；国内社区小 |

**Migration Impact：**
- 无——全新开发。Legacy（PHP）已冻结，不迁移代码。

---

### 3.2 Database — SQLite (Store) + PostgreSQL (Platform)

| Component | Database | Rationale |
|-----------|----------|-----------|
| Store DB | SQLite | 每店独立数据库文件，零配置，嵌入式 |
| Platform DB | PostgreSQL | 共享数据，并发访问，JSONB 支持 |
| File Meta | PostgreSQL | 与 Platform 同库，上传资产元数据 |

**Why SQLite for Store：**
- Local First 原则——Store 拥有本地数据
- 零运维——不需要独立数据库进程；SQLite 文件随 Store 服务启动
- MVP 单店场景——写入并发低，SQLite 完全足够
- 迁移简单——单文件备份/恢复
- Legacy 多实例模式已验证"每店独立"的合理性

**Why PostgreSQL for Platform：**
- 共享数据——Health Identity、Timeline、Knowledge Base 被多 Store 并发访问
- JSONB——健康数据（Profile、Assessment、Timeline Entry）的半结构化特性需要灵活的 JSON 支持
- 全文搜索——知识库检索（RAG 的 keyword fallback）
- 成熟生态——Python async 驱动（asyncpg）、迁移工具（Alembic）

**Why not alternatives：**

| Alternative | Rejection Reason |
|-------------|-----------------|
| 全部 SQLite | Platform 需要并发写入（多 Store + AI）；SQLite 写锁是瓶颈 |
| 全部 PostgreSQL | 每 Store 部署 PostgreSQL 实例过重；违反 Local First 简洁性原则 |
| MySQL | PostgreSQL JSONB 优于 MySQL JSON；Python 生态 asyncpg 优于 MySQL 驱动 |
| MongoDB | 健康数据需要关系约束（FK、聚合一致性）；文档 DB 不适合 |
| SQLite + MySQL | 不必要增加运维复杂度；PostgreSQL 在 Platform 层足够 |

**Migration Impact：**
- 无——全新 schema 从 RFC-002 导出。Legacy（MySQL）已冻结。
- 注意：Legacy 生产数据在 MySQL 中。未来数据迁移（Legacy MySQL → PostgreSQL Platform DB）需要独立的 ADR Legacy Migration。

---

### 3.3 Frontend — Web SPA + PWA

| Component | Decision | Rationale |
|-----------|----------|-----------|
| Store Workbench | Web SPA | Staff 在门店桌面浏览器使用；6–10 屏 |
| Customer App | PWA | 跨平台（iOS/Android/Desktop），无需应用商店审核 |
| Framework | React 或 Vue | 待 Product Office 确认 UI 方向后决定 |
| UI Kit | TBD | 需支持中文、移动端适配 |

**Why now：**
- Store Workbench 是 MVP 必要条件（RFC-001 价值闭环依赖门店使用）
- PWA 让客户立即在手机上使用，无需等待 App Store 审核
- Web SPA 开发速度最快

**Why not alternatives：**

| Alternative | Rejection Reason |
|-------------|-----------------|
| 微信小程序 | 强绑定微信生态；MVP 阶段不应引入平台依赖性。注：可作为 PWA 之后的第二客户端 |
| React Native / Flutter | MVP 不需要原生能力（相机、推送、蓝牙）；PWA 足够 |
| SSR (Next.js / Nuxt) | MVP 不需要 SEO；SPA 更简单 |
| 纯服务端渲染 (MPA) | AI 交互体验需要客户端状态管理 |

**Future：** 微信小程序和原生 App 作为 post-MVP 扩展方向。

---

### 3.4 AI — LLM Provider Abstraction / RAG / Embedding / Vector Store

| Component | Decision | Detail |
|-----------|----------|--------|
| LLM Provider | 抽象层（Provider Interface） | 支持 Anthropic Claude（primary）和 OpenAI 兼容 provider |
| LLM SDK | anthropic + openai (Python) | 两个官方 SDK，Provider 层封装 |
| RAG | Simple RAG（Keyword + Embedding） | MVP 知识库 < 100 条；简单检索足够 |
| Embedding | Provider API | Voyage AI (Claude 推荐) 或 OpenAI embeddings |
| Vector Store | **不引入（Defer）** | MVP 不引入专用向量数据库 |

**LLM Provider Abstraction——Why now：**
- Claude API（Anthropic）作为 primary——ARCH-000 和 Constitution 已经基于 Claude 生态设计 AI 能力
- 抽象层从 day 1 建立——避免 vendor lock-in；后续切换 provider 只需实现 interface
- Provider Interface 定义：
  ```
  chat(messages, context, tools) → response
  embed(text) → vector
  ```
- 实现：AnthropicProvider、OpenAICompatibleProvider

**RAG——Why now：**
- AI Companion 需要从 Knowledge Base 检索内容回答客户问题
- MVP 知识库规模小（< 100 条目），Keyword Search + Embedding Similarity 足够
- 不引入 LangChain / LlamaIndex 等重型框架——MVP 用原生 SDK + 简单检索即可
- RAG 流程：Query → Embed → Top-K Retrieval → Prompt Assembly → LLM Response

**Embedding——Why now：**
- RAG 依赖 Embedding 做语义检索
- 使用 Provider API（远端），不部署本地 Embedding 模型——减少 MVP 运维负担

**Vector Store——Why NOT now：**
- 专用向量数据库（Pinecone、Weaviate、Milvus、pgvector）引入运维复杂度
- MVP 知识库条目少，in-memory cosine similarity 或简单的 PostgreSQL 存储即可
- PostgreSQL 的 `pgvector` 扩展可作为未来选项——当前不需要
- Constitution 明确："Advanced RAG should wait until knowledge structure is clear"

**Why not alternatives：**

| Alternative | Rejection Reason |
|-------------|-----------------|
| LangChain | 过重；MVP 只需简单的 API 调用 + keyword search |
| Local LLM (Ollama) | MVP 运维负担；云 API 延迟可接受 |
| 专用 Vector DB | 过早优化；知识库规模未到需要专用存储的阶段 |
| 不做 Provider 抽象 | Vendor lock-in；后续切换 provider 成本高 |
| OpenAI only | Anthropic Claude 已被项目选为 Architecture Office 工具；统一生态 |

---

### 3.5 Storage — Local File Storage

| Component | Decision | Detail |
|-----------|----------|--------|
| Upload Asset | Local File System | /data/health-one/uploads/ |
| Database Backup | SQLite .dump + pg_dump | cron 定时备份 |
| Object Storage | **Defer** | S3 / MinIO post-MVP |

**Why Local File Storage now：**
- MVP 单服务器——不需要分布式文件存储
- Upload Asset 量少（检测报告图片）——本地磁盘足够
- 简单——不需要配置 S3/MinIO bucket、IAM、预签名 URL
- Object Storage 接口抽象仍应预留——后续迁移成本低

**Why not Object Storage now：**
- MVP 单机部署，不需要 CDN 分发或多机共享
- 引入 Object Storage 增加运维和配置复杂度

**Future：** 文件存储接口抽象为 `FileStore` interface；MVP 实现 `LocalFileStore`；post-MVP 增加 `S3FileStore`。

---

### 3.6 Deployment — Nginx + systemd (Docker Deferred)

| Component | Decision | Detail |
|-----------|----------|--------|
| Reverse Proxy | Nginx | SSL termination, routing, static files |
| Service Manager | systemd | 每个服务一个 unit file |
| Containerization | **Docker — Defer** | 不在 M1 引入 |
| OS | Ubuntu / Debian LTS | 与 Legacy 服务器一致 |

**Why Nginx + systemd now：**
- Legacy 已验证此模式在生产环境稳定运行
- 简单、透明——systemd unit 文件易于理解和调试
- 不引入容器构建、镜像仓库、编排的复杂性
- Platform 服务（API）+ Store 服务（每店独立）的架构与 Legacy 多实例模式一致

**Why NOT Docker now：**

| Reason | Detail |
|--------|--------|
| MVP 单服务器 | 不需要容器编排（K8s/Swarm） |
| 增加构建步骤 | Dockerfile + image build + registry 增加 CI/CD 复杂度 |
| 调试成本 | 容器内调试比进程直接调试复杂 |
| 学习成本 | 团队需要 Docker 知识 |
| 可后补 | 应用代码不依赖 Docker；后续容器化成本低 |

**Future：** Docker Compose 或 Docker Swarm 作为 post-MVP 标准化部署方案。

**Service Layout（参考 Legacy Runtime 模式）：**

```
Nginx (:443)
├── /api/*        → platform-api:8000    (FastAPI + Uvicorn)
├── /store/001/*  → store-001:8010       (FastAPI + Uvicorn + SQLite)
└── /             → static files         (Store Workbench SPA)
```

仅在 M1 之后实现时生效。详细部署方案见 ADR Infrastructure。

---

### 3.7 Testing — pytest + Playwright

| Component | Decision | Detail |
|-----------|----------|--------|
| Unit Test | pytest | + pytest-asyncio, pytest-cov |
| API Test | httpx (async) | 内置于 pytest |
| E2E (Store Workbench) | Playwright | 浏览器自动化；验证门店工作流 |
| E2E (API) | pytest + httpx | 端到端 API 测试 |

**Why pytest：**
- Python 标准测试框架
- async 支持成熟（pytest-asyncio）
- Fixture 系统适合数据库、API client 等依赖注入
- 与 FastAPI 的 TestClient 集成

**Why Playwright：**
- 现代浏览器自动化标准
- 多浏览器支持（Chromium / Firefox / WebKit）
- 自动等待、trace viewer、screenshot——降低调试成本
- Store Workbench 的门店工作流必须在真实浏览器中验证

**Why not alternatives：**

| Alternative | Rejection Reason |
|-------------|-----------------|
| unittest | 功能弱于 pytest；无 async 原生支持 |
| Selenium | Playwright 更快、更现代、调试体验更好 |
| Cypress | Python 生态集成不如 Playwright（Playwright 有 Python 绑定） |

---

### 3.8 CI/CD — GitHub Actions (从 M1 开始)

| Component | Decision | Detail |
|-----------|----------|--------|
| CI Platform | GitHub Actions | 内置于 GitHub，零额外配置 |
| Lint | ruff | Python lint + format，极快 |
| Type Check | mypy (optional) | 渐进引入 |
| Test | pytest | 每次 push / PR 触发 |
| E2E | Playwright | PR 触发（可选，较慢） |
| Deploy | **Manual (MVP)** | 不自动部署到生产 |

**Why GitHub Actions now：**

| Reason | Detail |
|--------|--------|
| 防止回归 | 从第一行代码就开始自动化检查 |
| 零成本 | GitHub 公开仓库免费 |
| 低配置 | YAML workflow 文件，30 分钟内可完成配置 |
| 门禁 | PR 合并前必须通过 lint + test |

**MVP Workflow：**

```yaml
name: CI
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: astral-sh/ruff-action@v1
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip install -r requirements.txt
      - run: pytest --cov
```

**Why NOT auto-deploy now：**
- MVP 部署需 Founder 审批（Governance §14）
- 生产真实门店——自动部署风险不可接受
- 手动部署配合 Release Note 流程即可

---

## 4. Decision Summary

```
┌─────────────────────────────────────────────────────────────┐
│                  Health One v1 Tech Stack                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Frontend                                                   │
│  ├── Store Workbench : Web SPA (React/Vue)                  │
│  └── Customer App    : PWA                                 │
│                                                             │
│  Backend                                                    │
│  ├── Language : Python 3.12+                                │
│  ├── Framework: FastAPI                                     │
│  └── Server  : Uvicorn                                      │
│                                                             │
│  Database                                                   │
│  ├── Store DB    : SQLite (per store)                       │
│  └── Platform DB : PostgreSQL                               │
│                                                             │
│  AI                                                         │
│  ├── Provider    : Claude API (primary) + abstraction layer │
│  ├── RAG         : Simple (keyword + embedding)             │
│  ├── Embedding   : Provider API                             │
│  └── Vector Store: DEFERRED                                 │
│                                                             │
│  Storage                                                    │
│  └── Upload Asset: Local File System                        │
│                                                             │
│  Deployment                                                 │
│  ├── Reverse Proxy: Nginx                                   │
│  ├── Service Mgmt : systemd                                 │
│  └── Containers   : DEFERRED (Docker post-MVP)              │
│                                                             │
│  Testing                                                    │
│  ├── Unit/API : pytest + httpx                              │
│  └── E2E      : Playwright                                  │
│                                                             │
│  CI/CD                                                      │
│  └── GitHub Actions (lint + test on push/PR)                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Consequences

### Positive

1. **Fast MVP velocity.** Python/FastAPI + SQLite 的最小技术栈——开发速度最快。
2. **AI-native.** Python 生态与 LLM SDK、Embedding、RAG 工具无缝集成。
3. **Local First 实现简单。** SQLite 完美支持每店独立数据库。
4. **运维简单。** Nginx + systemd 已验证；无 Docker/K8s 学习成本。
5. **Legacy 模式继承。** 多实例 + systemd 模式在 Legacy 已验证有效。
6. **CI 从第一天建立。** GitHub Actions 防止早期回归。

### Negative

1. **SQLite 不适合高并发写入。** 当单个 Store 需要大量并发写入时需迁移到 PostgreSQL 或增强 SQLite WAL 模式。MVP 阶段不受影响。
2. **无 Docker 统一环境。** 开发环境依赖本地 Python/database 安装。可通过 venv + Makefile 减轻。
3. **PWA 非原生体验。** 客户端的性能、推送通知不如原生 App。MVP 阶段可接受。
4. **单服务器。** 后续扩展需要引入负载均衡和多机部署。

---

## 6. Risks

| # | Risk | Severity | Mitigation |
|---|------|----------|------------|
| RK1 | SQLite Store DB 后续迁移到 PostgreSQL 成本 | Medium | 使用 SQLAlchemy/Alembic 作为 ORM 抽象层；dialect 切换成本低 |
| RK2 | LLM Provider 抽象层过度设计 | Low | 仅需 chat() 和 embed() 两个方法；YAGNI |
| RK3 | 不引入 Docker 导致环境一致性差 | Medium | venv + requirements.txt + Makefile 提供一致的本地环境 |
| RK4 | PWA 在中国市场的实际接受度 | Medium | 保留微信小程序作为 post-MVP 第二客户端选项 |
| RK5 | PostgreSQL 运维复杂度（vs all-SQLite） | Low | 单一 PostgreSQL 实例；托管服务（Supabase / RDS）可选 |
| RK6 | LLM API 延迟影响用户体验 | Medium | async 调用 + streaming response；AI Companion 响应采用 SSE |
| RK7 | Nginx + systemd 手动部署出错 | Medium | 编写部署 checklist；GitHub Actions 可选 deploy job |

---

## 7. Migration Impact

### From Legacy

| Legacy Component | Legacy Stack | Health One Decision | Migration Strategy |
|-----------------|-------------|--------------------|--------------------|
| 3号工程后端 | PHP (Laravel/ThinkPHP) | Python / FastAPI | 不迁移代码；业务逻辑重新实现 |
| 数据库 | MySQL | PostgreSQL (Platform) + SQLite (Store) | 不迁移 schema；全新设计从 RFC-002 |
| 部署 | Nginx + systemd | Nginx + systemd (same pattern) | 保留模式，不复制配置 |
| 门店服务 | 每店独立实例 (PHP) | 每店独立 FastAPI 实例 | 架构模式继承 |
| AI | 3号工程含部分大模型集成 | Provider 抽象 + RAG | 全新 AI 架构 |

### From Current (health-one)

| Component | Current State | Target State |
|-----------|-------------|--------------|
| Repository | Markdown only | Markdown + Python code (Sprint 2) |
| CI/CD | None | GitHub Actions |
| Database | None | PostgreSQL + SQLite |
| Deployment | None | Nginx + systemd |

---

## 8. Future Evolution

### Post-MVP 升级路径

| Component | MVP (Now) | Post-MVP (Future) |
|-----------|-----------|-------------------|
| Store DB | SQLite | PostgreSQL (if concurrency needed) — ORM abstraction makes this low-cost |
| Platform DB | PostgreSQL | PostgreSQL + read replicas |
| Mobile | PWA | 微信小程序 + 原生 App |
| RAG | Simple (keyword + embedding) | Advanced RAG + pgvector |
| Vector Store | None | pgvector (PostgreSQL extension) |
| Object Storage | Local FS | S3 / MinIO (FileStore abstraction) |
| Containers | None | Docker Compose / Swarm |
| CI/CD | GitHub Actions (lint+test) | + E2E + deploy job (manual trigger) |
| Message Queue | None | Redis / RabbitMQ (跨店事件) |

### 升级原则

- 每次升级通过 ADR 决策
- 不因"未来可能需要"而提前引入
- 抽象层（ORM、FileStore、LLM Provider）降低升级成本

---

## 9. Compliance Check

| Source | Requirement | Status |
|--------|------------|--------|
| Constitution §5.4 | AI Capability Based | ✅ LLM Provider 抽象 + RAG 通过 Capability 调用 |
| Constitution §7.1 | Legacy Migration (继承资产，不堆积) | ✅ 继承 Nginx+systemd 模式，不复制代码 |
| Constitution §7.2 | Modular Design | ✅ Platform API / Store API 独立服务 |
| Constitution §7.4 | Local First | ✅ SQLite per Store；Store 拥有本地数据 |
| Constitution §7.5 | Cloud Coordination | ✅ PostgreSQL Platform DB；平台不接管门店数据 |
| ARCH-000 §5.3 | Data Ownership 三维度 | ✅ SQLite (Store) / PostgreSQL (Platform) 符合存储边界 |
| ARCH-000 §13 | Implementation Gate | ✅ 不引入新领域对象 |
| RFC-001 §5 | Platform / Store Local / Shared 模块 | ✅ 技术栈支持三层部署 |
| RFC-002 §8 | Persistence Boundary | ✅ Platform DB / Store DB / File Store 三层 |
| FD-005 | Legacy Freeze | ✅ 不复制 Legacy 代码/配置/技术栈 |

---

## 10. End of Document

ADR-002 formalizes the Health One v1 technical stack.

All decisions are grounded in RFC-001 (domain model), ARCH-000 (architecture), RFC-002 (data model), and the constraints of Constitution v1.0 and FD-005.

This ADR is Proposed and requires Founder approval before any implementation begins.
