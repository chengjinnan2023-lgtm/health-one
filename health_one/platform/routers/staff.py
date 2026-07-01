"""Staff Management API — 店长管理店员 (FEATURE-006).

All endpoints require 店长 role. Staff data lives in Store DB (SQLite).
Follows same Store DB access pattern as auth.py.
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select

from health_one.platform.auth import get_current_staff
from health_one.store.database import _get_session_factory
from health_one.store.models.staff import Staff, StaffRole
from health_one.store.schemas.staff import StaffResponse

router = APIRouter(prefix="/api/staff", tags=["Staff"])


# ── Inline schemas (minimal, avoids polluting store/schemas) ─────

class StaffCreateInput(BaseModel):
    """Input for creating a new staff member. store_id auto-injected from JWT."""
    display_name: str = Field(..., min_length=1, max_length=200)
    username: str = Field(..., min_length=3, max_length=100)
    role: str = Field(default="服务人员")
    password: str = Field(..., min_length=6, max_length=100)


class StaffStatusUpdate(BaseModel):
    """Input for updating staff status."""
    status: str = Field(..., pattern="^(active|inactive)$")


class PasswordReset(BaseModel):
    """Input for resetting a staff password."""
    password: str = Field(..., min_length=6, max_length=100)


# ── Role guard ────────────────────────────────────────────────────

def _require_manager(staff: Staff):
    if staff.role.value != "店长":
        raise HTTPException(status_code=403, detail="仅店长可管理店员")


def _validate_role(role: str) -> StaffRole:
    """Validate and convert role string to StaffRole enum."""
    try:
        return StaffRole(role)
    except ValueError:
        valid = [r.value for r in StaffRole]
        raise HTTPException(
            status_code=422,
            detail=f"无效角色: {role}。可选: {', '.join(valid)}",
        )


# ── Endpoints ─────────────────────────────────────────────────────


@router.get("/", response_model=list[StaffResponse])
async def list_staff(staff: Staff = Depends(get_current_staff)):
    """List all staff in the current store. 所有已认证角色可查看（用于分配下拉等场景）."""
    # Note: GET is open to all authenticated roles for assignment dropdowns (FEATURE-008A).
    # POST/PATCH/reset-password remain manager-only.

    async with _get_session_factory()() as session:
        result = await session.execute(
            select(Staff)
            .where(Staff.store_id == staff.store_id)
            .order_by(Staff.created_at)
        )
        staff_list = result.scalars().all()

    return [StaffResponse.model_validate(s) for s in staff_list]


@router.post("/", response_model=StaffResponse, status_code=201)
async def create_staff(
    body: StaffCreateInput,
    staff: Staff = Depends(get_current_staff),
):
    """Create a new staff member in the current store. 仅店长."""
    _require_manager(staff)
    role = _validate_role(body.role)

    async with _get_session_factory()() as session:
        # Check username uniqueness
        existing = await session.execute(
            select(Staff).where(Staff.username == body.username)
        )
        if existing.scalar_one_or_none():
            raise HTTPException(status_code=409, detail=f"用户名 '{body.username}' 已存在")

        new_staff = Staff(
            store_id=staff.store_id,
            display_name=body.display_name,
            username=body.username,
            role=role,
            password_hash=Staff.hash_password(body.password),
        )
        session.add(new_staff)
        await session.commit()
        await session.refresh(new_staff)

    return StaffResponse.model_validate(new_staff)


@router.patch("/{staff_id}", response_model=StaffResponse)
async def update_staff_status(
    staff_id: str,
    body: StaffStatusUpdate,
    staff: Staff = Depends(get_current_staff),
):
    """Update a staff member's status (active/inactive). 仅店长."""
    _require_manager(staff)

    async with _get_session_factory()() as session:
        target = await session.execute(
            select(Staff).where(Staff.staff_id == staff_id)
        )
        target = target.scalar_one_or_none()

        if target is None:
            raise HTTPException(status_code=404, detail="店员不存在")

        if target.store_id != staff.store_id:
            raise HTTPException(status_code=403, detail="无权操作其他门店店员")

        if target.staff_id == staff.staff_id:
            raise HTTPException(status_code=422, detail="店长不能停用自己的账号")

        target.status = body.status  # type: ignore[assignment]
        await session.commit()
        await session.refresh(target)

    return StaffResponse.model_validate(target)


@router.post("/{staff_id}/reset-password")
async def reset_staff_password(
    staff_id: str,
    body: PasswordReset,
    staff: Staff = Depends(get_current_staff),
):
    """Reset a staff member's password. 仅店长."""
    _require_manager(staff)

    async with _get_session_factory()() as session:
        target = await session.execute(
            select(Staff).where(Staff.staff_id == staff_id)
        )
        target = target.scalar_one_or_none()

        if target is None:
            raise HTTPException(status_code=404, detail="店员不存在")

        if target.store_id != staff.store_id:
            raise HTTPException(status_code=403, detail="无权操作其他门店店员")

        target.password_hash = Staff.hash_password(body.password)
        await session.commit()

    return {"ok": True, "message": f"已重置 {target.display_name} 的密码"}
