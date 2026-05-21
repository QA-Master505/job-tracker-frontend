import { formatDate } from "../../utils/helpers";

const TYPE_CONFIG = {
  phone: { label: "Phone", color: "bg-purple-100 text-purple-800" },
  virtual: { label: "Virtual", color: "bg-indigo-100 text-indigo-800" },
  onsite: { label: "Onsite", color: "bg-yellow-100 text-yellow-800" },
  other: { label: "Other", color: "bg-gray-100 text-gray-700" },
};

export default function InterviewRoundCard({ round, onEdit, onDelete }) {
  const config = TYPE_CONFIG[round.interview_type] ?? TYPE_CONFIG.other;

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-semibold text-gray-500 shrink-0">
            Round {round.round_number}
          </span>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${config.color}`}
          >
            {config.label}
          </span>
        </div>
        <span className="text-xs text-gray-400 shrink-0">
          {formatDate(round.interview_date)}
        </span>
      </div>

      {round.notes && (
        <p className="text-xs text-gray-600 leading-relaxed">{round.notes}</p>
      )}

      <div className="flex gap-2 justify-end pt-1">
        <button
          onClick={() => onEdit(round)}
          className="text-xs px-2.5 py-1 rounded border border-gray-300 text-gray-500 hover:bg-white hover:border-gray-400 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(round)}
          className="text-xs px-2.5 py-1 rounded border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
