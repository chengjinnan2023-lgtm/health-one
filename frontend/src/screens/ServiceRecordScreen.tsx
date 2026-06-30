// Health One — S4: 服务记录 (DEV-034 + PILOT-010).

import { useState, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";

const SERVICE_TYPES = [
  { key: "健康舱", label: "健康舱" }, { key: "咨询", label: "咨询" }, { key: "检测", label: "检测" }, { key: "其他", label: "其他" },
];

export default function ServiceRecordScreen() {
  const { id } = useParams<{ id: string }>(); const navigate = useNavigate(); const { staff } = useAuth();
  const [serviceType, setServiceType] = useState(""); const [preNotes, setPreNotes] = useState("");
  const [serviceDetail, setServiceDetail] = useState(""); const [nextStep, setNextStep] = useState("");
  const [saving, setSaving] = useState(false); const [error, setError] = useState("");

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault(); if (!id || !serviceType || !staff) return;
    setSaving(true); setError("");
    try {
      const data = await api.post<{ session_id: string }>(`/api/identities/${id}/sessions`, {
        service_type: serviceType, store_id: staff.store_id,
        pre_service_notes: preNotes || null, service_detail: serviceDetail || null, next_step_suggestion: nextStep || null,
      });
      navigate(`/customers/${id}/feedback?session_id=${data.session_id}`);
    } catch (err) { setError(err instanceof Error ? err.message : "保存失败，请重试"); setSaving(false); }
  };

  return (
    <div data-testid="screen-s4">
      <h1 className="text-2xl font-bold mb-2">服务记录</h1>
      <p className="text-sm text-gray-500 mb-6">记录为客户提供的门店服务。</p>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
      <form onSubmit={handleCreate} className="bg-white border rounded-lg p-6 space-y-4">
        <fieldset>
          <legend className="text-sm font-medium text-gray-700 mb-2">服务类型 *</legend>
          <div className="flex flex-wrap gap-2">
            {SERVICE_TYPES.map(t => (
              <button key={t.key} type="button" onClick={() => setServiceType(t.key)}
                className={`px-3 py-1.5 rounded-full text-sm border ${serviceType === t.key ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"}`}
                data-testid={`service-type-${t.key}`}>{t.label}</button>
            ))}
          </div>
        </fieldset>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">服务人员</label>
          <input type="text" value={staff?.display_name || ""} disabled className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-gray-50 text-gray-500" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">服务前备注</label>
          <textarea value={preNotes} onChange={(e) => setPreNotes(e.target.value)} rows={2}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="服务前客户状态" data-testid="pre-notes" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">服务内容 *</label>
          <textarea value={serviceDetail} onChange={(e) => setServiceDetail(e.target.value)} rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="提供了什么服务？" required data-testid="service-detail" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">建议下一步</label>
          <input type="text" value={nextStep} onChange={(e) => setNextStep(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="例如：建议 3 天后随访" data-testid="next-step" /></div>
        <div className="flex gap-2 pt-2">
          <button type="submit" disabled={saving || !serviceType}
            className="bg-blue-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            data-testid="save-btn">{saving ? "保存中…" : "保存服务记录"}</button>
          <button type="button" onClick={() => navigate(`/customers/${id}`)} className="text-gray-500 px-4 py-2 text-sm">返回</button>
        </div>
        <p className="text-xs text-gray-400">必填：服务类型 + 内容 ≤ 5 项</p>
      </form>
    </div>
  );
}
