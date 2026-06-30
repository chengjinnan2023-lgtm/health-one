"""Service Session API endpoints — RFC-002 §3.5."""

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from health_one.platform.auth import get_current_staff
from health_one.platform.database import get_db
from health_one.platform.models.identity import HealthIdentity
from health_one.platform.models.session import ServiceSession
from health_one.platform.schemas.session import (
    SessionCreate,
    SessionResponse,
    SessionUpdate,
)
from health_one.platform.services.timeline import append_timeline_entry
from health_one.store.models.staff import Staff

router = APIRouter(prefix="/api/identities", tags=["Session"])


@router.post("/{identity_id}/sessions", response_model=SessionResponse, status_code=201)
async def create_session(
    identity_id: uuid.UUID,
    body: SessionCreate,
    db: AsyncSession = Depends(get_db),
    staff: Staff = Depends(get_current_staff),
):
    """Create a new Service Session for a Health Identity."""
    # Verify identity exists
    result = await db.execute(
        select(HealthIdentity).where(HealthIdentity.identity_id == identity_id)
    )
    identity = result.scalar_one_or_none()
    if identity is None:
        raise HTTPException(status_code=404, detail="Health Identity not found")

    session = ServiceSession(
        session_id=uuid.uuid4(),
        identity_id=identity_id,
        store_id=body.store_id,
        staff_id=staff.staff_id,
        service_type=body.service_type,
        pre_service_notes=body.pre_service_notes,
        service_detail=body.service_detail,
        next_step_suggestion=body.next_step_suggestion,
        recorded_by=staff.staff_id,
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session


@router.get("/{identity_id}/sessions", response_model=list[SessionResponse])
async def list_sessions(
    identity_id: uuid.UUID,
    limit: int = Query(10, ge=1, le=50),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
    staff: Staff = Depends(get_current_staff),
):
    """List Service Sessions for a Health Identity (newest first)."""
    stmt = (
        select(ServiceSession)
        .where(ServiceSession.identity_id == identity_id)
        .order_by(ServiceSession.started_at.desc())
        .offset(offset)
        .limit(limit)
    )
    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/{identity_id}/sessions/{session_id}", response_model=SessionResponse)
async def get_session(
    identity_id: uuid.UUID,
    session_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    staff: Staff = Depends(get_current_staff),
):
    """Get a specific Service Session."""
    result = await db.execute(
        select(ServiceSession).where(
            ServiceSession.session_id == session_id,
            ServiceSession.identity_id == identity_id,
        )
    )
    session = result.scalar_one_or_none()
    if session is None:
        raise HTTPException(status_code=404, detail="Service Session not found")
    return session


@router.patch("/{identity_id}/sessions/{session_id}", response_model=SessionResponse)
async def update_session(
    identity_id: uuid.UUID,
    session_id: uuid.UUID,
    body: SessionUpdate,
    db: AsyncSession = Depends(get_db),
    staff: Staff = Depends(get_current_staff),
):
    """Update a Service Session (feedback, notes, or mark completed)."""
    result = await db.execute(
        select(ServiceSession).where(
            ServiceSession.session_id == session_id,
            ServiceSession.identity_id == identity_id,
        )
    )
    session = result.scalar_one_or_none()
    if session is None:
        raise HTTPException(status_code=404, detail="Service Session not found")

    if body.service_detail is not None:
        session.service_detail = body.service_detail
    if body.post_service_notes is not None:
        session.post_service_notes = body.post_service_notes
    if body.customer_feedback is not None:
        session.customer_feedback = body.customer_feedback
    if body.next_step_suggestion is not None:
        session.next_step_suggestion = body.next_step_suggestion

    was_completed = session.completed_at is not None
    if body.completed_at is not None and not was_completed:
        session.completed_at = body.completed_at
        # Auto-append Timeline entry
        await append_timeline_entry(
            db,
            identity_id=identity_id,
            event_type="service_completed",
            source_object_type="ServiceSession",
            source_object_id=session.session_id,
            summary_text=f"Service completed: {session.service_type}"
            + (f" — {session.service_detail[:50]}" if session.service_detail else ""),
            performed_by=staff.staff_id,
        )

    await db.commit()
    await db.refresh(session)
    return session


@router.post("/{identity_id}/sessions/{session_id}/complete", response_model=SessionResponse)
async def complete_session(
    identity_id: uuid.UUID,
    session_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    staff: Staff = Depends(get_current_staff),
):
    """Mark a Service Session as completed. Auto-appends Timeline entry."""
    result = await db.execute(
        select(ServiceSession).where(
            ServiceSession.session_id == session_id,
            ServiceSession.identity_id == identity_id,
        )
    )
    session = result.scalar_one_or_none()
    if session is None:
        raise HTTPException(status_code=404, detail="Service Session not found")

    if session.completed_at is not None:
        raise HTTPException(status_code=409, detail="Session is already completed")

    session.completed_at = datetime.now(timezone.utc)

    await append_timeline_entry(
        db,
        identity_id=identity_id,
        event_type="service_completed",
        source_object_type="ServiceSession",
        source_object_id=session.session_id,
        summary_text=f"Service completed: {session.service_type}"
        + (f" — {session.service_detail[:50]}" if session.service_detail else ""),
        performed_by=staff.staff_id,
    )

    await db.commit()
    await db.refresh(session)
    return session
