"""Health One — Platform API Application."""

from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException

from health_one.platform.config import get_platform_settings
from health_one.platform.database import check_db_connection
from health_one.platform.routers import auth, dashboard, identity, plan, profile, session, staff, timeline


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


# Register API routers
app.include_router(auth.router)
app.include_router(identity.router)
app.include_router(profile.router)
app.include_router(plan.router)
app.include_router(session.router)
app.include_router(dashboard.router)
app.include_router(staff.router)
app.include_router(timeline.router)


@app.get("/health")
async def health_check():
    """Basic health check — returns 200 when the service is running."""
    return {"status": "ok", "service": "platform-api", "version": app.version}


@app.get("/health/db")
async def health_db_check():
    """Database health check — returns 503 when Platform DB is unavailable."""
    db_status = await check_db_connection()
    if db_status.get("platform_db") != "ok":
        raise HTTPException(status_code=503, detail=db_status)
    return {"status": "ok", "service": "platform-api", **db_status}
