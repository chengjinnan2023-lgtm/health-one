// Health One — S3: 健康关注录入 (DEV-019 + PILOT-010).

import { useState, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, type HealthProfile } from "../api/client";

const CONCERN_CATEGORIES = [
  { key: "肩颈", label: "肩颈" }, { key: "腰背", label: "腰背" }, { key: "疲劳", label: "疲劳" },
  { key: "运动恢复", label: "运动恢复" }, { key: "体重管理", label: "体重管理" }, { key: "睡眠", label: "睡眠" }, { key: "其他", label: "其他" },
];

export default function ConcernIntakeScreen() {
  const { id } = useParams<{ id: string }>(); const navigate = useNavigate();
  const [category, setCategory] = useState(""); const [selfDescription, setSelfDescription] = useState("");
  const [staffNotes, setStaffNotes] = useState(""); const [healthGoal, setHealthGoal] = useState("");
  const [birthYear, setBirthYear] = useState(""); const [phone, setPhone] = useState("");
  const [gender, setGender] = useState(""); const [saving, setSaving] = useState(false); const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); if (!id || !category) return;
    setSaving(true); setError("");
    try {
      const basicInfo: Record<string, string> = {};
      if (birthYear) basicInfo.birth_year = birthYear; if (gender) basicInfo.gender = gender; if (phone) basicInfo.phone = phone;
      const body: Record<string, unknown> = {};
      if (Object.keys(basicInfo).length > 0) body.basic_info = basicInfo;
      const parts = [category, selfDescription];
      if (healthGoal) parts.push(`目标: ${healthGoal}`);
      const concernText = parts.filter(Boolean).join(" — ");
      if (concernText) body.primary_concern = concernText;
      if (staffNotes) body.lifestyle_notes = staffNotes;
      await api.put<HealthProfile>(`/api/identities/${id}/profile`, body);
      navigate(`/customers/${id}`);
    } catch (err) { setError(err instanceof Error ? err.message : "保存失败，请重试"); }
    finally { setSaving(false); }
  };

  return (
    <div data-testid="screen-s3">
      <h1 className="text-2xl font-bold mb-2">健康关注录入</h1>
      <p className="text-sm text-gray-500 mb-6">记录客户的健康关注。不是医疗诊断。</p>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 space-y-5">
        <fieldset>
          <legend className="text-sm font-medium text-gray-700 mb-2">关注类别 *</legend>
          <div className="flex flex-wrap gap-2">
            {CONCERN_CATEGORIES.map(c => (
              <button key={c.key} type="button" onClick={() => setCategory(c.key)}
                className={`px-3 py-1.5 rounded-full text-sm border ${category === c.key ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"}`}
                data-testid={`category-${c.key}`}>{c.label}</button>
            ))}
          </div>
        </fieldset>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">客户自述 *</label>
          <textarea value={selfDescription} onChange={(e) => setSelfDescription(e.target.value)} rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="客户说了什么？" required data-testid="self-description" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">员工观察备注</label>
          <textarea value={staffNotes} onChange={(e) => setStaffNotes(e.target.value)} rows={2}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="可选，员工观察记录" data-testid="staff-notes" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">手机号</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="客户手机号" data-testid="phone" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">健康目标</label>
            <input type="text" value={healthGoal} onChange={(e) => setHealthGoal(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="客户希望达成什么？" data-testid="health-goal" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">出生年份</label>
            <input type="text" value={birthYear} onChange={(e) => setBirthYear(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例如 1985" data-testid="birth-year" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">性别</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" data-testid="gender">
              <option value="">不透露</option><option value="male">男</option><option value="female">女</option></select></div>
        </div>
        <div className="flex gap-2 pt-2">
          <button type="submit" disabled={saving || !category}
            className="bg-blue-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            data-testid="save-btn">{saving ? "保存中…" : "保存"}</button>
          <button type="button" onClick={() => navigate(`/customers/${id}`)} className="text-gray-500 px-4 py-2 text-sm">取消</button>
        </div>
        <p className="text-xs text-gray-400">必填：类别 + 自述 ≤ 4 项</p>
      </form>
    </div>
  );
}
