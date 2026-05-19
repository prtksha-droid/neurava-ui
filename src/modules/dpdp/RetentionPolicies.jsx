import { useEffect, useState } from "react";
import NeuravaShell from "../../components/layout/NeuravaShell";
import Badge from "../../components/ui/Badge";

export default function RetentionPolicies({
  active,
  setActive,
  user,
  logout,
}) {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
const [selectedPolicy, setSelectedPolicy] = useState(null);
  

  const [form, setForm] = useState({
    policyName: "",
    dataCategory: "",
    retentionDays: 30,
    autoDelete: false,
    appliesTo: [],
    description: "",
  });

  const token =
    localStorage.getItem("neuravaToken") ||
    localStorage.getItem("token");

  const fetchPolicies = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/retention-policies",
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      const data = await res.json();

      setPolicies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch retention policies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const createPolicy = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:5000/api/retention-policies",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setPolicies((prev) => [data, ...prev]);

        setForm({
          policyName: "",
          dataCategory: "",
          retentionDays: 30,
          autoDelete: false,
          appliesTo: [],
          description: "",
        });
      }
    } catch (err) {
      console.error("Failed to create policy:", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/retention-policies/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ status }),
        }
      );

      const updated = await res.json();

      if (res.ok) {
        setPolicies((prev) =>
          prev.map((item) =>
            item._id === id ? updated : item
          )
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const activePolicies = policies.filter(
    (p) => p.status === "ACTIVE"
  ).length;

  const autoDeletePolicies = policies.filter(
    (p) => p.autoDelete
  ).length;

  return (
    <NeuravaShell
      active={active}
      setActive={setActive}
      user={user}
      logout={logout}
      title=""
      subtitle="Manage DPDP retention schedules, auto-deletion rules, and enterprise data lifecycle governance."
    >
      <div>
        <h2 className="text-[30px] font-black">
          Retention Policies
        </h2>

        <p className="mt-2 text-slate-500">
          Configure retention schedules, auto-deletion
          workflows, and enterprise DPDP data lifecycle rules.
        </p>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Policies
          </p>

          <p className="mt-3 text-4xl font-black">
            {policies.length}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Active Policies
          </p>

          <p className="mt-3 text-4xl font-black">
            {activePolicies}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Auto Delete Enabled
          </p>

          <p className="mt-3 text-4xl font-black">
            {autoDeletePolicies}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Avg Retention
          </p>

          <p className="mt-3 text-4xl font-black">
            {policies.length
              ? Math.round(
                  policies.reduce(
                    (sum, p) =>
                      sum + (p.retentionDays || 0),
                    0
                  ) / policies.length
                )
              : 0}
            d
          </p>
        </div>
      </div>

      <form
        onSubmit={createPolicy}
        className="mt-6 rounded-2xl border bg-white p-5 shadow-sm"
      >
        <h3 className="text-lg font-black">
          Create Retention Policy
        </h3>

        <div className="mt-4 grid gap-4 md:grid-cols-2">

          <input
            value={form.policyName}
            onChange={(e) =>
              setForm({
                ...form,
                policyName: e.target.value,
              })
            }
            placeholder="Policy name"
            className="rounded-xl border px-4 py-3"
            required
          />

          <input
            value={form.dataCategory}
            onChange={(e) =>
              setForm({
                ...form,
                dataCategory: e.target.value,
              })
            }
            placeholder="Data category"
            className="rounded-xl border px-4 py-3"
            required
          />

          <input
            type="number"
            value={form.retentionDays}
            onChange={(e) =>
              setForm({
                ...form,
                retentionDays: Number(e.target.value),
              })
            }
            placeholder="Retention days"
            className="rounded-xl border px-4 py-3"
          />

          <input
            value={form.appliesTo.join(", ")}
            onChange={(e) =>
              setForm({
                ...form,
                appliesTo: e.target.value
                  .split(",")
                  .map((v) => v.trim()),
              })
            }
            placeholder="Applies to (comma separated)"
            className="rounded-xl border px-4 py-3"
          />

          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            placeholder="Description"
            className="rounded-xl border px-4 py-3 md:col-span-2"
            rows="4"
          />

        </div>

        <label className="mt-4 flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.autoDelete}
            onChange={(e) =>
              setForm({
                ...form,
                autoDelete: e.target.checked,
              })
            }
          />

          <span className="text-sm">
            Enable automatic deletion
          </span>
        </label>

        <button className="mt-5 rounded-xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white">
          Create Policy
        </button>
      </form>

      <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
        <h3 className="text-lg font-black">
          Retention Register
        </h3>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead>
              <tr className="border-b text-xs uppercase text-slate-500">
                <th className="py-3">Policy</th>
                <th className="py-3">Category</th>
                <th className="py-3">Retention</th>
                <th className="py-3">Auto Delete</th>
                <th className="py-3">Applies To</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {policies.map((policy) => (
                <tr
  key={policy._id}
  onClick={() => setSelectedPolicy(policy)}
  className="cursor-pointer border-b transition hover:bg-slate-50"
>
                  <td className="py-3 font-semibold">
                    {policy.policyName}
                  </td>

                  <td className="py-3">
                    {policy.dataCategory}
                  </td>

                  <td className="py-3">
                    {policy.retentionDays} days
                  </td>

                  <td className="py-3">
                    <Badge>
                      {policy.autoDelete
                        ? "Enabled"
                        : "Disabled"}
                    </Badge>
                  </td>

                  <td className="py-3">
                    {policy.appliesTo?.join(", ")}
                  </td>

                  <td className="py-3">
                    <select
                      value={policy.status}
                      onChange={(e) =>
                        updateStatus(
                          policy._id,
                          e.target.value
                        )
                      }
                      className="rounded-lg border px-3 py-2"
                    >
                      <option value="ACTIVE">
                        ACTIVE
                      </option>

                      <option value="INACTIVE">
                        INACTIVE
                      </option>
                    </select>
                  </td>
                </tr>
              ))}

              {!policies.length && (
                <tr>
                  <td
                    colSpan="6"
                    className="py-6 text-center text-slate-500"
                  >
                    {loading
                      ? "Loading policies..."
                      : "No retention policies found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {selectedPolicy && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black">
            Retention Policy Details
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {selectedPolicy.policyName}
          </p>
        </div>

        <button
          onClick={() => setSelectedPolicy(null)}
          className="rounded-xl border px-4 py-2 text-sm hover:bg-slate-100"
        >
          Close
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">

        <div className="rounded-2xl border bg-slate-50 p-4">
          <p className="text-xs text-slate-500">
            Policy Name
          </p>

          <p className="mt-2 font-semibold">
            {selectedPolicy.policyName}
          </p>
        </div>

        <div className="rounded-2xl border bg-slate-50 p-4">
          <p className="text-xs text-slate-500">
            Data Category
          </p>

          <p className="mt-2 font-semibold">
            {selectedPolicy.dataCategory}
          </p>
        </div>

        <div className="rounded-2xl border bg-slate-50 p-4">
          <p className="text-xs text-slate-500">
            Retention Period
          </p>

          <p className="mt-2 font-semibold">
            {selectedPolicy.retentionDays} days
          </p>
        </div>

        <div className="rounded-2xl border bg-slate-50 p-4">
          <p className="text-xs text-slate-500">
            Auto Delete
          </p>

          <p className="mt-2 font-semibold">
            {selectedPolicy.autoDelete
              ? "Enabled"
              : "Disabled"}
          </p>
        </div>

        <div className="rounded-2xl border bg-slate-50 p-4">
          <p className="text-xs text-slate-500">
            Applies To
          </p>

          <p className="mt-2 font-semibold">
            {selectedPolicy.appliesTo?.join(", ") || "N/A"}
          </p>
        </div>

        <div className="rounded-2xl border bg-slate-50 p-4">
          <p className="text-xs text-slate-500">
            Status
          </p>

          <p className="mt-2 font-semibold">
            {selectedPolicy.status}
          </p>
        </div>

      </div>

      <div className="mt-5 rounded-2xl border bg-slate-50 p-5">
        <p className="text-xs text-slate-500">
          Description
        </p>

        <p className="mt-3 text-sm leading-6">
          {selectedPolicy.description ||
            "No description available."}
        </p>
      </div>

    </div>
  </div>
)}
    </NeuravaShell>
  );
}