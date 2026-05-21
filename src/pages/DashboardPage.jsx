import { useState, useEffect, useCallback } from "react";
import api from "../api/axiosConfig";
import { useAuth } from "../hooks/useAuth";
import JobCard from "../components/jobs/JobCard";
import JobForm from "../components/jobs/JobForm";

const STATS = [
  { label: "Total", key: "total", color: "text-gray-900" },
  { label: "Applied", key: "applied", color: "text-blue-600" },
  { label: "Interview", key: "interview", color: "text-yellow-600" },
  { label: "Offer", key: "offer", color: "text-green-600" },
  { label: "Rejected", key: "rejected", color: "text-red-600" },
];

function computeStats(jobs) {
  return {
    total: jobs.length,
    applied: jobs.filter((j) => j.status === "applied").length,
    interview: jobs.filter((j) => j.status === "interview").length,
    offer: jobs.filter((j) => j.status === "offer").length,
    rejected: jobs.filter((j) => j.status === "rejected").length,
  };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/jobs");
      setJobs(response.data);
    } catch (err) {
      setError("Failed to load applications. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleAdd = async (formData) => {
    await api.post("/jobs", formData);
    await fetchJobs();
  };

  const handleEdit = async (formData) => {
    await api.put(`/jobs/${editingJob.id}`, formData);
    await fetchJobs();
  };

  const handleDelete = async (job) => {
    if (!window.confirm(`Delete "${job.job_title}" at ${job.company_name}?`))
      return;
    setDeletingId(job.id);
    try {
      await api.delete(`/jobs/${job.id}`);
      setJobs((prev) => prev.filter((j) => j.id !== job.id));
    } catch {
      setError("Failed to delete application.");
    } finally {
      setDeletingId(null);
    }
  };

  const openAdd = () => {
    setEditingJob(null);
    setShowForm(true);
  };

  const openEdit = (job) => {
    setEditingJob(job);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingJob(null);
  };

  const stats = computeStats(jobs);

  return (
    <main className="flex-1 px-4 sm:px-6 py-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              My Applications
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{user?.email}</p>
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <span className="text-lg leading-none">+</span> Add Application
          </button>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {STATS.map(({ label, key, color }) => (
            <div
              key={key}
              className="bg-white rounded-xl border border-gray-200 px-4 py-3 text-center shadow-sm"
            >
              <p className={`text-2xl font-bold ${color}`}>{stats[key]}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="text-red-400 hover:text-red-600 ml-4"
            >
              &times;
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <svg
              className="animate-spin h-6 w-6 mr-3 text-blue-500"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            Loading applications…
          </div>
        )}

        {/* Empty state */}
        {!loading && jobs.length === 0 && !error && (
          <div className="bg-white border border-dashed border-gray-300 rounded-xl px-6 py-16 text-center">
            <p className="text-gray-400 text-lg">No applications yet.</p>
            <p className="text-gray-400 text-sm mt-1">
              Click{" "}
              <button
                onClick={openAdd}
                className="font-medium text-blue-500 hover:text-blue-700 underline underline-offset-2"
              >
                Add Application
              </button>{" "}
              to get started.
            </p>
          </div>
        )}

        {/* Job grid */}
        {!loading && jobs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className={
                  deletingId === job.id ? "opacity-50 pointer-events-none" : ""
                }
              >
                <JobCard job={job} onEdit={openEdit} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form modal */}
      {showForm && (
        <JobForm
          job={editingJob}
          onSubmit={editingJob ? handleEdit : handleAdd}
          onClose={closeForm}
        />
      )}
    </main>
  );
}
