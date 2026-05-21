import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <main className="flex flex-col items-center justify-center flex-1 px-6 py-20 text-center">
      <h1 className="text-5xl font-bold text-gray-900 mb-4">
        Track Your Job Applications
      </h1>
      <p className="text-xl text-gray-500 max-w-xl mb-10">
        Stay organised during your job search. Log every application, track
        every interview, and land your next role faster.
      </p>
      <div className="flex gap-4">
        {user ? (
          <Link
            to="/dashboard"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Log In
            </Link>
          </>
        )}
      </div>

      {/* Setup verification badge */}
      <div className="mt-16 bg-green-50 border border-green-200 rounded-lg px-6 py-4">
        <p className="text-green-700 font-medium">
          ✓ Vite + React + Tailwind CSS setup complete
        </p>
        <p className="text-green-600 text-sm mt-1">
          Backend API:{" "}
          <code className="bg-green-100 px-1 rounded">
            http://localhost:8000
          </code>
        </p>
      </div>
    </main>
  );
}
