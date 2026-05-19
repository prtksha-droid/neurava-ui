import { useState } from "react";
import {
  Shield,
  MessageSquare,
  Eye,
  AlertTriangle,
  Users,
  FileText,
  Database,
  Workflow,
  Lock,
  ChevronLeft,
  Home,
  Bell,
  Search,
  HelpCircle,
  Tags,
  GitBranch,
  CheckCircle,
  ShieldCheck,
  UserCheck,
  Clock,
  Plug,
} from "lucide-react";
import {
  aiTrustMenu,
  dataGovernanceMenu,
  operationsMenu,
} from "../../config/navigation";

export default function NeuravaShell({
  children,
  active,
  setActive,
  user,
  logout,
  title = "Enterprise Data Governance",
  subtitle = "Monitor, govern and secure your AI systems, data and workflows.",
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const aiTrustMenu = [
    { label: "Chat", icon: MessageSquare, key: "chat" },
    { label: "Guardrails", icon: Shield, key: "guardrails" },
    { label: "Observability", icon: Eye, key: "observability" },
    { label: "Alerts", icon: Bell, key: "alerts" },
    { label: "Analytics", icon: FileText, key: "analytics" },
    { label: "Attack Lab", icon: AlertTriangle, key: "attack-lab" },
    { label: "Consent", icon: Lock, key: "consent", admin: true },
    { label: "Users", icon: Users, key: "users", admin: true },
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

  const renderMenuItem = (item) => {
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

        {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f9ff] text-[#071143]">
      <div className="flex min-h-screen">
        <aside
          className={`shrink-0 border-r border-slate-200 bg-white transition-all duration-300 ${
            sidebarCollapsed ? "w-[82px]" : "w-[236px]"
          }`}
        >
          <div className="border-b p-4 overflow-hidden">
            <div
              className={`flex items-center ${
                sidebarCollapsed ? "justify-center" : "gap-3"
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-700 to-blue-600 text-2xl font-black text-white">
                N
              </div>

              <div className={sidebarCollapsed ? "hidden" : ""}>
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
              {aiTrustMenu
                .filter((item) => !item.admin || user?.role === "ADMIN")
                .map(renderMenuItem)}
            </div>

            {!sidebarCollapsed && (
              <p className="mb-2 mt-6 text-[11px] font-semibold uppercase text-slate-400">
                Data Governance
              </p>
            )}

            <div className="space-y-1">
              {dataGovernanceMenu.map(renderMenuItem)}
            </div>

            {!sidebarCollapsed && (
              <p className="mb-2 mt-6 text-[11px] font-semibold uppercase text-slate-400">
                Operations
              </p>
            )}

            <div className="space-y-1">
              {operationsMenu.map(renderMenuItem)}
            </div>

            <button
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
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
          <header className="border-b bg-white px-6 py-4">
            <div className="flex items-center justify-between gap-6">
              <div>
                <h1 className="text-xl font-black text-[#071143]">
                  Good morning, {user?.fullName || "Neurava Admin"}! 👋
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Neurava Trust Layer Control Plane
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {subtitle}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex w-[260px] items-center gap-2 rounded-xl border bg-[#f8fafc] px-3 py-2">
                  <Search size={17} className="text-slate-400" />
                  <input
                    placeholder="Search anything..."
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>

                <HelpCircle size={18} className="text-slate-600" />
                <Bell size={18} className="text-slate-600" />

                <div className="flex items-center gap-3">
                  <img
                    src="https://i.pravatar.cc/100"
                    alt=""
                    className="h-9 w-9 rounded-full"
                  />

                  <div>
                    <p className="font-semibold">
                      {user?.fullName || "Neurava Admin"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {user?.role || "ADMIN"}
                    </p>
                  </div>
                  <button
  onClick={logout}
  className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
>
  Logout
</button>
                </div>
              </div>
            </div>
          </header>

          <section className="p-5">
            <div className="mb-6">
              <h2 className="text-[30px] font-black leading-tight tracking-tight">
                {title}
              </h2>
            </div>

            {children}
          </section>
        </main>
      </div>
    </div>
  );
}