import NeuravaShell from "../../components/layout/NeuravaShell";
import Badge from "../../components/ui/Badge";

function getRiskLevel(score = 0) {
  if (score >= 90) return "CRITICAL";
  if (score >= 70) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "LOW";
}

export default function AlertsCenter({
  logs,
  active,
  setActive,
  user,
  logout,
}) {
  const safeLogs = Array.isArray(logs) ? logs : [];

  const alerts = safeLogs.filter(
    (log) =>
      log.riskScore >= 70 ||
      log.decision === "BLOCK" ||
      log.source === "ATTACK_LAB"
  );

  const alertCount = alerts.length;

  return (
    <NeuravaShell
      active={active}
      setActive={setActive}
      user={user}
      logout={logout}
      subtitle="Review blocked, high-risk, and attack simulation events."
    >
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-[30px] font-black leading-tight tracking-tight">
            Alert Center
          </h2>
          <p className="mt-2 max-w-3xl text-base leading-7 text-slate-500">
            Review blocked, high-risk, and attack simulation events.
          </p>
        </div>

        <div className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
          {alertCount} Alerts
        </div>
      </div>

      <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
        {alerts.length === 0 ? (
          <p className="text-sm text-slate-500">No high-risk alerts yet.</p>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={alert._id || alert.id || index}
                className="rounded-xl border border-red-100 bg-red-50 p-4"
              >
                <p className="font-medium text-red-800">
                  {alert.prompt || "Untitled alert"}
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge type={alert.decision}>
                    Decision: {alert.decision || "FLAG"}
                  </Badge>
                  <Badge>Risk: {alert.riskScore ?? 0}%</Badge>
                  <Badge>Severity: {getRiskLevel(alert.riskScore)}</Badge>
                  <Badge>Mode: {alert.mode || "safe"}</Badge>
                  {alert.source && <Badge>Source: {alert.source}</Badge>}
                </div>

                {alert.policies?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {alert.policies.map((policy) => (
                      <Badge key={policy}>{policy}</Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </NeuravaShell>
  );
}