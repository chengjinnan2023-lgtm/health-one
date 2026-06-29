"""JWT Auth — token creation, validation, and FastAPI dependency.

Sprint 2 MVP: Platform reads Staff credentials from Store DB (SQLite).
This is an intentional trade-off per SPRINT-002-PLAN §9 Risk R3.
Post-MVP: Auth moves to a dedicated Store API or shared auth service.
"""

from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from sqlalchemy import select

from health_one.platform.config import get_platform_settings
from health_one.store.database import _get_session_factory
from health_one.store.models.staff import Staff

security_scheme = HTTPBearer(auto_error=False)


# ─── JWT Token Functions ────────────────────────────────────────


def create_access_token(*, staff_id: str, store_id: str, role: str) -> str:
    """Create a JWT access token for an authenticated staff member."""
    settings = get_platform_settings()
    expire = datetime.now(timezone.utc) + timedelta(hours=settings.JWT_EXPIRE_HOURS)
    payload = {
        "sub": staff_id,
        "store_id": store_id,
        "role": role,
        "exp": expire,
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_access_token(token: str) -> dict:
    """Decode and validate a JWT access token. Raises JWTError on failure."""
    settings = get_platform_settings()
    return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])


# ─── FastAPI Dependencies ────────────────────────────────────────


async def get_current_staff(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Depends(security_scheme),
) -> Staff:
    """FastAPI dependency — extract and validate JWT, return Staff object.

    Raises HTTP 401 if token is missing, invalid, or expired.
    Reads Staff from Store DB (SQLite) — intentional trade-off for MVP.
    """
    if credentials is None:
        raise HTTPException(status_code=401, detail="Not authenticated")

    # Decode token
    try:
        payload = decode_access_token(credentials.credentials)
    except JWTError as err:
        raise HTTPException(status_code=401, detail="Invalid or expired token") from err

    staff_id: str | None = payload.get("sub")
    if staff_id is None:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    # Fetch staff from Store DB
    # HACK(sprint-2): Platform reads Store DB directly for auth.
    # Remove when Store API is available (Sprint 3+).
    async with _get_session_factory()() as session:
        result = await session.execute(
            select(Staff).where(Staff.staff_id == staff_id)
        )
        staff = result.scalar_one_or_none()

    if staff is None:
        raise HTTPException(status_code=401, detail="Staff not found")

    if staff.status.value != "active":
        raise HTTPException(status_code=403, detail="Staff account is inactive")

    return staff


def require_store_access(target_store_id: str):
    """Factory — returns a dependency that enforces store-scoped access.

    Usage:
        @router.get("/store/{store_id}/data")
        async def get_data(
            store_id: str,
            staff: Staff = Depends(get_current_staff),
            _: None = Depends(require_store_access(store_id)),
        ):
            ...

    MVP note: Simplified. All staff can access their own store's data.
    Cross-store access is denied with HTTP 403.
    """

    async def _verifier(staff: Staff = Depends(get_current_staff)):
        if staff.store_id != target_store_id:
            raise HTTPException(
                status_code=403,
                detail="Access denied: data belongs to a different store",
            )

    return _verifier
