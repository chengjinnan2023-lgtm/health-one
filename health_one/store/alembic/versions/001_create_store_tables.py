"""Create store tables: store, staff.

Revision ID: 001
Revises: None
Create Date: 2026-06-29
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # ─── store ────────────────────────────────────────────────
    op.create_table(
        "store",
        sa.Column("store_id", sa.String(36), primary_key=True),
        sa.Column("store_name", sa.String(200), nullable=False),
        sa.Column("store_code", sa.String(50), unique=True, nullable=False),
        sa.Column("location", sa.String(500), nullable=True),
        sa.Column("contact_info", sa.Text, nullable=True),
        sa.Column(
            "operating_status",
            sa.Enum("pilot", "active", "inactive", name="store_operating_status_enum"),
            nullable=False,
            server_default="pilot",
        ),
        sa.Column(
            "store_type",
            sa.Enum("直营", "合作", "加盟", name="store_type_enum"),
            nullable=False,
            server_default="直营",
        ),
        sa.Column("config", sa.Text, nullable=True),
        sa.Column("local_knowledge", sa.Text, nullable=True),
        sa.Column("created_at", sa.DateTime, nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime, nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_store_store_code", "store", ["store_code"], unique=True)

    # ─── staff ────────────────────────────────────────────────
    op.create_table(
        "staff",
        sa.Column("staff_id", sa.String(36), primary_key=True),
        sa.Column(
            "store_id",
            sa.String(36),
            sa.ForeignKey("store.store_id"),
            nullable=False,
        ),
        sa.Column("display_name", sa.String(200), nullable=False),
        sa.Column(
            "role",
            sa.Enum("店长", "健康管理师", "服务人员", name="staff_role_enum"),
            nullable=False,
            server_default="服务人员",
        ),
        sa.Column("contact_info", sa.String(200), nullable=True),
        sa.Column(
            "status",
            sa.Enum("active", "inactive", name="staff_status_enum"),
            nullable=False,
            server_default="active",
        ),
        sa.Column("certifications", sa.Text, nullable=True),
        sa.Column("username", sa.String(100), unique=True, nullable=False),
        sa.Column("password_hash", sa.String(200), nullable=False),
        sa.Column("created_at", sa.DateTime, nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime, nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_staff_username", "staff", ["username"], unique=True)
    op.create_index("ix_staff_store_id", "staff", ["store_id"])


def downgrade() -> None:
    op.drop_table("staff")
    op.drop_table("store")
