// Health One — S6: Follow-Up Task (DEV-038).

import { useState, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";

const FOLLOWUP_METHODS = [
  { key: "phone", label: "📞 Phone" },
  { key: "wechat", label: "💬 WeChat" },
  { key: "sms", label: "📱 SMS" },
  { key: "in-store", label: "🏪 In-Store" },
];

const FOLLOWUP_REASONS = [
  "Service follow-up",
  "Health check",
  "Concern review",
  "General check-in",
];

export default function FollowUpScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { staff } = useAuth();

  const [reason, setReason] = useState("");
  const [method, setMethod] = useState("");
  const [plannedAt, setPlannedAt] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [planId, setPlanId] = useState<string | null>(null);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!id || !method || !plannedAt) return;
    setSaving(true);
    setError("");
    try {
      const data = await api.post<{ plan_id: string }>(
        `/api/identities/${id}/plans`,
        {
          follow_up_schedule: {
            method,
            planned_at: new Date(plannedAt).toISOString(),
            assigned_staff: staff?.staff_id || "",
            reason: reason || "Service follow-up",
            status: "pending",
          },
          created_by: staff?.staff_id || "",
        },
      );
      setPlanId(data.plan_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleMarkCompleted = async () => {
    if (!id || !planId) return;
    setSaving(true);
    setError("");
    try {
      await api.patch(`/api/identities/${id}/plans/${planId}`, {
        plan_status: "completed",
        follow_up_schedule: {
          method,
          planned_at: new Date(plannedAt).toISOString(),
          assigned_staff: staff?.staff_id || "",
          reason: reason || "Service follow-up",
          status: "completed",
          result: notes || "Follow-up completed",
        },
      });
      navigate(`/customers/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (planId) {
    return (
      <div data-testid="screen-s6" className="text-center py-12">
        <h1 className="text-2xl font-bold text-green-700 mb-4">
          ✓ Follow-Up Created
        </h1>
        <p className="text-gray-500 mb-2">Method: {method}</p>
        <p className="text-gray-500 mb-2">Planned: {plannedAt}</p>
        <p className="text-gray-500 mb-6">Status: pending</p>
        <div className="space-y-3 mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Follow-Up Result (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full max-w-md mx-auto border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Record follow-up outcome"
            data-testid="followup-result"
          />
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleMarkCompleted}
            disabled={saving}
            className="bg-green-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-green-700 disabled:opacity-50"
            data-testid="mark-completed-btn"
          >
            {saving ? "Saving..." : "Mark Completed"}
          </button>
          <button
            onClick={() => navigate(`/customers/${id}`)}
            className="bg-blue-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-blue-700"
            data-testid="back-to-s2"
          >
            Back to Summary
          </button>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="screen-s6">
      <h1 className="text-2xl font-bold mb-2">Follow-Up Task</h1>
      <p className="text-sm text-gray-500 mb-6">
        Ensure service does not end when the customer leaves.
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>
      )}

      <form onSubmit={handleCreate} className="bg-white border rounded-lg p-6 space-y-4">
        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason
          </label>
          <div className="flex flex-wrap gap-2">
            {FOLLOWUP_REASONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setReason(r)}
                className={`px-3 py-1.5 rounded-full text-sm border ${
                  reason === r
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                }`}
                data-testid={`reason-${r.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Follow-Up Method *
          </label>
          <div className="flex flex-wrap gap-2">
            {FOLLOWUP_METHODS.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => setMethod(m.key)}
                className={`px-3 py-1.5 rounded-full text-sm border ${
                  method === m.key
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                }`}
                data-testid={`method-${m.key}`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Planned Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Planned Date/Time *
          </label>
          <input
            type="datetime-local"
            value={plannedAt}
            onChange={(e) => setPlannedAt(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            data-testid="planned-at"
          />
        </div>

        {/* Staff */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assigned Staff
          </label>
          <input
            type="text"
            value={staff?.display_name || ""}
            disabled
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-gray-50 text-gray-500"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Follow-up script or notes"
            data-testid="followup-notes"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={saving || !method || !plannedAt}
            className="bg-blue-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            data-testid="create-followup-btn"
          >
            {saving ? "Creating..." : "Create Follow-Up"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/customers/${id}`)}
            className="text-gray-500 px-4 py-2 text-sm"
          >
            Skip
          </button>
        </div>
      </form>
    </div>
  );
}
