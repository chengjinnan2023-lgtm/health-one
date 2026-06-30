"""Health Profile API endpoints — RFC-002 §3.1."""

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from health_one.platform.auth import get_current_staff
from health_one.platform.database import get_db
from health_one.platform.models.identity import HealthIdentity
from health_one.platform.models.profile import HealthProfile
from health_one.platform.schemas.profile import ProfileResponse, ProfileUpdate
from health_one.platform.services.timeline import append_timeline_entry
from health_one.store.models.staff import Staff

router = APIRouter(prefix="/api/identities", tags=["Profile"])


@router.get("/{identity_id}/profile", response_model=ProfileResponse)
async def get_profile(identity_id: uuid.UUID, db: AsyncSession = Depends(get_db), staff: Staff = Depends(get_current_staff)):
    """Get the Health Profile for a given identity."""
    result = await db.execute(
        select(HealthProfile).where(HealthProfile.identity_id == identity_id)
    )
    profile = result.scalar_one_or_none()
    if profile is None:
        raise HTTPException(status_code=404, detail="Health Profile not found")
    return profile


@router.put("/{identity_id}/profile", response_model=ProfileResponse)
async def upsert_profile(
    identity_id: uuid.UUID,
    body: ProfileUpdate,
    db: AsyncSession = Depends(get_db),
    staff: Staff = Depends(get_current_staff),
):
    """Create or update the Health Profile for a given identity.

    Auto-creates the profile if it doesn't exist. Auto-appends a Timeline entry on update.
    """
    # Verify identity exists
    result = await db.execute(
        select(HealthIdentity).where(HealthIdentity.identity_id == identity_id)
    )
    identity = result.scalar_one_or_none()
    if identity is None:
        raise HTTPException(status_code=404, detail="Health Identity not found")

    now = datetime.now(timezone.utc)

    result = await db.execute(
        select(HealthProfile).where(HealthProfile.identity_id == identity_id)
    )
    profile = result.scalar_one_or_none()

    is_new = profile is None

    if is_new:
        profile = HealthProfile(
            profile_id=uuid.uuid4(),
            identity_id=identity_id,
            basic_info=body.basic_info,
            medical_summary=body.medical_summary,
            lifestyle_notes=body.lifestyle_notes,
            primary_concern=body.primary_concern,
            last_updated_at=now,
        )
        db.add(profile)
    else:
        if body.basic_info is not None:
            profile.basic_info = body.basic_info
        if body.medical_summary is not None:
            profile.medical_summary = body.medical_summary
        if body.lifestyle_notes is not None:
            profile.lifestyle_notes = body.lifestyle_notes
        if body.primary_concern is not None:
            profile.primary_concern = body.primary_concern
        profile.last_updated_at = now

    await db.flush()

    # Auto-append Timeline entry
    await append_timeline_entry(
        db,
        identity_id=identity_id,
        event_type="profile_updated",
        source_object_type="HealthProfile",
        source_object_id=profile.profile_id,
        summary_text=(
            f"Health Profile {'created' if is_new else 'updated'}"
            + (f" — primary concern: {body.primary_concern}" if body.primary_concern else "")
        ),
        performed_by=staff.staff_id,
    )

    await db.commit()
    await db.refresh(profile)
    return profile


@router.patch("/{identity_id}/profile", response_model=ProfileResponse)
async def partial_update_profile(
    identity_id: uuid.UUID,
    body: ProfileUpdate,
    db: AsyncSession = Depends(get_db),
    staff: Staff = Depends(get_current_staff),
):
    """Partially update a Health Profile. Only provided fields are changed.

    Note: MVP uses the same upsert behavior as PUT for simplicity.
    """
    # Delegate to PUT for MVP (upsert semantics)
    return await upsert_profile(identity_id, body, db)
