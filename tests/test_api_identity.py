"""Integration tests for Health Identity API — DEV-010.

Tests run against a test PostgreSQL database via FastAPI TestClient.
"""

import uuid

import pytest
from httpx import ASGITransport, AsyncClient

from health_one.platform.main import app


@pytest.fixture
def test_store_id():
    return uuid.uuid4()


@pytest.mark.asyncio
async def test_create_identity(test_store_id):
    """POST /api/identities/ — create a new Health Identity."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/identities/",
            json={
                "display_name": "Test Customer",
                "primary_store_id": str(test_store_id),
            },
        )
    assert response.status_code == 201
    data = response.json()
    assert data["display_name"] == "Test Customer"
    assert data["activation_status"] == "pending"
    assert data["primary_store_id"] == str(test_store_id)
    assert "identity_id" in data
    assert "created_at" in data


@pytest.mark.asyncio
async def test_get_identity_not_found():
    """GET /api/identities/{id} — 404 for nonexistent identity."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get(f"/api/identities/{uuid.uuid4()}")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_create_and_get_identity(test_store_id):
    """Full create → get roundtrip."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Create
        create_resp = await client.post(
            "/api/identities/",
            json={
                "display_name": "Get Test",
                "primary_store_id": str(test_store_id),
            },
        )
        assert create_resp.status_code == 201
        identity_id = create_resp.json()["identity_id"]

        # Get
        get_resp = await client.get(f"/api/identities/{identity_id}")
        assert get_resp.status_code == 200
        assert get_resp.json()["display_name"] == "Get Test"


@pytest.mark.asyncio
async def test_search_identities(test_store_id):
    """GET /api/identities/?q= — search by name."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Create two identities
        await client.post(
            "/api/identities/",
            json={"display_name": "Alice Search", "primary_store_id": str(test_store_id)},
        )
        await client.post(
            "/api/identities/",
            json={"display_name": "Bob Other", "primary_store_id": str(test_store_id)},
        )

        # Search for "Alice"
        resp = await client.get("/api/identities/?q=Alice")
        assert resp.status_code == 200
        data = resp.json()
        assert len(data) >= 1
        assert any(i["display_name"] == "Alice Search" for i in data)


@pytest.mark.asyncio
async def test_activate_identity(test_store_id):
    """POST /api/identities/{id}/activate — transition pending → active."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Create
        create_resp = await client.post(
            "/api/identities/",
            json={"display_name": "Activate Me", "primary_store_id": str(test_store_id)},
        )
        identity_id = create_resp.json()["identity_id"]

        # Activate
        activate_resp = await client.post(f"/api/identities/{identity_id}/activate")
        assert activate_resp.status_code == 200
        data = activate_resp.json()
        assert data["activation_status"] == "active"
        assert data["activated_at"] is not None


@pytest.mark.asyncio
async def test_archive_identity(test_store_id):
    """POST /api/identities/{id}/archive — transition active → archived."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Create + activate
        create_resp = await client.post(
            "/api/identities/",
            json={"display_name": "Archive Me", "primary_store_id": str(test_store_id)},
        )
        identity_id = create_resp.json()["identity_id"]
        await client.post(f"/api/identities/{identity_id}/activate")

        # Archive
        archive_resp = await client.post(f"/api/identities/{identity_id}/archive")
        assert archive_resp.status_code == 200
        assert archive_resp.json()["activation_status"] == "archived"


@pytest.mark.asyncio
async def test_update_identity(test_store_id):
    """PATCH /api/identities/{id} — update display_name."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        create_resp = await client.post(
            "/api/identities/",
            json={"display_name": "Old Name", "primary_store_id": str(test_store_id)},
        )
        identity_id = create_resp.json()["identity_id"]

        patch_resp = await client.patch(
            f"/api/identities/{identity_id}",
            json={"display_name": "New Name"},
        )
        assert patch_resp.status_code == 200
        assert patch_resp.json()["display_name"] == "New Name"
