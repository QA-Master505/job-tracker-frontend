import { useState } from "react";
import api from "../api/axiosConfig";
import { useAuth } from "../hooks/useAuth";

function SectionCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-5">{title}</h2>
      {children}
    </div>
  );
}

function StatusMessage({ type, message }) {
  if (!message) return null;
  const styles =
    type === "success"
      ? "bg-green-50 border-green-200 text-green-700"
      : "bg-red-50 border-red-200 text-red-700";
  return (
    <p className={`border rounded-lg px-4 py-2 text-sm mt-3 ${styles}`}>
      {message}
    </p>
  );
}

function SaveButton({ loading }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
    >
      {loading ? "Saving…" : "Save Changes"}
    </button>
  );
}

function useFormSection() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const submit = async (fn) => {
    setStatus({ type: "", message: "" });
    setLoading(true);
    try {
      await fn();
      setStatus({ type: "success", message: "Saved successfully." });
    } catch (err) {
      const detail = err.response?.data?.detail;
      setStatus({
        type: "error",
        message:
          typeof detail === "string"
            ? detail
            : Array.isArray(detail)
              ? detail[0]?.msg || "Something went wrong."
              : "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, status, submit };
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  // — Username section
  const [username, setUsername] = useState(user?.username ?? "");
  const usernameSection = useFormSection();

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    usernameSection.submit(async () => {
      const res = await api.put("/users/me", { username });
      updateUser({ username: res.data.username });
    });
  };

  // — Email section
  const [email, setEmail] = useState(user?.email ?? "");
  const emailSection = useFormSection();

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    emailSection.submit(async () => {
      const res = await api.put("/users/me", { email });
      updateUser({ email: res.data.email });
    });
  };

  // — Password section
  const [pwForm, setPwForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const passwordSection = useFormSection();

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (pwForm.new_password !== pwForm.confirm_password) {
      passwordSection.submit(() =>
        Promise.reject({ response: { data: { detail: "New passwords do not match." } } }),
      );
      return;
    }
    passwordSection.submit(async () => {
      await api.put("/users/me", {
        current_password: pwForm.current_password,
        new_password: pwForm.new_password,
      });
      setPwForm({ current_password: "", new_password: "", confirm_password: "" });
    });
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <main className="flex-1 px-4 sm:px-6 py-8 bg-gray-50">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your account details
          </p>
        </div>

        {/* Account overview */}
        <SectionCard title="Account Details">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Username</dt>
              <dd className="font-medium text-gray-900">{user?.username}</dd>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-3">
              <dt className="text-gray-500">Email</dt>
              <dd className="font-medium text-gray-900">{user?.email}</dd>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-3">
              <dt className="text-gray-500">Member since</dt>
              <dd className="font-medium text-gray-900">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "—"}
              </dd>
            </div>
          </dl>
        </SectionCard>

        {/* Edit username */}
        <SectionCard title="Change Username">
          <form onSubmit={handleUsernameSubmit}>
            <label className={labelClass}>New Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputClass}
              minLength={3}
              maxLength={50}
            />
            <StatusMessage {...usernameSection.status} />
            <SaveButton loading={usernameSection.loading} />
          </form>
        </SectionCard>

        {/* Edit email */}
        <SectionCard title="Change Email">
          <form onSubmit={handleEmailSubmit}>
            <label className={labelClass}>New Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
            <StatusMessage {...emailSection.status} />
            <SaveButton loading={emailSection.loading} />
          </form>
        </SectionCard>

        {/* Change password */}
        <SectionCard title="Change Password">
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>Current Password</label>
              <input
                type="password"
                required
                value={pwForm.current_password}
                onChange={(e) =>
                  setPwForm((f) => ({ ...f, current_password: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>New Password</label>
              <input
                type="password"
                required
                value={pwForm.new_password}
                onChange={(e) =>
                  setPwForm((f) => ({ ...f, new_password: e.target.value }))
                }
                className={inputClass}
                minLength={8}
              />
            </div>
            <div>
              <label className={labelClass}>Confirm New Password</label>
              <input
                type="password"
                required
                value={pwForm.confirm_password}
                onChange={(e) =>
                  setPwForm((f) => ({
                    ...f,
                    confirm_password: e.target.value,
                  }))
                }
                className={inputClass}
              />
            </div>
            <StatusMessage {...passwordSection.status} />
            <SaveButton loading={passwordSection.loading} />
          </form>
        </SectionCard>
      </div>
    </main>
  );
}
