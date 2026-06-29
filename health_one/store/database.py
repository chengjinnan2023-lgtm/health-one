"""Health One — Store Database (SQLite)."""

import os
from datetime import datetime, timezone

from sqlalchemy import event, text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from health_one.store.config import get_store_settings

# Lazy-initialized engine — only connects when first used.
_engine = None
_session_factory = None


def _get_db_path() -> str:
    """Resolve the SQLite database file path for the current store."""
    settings = get_store_settings()
    db_dir = os.path.dirname(settings.store_db_path)
    os.makedirs(db_dir, exist_ok=True)
    return settings.store_db_path


def _get_engine():
    """Return the async SQLAlchemy engine (lazy init)."""
    global _engine
    if _engine is None:
        db_path = _get_db_path()
        db_url = f"sqlite+aiosqlite:///{db_path}"
        _engine = create_async_engine(db_url, echo=False)

        # Enable WAL mode on connect for better concurrent read performance
        @event.listens_for(_engine.sync_engine, "connect")
        def set_sqlite_pragma(dbapi_connection, connection_record):
            cursor = dbapi_connection.cursor()
            cursor.execute("PRAGMA journal_mode=WAL;")
            cursor.execute("PRAGMA foreign_keys=ON;")
            cursor.close()

    return _engine


def _get_session_factory():
    """Return the async session factory (lazy init)."""
    global _session_factory
    if _session_factory is None:
        _session_factory = async_sessionmaker(
            _get_engine(), class_=AsyncSession, expire_on_commit=False
        )
    return _session_factory


async def get_db() -> AsyncSession:
    """FastAPI dependency — yields an async Store DB session."""
    async with _get_session_factory()() as session:
        try:
            yield session
        finally:
            await session.close()


async def check_db_connection() -> dict:
    """Check Store DB connectivity. Returns status dict."""
    try:
        async with _get_engine().connect() as conn:
            await conn.execute(text("SELECT 1"))
        settings = get_store_settings()
        return {"store_db": "ok", "store_db_path": settings.store_db_path}
    except Exception as exc:
        return {"store_db": "error", "detail": str(exc)}


class Base(DeclarativeBase):
    """Base model for all Store DB tables.

    NOTE: Store DB uses SQLite. Models use String(36) for UUID columns
    (no PostgreSQL UUID type). Timestamps use DateTime without timezone.
    """


def utcnow() -> datetime:
    """Return current UTC datetime (naive — SQLite doesn't store timezone)."""
    return datetime.now(timezone.utc).replace(tzinfo=None)
