"""Create core tables: health_identity, health_profile, health_timeline.

Revision ID: 001
Revises: None
Create Date: 2026-06-29
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # ─── Enum types ────────────────────────────────────────────
    activation_status_enum = postgresql.ENUM(
        "pending", "active", "archived", name="activation_status_enum",
        create_type=True,
    )
    activation_status_enum.create(op.get_bind(), checkfirst=True)

    data_ownership_tag_enum = postgresql.ENUM(
        "customer", "platform", name="data_ownership_tag_enum",
        create_type=True,
    )
    data_ownership_tag_enum.create(op.get_bind(), checkfirst=True)

    # ─── health_identity ───────────────────────────────────────
    op.create_table(
        "health_identity",
        sa.Column("identity_id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("display_name", sa.String(200), nullable=False),
        sa.Column(
            "activation_status",
            activation_status_enum,
            nullable=False,
            server_default="pending",
        ),
        sa.Column("primary_store_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column(
            "data_ownership_tag",
            data_ownership_tag_enum,
            nullable=False,
            server_default="customer",
        ),
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
        sa.Column("activated_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_health_identity_display_name", "health_identity", ["display_name"])
    op.create_index(
        "ix_health_identity_primary_store_id", "health_identity", ["primary_store_id"],
    )

    # ─── health_profile ────────────────────────────────────────
    op.create_table(
        "health_profile",
        sa.Column("profile_id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "identity_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("health_identity.identity_id", ondelete="CASCADE"),
            unique=True,
            nullable=False,
        ),
        sa.Column("basic_info", postgresql.JSONB, nullable=True),
        sa.Column("medical_summary", sa.Text, nullable=True),
        sa.Column("lifestyle_notes", sa.Text, nullable=True),
        sa.Column("primary_concern", sa.Text, nullable=True),
        sa.Column(
            "last_updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
    )

    # ─── health_timeline ───────────────────────────────────────
    op.create_table(
        "health_timeline",
        sa.Column("timeline_id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "identity_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("health_identity.identity_id", ondelete="CASCADE"),
            unique=True,
            nullable=False,
        ),
        sa.Column(
            "entries",
            postgresql.JSONB,
            nullable=False,
            server_default=sa.text("'[]'::jsonb"),
        ),
    )


def downgrade() -> None:
    op.drop_table("health_timeline")
    op.drop_table("health_profile")
    op.drop_table("health_identity")

    # Drop enum types
    sa.Enum(name="data_ownership_tag_enum").drop(op.get_bind(), checkfirst=True)
    sa.Enum(name="activation_status_enum").drop(op.get_bind(), checkfirst=True)
