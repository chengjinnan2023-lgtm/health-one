// Health One — 店长首页 (ROLE-002).
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";

export default function ManagerDashboard() {
  const { staff } = useAuth();
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ total: 0, pending: 0, active: 0 });
  const [recent, setRecent] = useState<{ name: string; id: string; status: string }[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<{ identity_id: string; display_name: string; activation_status: string }[]>(
          "/api/identities/?limit=10",
        );
        setRecent(data.map((d) => ({ name: d.display_name, id: d.identity_id, status: d.activation_status })));
        setCounts({
          total: data.length,
          pending: data.filter((d) => d.activation_status === "pending").length,
          active: data.filter((d) => d.activation_status === "active").length,
        });
      } catch { /* silent */ }
    })();
  }, []);

  return (
    <div data-testid="manager-dashboard">
      <h1 className="text-2xl font-bold mb-2">店长工作台</h1>
      <p className="text-sm text-gray-500 mb-6">{staff?.display_name}，欢迎回来</p>

      {/* 今日概览 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{counts.total}</p>
          <p className="text-sm text-gray-500 mt-1">客户总数</p>
        </div>
        <div className="bg-white border rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{counts.active}</p>
          <p className="text-sm text-gray-500 mt-1">已激活</p>
        </div>
        <div className="bg-white border rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-yellow-600">{counts.pending}</p>
          <p className="text-sm text-gray-500 mt-1">待激活</p>
        </div>
      </div>

      {/* 快捷入口 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button onClick={() => navigate("/customers")}
          className="bg-blue-600 text-white p-4 rounded-lg text-left hover:bg-blue-700">
          <p className="font-semibold">客户管理</p>
          <p className="text-sm text-blue-100 mt-1">搜索、新建、查看客户</p>
        </button>
        <button onClick={() => navigate("/customers")}
          className="bg-indigo-600 text-white p-4 rounded-lg text-left hover:bg-indigo-700">
          <p className="font-semibold">运营统计</p>
          <p className="text-sm text-indigo-100 mt-1">Sprint-4 上线</p>
        </button>
      </div>

      {/* 最近客户 */}
      <section className="bg-white border rounded-lg p-4">
        <h2 className="text-base font-semibold mb-2">最近客户</h2>
        {recent.length > 0 ? (
          <ul className="text-sm space-y-1">
            {recent.map((r) => (
              <li key={r.id} onClick={() => navigate(`/customers/${r.id}`)}
                className="flex justify-between cursor-pointer hover:text-blue-600 py-1 border-b last:border-0">
                <span>{r.name}</span>
                <span className={`text-xs ${r.status === "active" ? "text-green-600" : r.status === "pending" ? "text-yellow-600" : "text-gray-400"}`}>
                  {r.status === "active" ? "已激活" : r.status === "pending" ? "待激活" : r.status}
                </span>
              </li>
            ))}
          </ul>
        ) : <p className="text-gray-400 text-sm">暂无客户</p>}
      </section>
    </div>
  );
}
