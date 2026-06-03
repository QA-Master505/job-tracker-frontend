import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const STATUS_LABELS = {
  applied:           "Applied",
  phone_interview:   "Phone Interview",
  virtual_interview: "Virtual Interview",
  onsite_interview:  "Onsite Interview",
  offer:             "Offer",
  rejected:          "Rejected",
  no_response:       "No Response",
  withdrawn:         "Withdrawn",
};

const STATUS_COLORS = {
  applied:           "bg-blue-500",
  phone_interview:   "bg-purple-500",
  virtual_interview: "bg-indigo-500",
  onsite_interview:  "bg-yellow-500",
  offer:             "bg-green-500",
  rejected:          "bg-red-500",
  no_response:       "bg-gray-400",
  withdrawn:         "bg-orange-400",
};

function StatCard({ testId, label, value, color = "text-gray-900" }) {
  return (
    <div
      data-testid={testId}
      className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-5"
    >
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value ?? "—"}</p>
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-24 text-gray-400">
      <svg className="animate-spin h-7 w-7 mr-3 text-indigo-500" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      Loading stats…
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/admin/stats/overview`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        return res.json();
      })
      .then((data) => setStats(data))
      .catch((err) => setError(err.message || "Failed to load stats."))
      .finally(() => setLoading(false));
  }, []);

  const inactiveUsers =
    stats ? stats.total_users - stats.active_users : null;

  return (
    <div data-testid="admin-dashboard-page" className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
      <p className="text-sm text-gray-500 mb-8">Platform overview</p>

      {loading && <Spinner />}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-5 py-4 text-sm">
          Failed to load stats: {error}
        </div>
      )}

      {stats && !loading && (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard
              testId="stat-card-total-users"
              label="Total Users"
              value={stats.total_users}
              color="text-gray-900"
            />
            <StatCard
              testId="stat-card-active-users"
              label="Active Users"
              value={stats.active_users}
              color="text-green-600"
            />
            <StatCard
              testId="stat-card-inactive-users"
              label="Inactive Users"
              value={inactiveUsers}
              color="text-red-500"
            />
            <StatCard
              testId="stat-card-total-jobs"
              label="Total Job Applications"
              value={stats.total_jobs}
              color="text-indigo-600"
            />
          </div>

          {/* Jobs by status */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-5">
            <h2 className="text-base font-semibold text-gray-900 mb-5">
              Applications by Status
            </h2>
            <div className="space-y-3">
              {Object.entries(stats.jobs_by_status).map(([status, count]) => {
                const pct = stats.total_jobs > 0
                  ? Math.round((count / stats.total_jobs) * 100)
                  : 0;
                const barColor = STATUS_COLORS[status] ?? "bg-gray-300";
                const label = STATUS_LABELS[status] ?? status;
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">{label}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {count}
                        <span className="text-gray-400 font-normal ml-1">
                          ({pct}%)
                        </span>
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${barColor}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
