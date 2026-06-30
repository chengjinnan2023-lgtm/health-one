// Health One — 待跟进客户队列 (FEATURE-004).
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";

interface QueueItem {
  identity_id: string;
  customer_name: string;
  source: "followup" | "tag";
  reason: string;
  planned_at: string | null;
  plan_id: string | null;
  tags: string[];
  activation_status: string;
  assigned_staff_id: string | null;
  assigned_staff_name: string | null;
}

interface QueueData {
  items: QueueItem[];
}

const SOURCE_LABELS: Record<string, string> = {
  followup: "📞",
  tag: "🏷",
};

export default function FollowUpQueueScreen() {
  const navigate = useNavigate();
  const [items, setItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<QueueData>("/api/dashboard/follow-up-queue");
        setItems(data.items || []);
      } catch { /* silent */ }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className="text-center py-12 text-gray-400">加载中…</div>;

  const followupCount = items.filter(i => i.source === "followup").length;
  const tagCount = items.filter(i => i.source === "tag").length;

  return (
    <div data-testid="follow-up-queue">
      <h1 className="text-2xl font-bold mb-2">待跟进客户</h1>
      <p className="text-sm text-gray-500 mb-6">
        共 {items.length} 个待跟进客户 · 随访计划 {followupCount} 人 · 标签标记 {tagCount} 人
      </p>

      {items.length === 0 ? (
        <div className="bg-white border rounded-lg p-12 text-center">
          <p className="text-gray-400 text-lg mb-1">暂无待跟进客户</p>
          <p className="text-gray-300 text-sm">所有客户的随访计划均已完成，无需跟进的标签标记</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div
              key={`${item.source}-${item.identity_id}`}
              className="bg-white border rounded-lg p-4 hover:border-blue-200 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  {/* 客户名 + 信号来源 */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-semibold text-gray-800">
                      {item.customer_name}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
                      {item.activation_status === "active" ? "已激活" : item.activation_status}
                    </span>
                  </div>

                  {/* 跟进原因 */}
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-1.5">
                    <span>{SOURCE_LABELS[item.source]}</span>
                    <span>{item.reason}</span>
                    {item.assigned_staff_name && (
                      <span className="text-gray-400">· 负责人：{item.assigned_staff_name}</span>
                    )}
                    {item.planned_at && (
                      <span className="text-gray-300">
                        · 计划 {new Date(item.planned_at).toLocaleDateString("zh-CN")}
                      </span>
                    )}
                    {item.source === "tag" && (
                      <span className="text-orange-500 text-xs">· 暂无随访计划</span>
                    )}
                  </div>

                  {/* 标签 badges */}
                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.map(t => (
                        <span key={t} className="inline-block px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-600">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 操作按钮 */}
                <button
                  onClick={() => navigate(`/customers/${item.identity_id}`)}
                  className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 cursor-pointer"
                >
                  查看客户 →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
