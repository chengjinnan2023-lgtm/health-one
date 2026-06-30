"""Add assigned_staff_id column to health_identity.

Revision ID: 005
Revises: 004
Create Date: 2026-07-01
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "005"
down_revision: str | None = "004"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "health_identity",
        sa.Column(
            "assigned_staff_id",
            postgresql.UUID,
            nullable=True,
            comment="Application-level FK → Staff (Store DB). The health advisor responsible for this customer.",
        ),
    )


def downgrade() -> None:
    op.drop_column("health_identity", "assigned_staff_id")
