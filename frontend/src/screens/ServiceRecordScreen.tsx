// Health One — S4: Service Record (DEV-034).

import { useState, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";

const SERVICE_TYPES = [
  { key: "健康舱", label: "健康舱 Health Cabin" },
  { key: "咨询", label: "咨询 Consultation" },
  { key: "检测", label: "检测 Testing" },
  { key: "其他", label: "其他 Other" },
];

export default function ServiceRecordScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { staff } = useAuth();
  const [serviceType, setServiceType] = useState("");
  const [preNotes, setPreNotes] = useState("");
  const [serviceDetail, setServiceDetail] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!id || !serviceType || !staff) return;
    setSaving(true);
    setError("");
    try {
      const data = await api.post<{ session_id: string }>(
        `/api/identities/${id}/sessions`,
        {
          service_type: serviceType,
          store_id: staff.store_id,
          pre_service_notes: preNotes || null,
          service_detail: serviceDetail || null,
          next_step_suggestion: nextStep || null,
        },
      );
      // Navigate to S5 Feedback with session_id
      navigate(`/customers/${id}/feedback?session_id=${data.session_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setSaving(false);
    }
  };

  return (
    <div data-testid="screen-s4">
      <h1 className="text-2xl font-bold mb-2">Service Record</h1>
      <p className="text-sm text-gray-500 mb-6">
        Record the store service delivered to the customer.
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>
      )}

      <form onSubmit={handleCreate} className="bg-white border rounded-lg p-6 space-y-4">
          {/* Service Type */}
          <fieldset>
            <legend className="text-sm font-medium text-gray-700 mb-2">
              Service Type *
            </legend>
            <div className="flex flex-wrap gap-2">
              {SERVICE_TYPES.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setServiceType(t.key)}
                  className={`px-3 py-1.5 rounded-full text-sm border ${
                    serviceType === t.key
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                  }`}
                  data-testid={`service-type-${t.key}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Staff */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Staff
            </label>
            <input
              type="text"
              value={staff?.display_name || ""}
              disabled
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-gray-50 text-gray-500"
            />
          </div>

          {/* Pre-service Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pre-Service Notes
            </label>
            <textarea
              value={preNotes}
              onChange={(e) => setPreNotes(e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Customer state before service"
              data-testid="pre-notes"
            />
          </div>

          {/* Service Detail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Detail *
            </label>
            <textarea
              value={serviceDetail}
              onChange={(e) => setServiceDetail(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What service was delivered?"
              required
              data-testid="service-detail"
            />
          </div>

          {/* Next Step */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Suggested Next Step
            </label>
            <input
              type="text"
              value={nextStep}
              onChange={(e) => setNextStep(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Recommend follow-up in 3 days"
              data-testid="next-step"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={saving || !serviceType}
              className="bg-blue-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              data-testid="save-btn"
            >
              {saving ? "Saving..." : "Save Service Record"}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/customers/${id}`)}
              className="text-gray-500 px-4 py-2 text-sm"
            >
              Back
            </button>
          </div>
          <p className="text-xs text-gray-400">
            Required: service type + detail ≤ 5 fields
          </p>
        </form>
    </div>
  );
}
