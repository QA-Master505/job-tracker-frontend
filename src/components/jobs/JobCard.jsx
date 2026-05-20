import { formatDate, statusColor } from "../../utils/helpers";

export default function JobCard({ job }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
          <p className="text-gray-600">{job.company}</p>
        </div>
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap ${statusColor(job.status)}`}
        >
          {job.status}
        </span>
      </div>
      {job.location && (
        <p className="mt-2 text-sm text-gray-500">{job.location}</p>
      )}
      <p className="mt-3 text-xs text-gray-400">Applied: {formatDate(job.applied_date)}</p>
    </div>
  );
}
