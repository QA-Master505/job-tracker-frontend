import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ROLE_BADGE = {
  superadmin: "bg-red-100 text-red-700",
  admin: "bg-indigo-100 text-indigo-700",
  user: "bg-gray-100 text-gray-600",
};

const NAV_ITEMS = [
  { to: "/admin/dashboard", label: "Dashboard", testId: "admin-nav-dashboard" },
  { to: "/admin/users",     label: "Users",     testId: "admin-nav-users" },
  { to: "/admin/audit-log", label: "Audit Log", testId: "admin-nav-audit-log" },
];

export default function AdminLayout() {
  const { user } = useAuth();

  return (
    <div data-testid="admin-layout" className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside
        data-testid="admin-sidebar"
        className="w-64 bg-gray-900 text-gray-100 flex flex-col shrink-0"
      >
        <div className="px-6 py-5 border-b border-gray-700">
          <span className="text-lg font-bold tracking-tight">Admin Panel</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ to, label, testId }) => (
            <NavLink
              key={to}
              to={to}
              data-testid={testId}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gray-700 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
          <span className="text-sm font-semibold text-gray-700">Admin Panel</span>
          {user && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">{user.email}</span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  ROLE_BADGE[user.role] ?? ROLE_BADGE.user
                }`}
              >
                {user.role}
              </span>
            </div>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
