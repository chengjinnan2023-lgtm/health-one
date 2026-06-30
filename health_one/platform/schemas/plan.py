"""Health Plan Pydantic schemas — RFC-002 §3.4."""

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class FollowUpSchedule(BaseModel):
    """Follow-up schedule value object."""

    method: str = Field(..., description="phone / wechat / sms / in-store")
    planned_at: str = Field(..., description="Planned follow-up time (ISO datetime)")
    assigned_staff: str = Field(..., description="Staff ID responsible")
    reason: str | None = None
    status: str = Field(default="pending")
    result: str | None = None


class PlanCreate(BaseModel):
    """Schema for creating a Health Plan (follow-up task in Sprint 3)."""

    follow_up_schedule: FollowUpSchedule | None = None
    goals: list[dict] = Field(default_factory=list)
    created_by: str | None = None


class PlanUpdate(BaseModel):
    """Schema for updating a Health Plan — follow-up status, result, or plan status."""

    plan_status: str | None = None
    follow_up_schedule: FollowUpSchedule | None = None
    goals: list[dict] | None = None


class PlanResponse(BaseModel):
    """Schema for Health Plan API responses."""

    model_config = ConfigDict(from_attributes=True)

    plan_id: uuid.UUID
    identity_id: uuid.UUID
    plan_status: str
    goals: list[dict] = Field(default_factory=list)
    follow_up_schedule: dict | None = None
    created_by: uuid.UUID | None = None
    created_at: datetime
    updated_at: datetime
