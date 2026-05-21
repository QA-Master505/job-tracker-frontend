import { formatDate, statusColor } from "../../utils/helpers";

const getAbsoluteUrl = (url) => {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return "https://" + url;
};

export default function JobCard({ job, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3">
      {/* Header row */}
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
          {job.status.replace("_", " ")}
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

      {/* Footer row */}
      <div className="flex items-center justify-between gap-2 border-t border-gray-100 pt-2 mt-auto">
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
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(job)}
            className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-400 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
