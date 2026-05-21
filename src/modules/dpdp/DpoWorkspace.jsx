import { useEffect, useState } from "react";
import NeuravaShell from "../../components/layout/NeuravaShell";
import Badge from "../../components/ui/Badge";

export default function DpoWorkspace({ active, setActive, user, logout }) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "Data Protection Officer",
    department: "Compliance",
    escalationEmail: "",
    jurisdiction: "India",
    notes: "",
  });

  const token =
    localStorage.getItem("neuravaToken") ||
    localStorage.getItem("token");

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/dpo", {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      const data = await res.json();
      setProfiles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch DPO profiles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const createProfile = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/dpo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      setProfiles((prev) => [data, ...prev]);
      setForm({
        name: "",
        email: "",
        phone: "",
        designation: "Data Protection Officer",
        department: "Compliance",
        escalationEmail: "",
        jurisdiction: "India",
        notes: "",
      });
    }
  };

  return (
    <NeuravaShell
      active={active}
      setActive={setActive}
      user={user}
      logout={logout}
      title=""
      subtitle="Manage DPO accountability, grievance escalation, and DPDP compliance ownership."
    >
      <h2 className="text-[30px] font-black">DPO Workspace</h2>

      <form onSubmit={createProfile} className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
        <h3 className="text-lg font-black">Create DPO Profile</h3>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {Object.keys(form).map((key) => (
            <input
              key={key}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              placeholder={key}
              className="rounded-xl border px-4 py-3"
            />
          ))}
        </div>

        <button className="mt-5 rounded-xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white">
          Create DPO
        </button>
      </form>

      <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
        <h3 className="text-lg font-black">DPO Register</h3>

        <div className="mt-4 space-y-3">
          {profiles.map((item) => (
            <div key={item._id} className="rounded-xl border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.email}</p>
                  <p className="text-sm text-slate-500">{item.designation}</p>
                </div>
                <Badge>{item.status}</Badge>
              </div>
            </div>
          ))}

          {!profiles.length && (
            <p className="text-sm text-slate-500">
              {loading ? "Loading..." : "No DPO profiles found."}
            </p>
          )}
        </div>
      </div>
    </NeuravaShell>
  );
}