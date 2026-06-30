"""Health One — Test fixtures and configuration."""

import pytest
from httpx import ASGITransport, AsyncClient

from health_one.platform.main import app


@pytest.fixture
def platform_settings():
    """Return platform settings for testing (uses defaults)."""
    from health_one.platform.config import get_platform_settings

    get_platform_settings.cache_clear()
    return get_platform_settings()


@pytest.fixture
async def auth_headers() -> dict[str, str]:
    """Return Authorization header with a valid JWT for the seeded admin user."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.post(
            "/api/auth/login",
            json={"username": "admin", "password": "health123"},
        )
        token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
