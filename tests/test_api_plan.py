"""Integration tests for Health Plan / Follow-Up API — DEV-040."""

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
        resp = await client.post("/api/identities/", json={"display_name": "Plan Test", "primary_store_id": str(store_id)}, headers={"Authorization": f"Bearer {token}"})
        return resp.json()["identity_id"]


@pytest.mark.asyncio
async def test_create_plan(test_store_id):
    identity_id = await _create_identity(test_store_id)
    token = await _get_token()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.post(f"/api/identities/{identity_id}/plans", json={"follow_up_schedule": {"method": "phone", "planned_at": "2026-07-03T10:00:00Z", "assigned_staff": "test", "reason": "Service follow-up", "status": "pending"}}, headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 201
    data = resp.json()
    assert data["plan_status"] == "active"
    assert data["follow_up_schedule"]["method"] == "phone"


@pytest.mark.asyncio
async def test_list_plans(test_store_id):
    identity_id = await _create_identity(test_store_id)
    token = await _get_token()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        await client.post(f"/api/identities/{identity_id}/plans", json={"follow_up_schedule": {"method": "wechat", "planned_at": "2026-07-03T10:00:00Z", "assigned_staff": "test", "status": "pending"}}, headers={"Authorization": f"Bearer {token}"})
        resp = await client.get(f"/api/identities/{identity_id}/plans", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    assert len(resp.json()) >= 1


@pytest.mark.asyncio
async def test_complete_plan(test_store_id):
    identity_id = await _create_identity(test_store_id)
    token = await _get_token()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        create = await client.post(f"/api/identities/{identity_id}/plans", json={"follow_up_schedule": {"method": "in-store", "planned_at": "2026-07-03T10:00:00Z", "assigned_staff": "test", "status": "pending"}}, headers={"Authorization": f"Bearer {token}"})
        pid = create.json()["plan_id"]
        resp = await client.patch(f"/api/identities/{identity_id}/plans/{pid}", json={"plan_status": "completed", "follow_up_schedule": {"method": "in-store", "planned_at": "2026-07-03T10:00:00Z", "assigned_staff": "test", "status": "completed", "result": "Follow-up done"}}, headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    assert resp.json()["plan_status"] == "completed"


@pytest.mark.asyncio
async def test_plan_auth_required(test_store_id):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get(f"/api/identities/{uuid.uuid4()}/plans")
    assert resp.status_code == 401
