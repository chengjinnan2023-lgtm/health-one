// Health One — 我的客户 (FEATURE-008).
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, type HealthIdentity } from "../api/client";
import { useAuth } from "../auth/AuthContext";

const STATUS_LABELS: Record<string, string> = { pending: "待激活", active: "已激活", archived: "已归档" };

interface QueueItem {
  identity_id: string;
  reason: string;
  planned_at: string | null;
}

export default function MyCustomersScreen() {
  const { staff } = useAuth();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<HealthIdentity[]>([]);
  const [followUpMap, setFollowUpMap] = useState<Map<string, QueueItem>>(new Map());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [ids, queue] = await Promise.all([
          api.get<HealthIdentity[]>(`/api/identities/?assigned_staff_id=${staff?.staff_id}&limit=50`),
          api.get<{ items: QueueItem[] }>(`/api/dashboard/follow-up-queue?staff_id=${staff?.staff_id}`)
            .catch(() => ({ items: [] })),
        ]);
        setCustomers(ids);
        const map = new Map<string, QueueItem>();
        for (const item of queue.items) {
          if (!map.has(item.identity_id)) map.set(item.identity_id, item);
        }
        setFollowUpMap(map);
      } catch { /* silent */ }
      finally { setLoading(false); }
    })();
  }, [staff?.staff_id]);

  if (loading) return <div className="text-center py-12 text-gray-400">加载中…</div>;

  const filtered = search
    ? customers.filter(c => c.display_name.toLowerCase().includes(search.toLowerCase()))
    : customers;

  return (
    <div data-testid="my-customers">
      <h1 className="text-2xl font-bold mb-2">我的客户</h1>
      <p className="text-sm text-gray-500 mb-6">共 {customers.length} 名负责客户</p>

      {customers.length > 0 && (
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="搜索客户名…"
          className="w-full max-w-sm mb-4 px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      )}

      {customers.length === 0 ? (
        <div className="bg-white border rounded-lg p-12 text-center">
          <p className="text-gray-400 text-lg mb-1">暂无负责的客户</p>
          <p className="text-gray-300 text-sm">请联系店长为客户分配负责人</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border rounded-lg p-12 text-center">
          <p className="text-gray-400">未找到匹配"{search}"的客户</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(c => {
            const fu = followUpMap.get(c.identity_id);
            const tags = c.tags || [];
            return (
              <div key={c.identity_id}
                className="bg-white border rounded-lg p-4 hover:border-blue-200 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-semibold text-gray-800">{c.display_name}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        c.activation_status === "active" ? "bg-green-100 text-green-700" :
                        c.activation_status === "pending" ? "bg-yellow-100 text-yellow-700" :
                        "bg-gray-100 text-gray-500"
                      }`}>
                        {STATUS_LABELS[c.activation_status] || c.activation_status}
                      </span>
                    </div>

                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-1.5">
                        {tags.map(t => (
                          <span key={t} className="inline-block px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-600">{t}</span>
                        ))}
                      </div>
                    )}

                    {fu && (
                      <div className="text-sm text-orange-600">
                        ⏳ 待随访：{fu.reason}
                        {fu.planned_at && ` · ${new Date(fu.planned_at).toLocaleDateString("zh-CN")}`}
                      </div>
                    )}
                  </div>

                  <button onClick={() => navigate(`/customers/${c.identity_id}`)}
                    className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 cursor-pointer"
                  >
                    查看 →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
