// Health One — S5: 服务反馈 (DEV-035 + PILOT-010).

import { useState, useEffect, type FormEvent } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api/client";

export default function FeedbackRecordScreen() {
  const { id } = useParams<{ id: string }>(); const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id") || ""; const navigate = useNavigate();
  const [feeling, setFeeling] = useState(""); const [comfortChange, setComfortChange] = useState("");
  const [satisfaction, setSatisfaction] = useState(""); const [questions, setQuestions] = useState("");
  const [returnWillingness, setReturnWillingness] = useState(""); const [followUpMethod, setFollowUpMethod] = useState("");
  const [saving, setSaving] = useState(false); const [error, setError] = useState(""); const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!sessionId) {
      setError("缺少服务记录信息，请从服务记录页面进入");
      return;
    }
    if (!feeling || !satisfaction || !returnWillingness) {
      setError("请填写必填项：感受、满意度、回访意愿");
      return;
    }
    setSaving(true); setError("");
    try {
      const parts: string[] = [];
      if (feeling) parts.push(`感受: ${feeling}`); if (comfortChange) parts.push(`舒适度: ${comfortChange}`);
      if (satisfaction) parts.push(`满意度: ${satisfaction}`); if (questions) parts.push(`问题: ${questions}`);
      if (returnWillingness) parts.push(`回访意愿: ${returnWillingness}`); if (followUpMethod) parts.push(`随访方式: ${followUpMethod}`);
      await api.patch(`/api/identities/${id}/sessions/${sessionId}`, {
        customer_feedback: parts.join(" | ") || null, post_service_notes: feeling || null,
      });
      setSuccess(true);
    } catch (err) { setError(err instanceof Error ? err.message : "保存失败，请重试"); }
    finally { setSaving(false); }
  };

  // Auto-redirect to S6 after success (PILOT-014)
  useEffect(() => {
    if (!success || !id || !sessionId) return;
    const timer = setTimeout(() => {
      navigate(`/customers/${id}/follow-up?session_id=${sessionId}`);
    }, 1500);
    return () => clearTimeout(timer);
  }, [success, id, sessionId, navigate]);

  if (success) {
    return (
      <div data-testid="screen-s5" className="text-center py-12">
        <h1 className="text-2xl font-bold text-green-700 mb-4">✓ 反馈已记录</h1>
        <p className="text-gray-500 mb-2">客户反馈已保存至服务记录。</p>
        <p className="text-gray-600 text-sm mb-6">接下来为这位客户创建随访计划。1.5 秒后自动跳转…</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate(`/customers/${id}/follow-up?session_id=${sessionId}`)}
            className="bg-blue-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-blue-700" data-testid="go-to-s6">下一步：创建随访 →</button>
          <button onClick={() => navigate(`/customers/${id}`)}
            className="text-gray-400 px-4 py-2 text-sm hover:text-gray-600" data-testid="back-to-s2">稍后创建随访</button>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="screen-s5">
      <h1 className="text-2xl font-bold mb-2">服务反馈</h1>
      <p className="text-sm text-gray-500 mb-6">快速记录反馈，不是长问卷。</p>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 space-y-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">即时感受 *</label>
          <textarea value={feeling} onChange={(e) => setFeeling(e.target.value)} rows={2}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="客户现在感觉怎么样？" required data-testid="feeling" />
          {error && !feeling && <p className="text-red-500 text-xs mt-1">请填写客户即时感受</p>}
        </div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">舒适度变化</label>
          <div className="flex gap-2">
            {["改善", "不变", "变差"].map(opt => (
              <button key={opt} type="button" onClick={() => setComfortChange(opt)}
                className={`px-3 py-1.5 rounded-full text-sm border ${comfortChange === opt ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"}`}
                data-testid={`comfort-${opt}`}>{opt}</button>))}
          </div></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">满意度 *</label>
          <div className="flex gap-2">
            {["满意", "一般", "不满意"].map(opt => (
              <button key={opt} type="button" onClick={() => setSatisfaction(opt)}
                className={`px-3 py-1.5 rounded-full text-sm border ${satisfaction === opt ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"}`}
                data-testid={`sat-${opt}`}>{opt}</button>))}
          </div>
          {error && !satisfaction && <p className="text-red-500 text-xs mt-1">请选择满意度</p>}
        </div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">回访意愿 *</label>
          <div className="flex gap-2">
            {["愿意", "可能", "不愿意"].map(opt => (
              <button key={opt} type="button" onClick={() => setReturnWillingness(opt)}
                className={`px-3 py-1.5 rounded-full text-sm border ${returnWillingness === opt ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"}`}
                data-testid={`return-${opt}`}>{opt}</button>))}
          </div>
          {error && !returnWillingness && <p className="text-red-500 text-xs mt-1">请选择回访意愿</p>}
        </div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">客户问题或疑虑</label>
          <textarea value={questions} onChange={(e) => setQuestions(e.target.value)} rows={2}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="客户提出的问题" data-testid="questions" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">首选随访方式</label>
          <div className="flex flex-wrap gap-2">
            {[{ key: "phone", label: "📞 电话" }, { key: "wechat", label: "💬 微信" }, { key: "sms", label: "📱 短信" }, { key: "in-store", label: "🏪 到店" }].map(m => (
              <button key={m.key} type="button" onClick={() => setFollowUpMethod(m.key)}
                className={`px-3 py-1.5 rounded-full text-sm border ${followUpMethod === m.key ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"}`}
                data-testid={`method-${m.key}`}>{m.label}</button>))}
          </div></div>
        <div className="flex gap-2 pt-2">
          <button type="submit" disabled={saving || !feeling || !satisfaction || !returnWillingness}
            className="bg-blue-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            data-testid="save-feedback-btn">{saving ? "保存中…" : "保存反馈"}</button>
          <button type="button" onClick={() => navigate(`/customers/${id}`)} className="text-gray-500 px-4 py-2 text-sm">跳过</button>
        </div>
        <p className="text-xs text-gray-400">必填：感受 + 满意度 + 回访意愿 ≤ 3 项</p>
      </form>
    </div>
  );
}
