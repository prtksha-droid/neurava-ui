import { useEffect, useState } from "react";
import NeuravaShell from "../../components/layout/NeuravaShell";
import Badge from "../../components/ui/Badge";

function getRiskLevel(score = 0) {
  if (score >= 90) return "CRITICAL";
  if (score >= 70) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "LOW";
}

function formatDate(date) {
  if (!date) return "N/A";

  try {
    return new Date(date).toLocaleString();
  } catch {
    return "N/A";
  }
}

export default function Observability({
  logs,
  active,
  setActive,
  user,
  logout,
}) {
  const safeLogs = Array.isArray(logs) ? logs : [];

  const [dpdpEvents, setDpdpEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchDpdpEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
  localStorage.getItem("neuravaToken") ||
  localStorage.getItem("token") ||
  localStorage.getItem("authToken") ||
  localStorage.getItem("accessToken") ||
  localStorage.getItem("jwt");

        const response = await fetch(
          "http://localhost:5000/api/dpdp-observability",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              data?.message ||
              "Failed to fetch DPDP observability events"
          );
        }

        setDpdpEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError(
          err.message || "Failed to fetch DPDP observability events"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDpdpEvents();
  }, []);

  const latestEvent = dpdpEvents[0];

  const totalEvents = dpdpEvents.length;

  const highRiskEvents = dpdpEvents.filter(
    (event) => (event.riskScore || 0) >= 70
  ).length;

  const openIncidents = dpdpEvents.filter(
    (event) => event.status === "OPEN"
  ).length;

  const piiDetections = dpdpEvents.filter(
    (event) => event.eventType === "PII_DETECTED"
  ).length;
  
  const consentViolations = dpdpEvents.filter(
  (event) => event.eventType === "CONSENT_VIOLATION"
).length;

const providerFailures = dpdpEvents.filter(
  (event) => event.source === "AI_CHAT_ERROR"
).length;

const criticalIncidents = dpdpEvents.filter(
  (event) => event.severity === "CRITICAL"
).length;

const resolvedIncidents = dpdpEvents.filter(
  (event) => event.status === "RESOLVED"
).length;
  
  const updateEventStatus = async (eventId, status) => {
  try {
    const token =
      localStorage.getItem("neuravaToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("jwt");

    const response = await fetch(
      `http://localhost:5000/api/dpdp-observability/${eventId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update event status");
    }

    const updatedEvent = await response.json();

    setDpdpEvents((prev) =>
      prev.map((event) =>
        event._id === eventId ? updatedEvent : event
      )
    );
  } catch (err) {
    console.error(err);
    alert("Failed to update event status");
  }
};

const filteredEvents = dpdpEvents.filter((event) => {
  const matchesStatus =
    statusFilter === "ALL" || event.status === statusFilter;

  const matchesSeverity =
    severityFilter === "ALL" || event.severity === severityFilter;

  const text = [
    event.eventType,
    event.severity,
    event.status,
    event.source,
    event.modelName,
    event.consentStatus,
    event.promptSnippet,
    event.responseSnippet,
    ...(event.detectedDataTypes || []),
  ]
    .join(" ")
    .toLowerCase();

  const matchesSearch =
    !searchTerm || text.includes(searchTerm.toLowerCase());

  return matchesStatus && matchesSeverity && matchesSearch;
});
  return (
    <NeuravaShell
      active={active}
      setActive={setActive}
      user={user}
      logout={logout}
      title=""
      subtitle="Monitor AI privacy risks, PII exposure, consent violations, runtime compliance events, and sensitive data activity across AI systems."
    >
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-[30px] font-black leading-tight tracking-tight">
            DPDP Observability
          </h2>

          <p className="mt-2 max-w-3xl text-base leading-7 text-slate-500">
            Monitor AI privacy risks, PII exposure, consent violations,
            runtime compliance events, and sensitive data activity across
            AI systems.
          </p>
        </div>

        {loading && <Badge>Loading...</Badge>}
      </div>

      {error && (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 grid gap-5 md:grid-cols-4 xl:grid-cols-8">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total DPDP Events
          </p>

          <p className="mt-3 text-4xl font-black">
            {totalEvents}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            High Risk Events
          </p>

          <p className="mt-3 text-4xl font-black">
            {highRiskEvents}
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
            PII Detections
          </p>

          <p className="mt-3 text-4xl font-black">
            {piiDetections}
          </p>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
  <p className="text-sm text-slate-500">
    Consent Violations
  </p>

  <p className="mt-3 text-4xl font-black">
    {consentViolations}
  </p>
</div>

<div className="rounded-2xl border bg-white p-5 shadow-sm">
  <p className="text-sm text-slate-500">
    Provider Failures
  </p>

  <p className="mt-3 text-4xl font-black">
    {providerFailures}
  </p>
</div>

<div className="rounded-2xl border bg-white p-5 shadow-sm">
  <p className="text-sm text-slate-500">
    Critical Incidents
  </p>

  <p className="mt-3 text-4xl font-black">
    {criticalIncidents}
  </p>
</div>

<div className="rounded-2xl border bg-white p-5 shadow-sm">
  <p className="text-sm text-slate-500">
    Resolved Incidents
  </p>

  <p className="mt-3 text-4xl font-black">
    {resolvedIncidents}
  </p>
</div>
      </div>

      {!latestEvent ? (
        <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            No DPDP observability events yet.
          </p>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black">
              Latest DPDP Event
            </h3>

            <Badge>{latestEvent.eventType}</Badge>
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            <div className="rounded-xl border bg-slate-50 p-4">
              <p className="text-xs text-slate-500">
                Prompt Snippet
              </p>

              <p className="mt-2 text-sm leading-6">
                {latestEvent.promptSnippet ||
                  "No prompt snippet"}
              </p>
            </div>

            <div className="rounded-xl border bg-slate-50 p-4">
              <p className="text-xs text-slate-500">
                Response Snippet
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                {latestEvent.responseSnippet ||
                  "No response snippet"}
              </p>
            </div>

            <div className="rounded-xl border bg-slate-50 p-4">
              <p className="text-xs text-slate-500">
                Detected Sensitive Data
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {latestEvent.detectedDataTypes?.length ? (
                  latestEvent.detectedDataTypes.map((type) => (
                    <Badge key={type}>{type}</Badge>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    No sensitive data detected.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-xl border bg-slate-50 p-4">
              <p className="text-xs text-slate-500">
                Runtime Metadata
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <Badge>
                  Severity: {latestEvent.severity}
                </Badge>

                <Badge>
                  Risk: {latestEvent.riskScore}/100
                </Badge>

                <Badge>
                  Risk Level:{" "}
                  {getRiskLevel(latestEvent.riskScore)}
                </Badge>

                <Badge>
                  Consent: {latestEvent.consentStatus}
                </Badge>

                <Badge>
                  Source: {latestEvent.source}
                </Badge>

                <Badge>
                  Model: {latestEvent.modelName}
                </Badge>

                <Badge>
                  Status: {latestEvent.status}
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-xl border bg-slate-50 p-4">
            <p className="text-xs text-slate-500">
              Compliance Metadata
            </p>

            <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
              <div>
                <p className="text-slate-500">Provider</p>

                <p className="font-semibold">
                  {latestEvent.metadata?.provider || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-slate-500">Mode</p>

                <p className="font-semibold">
                  {latestEvent.metadata?.mode || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-slate-500">Decision</p>

                <p className="font-semibold">
                  {latestEvent.metadata?.decision || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-slate-500">Created At</p>

                <p className="font-semibold">
                  {formatDate(latestEvent.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
      <div className="w-full">
  <p className="mb-2 text-xs font-semibold text-slate-500">
    Search Events
  </p>

  <input
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Search PAN, PHONE, OPEN, CRITICAL, model, source..."
    className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-purple-500"
  />
</div>
        <div className="flex items-center justify-between">
        <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
  <div className="flex flex-wrap items-center gap-4">
    <div>
      <p className="mb-2 text-xs font-semibold text-slate-500">
        Status
      </p>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="rounded-xl border px-4 py-2 text-sm"
      >
        <option value="ALL">All Statuses</option>
        <option value="OPEN">Open</option>
        <option value="UNDER_REVIEW">Under Review</option>
        <option value="RESOLVED">Resolved</option>
        <option value="FALSE_POSITIVE">False Positive</option>
      </select>
    </div>

    <div>
      <p className="mb-2 text-xs font-semibold text-slate-500">
        Severity
      </p>
      <select
        value={severityFilter}
        onChange={(e) => setSeverityFilter(e.target.value)}
        className="rounded-xl border px-4 py-2 text-sm"
      >
        <option value="ALL">All Severities</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
        <option value="CRITICAL">Critical</option>
      </select>
    </div>
  </div>
</div>
          <h3 className="text-lg font-black">
            Recent DPDP Events
          </h3>

          <Badge>{filteredEvents.length} shown</Badge>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b text-xs uppercase tracking-wide text-slate-500">
                <th className="py-3 pr-4">Event</th>
                <th className="py-3 pr-4">Severity</th>
                <th className="py-3 pr-4">Risk</th>
                <th className="py-3 pr-4">PII</th>
                <th className="py-3 pr-4">Consent</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Created</th>
              </tr>
            </thead>

            <tbody>
              {filteredEvents.length ? (
  filteredEvents.map((event) => (
                  <tr
  key={event._id}
  onClick={() => setSelectedEvent(event)}
  className="cursor-pointer border-b transition hover:bg-slate-50 last:border-b-0"
>
                    <td className="py-3 pr-4 font-semibold">
                      {event.eventType}
                    </td>

                    <td className="py-3 pr-4">
                      <Badge>{event.severity}</Badge>
                    </td>

                    <td className="py-3 pr-4">
                      {event.riskScore}/100
                    </td>

                    <td className="py-3 pr-4">
                      {event.detectedDataTypes?.join(", ") ||
                        "None"}
                    </td>

                    <td className="py-3 pr-4">
                      {event.consentStatus}
                    </td>

                    <td className="py-3 pr-4">
  <select
    value={event.status}
    onChange={(e) => updateEventStatus(event._id, e.target.value)}
    className="rounded-lg border px-3 py-2 text-sm"
  >
    <option value="OPEN">OPEN</option>
    <option value="UNDER_REVIEW">UNDER_REVIEW</option>
    <option value="RESOLVED">RESOLVED</option>
    <option value="FALSE_POSITIVE">FALSE_POSITIVE</option>
  </select>
</td>

                    <td className="py-3 pr-4">
                      {formatDate(event.createdAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="py-6 text-center text-sm text-slate-500"
                  >
                    No DPDP events found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {selectedEvent && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
    <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black">
            DPDP Incident Details
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {selectedEvent.eventType}
          </p>
        </div>

        <button
          onClick={() => setSelectedEvent(null)}
          className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-slate-100"
        >
          Close
        </button>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">

        <div className="rounded-2xl border bg-slate-50 p-4">
          <p className="text-xs text-slate-500">
            Prompt Snippet
          </p>

          <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
            {selectedEvent.promptSnippet || "N/A"}
          </p>
        </div>

        <div className="rounded-2xl border bg-slate-50 p-4">
          <p className="text-xs text-slate-500">
            Response Snippet
          </p>

          <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
            {selectedEvent.responseSnippet || "N/A"}
          </p>
        </div>

        <div className="rounded-2xl border bg-slate-50 p-4">
          <p className="text-xs text-slate-500">
            Sensitive Data Types
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {selectedEvent.detectedDataTypes?.map((type) => (
              <Badge key={type}>{type}</Badge>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-slate-50 p-4">
          <p className="text-xs text-slate-500">
            Risk Details
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <Badge>
              Severity: {selectedEvent.severity}
            </Badge>

            <Badge>
              Risk: {selectedEvent.riskScore}/100
            </Badge>

            <Badge>
              Status: {selectedEvent.status}
            </Badge>

            <Badge>
              Consent: {selectedEvent.consentStatus}
            </Badge>
          </div>
        </div>

      </div>

      <div className="mt-6 rounded-2xl border bg-slate-50 p-5">
        <p className="text-xs text-slate-500">
          Compliance Metadata
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">

          <div>
            <p className="text-sm text-slate-500">
              Provider
            </p>

            <p className="font-semibold">
              {selectedEvent.metadata?.provider || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Mode
            </p>

            <p className="font-semibold">
              {selectedEvent.metadata?.mode || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Decision
            </p>

            <p className="font-semibold">
              {selectedEvent.metadata?.decision || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Created At
            </p>

            <p className="font-semibold">
              {formatDate(selectedEvent.createdAt)}
            </p>
          </div>

        </div>
      </div>

    </div>
  </div>
)}
    </NeuravaShell>
  );
}