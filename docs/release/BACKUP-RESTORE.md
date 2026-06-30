# Backup & Restore Checklist — v0.3.1

Document ID : BACKUP-RESTORE
Title       : Health One Database Backup & Restore
Version     : 1.0
Status      : Draft
Owner       : DevOps / Architecture Office
Created     : 2026-06-30

---

## 1. Backup Strategy

### Platform DB (PostgreSQL)

```bash
#!/bin/bash
# backup-platform.sh
BACKUP_DIR=/opt/backups/health-one
mkdir -p $BACKUP_DIR
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
pg_dump -U health_one -h localhost health_one_platform > "$BACKUP_DIR/platform-$TIMESTAMP.sql"
echo "Platform DB backed up: platform-$TIMESTAMP.sql"
```

### Store DB (SQLite)

```bash
#!/bin/bash
# backup-store.sh
BACKUP_DIR=/opt/backups/health-one
mkdir -p $BACKUP_DIR
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
cp /opt/health-one/data/store-001/store.db "$BACKUP_DIR/store-001-$TIMESTAMP.db"
echo "Store DB backed up: store-001-$TIMESTAMP.db"
```

### Cron Schedule

```bash
# Daily backup at 2:00 AM
0 2 * * * /opt/health-one/scripts/backup-platform.sh
0 2 * * * /opt/health-one/scripts/backup-store.sh

# Keep last 7 days of backups
0 3 * * * find /opt/backups/health-one -name "*.sql" -mtime +7 -delete
0 3 * * * find /opt/backups/health-one -name "*.db" -mtime +7 -delete
```

---

## 2. Restore Procedure

### Platform DB Restore

```bash
# 1. Stop service
sudo systemctl stop health-one-platform

# 2. Drop and recreate database
sudo -u postgres dropdb health_one_platform
sudo -u postgres createdb -O health_one health_one_platform

# 3. Restore from backup
psql -U health_one -h localhost health_one_platform < /opt/backups/health-one/platform-YYYYMMDD-HHMMSS.sql

# 4. Start service
sudo systemctl start health-one-platform
```

### Store DB Restore

```bash
# 1. Stop service
sudo systemctl stop health-one-platform

# 2. Restore SQLite file
cp /opt/backups/health-one/store-001-YYYYMMDD-HHMMSS.db /opt/health-one/data/store-001/store.db

# 3. Start service
sudo systemctl start health-one-platform
```

---

## 3. Backup Verification

- [ ] `pg_dump` completes without error
- [ ] SQLite file copied successfully
- [ ] Restored PostgreSQL dump loads without error
- [ ] Restored SQLite file is readable by application
- [ ] Cron job running (check `/var/log/syslog`)

---

## 4. End of Document
