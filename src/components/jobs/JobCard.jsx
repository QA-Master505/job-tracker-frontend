import { useState, useEffect, useCallback } from "react";
import { formatDate, statusColor, STATUS_OPTIONS } from "../../utils/helpers";
import {
  getInterviewRounds,
  addInterviewRound,
  updateInterviewRound,
  deleteInterviewRound,
} from "../../api/axiosConfig";
import InterviewRoundCard from "./InterviewRoundCard";
import InterviewRoundForm from "./InterviewRoundForm";

const getAbsoluteUrl = (url) => {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return "https://" + url;
};

const getStatusLabel = (status) => {
  const opt = STATUS_OPTIONS.find((o) => o.value === status);
  return opt ? opt.label : status.replace(/_/g, " ");
};

// Show interview rounds for any status that implies interviews may have occurred
const HIDE_ROUNDS_STATUSES = new Set(["applied", "no_response"]);

export default function JobCard({ job, onEdit, onDelete }) {
  const showInterviews = !HIDE_ROUNDS_STATUSES.has(job.status);

  const [isOpen, setIsOpen] = useState(false);
  const [rounds, setRounds] = useState([]);
  const [loadingRounds, setLoadingRounds] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingRound, setEditingRound] = useState(null);

  const fetchRounds = useCallback(async () => {
    setLoadingRounds(true);
    try {
      const res = await getInterviewRounds(job.id);
      setRounds(res.data);
    } catch {
      // silently fail — rounds section simply shows empty
    } finally {
      setLoadingRounds(false);
    }
  }, [job.id]);

  useEffect(() => {
    if (showInterviews) fetchRounds();
  }, [showInterviews, fetchRounds]);

  const handleAddRound = async (data) => {
    await addInterviewRound(job.id, data);
    await fetchRounds();
  };

  const handleEditRound = async (data) => {
    await updateInterviewRound(job.id, editingRound.id, data);
    await fetchRounds();
  };

  const handleDeleteRound = async (round) => {
    if (!window.confirm(`Delete Round ${round.round_number}?`)) return;
    await deleteInterviewRound(job.id, round.id);
    setRounds((prev) => prev.filter((r) => r.id !== round.id));
  };

  const openAdd = () => {
    setEditingRound(null);
    setShowForm(true);
  };
  const openEdit = (round) => {
    setEditingRound(round);
    setShowForm(true);
  };
  const closeForm = () => {
    setShowForm(false);
    setEditingRound(null);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
        {/* Read-only top section */}
        <div className="p-5 flex flex-col gap-3">
          {/* Header: title, company, status badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-gray-900 truncate">
                {job.job_title}
              </h3>
              <p className="text-sm text-gray-500 truncate">{job.company_name}</p>
            </div>
            <span
              className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${statusColor(job.status)}`}
            >
              {getStatusLabel(job.status)}
            </span>
          </div>

          {/* Applied date */}
          <p className="text-xs text-gray-400">
            Applied:{" "}
            <span className="text-gray-500">{formatDate(job.applied_date)}</span>
          </p>

          {/* Notes */}
          {job.notes && (
            <p className="text-sm text-gray-600 line-clamp-2 border-t border-gray-100 pt-2">
              {job.notes}
            </p>
          )}

          {/* Footer: URL + Edit/Delete */}
          <div className="flex items-center justify-between gap-2 border-t border-gray-100 pt-2">
            {job.job_url ? (
              <a
                href={getAbsoluteUrl(job.job_url)}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-600 hover:underline truncate max-w-[140px]"
              >
                View posting ↗
              </a>
            ) : (
              <span />
            )}
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => onEdit(job)}
                data-testid="job-edit-btn"
                className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(job)}
                data-testid="job-delete-btn"
                className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-400 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Interview Rounds collapsible section */}
        {showInterviews && (
          <div className="border-t border-gray-100">
            {/* Toggle header */}
            <button
              onClick={() => setIsOpen((o) => !o)}
              className="w-full flex items-center justify-between px-5 py-3 text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                Interview Rounds
                {!loadingRounds && rounds.length > 0 && (
                  <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full text-xs">
                    {rounds.length}
                  </span>
                )}
              </span>
              <span className="text-gray-400">{isOpen ? "▴" : "▾"}</span>
            </button>

            {/* Collapsible content */}
            {isOpen && (
              <div className="px-5 pb-4 flex flex-col gap-2">
                {loadingRounds ? (
                  <p className="text-xs text-gray-400 py-3 text-center">
                    Loading…
                  </p>
                ) : rounds.length === 0 ? (
                  <p className="text-xs text-gray-400 py-3 text-center">
                    No interview rounds yet.
                  </p>
                ) : (
                  rounds.map((r) => (
                    <InterviewRoundCard
                      key={r.id}
                      round={r}
                      onEdit={openEdit}
                      onDelete={handleDeleteRound}
                    />
                  ))
                )}
                <button
                  onClick={openAdd}
                  className="mt-1 w-full text-xs py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  + Add Interview Round
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Interview round form modal */}
      {showForm && (
        <InterviewRoundForm
          round={editingRound}
          onSubmit={editingRound ? handleEditRound : handleAddRound}
          onClose={closeForm}
        />
      )}
    </>
  );
}
