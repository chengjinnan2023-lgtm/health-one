// Health One — S5: Feedback Record (DEV-035).

import { useState, type FormEvent } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";

import { api } from "../api/client";

export default function FeedbackRecordScreen() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id") || "";
  const navigate = useNavigate();

  const [feeling, setFeeling] = useState("");
  const [comfortChange, setComfortChange] = useState("");
  const [satisfaction, setSatisfaction] = useState("");
  const [questions, setQuestions] = useState("");
  const [returnWillingness, setReturnWillingness] = useState("");
  const [followUpMethod, setFollowUpMethod] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id || !sessionId) return;
    setSaving(true);
    setError("");
    try {
      // Build structured feedback text for customer_feedback field
      const feedbackParts: string[] = [];
      if (feeling) feedbackParts.push(`Feeling: ${feeling}`);
      if (comfortChange) feedbackParts.push(`Comfort: ${comfortChange}`);
      if (satisfaction) feedbackParts.push(`Satisfaction: ${satisfaction}`);
      if (questions) feedbackParts.push(`Questions: ${questions}`);
      if (returnWillingness) feedbackParts.push(`Return: ${returnWillingness}`);
      if (followUpMethod) feedbackParts.push(`FollowUpMethod: ${followUpMethod}`);

      await api.patch(`/api/identities/${id}/sessions/${sessionId}`, {
        customer_feedback: feedbackParts.join(" | ") || null,
        post_service_notes: feeling || null,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (success) {
    return (
      <div data-testid="screen-s5" className="text-center py-12">
        <h1 className="text-2xl font-bold text-green-700 mb-4">
          ✓ Feedback Recorded
        </h1>
        <p className="text-gray-500 mb-6">
          Customer feedback has been saved to the service record.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(`/customers/${id}`)}
            className="bg-blue-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-blue-700"
            data-testid="back-to-s2"
          >
            Back to Customer Summary
          </button>
          <button
            onClick={() => navigate(`/customers/${id}/follow-up?session_id=${sessionId}`)}
            className="bg-indigo-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-indigo-700"
            data-testid="go-to-s6"
          >
            Create Follow-Up →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="screen-s5">
      <h1 className="text-2xl font-bold mb-2">Customer Feedback</h1>
      <p className="text-sm text-gray-500 mb-6">
        Quick feedback after service. Not a long survey.
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 space-y-4">
        {/* Immediate Feeling */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Immediate Feeling *
          </label>
          <textarea
            value={feeling}
            onChange={(e) => setFeeling(e.target.value)}
            rows={2}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="How does the customer feel right now?"
            required
            data-testid="feeling"
          />
        </div>

        {/* Comfort Change */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Comfort Change
          </label>
          <div className="flex gap-2">
            {["Improved", "Same", "Worse"].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setComfortChange(opt)}
                className={`px-3 py-1.5 rounded-full text-sm border ${
                  comfortChange === opt
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                }`}
                data-testid={`comfort-${opt.toLowerCase()}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Satisfaction */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Satisfaction *
          </label>
          <div className="flex gap-2">
            {["Satisfied", "Neutral", "Dissatisfied"].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setSatisfaction(opt)}
                className={`px-3 py-1.5 rounded-full text-sm border ${
                  satisfaction === opt
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                }`}
                data-testid={`sat-${opt.toLowerCase()}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Return Willingness */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Willingness to Return *
          </label>
          <div className="flex gap-2">
            {["Yes", "Maybe", "No"].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setReturnWillingness(opt)}
                className={`px-3 py-1.5 rounded-full text-sm border ${
                  returnWillingness === opt
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                }`}
                data-testid={`return-${opt.toLowerCase()}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Questions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer Questions or Concerns
          </label>
          <textarea
            value={questions}
            onChange={(e) => setQuestions(e.target.value)}
            rows={2}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Any questions the customer raised"
            data-testid="questions"
          />
        </div>

        {/* Preferred Follow-Up Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Follow-Up Method
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "phone", label: "📞 Phone" },
              { key: "wechat", label: "💬 WeChat" },
              { key: "sms", label: "📱 SMS" },
              { key: "in-store", label: "🏪 In-Store" },
            ].map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => setFollowUpMethod(m.key)}
                className={`px-3 py-1.5 rounded-full text-sm border ${
                  followUpMethod === m.key
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                }`}
                data-testid={`method-${m.key}`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={saving || !feeling || !satisfaction || !returnWillingness}
            className="bg-blue-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            data-testid="save-feedback-btn"
          >
            {saving ? "Saving..." : "Save Feedback"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/customers/${id}`)}
            className="text-gray-500 px-4 py-2 text-sm"
          >
            Skip
          </button>
        </div>
        <p className="text-xs text-gray-400">
          Required: feeling + satisfaction + return willingness ≤ 3 fields
        </p>
      </form>
    </div>
  );
}
