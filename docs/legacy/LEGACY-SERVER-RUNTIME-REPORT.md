# Legacy Server Runtime Report

Document ID : LEGACY-SERVER-RUNTIME
Title       : Legacy Server Runtime Report
Version     : 1.0
Status      : Recorded
Owner       : Founder Office
Created     : 2026-06-28
Related     : SEC-001, SEC-002, FD-003

---

## 1. Purpose

本文档记录 Legacy 生产服务器的真实运行时（Runtime）状态。

Repository 是 Single Source of Truth。Legacy 运行时事实必须在 Repository 中记录后，才能用于架构决策。

---

## 2. Legacy Runtime Source of Truth

**生产服务器运行时事实来源：**

```
/www/server/xixi/
```

该路径是 Legacy 服务器上实际运行的服务根目录。

**注意：** 本机的 3号工程 (`/Volumes/data/MacData/Desktop_Workspace/Current/3号工程`) 是 Legacy 资产库，但其文件状态可能与服务器运行时存在差异。

服务器运行时版本比 3号工程全量目录更接近生产事实。

---

## 3. Service Inventory

| # | Service Name | Working Directory | Port | Application Target |
|---|---|---|---|---|
| 1 | `xixi-hq.service` | `/www/server/xixi/hq` | 8001 | `identity_sync:app` |
| 2 | `xixi-admin.service` | `/www/server/xixi/admin` | 8002 | `admin_service:app` |
| 3 | `xixi-store-001.service` | `/www/server/xixi/stores/store_001` | 8010 | `store_service:app` |
| 4 | `xixi-store-002.service` | `/www/server/xixi/stores/store_002` | 8011 | `store_service:app` |
| 5 | `xixi-store-003.service` | `/www/server/xixi/stores/store_003` | 8012 | `store_service:app` |
| 6 | `nginx` | (system) | 443 / 8080 | reverse proxy |

### Service Architecture

```
nginx (443 / 8080)
├── /hq/*        → xixi-hq:8001        (identity_sync)
├── /admin/*     → xixi-admin:8002      (admin_service)
├── /store/001/* → xixi-store-001:8010  (store_service)
├── /store/002/* → xixi-store-002:8011  (store_service)
└── /store/003/* → xixi-store-003:8012  (store_service)
```

---

## 4. Key Conclusions

1. **服务器真实运行版本比 3号工程全量目录更接近生产事实。**
   3号工程仍为 Legacy 资产库，但运行事实以 `/www/server/xixi/` 为准。

2. **3号工程与服务器运行时可能存在差异。**
   任何基于 3号工程的架构判断，必须先与服务器运行时状态交叉验证。

3. **服务采用多实例部署模式。**
   每个门店 (`store_001`, `store_002`, `store_003`) 作为独立服务实例运行，
   这与 Constitution §7.4 (Local First) 的方向一致。

4. **总部服务与门店服务分离。**
   `hq` (总部 identity_sync) 和 `admin` (管理后台) 独立于门店服务，
   这种分离模式在 Health One v2 中应保留和规范化。

---

## 5. Migration Impact

Health One v2 迁移时必须遵循以下原则：

| # | Principle | Rationale |
|---|---|---|
| 1 | 迁移参考服务器 runtime，不能只参考本机 3号工程 | 服务器是生产真相；3号工程可能是过时快照 |
| 2 | 从 `/www/server/xixi/` 提取业务逻辑时，需逐模块审查 | 运行时包含生产配置和临时修复，不保证代码质量 |
| 3 | 多门店多实例模式在 v2 中规范化 | Legacy 的多实例部署已验证；v2 应正式化为 Store OS 模式 |
| 4 | 不直接复制运行时配置到 health-one | 运行时配置包含密钥和敏感信息（参见 SEC-001, SEC-002） |
| 5 | 不假设 3号工程目录结构 == 服务器运行结构 | 两者可能已分叉；运行结构为准 |

---

## 6. Related Documents

- SEC-001: Legacy PEM key/certificate committed to Git history
- SEC-002: Runtime secrets exposed in systemd service files
- FD-003: Repository First
- `docs/legacy/` — Legacy 资产目录

---

## 7. End of Document

LEGACY-SERVER-RUNTIME-REPORT.md records the verified runtime state of the Legacy production server as of 2026-06-28.

This document should be updated if the server runtime structure changes before migration is complete.
