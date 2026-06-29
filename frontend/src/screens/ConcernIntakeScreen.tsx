// Health One — S3: Health Concern Intake (DEV-019).

import { useState, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { api, type HealthProfile } from "../api/client";

const CONCERN_CATEGORIES = [
  { key: "肩颈", label: "肩颈 Shoulder & Neck" },
  { key: "腰背", label: "腰背 Waist & Back" },
  { key: "疲劳", label: "疲劳 Fatigue" },
  { key: "运动恢复", label: "运动恢复 Sports Recovery" },
  { key: "体重管理", label: "体重管理 Weight Mgmt" },
  { key: "睡眠", label: "睡眠 Sleep" },
  { key: "其他", label: "其他 Other" },
];

export default function ConcernIntakeScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [staffNotes, setStaffNotes] = useState("");
  const [healthGoal, setHealthGoal] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [gender, setGender] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id || !category) return;
    setSaving(true);
    setError("");
    try {
      const basicInfo: Record<string, string> = {};
      if (birthYear) basicInfo.birth_year = birthYear;
      if (gender) basicInfo.gender = gender;

      const body: Record<string, unknown> = {};
      if (Object.keys(basicInfo).length > 0) body.basic_info = basicInfo;
      // Combine category + self-description into primary_concern
      const concernText = [category, selfDescription].filter(Boolean).join(" — ");
      if (concernText) body.primary_concern = concernText;
      if (staffNotes) body.lifestyle_notes = staffNotes;

      await api.put<HealthProfile>(`/api/identities/${id}/profile`, body);
      navigate(`/customers/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div data-testid="screen-s3">
      <h1 className="text-2xl font-bold mb-2">Health Concern Intake</h1>
      <p className="text-sm text-gray-500 mb-6">
        Record the customer's health concern. Not a medical diagnosis.
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-lg p-6 space-y-5"
      >
        {/* Step 1: Concern Category */}
        <fieldset>
          <legend className="text-sm font-medium text-gray-700 mb-2">
            Concern Category *
          </legend>
          <div className="flex flex-wrap gap-2">
            {CONCERN_CATEGORIES.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setCategory(c.key)}
                className={`px-3 py-1.5 rounded-full text-sm border ${
                  category === c.key
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                }`}
                data-testid={`category-${c.key}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Step 2: Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer Self-Description *
          </label>
          <textarea
            value={selfDescription}
            onChange={(e) => setSelfDescription(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="What did the customer say?"
            required
            data-testid="self-description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Staff Observation Notes
          </label>
          <textarea
            value={staffNotes}
            onChange={(e) => setStaffNotes(e.target.value)}
            rows={2}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Optional staff observations"
            data-testid="staff-notes"
          />
        </div>

        {/* Step 3: Health Goal + Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Health Goal
            </label>
            <input
              type="text"
              value={healthGoal}
              onChange={(e) => setHealthGoal(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What does the customer want to achieve?"
              data-testid="health-goal"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Birth Year
            </label>
            <input
              type="text"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 1985"
              data-testid="birth-year"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            data-testid="gender"
          >
            <option value="">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={saving || !category}
            className="bg-blue-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            data-testid="save-btn"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/customers/${id}`)}
            className="text-gray-500 px-4 py-2 text-sm"
          >
            Cancel
          </button>
        </div>
        <p className="text-xs text-gray-400">
          Required fields: category + self-description ≤ 4 fields total
        </p>
      </form>
    </div>
  );
}
