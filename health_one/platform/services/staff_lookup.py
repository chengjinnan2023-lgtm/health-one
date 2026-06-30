"""Resolve staff display names from Store DB (cross-DB lookup).

Used by identity and dashboard routers to enrich API responses
with human-readable staff names for assigned_staff_id references.
"""

from sqlalchemy import select

from health_one.store.database import _get_session_factory
from health_one.store.models.staff import Staff


async def resolve_staff_names(staff_ids: set[str]) -> dict[str, str]:
    """Batch-resolve staff_id → display_name from Store DB.

    Returns empty dict if no staff_ids provided (avoids unnecessary DB call).
    Unknown IDs are silently omitted from the result.
    """
    if not staff_ids:
        return {}

    async with _get_session_factory()() as session:
        result = await session.execute(
            select(Staff.staff_id, Staff.display_name).where(
                Staff.staff_id.in_(list(staff_ids))
            )
        )
        return {row[0]: row[1] for row in result.all()}
