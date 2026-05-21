import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3.5 flex items-center justify-between">
      <Link to="/" className="text-lg font-bold text-blue-600 shrink-0">
        JobTracker
      </Link>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            {user.email && (
              <span className="hidden sm:block text-sm text-gray-500 truncate max-w-[200px]">
                {user.email}
              </span>
            )}
            <Link
              to="/dashboard"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
