// Health One — Store Workbench API client.

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

function getToken(): string | null {
  return localStorage.getItem("access_token");
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
};

// ─── Typed API endpoints ─────────────────────────────────────────

export interface HealthIdentity {
  identity_id: string;
  display_name: string;
  activation_status: "pending" | "active" | "archived";
  primary_store_id: string;
  data_ownership_tag: "customer" | "platform";
  tags: string[];
  created_at: string;
  activated_at: string | null;
}

export interface HealthProfile {
  profile_id: string;
  identity_id: string;
  basic_info: Record<string, unknown>;
  medical_summary: string | null;
  lifestyle_notes: string | null;
  primary_concern: string | null;
  last_updated_at: string;
}

export interface TimelineEntry {
  entry_id: string;
  timestamp: string;
  event_type: string;
  source_object_type: string;
  source_object_id: string;
  summary_text: string;
  performed_by: string;
}

export interface HealthTimeline {
  timeline_id: string;
  identity_id: string;
  entries: TimelineEntry[];
}

export interface StaffInfo {
  staff_id: string;
  store_id: string;
  display_name: string;
  role: string;
  store_name: string;
}

export interface LoginResponse {
  access_token: string;
  staff: StaffInfo;
}
