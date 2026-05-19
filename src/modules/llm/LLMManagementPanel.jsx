import { useEffect, useState } from "react";
import NeuravaShell from "../../components/layout/NeuravaShell";
import {
  Home,
  ChevronLeft,
  MessageSquare,
  Shield,
  Eye,
  Bell,
  FileText,
  AlertTriangle,
  Lock,
  Users,
} from "lucide-react";

export default function LLMManagementPanel({
  token,
  active,
  setActive,
  user,
  logout,
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [llms, setLlms] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    provider: "OPENAI",
    model: "",
    apiKey: "",
  });

  const fetchLlms = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/llms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setLlms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch LLM providers", err);
      setLlms([]);
    }
  };

  useEffect(() => {
    fetchLlms();
  }, []);

  const createLlm = async () => {
    if (!form.name || !form.provider || !form.model || !form.apiKey) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/llms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create AI system");
      }

      setForm({
        name: "",
        provider: "OPENAI",
        model: "",
        apiKey: "",
      });

      fetchLlms();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, isActive) => {
    await fetch(`http://localhost:5000/api/llms/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isActive }),
    });

    fetchLlms();
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
              }`}
            >
              <Home size={18} />
              {!sidebarCollapsed && "Home"}
            </button>

            <div className="space-y-1">
              {[
                { label: "Chat", icon: MessageSquare, key: "chat" },
                { label: "Guardrails", icon: Shield, key: "guardrails" },
                { label: "Observability", icon: Eye, key: "observability" },
                { label: "Alerts", icon: Bell, key: "alerts" },
                { label: "Analytics", icon: FileText, key: "analytics" },
                { label: "Attack Lab", icon: AlertTriangle, key: "attack-lab" },
                { label: "Consent", icon: Lock, key: "consent", admin: true },
                { label: "Users", icon: Users, key: "users", admin: true },
              ]
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
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Icon size={16} />
                      {!sidebarCollapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </button>
                  );
                })}
            </div>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs font-medium text-slate-500"
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
            <h1 className="text-xl font-black text-[#071143]">
              Good morning, {user?.fullName || "Neurava Admin"}! 👋
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Neurava Trust Layer Control Plane
            </p>
          </header>

          <section className="p-5">
            <h2 className="text-[30px] font-black">AI Systems</h2>
            <p className="mt-2 text-base text-slate-500">
              Add and manage connected LLM providers used by Neurava Chat.
            </p>

            <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
              <h3 className="text-lg font-black">Add New AI System</h3>

              <div className="mt-4 grid gap-3 md:grid-cols-5">
                <input
                  className="rounded-xl border px-4 py-3 outline-none"
                  placeholder="System name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />

                <select
                  className="rounded-xl border px-4 py-3 outline-none"
                  value={form.provider}
                  onChange={(e) =>
                    setForm({ ...form, provider: e.target.value })
                  }
                >
                  <option value="OPENAI">OpenAI / ChatGPT</option>
                  <option value="CLAUDE">Claude</option>
                  <option value="GEMINI">Gemini</option>
                  <option value="PERPLEXITY">Perplexity</option>
                </select>

                <input
                  className="rounded-xl border px-4 py-3 outline-none"
                  placeholder="Model name"
                  value={form.model}
                  onChange={(e) =>
                    setForm({ ...form, model: e.target.value })
                  }
                />

                <input
                  className="rounded-xl border px-4 py-3 outline-none"
                  placeholder="API key"
                  type="password"
                  value={form.apiKey}
                  onChange={(e) =>
                    setForm({ ...form, apiKey: e.target.value })
                  }
                />

                <button
                  onClick={createLlm}
                  disabled={loading}
                  className="rounded-xl bg-violet-700 px-5 py-3 text-sm font-bold text-white disabled:bg-slate-400"
                >
                  {loading ? "Saving..." : "Save AI System"}
                </button>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
              <h3 className="text-lg font-black">Connected AI Systems</h3>

              <div className="mt-4 space-y-3">
                {llms.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No AI systems connected yet.
                  </p>
                ) : (
                  llms.map((llm) => (
                    <div
                      key={llm.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-slate-50 p-4"
                    >
                      <div>
                        <p className="font-bold">{llm.name}</p>
                        <p className="text-sm text-slate-500">
                          {llm.provider} · {llm.model} · {llm.keyMasked}
                        </p>
                      </div>

                      <button
                        onClick={() => updateStatus(llm.id, !llm.isActive)}
                        className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                          llm.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {llm.isActive ? "Active" : "Disabled"}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}