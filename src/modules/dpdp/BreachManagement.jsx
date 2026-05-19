import { useEffect, useState } from "react";
import NeuravaShell from "../../components/layout/NeuravaShell";
import Badge from "../../components/ui/Badge";

function getSeverityColor(severity) {
  switch (severity) {
    case "CRITICAL":
      return "bg-red-100 text-red-700";

    case "HIGH":
      return "bg-orange-100 text-orange-700";

    case "MEDIUM":
      return "bg-yellow-100 text-yellow-700";

    default:
      return "bg-green-100 text-green-700";
  }
}

export default function BreachManagement({
  active,
  setActive,
  user,
  logout,
}) {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
const [selectedIncident, setSelectedIncident] = useState(null);

  const [form, setForm] = useState({
    incidentTitle: "",
    incidentType: "PII_EXPOSURE",
    severity: "MEDIUM",
    impactedSystems: [],
    impactedData: [],
    estimatedAffectedUsers: 0,
    rootCause: "",
    remediationActions: "",
  });

  const token =
    localStorage.getItem("neuravaToken") ||
    localStorage.getItem("token");

  const fetchIncidents = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/breach-incidents",
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      const data = await res.json();

      setIncidents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch breach incidents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const createIncident = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:5000/api/breach-incidents",
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
        setIncidents((prev) => [data, ...prev]);

        setForm({
          incidentTitle: "",
          incidentType: "PII_EXPOSURE",
          severity: "MEDIUM",
          impactedSystems: [],
          impactedData: [],
          estimatedAffectedUsers: 0,
          rootCause: "",
          remediationActions: "",
        });
      }
    } catch (err) {
      console.error("Failed to create breach incident:", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/breach-incidents/${id}/status`,
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
        setIncidents((prev) =>
          prev.map((item) =>
            item._id === id ? updated : item
          )
        );
      }
    } catch (err) {
      console.error("Failed to update incident:", err);
    }
  };

  const criticalIncidents = incidents.filter(
    (i) => i.severity === "CRITICAL"
  ).length;

  const openIncidents = incidents.filter(
    (i) => i.status === "OPEN"
  ).length;

  const regulatorNotifications = incidents.filter(
    (i) => i.regulatorNotified
  ).length;

  return (
    <NeuravaShell
      active={active}
      setActive={setActive}
      user={user}
      logout={logout}
      title=""
      subtitle="Manage DPDP breach incidents, regulator notifications, remediation, and enterprise privacy response workflows."
    >
      <div>
        <h2 className="text-[30px] font-black">
          Breach Management
        </h2>

        <p className="mt-2 text-slate-500">
          Track privacy incidents, regulator notifications,
          remediation actions, and enterprise breach workflows.
        </p>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Incidents
          </p>

          <p className="mt-3 text-4xl font-black">
            {incidents.length}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Open Incidents
          </p>

          <p className="mt-3 text-4xl font-black">
            {openIncidents}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Critical
          </p>

          <p className="mt-3 text-4xl font-black">
            {criticalIncidents}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Regulator Notified
          </p>

          <p className="mt-3 text-4xl font-black">
            {regulatorNotifications}
          </p>
        </div>
      </div>

      <form
        onSubmit={createIncident}
        className="mt-6 rounded-2xl border bg-white p-5 shadow-sm"
      >
        <h3 className="text-lg font-black">
          Create Breach Incident
        </h3>

        <div className="mt-4 grid gap-4 md:grid-cols-2">

          <input
            value={form.incidentTitle}
            onChange={(e) =>
              setForm({
                ...form,
                incidentTitle: e.target.value,
              })
            }
            placeholder="Incident title"
            className="rounded-xl border px-4 py-3"
            required
          />

          <select
            value={form.incidentType}
            onChange={(e) =>
              setForm({
                ...form,
                incidentType: e.target.value,
              })
            }
            className="rounded-xl border px-4 py-3"
          >
            <option value="DATA_LEAK">Data Leak</option>
            <option value="UNAUTHORIZED_ACCESS">
              Unauthorized Access
            </option>
            <option value="PII_EXPOSURE">
              PII Exposure
            </option>
            <option value="MODEL_LEAKAGE">
              Model Leakage
            </option>
            <option value="CONSENT_VIOLATION">
              Consent Violation
            </option>
            <option value="OTHER">Other</option>
          </select>

          <select
            value={form.severity}
            onChange={(e) =>
              setForm({
                ...form,
                severity: e.target.value,
              })
            }
            className="rounded-xl border px-4 py-3"
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>

          <input
            type="number"
            value={form.estimatedAffectedUsers}
            onChange={(e) =>
              setForm({
                ...form,
                estimatedAffectedUsers: Number(
                  e.target.value
                ),
              })
            }
            placeholder="Affected users"
            className="rounded-xl border px-4 py-3"
          />

          <input
            value={form.impactedSystems.join(", ")}
            onChange={(e) =>
              setForm({
                ...form,
                impactedSystems: e.target.value
                  .split(",")
                  .map((v) => v.trim()),
              })
            }
            placeholder="Impacted systems"
            className="rounded-xl border px-4 py-3"
          />

          <input
            value={form.impactedData.join(", ")}
            onChange={(e) =>
              setForm({
                ...form,
                impactedData: e.target.value
                  .split(",")
                  .map((v) => v.trim()),
              })
            }
            placeholder="Impacted data"
            className="rounded-xl border px-4 py-3"
          />

          <textarea
            value={form.rootCause}
            onChange={(e) =>
              setForm({
                ...form,
                rootCause: e.target.value,
              })
            }
            placeholder="Root cause"
            rows="4"
            className="rounded-xl border px-4 py-3"
          />

          <textarea
            value={form.remediationActions}
            onChange={(e) =>
              setForm({
                ...form,
                remediationActions: e.target.value,
              })
            }
            placeholder="Remediation actions"
            rows="4"
            className="rounded-xl border px-4 py-3"
          />

        </div>

        <button className="mt-5 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white">
          Create Incident
        </button>
      </form>

      <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
        <h3 className="text-lg font-black">
          Incident Register
        </h3>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead>
              <tr className="border-b text-xs uppercase text-slate-500">
                <th className="py-3">Incident</th>
                <th className="py-3">Type</th>
                <th className="py-3">Severity</th>
                <th className="py-3">Affected Users</th>
                <th className="py-3">Status</th>
                <th className="py-3">Regulator</th>
              </tr>
            </thead>

            <tbody>
              {incidents.map((incident) => (
                <tr
  key={incident._id}
  onClick={() => setSelectedIncident(incident)}
  className="cursor-pointer border-b transition hover:bg-slate-50"
>
                  <td className="py-3 font-semibold">
                    {incident.incidentTitle}
                  </td>

                  <td className="py-3">
                    {incident.incidentType}
                  </td>

                  <td className="py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getSeverityColor(
                        incident.severity
                      )}`}
                    >
                      {incident.severity}
                    </span>
                  </td>

                  <td className="py-3">
                    {incident.estimatedAffectedUsers}
                  </td>

                  <td className="py-3">
                    <select
                      value={incident.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateStatus(
                          incident._id,
                          e.target.value
                        )
                      }
                      className="rounded-lg border px-3 py-2"
                    >
                      <option value="OPEN">
                        OPEN
                      </option>

                      <option value="UNDER_INVESTIGATION">
                        UNDER_INVESTIGATION
                      </option>

                      <option value="CONTAINED">
                        CONTAINED
                      </option>

                      <option value="RESOLVED">
                        RESOLVED
                      </option>
                    </select>
                  </td>

                  <td className="py-3">
                    <Badge>
                      {incident.regulatorNotified
                        ? "Notified"
                        : "Pending"}
                    </Badge>
                  </td>
                </tr>
              ))}

              {!incidents.length && (
                <tr>
                  <td
                    colSpan="6"
                    className="py-6 text-center text-slate-500"
                  >
                    {loading
                      ? "Loading incidents..."
                      : "No incidents found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {selectedIncident && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
    <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black">
            Breach Incident Details
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {selectedIncident.incidentTitle}
          </p>
        </div>

        <button
          onClick={() => setSelectedIncident(null)}
          className="rounded-xl border px-4 py-2 text-sm hover:bg-slate-100"
        >
          Close
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Incident Type</p>
          <p className="mt-2 font-semibold">{selectedIncident.incidentType}</p>
        </div>

        <div className="rounded-2xl border bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Severity</p>
          <p className="mt-2 font-semibold">{selectedIncident.severity}</p>
        </div>

        <div className="rounded-2xl border bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Status</p>
          <p className="mt-2 font-semibold">{selectedIncident.status}</p>
        </div>

        <div className="rounded-2xl border bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Affected Users</p>
          <p className="mt-2 font-semibold">
            {selectedIncident.estimatedAffectedUsers}
          </p>
        </div>

        <div className="rounded-2xl border bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Impacted Systems</p>
          <p className="mt-2 font-semibold">
            {selectedIncident.impactedSystems?.join(", ") || "N/A"}
          </p>
        </div>

        <div className="rounded-2xl border bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Impacted Data</p>
          <p className="mt-2 font-semibold">
            {selectedIncident.impactedData?.join(", ") || "N/A"}
          </p>
        </div>

        <div className="rounded-2xl border bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Regulator Notified</p>
          <p className="mt-2 font-semibold">
            {selectedIncident.regulatorNotified ? "Yes" : "No"}
          </p>
        </div>

        <div className="rounded-2xl border bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Customer Notified</p>
          <p className="mt-2 font-semibold">
            {selectedIncident.customerNotified ? "Yes" : "No"}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Root Cause</p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
            {selectedIncident.rootCause || "No root cause recorded."}
          </p>
        </div>

        <div className="rounded-2xl border bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Remediation Actions</p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
            {selectedIncident.remediationActions || "No remediation recorded."}
          </p>
        </div>
      </div>
    </div>
  </div>
)}
    </NeuravaShell>
  );
}