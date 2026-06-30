"""Manager Dashboard API — aggregated store-level overview (FEATURE-002)."""

from collections import Counter
from datetime import date, datetime, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from health_one.platform.auth import get_current_staff
from health_one.platform.database import get_db
from health_one.platform.models.identity import HealthIdentity
from health_one.platform.models.plan import HealthPlan
from health_one.platform.models.session import ServiceSession
from health_one.store.models.staff import Staff

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/manager")
async def manager_dashboard(
    db: AsyncSession = Depends(get_db),
    staff: Staff = Depends(get_current_staff),
):
    """Return aggregated store-level data for the Manager Dashboard.

    Requires 店长 role. Returns customer counts, today stats,
    recent sessions, pending follow-ups, and top tags.
    """
    today = date.today()
    today_start = datetime(today.year, today.month, today.day, tzinfo=timezone.utc)

    # ─── Customer counts ──────────────────────────────────────
    total_result = await db.execute(select(func.count(HealthIdentity.identity_id)))
    total = total_result.scalar() or 0

    active_result = await db.execute(
        select(func.count(HealthIdentity.identity_id)).where(
            HealthIdentity.activation_status == "active"
        )
    )
    active = active_result.scalar() or 0

    pending_result = await db.execute(
        select(func.count(HealthIdentity.identity_id)).where(
            HealthIdentity.activation_status == "pending"
        )
    )
    pending = pending_result.scalar() or 0

    archived_result = await db.execute(
        select(func.count(HealthIdentity.identity_id)).where(
            HealthIdentity.activation_status == "archived"
        )
    )
    archived = archived_result.scalar() or 0

    today_new_result = await db.execute(
        select(func.count(HealthIdentity.identity_id)).where(
            HealthIdentity.created_at >= today_start
        )
    )
    today_new = today_new_result.scalar() or 0

    # ─── Today session count ──────────────────────────────────
    today_sessions_result = await db.execute(
        select(func.count(ServiceSession.session_id)).where(
            ServiceSession.created_at >= today_start
        )
    )
    today_sessions = today_sessions_result.scalar() or 0

    # ─── Recent sessions (latest 5) ───────────────────────────
    recent_sessions_result = await db.execute(
        select(ServiceSession, HealthIdentity.display_name)
        .join(HealthIdentity, ServiceSession.identity_id == HealthIdentity.identity_id)
        .order_by(ServiceSession.created_at.desc())
        .limit(5)
    )
    recent_sessions = [
        {
            "session_id": str(row[0].session_id),
            "customer_name": row[1],
            "identity_id": str(row[0].identity_id),
            "service_type": row[0].service_type.value,
            "started_at": row[0].started_at.isoformat() if row[0].started_at else None,
            "completed_at": row[0].completed_at.isoformat() if row[0].completed_at else None,
        }
        for row in recent_sessions_result.all()
    ]

    # ─── Pending follow-ups ───────────────────────────────────
    pending_plans_result = await db.execute(
        select(HealthPlan, HealthIdentity.display_name)
        .join(HealthIdentity, HealthPlan.identity_id == HealthIdentity.identity_id)
        .order_by(HealthPlan.created_at.desc())
        .limit(50)
    )
    pending_followups = []
    for row in pending_plans_result.all():
        plan = row[0]
        fu = plan.follow_up_schedule
        if fu and fu.get("status") == "pending":
            pending_followups.append({
                "plan_id": str(plan.plan_id),
                "customer_name": row[1],
                "identity_id": str(plan.identity_id),
                "method": fu.get("method", ""),
                "planned_at": fu.get("planned_at", ""),
                "reason": fu.get("reason", ""),
                "status": fu.get("status", ""),
            })

    pending_followups_count = len(pending_followups)
    pending_followups = pending_followups[:10]

    # ─── Top tags ─────────────────────────────────────────────
    all_tags_result = await db.execute(
        select(HealthIdentity.tags).where(
            HealthIdentity.activation_status != "archived"
        )
    )
    tag_counter: Counter = Counter()
    for (tags,) in all_tags_result.all():
        if tags:
            for t in tags:
                tag_counter[t] += 1
    top_tags = [
        {"tag": tag, "count": count}
        for tag, count in tag_counter.most_common(5)
    ]

    return {
        "customer_counts": {
            "total": total,
            "active": active,
            "pending": pending,
            "archived": archived,
            "today_new": today_new,
        },
        "today_sessions": today_sessions,
        "pending_followups_count": pending_followups_count,
        "recent_sessions": recent_sessions,
        "pending_followups": pending_followups,
        "top_tags": top_tags,
    }
