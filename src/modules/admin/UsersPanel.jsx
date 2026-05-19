import { useEffect, useState } from "react";
import NeuravaShell from "../../components/layout/NeuravaShell";

export default function UsersPanel({
  token,
  active,
  setActive,
  user,
  logout,
}) {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "VIEWER",
  });
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch users", err);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const createUser = async () => {
    if (!form.fullName || !form.email || !form.password) return;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create user");
      }

      setForm({
        fullName: "",
        email: "",
        password: "",
        role: "VIEWER",
      });

      fetchUsers();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (id, role) => {
    await fetch(`http://localhost:5000/api/users/${id}/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    });

    fetchUsers();
  };

  const updateStatus = async (id, isActive) => {
    await fetch(`http://localhost:5000/api/users/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isActive }),
    });

    fetchUsers();
  };

  const activeUsers = users.filter((u) => u.isActive).length;
  const disabledUsers = users.filter((u) => !u.isActive).length;

  const adminUsers = users.filter((u) => {
    const role = String(u.role || "").toUpperCase();

    return (
      role === "ADMIN" ||
      role === "SUPER_ADMIN" ||
      role === "GOVERNMENT_ADMIN" ||
      role.includes("ADMIN")
    );
  }).length;

  return (
    <NeuravaShell
      active={active}
      setActive={setActive}
      user={user}
      logout={logout}
      subtitle="Manage Neurava users, roles, access permissions, and account activation status."
    >
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-[30px] font-black leading-tight tracking-tight">
            User Management
          </h2>
          <p className="mt-2 max-w-3xl text-base leading-7 text-slate-500">
            Manage Neurava users, roles, access permissions, and account
            activation status.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Users</p>
          <p className="mt-3 text-4xl font-black">{users.length}</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Active Users</p>
          <p className="mt-3 text-4xl font-black">{activeUsers}</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Admin Users</p>
          <p className="mt-3 text-4xl font-black">{adminUsers}</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
        <h3 className="text-lg font-black">Create New User</h3>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <input
            className="rounded-xl border px-4 py-3 outline-none"
            placeholder="Full name"
            value={form.fullName}
            onChange={(e) =>
              setForm({ ...form, fullName: e.target.value })
            }
          />

          <input
            className="rounded-xl border px-4 py-3 outline-none"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            className="rounded-xl border px-4 py-3 outline-none"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <select
            className="rounded-xl border px-4 py-3 outline-none"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="ADMIN">ADMIN</option>
            <option value="ANALYST">ANALYST</option>
            <option value="AUDITOR">AUDITOR</option>
            <option value="VIEWER">VIEWER</option>
          </select>
        </div>

        <button
          onClick={createUser}
          disabled={loading}
          className="mt-4 rounded-xl bg-violet-700 px-5 py-3 text-sm font-bold text-white disabled:bg-slate-400"
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </div>

      <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black">All Users</h3>
          <p className="text-sm text-slate-500">
            {disabledUsers} disabled accounts
          </p>
        </div>

        <div className="mt-4 space-y-3">
          {users.length === 0 ? (
            <p className="text-sm text-slate-500">No users found.</p>
          ) : (
            users.map((u) => (
              <div
                key={u.id || u._id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-slate-50 p-4"
              >
                <div>
                  <p className="font-bold">{u.fullName}</p>
                  <p className="text-sm text-slate-500">{u.email}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={u.role}
                    onChange={(e) =>
                      updateRole(u.id || u._id, e.target.value)
                    }
                    className="rounded-lg border bg-white px-3 py-2 text-sm"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="ANALYST">ANALYST</option>
                    <option value="AUDITOR">AUDITOR</option>
                    <option value="VIEWER">VIEWER</option>
                  </select>

                  <button
                    onClick={() =>
                      updateStatus(u.id || u._id, !u.isActive)
                    }
                    className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                      u.isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {u.isActive ? "Active" : "Disabled"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </NeuravaShell>
  );
}