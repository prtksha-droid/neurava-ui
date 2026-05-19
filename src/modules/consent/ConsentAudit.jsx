import { useState } from "react";
import { Shield, AlertTriangle } from "lucide-react";
import NeuravaShell from "../../components/layout/NeuravaShell";

export default function ConsentAudit({
  logs,
  active,
  setActive,
  user,
  logout,
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const safeLogs = Array.isArray(logs) ? logs : [];

  const getConsentStatus = (log) => {
    if (log.consentStatus) return log.consentStatus;
    return log.consentAccepted ? "ACCEPTED" : "MISSING";
  };

  const consentedLogs = safeLogs.filter(
    (log) => getConsentStatus(log) === "ACCEPTED"
  );

  const missingConsentLogs = safeLogs.filter(
    (log) => getConsentStatus(log) === "MISSING"
  );

  const filteredLogs = safeLogs.filter((log) => {
    const status = getConsentStatus(log);

    const matchesSearch =
      log.prompt?.toLowerCase().includes(search.toLowerCase()) ||
      log.userEmail?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (value) => {
    if (!value) return "N/A";

    return new Date(value).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (value) => {
    if (!value) return "N/A";

    return new Date(value).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <NeuravaShell
      active={active}
      setActive={setActive}
      user={user}
      logout={logout}
      subtitle="Overview of consent status and audit trail for AI requests."
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black">Consent Audit</h2>
          <p className="mt-2 text-slate-500">
            Overview of consent status and audit trail for AI requests.
          </p>
        </div>

        <button className="rounded-xl border bg-white px-5 py-3 text-sm font-bold">
          Last 7 days
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <Shield size={36} />
            </div>

            <div>
              <p className="font-bold">Consented Requests</p>
              <p className="mt-3 text-5xl font-black">
                {consentedLogs.length}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Total requests with valid consent
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-orange-600">
              <AlertTriangle size={36} />
            </div>

            <div>
              <p className="font-bold">Missing Consent</p>
              <p className="mt-3 text-5xl font-black">
                {missingConsentLogs.length}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Total requests without valid consent
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-6 rounded-3xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black">Consent Records</h3>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border bg-white px-4 py-3 text-sm font-bold"
          >
            <option value="ALL">All Status</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="MISSING">Missing</option>
            <option value="REVOKED">Revoked</option>
          </select>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by query or user..."
          className="mt-5 w-full max-w-sm rounded-xl border bg-white px-4 py-3 text-sm outline-none"
        />

        <div className="mt-6 space-y-3">
          {filteredLogs.length === 0 ? (
            <p className="rounded-2xl border bg-slate-50 p-5 text-sm text-slate-500">
              No consent records found.
            </p>
          ) : (
            filteredLogs.map((log, index) => {
              const status = getConsentStatus(log);
              const accepted = status === "ACCEPTED";

              return (
                <div
                  key={log._id || log.id || index}
                  className={`rounded-2xl border bg-white p-5 ${
                    accepted
                      ? "border-l-4 border-l-emerald-500"
                      : "border-l-4 border-l-orange-500"
                  }`}
                >
                  <div className="grid gap-5 xl:grid-cols-[1fr_240px]">
                    <div>
                      <p className="font-black">
                        {log.prompt || "Untitled AI request"}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold">
                        <span
                          className={`rounded-full px-3 py-1 ${
                            accepted
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          Consent: {accepted ? "Accepted" : "Missing"}
                        </span>

                        <span className="rounded-full bg-violet-50 px-3 py-1 text-violet-700">
                          Version: {log.consentVersion || "-"}
                        </span>

                        <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">
                          Purpose: {log.consentPurpose || "-"}
                        </span>

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                          Decision: {log.decision || "-"}
                        </span>

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                          Risk: {log.riskScore ?? "-"}%
                        </span>

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                          Mode: {log.mode || "-"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <p>📅 {formatDate(log.createdAt)}</p>
                      <p>🕒 {formatTime(log.createdAt)}</p>
                      <p>
                        👤 {log.userEmail || user?.email || "user@neurava.ai"}
                      </p>
                      <button className="text-xl font-black">...</button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
          <p>
            Showing {filteredLogs.length} of {safeLogs.length} records
          </p>

          <div className="flex gap-2">
            <button className="rounded-xl border px-4 py-2">‹</button>
            <button className="rounded-xl bg-violet-700 px-4 py-2 text-white">
              1
            </button>
            <button className="rounded-xl border px-4 py-2">›</button>
          </div>
        </div>
      </section>
    </NeuravaShell>
  );
}