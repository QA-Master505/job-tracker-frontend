import { useAuth } from "../hooks/useAuth";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <main className="flex-1 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-500 mb-8">Welcome back! Here are your job applications.</p>

        {/* Placeholder — job list will go here in Phase 2 */}
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center text-gray-400">
          <p className="text-lg">No applications yet.</p>
          <p className="text-sm mt-1">Add your first job application to get started.</p>
        </div>
      </div>
    </main>
  );
}
