// Health One — 店长运营统计页 (FEATURE-005).
import { useEffect, useState } from "react";
import { api } from "../api/client";

interface CustomerStructure {
  total: number;
  active: number;
  pending: number;
  archived: number;
}

interface TagEntry {
  tag: string;
  count: number;
}

interface StatsData {
  period: string;
  period_label: string;
  new_customers: number;
  service_sessions: number;
  completed_followups: number;
  customer_structure: CustomerStructure;
  top_tags: TagEntry[];
}

type Period = "week" | "month";

export default function ManagerStatsScreen() {
  const [period, setPeriod] = useState<Period>("week");
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const d = await api.get<StatsData>(`/api/dashboard/manager/stats?period=${period}`);
        setData(d);
      } catch { /* silent */ }
      finally { setLoading(false); }
    })();
  }, [period]);

  if (loading) return <div className="text-center py-12 text-gray-400">加载中…</div>;

  const cs = data?.customer_structure;

  return (
    <div data-testid="manager-stats">
      <h1 className="text-2xl font-bold mb-2">运营统计</h1>
      <p className="text-sm text-gray-500 mb-6">
        {data?.period_label}
      </p>

      {/* Period Toggle */}
      <div className="inline-flex bg-gray-100 rounded-lg p-1 mb-6">
        <button
          onClick={() => setPeriod("week")}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
            period === "week" ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          本周
        </button>
        <button
          onClick={() => setPeriod("month")}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
            period === "month" ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          本月
        </button>
      </div>

      {/* 3 列指标卡片 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{data?.new_customers ?? 0}</p>
          <p className="text-sm text-gray-500 mt-1">新增客户</p>
        </div>
        <div className="bg-white border rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-indigo-600">{data?.service_sessions ?? 0}</p>
          <p className="text-sm text-gray-500 mt-1">服务记录</p>
        </div>
        <div className="bg-white border rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{data?.completed_followups ?? 0}</p>
          <p className="text-sm text-gray-500 mt-1">完成随访</p>
        </div>
      </div>

      {/* 客户结构 */}
      <section className="bg-white border rounded-lg p-4 mb-6">
        <h2 className="text-base font-semibold mb-3">客户结构</h2>
        <div className="flex gap-6">
          <div className="text-center">
            <p className="text-xl font-bold text-gray-800">{cs?.total ?? 0}</p>
            <p className="text-xs text-gray-400">总客户</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-green-600">{cs?.active ?? 0}</p>
            <p className="text-xs text-gray-400">已激活</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-yellow-600">{cs?.pending ?? 0}</p>
            <p className="text-xs text-gray-400">待激活</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-400">{cs?.archived ?? 0}</p>
            <p className="text-xs text-gray-400">已归档</p>
          </div>
        </div>
      </section>

      {/* 标签 Top 5 */}
      {data?.top_tags && data.top_tags.length > 0 && (
        <section className="bg-white border rounded-lg p-4">
          <h2 className="text-base font-semibold mb-3">标签 Top 5</h2>
          <div className="flex flex-wrap items-center gap-2">
            {data.top_tags.map(t => (
              <span
                key={t.tag}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700"
              >
                {t.tag}
                <span className="text-blue-400 font-medium">{t.count}</span>
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
