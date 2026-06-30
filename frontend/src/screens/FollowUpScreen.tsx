// Health One — S6: 随访 (DEV-038 + PILOT-010).

import { useState, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";

const FOLLOWUP_METHODS = [
  { key: "phone", label: "📞 电话" }, { key: "wechat", label: "💬 微信" }, { key: "sms", label: "📱 短信" }, { key: "in-store", label: "🏪 到店" },
];
const FOLLOWUP_REASONS = ["服务随访", "健康检查", "关注回顾", "常规问候"];

export default function FollowUpScreen() {
  const { id } = useParams<{ id: string }>(); const navigate = useNavigate(); const { staff } = useAuth();
  const canManageFollowUp = staff?.role !== "服务人员";
  const [reason, setReason] = useState(""); const [method, setMethod] = useState("");
  const [plannedAt, setPlannedAt] = useState(""); const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false); const [error, setError] = useState(""); const [planId, setPlanId] = useState<string | null>(null);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!method || !plannedAt) {
      setError("请先选择随访方式和计划时间");
      return;
    }
    setSaving(true); setError("");
    try {
      const data = await api.post<{ plan_id: string }>(`/api/identities/${id}/plans`, {
        follow_up_schedule: { method, planned_at: new Date(plannedAt).toISOString(),
          assigned_staff: staff?.staff_id || "", reason: reason || "服务随访", status: "pending" },
        created_by: staff?.staff_id || "",
      });
      setPlanId(data.plan_id);
    } catch (err) { setError(err instanceof Error ? err.message : "保存失败，请重试"); }
    finally { setSaving(false); }
  };

  const handleMarkCompleted = async () => {
    if (!id || !planId) return;
    setSaving(true); setError("");
    try {
      await api.patch(`/api/identities/${id}/plans/${planId}`, {
        plan_status: "completed",
        follow_up_schedule: { method, planned_at: new Date(plannedAt).toISOString(),
          assigned_staff: staff?.staff_id || "", reason: reason || "服务随访", status: "completed", result: notes || "随访已完成" },
      });
      navigate(`/customers/${id}`);
    } catch (err) { setError(err instanceof Error ? err.message : "更新失败"); }
    finally { setSaving(false); }
  };

  if (planId) {
    return (
      <div data-testid="screen-s6" className="text-center py-12">
        <h1 className="text-2xl font-bold text-green-700 mb-4">✓ 随访已创建</h1>
        <p className="text-gray-500 mb-2">方式: {method}</p>
        <p className="text-gray-500 mb-2">计划时间: {plannedAt}</p>
        <p className="text-gray-500 mb-6">状态: 待执行</p>
        <div className="space-y-3 mb-6">
          <label className="block text-sm font-medium text-gray-700">随访结果（可选）</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
            className="w-full max-w-md mx-auto border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="记录随访结果" data-testid="followup-result" /></div>
        <div className="flex gap-3 justify-center">
          <button onClick={handleMarkCompleted} disabled={saving}
            className="bg-green-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-green-700 disabled:opacity-50"
            data-testid="mark-completed-btn">{saving ? "保存中…" : "标记完成"}</button>
          <button onClick={() => navigate(`/customers/${id}`)} className="bg-blue-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-blue-700" data-testid="back-to-s2">返回总览</button>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="screen-s6">
      <h1 className="text-2xl font-bold mb-2">随访任务</h1>
      <p className="text-sm text-gray-500 mb-6">确保服务不因客户离店而结束。</p>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
      {!canManageFollowUp ? (
        <div className="bg-white border rounded-lg p-6 text-center">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-gray-700 font-medium mb-2">随访由店长或健康管理师创建</p>
          <p className="text-gray-400 text-sm mb-4">服务完成后，请提醒店长或健康管理师为这位客户创建随访计划</p>
          <button onClick={() => navigate(`/customers/${id}`)} className="text-blue-600 text-sm hover:underline">返回客户总览</button>
        </div>
      ) : (
      <form onSubmit={handleCreate} className="bg-white border rounded-lg p-6 space-y-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">随访原因</label>
          <div className="flex flex-wrap gap-2">
            {FOLLOWUP_REASONS.map(r => (
              <button key={r} type="button" onClick={() => setReason(r)}
                className={`px-3 py-1.5 rounded-full text-sm border ${reason === r ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"}`}
                data-testid={`reason-${r}`}>{r}</button>))}
          </div></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">随访方式 *</label>
          <div className="flex flex-wrap gap-2">
            {FOLLOWUP_METHODS.map(m => (
              <button key={m.key} type="button" onClick={() => setMethod(m.key)}
                className={`px-3 py-1.5 rounded-full text-sm border ${method === m.key ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"}`}
                data-testid={`method-${m.key}`}>{m.label}</button>))}
          </div>
          {error && !method && <p className="text-red-500 text-xs mt-1">请选择随访方式</p>}
        </div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">计划时间 *</label>
          <input type="datetime-local" value={plannedAt} onChange={(e) => setPlannedAt(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required data-testid="planned-at" />
          {error && !plannedAt && <p className="text-red-500 text-xs mt-1">请选择计划时间</p>}
        </div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">负责员工</label>
          <input type="text" value={staff?.display_name || ""} disabled className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-gray-50 text-gray-500" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="随访话术或备注" data-testid="followup-notes" /></div>
        <div className="flex gap-2 pt-2">
          <button type="submit" disabled={saving || !method || !plannedAt}
            className="bg-blue-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            data-testid="create-followup-btn">{saving ? "创建中…" : "创建随访"}</button>
          <button type="button" onClick={() => navigate(`/customers/${id}`)} className="text-gray-500 px-4 py-2 text-sm">跳过（稍后补录）</button>
        </div>
        <p className="text-xs text-gray-400">创建随访后可在客户总览页查看和标记完成</p>
      </form>
      )}
    </div>
  );
}
