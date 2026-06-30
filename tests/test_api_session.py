"""Integration tests for Service Session API — DEV-040."""

import uuid

import pytest
from httpx import ASGITransport, AsyncClient

from health_one.platform.main import app


@pytest.fixture
def test_store_id():
    return uuid.uuid4()


async def _get_token() -> str:
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.post("/api/auth/login", json={"username": "admin", "password": "health123"})
        return resp.json()["access_token"]


async def _create_identity(store_id: uuid.UUID) -> str:
    token = await _get_token()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.post("/api/identities/", json={"display_name": "Session Test", "primary_store_id": str(store_id)}, headers={"Authorization": f"Bearer {token}"})
        return resp.json()["identity_id"]


@pytest.mark.asyncio
async def test_create_session(test_store_id):
    identity_id = await _create_identity(test_store_id)
    token = await _get_token()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.post(f"/api/identities/{identity_id}/sessions", json={"service_type": "健康舱", "store_id": str(test_store_id), "service_detail": "Test service"}, headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 201
    data = resp.json()
    assert data["service_type"] == "健康舱"
    assert data["identity_id"] == identity_id


@pytest.mark.asyncio
async def test_list_sessions(test_store_id):
    identity_id = await _create_identity(test_store_id)
    token = await _get_token()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        await client.post(f"/api/identities/{identity_id}/sessions", json={"service_type": "咨询", "store_id": str(test_store_id)}, headers={"Authorization": f"Bearer {token}"})
        resp = await client.get(f"/api/identities/{identity_id}/sessions", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    assert len(resp.json()) >= 1


@pytest.mark.asyncio
async def test_complete_session(test_store_id):
    identity_id = await _create_identity(test_store_id)
    token = await _get_token()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        create = await client.post(f"/api/identities/{identity_id}/sessions", json={"service_type": "检测", "store_id": str(test_store_id)}, headers={"Authorization": f"Bearer {token}"})
        sid = create.json()["session_id"]
        resp = await client.post(f"/api/identities/{identity_id}/sessions/{sid}/complete", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    assert resp.json()["completed_at"] is not None


@pytest.mark.asyncio
async def test_session_auth_required(test_store_id):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get(f"/api/identities/{uuid.uuid4()}/sessions")
    assert resp.status_code == 401
