// Health One — 健康管理师首页 (ROLE-002).
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";

export default function HealthAdvisorDashboard() {
  const { staff } = useAuth();
  const navigate = useNavigate();
  const [recent, setRecent] = useState<{ name: string; id: string; status: string }[]>([]);
  const [followUps, setFollowUps] = useState<{ name: string; id: string; method: string; planned: string }[]>([]);

  useEffect(() => {
    (async () => {
      try {
        // Load recent customers
        const data = await api.get<{ identity_id: string; display_name: string; activation_status: string }[]>(
          "/api/identities/?limit=10",
        );
        const names = data.map((d) => ({ name: d.display_name, id: d.identity_id, status: d.activation_status }));
        setRecent(names);

        // Try to load follow-ups for the first few active identities
        const fups: typeof followUps = [];
        for (const c of data.filter((d) => d.activation_status === "active").slice(0, 5)) {
          try {
            const plans = await api.get<{ follow_up_schedule?: { method?: string; planned_at?: string; status?: string } }[]>(
              `/api/identities/${c.identity_id}/plans?status=active&limit=3`,
            );
            for (const p of plans) {
              if (p.follow_up_schedule?.status === "pending") {
                fups.push({
                  name: c.display_name, id: c.identity_id,
                  method: p.follow_up_schedule.method || "N/A",
                  planned: p.follow_up_schedule.planned_at || "",
                });
              }
            }
          } catch { /* skip */ }
        }
        setFollowUps(fups);
      } catch { /* silent */ }
    })();
  }, []);

  return (
    <div data-testid="advisor-dashboard">
      <h1 className="text-2xl font-bold mb-2">{staff?.role || "健康管理师"}工作台</h1>
      <p className="text-sm text-gray-500 mb-6">{staff?.display_name}，今天有 {followUps.length} 个待随访客户</p>

      {/* 待随访 */}
      <section className="bg-white border rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-base font-semibold">⏳ 待随访</h2>
          <button onClick={() => navigate("/follow-up-queue")}
            className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer">
            查看全部 →
          </button>
        </div>
        {followUps.length > 0 ? (
          <ul className="text-sm space-y-2">
            {followUps.map((f, i) => (
              <li key={i} onClick={() => navigate(`/customers/${f.id}`)}
                className="flex justify-between cursor-pointer hover:text-blue-600 py-1 border-b last:border-0">
                <span>{f.name}</span>
                <span className="text-gray-400 text-xs">{f.method} · {f.planned ? new Date(f.planned).toLocaleDateString() : ""}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm">暂无待随访客户</p>
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
