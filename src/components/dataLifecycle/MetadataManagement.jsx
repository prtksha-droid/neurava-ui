import { useEffect, useState } from "react";
import {
  Tags,
  Database,
  Shield,
  Brain,
  Search,
} from "lucide-react";
import NeuravaShell from "../layout/NeuravaShell";
export default function MetadataManagement({ active, setActive, user, logout }) {
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/datasets"
      );

      const data = await res.json();

      setDatasets(data);

      if (data.length > 0) {
        setSelectedDataset(data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
  <NeuravaShell
  active={active}
  setActive={setActive}
  user={user}
  logout={logout}
  title="Metadata Management"
  subtitle="Manage business, technical, governance, and AI metadata."
>
    <div className="space-y-6">
      {/* Header */}
      

      {/* Search */}
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Search className="text-slate-400" size={18} />

          <input
            placeholder="Search datasets..."
            className="w-full outline-none text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Dataset List */}
        <div className="col-span-4 rounded-3xl border bg-white shadow-sm">
          <div className="border-b p-4">
            <h2 className="font-semibold">
              Datasets
            </h2>
          </div>

          <div className="max-h-[600px] overflow-y-auto">
            {datasets.map((dataset) => (
              <button
                key={dataset._id}
                onClick={() => setSelectedDataset(dataset)}
                className={`w-full border-b p-4 text-left hover:bg-slate-50 ${
                  selectedDataset?._id === dataset._id
                    ? "bg-indigo-50"
                    : ""
                }`}
              >
                <h3 className="font-medium">
                  {dataset.name}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {dataset.sourceId?.name}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Metadata Details */}
        <div className="col-span-8 space-y-4">
          {/* Business Metadata */}
          <div className="rounded-3xl border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Tags className="text-indigo-500" size={18} />
              <h2 className="font-semibold">
                Business Metadata
              </h2>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-slate-500">
                  Business Definition
                </p>

                <p className="mt-1">
                  Customer order transaction dataset
                  across digital and offline channels.
                </p>
              </div>

              <div>
                <p className="text-slate-500">
                  Business Owner
                </p>

                <p className="mt-1">
                  Data Governance Team
                </p>
              </div>
            </div>
          </div>

          {/* Technical Metadata */}
          <div className="rounded-3xl border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Database className="text-cyan-500" size={18} />
              <h2 className="font-semibold">
                Technical Metadata
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 text-left text-sm text-slate-500">
                  <tr>
                    <th className="p-3">Column</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Nullable</th>
                    <th className="p-3">Sensitivity</th>
                  </tr>
                </thead>

                <tbody>
                  {selectedDataset?.schema?.map((col, idx) => (
                    <tr
                      key={idx}
                      className="border-t"
                    >
                      <td className="p-3">
                        {col.columnName}
                      </td>

                      <td className="p-3">
                        {col.dataType}
                      </td>

                      <td className="p-3">
                        {col.nullable ? "Yes" : "No"}
                      </td>

                      <td className="p-3">
                        <span className="rounded-lg bg-red-100 px-2 py-1 text-xs text-red-700">
                          {col.sensitivity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Governance Metadata */}
          <div className="rounded-3xl border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Shield className="text-red-500" size={18} />
              <h2 className="font-semibold">
                Governance Metadata
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-slate-500">
                  Classification
                </p>

                <p className="mt-1 font-medium">
                  Confidential
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-slate-500">
                  Retention Policy
                </p>

                <p className="mt-1 font-medium">
                  7 Years
                </p>
              </div>
            </div>
          </div>

          {/* AI Metadata */}
          <div className="rounded-3xl border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Brain className="text-violet-500" size={18} />
              <h2 className="font-semibold">
                AI Metadata
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-slate-500">
                  Vectorized
                </p>

                <p className="mt-1 font-medium">
                  Yes
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-slate-500">
                  AI Ready
                </p>

                <p className="mt-1 font-medium">
                  Approved
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</NeuravaShell>
);
}