import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Users,
  UserPlus,
  Trash2,
  LogOut,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function AdminPage() {
  const {
    user,
    logout,
    createManagedUser,
    listManagedUsers,
    deleteManagedUser,
  } = useAuth();

  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Staff");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refreshAccounts = () => {
    setAccounts(listManagedUsers());
  };

  useEffect(() => {
    if (user?.role?.toLowerCase() !== "admin") {
      navigate("/login", { replace: true });
      return;
    }

    refreshAccounts();
  }, [user, navigate]);

  if (user?.role?.toLowerCase() !== "admin") {
    return null;
  }

  const handleCreateAccount = (event) => {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const result = createManagedUser({
        name,
        email,
        password,
        role,
      });

      if (!result.success) {
        setMessageType("error");
        setMessage(result.message);
        return;
      }

      setMessageType("success");
      setMessage(result.message || "Account created successfully.");

      setName("");
      setEmail("");
      setPassword("");
      setRole("Staff");

      refreshAccounts();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (account) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${account.name}'s account?`
    );

    if (!confirmed) return;

    const result = deleteManagedUser(account.id);

    setMessageType(result.success ? "success" : "error");
    setMessage(result.message);

    refreshAccounts();
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-600 p-2">
              <GraduationCap size={25} />
            </div>

            <div>
              <h1 className="text-xl font-bold">Learnova</h1>
              <p className="text-xs text-slate-400">
                Administration Panel
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        {/* Welcome */}
        <section className="mb-8 rounded-3xl border border-violet-500/20 bg-gradient-to-r from-violet-900/40 to-slate-900 p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-500/15 px-3 py-1 text-xs font-semibold text-violet-300">
                <ShieldCheck size={15} />
                ADMINISTRATOR
              </div>

              <h2 className="text-3xl font-bold">
                Welcome, {user.name || "Admin"}!
              </h2>

              <p className="mt-2 text-slate-400">
                Manage Staff and Parent accounts from one place.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Managed accounts</p>
              <p className="mt-1 text-3xl font-bold">
                {accounts.length}
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          {/* Create account */}
          <section className="h-fit rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-violet-500/15 p-3 text-violet-400">
                <UserPlus size={22} />
              </div>

              <div>
                <h3 className="text-lg font-bold">
                  Create an account
                </h3>
                <p className="text-sm text-slate-400">
                  Add a Staff or Parent user
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm text-slate-300"
                >
                  Full name
                </label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter full name"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm text-slate-300"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="user@example.com"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm text-slate-300"
                >
                  Temporary password
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Minimum 8 characters"
                  minLength={8}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="mb-2 block text-sm text-slate-300"
                >
                  Account role
                </label>

                <select
                  id="role"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-violet-500"
                >
                  <option value="Staff">Staff</option>
                  <option value="Parent">Parent</option>
                </select>
              </div>

              {message && (
                <div
                  role="alert"
                  className={`rounded-xl border px-4 py-3 text-sm ${
                    messageType === "success"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : "border-red-500/30 bg-red-500/10 text-red-300"
                  }`}
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 font-semibold transition hover:bg-violet-500 disabled:opacity-60"
              >
                <UserPlus size={18} />
                {isSubmitting ? "Creating..." : "Create account"}
              </button>
            </form>
          </section>

          {/* Account list */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-500/15 p-3 text-blue-400">
                  <Users size={22} />
                </div>

                <div>
                  <h3 className="text-lg font-bold">
                    Managed accounts
                  </h3>
                  <p className="text-sm text-slate-400">
                    Staff and Parent users
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={refreshAccounts}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm transition hover:bg-slate-800"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>

            {accounts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-700 px-5 py-14 text-center">
                <Users
                  size={38}
                  className="mx-auto mb-4 text-slate-600"
                />

                <h4 className="font-semibold">
                  No managed accounts yet
                </h4>

                <p className="mt-2 text-sm text-slate-400">
                  Create a Staff or Parent account using the form.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="px-3 py-4 font-medium">User</th>
                      <th className="px-3 py-4 font-medium">Role</th>
                      <th className="px-3 py-4 font-medium">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {accounts.map((account) => (
                      <tr
                        key={account.id}
                        className="border-b border-slate-800/70 last:border-0"
                      >
                        <td className="px-3 py-4">
                          <p className="font-semibold">
                            {account.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {account.email}
                          </p>
                        </td>

                        <td className="px-3 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              account.role === "Staff"
                                ? "bg-blue-500/15 text-blue-300"
                                : "bg-amber-500/15 text-amber-300"
                            }`}
                          >
                            {account.role}
                          </span>
                        </td>

                        <td className="px-3 py-4">
                          <button
                            type="button"
                            onClick={() => handleDelete(account)}
                            aria-label={`Delete ${account.name}`}
                            className="rounded-lg p-2 text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}