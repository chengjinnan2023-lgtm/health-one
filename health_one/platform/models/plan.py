"""Health Plan model — RFC-002 §3.4. Stored in Platform DB.

Sprint 3 MVP: focused on follow_up_schedule. Goals optional.
source_assessment_ids deferred to Sprint 4 (Health Assessment).
"""

import enum
import uuid

from sqlalchemy import Enum, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from health_one.platform.database import Base, TimestampMixin


class PlanStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    COMPLETED = "completed"
    ARCHIVED = "archived"


class HealthPlan(Base, TimestampMixin):
    """Health Plan (健康计划) — action plan derived from assessments.

    Sprint 3: Used primarily for follow_up_schedule (F5 Follow-Up Task).
    goals[] stores Health Goal value objects (RFC-002 §4.2).
    """

    __tablename__ = "health_plan"

    plan_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4,
    )
    identity_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("health_identity.identity_id", ondelete="CASCADE"),
        nullable=False,
    )
    plan_status: Mapped[PlanStatus] = mapped_column(
        Enum(PlanStatus, name="plan_status_enum",
             values_callable=lambda obj: [e.value for e in obj]),
        default=PlanStatus.ACTIVE,
        nullable=False,
    )
    goals: Mapped[list[dict]] = mapped_column(
        JSONB, nullable=False, default=list,
        comment="Health Goal value objects (RFC-002 §4.2): [{goal_description, target_date, progress_status}]",
    )
    follow_up_schedule: Mapped[dict | None] = mapped_column(
        JSONB, nullable=True,
        comment="Follow-up schedule: {method, planned_at, assigned_staff, reason, status, result}",
    )
    created_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), nullable=True,
        comment="Staff ID who created this plan (app-level FK → Staff, Store DB)",
    )

    def __repr__(self) -> str:
        return (
            f"<HealthPlan(plan_id={self.plan_id!r}, "
            f"status={self.plan_status.value!r})>"
        )
