import { useEffect, useState } from "react";
import NeuravaShell from "../../components/layout/NeuravaShell";
import Badge from "../../components/ui/Badge";

function formatDate(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString();
}

export default function DataSubjectRights({ active, setActive, user, logout }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    requestType: "ACCESS",
    requesterName: "",
    requesterEmail: "",
    description: "",
    priority: "MEDIUM",
  });

  const token =
    localStorage.getItem("neuravaToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken");

  const fetchRequests = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/data-principal-rights", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const createRequest = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/data-principal-rights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setRequests((prev) => [data, ...prev]);
        setForm({
          requestType: "ACCESS",
          requesterName: "",
          requesterEmail: "",
          description: "",
          priority: "MEDIUM",
        });
      }
    } catch (err) {
      console.error("Failed to create request:", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/data-principal-rights/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setRequests((prev) =>
          prev.map((item) => (item._id === id ? data : item))
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  return (
    <NeuravaShell
      active={active}
      setActive={setActive}
      user={user}
      logout={logout}
      title=""
      subtitle="Manage DPDP data principal requests, grievances, access, correction, erasure, and consent withdrawal workflows."
    >
      <div>
        <h2 className="text-[30px] font-black">Data Subject Rights</h2>
        <p className="mt-2 text-slate-500">
          Manage access, correction, erasure, consent withdrawal, and grievance requests.
        </p>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Requests</p>
          <p className="mt-3 text-4xl font-black">{requests.length}</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">New</p>
          <p className="mt-3 text-4xl font-black">
            {requests.filter((r) => r.status === "NEW").length}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">In Review</p>
          <p className="mt-3 text-4xl font-black">
            {requests.filter((r) => r.status === "IN_REVIEW").length}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Completed</p>
          <p className="mt-3 text-4xl font-black">
            {requests.filter((r) => r.status === "COMPLETED").length}
          </p>
        </div>
      </div>

      <form
        onSubmit={createRequest}
        className="mt-6 rounded-2xl border bg-white p-5 shadow-sm"
      >
        <h3 className="text-lg font-black">Create Data Principal Request</h3>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <select
            value={form.requestType}
            onChange={(e) =>
              setForm({ ...form, requestType: e.target.value })
            }
            className="rounded-xl border px-4 py-3"
          >
            <option value="ACCESS">Access Request</option>
            <option value="CORRECTION">Correction Request</option>
            <option value="ERASURE">Erasure Request</option>
            <option value="CONSENT_WITHDRAWAL">Consent Withdrawal</option>
            <option value="GRIEVANCE">Grievance</option>
          </select>

          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
            className="rounded-xl border px-4 py-3"
          >
            <option value="LOW">Low Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="HIGH">High Priority</option>
          </select>

          <input
            value={form.requesterName}
            onChange={(e) =>
              setForm({ ...form, requesterName: e.target.value })
            }
            placeholder="Requester name"
            className="rounded-xl border px-4 py-3"
            required
          />

          <input
            value={form.requesterEmail}
            onChange={(e) =>
              setForm({ ...form, requesterEmail: e.target.value })
            }
            placeholder="Requester email"
            className="rounded-xl border px-4 py-3"
            required
          />

          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            placeholder="Request description"
            className="rounded-xl border px-4 py-3 md:col-span-2"
            rows="4"
          />
        </div>

        <button className="mt-4 rounded-xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white">
          Submit Request
        </button>
      </form>

      <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
        <h3 className="text-lg font-black">Request Register</h3>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b text-xs uppercase text-slate-500">
                <th className="py-3">Type</th>
                <th className="py-3">Requester</th>
                <th className="py-3">Email</th>
                <th className="py-3">Priority</th>
                <th className="py-3">Status</th>
                <th className="py-3">Due Date</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((request) => (
                <tr key={request._id} className="border-b">
                  <td className="py-3 font-semibold">{request.requestType}</td>
                  <td className="py-3">{request.requesterName}</td>
                  <td className="py-3">{request.requesterEmail}</td>
                  <td className="py-3">
                    <Badge>{request.priority}</Badge>
                  </td>
                  <td className="py-3">
                    <select
                      value={request.status}
                      onChange={(e) =>
                        updateStatus(request._id, e.target.value)
                      }
                      className="rounded-lg border px-3 py-2"
                    >
                      <option value="NEW">NEW</option>
                      <option value="IN_REVIEW">IN_REVIEW</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="REJECTED">REJECTED</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </td>
                  <td className="py-3">{formatDate(request.dueDate)}</td>
                </tr>
              ))}

              {!requests.length && (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-slate-500">
                    {loading ? "Loading requests..." : "No requests found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </NeuravaShell>
  );
}