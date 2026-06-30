"""Health Plan / Follow-Up API endpoints — RFC-002 §3.4."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from health_one.platform.auth import get_current_staff
from health_one.platform.database import get_db
from health_one.platform.models.identity import HealthIdentity
from health_one.platform.models.plan import HealthPlan
from health_one.platform.schemas.plan import PlanCreate, PlanResponse, PlanUpdate
from health_one.platform.services.timeline import append_timeline_entry
from health_one.store.models.staff import Staff

router = APIRouter(prefix="/api/identities", tags=["Plan"])


@router.post("/{identity_id}/plans", response_model=PlanResponse, status_code=201)
async def create_plan(
    identity_id: uuid.UUID,
    body: PlanCreate,
    db: AsyncSession = Depends(get_db),
    staff: Staff = Depends(get_current_staff),
):
    """Create a Health Plan (follow-up task in Sprint 3)."""
    result = await db.execute(
        select(HealthIdentity).where(HealthIdentity.identity_id == identity_id)
    )
    identity = result.scalar_one_or_none()
    if identity is None:
        raise HTTPException(status_code=404, detail="Health Identity not found")

    plan = HealthPlan(
        plan_id=uuid.uuid4(),
        identity_id=identity_id,
        goals=body.goals,
        follow_up_schedule=body.follow_up_schedule.model_dump() if body.follow_up_schedule else None,
        created_by=staff.staff_id,
    )
    db.add(plan)
    await db.flush()

    await append_timeline_entry(
        db,
        identity_id=identity_id,
        event_type="plan_updated",
        source_object_type="HealthPlan",
        source_object_id=plan.plan_id,
        summary_text="Follow-up plan created"
        + (f" — method: {body.follow_up_schedule.method}" if body.follow_up_schedule else ""),
        performed_by=staff.staff_id,
    )

    await db.commit()
    await db.refresh(plan)
    return plan


@router.get("/{identity_id}/plans", response_model=list[PlanResponse])
async def list_plans(
    identity_id: uuid.UUID,
    status: str | None = Query(None, pattern="^(draft|active|completed|archived)$"),
    limit: int = Query(10, ge=1, le=50),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
    staff: Staff = Depends(get_current_staff),
):
    """List Health Plans for a Health Identity (active first, newest first)."""
    stmt = select(HealthPlan).where(HealthPlan.identity_id == identity_id)
    if status:
        stmt = stmt.where(HealthPlan.plan_status == status)
    stmt = stmt.order_by(HealthPlan.created_at.desc()).offset(offset).limit(limit)
    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/{identity_id}/plans/{plan_id}", response_model=PlanResponse)
async def get_plan(
    identity_id: uuid.UUID,
    plan_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    staff: Staff = Depends(get_current_staff),
):
    """Get a specific Health Plan."""
    result = await db.execute(
        select(HealthPlan).where(
            HealthPlan.plan_id == plan_id,
            HealthPlan.identity_id == identity_id,
        )
    )
    plan = result.scalar_one_or_none()
    if plan is None:
        raise HTTPException(status_code=404, detail="Health Plan not found")
    return plan


@router.patch("/{identity_id}/plans/{plan_id}", response_model=PlanResponse)
async def update_plan(
    identity_id: uuid.UUID,
    plan_id: uuid.UUID,
    body: PlanUpdate,
    db: AsyncSession = Depends(get_db),
    staff: Staff = Depends(get_current_staff),
):
    """Update a Health Plan — follow-up status, result, or plan status."""
    result = await db.execute(
        select(HealthPlan).where(
            HealthPlan.plan_id == plan_id,
            HealthPlan.identity_id == identity_id,
        )
    )
    plan = result.scalar_one_or_none()
    if plan is None:
        raise HTTPException(status_code=404, detail="Health Plan not found")

    if body.plan_status is not None:
        plan.plan_status = body.plan_status
    if body.follow_up_schedule is not None:
        plan.follow_up_schedule = body.follow_up_schedule.model_dump()
    if body.goals is not None:
        plan.goals = body.goals

    await append_timeline_entry(
        db,
        identity_id=identity_id,
        event_type="plan_updated",
        source_object_type="HealthPlan",
        source_object_id=plan.plan_id,
        summary_text=f"Follow-up status: {plan.plan_status}"
        + (f" — method: {plan.follow_up_schedule.get('method', 'N/A')}" if plan.follow_up_schedule else ""),
        performed_by=staff.staff_id,
    )

    await db.commit()
    await db.refresh(plan)
    return plan
