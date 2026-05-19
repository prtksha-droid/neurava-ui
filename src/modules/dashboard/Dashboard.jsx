import { useState } from "react";
import NeuravaShell from "../../components/layout/NeuravaShell";
import Badge from "../../components/ui/Badge";

function getRiskLevel(score = 0) {
  if (score >= 90) return "CRITICAL";
  if (score >= 70) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "LOW";
}

export default function Dashboard({
  logs,
  exportLogs,
  resetLogs,
  policies,
  user,
  active,
  setActive,
  logout,
}) {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [dpdpEvents, setDpdpEvents] = useState([]);

  const safeLogs = Array.isArray(logs) ? logs : [];
  const safePolicies = Array.isArray(policies) ? policies : [];
  useEffect(() => {
  const fetchDpdpEvents = async () => {
    try {
      const token =
        localStorage.getItem("neuravaToken") ||
        localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/dpdp-observability",
        {
          headers: {
            Authorization: token
              ? `Bearer ${token}`
              : "",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setDpdpEvents(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(
        "Failed to fetch DPDP events:",
        err
      );
    }
  };

  fetchDpdpEvents();
}, []);

  const filteredLogs = safeLogs.filter((log) => {
    const matchesFilter = filter === "ALL" || log.decision === filter;
    const matchesSearch = log.prompt
      ?.toLowerCase()
      .includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const highRiskCount = safeLogs.filter((l) => l.riskScore >= 70).length;
  const criticalCount = safeLogs.filter((l) => l.riskScore >= 90).length;

  const modelUsage = {};

  safeLogs.forEach((log) => {
    const model = log.primaryModel || "unknown";
    modelUsage[model] = (modelUsage[model] || 0) + 1;
  });

  const topModel =
    Object.keys(modelUsage).sort((a, b) => modelUsage[b] - modelUsage[a])[0] ||
    "N/A";

  const activePolicyCount = safePolicies.filter((p) => p.enabled).length;
  const consentViolations = dpdpEvents.filter(
  (event) => event.eventType === "CONSENT_VIOLATION"
).length;

const piiDetections = dpdpEvents.filter(
  (event) => event.eventType === "PII_DETECTED"
).length;

const criticalDpdpEvents = dpdpEvents.filter(
  (event) => event.severity === "CRITICAL"
).length;

const openDpdpIncidents = dpdpEvents.filter(
  (event) => event.status === "OPEN"
).length;

const dpdpComplianceScore = Math.max(
  0,
  100 -
    criticalDpdpEvents * 15 -
    consentViolations * 10 -
    openDpdpIncidents * 5
);

  return (
    <NeuravaShell
      active={active}
      setActive={setActive}
      user={user}
      logout={logout}
      subtitle="Monitor requests, risk levels, policy decisions, and AI audit activity."
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-[30px] font-black leading-tight tracking-tight">
              Control Tower
            </h2>
            <p className="mt-2 text-slate-500">
              Monitor requests, risk levels, policy decisions, and AI audit
              activity.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={exportLogs}
              className="rounded-lg bg-black px-4 py-2 text-sm text-white"
            >
              Export Audit Report
            </button>

            {user?.role === "ADMIN" && (
              <button
                onClick={resetLogs}
                className="rounded-lg border bg-white px-4 py-2 text-sm text-slate-600"
              >
                Reset Logs
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Requests</p>
            <p className="mt-2 text-3xl font-semibold">{safeLogs.length}</p>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Blocked</p>
            <p className="mt-2 text-3xl font-semibold">
              {safeLogs.filter((l) => l.decision === "BLOCK").length}
            </p>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Rewritten</p>
            <p className="mt-2 text-3xl font-semibold">
              {safeLogs.filter((l) => l.decision === "REWRITE").length}
            </p>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Avg Risk</p>
            <p className="mt-2 text-3xl font-semibold">
              {safeLogs.length
                ? Math.round(
                    safeLogs.reduce(
                      (sum, l) => sum + (l.riskScore || 0),
                      0
                    ) / safeLogs.length
                  )
                : 0}
              %
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">High Risk Events</p>
            <p className="mt-2 text-3xl font-semibold">{highRiskCount}</p>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Critical Events</p>
            <p className="mt-2 text-3xl font-semibold">{criticalCount}</p>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
  <div className="flex items-start justify-between">
    <div>
      <p className="text-sm text-slate-500">
        DPDP Compliance
      </p>

      <p className="mt-2 text-3xl font-semibold">
        {dpdpComplianceScore}%
      </p>
    </div>

    <div
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        dpdpComplianceScore >= 80
          ? "bg-green-100 text-green-700"
          : dpdpComplianceScore >= 60
          ? "bg-yellow-100 text-yellow-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {dpdpComplianceScore >= 80
        ? "Compliant"
        : dpdpComplianceScore >= 60
        ? "Review"
        : "Critical"}
    </div>
  </div>

  <div className="mt-4 space-y-2 text-sm">
    <div className="flex items-center justify-between">
      <span className="text-slate-500">
        PII Detections
      </span>

      <span className="font-medium">
        {piiDetections}
      </span>
    </div>

    <div className="flex items-center justify-between">
      <span className="text-slate-500">
        Consent Violations
      </span>

      <span className="font-medium">
        {consentViolations}
      </span>
    </div>

    <div className="flex items-center justify-between">
      <span className="text-slate-500">
        Open Incidents
      </span>

      <span className="font-medium">
        {openDpdpIncidents}
      </span>
    </div>

    <div className="flex items-center justify-between">
      <span className="text-slate-500">
        Critical Events
      </span>

      <span className="font-medium">
        {criticalDpdpEvents}
      </span>
    </div>
  </div>
</div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Active Policies</p>
            <p className="mt-2 text-3xl font-semibold">
              {activePolicyCount}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {["ALL", "ALLOW", "FLAG", "REWRITE", "BLOCK"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`rounded-lg px-3 py-2 text-sm ${
                filter === item
                  ? "bg-black text-white"
                  : "border bg-white text-slate-600"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search prompts..."
          className="w-full rounded-xl border bg-white px-4 py-3 outline-none"
        />

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Live AI Stream</h3>

          <div className="mt-4 space-y-3">
            {filteredLogs.length === 0 ? (
              <p className="text-sm text-slate-500">
                No logs found. Send a message from Chat Layer first.
              </p>
            ) : (
              filteredLogs.map((log, index) => (
                <div
                  key={log._id || log.id || index}
                  className="rounded-xl border bg-slate-50 p-4"
                >
                  <p className="font-medium">{log.prompt}</p>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                    <span>Risk: {log.riskScore}%</span>
                    <Badge type={log.decision}>
                      Decision: {log.decision}
                    </Badge>
                    <Badge>Mode: {log.mode || "safe"}</Badge>
                    <Badge>Model: {log.primaryModel || "gpt-4.1"}</Badge>
                    <Badge>Severity: {getRiskLevel(log.riskScore)}</Badge>
                    <Badge>Policies: {log.policies?.length || 0}</Badge>
                    <Badge>
                      Consent: {log.consentAccepted ? "Accepted" : "Missing"}
                    </Badge>
                  </div>

                  {log.policies?.length > 0 && (
                    <div className="mt-3 rounded-xl bg-white p-3">
                      <p className="text-xs font-medium text-slate-500">
                        Active Policies
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {log.policies.map((policy) => (
                          <Badge key={policy}>{policy}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </NeuravaShell>
  );
}