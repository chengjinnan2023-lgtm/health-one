"""Seed data for Store DB — one pilot store + one staff user.

Run once after migration: python -m health_one.store.seed
"""

import asyncio
import os
import uuid

from health_one.store.database import _get_session_factory


async def seed() -> None:
    """Insert pilot store and default staff if they don't exist."""
    from health_one.store.models.staff import Staff, StaffRole, StaffStatus
    from health_one.store.models.store import OperatingStatus, Store, StoreType

    store_code = os.getenv("SEED_STORE_CODE", "STORE-001")

    async with _get_session_factory()() as session:
        # Check if store already exists
        from sqlalchemy import select

        result = await session.execute(
            select(Store).where(Store.store_code == store_code)
        )
        existing = result.scalar_one_or_none()

        if existing:
            print(f"[seed] Store {store_code} already exists — skipping")
            return

        # Create pilot store
        store = Store(
            store_id=str(uuid.uuid4()),
            store_name="Health One 试点门店",
            store_code=store_code,
            location="试点地址",
            operating_status=OperatingStatus.PILOT,
            store_type=StoreType.DIRECT,
        )
        session.add(store)
        await session.flush()

        # Create default staff
        staff_password = os.getenv("SEED_STAFF_PASSWORD", "health123")
        staff = Staff(
            staff_id=str(uuid.uuid4()),
            store_id=store.store_id,
            display_name="店长",
            username="admin",
            password_hash=Staff.hash_password(staff_password),
            role=StaffRole.MANAGER,
            status=StaffStatus.ACTIVE,
        )
        session.add(staff)
        await session.commit()

        print(f"[seed] Created store {store_code} and staff admin")
        print(f"[seed] Store ID: {store.store_id}")
        print(f"[seed] Staff ID: {staff.staff_id}")


if __name__ == "__main__":
    asyncio.run(seed())
