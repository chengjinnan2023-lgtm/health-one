"""Store Pydantic schemas."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class StoreResponse(BaseModel):
    """Schema for Store API responses. Never exposes internal config."""

    model_config = ConfigDict(from_attributes=True)

    store_id: str
    store_name: str
    store_code: str
    location: str | None = None
    operating_status: str
    store_type: str
    created_at: datetime
    updated_at: datetime
