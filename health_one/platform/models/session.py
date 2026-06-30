"""Service Session model — RFC-002 §3.5. Stored in Platform DB."""

import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, Enum, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from health_one.platform.database import Base, TimestampMixin


class ServiceType(str, enum.Enum):
    HEALTH_CABIN = "健康舱"
    CONSULTATION = "咨询"
    TESTING = "检测"
    OTHER = "其他"


class ServiceSession(Base, TimestampMixin):
    """Service Session (服务记录) — records a real store service delivery.

    Owned by Health Identity aggregate. Customer + Store share business ownership.
    """

    __tablename__ = "service_session"

    session_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4,
    )
    identity_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("health_identity.identity_id", ondelete="CASCADE"),
        nullable=False,
    )
    store_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), nullable=False,
        comment="App-level FK → Store (Store DB)",
    )
    staff_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), nullable=False,
        comment="App-level FK → Staff (Store DB). Staff performing the service.",
    )
    service_type: Mapped[ServiceType] = mapped_column(
        Enum(ServiceType, name="service_type_enum",
             values_callable=lambda obj: [e.value for e in obj]),
        nullable=False,
    )
    pre_service_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    service_detail: Mapped[str | None] = mapped_column(Text, nullable=True)
    post_service_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    customer_feedback: Mapped[str | None] = mapped_column(
        Text, nullable=True,
        comment="F4: Feedback fields stored as structured JSON text for MVP",
    )
    next_step_suggestion: Mapped[str | None] = mapped_column(Text, nullable=True)
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False,
    )
    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True,
        comment="Set when service is completed. Triggers Timeline entry.",
    )
    recorded_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), nullable=False,
        comment="App-level FK → Staff. The staff who recorded this session.",
    )

    def __repr__(self) -> str:
        return (
            f"<ServiceSession(session_id={self.session_id!r}, "
            f"identity_id={self.identity_id!r}, "
            f"type={self.service_type.value!r})>"
        )
