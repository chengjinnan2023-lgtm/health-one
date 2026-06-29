"""Health Profile Pydantic schemas — RFC-002 §3.1."""

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ProfileUpdate(BaseModel):
    """Schema for creating or updating a Health Profile."""

    basic_info: dict | None = Field(None, description="{birth_date, gender, height, weight, …}")
    medical_summary: str | None = Field(None, description="Known health summary (NOT a diagnosis)")
    lifestyle_notes: str | None = Field(None)
    primary_concern: str | None = Field(None)


class ProfileResponse(BaseModel):
    """Schema for Health Profile API responses."""

    model_config = ConfigDict(from_attributes=True)

    profile_id: uuid.UUID
    identity_id: uuid.UUID
    basic_info: dict | None = None
    medical_summary: str | None = None
    lifestyle_notes: str | None = None
    primary_concern: str | None = None
    last_updated_at: datetime
