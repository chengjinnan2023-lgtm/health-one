"""Health Identity Pydantic schemas — RFC-002 §2.1."""

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class IdentityCreate(BaseModel):
    """Schema for creating a new Health Identity."""

    display_name: str = Field(..., min_length=1, max_length=200)
    primary_store_id: uuid.UUID = Field(...)
    data_ownership_tag: str = Field(default="customer", pattern="^(customer|platform)$")


class IdentityUpdate(BaseModel):
    """Schema for updating an existing Health Identity."""

    display_name: str | None = Field(None, min_length=1, max_length=200)
    primary_store_id: uuid.UUID | None = None
    tags: list[str] | None = None


class IdentityResponse(BaseModel):
    """Schema for Health Identity API responses."""

    model_config = ConfigDict(from_attributes=True)

    identity_id: uuid.UUID
    display_name: str
    activation_status: str
    primary_store_id: uuid.UUID
    data_ownership_tag: str
    tags: list[str] = []
    created_at: datetime
    updated_at: datetime
    activated_at: datetime | None = None


class IdentitySearchParams(BaseModel):
    """Query parameters for identity search."""

    q: str | None = Field(None, description="Search by name (case-insensitive partial match)")
    store_id: uuid.UUID | None = Field(None, description="Filter by store")
    status: str | None = Field(None, pattern="^(pending|active|archived)$")
    offset: int = Field(default=0, ge=0)
    limit: int = Field(default=20, ge=1, le=100)
