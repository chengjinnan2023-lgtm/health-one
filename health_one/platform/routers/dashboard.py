"""Manager Dashboard API — aggregated store-level overview (FEATURE-002)."""

from collections import Counter
from datetime import date, datetime, timedelta, timezone
from io import StringIO
import csv

from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy import or_, select, func
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


# ─── CSV Export ────────────────────────────────────────────────

METHOD_LABELS = {"phone": "电话", "wechat": "微信", "sms": "短信", "in-store": "到店"}


def _csv_response(rows: list[list[str]], filename: str) -> StreamingResponse:
    """Build a UTF-8 CSV StreamingResponse with BOM."""
    buf = StringIO()
    buf.write("﻿")  # BOM for Excel Chinese support
    writer = csv.writer(buf)
    for row in rows:
        writer.writerow(row)
    buf.seek(0)
    return StreamingResponse(
        iter([buf.getvalue()]),
        media_type="text/csv; charset=utf-8",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/manager/export/csv")
async def export_csv(
    type: str = Query(..., pattern="^(customers|sessions|followups)$"),
    export_date: str | None = Query(None, pattern=r"^\d{4}-\d{2}-\d{2}$"),
    db: AsyncSession = Depends(get_db),
    staff: Staff = Depends(get_current_staff),
):
    """Export daily data as CSV. 仅店长可见（前端 gate）。"""
    if export_date:
        target_date = date.fromisoformat(export_date)
    else:
        target_date = date.today()

    day_start = datetime(target_date.year, target_date.month, target_date.day, tzinfo=timezone.utc)
    day_end = datetime(target_date.year, target_date.month, target_date.day, 23, 59, 59, tzinfo=timezone.utc)
    date_str = target_date.isoformat()

    if type == "customers":
        result = await db.execute(
            select(HealthIdentity)
            .where(HealthIdentity.created_at >= day_start, HealthIdentity.created_at <= day_end)
            .order_by(HealthIdentity.created_at.desc())
        )
        rows = [["姓名", "状态", "标签", "创建时间"]]
        for ident in result.scalars().all():
            rows.append([
                ident.display_name,
                ident.activation_status.value,
                "、".join(ident.tags) if ident.tags else "",
                ident.created_at.astimezone(timezone.utc).strftime("%Y-%m-%d %H:%M"),
            ])
        return _csv_response(rows, f"customers-{date_str}.csv")

    elif type == "sessions":
        result = await db.execute(
            select(ServiceSession, HealthIdentity.display_name)
            .join(HealthIdentity, ServiceSession.identity_id == HealthIdentity.identity_id)
            .where(ServiceSession.created_at >= day_start, ServiceSession.created_at <= day_end)
            .order_by(ServiceSession.created_at.desc())
        )
        rows = [["客户名", "服务类型", "开始时间", "状态"]]
        for row in result.all():
            sess, name = row[0], row[1]
            rows.append([
                name,
                sess.service_type.value,
                sess.started_at.astimezone(timezone.utc).strftime("%Y-%m-%d %H:%M") if sess.started_at else "",
                "已完成" if sess.completed_at else "进行中",
            ])
        return _csv_response(rows, f"sessions-{date_str}.csv")

    elif type == "followups":
        result = await db.execute(
            select(HealthPlan, HealthIdentity.display_name)
            .join(HealthIdentity, HealthPlan.identity_id == HealthIdentity.identity_id)
            .order_by(HealthPlan.created_at.desc())
            .limit(100)
        )
        rows = [["客户名", "随访方式", "计划时间", "状态"]]
        for row in result.all():
            plan, name = row[0], row[1]
            fu = plan.follow_up_schedule
            if fu and fu.get("status") == "pending":
                rows.append([
                    name,
                    METHOD_LABELS.get(fu.get("method", ""), fu.get("method", "")),
                    fu.get("planned_at", "")[:10] if fu.get("planned_at") else "",
                    "待随访",
                ])
        return _csv_response(rows, f"followups-{date_str}.csv")


# ─── Follow-Up Queue ────────────────────────────────────────────

FOLLOW_UP_TAGS = ["需随访", "高意向"]


@router.get("/follow-up-queue")
async def follow_up_queue(
    db: AsyncSession = Depends(get_db),
    staff: Staff = Depends(get_current_staff),
):
    """Return consolidated follow-up queue for store staff.

    Merges two signal sources, deduplicated (followup takes priority):
    1. Pending follow-up plans (HealthPlan.follow_up_schedule.status == "pending")
    2. Active customers tagged 需随访 or 高意向 (without existing pending plans)
    """
    items: list[dict] = []
    seen_ids: set[str] = set()

    # ── Source 1: Pending follow-up plans ──────────────────────
    plan_result = await db.execute(
        select(HealthPlan, HealthIdentity)
        .join(HealthIdentity, HealthPlan.identity_id == HealthIdentity.identity_id)
        .where(HealthIdentity.activation_status != "archived")
        .order_by(HealthPlan.created_at.desc())
        .limit(100)
    )

    for row in plan_result.all():
        plan, identity = row[0], row[1]
        fu = plan.follow_up_schedule
        if not fu or fu.get("status") != "pending":
            continue
        iid = str(identity.identity_id)
        seen_ids.add(iid)
        items.append({
            "identity_id": iid,
            "customer_name": identity.display_name,
            "source": "followup",
            "reason": METHOD_LABELS.get(fu.get("method", ""), fu.get("method", "")),
            "planned_at": fu.get("planned_at", ""),
            "plan_id": str(plan.plan_id),
            "tags": identity.tags if identity.tags else [],
            "activation_status": identity.activation_status.value,
        })

    # ── Source 2: Tagged customers without pending plans ───────
    tag_conditions = [
        HealthIdentity.tags.contains([tag])
        for tag in FOLLOW_UP_TAGS
    ]
    tag_result = await db.execute(
        select(HealthIdentity)
        .where(
            HealthIdentity.activation_status == "active",
            or_(*tag_conditions),
        )
        .order_by(HealthIdentity.created_at.desc())
        .limit(100)
    )

    for identity in tag_result.scalars().all():
        iid = str(identity.identity_id)
        if iid in seen_ids:
            continue
        seen_ids.add(iid)
        # Determine which tag triggered the match
        matched_tags = [t for t in identity.tags if t in FOLLOW_UP_TAGS]
        items.append({
            "identity_id": iid,
            "customer_name": identity.display_name,
            "source": "tag",
            "reason": matched_tags[0] if matched_tags else "",
            "planned_at": None,
            "plan_id": None,
            "tags": identity.tags if identity.tags else [],
            "activation_status": identity.activation_status.value,
        })

    return {"items": items}


# ─── Manager Stats ──────────────────────────────────────────────


@router.get("/manager/stats")
async def manager_stats(
    period: str = Query(..., pattern="^(week|month)$"),
    db: AsyncSession = Depends(get_db),
    staff: Staff = Depends(get_current_staff),
):
    """Return weekly or monthly store stats for the Manager Stats page.

    period=week → current week (Monday–Sunday)
    period=month → current month (1st–last day)
    """
    today = date.today()

    # ── Period boundaries ──────────────────────────────────────
    if period == "week":
        week_start = today - timedelta(days=today.weekday())
        week_end = week_start + timedelta(days=6)
        start_dt = datetime(week_start.year, week_start.month, week_start.day, tzinfo=timezone.utc)
        end_dt = datetime(week_end.year, week_end.month, week_end.day, 23, 59, 59, tzinfo=timezone.utc)
        period_label = f"{week_start.isoformat()} ~ {week_end.isoformat()}"
    else:
        month_start = today.replace(day=1)
        if today.month == 12:
            month_end = today.replace(year=today.year + 1, month=1, day=1) - timedelta(days=1)
        else:
            month_end = today.replace(month=today.month + 1, day=1) - timedelta(days=1)
        start_dt = datetime(month_start.year, month_start.month, 1, tzinfo=timezone.utc)
        end_dt = datetime(month_end.year, month_end.month, month_end.day, 23, 59, 59, tzinfo=timezone.utc)
        period_label = f"{month_start.isoformat()} ~ {month_end.isoformat()}"

    # ── New customers in period ────────────────────────────────
    new_result = await db.execute(
        select(func.count(HealthIdentity.identity_id)).where(
            HealthIdentity.created_at >= start_dt,
            HealthIdentity.created_at <= end_dt,
        )
    )
    new_customers = new_result.scalar() or 0

    # ── Service sessions in period ─────────────────────────────
    sessions_result = await db.execute(
        select(func.count(ServiceSession.session_id)).where(
            ServiceSession.created_at >= start_dt,
            ServiceSession.created_at <= end_dt,
        )
    )
    service_sessions = sessions_result.scalar() or 0

    # ── Completed follow-ups in period ─────────────────────────
    # Note: uses plan.updated_at as proxy for completion time
    completed_result = await db.execute(
        select(func.count(HealthPlan.plan_id)).where(
            HealthPlan.follow_up_schedule["status"].astext == "completed",
            HealthPlan.updated_at >= start_dt,
            HealthPlan.updated_at <= end_dt,
        )
    )
    completed_followups = completed_result.scalar() or 0

    # ── Customer structure (reuse /manager logic) ──────────────
    total_result = await db.execute(select(func.count(HealthIdentity.identity_id)))
    total = total_result.scalar() or 0

    active_result = await db.execute(
        select(func.count(HealthIdentity.identity_id)).where(HealthIdentity.activation_status == "active")
    )
    active = active_result.scalar() or 0

    pending_result = await db.execute(
        select(func.count(HealthIdentity.identity_id)).where(HealthIdentity.activation_status == "pending")
    )
    pending = pending_result.scalar() or 0

    archived_result = await db.execute(
        select(func.count(HealthIdentity.identity_id)).where(HealthIdentity.activation_status == "archived")
    )
    archived = archived_result.scalar() or 0

    # ── Top tags (reuse /manager logic) ────────────────────────
    all_tags_result = await db.execute(
        select(HealthIdentity.tags).where(HealthIdentity.activation_status != "archived")
    )
    tag_counter: Counter = Counter()
    for (tags,) in all_tags_result.all():
        if tags:
            for t in tags:
                tag_counter[t] += 1
    top_tags = [{"tag": tag, "count": count} for tag, count in tag_counter.most_common(5)]

    return {
        "period": period,
        "period_label": period_label,
        "new_customers": new_customers,
        "service_sessions": service_sessions,
        "completed_followups": completed_followups,
        "customer_structure": {
            "total": total,
            "active": active,
            "pending": pending,
            "archived": archived,
        },
        "top_tags": top_tags,
    }
