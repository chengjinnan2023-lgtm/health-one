// Health One — S2: Customer 健康元 Summary (DEV-018).

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  api,
  type HealthIdentity,
  type HealthProfile,
  type TimelineEntry,
} from "../api/client";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  active: "bg-green-100 text-green-800",
  archived: "bg-gray-100 text-gray-500",
};

export default function CustomerSummaryScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [identity, setIdentity] = useState<HealthIdentity | null>(null);
  const [profile, setProfile] = useState<HealthProfile | null>(null);
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    loadData();
  }, [id]);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [i, p, t] = await Promise.all([
        api.get<HealthIdentity>(`/api/identities/${id}`),
        api
          .get<HealthProfile>(`/api/identities/${id}/profile`)
          .catch(() => null),
        api
          .get<{ entries: TimelineEntry[] }>(
            `/api/identities/${id}/timeline?limit=10`,
          )
          .then((r) => r.entries)
          .catch(() => []),
      ]);
      setIdentity(i);
      setProfile(p);
      setEntries(t);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  async function handleActivate() {
    if (!id) return;
    try {
      const updated = await api.post<HealthIdentity>(
        `/api/identities/${id}/activate`,
      );
      setIdentity(updated);
      loadData(); // refresh timeline
    } catch (err) {
      setError(err instanceof Error ? err.message : "Activate failed");
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-400" data-testid="screen-s2">
        Loading...
      </div>
    );
  }

  if (error || !identity) {
    return (
      <div className="text-center py-12 text-red-500" data-testid="screen-s2">
        {error || "Customer not found"}
      </div>
    );
  }

  return (
    <div data-testid="screen-s2">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {identity.display_name}
          </h1>
          <span
            className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[identity.activation_status]}`}
          >
            {identity.activation_status}
          </span>
        </div>
        <div className="flex gap-2">
          {identity.activation_status === "pending" && (
            <button
              onClick={handleActivate}
              className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700"
              data-testid="activate-btn"
            >
              Activate 健康元
            </button>
          )}
          {identity.activation_status === "active" && (
            <button
              onClick={() => navigate(`/customers/${id}/concern`)}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700"
              data-testid="record-concern-btn"
            >
              Record Concern
            </button>
          )}
        </div>
      </div>

      {/* Health Profile */}
      <section className="bg-white border rounded-lg p-6 mb-4">
        <h2 className="text-lg font-semibold mb-3">Health Profile</h2>
        {profile ? (
          <dl className="grid grid-cols-2 gap-3 text-sm">
            {profile.basic_info &&
              Object.entries(profile.basic_info).map(([k, v]) => (
                <div key={k}>
                  <dt className="text-gray-500 text-xs uppercase">{k}</dt>
                  <dd className="text-gray-800">{String(v)}</dd>
                </div>
              ))}
            {profile.primary_concern && (
              <div className="col-span-2">
                <dt className="text-gray-500 text-xs uppercase">
                  Primary Concern
                </dt>
                <dd className="text-gray-800">{profile.primary_concern}</dd>
              </div>
            )}
            {profile.lifestyle_notes && (
              <div className="col-span-2">
                <dt className="text-gray-500 text-xs uppercase">Lifestyle</dt>
                <dd className="text-gray-600 text-sm">
                  {profile.lifestyle_notes}
                </dd>
              </div>
            )}
          </dl>
        ) : (
          <p className="text-gray-400 text-sm">No health profile yet.</p>
        )}
      </section>

      {/* Recent Timeline */}
      <section className="bg-white border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-3">Recent Timeline</h2>
        {entries.length > 0 ? (
          <ul className="space-y-2 text-sm">
            {entries.map((e) => (
              <li key={e.entry_id} className="flex gap-3 text-gray-700">
                <span className="text-gray-400 text-xs w-28 shrink-0">
                  {new Date(e.timestamp).toLocaleString()}
                </span>
                <span>
                  <span className="text-gray-500 text-xs mr-2">
                    [{e.event_type}]
                  </span>
                  {e.summary_text}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm">No timeline entries yet.</p>
        )}
      </section>
    </div>
  );
}
