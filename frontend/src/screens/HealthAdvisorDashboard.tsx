// Health One — 健康管理师首页 (ROLE-002 + FEATURE-007).
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";

interface QueueItem {
  identity_id: string;
  customer_name: string;
  source: string;
  reason: string;
  planned_at: string | null;
  tags: string[];
  activation_status: string;
  assigned_staff_id: string | null;
  assigned_staff_name: string | null;
}

export default function HealthAdvisorDashboard() {
  const { staff } = useAuth();
  const navigate = useNavigate();
  const [recent, setRecent] = useState<{ name: string; id: string; status: string }[]>([]);
  const [myFollowUps, setMyFollowUps] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [identities, queue] = await Promise.all([
          api.get<{ identity_id: string; display_name: string; activation_status: string }[]>(
            "/api/identities/?limit=10",
          ),
          api.get<{ items: QueueItem[] }>(
            `/api/dashboard/follow-up-queue?staff_id=${staff?.staff_id || ""}`,
          ).catch(() => ({ items: [] })),
        ]);
        setRecent(identities.map(d => ({ name: d.display_name, id: d.identity_id, status: d.activation_status })));
        setMyFollowUps(queue.items || []);
      } catch { /* silent */ }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className="text-center py-12 text-gray-400">加载中…</div>;

  return (
    <div data-testid="advisor-dashboard">
      <h1 className="text-2xl font-bold mb-2">{staff?.role || "健康管理师"}工作台</h1>
      <p className="text-sm text-gray-500 mb-6">
        {staff?.display_name}
        {myFollowUps.length > 0
          ? `，你有 ${myFollowUps.length} 个待随访客户`
          : "，暂无分配给您的待随访"}
      </p>

      {/* 我的待随访 */}
      <section className="bg-white border rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-base font-semibold">⏳ 我的待随访</h2>
          <button onClick={() => navigate("/follow-up-queue")}
            className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer">
            查看全部 →
          </button>
        </div>
        {myFollowUps.length > 0 ? (
          <ul className="text-sm space-y-2">
            {myFollowUps.map(f => (
              <li key={`${f.source}-${f.identity_id}`} onClick={() => navigate(`/customers/${f.identity_id}`)}
                className="flex justify-between cursor-pointer hover:text-blue-600 py-1 border-b last:border-0">
                <span>{f.customer_name}</span>
                <span className="text-gray-400 text-xs">
                  {f.reason}
                  {f.planned_at && ` · ${new Date(f.planned_at).toLocaleDateString()}`}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-400 text-sm">暂无分配给您的待随访</p>
            <p className="text-gray-300 text-xs mt-1">点击"查看全部"查看全店待跟进客户</p>
          </div>
        )}
      </section>

      {/* 最近客户 */}
      <section className="bg-white border rounded-lg p-4 mb-4">
        <h2 className="text-base font-semibold mb-2">📋 最近客户</h2>
        {recent.length > 0 ? (
          <ul className="text-sm space-y-1">
            {recent.map((r) => (
              <li key={r.id} onClick={() => navigate(`/customers/${r.id}`)}
                className="flex justify-between cursor-pointer hover:text-blue-600 py-1 border-b last:border-0">
                <span>{r.name}</span>
                <span className={`text-xs ${r.status === "active" ? "text-green-600" : "text-yellow-600"}`}>
                  {r.status === "active" ? "已激活" : "待激活"}
                </span>
              </li>
            ))}
          </ul>
        ) : <p className="text-gray-400 text-sm">暂无客户</p>}
      </section>

      {/* 快捷入口 */}
      <button onClick={() => navigate("/customers")}
        className="w-full bg-blue-600 text-white p-4 rounded-lg text-left hover:bg-blue-700">
        <p className="font-semibold">进入客户管理</p>
        <p className="text-sm text-blue-100 mt-1">搜索、新建客户，开始服务</p>
      </button>
    </div>
  );
}
