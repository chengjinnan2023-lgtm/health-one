// Health One — S1: 客户搜索/新建 (DEV-017 + PILOT-010 + FEATURE-001).

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

const SUGGESTED_TAGS = [
  "肩颈", "腰背", "疲劳", "运动恢复",
  "老客户", "新客户", "高意向", "价格敏感",
  "转介绍", "需随访", "周末", "已流失",
];

export default function CustomerSearchScreen() {
  const { staff } = useAuth();
  const canCreate = staff?.role !== "服务人员";
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [includeArchived, setIncludeArchived] = useState(false);
  const [results, setResults] = useState<HealthIdentity[]>([]);
  const [searching, setSearching] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  // Collect all tags from results for filter chips
  const allTags = results.length > 0
    ? [...new Set(results.flatMap(r => r.tags || []))].sort()
    : [];

  // Load recent customers on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<HealthIdentity[]>("/api/identities/?limit=20");
        setResults(data);
      } catch { /* silent */ }
      finally { setInitialLoading(false); }
    })();
  }, []);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const doSearch = useCallback(async (q: string, tag: string, archived: boolean) => {
    setSearching(true); setError("");
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      if (tag) params.set("tag", tag);
      if (archived) params.set("include_archived", "true");
      params.set("limit", "30");
      const data = await api.get<HealthIdentity[]>(`/api/identities/?${params.toString()}`);
      setResults(data);
    } catch { setError("搜索失败，请重试"); }
    finally { setSearching(false); }
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => doSearch(query, selectedTag, includeArchived), 300);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query, selectedTag, includeArchived, doSearch]);

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

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? "" : tag);
    setQuery("");
  };

  return (
    <div data-testid="screen-s1">
      <h1 className="text-2xl font-bold mb-6">客户搜索 / 新建</h1>
      <div className="flex gap-2 mb-4">
        <input type="text" value={query} onChange={(e) => { setQuery(e.target.value); }}
          placeholder="输入客户姓名搜索…"
          className="flex-1 border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          data-testid="search-input" />
        {canCreate && (
          <button onClick={() => setShowCreate(!showCreate)}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700"
            data-testid="create-toggle">+ 新建客户</button>
        )}
      </div>

      {/* Tag filter chips */}
      <div className="mb-4">
        <span className="text-xs text-gray-400 mr-2">标签筛选：</span>
        <div className="inline-flex flex-wrap gap-1.5 align-middle">
          <button onClick={() => { setSelectedTag(""); setQuery(""); }}
            className={`px-3 py-1 rounded-full text-xs border ${selectedTag === "" && !query ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"}`}
            data-testid="tag-all">全部</button>
          {/* Show suggested tags + any tags from results not in suggested */}
          {[...new Set([...SUGGESTED_TAGS, ...allTags])].slice(0, 16).map(tag => (
            <button key={tag} onClick={() => handleTagClick(tag)}
              className={`px-3 py-1 rounded-full text-xs border ${selectedTag === tag ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"}`}
              data-testid={`tag-${tag}`}>{tag}</button>
          ))}
        </div>
      </div>

      {/* Include archived checkbox */}
      <div className="mb-4">
        <label className="inline-flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
          <input type="checkbox" checked={includeArchived} onChange={(e) => setIncludeArchived(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" data-testid="include-archived" />
          包括已归档客户
        </label>
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

      {initialLoading && <p className="text-gray-400 text-sm">加载中…</p>}
      {searching && <p className="text-gray-400 text-sm">搜索中…</p>}
      {!initialLoading && !searching && results.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          {query || selectedTag ? <p>未找到匹配客户</p> : <p>暂无客户数据</p>}
          {canCreate && <button onClick={() => setShowCreate(true)} className="text-blue-600 text-sm mt-2 hover:underline">新建第一位客户</button>}
        </div>
      )}
      {results.length > 0 && (
        <ul className="space-y-2" data-testid="search-results">
          {results.map((r) => (
            <li key={r.identity_id} onClick={() => navigate(`/customers/${r.identity_id}`)}
              className={`bg-white border rounded-lg px-4 py-3 cursor-pointer hover:border-blue-300 ${r.activation_status === "archived" ? "opacity-60" : ""}`}
              data-testid={`result-${r.identity_id}`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-800">{r.display_name}</span>
                  {r.tags && r.tags.length > 0 && (
                    <span className="ml-2 inline-flex flex-wrap gap-1 align-middle">
                      {r.tags.map(t => (
                        <span key={t} className="inline-block px-1.5 py-0.5 text-xs rounded bg-blue-50 text-blue-600">{t}</span>
                      ))}
                    </span>
                  )}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ml-2 ${STATUS_COLORS[r.activation_status] || ""}`}>
                  {STATUS_LABELS[r.activation_status] || r.activation_status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
