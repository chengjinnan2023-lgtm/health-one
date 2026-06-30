"""Create a demo staff account for internal pilot.

Usage:
    PYTHONPATH=. python scripts/create_demo_staff.py

Creates staff01 with role 健康管理师 for STORE-001.
Password is read from PILOT_STAFF_PASSWORD env var, default: pilot123
"""

import asyncio
import os
import uuid

from health_one.store.database import _get_session_factory
from health_one.store.models.staff import Staff, StaffRole, StaffStatus


ROLE_MAP = {
    "店长": StaffRole.MANAGER,
    "健康管理师": StaffRole.HEALTH_ADVISOR,
    "服务人员": StaffRole.SERVICE_STAFF,
}


async def create_demo_staff():
    username = os.getenv("PILOT_STAFF_USERNAME", "staff01")
    password = os.getenv("PILOT_STAFF_PASSWORD", "pilot123")
    role_value = os.getenv("PILOT_STAFF_ROLE", "健康管理师")
    staff_role = ROLE_MAP.get(role_value, StaffRole.HEALTH_ADVISOR)

    async with _get_session_factory()() as session:
        from sqlalchemy import select

        # Check if staff already exists
        result = await session.execute(select(Staff).where(Staff.username == username))
        existing = result.scalar_one_or_none()

        if existing:
            print(f"[demo] Staff '{username}' already exists (staff_id={existing.staff_id})")
            print(f"       Display: {existing.display_name}")
            print(f"       Role: {existing.role.value}")
            print(f"       Status: {existing.status.value}")
            return

        # Get STORE-001
        from health_one.store.models.store import Store
        result = await session.execute(
            select(Store).where(Store.store_code == "STORE-001")
        )
        store = result.scalar_one_or_none()

        if store is None:
            print("[demo] ERROR: STORE-001 not found. Run seed.py first.")
            return

        # Create demo staff
        staff = Staff(
            staff_id=str(uuid.uuid4()),
            store_id=store.store_id,
            display_name="健康管理师",
            username=username,
            password_hash=Staff.hash_password(password),
            role=staff_role,
            status=StaffStatus.ACTIVE,
        )
        session.add(staff)
        await session.commit()

        print(f"[demo] Created staff: {username}")
        print(f"       Display: {staff.display_name}")
        print(f"       Role: {staff.role.value}")
        print(f"       Store: {store.store_name} ({store.store_code})")
        print(f"       Staff ID: {staff.staff_id}")
        print("       Status: active")


if __name__ == "__main__":
    asyncio.run(create_demo_staff())
