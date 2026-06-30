# Deployment Checklist — v0.3.1

Document ID : DEPLOYMENT-CHECKLIST
Title       : Health One Store Server Deployment Checklist
Version     : 1.0
Status      : Draft
Owner       : DevOps / Architecture Office
Created     : 2026-06-30
Target      : Single-store pilot deployment

---

## 1. Prerequisites

- [ ] Ubuntu/Debian server (or macOS dev machine)
- [ ] Python 3.12+ installed
- [ ] Node.js 20+ installed
- [ ] PostgreSQL 16 installed
- [ ] Nginx installed
- [ ] Git access to health-one repository
- [ ] Domain or IP for store server

---

## 2. Database Setup

### PostgreSQL (Platform DB)

```bash
# Create database
sudo -u postgres createuser health_one
sudo -u postgres createdb -O health_one health_one_platform

# Set password (or configure pg_hba.conf for peer/trust)
sudo -u postgres psql -c "ALTER USER health_one PASSWORD '<secure-password>';"

# Run migration
cd /opt/health-one
PLATFORM_DB_URL="postgresql+asyncpg://health_one:<password>@localhost:5432/health_one_platform" \
python -m alembic -c health_one/platform/alembic.ini upgrade head
```

### SQLite (Store DB)

```bash
# Auto-created on first migration run
cd /opt/health-one
python -m alembic -c health_one/store/alembic.ini upgrade head

# Seed pilot store + staff
PYTHONPATH=. python -c "
import asyncio
from health_one.store.seed import seed
asyncio.run(seed())
"
```

---

## 3. Application Setup

```bash
# Clone repository
git clone <repo-url> /opt/health-one
cd /opt/health-one

# Python dependencies
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend build
cd frontend
npm install
npm run build
# Static files in frontend/dist/
```

---

## 4. Environment Configuration

Create `/opt/health-one/.env`:

```bash
PLATFORM_DB_URL=postgresql+asyncpg://health_one:<password>@localhost:5432/health_one_platform
JWT_SECRET=<generate-with-python3 -c "import secrets; print(secrets.token_urlsafe(32))">
STORE_DB_BASE_PATH=/opt/health-one/data
DEBUG=false
```

---

## 5. systemd Service

Create `/etc/systemd/system/health-one-platform.service`:

```ini
[Unit]
Description=Health One Platform API
After=network.target postgresql.service

[Service]
Type=simple
User=health-one
WorkingDirectory=/opt/health-one
EnvironmentFile=/opt/health-one/.env
ExecStart=/opt/health-one/venv/bin/uvicorn health_one.platform.main:app --host 127.0.0.1 --port 8000
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable health-one-platform
sudo systemctl start health-one-platform
```

---

## 6. Nginx Configuration

Create `/etc/nginx/sites-available/health-one`:

```nginx
server {
    listen 443 ssl;
    server_name store.example.com;

    ssl_certificate /etc/ssl/certs/health-one.crt;
    ssl_certificate_key /etc/ssl/private/health-one.key;

    # API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /health {
        proxy_pass http://127.0.0.1:8000;
    }

    # Static frontend
    location / {
        root /opt/health-one/frontend/dist;
        try_files $uri /index.html;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/health-one /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 7. Post-Deployment Verification

- [ ] `curl https://store.example.com/health` → `{"status": "ok", "version": "0.2.0"}`
- [ ] `curl https://store.example.com/health/db` → `{"platform_db": "ok"}`
- [ ] Frontend loads at `https://store.example.com/`
- [ ] Login with seed credentials works
- [ ] Create customer → activate → concern → service → feedback → follow-up
- [ ] Timeline entries visible
- [ ] Staff cannot access other store data (if multi-store)

---

## 8. Rollback

```bash
# Stop service
sudo systemctl stop health-one-platform

# Restore database from backup (see BACKUP-RESTORE.md)

# Deploy previous git tag
cd /opt/health-one
git checkout v0.2.0
sudo systemctl start health-one-platform
```

---

## 9. End of Document
