// Health One — S1: 客户搜索/新建 (DEV-017 + PILOT-010).

import { useState, useCallback, useEffect, useRef, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api, type HealthIdentity } from "../api/client";
import { useAuth } from "../auth/AuthContext";

const STATUS_LABELS: Record<string, string> = {
  pending: "待激活",
  active: "已激活",
  archived: "已归档",
};
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  active: "bg-green-100 text-green-800",
  archived: "bg-gray-100 text-gray-500",
};

export default function CustomerSearchScreen() {
  const { staff } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<HealthIdentity[]>([]);
  const [searching, setSearching] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setSearching(true); setError("");
    try {
      const data = await api.get<HealthIdentity[]>(`/api/identities/?q=${encodeURIComponent(q)}&limit=20`);
      setResults(data);
    } catch { setError("搜索失败，请重试"); }
    finally { setSearching(false); }
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => doSearch(query), 300);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query, doSearch]);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true); setError("");
    try {
      const identity = await api.post<HealthIdentity>("/api/identities/", {
        display_name: newName.trim(), primary_store_id: staff?.store_id,
      });
      navigate(`/customers/${identity.identity_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "创建失败，请重试");
    } finally { setCreating(false); }
  };

  return (
    <div data-testid="screen-s1">
      <h1 className="text-2xl font-bold mb-6">客户搜索 / 新建</h1>
      <div className="flex gap-2 mb-6">
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="输入客户姓名搜索…"
          className="flex-1 border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          data-testid="search-input" />
        <button onClick={() => setShowCreate(!showCreate)}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700"
          data-testid="create-toggle">+ 新建客户</button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

      {showCreate && (
        <form onSubmit={handleCreate} className="bg-white border rounded-lg p-6 mb-6" data-testid="create-form">
          <h2 className="text-lg font-semibold mb-4">新建客户</h2>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">姓名 *</label>
            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required data-testid="create-name-input" />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={creating || !newName.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              data-testid="create-submit">{creating ? "创建中…" : "创建客户"}</button>
            <button type="button" onClick={() => setShowCreate(false)} className="text-gray-500 px-4 py-2 text-sm">取消</button>
          </div>
        </form>
      )}

      {searching && <p className="text-gray-400 text-sm">搜索中…</p>}
      {!searching && query && results.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>未找到 "{query}" 相关客户</p>
          <button onClick={() => setShowCreate(true)} className="text-blue-600 text-sm mt-2 hover:underline">新建客户</button>
        </div>
      )}
      {results.length > 0 && (
        <ul className="space-y-2" data-testid="search-results">
          {results.map((r) => (
            <li key={r.identity_id} onClick={() => navigate(`/customers/${r.identity_id}`)}
              className="bg-white border rounded-lg px-4 py-3 flex items-center justify-between cursor-pointer hover:border-blue-300"
              data-testid={`result-${r.identity_id}`}>
              <div><span className="font-medium text-gray-800">{r.display_name}</span></div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[r.activation_status] || ""}`}>
                {STATUS_LABELS[r.activation_status] || r.activation_status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
