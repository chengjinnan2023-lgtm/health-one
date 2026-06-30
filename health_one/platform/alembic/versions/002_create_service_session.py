"""Create service_session table.

Revision ID: 002
Revises: 001
Create Date: 2026-06-30
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "002"
down_revision: str | None = "001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # Enum type
    service_type_enum = postgresql.ENUM(
        "健康舱", "咨询", "检测", "其他",
        name="service_type_enum",
        create_type=False,
    )
    service_type_enum.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "service_session",
        sa.Column("session_id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "identity_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("health_identity.identity_id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("store_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("staff_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("service_type", service_type_enum, nullable=False),
        sa.Column("pre_service_notes", sa.Text, nullable=True),
        sa.Column("service_detail", sa.Text, nullable=True),
        sa.Column("post_service_notes", sa.Text, nullable=True),
        sa.Column("customer_feedback", sa.Text, nullable=True),
        sa.Column("next_step_suggestion", sa.Text, nullable=True),
        sa.Column(
            "started_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("recorded_by", postgresql.UUID(as_uuid=True), nullable=False),
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
    op.create_index("ix_service_session_identity_id", "service_session", ["identity_id"])


def downgrade() -> None:
    op.drop_table("service_session")
    sa.Enum(name="service_type_enum").drop(op.get_bind(), checkfirst=True)
