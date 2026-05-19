import { useEffect, useState } from "react";
import {
  CheckCircle,
  AlertTriangle,
  ShieldCheck,
  ListChecks,
} from "lucide-react";
import NeuravaShell from "../layout/NeuravaShell";
import { apiGet, apiPost } from "../../config/api";


export default function DataQuality({ active, setActive, user, logout }) {
  const [rules, setRules] = useState([]);
  const [results, setResults] = useState([]);
  const [datasets, setDatasets] = useState([]);
const [showAddRule, setShowAddRule] = useState(false);
const [runningScan, setRunningScan] = useState(false);
const [selectedRuleId, setSelectedRuleId] = useState("");

const [newRule, setNewRule] = useState({
  datasetId: "",
  datasetName: "",
  ruleName: "",
  ruleType: "NULL_CHECK",
  columnName: "",
  severity: "MEDIUM",
  threshold: 0,
  description: "",
});

  useEffect(() => {
     fetchDatasets();
    fetchRules();
    fetchResults();
  }, []);
  
  const fetchDatasets = async () => {
  try {
    const data = await apiGet("/api/datasets");
    setDatasets(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error(err);
  }
};

const fetchRules = async () => {
  try {
    const data = await apiGet("/api/data-quality/rules");
    setRules(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error(err);
  }
};

const fetchResults = async () => {
  try {
    const data = await apiGet("/api/data-quality/results");
    setResults(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error(err);
  }
};
  
  const createRule = async () => {
  try {
    const selectedDataset = datasets.find(
      (dataset) => dataset._id === newRule.datasetId
    );

    const payload = {
      ...newRule,
      datasetName: selectedDataset?.name || newRule.datasetName,
    };

    await apiPost("/api/data-quality/rules", payload);

    setShowAddRule(false);

    setNewRule({
      datasetId: "",
      datasetName: "",
      ruleName: "",
      ruleType: "NULL_CHECK",
      columnName: "",
      severity: "MEDIUM",
      threshold: 0,
      description: "",
    });

    fetchRules();
  } catch (err) {
    console.error(err);
  }
};

const runQualityScan = async () => {
  try {
    setRunningScan(true);

    await apiPost("/api/data-quality/run", {
      ruleId: selectedRuleId,
    });

    await fetchResults();
  } catch (err) {
    console.error(err);
  } finally {
    setRunningScan(false);
  }
};

  const failedCount = results.filter((r) => r.result === "FAILED").length;

  const avgScore =
    results.length > 0
      ? Math.round(
          results.reduce((sum, item) => sum + (item.score || 0), 0) /
            results.length
        )
      : 0;

  return (
    <NeuravaShell
      active={active}
      setActive={setActive}
      user={user}
      logout={logout}
      title="Data Quality"
      subtitle="Monitor completeness, validity, freshness, duplication, and trustworthiness of enterprise data."
    >
      <div className="space-y-6">
      

  <div className="flex justify-end gap-3">
  <select
    value={selectedRuleId}
    onChange={(e) => setSelectedRuleId(e.target.value)}
    className="rounded-xl border bg-white px-4 py-3 text-sm outline-none"
  >
    <option value="">All Active Rules</option>

    {rules.map((rule) => (
      <option key={rule._id} value={rule._id}>
        {rule.ruleName} · {rule.datasetName}
      </option>
    ))}
  </select>

  <button
    onClick={runQualityScan}
    disabled={runningScan}
    className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
  >
    {runningScan ? "Running Scan..." : "Run Selected Scan"}
  </button>

  <button
    onClick={() => setShowAddRule(true)}
    className="rounded-xl bg-violet-700 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-violet-800"
  >
    + Add Quality Rule
  </button>
</div>

  <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        
          <div className="rounded-3xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Quality Rules</p>
            <h2 className="mt-2 text-3xl font-black">{rules.length}</h2>
          </div>

          <div className="rounded-3xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Quality Results</p>
            <h2 className="mt-2 text-3xl font-black">{results.length}</h2>
          </div>

          <div className="rounded-3xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Failed Checks</p>
            <h2 className="mt-2 text-3xl font-black text-red-600">
              {failedCount}
            </h2>
          </div>

          <div className="rounded-3xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Avg Quality Score</p>
            <h2 className="mt-2 text-3xl font-black text-emerald-600">
              {avgScore}%
            </h2>
          </div>
        </div>

        <div className="rounded-3xl border bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b p-5">
            <ListChecks size={18} className="text-violet-700" />
            <h2 className="text-lg font-semibold">Quality Rules</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 text-left text-sm text-slate-500">
                <tr>
                  <th className="p-4">Rule</th>
                  <th className="p-4">Dataset</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Column</th>
                  <th className="p-4">Severity</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {rules.map((rule) => (
                  <tr key={rule._id} className="border-t hover:bg-slate-50">
                    <td className="p-4 font-medium">{rule.ruleName}</td>
                    <td className="p-4">{rule.datasetName}</td>
                    <td className="p-4">{rule.ruleType}</td>
                    <td className="p-4">{rule.columnName || "-"}</td>
                    <td className="p-4">
                      <span className="rounded-lg bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-700">
                        {rule.severity}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="rounded-lg bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                        {rule.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {rules.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-5 text-sm text-slate-500">
                      No quality rules created yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl border bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b p-5">
            <ShieldCheck size={18} className="text-emerald-600" />
            <h2 className="text-lg font-semibold">Quality Results</h2>
          </div>

          <div className="space-y-3 p-5">
            {results.map((result) => {
              const failed = result.result === "FAILED";

              return (
                <div
                  key={result._id}
                  className={`rounded-2xl border p-4 ${
                    failed
                      ? "border-red-100 bg-red-50"
                      : "border-emerald-100 bg-emerald-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        {failed ? (
                          <AlertTriangle size={18} className="text-red-600" />
                        ) : (
                          <CheckCircle size={18} className="text-emerald-600" />
                        )}

                        <h3 className="font-bold">{result.ruleName}</h3>
                      </div>

                      <p className="mt-2 text-sm text-slate-600">
                        {result.details}
                      </p>

                      <p className="mt-2 text-xs text-slate-500">
                        Dataset: {result.datasetName}
                      </p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`rounded-lg px-3 py-1 text-xs font-bold ${
                          failed
                            ? "bg-red-100 text-red-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {result.result}
                      </span>

                      <p className="mt-3 text-2xl font-black">
                        {result.score}%
                      </p>

                      <p className="text-xs text-slate-500">
                        Issues: {result.issueCount}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {results.length === 0 && (
              <p className="rounded-2xl border bg-slate-50 p-5 text-sm text-slate-500">
                No quality results available yet.
              </p>
            )}
          </div>
        </div>
      </div>
      {showAddRule && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Add Quality Rule</h2>
          <p className="mt-1 text-sm text-slate-500">
            Create a validation rule for a dataset
          </p>
        </div>

        <button
          onClick={() => setShowAddRule(false)}
          className="rounded-xl border px-3 py-2 text-sm"
        >
          Close
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Dataset</label>
          <select
            value={newRule.datasetId}
            onChange={(e) => {
              const selected = datasets.find((d) => d._id === e.target.value);

              setNewRule({
                ...newRule,
                datasetId: e.target.value,
                datasetName: selected?.name || "",
              });
            }}
            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none"
          >
            <option value="">Select dataset</option>
            {datasets.map((dataset) => (
              <option key={dataset._id} value={dataset._id}>
                {dataset.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Rule Name</label>
          <input
            value={newRule.ruleName}
            onChange={(e) =>
              setNewRule({ ...newRule, ruleName: e.target.value })
            }
            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none"
            placeholder="No Null Customer Email"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Rule Type</label>
          <select
            value={newRule.ruleType}
            onChange={(e) =>
              setNewRule({ ...newRule, ruleType: e.target.value })
            }
            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none"
          >
            <option value="NULL_CHECK">NULL_CHECK</option>
            <option value="DUPLICATE_CHECK">DUPLICATE_CHECK</option>
            <option value="FRESHNESS_CHECK">FRESHNESS_CHECK</option>
            <option value="SCHEMA_CHECK">SCHEMA_CHECK</option>
            <option value="PII_CHECK">PII_CHECK</option>
            <option value="CUSTOM">CUSTOM</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Column Name</label>
          <input
            value={newRule.columnName}
            onChange={(e) =>
              setNewRule({ ...newRule, columnName: e.target.value })
            }
            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none"
            placeholder="customer_email"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Severity</label>
          <select
            value={newRule.severity}
            onChange={(e) =>
              setNewRule({ ...newRule, severity: e.target.value })
            }
            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none"
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Threshold</label>
          <input
            type="number"
            value={newRule.threshold}
            onChange={(e) =>
              setNewRule({
                ...newRule,
                threshold: Number(e.target.value),
              })
            }
            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium">Description</label>
        <textarea
          value={newRule.description}
          onChange={(e) =>
            setNewRule({ ...newRule, description: e.target.value })
          }
          className="mt-2 h-24 w-full rounded-2xl border px-4 py-3 outline-none"
          placeholder="Describe the quality rule..."
        />
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => setShowAddRule(false)}
          className="rounded-xl border px-5 py-3"
        >
          Cancel
        </button>

        <button
          onClick={createRule}
          className="rounded-xl bg-violet-700 px-5 py-3 font-semibold text-white hover:bg-violet-800"
        >
          Save Rule
        </button>
      </div>
    </div>
  </div>
)}
    </NeuravaShell>
  );
}