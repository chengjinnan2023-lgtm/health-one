"""Health Profile model — RFC-002 §3.1."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from health_one.platform.database import Base


class HealthProfile(Base):
    """Health Profile (健康档案) — 1:1 with Health Identity.

    Stores structured health information. Not a medical record.
    """

    __tablename__ = "health_profile"

    profile_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4,
    )
    identity_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("health_identity.identity_id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )
    basic_info: Mapped[dict | None] = mapped_column(
        JSONB, nullable=True,
        comment="Structured: {birth_date, gender, height, weight, …}",
    )
    medical_summary: Mapped[str | None] = mapped_column(
        Text, nullable=True,
        comment="Known health summary — NOT a diagnosis (RFC-001 R1.4 invariant)",
    )
    lifestyle_notes: Mapped[str | None] = mapped_column(
        Text, nullable=True,
        comment="Exercise, diet, sleep, etc.",
    )
    primary_concern: Mapped[str | None] = mapped_column(
        Text, nullable=True,
        comment="Main health concern",
    )
    last_updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    identity: Mapped["HealthIdentity"] = relationship(
        "HealthIdentity", back_populates="profile",
    )

    def __repr__(self) -> str:
        return (
            f"<HealthProfile(profile_id={self.profile_id!r}, "
            f"identity_id={self.identity_id!r})>"
        )
