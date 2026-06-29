"""Health Identity model — RFC-002 §2.1, the sole aggregate root."""

from __future__ import annotations

import enum
import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from health_one.platform.database import Base, TimestampMixin


class ActivationStatus(str, enum.Enum):
    PENDING = "pending"
    ACTIVE = "active"
    ARCHIVED = "archived"


class DataOwnershipTag(str, enum.Enum):
    CUSTOMER = "customer"
    PLATFORM = "platform"


class HealthIdentity(Base, TimestampMixin):
    """Health Identity (健康元) — the sole aggregate root.

    All health data ultimately organizes around this entity.
    """

    __tablename__ = "health_identity"

    identity_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4,
    )
    display_name: Mapped[str] = mapped_column(String(200), nullable=False)
    activation_status: Mapped[ActivationStatus] = mapped_column(
        Enum(ActivationStatus, name="activation_status_enum"),
        default=ActivationStatus.PENDING,
        nullable=False,
    )
    primary_store_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), nullable=False,
        comment="Application-level FK → Store (Store DB). No DB-level FK constraint.",
    )
    data_ownership_tag: Mapped[DataOwnershipTag] = mapped_column(
        Enum(DataOwnershipTag, name="data_ownership_tag_enum"),
        default=DataOwnershipTag.CUSTOMER,
        nullable=False,
    )
    activated_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True,
    )

    # Relationships (1:1)
    profile: Mapped["HealthProfile | None"] = relationship(
        "HealthProfile", back_populates="identity", uselist=False, lazy="selectin",
    )
    timeline: Mapped["HealthTimeline | None"] = relationship(
        "HealthTimeline", back_populates="identity", uselist=False, lazy="selectin",
    )

    def __repr__(self) -> str:
        return (
            f"<HealthIdentity(identity_id={self.identity_id!r}, "
            f"display_name={self.display_name!r}, "
            f"status={self.activation_status.value!r})>"
        )


if TYPE_CHECKING:
    from health_one.platform.models.profile import HealthProfile
    from health_one.platform.models.timeline import HealthTimeline
