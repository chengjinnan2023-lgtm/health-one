"""Store model — RFC-002 §3.6. Stored in Store DB (SQLite)."""

import enum
import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from health_one.store.database import Base, utcnow


class OperatingStatus(str, enum.Enum):
    PILOT = "pilot"
    ACTIVE = "active"
    INACTIVE = "inactive"


class StoreType(str, enum.Enum):
    DIRECT = "直营"  # 直营
    COOPERATIVE = "合作"  # 合作
    FRANCHISE = "加盟"  # 加盟


class Store(Base):
    """Store (门店) — physical health service node.

    Store owns local business data. Each store has its own SQLite database.
    """

    __tablename__ = "store"

    store_id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4()),
    )
    store_name: Mapped[str] = mapped_column(String(200), nullable=False)
    store_code: Mapped[str] = mapped_column(
        String(50), unique=True, nullable=False,
    )
    location: Mapped[str | None] = mapped_column(String(500), nullable=True)
    contact_info: Mapped[str | None] = mapped_column(
        Text, nullable=True,
        comment="JSON: {phone, business_hours, …}",
    )
    operating_status: Mapped[OperatingStatus] = mapped_column(
        Enum(OperatingStatus, name="store_operating_status_enum"),
        default=OperatingStatus.PILOT,
        nullable=False,
    )
    store_type: Mapped[StoreType] = mapped_column(
        Enum(StoreType, name="store_type_enum"),
        default=StoreType.DIRECT,
        nullable=False,
    )
    config: Mapped[str | None] = mapped_column(
        Text, nullable=True,
        comment="JSON: Store Config value object (RFC-002 §4.3)",
    )
    local_knowledge: Mapped[str | None] = mapped_column(
        Text, nullable=True,
        comment="JSON: store-local knowledge references",
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=utcnow, nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=utcnow, onupdate=utcnow, nullable=False,
    )

    # Relationships
    staff: Mapped[list["Staff"]] = relationship("Staff", back_populates="store")

    def __repr__(self) -> str:
        return (
            f"<Store(store_id={self.store_id!r}, "
            f"store_code={self.store_code!r}, "
            f"status={self.operating_status.value!r})>"
        )
