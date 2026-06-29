"""Health One — Platform Database (PostgreSQL)."""

import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

from health_one.platform.config import get_platform_settings

# Lazy-initialized engine — only connects when first used.
_engine = None
_session_factory = None


def _get_engine():
    """Return the async SQLAlchemy engine (lazy init)."""
    global _engine
    if _engine is None:
        settings = get_platform_settings()
        _engine = create_async_engine(
            settings.PLATFORM_DB_URL,
            echo=settings.DEBUG,
            pool_size=5,
            max_overflow=10,
        )
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
    """FastAPI dependency — yields an async database session."""
    async with _get_session_factory()() as session:
        try:
            yield session
        finally:
            await session.close()


async def check_db_connection() -> dict:
    """Check Platform DB connectivity. Returns status dict."""
    try:
        async with _get_engine().connect() as conn:
            await conn.execute(func.now())
        return {"platform_db": "ok"}
    except Exception as exc:
        return {"platform_db": "error", "detail": str(exc)}


class Base(DeclarativeBase):
    """Base model for all Platform DB tables."""


def utcnow() -> datetime:
    """Return current UTC datetime with timezone."""
    return datetime.now(timezone.utc)


class TimestampMixin:
    """Mixin adding created_at and updated_at columns."""

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False
    )


class UUIDMixin:
    """Mixin adding a UUID primary key column."""

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
