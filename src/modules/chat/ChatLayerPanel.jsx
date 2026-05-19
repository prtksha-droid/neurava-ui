import { useEffect, useRef, useState } from "react";
import { MessageSquare, Shield } from "lucide-react";
import NeuravaShell from "../../components/layout/NeuravaShell";

export default function ChatLayerPanel({
  active,
  setActive,
  user,
  logout,
  messages,
  input,
  setInput,
  loading,
  sendMessageWithPrompt,
  mode,
  llms,
  selectedLlmId,
  setSelectedLlmId,
  selectedModel,
  setSelectedModel,
  consentAccepted,
  setMessages,
  logs,
}) {
  const latestLog = logs?.[0];

  const [conversationSearch, setConversationSearch] = useState("");
  const [conversationFilter, setConversationFilter] = useState("All");
  const [selectedConversationId, setSelectedConversationId] = useState("live");
  const [selectedLogData, setSelectedLogData] = useState(null);

  const chatScrollRef = useRef(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  const selectedLlm = llms?.find((item) => item.id === selectedLlmId);

  const hasActiveConversation =
    messages.length > 0 || selectedConversationId !== "live";

  const latestDecision = hasActiveConversation
    ? selectedLogData?.decision || latestLog?.decision || "ALLOW"
    : "SAFE";

  const latestRisk = hasActiveConversation
    ? selectedLogData?.riskScore ?? latestLog?.riskScore ?? 0
    : 0;

  const triggeredPolicies = hasActiveConversation
    ? selectedLogData?.triggeredPolicies ||
      selectedLogData?.policies ||
      latestLog?.triggeredPolicies ||
      []
    : [];

  const formatConversationTime = (dateValue) => {
    if (!dateValue) return "Recent";

    const date = new Date(dateValue);
    const today = new Date();

    if (date.toDateString() === today.toDateString()) return "Today";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const dynamicConversations = [
    {
      id: "live",
      title: "Live Neurava Validation",
      desc:
        messages.length > 0
          ? `${messages.length} active chat messages`
          : "Current guarded AI conversation",
      time: "Now",
      log: null,
      createdAt: new Date(),
    },
    ...logs.slice(0, 8).map((log, index) => ({
      id: log._id || log.id || `log-${index}`,
      title:
        log.prompt?.length > 35
          ? `${log.prompt.slice(0, 35)}...`
          : log.prompt || `Audit conversation ${index + 1}`,
      desc: `${log.decision || "ALLOW"} · Risk ${log.riskScore || 0}/100`,
      time: formatConversationTime(log.createdAt),
      log,
      createdAt: log.createdAt || new Date(),
    })),
  ];

  const filteredConversations = dynamicConversations.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(conversationSearch.toLowerCase()) ||
      item.desc.toLowerCase().includes(conversationSearch.toLowerCase());

    if (!matchesSearch) return false;

    if (conversationFilter === "All") return true;

    if (conversationFilter === "Today") {
      return item.time === "Today" || item.time === "Now";
    }

    if (conversationFilter === "This Week") {
      const itemDate = new Date(item.createdAt);
      const today = new Date();
      const diffDays = (today - itemDate) / (1000 * 60 * 60 * 24);
      return diffDays <= 7;
    }

    return true;
  });

  const getDecisionStyle = (decision) => {
    if (decision === "BLOCK") {
      return "bg-red-50 text-red-700 border-red-100";
    }

    if (decision === "FLAG") {
      return "bg-orange-50 text-orange-700 border-orange-100";
    }

    if (decision === "REWRITE") {
      return "bg-purple-50 text-purple-700 border-purple-100";
    }

    return "bg-emerald-50 text-emerald-700 border-emerald-100";
  };

  return (
    <NeuravaShell
      active={active}
      setActive={setActive}
      user={user}
      logout={logout}
      subtitle="Runtime AI firewall chat with live validation, risk scoring, and policy visibility."
    >
      <div className="grid h-[calc(100vh-170px)] min-h-0 gap-5 overflow-hidden xl:grid-cols-[300px_minmax(0,1fr)_330px]">
        <aside className="flex min-h-0 flex-col rounded-2xl border bg-white p-5 shadow-sm">
          <div className="shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Conversations</h2>
              <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-700 text-white">
                +
              </button>
            </div>

            <input
              value={conversationSearch}
              onChange={(e) => setConversationSearch(e.target.value)}
              placeholder="Search conversations..."
              className="mt-4 w-full rounded-xl border bg-[#f8fafc] px-4 py-3 text-sm outline-none"
            />

            <div className="mt-4 flex gap-2 border-b text-sm">
              {["All", "Today", "This Week"].map((item) => (
                <button
                  key={item}
                  onClick={() => setConversationFilter(item)}
                  className={`px-3 pb-3 ${
                    conversationFilter === item
                      ? "border-b-2 border-violet-700 font-semibold text-violet-700"
                      : "text-slate-500"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
            {filteredConversations.map((item) => (
              <button
                type="button"
                key={item.id || item.title}
                onClick={() => {
                  setSelectedConversationId(item.id || item.title);

                  if (!item.log) {
                    setSelectedLogData(null);
                    return;
                  }

                  const selectedLog = item.log;
                  setSelectedLogData(selectedLog);

                  setMessages([
                    {
                      role: "user",
                      text:
                        selectedLog.prompt ||
                        selectedLog.input ||
                        item.title ||
                        "",
                    },
                    {
                      role: "ai",
                      text:
                        selectedLog.finalOutput ||
                        selectedLog.rawOutput ||
                        selectedLog.response ||
                        selectedLog.output ||
                        selectedLog.answer ||
                        selectedLog.result ||
                        "No output recorded for this log.",
                      decision: selectedLog.decision || "ALLOW",
                      riskScore: selectedLog.riskScore || 0,
                      triggeredPolicies:
                        selectedLog.triggeredPolicies ||
                        selectedLog.policies ||
                        [],
                      primaryModel: selectedLog.primaryModel || selectedModel,
                      provider: selectedLog.provider || "OPENAI",
                    },
                  ]);
                }}
                className={`block w-full cursor-pointer rounded-xl p-3 text-left transition ${
                  selectedConversationId === (item.id || item.title)
                    ? "bg-violet-50 text-violet-700"
                    : "hover:bg-slate-50"
                }`}
              >
                <div className="flex justify-between gap-3">
                  <p className="font-semibold">{item.title}</p>
                  <span className="text-xs text-slate-400">{item.time}</span>
                </div>

                <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                  {item.desc}
                </p>
              </button>
            ))}
          </div>
        </aside>

        <main className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="border-b px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold">Runtime AI Firewall Chat</h2>

                <select
                  value={selectedLlmId}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    setSelectedLlmId(selectedId);

                    const selected = llms.find(
                      (item) => item.id === selectedId
                    );

                    if (selected?.model) {
                      setSelectedModel(selected.model);
                    }
                  }}
                  className="mt-3 rounded-xl border bg-white px-3 py-2 text-xs outline-none"
                >
                  <option value="">Default OpenAI</option>

                  {llms.map((llm) => (
                    <option key={llm.id} value={llm.id}>
                      {llm.name} · {llm.provider} · {llm.model}
                    </option>
                  ))}
                </select>
              </div>

              <span
                className={`rounded-full border px-3 py-1 text-xs font-bold ${getDecisionStyle(
                  latestDecision
                )}`}
              >
                {latestDecision}
              </span>
            </div>
          </div>

          <div
            ref={chatScrollRef}
            className="min-h-0 overflow-y-auto bg-gradient-to-b from-white to-[#fbfcff] p-6"
          >
            <div className="space-y-5">
              {messages.length === 0 ? (
                <div className="flex h-full min-h-[300px] items-center justify-center text-center">
                  <div>
                    <MessageSquare
                      className="mx-auto text-violet-600"
                      size={42}
                    />
                    <h3 className="mt-4 text-xl font-black">
                      Start a guarded AI conversation
                    </h3>
                    <p className="mt-2 max-w-md text-sm text-slate-500">
                      Neurava will validate each response against hallucination,
                      safety, privacy and runtime policies.
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-5 py-4 shadow-sm ${
                        msg.role === "user"
                          ? "bg-violet-50 text-[#071143]"
                          : "border bg-white"
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-6">
                        {msg.text}
                      </p>

                      {msg.role === "ai" && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span
                            className={`rounded-full border px-2 py-1 text-xs font-semibold ${getDecisionStyle(
                              msg.decision
                            )}`}
                          >
                            {msg.decision || "ALLOW"}
                          </span>

                          {msg.riskScore !== undefined && (
                            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                              Risk {msg.riskScore}/100
                            </span>
                          )}

                          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                            {msg.provider || "OPENAI"} ·{" "}
                            {msg.primaryModel || selectedModel}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="border-t bg-white p-4">
            <div className="mb-3 flex items-center justify-between rounded-xl border bg-emerald-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-emerald-600" />
                <div>
                  <p className="text-sm font-bold text-emerald-700">
                    {latestDecision === "BLOCK"
                      ? "Response blocked"
                      : "Response validated"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {latestDecision === "BLOCK"
                      ? "Runtime policy prevented unsafe output"
                      : "All active checks completed"}
                  </p>
                </div>
              </div>

              <p className="text-sm font-bold text-emerald-700">
                Risk {latestRisk}/100
              </p>
            </div>

            <div className="rounded-2xl border bg-white p-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={loading || !consentAccepted}
                className="h-[70px] w-full resize-none bg-transparent px-2 py-2 text-sm outline-none disabled:opacity-60"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessageWithPrompt();
                  }
                }}
              />

              <div className="flex items-center justify-between border-t pt-3">
                <div className="flex items-center gap-2 text-slate-500">
                  <button className="rounded-lg p-2 hover:bg-slate-100">
                    +
                  </button>
                  <Shield size={18} />
                  <span className="text-xs">
                    Protected by Neurava guardrails
                  </span>
                </div>

                <button
                  onClick={() => sendMessageWithPrompt()}
                  disabled={loading || !input.trim() || !consentAccepted}
                  className="rounded-xl bg-violet-700 px-5 py-3 text-sm font-bold text-white shadow-lg disabled:opacity-50"
                >
                  {loading ? "Validating..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        </main>

        <aside className="min-h-0 space-y-5 overflow-y-auto pr-1">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h3 className="font-bold">Security & Risk</h3>

            <div className="mt-5 flex justify-center">
              <div className="flex h-36 w-36 items-center justify-center rounded-full border-[12px] border-emerald-500">
                <div className="text-center">
                  <p className="text-4xl font-black">{latestRisk}</p>
                  <p className="text-sm text-slate-500">/100</p>
                  <p className="mt-1 text-sm font-bold text-emerald-600">
                    {!hasActiveConversation
                      ? "No Active Risk"
                      : latestRisk >= 70
                      ? "High Risk"
                      : "Low Risk"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h3 className="font-bold">Guardrail Decision</h3>

            <div
              className={`mt-4 rounded-xl border p-4 ${getDecisionStyle(
                latestDecision
              )}`}
            >
              <p className="font-black">{latestDecision}</p>
              <p className="mt-1 text-xs">
                {latestDecision === "BLOCK"
                  ? "Response blocked by runtime policy"
                  : "Response is safe and compliant"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">Triggered Policies</h3>
              <span className="rounded-full bg-violet-50 px-2 py-1 text-xs font-bold text-violet-700">
                {triggeredPolicies.length}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {triggeredPolicies.length === 0 ? (
                <>
                  <div className="flex items-center justify-between rounded-xl border p-3">
                    <span className="text-sm">PII Detection</span>
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                      Passed
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border p-3">
                    <span className="text-sm">Toxicity Check</span>
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                      Passed
                    </span>
                  </div>
                </>
              ) : (
                triggeredPolicies.map((policy) => (
                  <div
                    key={policy}
                    className="rounded-xl border border-red-100 bg-red-50 p-3"
                  >
                    <p className="text-sm font-semibold text-red-700">
                      {policy}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h3 className="font-bold">Metadata</h3>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Model</span>
                <span className="font-semibold">
                  {selectedLlm?.provider || "OPENAI"} ·{" "}
                  {selectedLlm?.model || selectedModel}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Mode</span>
                <span className="font-semibold capitalize">{mode}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Decision</span>
                <span className="font-semibold">{latestDecision}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Logs</span>
                <span className="font-semibold">{logs.length}</span>
              </div>
            </div>

            <button
              onClick={() => setActive("observability")}
              className="mt-5 w-full rounded-xl border border-violet-200 px-4 py-3 text-sm font-bold text-violet-700 hover:bg-violet-50"
            >
              View Full Audit Log
            </button>
          </div>
        </aside>
      </div>
    </NeuravaShell>
  );
}