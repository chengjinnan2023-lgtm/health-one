// Health One — S2: 客户健康元总览 (DEV-018 + DEV-039 + PILOT-010 + FEATURE-001).

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, type HealthIdentity, type HealthProfile, type TimelineEntry } from "../api/client";
import { useAuth } from "../auth/AuthContext";

const STATUS_LABELS: Record<string, string> = { pending: "待激活", active: "已激活", archived: "已归档" };
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800", active: "bg-green-100 text-green-800", archived: "bg-gray-100 text-gray-500",
};

const SUGGESTED_TAGS = [
  "肩颈", "腰背", "疲劳", "运动恢复",
  "老客户", "新客户", "高意向", "价格敏感",
  "转介绍", "需随访", "周末", "已流失",
];

interface SessionSummary { session_id: string; service_type: string; started_at: string; completed_at: string | null; customer_feedback: string | null; }
interface PlanSummary { plan_id: string; plan_status: string; follow_up_schedule: { method?: string; planned_at?: string; status?: string; result?: string; } | null; }

export default function CustomerSummaryScreen() {
  const { id } = useParams<{ id: string }>(); const navigate = useNavigate();
  const [identity, setIdentity] = useState<HealthIdentity | null>(null);
  const [profile, setProfile] = useState<HealthProfile | null>(null);
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [plans, setPlans] = useState<PlanSummary[]>([]);
  const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [savingTag, setSavingTag] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const { staff: me } = useAuth();
  const isManager = me?.role === "店长";
  const [staffList, setStaffList] = useState<{ staff_id: string; display_name: string; role: string }[]>([]);
  const [changingOwner, setChangingOwner] = useState(false);

  useEffect(() => { if (!id) return; loadData(); }, [id]);

  useEffect(() => {
    if (!isManager) return;
    api.get<{ staff_id: string; display_name: string; role: string }[]>("/api/staff/")
      .then(setStaffList).catch(() => {});
  }, [isManager]);

  async function loadData() {
    setLoading(true); setError("");
    try {
      const [i, p, t, s, pl] = await Promise.all([
        api.get<HealthIdentity>(`/api/identities/${id}`),
        api.get<HealthProfile>(`/api/identities/${id}/profile`).catch(() => null),
        api.get<{ entries: TimelineEntry[] }>(`/api/identities/${id}/timeline?limit=10`).then(r => r.entries).catch(() => []),
        api.get<SessionSummary[]>(`/api/identities/${id}/sessions?limit=5`).catch(() => []),
        api.get<PlanSummary[]>(`/api/identities/${id}/plans?limit=5`).catch(() => []),
      ]);
      setIdentity(i); setProfile(p as HealthProfile | null); setEntries(t); setSessions(s); setPlans(pl);
    } catch (err) { setError(err instanceof Error ? err.message : "加载失败"); }
    finally { setLoading(false); }
  }

  async function handleActivate() {
    if (!id) return;
    try { await api.post(`/api/identities/${id}/activate`); loadData(); }
    catch (err) { setError(err instanceof Error ? err.message : "激活失败"); }
  }

  // ─── Tag operations ─────────────────────────────────────────

  async function handleAddTag(e: FormEvent) {
    e.preventDefault();
    if (!id || !newTag.trim() || !identity) return;
    const tag = newTag.trim();
    if (identity.tags?.includes(tag)) { setNewTag(""); setShowTagInput(false); return; }
    setSavingTag(true);
    try {
      const updated = await api.patch<HealthIdentity>(`/api/identities/${id}`, {
        tags: [...(identity.tags || []), tag],
      });
      setIdentity(updated); setNewTag(""); setShowTagInput(false);
    } catch (err) { setError(err instanceof Error ? err.message : "标签保存失败"); }
    finally { setSavingTag(false); }
  }

  async function handleRemoveTag(tag: string) {
    if (!id || !identity) return;
    setSavingTag(true);
    try {
      const updated = await api.patch<HealthIdentity>(`/api/identities/${id}`, {
        tags: (identity.tags || []).filter(t => t !== tag),
      });
      setIdentity(updated);
    } catch (err) { setError(err instanceof Error ? err.message : "标签删除失败"); }
    finally { setSavingTag(false); }
  }

  // ─── Archive / Unarchive ────────────────────────────────────

  async function handleArchive() {
    if (!id || !identity) return;
    setArchiving(true);
    try {
      const updated = await api.post<HealthIdentity>(`/api/identities/${id}/archive`);
      setIdentity(updated);
    } catch (err) { setError(err instanceof Error ? err.message : "归档失败"); }
    finally { setArchiving(false); }
  }

  async function handleChangeOwner(newStaffId: string | null) {
    if (!id || !identity) return;
    setChangingOwner(true);
    try {
      const updated = await api.patch<HealthIdentity>(`/api/identities/${id}`, {
        assigned_staff_id: newStaffId,
      });
      setIdentity(updated);
    } catch (err) { setError(err instanceof Error ? err.message : "负责人变更失败"); }
    finally { setChangingOwner(false); }
  }

  async function handleUnarchive() {
    if (!id || !identity) return;
    setArchiving(true);
    try {
      const updated = await api.post<HealthIdentity>(`/api/identities/${id}/unarchive`);
      setIdentity(updated);
    } catch (err) { setError(err instanceof Error ? err.message : "恢复失败"); }
    finally { setArchiving(false); }
  }

  if (loading) return <div className="text-center py-12 text-gray-400" data-testid="screen-s2">加载中…</div>;
  if (error || !identity) return <div className="text-center py-12 text-red-500" data-testid="screen-s2">{error || "客户未找到"}</div>;

  const isArchived = identity.activation_status === "archived";
  const tags = identity.tags || [];

  return (
    <div data-testid="screen-s2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{identity.display_name}</h1>
          <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[identity.activation_status]}`}>
            {STATUS_LABELS[identity.activation_status] || identity.activation_status}
          </span>
        </div>
        <div className="flex gap-2">
          {identity.activation_status === "pending" && (
            <button onClick={handleActivate} className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700" data-testid="activate-btn">激活健康元</button>
          )}
          {!isArchived && (
            <button onClick={() => navigate(`/customers/${id}/concern`)} className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700" data-testid="record-concern-btn">记录健康关注</button>
          )}
          {identity.activation_status === "active" && (
            <button onClick={() => navigate(`/customers/${id}/service`)} className="bg-indigo-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-indigo-700" data-testid="new-service-btn">新建服务</button>
          )}
        </div>
      </div>

      {/* ─── Owner ────────────────────────────────────────── */}
      <div className="mb-4 flex items-center gap-3">
        <span className="text-sm text-gray-500">负责人：</span>
        {identity.assigned_staff_name ? (
          <span className="text-sm font-medium text-gray-800">{identity.assigned_staff_name}</span>
        ) : (
          <span className="text-sm text-gray-400">未指定</span>
        )}
        {isManager && (
          <select
            value={identity.assigned_staff_id || ""}
            onChange={e => handleChangeOwner(e.target.value || null)}
            disabled={changingOwner}
            className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
          >
            <option value="">未指定</option>
            {staffList.map(s => (
              <option key={s.staff_id} value={s.staff_id}>{s.display_name}（{s.role}）</option>
            ))}
          </select>
        )}
      </div>

      {/* ─── Tags ──────────────────────────────────────────── */}
      <div className="mb-6 bg-white border rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">标签</h3>
        <div className="flex flex-wrap items-center gap-1.5">
          {tags.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
              {tag}
              <button onClick={() => handleRemoveTag(tag)} disabled={savingTag}
                className="ml-0.5 text-blue-400 hover:text-blue-600 font-bold leading-none">&times;</button>
            </span>
          ))}
          {tags.length === 0 && !showTagInput && (
            <span className="text-gray-400 text-xs">暂无标签</span>
          )}
          {showTagInput ? (
            <form onSubmit={handleAddTag} className="inline-flex items-center gap-1">
              <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)}
                placeholder="输入标签名"
                className="w-28 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus data-testid="tag-input" />
              <button type="submit" disabled={savingTag || !newTag.trim()}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium" data-testid="tag-add-btn">添加</button>
              <button type="button" onClick={() => { setShowTagInput(false); setNewTag(""); }}
                className="text-xs text-gray-400 hover:text-gray-600">取消</button>
            </form>
          ) : (
            <button onClick={() => setShowTagInput(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border border-dashed border-gray-300 text-gray-400 hover:text-blue-600 hover:border-blue-400"
              data-testid="tag-add-toggle">+ 添加标签</button>
          )}
        </div>
        {/* Suggested tags quick-add */}
        {showTagInput && (
          <div className="mt-2 flex flex-wrap gap-1">
            <span className="text-xs text-gray-400">建议：</span>
            {SUGGESTED_TAGS.filter(t => !tags.includes(t)).slice(0, 8).map(t => (
              <button key={t} onClick={() => setNewTag(t)}
                className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-600">{t}</button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <section className="bg-white border rounded-lg p-4">
            <h2 className="text-base font-semibold mb-2">健康档案</h2>
            {profile ? (
              <dl className="text-sm space-y-1">
                {profile.basic_info && Object.entries(profile.basic_info).map(([k, v]) => (
                  <div key={k}><dt className="text-gray-500 text-xs inline">{k}: </dt><dd className="text-gray-800 inline">{String(v)}</dd></div>
                ))}
                {profile.primary_concern && <p className="text-gray-800 mt-1">{profile.primary_concern}</p>}
              </dl>
            ) : <p className="text-gray-400 text-sm">暂无健康档案</p>}
          </section>
          <section className="bg-white border rounded-lg p-4">
            <h2 className="text-base font-semibold mb-2">服务历史</h2>
            {sessions.length > 0 ? (
              <ul className="text-sm space-y-2">
                {sessions.map(s => (
                  <li key={s.session_id} className="border-b pb-1 last:border-0">
                    <div className="flex justify-between">
                      <span className="font-medium">{s.service_type}</span>
                      <span className="text-xs text-gray-400">{new Date(s.started_at).toLocaleDateString()}</span>
                    </div>
                    {s.customer_feedback && <p className="text-gray-500 text-xs mt-0.5 truncate">{s.customer_feedback.slice(0, 60)}</p>}
                    <span className={`text-xs ${s.completed_at ? "text-green-600" : "text-yellow-600"}`}>{s.completed_at ? "✓ 已完成" : "进行中"}</span>
                  </li>
                ))}
              </ul>
            ) : <p className="text-gray-400 text-sm">暂无服务记录</p>}
          </section>
        </div>
        <div className="space-y-4">
          <section className="bg-white border rounded-lg p-4">
            <h2 className="text-base font-semibold mb-2">随访</h2>
            {plans.length > 0 ? (
              <ul className="text-sm space-y-2">
                {plans.map(p => {
                  const fs = p.follow_up_schedule;
                  return (
                    <li key={p.plan_id} className="border-b pb-1 last:border-0">
                      <div className="flex justify-between">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${p.plan_status === "completed" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                          {p.plan_status === "completed" ? "已完成" : p.plan_status === "active" ? "进行中" : p.plan_status}
                        </span>
                        {fs?.method && <span className="text-gray-500 text-xs">{fs.method}</span>}
                      </div>
                      {fs?.planned_at && <p className="text-gray-400 text-xs">计划: {new Date(fs.planned_at).toLocaleDateString()}</p>}
                      {fs?.result && <p className="text-gray-600 text-xs mt-0.5 truncate">{fs.result.slice(0, 60)}</p>}
                    </li>
                  );
                })}
              </ul>
            ) : <p className="text-gray-400 text-sm">暂无随访任务</p>}
          </section>
          <section className="bg-white border rounded-lg p-4">
            <h2 className="text-base font-semibold mb-2">最近动态</h2>
            {entries.length > 0 ? (
              <ul className="text-xs space-y-1.5">
                {entries.slice(0, 6).map(e => (
                  <li key={e.entry_id} className="flex gap-2 text-gray-600">
                    <span className="text-gray-400 w-16 shrink-0">{new Date(e.timestamp).toLocaleTimeString()}</span>
                    <span><span className="text-gray-400">[{e.event_type}]</span> {e.summary_text.slice(0, 60)}</span>
                  </li>
                ))}
              </ul>
            ) : <p className="text-gray-400 text-sm">暂无动态</p>}
          </section>
        </div>
      </div>

      {/* ─── Archive / Unarchive — bottom secondary action ──── */}
      <div className="mt-8 pt-4 border-t border-gray-200 text-center">
        {isArchived ? (
          <button onClick={handleUnarchive} disabled={archiving}
            className="text-gray-500 text-sm hover:text-blue-600 disabled:opacity-50"
            data-testid="unarchive-btn">
            {archiving ? "恢复中…" : "恢复客户"}
          </button>
        ) : (
          <button onClick={handleArchive} disabled={archiving}
            className="text-gray-400 text-sm hover:text-red-500 disabled:opacity-50"
            data-testid="archive-btn">
            {archiving ? "归档中…" : "归档客户"}
          </button>
        )}
        <p className="text-xs text-gray-300 mt-1">
          {isArchived ? "将客户恢复为活跃状态" : "归档后客户不出现在默认列表中，可随时恢复"}
        </p>
      </div>
    </div>
  );
}
