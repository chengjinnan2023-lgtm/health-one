"""Health Timeline Pydantic schemas — RFC-002 §3.2, §4.1."""

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class TimelineEntrySchema(BaseModel):
    """A single entry in a Health Timeline (Value Object)."""

    entry_id: str = Field(..., description="Unique within the timeline")
    timestamp: datetime = Field(...)
    event_type: str = Field(...)
    source_object_type: str = Field(...)
    source_object_id: uuid.UUID = Field(...)
    summary_text: str = Field(...)
    performed_by: str = Field(...)


class TimelineEntryCreate(BaseModel):
    """Input schema for appending a Timeline entry."""

    event_type: str = Field(...)
    source_object_type: str = Field(...)
    source_object_id: uuid.UUID = Field(...)
    summary_text: str = Field(..., min_length=1)
    performed_by: str = Field(..., min_length=1)


class TimelineResponse(BaseModel):
    """Schema for Health Timeline API responses."""

    model_config = ConfigDict(from_attributes=True)

    timeline_id: uuid.UUID
    identity_id: uuid.UUID
    entries: list[TimelineEntrySchema] = Field(default_factory=list)
