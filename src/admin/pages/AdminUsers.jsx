import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import { formatDate } from "../../utils/helpers";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const LIMIT = 10;

const ROLE_BADGE = {
  superadmin: "bg-red-100 text-red-700",
  admin: "bg-indigo-100 text-indigo-700",
  user: "bg-gray-100 text-gray-600",
};

async function adminFetch(url, options = {}) {
  const res = await fetch(url, { credentials: "include", ...options });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `${res.status} ${res.statusText}`);
  }
  return res.status === 204 ? null : res.json();
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-16 text-gray-400">
      <svg
        className="animate-spin h-6 w-6 mr-2 text-indigo-500"
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
      Loading users…
    </div>
  );
}

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === "superadmin";

  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [actioning, setActioning] = useState(new Set());

  // Debounce search — resets to page 1 on new query
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        skip: String((currentPage - 1) * LIMIT),
        limit: String(LIMIT),
      });
      if (debouncedSearch) params.set("search", debouncedSearch);
      const data = await adminFetch(`${API_URL}/admin/users?${params}`);
      const items = Array.isArray(data)
        ? data
        : (data.users ?? data.items ?? []);
      setUsers(items);
      setTotal(data.total ?? items.length);
    } catch (err) {
      setError(err.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch]);

  useEffect(() => {
    (async () => { await fetchUsers(); })();
  }, [fetchUsers]);

  const withActioning = async (id, fn) => {
    setActioning((prev) => new Set(prev).add(id));
    try {
      await fn();
      await fetchUsers();
    } catch (err) {
      setError(err.message || "Action failed.");
    } finally {
      setActioning((prev) => {
        const s = new Set(prev);
        s.delete(id);
        return s;
      });
    }
  };

  const handleRoleChange = (id, role) =>
    withActioning(id, () =>
      adminFetch(`${API_URL}/admin/users/${id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_role: role }),
      }),
    );

  const handleStatusToggle = (id, isActive) =>
    withActioning(id, () =>
      adminFetch(`${API_URL}/admin/users/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !isActive }),
      }),
    );

  const handleDelete = (id, email) => {
    if (
      !window.confirm(
        `Permanently delete user "${email}"? This cannot be undone.`,
      )
    )
      return;
    withActioning(id, () =>
      adminFetch(`${API_URL}/admin/users/${id}`, { method: "DELETE" }),
    );
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div data-testid="admin-users-page" className="p-8 max-w-6xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Users</h1>
      <p className="text-sm text-gray-500 mb-6">
        Manage registered user accounts
      </p>

      {/* Search */}
      <div className="mb-5">
        <input
          data-testid="user-search-input"
          type="search"
          placeholder="Search by email or username…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-lg px-5 py-3 text-sm flex justify-between items-center">
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
      {loading && <Spinner />}

      {/* Table + pagination */}
      {!loading && (
        <>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table data-testid="users-table" className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Username</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Joined</th>
                  {isSuperAdmin && <th className="px-5 py-3">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={isSuperAdmin ? 6 : 5}
                      className="px-5 py-10 text-center text-gray-400"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const busy = actioning.has(u.id);
                    return (
                      <tr
                        key={u.id}
                        data-testid={`user-row-${u.id}`}
                        className={`transition-colors ${
                          busy ? "opacity-50" : "hover:bg-gray-50"
                        }`}
                      >
                        {/* Email */}
                        <td className="px-5 py-3 text-gray-900">{u.email}</td>

                        {/* Username */}
                        <td className="px-5 py-3 text-gray-600">{u.username}</td>

                        {/* Role */}
                        <td className="px-5 py-3">
                          {isSuperAdmin ? (
                            <select
                              data-testid={`role-select-${u.id}`}
                              value={u.role}
                              disabled={busy}
                              onChange={(e) =>
                                handleRoleChange(u.id, e.target.value)
                              }
                              className="border border-gray-300 rounded-md px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            >
                              <option value="user">user</option>
                              <option value="admin">admin</option>
                              <option value="superadmin">superadmin</option>
                            </select>
                          ) : (
                            <span
                              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                ROLE_BADGE[u.role] ?? ROLE_BADGE.user
                              }`}
                            >
                              {u.role}
                            </span>
                          )}
                        </td>

                        {/* Status toggle */}
                        <td className="px-5 py-3">
                          <button
                            data-testid={`status-toggle-${u.id}`}
                            disabled={busy}
                            onClick={() =>
                              handleStatusToggle(u.id, u.is_active)
                            }
                            className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                              u.is_active
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-red-100 text-red-600 hover:bg-red-200"
                            }`}
                          >
                            {u.is_active ? "Active" : "Inactive"}
                          </button>
                        </td>

                        {/* Joined */}
                        <td className="px-5 py-3 text-gray-500">
                          {formatDate(u.created_at)}
                        </td>

                        {/* Delete — superadmin only */}
                        {isSuperAdmin && (
                          <td className="px-5 py-3">
                            <button
                              data-testid={`delete-user-${u.id}`}
                              disabled={busy}
                              onClick={() => handleDelete(u.id, u.email)}
                              className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-400 transition-colors disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-5 flex items-center gap-3">
              <button
                data-testid="pagination-prev"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous
              </button>
              <span className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
              <button
                data-testid="pagination-next"
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage >= totalPages}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
