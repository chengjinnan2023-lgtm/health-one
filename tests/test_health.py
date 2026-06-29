"""Health Check Tests."""

import pytest
from httpx import ASGITransport, AsyncClient

from health_one.platform.main import app


@pytest.mark.asyncio
async def test_health_check():
    """Verify the /health endpoint returns 200 with expected fields."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/health")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "platform-api"
    assert "version" in data
