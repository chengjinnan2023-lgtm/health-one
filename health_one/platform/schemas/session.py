"""Service Session Pydantic schemas — RFC-002 §3.5."""

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class SessionCreate(BaseModel):
    """Schema for creating a new Service Session."""

    service_type: str = Field(...)
    store_id: uuid.UUID = Field(...)
    pre_service_notes: str | None = None
    service_detail: str | None = None
    next_step_suggestion: str | None = None


class SessionUpdate(BaseModel):
    """Schema for updating a Service Session (feedback, notes, completion)."""

    service_detail: str | None = None
    post_service_notes: str | None = None
    customer_feedback: str | None = None
    next_step_suggestion: str | None = None
    completed_at: datetime | None = None


class SessionResponse(BaseModel):
    """Schema for Service Session API responses."""

    model_config = ConfigDict(from_attributes=True)

    session_id: uuid.UUID
    identity_id: uuid.UUID
    store_id: uuid.UUID
    staff_id: uuid.UUID
    service_type: str
    pre_service_notes: str | None = None
    service_detail: str | None = None
    post_service_notes: str | None = None
    customer_feedback: str | None = None
    next_step_suggestion: str | None = None
    started_at: datetime
    completed_at: datetime | None = None
    recorded_by: uuid.UUID
    created_at: datetime
    updated_at: datetime
