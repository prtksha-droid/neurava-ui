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

import NeuravaShell from "../../components/layout/NeuravaShell";

export default function AnalyticsPanel({
  logs,
  active,
  setActive,
  user,
  logout,
}) {
  const safeLogs = Array.isArray(logs) ? logs : [];

  const riskData = [
    {
      name: "LOW",
      value: safeLogs.filter((l) => (l.riskScore || 0) < 40).length,
    },
    {
      name: "MEDIUM",
      value: safeLogs.filter(
        (l) => (l.riskScore || 0) >= 40 && (l.riskScore || 0) < 70
      ).length,
    },
    {
      name: "HIGH",
      value: safeLogs.filter(
        (l) => (l.riskScore || 0) >= 70 && (l.riskScore || 0) < 90
      ).length,
    },
    {
      name: "CRITICAL",
      value: safeLogs.filter((l) => (l.riskScore || 0) >= 90).length,
    },
  ];

  const timelineData = safeLogs
    .slice(0, 10)
    .reverse()
    .map((log, index) => ({
      index: index + 1,
      risk: log.riskScore || 0,
    }));

  const modelMap = {};

  safeLogs.forEach((log) => {
    const model = log.primaryModel || "unknown";
    modelMap[model] = (modelMap[model] || 0) + 1;
  });

  const modelData = Object.keys(modelMap).map((key) => ({
    model: key,
    count: modelMap[key],
  }));

  return (
    <NeuravaShell
      active={active}
      setActive={setActive}
      user={user}
      logout={logout}
      subtitle="Analyze AI risk distribution, trends, and model usage across Neurava."
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-[30px] font-black leading-tight tracking-tight">
            Threat Analytics
          </h2>
          <p className="mt-2 max-w-3xl text-base leading-7 text-slate-500">
            Analyze AI risk distribution, trends, and model usage across
            Neurava.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Risk Distribution</h3>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={riskData} dataKey="value" outerRadius={100} label>
                  {riskData.map((entry, index) => (
                    <Cell key={index} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Risk Trend</h3>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <Line type="monotone" dataKey="risk" />
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="index" />
                <YAxis />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Model Usage</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={modelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="model" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </NeuravaShell>
  );
}