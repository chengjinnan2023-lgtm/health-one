# Commit Rules v1.0

## Status
Accepted Draft

## Owner
Founder Office

## Effective Date
2026-06-28

---

## Purpose

本文件定义 Health One 项目的 Git 提交规则。

所有提交必须遵守本文件。未经批准的提交将被拒绝。

---

## 1. 核心规则：未经审批，不得 commit

### Claude Code 限制

**Claude Code 在 Health One 主仓库中，未经 Founder Office 明确审批，不得执行 `git commit`。**

这意味着：

- 可以修改文件（在已批准任务范围内）
- 可以 `git add` 暂存文件
- 可以检查 `git status`
- 可以检查 `git diff`
- **但不得执行 `git commit` 和 `git push`，除非 Founder Office 明确指示**

### 审批流程

```
Claude Code 完成任务
    ↓
输出任务完成报告
    ↓
Founder Office 审查
    ↓
Founder Office 批准 commit
    ↓
执行 commit（按本文件格式）
```

---

## 2. Commit Message 格式

### 标准格式

```
type(scope): summary
```

### 格式说明

- **type**：提交类型（见下方可选值）
- **scope**：影响范围，使用模块名或目录名
- **summary**：简短摘要，描述做了什么

### 示例

```
docs(workflow): add boot protocol v1.0
feat(health-identity): implement health identity creation
fix(api): correct appointment timezone handling
refactor(store): extract store service interface
test(qa): add health timeline verification tests
chore(deps): update dependency versions
arch(adr): add data storage strategy decision
```

---

## 3. Commit Type 可选值

| Type | 含义 | 示例 |
|------|------|------|
| `docs` | 文档变更 | `docs(workflow): add task rules` |
| `arch` | 架构决策 | `arch(adr): accept ADR-003 data model` |
| `feat` | 新功能 | `feat(appointment): add appointment booking` |
| `fix` | Bug 修复 | `fix(ai): correct analysis output format` |
| `refactor` | 代码重构 | `refactor(store): simplify service layer` |
| `test` | 测试相关 | `test(integration): add store api tests` |
| `chore` | 构建/工具/依赖 | `chore(ci): update build pipeline` |

### 类型选择规则

- `docs` — 仅涉及文档（`.md` 文件），不涉及代码
- `arch` — 仅涉及 `docs/adr/` 或 `docs/architecture/` 下的架构文档
- `feat` — 新增功能，需有对应 PRD
- `fix` — 修复已实现功能的 Bug
- `refactor` — 不改变功能的代码优化
- `test` — 仅涉及测试代码或 QA 文档
- `chore` — 不涉及业务代码的工程变更

---

## 4. Commit 粒度规则

### 每次 commit 必须小而清晰

- 一个 commit 只做一件事
- 一个 commit 的变更应可在一句话内描述清楚
- 不得将多个无关变更混在一个 commit 中
- 不得 commit 大量文件（除非是合理的批量操作，如文档整理）

### 好的 Commit

```
feat(identity): add health identity creation endpoint
```
→ 只包含健康元创建相关的代码变更

### 坏的 Commit

```
feat: add features and fix bugs
```
→ 范围过大，不可追溯，不可回滚

### 拆分原则

如果 commit message 需要用 "and" 连接多个操作，则应该拆分为多个 commit。

---

## 5. Scope 命名

Scope 应使用以下命名之一：

| Scope | 含义 |
|-------|------|
| `workflow` | 工作流协议文件 |
| `constitution` | 项目宪章 |
| `governance` | 治理规范 |
| `adr` | 架构决策记录 |
| `rfc` | 方案设计 |
| `prd` | 产品需求文档 |
| `identity` | 健康元模块 |
| `store` | 门店模块 |
| `appointment` | 预约模块 |
| `ai` | AI 模块 |
| `api` | API 层 |
| `db` | 数据库 |
| `qa` | 测试 |
| `ci` | CI/CD |
| `deps` | 依赖管理 |

未在以上列表的 scope，需在 commit 前确认。

---

## 6. 禁止提交的内容

以下内容**绝对不得** commit 进 health-one 主仓库：

### 数据库文件
- `*.db` — SQLite 数据库文件
- `*.db-shm` — SQLite 共享内存文件
- `*.db-wal` — SQLite WAL 日志文件
- `*.sqlite` — 任何 SQLite 数据库文件

### 上传文件
- `uploads/` 目录下的用户上传文件
- `storage/` 目录下的运行时存储文件
- 任何包含真实客户数据的文件

### 密钥与证书
- `.env` 文件（含密钥的）
- `*.pem` 私钥文件
- `*.key` 密钥文件
- `*.p12` / `*.pfx` 证书文件
- `credentials.json` / `service-account.json`
- 任何包含 API Key、Secret、Token 的文件

### 系统文件
- `.DS_Store`（macOS）
- `Thumbs.db`（Windows）
- IDE 配置文件（除非已约定共享）
- 编译产物（`dist/`、`build/`、`node_modules/`）

### Legacy 代码
- 不得将 Legacy 工程（3号工程、一号工程）代码直接复制进主仓库
- 所有迁移必须经过 RFC 和 Reuse Matrix

### 检查方法

每次 commit 前必须：

```bash
git status
git diff --staged --name-only
```

确认：
- [ ] 没有数据库文件
- [ ] 没有密钥文件
- [ ] 没有上传文件
- [ ] 没有系统垃圾文件
- [ ] 没有 Legacy 代码
- [ ] 每个文件都在预期范围内

---

## 7. `.gitignore` 要求

仓库 `.gitignore` 应包含以下规则（如缺少，应通过任务补充）：

```gitignore
# Database
*.db
*.db-shm
*.db-wal
*.sqlite

# Environment
.env
.env.*

# Keys & Certs
*.pem
*.key
*.p12
*.pfx
*-key.json

# Uploads
uploads/
storage/app/

# System
.DS_Store
Thumbs.db

# IDE
.idea/
.vscode/
*.swp
*.swo

# Build
dist/
build/
node_modules/
```

---

## Reference

- `BOOT_PROTOCOL.md` — 启动协议
- `CLAUDE_PROTOCOL.md` — Claude Code 职责边界
- `TASK_RULES.md` — 任务执行规则
- `REVIEW_RULES.md` — Review 规则
- `docs/01-GOVERNANCE.md` — 完整治理规则（Section 7: Repository Strategy）
