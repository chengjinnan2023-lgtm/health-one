"""Auth API endpoints — Staff login and token validation."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select

from health_one.platform.auth import create_access_token, get_current_staff
from health_one.store.database import _get_session_factory
from health_one.store.models.staff import Staff
from health_one.store.schemas.staff import (
    StaffLoginRequest,
    StaffLoginResponse,
    StaffResponse,
)

router = APIRouter(prefix="/api/auth", tags=["Auth"])


@router.post("/login", response_model=StaffLoginResponse)
async def login(body: StaffLoginRequest):
    """Authenticate staff with username + password. Returns JWT token.

    MVP: Platform reads Staff credentials from Store DB (SQLite).
    This endpoint does NOT require prior authentication.
    """
    # HACK(sprint-2): Platform reads Store DB for auth.
    async with _get_session_factory()() as session:
        result = await session.execute(
            select(Staff).where(Staff.username == body.username)
        )
        staff = result.scalar_one_or_none()

    if staff is None:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    if not staff.verify_password(body.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    if staff.status.value != "active":
        raise HTTPException(status_code=403, detail="Staff account is inactive")

    # Issue JWT
    token = create_access_token(
        staff_id=staff.staff_id,
        store_id=staff.store_id,
        role=staff.role.value,
    )

    return StaffLoginResponse(
        access_token=token,
        staff=StaffResponse.model_validate(staff),
    )


@router.get("/me", response_model=StaffResponse)
async def get_me(staff: Staff = Depends(get_current_staff)):
    """Return the currently authenticated staff member's info."""
    return StaffResponse.model_validate(staff)
