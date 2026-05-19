import { useState } from "react";
import { Shield, FileCheck } from "lucide-react";
import NeuravaShell from "../../components/layout/NeuravaShell";

export default function Guardrails({
  policies,
  setPolicies,
  logs,
  active,
  setActive,
  user,
  logout,
}) {
  const [policySearch, setPolicySearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [showPolicyLibrary, setShowPolicyLibrary] = useState(false);
  const [showCreatePolicy, setShowCreatePolicy] = useState(false);
  const [newPolicyName, setNewPolicyName] = useState("");

  const safePolicies = Array.isArray(policies) ? policies : [];
  const safeLogs = Array.isArray(logs) ? logs : [];

  const activePolicies = safePolicies.filter((p) => p.enabled);
  const blockedResponses = safeLogs.filter((log) => log.decision === "BLOCK");
  const flaggedResponses = safeLogs.filter(
    (log) =>
      log.decision === "FLAG" ||
      log.decision === "REWRITE" ||
      log.riskScore >= 70
  );

  const policyCoverage = safePolicies.length
    ? Math.round((activePolicies.length / safePolicies.length) * 100)
    : 0;

  const togglePolicy = (id) => {
    setPolicies((prev) =>
      prev.map((policy) =>
        policy.id === id ? { ...policy, enabled: !policy.enabled } : policy
      )
    );
  };

  const getPolicyMeta = (policyName = "") => {
    const name = policyName.toLowerCase();

    if (name.includes("fabricated")) {
      return {
        icon: <Shield size={24} />,
        category: "Safety",
        impact: "High Impact",
        iconBg: "bg-violet-100 text-violet-700",
        categoryBg: "bg-violet-50 text-violet-700",
        impactBg: "bg-red-50 text-red-700",
      };
    }

    if (name.includes("unsupported") || name.includes("claim")) {
      return {
        icon: "✎",
        category: "Accuracy",
        impact: "Medium Impact",
        iconBg: "bg-blue-100 text-blue-700",
        categoryBg: "bg-blue-50 text-blue-700",
        impactBg: "bg-orange-50 text-orange-700",
      };
    }

    if (name.includes("risk")) {
      return {
        icon: "⚑",
        category: "Risk",
        impact: "High Impact",
        iconBg: "bg-orange-100 text-orange-700",
        categoryBg: "bg-orange-50 text-orange-700",
        impactBg: "bg-red-50 text-red-700",
      };
    }

    if (
      name.includes("sensitive") ||
      name.includes("credential") ||
      name.includes("leakage")
    ) {
      return {
        icon: "▣",
        category: "Privacy",
        impact: "High Impact",
        iconBg: "bg-violet-100 text-violet-700",
        categoryBg: "bg-violet-50 text-violet-700",
        impactBg: "bg-red-50 text-red-700",
      };
    }

    if (
      name.includes("harmful") ||
      name.includes("extremist") ||
      name.includes("unsafe")
    ) {
      return {
        icon: "!",
        category: "Security",
        impact: "High Impact",
        iconBg: "bg-red-100 text-red-700",
        categoryBg: "bg-red-50 text-red-700",
        impactBg: "bg-red-50 text-red-700",
      };
    }

    if (name.includes("prompt injection")) {
      return {
        icon: "⌘",
        category: "Injection",
        impact: "High Impact",
        iconBg: "bg-purple-100 text-purple-700",
        categoryBg: "bg-purple-50 text-purple-700",
        impactBg: "bg-red-50 text-red-700",
      };
    }

    return {
      icon: <Shield size={24} />,
      category: "General",
      impact: "Medium Impact",
      iconBg: "bg-blue-100 text-blue-700",
      categoryBg: "bg-blue-50 text-blue-700",
      impactBg: "bg-orange-50 text-orange-700",
    };
  };

  const filteredPolicies = safePolicies.filter((policy) => {
    const meta = getPolicyMeta(policy.name);

    const matchesSearch = policy.name
      ?.toLowerCase()
      .includes(policySearch.toLowerCase());

    const matchesType = typeFilter === "ALL" || meta.category === typeFilter;

    return matchesSearch && matchesType;
  });

  const statCards = [
    {
      title: "Active Policies",
      value: activePolicies.length,
      subtitle: "All systems protected",
      icon: <Shield size={28} />,
      iconClass: "bg-violet-100 text-violet-700",
    },
    {
      title: "Blocked Responses",
      value: blockedResponses.length,
      subtitle: "From audit logs",
      icon: "!",
      iconClass: "bg-red-100 text-red-700",
    },
    {
      title: "Flagged Responses",
      value: flaggedResponses.length,
      subtitle: "High-risk responses",
      icon: "⚑",
      iconClass: "bg-orange-100 text-orange-700",
    },
    {
      title: "Policy Coverage",
      value: `${policyCoverage}%`,
      subtitle: "Across all systems",
      icon: <Shield size={28} />,
      iconClass: "bg-blue-100 text-blue-700",
    },
  ];

  return (
    <NeuravaShell
      active={active}
      setActive={setActive}
      user={user}
      logout={logout}
      subtitle="Monitor and enforce AI safety, reliability, and compliance policies across your systems."
    >
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-[30px] font-black leading-tight tracking-tight">
            Guardrails Engine
          </h2>
          <p className="mt-2 max-w-3xl text-base leading-7 text-slate-500">
            Monitor and enforce AI safety, reliability, and compliance policies
            across your systems.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <button
            onClick={() => setShowPolicyLibrary(!showPolicyLibrary)}
            className="flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-5 py-3 text-sm"
          >
            <FileCheck size={18} />
            {showPolicyLibrary ? "Hide Library" : "Policy Library"}
          </button>

          <button
            onClick={() => setShowCreatePolicy(true)}
            className="rounded-xl bg-gradient-to-r from-violet-700 to-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-blue-100"
          >
            + Create Policy
          </button>
        </div>
      </div>

      {showPolicyLibrary && (
        <section className="mt-6 rounded-3xl border border-violet-100 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold">Policy Library</h3>
          <p className="mt-2 text-sm text-slate-500">
            Available Neurava policy templates.
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {safePolicies.map((policy) => (
              <div
                key={policy.id}
                className="rounded-2xl border bg-slate-50 p-4"
              >
                <p className="font-semibold">{policy.name}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {policy.enabled ? "Enabled" : "Disabled"}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {showCreatePolicy && (
        <section className="mt-6 rounded-3xl border border-violet-100 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold">Create Policy</h3>

          <div className="mt-4 flex gap-3">
            <input
              value={newPolicyName}
              onChange={(e) => setNewPolicyName(e.target.value)}
              placeholder="Enter policy name..."
              className="flex-1 rounded-2xl border px-5 py-4 outline-none"
            />

            <button
              onClick={() => {
                if (!newPolicyName.trim()) return;

                setPolicies((prev) => [
                  ...prev,
                  {
                    id: Date.now(),
                    name: newPolicyName,
                    enabled: true,
                  },
                ]);

                setNewPolicyName("");
                setShowCreatePolicy(false);
              }}
              className="rounded-2xl bg-black px-6 py-4 font-semibold text-white"
            >
              Save Policy
            </button>

            <button
              onClick={() => setShowCreatePolicy(false)}
              className="rounded-2xl border px-6 py-4 font-semibold text-slate-600"
            >
              Cancel
            </button>
          </div>
        </section>
      )}

      <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xl font-semibold text-slate-700">
                  {stat.title}
                </p>
                <p className="mt-4 text-4xl font-black tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-4 text-base text-slate-500">
                  {stat.subtitle}
                </p>
              </div>

              <div
                className={`flex h-16 w-16 items-center justify-center rounded-3xl text-3xl ${stat.iconClass}`}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h3 className="text-2xl font-black tracking-tight">
              Active Policies ({activePolicies.length})
            </h3>
            <p className="mt-3 text-base text-slate-500">
              Policies that are currently enabled and enforcing guardrails
              across your AI systems.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-4">
            <input
              value={policySearch}
              onChange={(e) => setPolicySearch(e.target.value)}
              placeholder="Search policies..."
              className="h-14 w-72 rounded-2xl border border-slate-200 bg-[#f8f9fd] px-5 text-base outline-none"
            />

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-14 w-44 rounded-2xl border border-slate-200 bg-[#f8f9fd] px-5 text-base outline-none"
            >
              <option value="ALL">All Types</option>
              <option value="Safety">Safety</option>
              <option value="Accuracy">Accuracy</option>
              <option value="Risk">Risk</option>
              <option value="Privacy">Privacy</option>
              <option value="Security">Security</option>
              <option value="Injection">Injection</option>
              <option value="General">General</option>
            </select>
          </div>
        </div>

        <div className="mt-7 overflow-hidden rounded-3xl border border-slate-200">
          {filteredPolicies.length === 0 ? (
            <div className="p-6 text-slate-500">
              No policies match your search.
            </div>
          ) : (
            filteredPolicies.map((policy, index) => {
              const meta = getPolicyMeta(policy.name);

              return (
                <div
                  key={policy.id}
                  className={`grid grid-cols-[1fr_auto_auto_auto] items-center gap-8 bg-white px-6 py-5 ${
                    index !== filteredPolicies.length - 1
                      ? "border-b border-slate-100"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-3xl text-2xl font-bold ${meta.iconBg}`}
                    >
                      {meta.icon}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="text-lg font-bold">{policy.name}</h4>

                        <span
                          className={`rounded-lg px-3 py-1 text-xs font-semibold ${meta.categoryBg}`}
                        >
                          {meta.category}
                        </span>

                        <span
                          className={`rounded-lg px-3 py-1 text-xs font-semibold ${meta.impactBg}`}
                        >
                          {meta.impact}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-slate-500">
                        AI safety enforcement rule
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => togglePolicy(policy.id)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      policy.enabled
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {policy.enabled ? "✓ Enabled" : "Disabled"}
                  </button>

                  <p className="whitespace-nowrap text-sm text-slate-500">
                    Updated recently
                  </p>

                  <button className="text-2xl text-slate-400">⋮</button>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing {filteredPolicies.length} of {safePolicies.length} policies
          </p>

          <div className="flex items-center gap-3">
            <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-500">
              ‹
            </button>
            <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-300 bg-violet-50 font-semibold text-violet-700">
              1
            </button>
            <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-500">
              ›
            </button>
          </div>
        </div>
      </section>
    </NeuravaShell>
  );
}