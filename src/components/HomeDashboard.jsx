import {
  Shield,
  AlertTriangle,
  MessageSquare,
  Eye,
  FileText,
  Bell,
  Workflow,
  Database,
  Lock,
  ChevronLeft,
  Search,
  Home,
  Settings,
  Tags,
  ShieldCheck,
  UserCheck,
  Clock,
  Plug,
  HelpCircle,
  Box,
  CheckCircle,
  Activity,
  Download,
  Plus,
  Cpu,
  ClipboardCheck,
  GitBranch,
  Users,
} from "lucide-react";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { useEffect, useState } from "react";
export default function HomeDashboard({
  active,
  setActive,
  user,
  logs = [],
  policies = [],
  logout,
}) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [dpdpEvents, setDpdpEvents] = useState([]);
    const [dpdpComplianceSummary, setDpdpComplianceSummary] = useState(null);
    const [showDpdpDetails, setShowDpdpDetails] = useState(false);
  const safeLogs = Array.isArray(logs) ? logs : [];
  const safePolicies = Array.isArray(policies) ? policies : [];
  useEffect(() => {
  const fetchDpdpEvents = async () => {
    try {
      const token =
        localStorage.getItem("neuravaToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("jwt");

      const response = await fetch(
        "http://localhost:5000/api/dpdp-observability",
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setDpdpEvents(Array.isArray(data) ? data : []);
      }
      const complianceRes = await fetch(
  "http://localhost:5000/api/dpdp-compliance/summary",
  {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  }
);

const complianceData = await complianceRes.json();

if (complianceRes.ok) {
  setDpdpComplianceSummary(complianceData);
}
    } catch (err) {
      console.error("Failed to fetch DPDP dashboard events:", err);
    }
  };

  fetchDpdpEvents();
}, []);

  const totalResponses = safeLogs.length;

  const blockedCount = safeLogs.filter((log) => log.decision === "BLOCK").length;
  const warningCount = safeLogs.filter(
    (log) => log.decision === "FLAG" || log.decision === "REWRITE"
  ).length;

  const violationCount = safeLogs.filter(
    (log) =>
      log.decision === "BLOCK" ||
      log.decision === "FLAG" ||
      log.riskScore >= 70
  ).length;

  const hallucinationCount = safeLogs.filter((log) =>
    String(log.prompt || "").toLowerCase().includes("mars")
  ).length;

  const hallucinationRate = totalResponses
    ? ((hallucinationCount / totalResponses) * 100).toFixed(2)
    : "0.00";

  const avgRisk = totalResponses
    ? Math.round(
        safeLogs.reduce((sum, log) => sum + (Number(log.riskScore) || 0), 0) /
          totalResponses
      )
    : 0;

  const confidenceScore = totalResponses
    ? ((100 - avgRisk) / 100).toFixed(2)
    : "1.00";

  const activePolicyCount = safePolicies.filter((p) => p.enabled).length;

  const complianceScore =
    violationCount === 0
      ? 100
      : Math.max(
          0,
          Math.round(
            100 - (violationCount / Math.max(totalResponses, 1)) * 100
          )
        );

  const alertCount = safeLogs.filter(
    (log) => log.riskScore >= 70 || log.decision === "BLOCK"
  ).length;

  const userName = user?.fullName || "Arjun Sharma";
  const userRole = user?.role || "Data8X Admin";

  const miniTrend = safeLogs
    .slice(0, 10)
    .reverse()
    .map((log, index) => ({
      name: index + 1,
      value: Number(log.riskScore) || Math.floor(Math.random() * 30) + 20,
    }));

  const chartData = safeLogs.length
    ? safeLogs
        .slice(0, 7)
        .reverse()
        .map((log, index) => ({
          name: `Req ${index + 1}`,
          overall: Number(log.riskScore) || 0,
          highRisk: log.riskScore >= 70 ? Number(log.riskScore) || 0 : 0,
          lowRisk: log.riskScore < 70 ? Number(log.riskScore) || 0 : 0,
        }))
    : [
        { name: "May 12", overall: 5.2, highRisk: 0.7, lowRisk: 2.9 },
        { name: "May 13", overall: 4.5, highRisk: 1.1, lowRisk: 2.8 },
        { name: "May 14", overall: 4.6, highRisk: 0.9, lowRisk: 3.2 },
        { name: "May 15", overall: 4.2, highRisk: 1.2, lowRisk: 2.7 },
        { name: "May 16", overall: 4.3, highRisk: 1.4, lowRisk: 2.5 },
        { name: "May 17", overall: 3.9, highRisk: 1.0, lowRisk: 2.4 },
        { name: "May 18", overall: 3.0, highRisk: 0.7, lowRisk: 1.9 },
      ];

  const validationData = [
    {
      name: "Validated",
      value: Math.max(totalResponses - violationCount, 0),
    },
    {
      name: "Warning",
      value: warningCount,
    },
    {
      name: "Blocked",
      value: blockedCount,
    },
    {
      name: "Escalated",
      value: safeLogs.filter((log) => log.riskScore >= 90).length,
    },
  ];

  const modelRiskData = [
    { model: "GPT-4o", rate: 2.81 },
    { model: "Claude 3.5 Sonnet", rate: 2.12 },
    { model: "Llama 3.1 70B", rate: 1.98 },
    { model: "Gemini 1.5 Pro", rate: 1.46 },
    { model: "Mistral Large 2", rate: 1.24 },
  ];

  const workflowData = [
    { name: "Running", value: 18 },
    { name: "Success", value: 22 },
    { name: "Failed", value: 4 },
    { name: "Scheduled", value: 4 },
  ];

const consentedLogs = safeLogs.filter((log) => log.consentAccepted);

const consentAcceptedRate = safeLogs.length
  ? Math.round((consentedLogs.length / safeLogs.length) * 100)
  : 0;

const piiDetections = dpdpEvents.filter(
  (event) => event.eventType === "PII_DETECTED"
).length;

const consentViolations = dpdpEvents.filter(
  (event) => event.eventType === "CONSENT_VIOLATION"
).length;

const criticalDpdpEvents = dpdpEvents.filter(
  (event) => event.severity === "CRITICAL"
).length;

const openDpdpIncidents = dpdpEvents.filter(
  (event) => event.status === "OPEN"
).length;

const providerFailures = dpdpEvents.filter(
  (event) => event.source === "AI_CHAT_ERROR"
).length;
const dpdpScore =
  dpdpComplianceSummary?.score ??
  Math.max(
    0,
    100 -
      consentViolations * 15 -
      criticalDpdpEvents * 15 -
      openDpdpIncidents * 5 -
      providerFailures * 5
  );

const dpdpChecks =
  dpdpComplianceSummary?.controls?.map((control) => ({
    name: control.section,
    compliant: control.status === "IMPLEMENTED",
    value: control.neuravaModule,
  })) || [];

  const trustLayerItems = [
    {
      label: "Guardrails Engine",
      status: activePolicyCount > 0 ? "Healthy" : "Needs Setup",
    },
    {
      label: "Hallucination Detection",
      status: Number(hallucinationRate) > 5 ? "Review" : "Healthy",
    },
    {
      label: "AI Observability",
      status: totalResponses > 0 ? "Healthy" : "No Data",
    },
    {
      label: "Data Governance",
      status: complianceScore >= 90 ? "Healthy" : "Review",
    },
    {
      label: "Workflow Orchestration",
      status: "Healthy",
    },
    {
      label: "Identity & Access",
      status: user ? "Healthy" : "Review",
    },
  ];

  const sideMenu = [
    { label: "Chat", icon: MessageSquare, key: "chat" },
    { label: "Dashboard", icon: Home, key: "dashboard" },
    { label: "Guardrails", icon: Shield, key: "guardrails" },
    { label: "Observability", icon: Eye, key: "observability" },
    { label: "Alerts", icon: Bell, key: "alerts" },
    { label: "Analytics", icon: FileText, key: "analytics" },
    { label: "Attack Lab", icon: AlertTriangle, key: "attack-lab" },
    { label: "Consent", icon: Lock, key: "consent", admin: true },
    { label: "Users", icon: Users, key: "users", admin: true },
  ];

  const topNav = [
    { label: "Overview", icon: Home, key: "dashboard" },
    { label: "Guardrails", icon: Bell, key: "guardrails" },
    { label: "Hallucination", icon: Cpu, key: "analytics" },
    { label: "AI Observability", icon: Workflow, key: "observability" },
    { label: "Logs", icon: FileText, key: "observability" },
    { label: "Policies", icon: ClipboardCheck, key: "guardrails" },
    { label: "Workflows", icon: GitBranch, key: "attack-lab" },
    { label: "Data Governance", icon: Database, key: "consent", admin: true },
    { label: "Settings", icon: Settings, key: "users", admin: true },
  ];

  const recentAlerts = safeLogs
    .filter((log) => log.riskScore >= 70 || log.decision === "BLOCK")
    .slice(0, 4);

  const quickActions = [
    {
  label: "Add New AI System",
  icon: Plus,
  action: () => setActive("ai-systems"),
  primary: true,
},
    {
      label: "Run Policy Check",
      icon: Shield,
      action: () => setActive("chat"),
    },
    {
      label: "Create Guardrail",
      icon: Lock,
      action: () => setActive("guardrails"),
    },
    {
      label: "Analyze Conversation",
      icon: Activity,
      action: () => setActive("analytics"),
    },
    {
      label: "View Alerts",
      icon: Bell,
      action: () => setActive("alerts"),
      badge: alertCount,
    },
    {
      label: "Export Report",
      icon: Download,
      action: () => alert("Export report will be connected next."),
    },
  ];

const dataGovernanceMenu = [
  { label: "Data Inventory", key: "data-inventory", icon: Database },
  { label: "Metadata Management", key: "metadata-management", icon: Tags },
  { label: "Data Lineage", key: "data-lineage", icon: GitBranch },
  { label: "Data Quality", key: "data-quality", icon: CheckCircle },
  { label: "DPDP Compliance", key: "dpdp-compliance", icon: ShieldCheck },
  { label: "Data Subject Rights", key: "data-subject-rights", icon: UserCheck },
  { label: "Retention Policies", key: "retention-policies", icon: Clock },
  { label: "Breach Management", key: "breach-management", icon: AlertTriangle },
];

const operationsMenu = [
  { label: "Workflows", key: "workflows", icon: Workflow },
  { label: "Integrations", key: "integrations", icon: Plug },
  { label: "Reports", key: "reports", icon: FileText },
];

const topCards = [
  {
    title: "AI Systems",
    value: activePolicyCount || 0,
    icon: Box,
    color: "text-blue-600",
    bg: "bg-blue-50",
    sub: "Active",
    change: "↑ 4 vs last 7 days",
  },
  {
    title: "Total AI Responses",
    value: totalResponses.toLocaleString(),
    icon: MessageSquare,
    color: "text-violet-600",
    bg: "bg-violet-50",
    sub: "From MongoDB logs",
    change: "↑ 18.6% vs last 7 days",
  },
  {
    title: "Hallucination Rate",
    value: `${hallucinationRate}%`,
    icon: AlertTriangle,
    color: "text-red-500",
    bg: "bg-red-50",
    sub: "Detected from audit logs",
    change: "↓ 8.7% vs last 7 days",
  },
  {
    title: "Policy Violations",
    value: violationCount,
    icon: Shield,
    color: "text-orange-500",
    bg: "bg-orange-50",
    sub: `${blockedCount} blocked responses`,
    change: "↓ 31.3% vs last 7 days",
  },
  {
    title: "Confidence Score (Avg.)",
    value: confidenceScore,
    icon: Activity,
    color: "text-green-600",
    bg: "bg-green-50",
    sub: `Avg risk ${avgRisk}%`,
    change: "↑ 6.4% vs last 7 days",
  },
  {
    title: "DPDP Compliance",
    value: `${dpdpScore}%`,
    icon: Lock,
    color: "text-blue-600",
    bg: "bg-blue-50",
    sub: dpdpScore >= 80 ? "Compliant" : "Needs Review",
    progress: dpdpScore,
  },
];

return (
    <div className="min-h-screen bg-[#f7f9ff] text-[#071143]">
      <div className="flex min-h-screen">
        <aside
  className={`shrink-0 border-r border-slate-200 bg-white transition-all duration-300 ${
    sidebarCollapsed ? "w-[76px]" : "w-[236px]"
  }`}
>
          <div className="border-b p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-700 to-blue-600 text-2xl font-black text-white">
                N
              </div>

              <div className={sidebarCollapsed ? "hidden" : "block"}>
                <h1 className="text-3xl font-black text-[#071143]">Neurava</h1>
                <p className="text-[8px] font-bold tracking-[0.18em] text-slate-700">
                  AI TRUST • GOVERNANCE
                </p>
                <p className="mt-1 text-sm font-bold text-[#071143]">
                  by Data8X
                </p>
              </div>
            </div>
          </div>

          <div className="p-4">
            <button
              onClick={() => setActive("dashboard")}
              className={`mb-6 flex w-full items-center rounded-xl px-3 py-3 text-left font-semibold ${
  sidebarCollapsed ? "justify-center" : "gap-3"
} ${
  active === "dashboard"
    ? "bg-violet-50 text-violet-700"
    : "text-slate-700 hover:bg-slate-100"
}`}
            >
              <Home size={18} />
{!sidebarCollapsed && "Home"}
            </button>

            {!sidebarCollapsed && (
  <p className="mb-2 text-[11px] font-semibold uppercase text-slate-400">
    AI Trust Layer
  </p>
)}

            <div className="space-y-1">
              {sideMenu
                .filter((item) => item.key !== "dashboard")
                .filter((item) => !item.admin || user?.role === "ADMIN")
                .map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
  key={item.key}
  onClick={() => setActive(item.key)}
  className={`group flex w-full items-center rounded-xl px-3 py-2 text-left text-sm font-medium transition-all ${
    sidebarCollapsed ? "justify-center" : "gap-3"
  } ${
    active === item.key
      ? "bg-violet-50 text-violet-700 shadow-sm"
      : "text-slate-600 hover:bg-slate-50 hover:text-[#071143]"
  }`}
>
  <Icon
    size={16}
    className={`shrink-0 ${
      active === item.key ? "text-violet-700" : "text-slate-500"
    }`}
  />

  {!sidebarCollapsed && (
    <span className="truncate">{item.label}</span>
  )}
</button>
                  );
                })}
            </div>

            {!sidebarCollapsed && (
  <p className="mb-2 mt-6 text-[11px] font-semibold uppercase text-slate-400">
    Data Governance
  </p>
)}

            <div className="space-y-1">
  {dataGovernanceMenu.map((item) => {
  const Icon = item.icon;

  return (
    <button
      key={item.key}
      onClick={() => setActive(item.key)}
      className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm font-medium transition-all ${
        sidebarCollapsed ? "justify-center" : "gap-3"
      } ${
        active === item.key
          ? "bg-violet-50 text-violet-700 shadow-sm"
          : "text-slate-600 hover:bg-slate-50 hover:text-[#071143]"
      }`}
    >
      <Icon size={16} />
      {!sidebarCollapsed && item.label}
    </button>
  );
})}
</div>

            {!sidebarCollapsed && (
  <p className="mb-2 mt-6 text-[11px] font-semibold uppercase text-slate-400">
    Operations
  </p>
)}

            <div className="space-y-1">
  {operationsMenu.map((item) => {
  const Icon = item.icon;

  return (
    <button
      key={item.key}
      onClick={() => setActive(item.key)}
      className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm font-medium transition-all ${
        sidebarCollapsed ? "justify-center" : "gap-3"
      } ${
        active === item.key
          ? "bg-violet-50 text-violet-700 shadow-sm"
          : "text-slate-600 hover:bg-slate-50 hover:text-[#071143]"
      }`}
    >
      <Icon size={16} />
      {!sidebarCollapsed && item.label}
    </button>
  );
})}
</div>

            <button
  onClick={() => setSidebarCollapsed((prev) => !prev)}
  className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
>
  <ChevronLeft
    size={14}
    className={`transition-transform ${
      sidebarCollapsed ? "rotate-180" : ""
    }`}
  />
  {!sidebarCollapsed && "Collapse"}
</button>
          </div>
        </aside>

        <main className="flex-1 overflow-hidden">
          <header className="border-b bg-white px-6 py-3">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h1 className="text-xl font-black text-[#071143]">
                  Good morning, {userName}! 👋
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Neurava Trust Layer Control Plane
                </p>
                <p className="mt-1 text-xs text-slate-500">
  Monitor, govern and secure your AI systems, data and workflows.
</p>
              </div>

              <div className="flex items-center gap-5">
                <div className="flex w-[260px] items-center gap-2 rounded-xl border bg-[#f8fafc] px-3 py-2">
                  <Search size={17} className="text-slate-400" />
                  <input
                    placeholder="Search anything..."
                    className="w-full bg-transparent text-sm outline-none"
                  />
                  <span className="rounded-md border px-2 py-1 text-xs text-slate-500">
                    ⌘ K
                  </span>
                </div>

                <HelpCircle size={18} className="text-slate-600" />

                <div className="relative">
                  <Bell size={18} className="text-slate-600" />
                  {alertCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                      {alertCount}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src="https://i.pravatar.cc/100"
                    alt=""
                    className="h-9 w-9 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{userName}</p>
                    <p className="text-xs text-slate-500">{userRole}</p>
                  </div>
                </div>
              </div>
            </div>

            
          </header>

          <section className="p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
              {topCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.title}
                    className="rounded-2xl border bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium text-slate-500">
                          {card.title}
                        </p>
                        <h2 className="mt-2 text-3xl font-black text-[#071143]">
                          {card.value}
                        </h2>
                        <p
                          className={`mt-2 text-xs ${
                            String(card.change || "").startsWith("↓")
                              ? "text-green-600"
                              : "text-slate-500"
                          }`}
                        >
                          {card.change || card.sub}
                        </p>
                      </div>

                      <div className={`rounded-xl p-3 ${card.bg} ${card.color}`}>
                        <Icon size={21} />
                      </div>
                    </div>

                    {card.progress !== undefined ? (
                      <div className="mt-7 h-2 rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-blue-600"
                          style={{ width: `${card.progress}%` }}
                        />
                      </div>
                    ) : (
                      <div className="mt-5 h-[40px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={miniTrend}>
                            <Line
                              type="monotone"
                              dataKey="value"
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.1fr_1.7fr_1fr]">
              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <h3 className="text-lg font-bold text-[#071143]">
                  Trust Layer Overview
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Health of core control plane services
                </p>

                <div className="mt-4 space-y-3">
                  {trustLayerItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-xl border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <Shield size={16} className="text-violet-600" />
                        <span>{item.label}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm ${
                            item.status === "Healthy"
                              ? "text-green-600"
                              : item.status === "Review" ||
                                item.status === "Active"
                              ? "text-orange-600"
                              : "text-slate-500"
                          }`}
                        >
                          {item.status}
                        </span>
                        <CheckCircle size={15} className="text-green-600" />
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-4 text-sm font-semibold text-violet-700">
                  View all systems →
                </button>
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#071143]">
                    Hallucination Rate Over Time
                  </h3>
                  <select className="rounded-lg border px-3 py-2 text-xs outline-none">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                  </select>
                </div>

                <div className="mt-4 h-[235px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="overall"
                        strokeWidth={3}
                        name="Overall"
                      />
                      <Line
                        type="monotone"
                        dataKey="highRisk"
                        strokeWidth={2}
                        name="High Risk"
                      />
                      <Line
                        type="monotone"
                        dataKey="lowRisk"
                        strokeWidth={2}
                        name="Low Risk"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-2">
                  {[
                    ["High Risk Responses", blockedCount || 312, "↓ 12.3%"],
                    ["Medium Risk", warningCount || 1124, "↓ 5.6%"],
                    ["Low Risk", Math.max(totalResponses - violationCount, 0) || 2458, "↑ 3.2%"],
                    ["Informational", totalResponses || 5678, "↑ 8.9%"],
                  ].map(([label, value, trend]) => (
                    <div key={label} className="rounded-xl border bg-slate-50 p-3">
                      <p className="text-[11px] text-slate-500">{label}</p>
                      <p className="mt-1 text-lg font-black">{value}</p>
                      <p className="text-[11px] text-slate-500">{trend}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-bold text-[#071143]">
                    Quick Actions
                  </h3>

                  <div className="mt-4 space-y-3">
                    {quickActions.map((item) => {
                      const Icon = item.icon;

                      return (
                        <button
                          key={item.label}
                          onClick={item.action}
                          className={`relative flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                            item.primary
                              ? "border-violet-700 bg-violet-700 text-white hover:bg-violet-800"
                              : "border-violet-200 bg-white text-violet-700 hover:bg-violet-50"
                          }`}
                        >
                          <Icon size={16} />
                          {item.label}
                          {item.badge > 0 && (
                            <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[#071143]">
                      Recent Alerts
                    </h3>
                    <button
                      onClick={() => setActive("alerts")}
                      className="text-xs font-semibold text-violet-700"
                    >
                      View all
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {recentAlerts.length === 0 ? (
                      <p className="text-sm text-slate-500">
                        No recent high-risk alerts.
                      </p>
                    ) : (
                      recentAlerts.map((alert, index) => (
                        <div key={alert.id || index} className="flex gap-3">
                          <AlertTriangle
                            size={16}
                            className="mt-1 text-orange-500"
                          />
                          <div>
                            <p className="text-sm font-semibold">
                              {alert.decision === "BLOCK"
                                ? "Policy violation detected"
                                : "High risk response detected"}
                            </p>
                            <p className="line-clamp-1 text-xs text-slate-500">
                              {alert.prompt}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <h3 className="text-lg font-bold text-[#071143]">
                  Top AI Models by Hallucination Rate
                </h3>

                <div className="mt-4 space-y-4">
                  {modelRiskData.map((item) => (
                    <div key={item.model}>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span>{item.model}</span>
                        <span>{item.rate}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-violet-700"
                          style={{ width: `${Math.min(item.rate * 28, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#071143]">
                    DPDP Compliance Summary
                  </h3>
                  <button
  onClick={() => setShowDpdpDetails(true)}
  className="text-xs font-semibold text-violet-700"
>
  View details →
</button>
                </div>

                <div className="mt-4 grid grid-cols-[130px_1fr] items-center gap-5">
                  <div className="flex h-[130px] items-center justify-center rounded-full border-[12px] border-green-500">
                    <div className="text-center">
                      <p className="text-3xl font-black">{dpdpScore}%</p>
<p className="text-xs text-slate-500">
  {dpdpScore >= 80 ? "Compliant" : "Needs Review"}
</p>
                    </div>
                  </div>

                  <div className="space-y-3">

  {dpdpChecks.slice(0, 7).map((item) => (
  <div
    key={item.name}
    className="grid grid-cols-[1fr_105px] items-start gap-2 text-sm"
  >
    <div className="leading-5">
      <span>
        {item.compliant ? "✓" : "!"} {item.name}
      </span>

      <div className="text-xs text-slate-400">
        {item.value}
      </div>
    </div>

    <div
      className={`text-right text-xs ${
        item.compliant ? "text-green-600" : "text-orange-600"
      }`}
    >
      {item.compliant ? "Compliant" : "Action Required"}
    </div>
  </div>
))}

  {dpdpChecks.length > 7 && (
    <p className="pt-2 text-xs text-slate-500">
      +{dpdpChecks.length - 7} more DPDP Act controls.
      Click View details.
    </p>
  )}

</div>
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <h3 className="text-lg font-bold text-[#071143]">
                  Workflows Status
                </h3>

                <div className="mt-4 grid grid-cols-[150px_1fr] items-center gap-5">
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie
                        data={workflowData}
                        dataKey="value"
                        innerRadius={45}
                        outerRadius={70}
                      >
                        {workflowData.map((entry, index) => (
                          <Cell key={index} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="space-y-3">
                    {workflowData.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between text-sm"
                      >
                        <span>{item.name}</span>
                        <span className="font-semibold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setActive("attack-lab")}
                  className="mt-3 text-sm font-semibold text-violet-700"
                >
                  Go to Workflows →
                </button>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                    <Shield size={30} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#071143]">
                      Neurava Trust Layer is your unified control plane for
                      building trustworthy and autonomous AI.
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Enforce policies • Detect risks • Ensure compliance •
                      Drive responsible AI at scale.
                    </p>
                  </div>
                </div>

                <button className="rounded-xl border border-violet-300 px-5 py-3 text-sm font-semibold text-violet-700">
                  Learn more about Trust Layer
                </button>
              </div>
            </div>

            <footer className="mt-5 flex items-center justify-center text-xs text-slate-500">
              © 2025 Data8X. All rights reserved.
            </footer>
          </section>
        </main>
      </div>

      <button className="fixed bottom-8 right-8 flex h-16 w-16 items-center justify-center rounded-full bg-violet-700 text-white shadow-2xl shadow-violet-300">
        <MessageSquare size={28} />
      </button>
      {showDpdpDetails && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
    <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black">DPDP Act Coverage Details</h2>
          <p className="mt-1 text-sm text-slate-500">
            Neurava module mapping against DPDP Act controls.
          </p>
        </div>

        <button
          onClick={() => setShowDpdpDetails(false)}
          className="rounded-xl border px-4 py-2 text-sm hover:bg-slate-100"
        >
          Close
        </button>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b text-xs uppercase text-slate-500">
              <th className="py-3 pr-4">DPDP Control</th>
              <th className="py-3 pr-4">Requirement</th>
              <th className="py-3 pr-4">Neurava Module</th>
              <th className="py-3 pr-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {(dpdpComplianceSummary?.controls || []).map((control) => (
              <tr key={control.id} className="border-b">
                <td className="py-3 pr-4 font-semibold">
                  {control.section}
                </td>

                <td className="py-3 pr-4 text-slate-600">
                  {control.requirement}
                </td>

                <td className="py-3 pr-4">
                  {control.neuravaModule}
                </td>

                <td className="py-3 pr-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      control.status === "IMPLEMENTED"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {control.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}
    </div>
  );
}