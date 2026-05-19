import { useEffect, useState } from "react";
import {
  Database,
  Shield,
  Activity,
  Table2,
} from "lucide-react";
import NeuravaShell from "../layout/NeuravaShell";
import { apiGet, apiPost } from "../../config/api";

export default function InventoryDashboard({
  active,
  setActive,
  user,
  logout,
}) {
  const [sources, setSources] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [showAddSource, setShowAddSource] = useState(false);
  const [creatingSource, setCreatingSource] = useState(false);

  const [newSource, setNewSource] = useState({
    name: "",
    type: "POSTGRES",
    owner: "",
    businessDomain: "",
    sensitivity: "INTERNAL",
    description: "",
    tags: "",
  });

  useEffect(() => {
    fetchSources();
    fetchDatasets();
  }, []);

  const fetchSources = async () => {
    try {
      const data = await apiGet("/api/data-sources");
      setSources(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDatasets = async () => {
    try {
      const data = await apiGet("/api/datasets");
      setDatasets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const createSource = async () => {
    try {
      setCreatingSource(true);

      const payload = {
        ...newSource,
        tags: newSource.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      const created = await apiPost("/api/data-sources", payload);

      setSources((prev) => [created, ...prev]);

      setShowAddSource(false);

      setNewSource({
        name: "",
        type: "POSTGRES",
        owner: "",
        businessDomain: "",
        sensitivity: "INTERNAL",
        description: "",
        tags: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to create source");
    } finally {
      setCreatingSource(false);
    }
  };

  const avgQuality =
    datasets.length > 0
      ? Math.round(
          datasets.reduce(
            (acc, item) => acc + (item.qualityScore || 0),
            0
          ) / datasets.length
        )
      : 0;

  const sensitiveAssets = datasets.filter((d) =>
    d.schema?.some((s) => s.sensitivity !== "NONE")
  ).length;

  return (
    <NeuravaShell
      active={active}
      setActive={setActive}
      user={user}
      logout={logout}
      title="Data Inventory"
      subtitle="Register, discover, and manage enterprise data assets."
    >
      <div className="space-y-6">
        <div className="flex justify-end">
          <button
            onClick={() => setShowAddSource(true)}
            className="rounded-xl bg-violet-700 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-violet-800"
          >
            + Add Source
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-3xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Data Sources</p>
                <h2 className="mt-2 text-3xl font-bold">{sources.length}</h2>
              </div>
              <Database className="text-cyan-500" />
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Datasets</p>
                <h2 className="mt-2 text-3xl font-bold">{datasets.length}</h2>
              </div>
              <Table2 className="text-indigo-500" />
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Avg Quality</p>
                <h2 className="mt-2 text-3xl font-bold">{avgQuality}%</h2>
              </div>
              <Activity className="text-green-500" />
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Sensitive Assets</p>
                <h2 className="mt-2 text-3xl font-bold">{sensitiveAssets}</h2>
              </div>
              <Shield className="text-red-500" />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border bg-white shadow-sm overflow-hidden">
          <div className="border-b p-5">
            <h2 className="text-lg font-semibold">Registered Data Sources</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr className="text-left text-sm text-slate-500">
                  <th className="p-4">Source</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Owner</th>
                  <th className="p-4">Domain</th>
                  <th className="p-4">Sensitivity</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {sources.map((source) => (
                  <tr
                    key={source._id}
                    className="border-t hover:bg-slate-50"
                  >
                    <td className="p-4 font-medium">{source.name}</td>

                    <td className="p-4">
                      <span className="rounded-lg bg-cyan-100 px-2 py-1 text-xs font-semibold text-cyan-700">
                        {source.type}
                      </span>
                    </td>

                    <td className="p-4">{source.owner || "Unassigned"}</td>
                    <td className="p-4">{source.businessDomain || "General"}</td>

                    <td className="p-4">
                      <span className="rounded-lg bg-violet-100 px-2 py-1 text-xs font-semibold text-violet-700">
                        {source.sensitivity}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="rounded-lg bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                        {source.status || "ACTIVE"}
                      </span>
                    </td>
                  </tr>
                ))}

                {sources.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-5 text-sm text-slate-500">
                      No data sources registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl border bg-white shadow-sm overflow-hidden">
          <div className="border-b p-5">
            <h2 className="text-lg font-semibold">Dataset Inventory</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr className="text-left text-sm text-slate-500">
                  <th className="p-4">Dataset</th>
                  <th className="p-4">Source</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Rows</th>
                  <th className="p-4">Quality</th>
                  <th className="p-4">Freshness</th>
                </tr>
              </thead>

              <tbody>
                {datasets.map((dataset) => (
                  <tr
                    key={dataset._id}
                    className="border-t hover:bg-slate-50"
                  >
                    <td className="p-4 font-medium">{dataset.name}</td>
                    <td className="p-4">{dataset.sourceId?.name}</td>

                    <td className="p-4">
                      <span className="rounded-lg bg-indigo-100 px-2 py-1 text-xs text-indigo-700">
                        {dataset.type}
                      </span>
                    </td>

                    <td className="p-4">
                      {dataset.rowCount?.toLocaleString()}
                    </td>

                    <td className="p-4 font-semibold text-green-600">
                      {dataset.qualityScore}%
                    </td>

                    <td className="p-4">
                      <span className="rounded-lg bg-green-100 px-2 py-1 text-xs text-green-700">
                        {dataset.freshnessStatus}
                      </span>
                    </td>
                  </tr>
                ))}

                {datasets.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-5 text-sm text-slate-500">
                      No datasets registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showAddSource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Add Data Source</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Register a new enterprise data source.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddSource(false)}
                  className="rounded-xl border px-3 py-2 text-sm"
                >
                  Close
                </button>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Source Name</label>
                  <input
                    value={newSource.name}
                    onChange={(e) =>
                      setNewSource({ ...newSource, name: e.target.value })
                    }
                    className="mt-2 w-full rounded-xl border px-4 py-3 outline-none"
                    placeholder="Customer CRM Database"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Source Type</label>
                  <select
                    value={newSource.type}
                    onChange={(e) =>
                      setNewSource({ ...newSource, type: e.target.value })
                    }
                    className="mt-2 w-full rounded-xl border px-4 py-3 outline-none"
                  >
                    <option value="POSTGRES">POSTGRES</option>
                    <option value="MYSQL">MYSQL</option>
                    <option value="MONGODB">MONGODB</option>
                    <option value="CSV">CSV</option>
                    <option value="API">API</option>
                    <option value="S3">S3</option>
                    <option value="SNOWFLAKE">SNOWFLAKE</option>
                    <option value="BIGQUERY">BIGQUERY</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Owner</label>
                  <input
                    value={newSource.owner}
                    onChange={(e) =>
                      setNewSource({ ...newSource, owner: e.target.value })
                    }
                    className="mt-2 w-full rounded-xl border px-4 py-3 outline-none"
                    placeholder="Data Governance Team"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Business Domain</label>
                  <input
                    value={newSource.businessDomain}
                    onChange={(e) =>
                      setNewSource({
                        ...newSource,
                        businessDomain: e.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-xl border px-4 py-3 outline-none"
                    placeholder="Customer"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Sensitivity</label>
                  <select
                    value={newSource.sensitivity}
                    onChange={(e) =>
                      setNewSource({
                        ...newSource,
                        sensitivity: e.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-xl border px-4 py-3 outline-none"
                  >
                    <option value="PUBLIC">PUBLIC</option>
                    <option value="INTERNAL">INTERNAL</option>
                    <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                    <option value="RESTRICTED">RESTRICTED</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Tags</label>
                  <input
                    value={newSource.tags}
                    onChange={(e) =>
                      setNewSource({ ...newSource, tags: e.target.value })
                    }
                    className="mt-2 w-full rounded-xl border px-4 py-3 outline-none"
                    placeholder="crm, pii, customer"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={newSource.description}
                  onChange={(e) =>
                    setNewSource({
                      ...newSource,
                      description: e.target.value,
                    })
                  }
                  className="mt-2 h-24 w-full rounded-2xl border px-4 py-3 outline-none"
                  placeholder="Describe this data source..."
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowAddSource(false)}
                  className="rounded-xl border px-5 py-3"
                >
                  Cancel
                </button>

                <button
                  onClick={createSource}
                  disabled={creatingSource}
                  className="rounded-xl bg-violet-700 px-5 py-3 font-semibold text-white hover:bg-violet-800 disabled:opacity-50"
                >
                  {creatingSource ? "Creating..." : "Create Source"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </NeuravaShell>
  );
}