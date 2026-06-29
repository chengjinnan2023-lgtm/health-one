"""Health Timeline model — RFC-002 §3.2 + Timeline Entry Value Object §4.1."""

from __future__ import annotations

import enum
import uuid

from sqlalchemy import ForeignKey
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from health_one.platform.database import Base


class EventType(str, enum.Enum):
    """Timeline event types per RFC-001 §4.7."""

    IDENTITY_CREATED = "identity_created"
    IDENTITY_ACTIVATED = "identity_activated"
    PROFILE_UPDATED = "profile_updated"
    ASSESSMENT_CREATED = "assessment_created"
    PLAN_UPDATED = "plan_updated"
    SERVICE_COMPLETED = "service_completed"
    AI_CONVERSATION_SUMMARIZED = "ai_conversation_summarized"
    ASSET_UPLOADED = "asset_uploaded"


class HealthTimeline(Base):
    """Health Timeline (健康时间线) — 1:1 with Health Identity.

    Append-only event log. Entries are stored as JSONB array (MVP approach per RFC-002 Q3).
    """

    __tablename__ = "health_timeline"

    timeline_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4,
    )
    identity_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("health_identity.identity_id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )
    entries: Mapped[list[dict]] = mapped_column(
        JSONB, nullable=False, default=list,
        comment="Array of TimelineEntry value objects (RFC-002 §4.1). Append-only.",
    )

    # Relationships
    identity: Mapped["HealthIdentity"] = relationship(
        "HealthIdentity", back_populates="timeline",
    )

    def __repr__(self) -> str:
        return (
            f"<HealthTimeline(timeline_id={self.timeline_id!r}, "
            f"entries_count={len(self.entries)})>"
        )
