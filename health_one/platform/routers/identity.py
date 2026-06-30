"""Health Identity API endpoints — RFC-002 §2.1."""

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from health_one.platform.auth import get_current_staff
from health_one.platform.database import get_db
from health_one.platform.models.identity import HealthIdentity
from health_one.platform.schemas.identity import (
    IdentityCreate,
    IdentityResponse,
    IdentityUpdate,
)
from health_one.platform.services.timeline import append_timeline_entry
from health_one.store.models.staff import Staff

router = APIRouter(prefix="/api/identities", tags=["Identity"])


@router.post("/", response_model=IdentityResponse, status_code=201)
async def create_identity(body: IdentityCreate, db: AsyncSession = Depends(get_db), staff: Staff = Depends(get_current_staff)):
    """Create a new Health Identity (健康元) and auto-append Timeline entry."""
    now = datetime.now(timezone.utc)

    identity = HealthIdentity(
        identity_id=uuid.uuid4(),
        display_name=body.display_name,
        primary_store_id=body.primary_store_id,
        data_ownership_tag=body.data_ownership_tag,
        created_at=now,
        updated_at=now,
    )
    db.add(identity)
    await db.flush()

    # Auto-append Timeline entry
    await append_timeline_entry(
        db,
        identity_id=identity.identity_id,
        event_type="identity_created",
        source_object_type="HealthIdentity",
        source_object_id=identity.identity_id,
        summary_text=f"健康元 created: {identity.display_name}",
        performed_by=staff.staff_id,
    )

    await db.commit()
    await db.refresh(identity)
    return identity


@router.get("/{identity_id}", response_model=IdentityResponse)
async def get_identity(identity_id: uuid.UUID, db: AsyncSession = Depends(get_db), staff: Staff = Depends(get_current_staff)):
    """Get a Health Identity by ID."""
    result = await db.execute(
        select(HealthIdentity).where(HealthIdentity.identity_id == identity_id)
    )
    identity = result.scalar_one_or_none()
    if identity is None:
        raise HTTPException(status_code=404, detail="Health Identity not found")
    return identity


@router.get("/", response_model=list[IdentityResponse])
async def search_identities(
    q: str | None = Query(None, description="Search by name (case-insensitive partial match)"),
    store_id: uuid.UUID | None = Query(None, description="Filter by store"),
    status: str | None = Query(None, pattern="^(pending|active|archived)$"),
    offset: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    staff: Staff = Depends(get_current_staff),
):
    """Search or list Health Identities."""
    stmt = select(HealthIdentity)

    if q:
        stmt = stmt.where(HealthIdentity.display_name.ilike(f"%{q}%"))
    if store_id:
        stmt = stmt.where(HealthIdentity.primary_store_id == store_id)
    if status:
        stmt = stmt.where(HealthIdentity.activation_status == status)

    stmt = stmt.order_by(HealthIdentity.created_at.desc()).offset(offset).limit(limit)
    result = await db.execute(stmt)
    return result.scalars().all()


@router.patch("/{identity_id}", response_model=IdentityResponse)
async def update_identity(
    identity_id: uuid.UUID,
    body: IdentityUpdate,
    db: AsyncSession = Depends(get_db),
    staff: Staff = Depends(get_current_staff),
):
    """Update a Health Identity's mutable fields."""
    result = await db.execute(
        select(HealthIdentity).where(HealthIdentity.identity_id == identity_id)
    )
    identity = result.scalar_one_or_none()
    if identity is None:
        raise HTTPException(status_code=404, detail="Health Identity not found")

    if body.display_name is not None:
        identity.display_name = body.display_name
    if body.primary_store_id is not None:
        identity.primary_store_id = body.primary_store_id

    await db.commit()
    await db.refresh(identity)
    return identity


@router.post("/{identity_id}/activate", response_model=IdentityResponse)
async def activate_identity(identity_id: uuid.UUID, db: AsyncSession = Depends(get_db), staff: Staff = Depends(get_current_staff)):
    """Activate a Health Identity (pending → active)."""
    result = await db.execute(
        select(HealthIdentity).where(HealthIdentity.identity_id == identity_id)
    )
    identity = result.scalar_one_or_none()
    if identity is None:
        raise HTTPException(status_code=404, detail="Health Identity not found")

    if identity.activation_status.value != "pending":
        raise HTTPException(
            status_code=409,
            detail=f"Cannot activate: current status is '{identity.activation_status.value}'",
        )

    identity.activation_status = "active"
    identity.activated_at = datetime.now(timezone.utc)

    # Auto-append Timeline entry
    await append_timeline_entry(
        db,
        identity_id=identity.identity_id,
        event_type="identity_activated",
        source_object_type="HealthIdentity",
        source_object_id=identity.identity_id,
        summary_text=f"健康元 activated: {identity.display_name}",
        performed_by=staff.staff_id,
    )

    await db.commit()
    await db.refresh(identity)
    return identity


@router.post("/{identity_id}/archive", response_model=IdentityResponse)
async def archive_identity(identity_id: uuid.UUID, db: AsyncSession = Depends(get_db), staff: Staff = Depends(get_current_staff)):
    """Archive a Health Identity (active → archived)."""
    result = await db.execute(
        select(HealthIdentity).where(HealthIdentity.identity_id == identity_id)
    )
    identity = result.scalar_one_or_none()
    if identity is None:
        raise HTTPException(status_code=404, detail="Health Identity not found")

    if identity.activation_status.value == "archived":
        raise HTTPException(status_code=409, detail="Identity is already archived")

    identity.activation_status = "archived"

    await db.commit()
    await db.refresh(identity)
    return identity
