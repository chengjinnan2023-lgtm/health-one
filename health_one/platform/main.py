"""Health One — Platform API Application."""

from contextlib import asynccontextmanager

from fastapi import FastAPI

from health_one.platform.config import get_platform_settings
from health_one.platform.database import check_db_connection


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown lifecycle."""
    settings = get_platform_settings()
    print(f"[Platform] Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    yield
    print("[Platform] Shutting down")


app = FastAPI(
    title=get_platform_settings().APP_NAME,
    version=get_platform_settings().APP_VERSION,
    lifespan=lifespan,
)


@app.get("/health")
async def health_check():
    """Basic health check — returns 200 when the service is running."""
    return {"status": "ok", "service": "platform-api", "version": app.version}


@app.get("/health/db")
async def health_db_check():
    """Database health check — verifies Platform DB connectivity."""
    db_status = await check_db_connection()
    return {"status": "ok", "service": "platform-api", **db_status}
