"""Manager Dashboard API — aggregated store-level overview (FEATURE-002)."""

from collections import Counter
from datetime import date, datetime, timezone
from io import StringIO
import csv

from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
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
