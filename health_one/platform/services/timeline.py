"""Health Timeline auto-append service — RFC-001 §4.7, RFC-002 §3.2.

Timeline entries are append-only. Once appended, they cannot be modified or deleted.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from health_one.platform.models.timeline import HealthTimeline


async def append_timeline_entry(
    db: AsyncSession,
    *,
    identity_id: uuid.UUID,
    event_type: str,
    source_object_type: str,
    source_object_id: uuid.UUID,
    summary_text: str,
    performed_by: str,
) -> dict:
    """Append a single entry to the Health Timeline for the given identity.

    Creates the Timeline if it doesn't exist (first event for this identity).

    Returns the newly created entry dict.
    """
    now = datetime.now(timezone.utc)

    entry: dict = {
        "entry_id": str(uuid.uuid4()),
        "timestamp": now.isoformat(),
        "event_type": event_type,
        "source_object_type": source_object_type,
        "source_object_id": str(source_object_id),
        "summary_text": summary_text,
        "performed_by": performed_by,
    }

    # Get or create the timeline for this identity
    result = await db.execute(
        select(HealthTimeline).where(HealthTimeline.identity_id == identity_id)
    )
    timeline = result.scalar_one_or_none()

    if timeline is None:
        timeline = HealthTimeline(
            timeline_id=uuid.uuid4(),
            identity_id=identity_id,
            entries=[entry],
        )
        db.add(timeline)
    else:
        # Append-only — add to the existing entries array
        updated_entries = list(timeline.entries)
        updated_entries.append(entry)
        timeline.entries = updated_entries

    await db.flush()
    return entry


async def get_timeline(
    db: AsyncSession,
    *,
    identity_id: uuid.UUID,
    limit: int = 20,
    offset: int = 0,
    event_type: str | None = None,
) -> list[dict]:
    """Read timeline entries for a given identity.

    Entries are always returned in reverse chronological order.
    If event_type is provided, filter to only that type.
    """
    result = await db.execute(
        select(HealthTimeline).where(HealthTimeline.identity_id == identity_id)
    )
    timeline = result.scalar_one_or_none()

    if timeline is None:
        return []

    entries = list(timeline.entries)

    # Filter by event_type if requested
    if event_type:
        entries = [e for e in entries if e.get("event_type") == event_type]

    # Reverse chronological order (newest first)
    entries.sort(key=lambda e: e.get("timestamp", ""), reverse=True)

    # Apply pagination
    return entries[offset : offset + limit]
