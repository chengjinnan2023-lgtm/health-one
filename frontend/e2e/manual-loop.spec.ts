/**
 * E2E: Full manual service loop — DEV-041.
 *
 * Tests the complete Health One value loop via API calls.
 * Requires Platform API running with PostgreSQL + seed data.
 */

import { test, expect } from "@playwright/test";

const API = "http://localhost:8000";

interface LoginResponse {
  access_token: string;
  staff: { staff_id: string; store_id: string; display_name: string };
}

interface IdentityResponse {
  identity_id: string;
  activation_status: string;
}

test.describe("Manual Service Loop", () => {
  let token: string;
  let storeId: string;
  let identityId: string;

  test("step 1 — login", async ({ request }) => {
    const resp = await request.post(`${API}/api/auth/login`, {
      data: { username: "admin", password: "health123" },
    });
    expect(resp.status()).toBe(200);
    const body: LoginResponse = await resp.json();
    expect(body.access_token).toBeTruthy();
    token = body.access_token;
    storeId = body.staff.store_id;
  });

  test("step 2 — create customer", async ({ request }) => {
    const resp = await request.post(`${API}/api/identities/`, {
      data: {
        display_name: "E2E Test Customer",
        primary_store_id: storeId,
      },
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(resp.status()).toBe(201);
    const body: IdentityResponse = await resp.json();
    identityId = body.identity_id;
    expect(body.activation_status).toBe("pending");
  });

  test("step 3 — activate 健康元", async ({ request }) => {
    const resp = await request.post(
      `${API}/api/identities/${identityId}/activate`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    expect(resp.status()).toBe(200);
    const body: IdentityResponse = await resp.json();
    expect(body.activation_status).toBe("active");
  });

  test("step 4 — record concern", async ({ request }) => {
    const resp = await request.put(
      `${API}/api/identities/${identityId}/profile`,
      {
        data: { primary_concern: "肩颈 — E2E test concern" },
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    expect(resp.status()).toBe(200);
  });

  test("step 5 — create service session", async ({ request }) => {
    const resp = await request.post(
      `${API}/api/identities/${identityId}/sessions`,
      {
        data: {
          service_type: "健康舱",
          store_id: storeId,
          service_detail: "E2E test service",
        },
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    expect(resp.status()).toBe(201);
  });

  test("step 6 — complete service + feedback", async ({ request }) => {
    // Get the session
    const listResp = await request.get(
      `${API}/api/identities/${identityId}/sessions?limit=1`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const sessions = await listResp.json();
    const sessionId = sessions[0].session_id;

    const resp = await request.patch(
      `${API}/api/identities/${identityId}/sessions/${sessionId}`,
      {
        data: {
          customer_feedback: "Satisfied",
          completed_at: new Date().toISOString(),
        },
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    expect(resp.status()).toBe(200);
  });

  test("step 7 — create follow-up", async ({ request }) => {
    const resp = await request.post(
      `${API}/api/identities/${identityId}/plans`,
      {
        data: {
          follow_up_schedule: {
            method: "phone",
            planned_at: "2026-07-03T10:00:00Z",
            assigned_staff: "test",
            status: "pending",
          },
        },
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    expect(resp.status()).toBe(201);
  });

  test("step 8 — verify timeline", async ({ request }) => {
    const resp = await request.get(
      `${API}/api/identities/${identityId}/timeline?limit=20`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    expect(resp.status()).toBe(200);
    const body = await resp.json();
    expect(body.entries.length).toBeGreaterThanOrEqual(5);
    const types = body.entries.map((e: { event_type: string }) => e.event_type);
    expect(types).toContain("identity_created");
    expect(types).toContain("identity_activated");
    expect(types).toContain("profile_updated");
    expect(types).toContain("service_completed");
    expect(types).toContain("plan_updated");
  });
});
