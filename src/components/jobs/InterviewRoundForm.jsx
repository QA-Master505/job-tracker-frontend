import { useState, useEffect } from "react";

const TYPE_OPTIONS = [
  { value: "phone", label: "📞 Phone Call" },
  { value: "virtual", label: "💻 Virtual / Online" },
  { value: "onsite", label: "🏢 In Office / Onsite" },
  { value: "other", label: "📋 Other" },
];

const EMPTY_FORM = {
  interview_type: "phone",
  interview_date: new Date().toISOString().slice(0, 10),
  notes: "",
};

export default function InterviewRoundForm({ round, onSubmit, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (round) {
      setForm({
        interview_type: round.interview_type || "phone",
        interview_date:
          round.interview_date?.slice(0, 10) ||
          new Date().toISOString().slice(0, 10),
        notes: round.notes || "",
      });
    }
  }, [round]);

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(
        typeof detail === "string"
          ? detail
          : Array.isArray(detail)
            ? detail[0]?.msg || "Something went wrong."
            : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {round ? "Edit Interview Round" : "Add Interview Round"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <p className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {error}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interview Type
              </label>
              <select
                value={form.interview_type}
                onChange={set("interview_type")}
                className={`${inputClass} bg-white`}
              >
                {TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interview Date
              </label>
              <input
                type="date"
                required
                value={form.interview_date}
                onChange={set("interview_date")}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={set("notes")}
              placeholder="e.g. Bring CV, prepare coding questions, reschedule details..."
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {loading ? "Saving…" : round ? "Save Changes" : "Add Round"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
