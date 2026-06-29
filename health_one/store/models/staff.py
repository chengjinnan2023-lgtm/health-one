"""Staff model — RFC-002 §3.7. Stored in Store DB (SQLite)."""

import enum
import uuid
from datetime import datetime

import bcrypt
from sqlalchemy import DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from health_one.store.database import Base, utcnow


class StaffRole(str, enum.Enum):
    MANAGER = "店长"  # 店长
    HEALTH_ADVISOR = "健康管理师"  # 健康管理师
    SERVICE_STAFF = "服务人员"  # 服务人员


class StaffStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"


class Staff(Base):
    """Staff (门店员工) — human-in-the-loop role.

    Staff authenticate with username + password (bcrypt hashed).
    Each staff belongs to exactly one Store.
    """

    __tablename__ = "staff"

    staff_id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4()),
    )
    store_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("store.store_id"),
        nullable=False,
    )
    display_name: Mapped[str] = mapped_column(String(200), nullable=False)
    role: Mapped[StaffRole] = mapped_column(
        Enum(StaffRole, name="staff_role_enum"),
        default=StaffRole.SERVICE_STAFF,
        nullable=False,
    )
    contact_info: Mapped[str | None] = mapped_column(String(200), nullable=True)
    status: Mapped[StaffStatus] = mapped_column(
        Enum(StaffStatus, name="staff_status_enum"),
        default=StaffStatus.ACTIVE,
        nullable=False,
    )
    certifications: Mapped[str | None] = mapped_column(
        Text, nullable=True,
        comment="JSON array: Staff.certifications value object (RFC-002 §4.4)",
    )

    # Auth fields (implementation concern, not in RFC-002 domain model)
    username: Mapped[str] = mapped_column(
        String(100), unique=True, nullable=False,
    )
    password_hash: Mapped[str] = mapped_column(String(200), nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=utcnow, nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=utcnow, onupdate=utcnow, nullable=False,
    )

    # Relationships
    store: Mapped["Store"] = relationship("Store", back_populates="staff")

    @classmethod
    def hash_password(cls, plain: str) -> str:
        """Hash a plaintext password with bcrypt. Never store plaintext."""
        return bcrypt.hashpw(
            plain.encode("utf-8"), bcrypt.gensalt()
        ).decode("utf-8")

    def verify_password(self, plain: str) -> bool:
        """Verify a plaintext password against the stored hash."""
        return bcrypt.checkpw(
            plain.encode("utf-8"), self.password_hash.encode("utf-8")
        )

    def __repr__(self) -> str:
        return (
            f"<Staff(staff_id={self.staff_id!r}, "
            f"username={self.username!r}, "
            f"role={self.role.value!r})>"
        )
