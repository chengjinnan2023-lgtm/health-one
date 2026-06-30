# PILOT-002 — Deployment Rehearsal Plan

Document ID : PILOT-002
Title       : v0.3.1-rc1 Deployment Rehearsal Plan
Version     : 1.0
Status      : Proposed
Owner       : Release Office
Created     : 2026-06-30
Depends On  : PILOT-001, DEPLOYMENT-CHECKLIST, BACKUP-RESTORE, RC-002

---

## 1. Objective

> **Execute a complete deployment of v0.3.1-rc1 to a store server, verify the manual service loop end-to-end, validate backup/restore, and confirm readiness for live pilot with real customers.**

Success means: the deployed system passes all verification checks, a dry-run manual loop completes without errors, and backup/restore is verified.

---

## 2. Environment Matrix

### Target Server

| Attribute | Minimum | Recommended |
|-----------|---------|-------------|
| OS | Ubuntu 22.04 LTS | Ubuntu 24.04 LTS |
| CPU | 2 cores | 4 cores |
| RAM | 4 GB | 8 GB |
| Disk | 20 GB | 50 GB SSD |
| Network | LAN with internet access | Static IP or domain |
| Python | 3.12 | 3.12+ |
| Node.js | 20 LTS | 22 LTS |
| PostgreSQL | 16 | 16 |
| Nginx | any stable | 1.24+ |

### Access Requirements

- SSH access to server (key-based auth)
- sudo privileges (for package install + systemd)
- Git access to health-one repository
- Browser on local network to test frontend

### Current Known State

| Item | Status |
|------|--------|
| Server provisioned | ❌ TBD |
| IP / domain | ❌ TBD |
| SSL certificate | ❌ TBD (self-signed acceptable for rehearsal) |
| Git access | ✅ |
| Seed credentials | ✅ admin/health123 (CHANGE FOR PRODUCTION) |

---

## 3. Deployment Steps

### Phase 1: OS & Dependencies (Est. 2h)

#### S-001: Server Baseline

| Attribute | Value |
|-----------|-------|
| **Step ID** | S-001 |
| **Owner** | DevOps |
| **Action** | `ssh user@<server-ip>` → verify OS, disk space, RAM |
| **Expected** | Ubuntu 22.04+, `df -h` shows ≥ 20GB free, `free -m` shows ≥ 4GB |
| **Rollback** | N/A — first step |

```bash
ssh user@<server-ip>
uname -a
df -h
free -m
```

#### S-002: Install System Packages

| Attribute | Value |
|-----------|-------|
| **Step ID** | S-002 |
| **Owner** | DevOps |
| **Action** | Install Python 3.12, Node.js 20, PostgreSQL 16, Nginx, git |
| **Expected** | All packages installed without errors |
| **Rollback** | `apt remove` each package |

```bash
sudo apt update
sudo apt install -y python3.12 python3.12-venv python3-pip
sudo apt install -y nodejs npm
sudo apt install -y postgresql postgresql-contrib
sudo apt install -y nginx git curl
python3.12 --version  # → Python 3.12.x
node --version         # → v20.x
pg_isready             # → accepting connections
nginx -v               # → nginx/1.x
```

#### S-003: Start & Configure PostgreSQL

| Attribute | Value |
|-----------|-------|
| **Step ID** | S-003 |
| **Owner** | DevOps |
| **Action** | Start PostgreSQL, create user + database |
| **Expected** | `pg_isready` returns OK, database created |
| **Rollback** | `dropdb health_one_platform; dropuser health_one` |

```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
sudo -u postgres createuser health_one
sudo -u postgres createdb -O health_one health_one_platform
sudo -u postgres psql -c "ALTER USER health_one PASSWORD '<generate-secure-password>';"
pg_isready  # → accepting connections
```

#### S-004: Configure Nginx Base

| Attribute | Value |
|-----------|-------|
| **Step ID** | S-004 |
| **Owner** | DevOps |
| **Action** | Start Nginx, verify default page |
| **Expected** | `curl localhost` returns Nginx welcome page |
| **Rollback** | `sudo systemctl stop nginx` |

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
curl -s localhost | head -5  # → "<!DOCTYPE html>" ... "Welcome to nginx"
```

### Phase 2: Application Deployment (Est. 1h)

#### S-005: Clone Repository

| Attribute | Value |
|-----------|-------|
| **Step ID** | S-005 |
| **Owner** | DevOps |
| **Action** | Clone health-one at v0.3.1-rc1 tag |
| **Expected** | Repository at `/opt/health-one`, on correct tag |
| **Rollback** | `rm -rf /opt/health-one` |

```bash
sudo mkdir -p /opt/health-one
sudo chown $USER:$USER /opt/health-one
git clone <repo-url> /opt/health-one
cd /opt/health-one
git checkout v0.3.1-rc1
git log --oneline -1  # → b3054e1 release(rc): approve v0.3.1 as release candidate
```

#### S-006: Python Environment

| Attribute | Value |
|-----------|-------|
| **Step ID** | S-006 |
| **Owner** | DevOps |
| **Action** | Create venv, install Python dependencies |
| **Expected** | `pip list` shows fastapi, uvicorn, sqlalchemy, etc. |
| **Rollback** | `rm -rf venv` |

```bash
cd /opt/health-one
python3.12 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
python -c "import fastapi; print(fastapi.__version__)"
```

#### S-007: Frontend Build

| Attribute | Value |
|-----------|-------|
| **Step ID** | S-007 |
| **Owner** | DevOps |
| **Action** | Install npm deps, build production bundle |
| **Expected** | `frontend/dist/` contains index.html + assets |
| **Rollback** | `rm -rf frontend/dist frontend/node_modules` |

```bash
cd /opt/health-one/frontend
npm ci
npm run build
ls dist/index.html  # → exists
```

#### S-008: Environment Configuration

| Attribute | Value |
|-----------|-------|
| **Step ID** | S-008 |
| **Owner** | DevOps |
| **Action** | Create `/opt/health-one/.env` with production values |
| **Expected** | `.env` file exists with correct DB URL, JWT secret |
| **Rollback** | `rm .env` |

```bash
cd /opt/health-one
cat > .env << 'EOF'
PLATFORM_DB_URL=postgresql+asyncpg://health_one:<password>@localhost:5432/health_one_platform
JWT_SECRET=<output-of: python3 -c "import secrets; print(secrets.token_urlsafe(32))">
STORE_DB_BASE_PATH=/opt/health-one/data
DEBUG=false
EOF
chmod 600 .env
```

#### S-009: Database Migrations

| Attribute | Value |
|-----------|-------|
| **Step ID** | S-009 |
| **Owner** | DevOps |
| **Action** | Run both Platform and Store DB migrations |
| **Expected** | All migrations applied, no errors |
| **Rollback** | `alembic downgrade base` then re-run |

```bash
cd /opt/health-one
source venv/bin/activate

# Platform DB
cd health_one/platform
alembic upgrade head
# → Running upgrade 001 → 002 → 003

# Store DB
cd ../store
alembic upgrade head
# → Running upgrade → 001

cd /opt/health-one
```

#### S-010: Seed Data

| Attribute | Value |
|-----------|-------|
| **Step ID** | S-010 |
| **Owner** | DevOps |
| **Action** | Run seed script for pilot store + staff |
| **Expected** | "Created store STORE-001 and staff admin" |
| **Rollback** | Delete `data/store-001/store.db`, re-run migration + seed |

```bash
cd /opt/health-one
source venv/bin/activate
PYTHONPATH=. SEED_STAFF_PASSWORD=<secure-pilot-password> \
python -c "import asyncio; from health_one.store.seed import seed; asyncio.run(seed())"
```

#### S-011: systemd Service

| Attribute | Value |
|-----------|-------|
| **Step ID** | S-011 |
| **Owner** | DevOps |
| **Action** | Create and start systemd service for Platform API |
| **Expected** | `systemctl status health-one-platform` shows active |
| **Rollback** | `sudo systemctl stop health-one-platform; sudo systemctl disable health-one-platform` |

```bash
sudo tee /etc/systemd/system/health-one-platform.service << 'EOF'
[Unit]
Description=Health One Platform API
After=network.target postgresql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/health-one
EnvironmentFile=/opt/health-one/.env
ExecStart=/opt/health-one/venv/bin/uvicorn health_one.platform.main:app --host 127.0.0.1 --port 8000
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable health-one-platform
sudo systemctl start health-one-platform
sudo systemctl status health-one-platform
```

#### S-012: Nginx Site Config

| Attribute | Value |
|-----------|-------|
| **Step ID** | S-012 |
| **Owner** | DevOps |
| **Action** | Deploy Nginx config for Health One |
| **Expected** | Frontend + API accessible via Nginx |
| **Rollback** | Remove symlink, `nginx -s reload` |

```bash
sudo tee /etc/nginx/sites-available/health-one << 'EOF'
server {
    listen 80;  # Port 443 after SSL configured
    server_name _;

    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /health {
        proxy_pass http://127.0.0.1:8000;
    }

    location / {
        root /opt/health-one/frontend/dist;
        try_files $uri /index.html;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/health-one /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

---

## 4. Config Checklist

| # | Item | Value Source | Verified? |
|---|------|-------------|-----------|
| C1 | `PLATFORM_DB_URL` | Generated password in S-003 | [ ] |
| C2 | `JWT_SECRET` | `python3 -c "import secrets; print(secrets.token_urlsafe(32))"` | [ ] |
| C3 | `STORE_DB_BASE_PATH` | `/opt/health-one/data` | [ ] |
| C4 | `SEED_STAFF_PASSWORD` | Secure pilot password (NOT "health123") | [ ] |
| C5 | `DEBUG` | `false` | [ ] |
| C6 | PostgreSQL password | Same as in PLATFORM_DB_URL | [ ] |
| C7 | `.env` permissions | `chmod 600` | [ ] |
| C8 | systemd user has read access to `/opt/health-one` | `sudo chown -R www-data:www-data /opt/health-one` | [ ] |

---

## 5. Verification Checklist

### S-013: API Health Check

| Attribute | Value |
|-----------|-------|
| **Step ID** | S-013 |
| **Owner** | DevOps |
| **Action** | `curl http://localhost:8000/health` |
| **Expected** | `{"status":"ok","service":"platform-api","version":"0.2.0"}` |
| **Rollback** | Check systemd logs: `journalctl -u health-one-platform -n 50` |

### S-014: Database Health Check

| Attribute | Value |
|-----------|-------|
| **Step ID** | S-014 |
| **Owner** | DevOps |
| **Action** | `curl http://localhost:8000/health/db` |
| **Expected** | `{"status":"ok","service":"platform-api","platform_db":"ok"}` |
| **Rollback** | Check PostgreSQL: `sudo systemctl status postgresql` |

### S-015: Frontend Serves

| Attribute | Value |
|-----------|-------|
| **Step ID** | S-015 |
| **Owner** | DevOps |
| **Action** | `curl -s http://localhost/ | head -5` |
| **Expected** | HTML with `<title>` and React root div |
| **Rollback** | Check Nginx: `sudo nginx -t`, check dist/ exists |

### S-016: Login Works

| Attribute | Value |
|-----------|-------|
| **Step ID** | S-016 |
| **Owner** | DevOps |
| **Action** | `curl -X POST http://localhost/api/auth/login -H "Content-Type: application/json" -d '{"username":"admin","password":"<pilot-password>"}'` |
| **Expected** | 200 with `access_token` + staff info |
| **Rollback** | Re-run seed script with correct password |

### S-017: Full Manual Loop Dry-Run

| Attribute | Value |
|-----------|-------|
| **Step ID** | S-017 |
| **Owner** | DevOps |
| **Action** | Execute all 8 steps of the manual loop via curl |
| **Expected** | All endpoints return 200/201. 6+ Timeline entries. |
| **Rollback** | Debug individual endpoint. Check `journalctl` for errors. |

### S-018: Auth Enforcement

| Attribute | Value |
|-----------|-------|
| **Step ID** | S-018 |
| **Owner** | DevOps |
| **Action** | `curl http://localhost/api/identities/` (no token) |
| **Expected** | 401 Unauthorized |
| **Rollback** | Restart service, check auth middleware |

### S-019: Browser Test

| Attribute | Value |
|-----------|-------|
| **Step ID** | S-019 |
| **Owner** | DevOps |
| **Action** | Open `http://<server-ip>` in browser → login → complete full loop |
| **Expected** | All 6 screens render, no console errors, data persists on refresh |
| **Rollback** | Check browser console for JS errors |

---

## 6. Backup Drill

### S-020: Execute Backup

| Attribute | Value |
|-----------|-------|
| **Step ID** | S-020 |
| **Owner** | DevOps |
| **Action** | Run backup for both databases |
| **Expected** | Backup files created with non-zero size |
| **Rollback** | N/A |

```bash
mkdir -p /opt/backups/health-one

# Platform DB
sudo -u postgres pg_dump health_one_platform > /opt/backups/health-one/platform-$(date +%Y%m%d-%H%M%S).sql

# Store DB
cp /opt/health-one/data/store-001/store.db /opt/backups/health-one/store-001-$(date +%Y%m%d-%H%M%S).db

ls -lh /opt/backups/health-one/
```

### S-021: Verify Restore

| Attribute | Value |
|-----------|-------|
| **Step ID** | S-021 |
| **Owner** | DevOps |
| **Action** | Destroy + restore Platform DB, verify data returns |
| **Expected** | Data identical before/after restore |
| **Rollback** | If restore fails, re-run migration + seed |

```bash
# Create test data
TOKEN=$(curl -s -X POST http://localhost/api/auth/login -H "Content-Type: application/json" -d '{"username":"admin","password":"<pilot-password>"}' | python3 -c "import json,sys; print(json.load(sys.stdin)['access_token'])")
curl -s -X POST http://localhost/api/identities/ -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"display_name":"Backup Test","primary_store_id":"<store-id>"}'
IDENTITY_ID=$(...)

# Backup
sudo -u postgres pg_dump health_one_platform > /tmp/test-backup.sql

# Destroy
sudo -u postgres dropdb health_one_platform
sudo -u postgres createdb -O health_one health_one_platform

# Restore
sudo -u postgres psql health_one_platform < /tmp/test-backup.sql

# Verify
curl -s http://localhost/api/identities/$IDENTITY_ID -H "Authorization: Bearer $TOKEN" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['display_name'])"
# → "Backup Test"
```

---

## 7. Rollback Steps

If deployment fails at any step, full rollback:

```bash
# 1. Stop service
sudo systemctl stop health-one-platform
sudo systemctl disable health-one-platform

# 2. Remove Nginx config
sudo rm /etc/nginx/sites-enabled/health-one
sudo systemctl reload nginx

# 3. Drop database
sudo -u postgres dropdb health_one_platform
sudo -u postgres dropuser health_one

# 4. Remove application
rm -rf /opt/health-one

# 5. Remove system packages (optional)
sudo apt remove -y nginx postgresql

# Server returned to clean state.
```

---

## 8. Training Prep

### Materials to Prepare Before Training Session

- [ ] Printed quick-reference card (1 page):
  - Login URL
  - Screen flow diagram (S1→S2→S3→S4→S5→S6)
  - Required fields per screen
  - Timeline entry types (what each event means)
- [ ] Demo customer profiles (2–3 pre-created for dry-run)
- [ ] Staff account credentials (not admin/health123)
- [ ] Consent script for real customers (verbal)

### Training Agenda (2 hours)

| Time | Topic | Method |
|------|-------|--------|
| 15min | 健康元 concept + system overview | Explain + Q&A |
| 15min | Login + S1 (search/create customer) | Demo then staff tries |
| 15min | S2 (summary) + S3 (concern intake) | Demo then staff tries |
| 15min | S4 (service record) + S5 (feedback) | Demo then staff tries |
| 15min | S6 (follow-up) + S2 (review state) | Demo then staff tries |
| 15min | Staff completes full loop independently | No coaching |
| 15min | Staff completes loop second time (timed) | Speed practice |
| 15min | Q&A + feedback collection | Discussion |

---

## 9. Risks

| # | Risk | When | Mitigation |
|---|------|------|------------|
| R1 | PostgreSQL won't start | S-003 | Check logs: `journalctl -u postgresql`. Common: port conflict, disk full. |
| R2 | pip install fails (network) | S-006 | Pre-download wheels or use Tsinghua mirror |
| R3 | npm ci fails (network) | S-007 | Pre-build frontend locally, scp dist/ to server |
| R4 | Migration fails (enum exists) | S-009 | Drop + recreate database (no data yet) |
| R5 | systemd service won't start | S-011 | Check `journalctl -u health-one-platform`. Common: wrong path, no venv, permission denied. |
| R6 | Nginx config syntax error | S-012 | `sudo nginx -t` before reload |
| R7 | Frontend blank page | S-015 | Check browser console. Common: API proxy not working, CORS. |
| R8 | Staff finds UI confusing | Training | Use quick-reference card. Simplify if needed. |

---

## 10. Go / No-Go

### Pre-Rehearsal Go/No-Go

```
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   ✅  G O  — 可以开始部署演练                           ║
║                                                       ║
║   Preconditions met:                                   ║
║   ✅ v0.3.1-rc1 tagged + committed                     ║
║   ✅ Deployment checklist written (21 steps)            ║
║   ✅ Backup/restore procedure written (2 steps)         ║
║   ✅ Rollback plan written                              ║
║   ✅ Training agenda written                            ║
║   ✅ Seed script ready                                  ║
║                                                       ║
║   Pending:                                             ║
║   ❌ Server IP / domain — TBD                          ║
║   ❌ Pilot password — set at S-010                     ║
║   ❌ Founder Pilot approval (FD-006 §4.3)              ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

### Answering Three Questions

**1. 是否可以开始真实部署演练？**
✅ 可以。所有步骤已拆分为 21 个可执行 Step，每步都有 command + expected result + rollback。唯一缺失的是服务器 IP/domain —— 获得后即可开始。

**2. 哪些信息还缺失？**
| 缺失项 | 影响 | 如何获取 |
|--------|------|---------|
| 服务器 IP 或域名 | 无法 SSH / 访问 | 服务器就绪后获得 |
| 生产 JWT_SECRET | S-008 无法完成 | 部署时生成 |
| 生产数据库密码 | S-003 无法完成 | 部署时生成 |
| Pilot staff 密码 | S-010 无法完成 | 部署时设定 |
| Founder Pilot 批准 | 无法进入 Pilot | Founder 签署 |

**3. Founder 需要做什么决定？**
1. **批准部署演练开始** — 授权 DevOps 按此计划执行 S-001 至 S-021。
2. **批准 Pilot 进入试运行** — 部署演练成功后，授权真实客户数据进入系统（需单独批准，不在本文档范围内）。
3. **确认服务器资源** — 指定用于试运行的服务器（IP/domain）。

---

## 11. End of Document

PILOT-002 defines the executable deployment rehearsal plan for v0.3.1-rc1.

**Recommendation: GO — ready for deployment rehearsal execution.**
