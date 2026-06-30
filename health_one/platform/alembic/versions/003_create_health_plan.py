"""Create health_plan table.

Revision ID: 003
Revises: 002
Create Date: 2026-06-30
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "003"
down_revision: str | None = "002"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    plan_status_enum = postgresql.ENUM(
        "draft", "active", "completed", "archived",
        name="plan_status_enum",
        create_type=False,
    )
    plan_status_enum.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "health_plan",
        sa.Column("plan_id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "identity_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("health_identity.identity_id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("plan_status", plan_status_enum, nullable=False, server_default="active"),
        sa.Column(
            "goals",
            postgresql.JSONB,
            nullable=False,
            server_default=sa.text("'[]'::jsonb"),
        ),
        sa.Column("follow_up_schedule", postgresql.JSONB, nullable=True),
        sa.Column("created_by", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
    )
    op.create_index("ix_health_plan_identity_id", "health_plan", ["identity_id"])


def downgrade() -> None:
    op.drop_table("health_plan")
    sa.Enum(name="plan_status_enum").drop(op.get_bind(), checkfirst=True)
