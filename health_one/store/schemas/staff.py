"""Staff Pydantic schemas. NEVER expose password_hash."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class StaffCreate(BaseModel):
    """Schema for creating a Staff (admin/seed use only)."""

    store_id: str = Field(...)
    display_name: str = Field(..., min_length=1, max_length=200)
    username: str = Field(..., min_length=3, max_length=100)
    password: str = Field(..., min_length=6, max_length=100)
    role: str = Field(default="服务人员")
    contact_info: str | None = None


class StaffResponse(BaseModel):
    """Schema for Staff API responses. password_hash is NEVER included."""

    model_config = ConfigDict(from_attributes=True)

    staff_id: str
    store_id: str
    display_name: str
    role: str
    contact_info: str | None = None
    status: str
    username: str
    created_at: datetime
    updated_at: datetime


class StaffLoginRequest(BaseModel):
    """Login credentials."""

    username: str = Field(..., min_length=1)
    password: str = Field(..., min_length=1)


class StaffLoginResponse(BaseModel):
    """Login response — JWT token + staff info."""

    access_token: str
    token_type: str = "bearer"
    staff: StaffResponse
