// Health One — 店长首页 (ROLE-002 + FEATURE-002).
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";

interface DashboardData {
  customer_counts: {
    total: number;
    active: number;
    pending: number;
    archived: number;
    today_new: number;
  };
  today_sessions: number;
  pending_followups_count: number;
  recent_sessions: {
    session_id: string;
    customer_name: string;
    identity_id: string;
    service_type: string;
    started_at: string | null;
    completed_at: string | null;
  }[];
  pending_followups: {
    plan_id: string;
    customer_name: string;
    identity_id: string;
    method: string;
    planned_at: string;
    reason: string;
    status: string;
  }[];
  top_tags: { tag: string; count: number }[];
}

const METHOD_LABELS: Record<string, string> = {
  phone: "📞 电话", wechat: "💬 微信", sms: "📱 短信", "in-store": "🏪 到店",
};

export default function ManagerDashboard() {
  const { staff } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const d = await api.get<DashboardData>("/api/dashboard/manager");
        setData(d);
      } catch { /* silent */ }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className="text-center py-12 text-gray-400">加载中…</div>;

  const c = data?.customer_counts;
  const sessions = data?.recent_sessions || [];
  const followups = data?.pending_followups || [];
  const tags = data?.top_tags || [];

  return (
    <div data-testid="manager-dashboard">
      <h1 className="text-2xl font-bold mb-2">店长工作台</h1>
      <p className="text-sm text-gray-500 mb-6">{staff?.display_name}，欢迎回来</p>

      {/* ─── 今日概览 ──────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{c?.today_new ?? 0}</p>
          <p className="text-sm text-gray-500 mt-1">今日新增客户</p>
        </div>
        <div className="bg-white border rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-indigo-600">{data?.today_sessions ?? 0}</p>
          <p className="text-sm text-gray-500 mt-1">今日服务</p>
        </div>
        <div className="bg-white border rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-orange-600">{data?.pending_followups_count ?? 0}</p>
          <p className="text-sm text-gray-500 mt-1">待随访</p>
        </div>
      </div>

      {/* ─── 客户结构 ──────────────────────────────────────── */}
      <section className="bg-white border rounded-lg p-4 mb-6">
        <h2 className="text-base font-semibold mb-3">客户结构</h2>
        <div className="flex gap-6 mb-3">
          <div className="text-center">
            <p className="text-xl font-bold text-gray-800">{c?.total ?? 0}</p>
            <p className="text-xs text-gray-400">总客户</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-green-600">{c?.active ?? 0}</p>
            <p className="text-xs text-gray-400">已激活</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-yellow-600">{c?.pending ?? 0}</p>
            <p className="text-xs text-gray-400">待激活</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-400">{c?.archived ?? 0}</p>
            <p className="text-xs text-gray-400">已归档</p>
          </div>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-400">标签：</span>
            {tags.map(t => (
              <span key={t.tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700">
                {t.tag} <span className="text-blue-400">{t.count}</span>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* ─── 最近服务 + 待随访 ─────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* 最近服务 */}
        <section className="bg-white border rounded-lg p-4">
          <h2 className="text-base font-semibold mb-2">最近服务</h2>
          {sessions.length > 0 ? (
            <ul className="text-sm space-y-2">
              {sessions.map(s => (
                <li key={s.session_id} onClick={() => navigate(`/customers/${s.identity_id}`)}
                  className="flex justify-between items-center cursor-pointer hover:text-blue-600 py-1 border-b last:border-0">
                  <div>
                    <span className="font-medium">{s.customer_name}</span>
                    <span className="text-gray-400 ml-2 text-xs">{s.service_type}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {s.started_at ? new Date(s.started_at).toLocaleDateString() : ""}
                    <span className={`ml-1 ${s.completed_at ? "text-green-600" : "text-yellow-600"}`}>
                      {s.completed_at ? "✓" : "…"}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          ) : <p className="text-gray-400 text-sm">暂无服务记录</p>}
        </section>

        {/* 待随访 */}
        <section className="bg-white border rounded-lg p-4">
          <h2 className="text-base font-semibold mb-2">待随访</h2>
          {followups.length > 0 ? (
            <ul className="text-sm space-y-2">
              {followups.map(f => (
                <li key={f.plan_id} onClick={() => navigate(`/customers/${f.identity_id}`)}
                  className="flex justify-between items-center cursor-pointer hover:text-blue-600 py-1 border-b last:border-0">
                  <div>
                    <span className="font-medium">{f.customer_name}</span>
                    <span className="text-gray-400 ml-2 text-xs">
                      {METHOD_LABELS[f.method] || f.method}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {f.planned_at ? new Date(f.planned_at).toLocaleDateString() : ""}
                  </span>
                </li>
              ))}
            </ul>
          ) : <p className="text-gray-400 text-sm">暂无待随访</p>}
        </section>
      </div>

      {/* ─── 导出日报 ──────────────────────────────────────── */}
      <div className="bg-white border rounded-lg p-4 mb-6">
        <h2 className="text-base font-semibold mb-3">📥 导出日报</h2>
        <div className="flex flex-wrap gap-3">
          <a href={`${import.meta.env.VITE_API_BASE_URL || ""}/api/dashboard/manager/export/csv?type=customers`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-sm font-medium bg-green-50 text-green-700 border border-green-200 hover:bg-green-100">
            📄 导出今日客户 CSV
          </a>
          <a href={`${import.meta.env.VITE_API_BASE_URL || ""}/api/dashboard/manager/export/csv?type=sessions`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100">
            📄 导出今日服务 CSV
          </a>
          <a href={`${import.meta.env.VITE_API_BASE_URL || ""}/api/dashboard/manager/export/csv?type=followups`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-sm font-medium bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100">
            📄 导出待随访 CSV
          </a>
        </div>
        <p className="text-xs text-gray-400 mt-3">CSV 格式，可用 Excel 打开。仅导出当天数据。</p>
      </div>

      {/* ─── 快捷入口 ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => navigate("/customers")}
          className="bg-blue-600 text-white p-4 rounded-lg text-left hover:bg-blue-700">
          <p className="font-semibold">客户管理</p>
          <p className="text-sm text-blue-100 mt-1">搜索、新建、查看客户</p>
        </button>
        <button disabled
          className="bg-gray-300 text-gray-500 p-4 rounded-lg text-left cursor-not-allowed">
          <p className="font-semibold">运营统计</p>
          <p className="text-sm mt-1">Sprint-4 上线</p>
        </button>
      </div>
    </div>
  );
}
