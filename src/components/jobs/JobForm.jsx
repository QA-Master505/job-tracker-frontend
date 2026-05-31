import { useState } from "react";
import { STATUS_OPTIONS } from "../../utils/helpers";

const EMPTY_FORM = {
  company_name: "",
  job_title: "",
  job_url: "",
  status: "applied",
  applied_date: new Date().toISOString().slice(0, 10),
  notes: "",
};

export default function JobForm({ job, onSubmit, onClose }) {
  const [form, setForm] = useState(() =>
    job
      ? {
          company_name: job.company_name || "",
          job_title: job.job_title || "",
          job_url: job.job_url || "",
          status: job.status || "applied",
          applied_date:
            job.applied_date?.slice(0, 10) ||
            new Date().toISOString().slice(0, 10),
          notes: job.notes || "",
        }
      : EMPTY_FORM,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {job ? "Edit Application" : "Add Application"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto"
        >
          {error && (
            <p className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                data-testid="job-company-input"
                value={form.company_name}
                onChange={set("company_name")}
                placeholder="e.g. Google"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                data-testid="job-position-input"
                value={form.job_title}
                onChange={set("job_title")}
                placeholder="e.g. Frontend Engineer"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job URL
            </label>
            <input
              type="text"
              value={form.job_url}
              onChange={set("job_url")}
              placeholder="e.g. linkedin.com/jobs/123"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                data-testid="job-status-select"
                value={form.status}
                onChange={set("status")}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Applied Date
              </label>
              <input
                type="date"
                value={form.applied_date}
                onChange={set("applied_date")}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              placeholder="Any notes about this application..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              data-testid={job ? "job-save-btn" : "job-submit-btn"}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {loading ? "Saving…" : job ? "Save Changes" : "Add Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
