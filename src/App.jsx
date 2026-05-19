import { useEffect, useState } from "react";

import HomeDashboard from "./components/HomeDashboard";
import InventoryDashboard from "./components/dataLifecycle/InventoryDashboard";
import MetadataManagement from "./components/dataLifecycle/MetadataManagement";
import DataLineage from "./components/dataLifecycle/DataLineage";
import DataQuality from "./components/dataLifecycle/DataQuality";

import LoginPage from "./modules/auth/LoginPage";
import ChatLayerPanel from "./modules/chat/ChatLayerPanel";
import Dashboard from "./modules/dashboard/Dashboard";
import Guardrails from "./modules/guardrails/Guardrails";
import Observability from "./modules/observability/Observability";
import AlertsCenter from "./modules/alerts/AlertsCenter";
import ConsentAudit from "./modules/consent/ConsentAudit";
import UsersPanel from "./modules/admin/UsersPanel";
import AttackLab, { attackScenarios } from "./modules/security/AttackLab";
import AnalyticsPanel from "./modules/analytics/AnalyticsPanel";
import LLMManagementPanel from "./modules/llm/LLMManagementPanel";
import WorkflowStudio from "./modules/workflows/WorkflowStudio";
import DataSubjectRights from "./modules/dpdp/DataSubjectRights";
import RetentionPolicies from "./modules/dpdp/RetentionPolicies";
import BreachManagement from "./modules/dpdp/BreachManagement";

function App() {
  const [active, setActive] = useState("chat");
  const [mode, setMode] = useState("safe");
  const [selectedModel, setSelectedModel] = useState("gpt-4.1");
  const [llms, setLlms] = useState([]);
  const [selectedLlmId, setSelectedLlmId] = useState("");

  const consentVersion = "v1.0";
  const consentPurpose =
    "AI safety, security monitoring, governance, compliance, and audit logging";

  const [token, setToken] = useState(() =>
    localStorage.getItem("neuravaToken")
  );

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("neuravaUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [consentAccepted, setConsentAccepted] = useState(
    () => localStorage.getItem("neuravaConsentAccepted") === "true"
  );

  const [policies, setPolicies] = useState(() => {
    const savedPolicies = localStorage.getItem("neuravaPolicies");

    if (savedPolicies) {
      return JSON.parse(savedPolicies);
    }

    return [
      { id: 1, name: "Block fabricated facts", enabled: true },
      { id: 2, name: "Rewrite unsupported claims", enabled: true },
      { id: 3, name: "Flag high-risk factual answers", enabled: true },
      { id: 4, name: "Prevent sensitive data leakage", enabled: true },
      { id: 5, name: "Detect harmful content", enabled: true },
      { id: 6, name: "Detect extremist or violent content", enabled: true },
      { id: 7, name: "Detect prompt injection attempts", enabled: true },
      { id: 8, name: "Prevent credential leakage", enabled: true },
      { id: 9, name: "Prevent unsafe code generation", enabled: true },
    ];
  });

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [runningAttackId, setRunningAttackId] = useState(null);

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    localStorage.setItem("neuravaPolicies", JSON.stringify(policies));
  }, [policies]);

  useEffect(() => {
    if (!token) return;

    const fetchLlms = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/llms", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        const activeLlms = Array.isArray(data)
          ? data.filter((item) => item.isActive)
          : [];

        setLlms(activeLlms);

        if (activeLlms.length > 0 && !selectedLlmId) {
          setSelectedLlmId(activeLlms[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch AI systems", err);
      }
    };

    fetchLlms();
  }, [token, selectedLlmId]);

  useEffect(() => {
    if (!token) return;

    const fetchLogs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/logs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          localStorage.removeItem("neuravaUser");
          localStorage.removeItem("neuravaToken");
          setUser(null);
          setToken(null);
          setLogs([]);
          return;
        }

        const data = await res.json();
        setLogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch logs", err);
        setLogs([]);
      }
    };

    fetchLogs();

    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, [token]);

  const acceptConsent = () => {
    localStorage.setItem("neuravaConsentAccepted", "true");
    setConsentAccepted(true);
  };

  const handleLoginSuccess = ({ user, token }) => {
    localStorage.setItem("neuravaUser", JSON.stringify(user));
    localStorage.setItem("neuravaToken", token);

    setUser(user);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("neuravaUser");
    localStorage.removeItem("neuravaToken");

    setUser(null);
    setToken(null);
  };

  const exportLogs = () => {
    const content = JSON.stringify(logs, null, 2);

    const blob = new Blob([content], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "neurava-audit-report.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  const resetLogs = async () => {
    try {
      await fetch("http://localhost:5000/api/logs", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLogs([]);
    } catch (err) {
      console.error("Failed to reset logs", err);
    }
  };

  const sendMessageWithPrompt = async (customPrompt, source = "CHAT") => {
    const finalPrompt = customPrompt || input;

    if (!finalPrompt.trim() || loading || !consentAccepted) return;

    setLoading(true);

    const selectedLlm = llms.find((item) => item.id === selectedLlmId);

    setMessages((prev) => [
      ...prev,
      { role: "user", text: finalPrompt },
      {
        role: "ai",
        text: "Neurava is validating the response...",
        decision: "PROCESSING",
        temporary: true,
        provider: selectedLlm?.provider || "OPENAI",
        primaryModel: selectedLlm?.model || selectedModel,
      },
    ]);

    setInput("");

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          mode,
          model: selectedModel,
          selectedLlmId,
          consentAccepted,
          consentVersion,
          source,
          consentPurpose,
          policies: policies.filter((p) => p.enabled).map((p) => p.name),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Request failed");
      }

      setMessages((prev) => [
        ...prev.filter((m) => !m.temporary),
        {
          role: "ai",
          text: data.finalOutput,
          decision: data.decision,
          riskScore: data.riskScore,
          mode: data.mode,
          primaryModel: data.primaryModel,
          validatorModel: data.validatorModel,
          policies: data.policies,
          triggeredPolicies: data.triggeredPolicies,
          provider: data.provider,
        },
      ]);

      setLogs((prev) => [data, ...(Array.isArray(prev) ? prev : [])]);
    } catch (err) {
      setMessages((prev) => [
        ...prev.filter((m) => !m.temporary),
        {
          role: "ai",
          text: err.message || "Unable to connect to Neurava backend.",
          decision: "ERROR",
          provider: selectedLlm?.provider || "OPENAI",
          primaryModel: selectedLlm?.model || selectedModel,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const runAttack = async (scenario) => {
    setRunningAttackId(scenario.id);

    try {
      await sendMessageWithPrompt(scenario.prompt, "ATTACK_LAB");
      setActive("alerts");
    } finally {
      setRunningAttackId(null);
    }
  };

  const renderActiveModule = () => {
    switch (active) {
      case "dashboard":
        return (
          <HomeDashboard
            active={active}
            setActive={setActive}
            user={user}
            logs={logs}
            policies={policies}
            logout={logout}
          />
        );

      case "control-tower":
        return (
          <Dashboard
            logs={logs}
            exportLogs={exportLogs}
            resetLogs={resetLogs}
            policies={policies}
            user={user}
            active={active}
            setActive={setActive}
            logout={logout}
          />
        );

      case "guardrails":
        return isAdmin ? (
          <Guardrails
            policies={policies}
            setPolicies={setPolicies}
            logs={logs}
            active={active}
            setActive={setActive}
            user={user}
            logout={logout}
          />
        ) : (
          <HomeDashboard
            active={active}
            setActive={setActive}
            user={user}
            logs={logs}
            policies={policies}
            logout={logout}
          />
        );

      case "observability":
        return (
          <Observability
            logs={logs}
            active={active}
            setActive={setActive}
            user={user}
            logout={logout}
          />
        );

      case "alerts":
        return (
          <AlertsCenter
            logs={logs}
            active={active}
            setActive={setActive}
            user={user}
            logout={logout}
          />
        );

      case "analytics":
        return (
          <AnalyticsPanel
            logs={logs}
            active={active}
            setActive={setActive}
            user={user}
            logout={logout}
          />
        );

      case "consent":
        return isAdmin ? (
          <ConsentAudit
            logs={logs}
            active={active}
            setActive={setActive}
            user={user}
            logout={logout}
          />
        ) : (
          <HomeDashboard
            active={active}
            setActive={setActive}
            user={user}
            logs={logs}
            policies={policies}
            logout={logout}
          />
        );

      case "users":
        return isAdmin ? (
          <UsersPanel
            token={token}
            active={active}
            setActive={setActive}
            user={user}
            logout={logout}
          />
        ) : (
          <HomeDashboard
            active={active}
            setActive={setActive}
            user={user}
            logs={logs}
            policies={policies}
            logout={logout}
          />
        );

      case "ai-systems":
        return isAdmin ? (
          <LLMManagementPanel
            token={token}
            active={active}
            setActive={setActive}
            user={user}
            logout={logout}
          />
        ) : (
          <HomeDashboard
            active={active}
            setActive={setActive}
            user={user}
            logs={logs}
            policies={policies}
            logout={logout}
          />
        );

      case "attack-lab":
        return (
          <AttackLab
            scenarios={attackScenarios}
            runAttack={runAttack}
            runningAttackId={runningAttackId}
            selectedModel={selectedModel}
            mode={mode}
            active={active}
            setActive={setActive}
            user={user}
            logout={logout}
          />
        );

      case "data-inventory":
        return (
          <InventoryDashboard
            active={active}
            setActive={setActive}
            user={user}
            logout={logout}
          />
        );

      case "metadata-management":
        return (
          <MetadataManagement
            active={active}
            setActive={setActive}
            user={user}
            logout={logout}
          />
        );

      case "data-lineage":
        return (
          <DataLineage
            active={active}
            setActive={setActive}
            user={user}
            logout={logout}
          />
        );

      case "data-quality":
        return (
          <DataQuality
            active={active}
            setActive={setActive}
            user={user}
            logout={logout}
          />
        );
        case "data-subject-rights":
  return (
    <DataSubjectRights
      active={active}
      setActive={setActive}
      user={user}
      logout={logout}
    />
  );
  case "retention-policies":
  return (
    <RetentionPolicies
      active={active}
      setActive={setActive}
      user={user}
      logout={logout}
    />
  );
  case "breach-management":
  return (
    <BreachManagement
      active={active}
      setActive={setActive}
      user={user}
      logout={logout}
    />
  );
      case "workflows":
  return (
    <WorkflowStudio
      active={active}
      setActive={setActive}
      user={user}
      logout={logout}
      token={token}
    />
  );

      case "chat":
      default:
        return (
          <ChatLayerPanel
            active={active}
            setActive={setActive}
            user={user}
            logout={logout}
            messages={messages}
            input={input}
            setInput={setInput}
            loading={loading}
            sendMessageWithPrompt={sendMessageWithPrompt}
            mode={mode}
            llms={llms}
            selectedLlmId={selectedLlmId}
            setSelectedLlmId={setSelectedLlmId}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            consentAccepted={consentAccepted}
            setMessages={setMessages}
            logs={logs}
          />
        );
    }
  };

  if (!user || !token) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {!consentAccepted && (
        <div className="border-b bg-amber-50">
          <div className="mx-auto max-w-4xl p-4">
            <div className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm">
              <h3 className="font-semibold text-amber-800">
                Consent Required
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                Neurava processes and stores prompts, AI outputs, risk scores,
                policy decisions, active guardrails, execution timelines, and
                audit logs for AI safety, security monitoring, governance, and
                compliance.
              </p>

              <button
                onClick={acceptConsent}
                className="mt-4 rounded-lg bg-black px-4 py-2 text-sm text-white"
              >
                I Accept and Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {renderActiveModule()}
    </div>
  );
}

export default App;