"""Integration tests for Auth API — DEV-015.

Tests login and /me endpoints against the real Store DB (SQLite).
"""

import pytest
from httpx import ASGITransport, AsyncClient

from health_one.platform.main import app


@pytest.mark.asyncio
async def test_login_success():
    """POST /api/auth/login — valid credentials return JWT."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/auth/login",
            json={"username": "admin", "password": "health123"},
        )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["staff"]["username"] == "admin"
    assert data["staff"]["role"] == "店长"


@pytest.mark.asyncio
async def test_login_wrong_password():
    """POST /api/auth/login — wrong password returns 401."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/auth/login",
            json={"username": "admin", "password": "wrong"},
        )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_login_nonexistent_user():
    """POST /api/auth/login — nonexistent user returns 401."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/auth/login",
            json={"username": "nobody", "password": "x"},
        )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_me_with_valid_token():
    """GET /api/auth/me — valid token returns staff info."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Login first
        login_resp = await client.post(
            "/api/auth/login",
            json={"username": "admin", "password": "health123"},
        )
        token = login_resp.json()["access_token"]

        # Get /me
        me_resp = await client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert me_resp.status_code == 200
        assert me_resp.json()["username"] == "admin"


@pytest.mark.asyncio
async def test_me_without_token():
    """GET /api/auth/me — no token returns 401."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/auth/me")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_me_with_invalid_token():
    """GET /api/auth/me — invalid token returns 401."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get(
            "/api/auth/me",
            headers={"Authorization": "Bearer invalid-token"},
        )
    assert response.status_code == 401
