.PHONY: install lint test clean run-platform run-store run-frontend

# ─── Development Setup ───────────────────────────────────────────
install:
	python3 -m venv venv
	./venv/bin/pip install --upgrade pip
	./venv/bin/pip install -r requirements.txt
	@echo "✅ Virtual environment ready — activate: source venv/bin/activate"

# ─── Code Quality ────────────────────────────────────────────────
lint:
	ruff check .

format:
	ruff format .

# ─── Testing ─────────────────────────────────────────────────────
test:
	pytest tests/ -v

test-cov:
	pytest tests/ -v --cov=health_one --cov-report=term-missing

# ─── Run Services ────────────────────────────────────────────────
run-platform:
	uvicorn health_one.platform.main:app --reload --host 0.0.0.0 --port 8000

run-store:
	@echo "Store service not implemented yet (Sprint 3+)"

run-frontend:
	cd frontend && npm run dev

# ─── Database ────────────────────────────────────────────────────
db-migrate-platform:
	cd health_one/platform && alembic upgrade head

db-migrate-store:
	cd health_one/store && alembic upgrade head

# ─── Cleanup ─────────────────────────────────────────────────────
clean:
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
	rm -rf .pytest_cache
