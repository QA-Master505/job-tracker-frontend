export function formatDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function statusColor(status) {
  const map = {
    applied: "bg-blue-100 text-blue-800",
    phone_interview: "bg-purple-100 text-purple-800",
    virtual_interview: "bg-indigo-100 text-indigo-800",
    onsite_interview: "bg-yellow-100 text-yellow-800",
    offer: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    no_response: "bg-gray-100 text-gray-600",
    withdrawn: "bg-orange-100 text-orange-800",
  };
  return map[status?.toLowerCase()] ?? "bg-gray-100 text-gray-600";
}

export const STATUS_OPTIONS = [
  { value: "applied", label: "Applied" },
  { value: "phone_interview", label: "Phone Interview" },
  { value: "virtual_interview", label: "Virtual Interview" },
  { value: "onsite_interview", label: "Onsite Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
  { value: "no_response", label: "No Response" },
  { value: "withdrawn", label: "Withdrawn" },
];
