import { useEffect, useState } from "react";
import {
  Database,
  GitBranch,
  Bot,
  FileText,
  Cpu,
} from "lucide-react";

import NeuravaShell from "../layout/NeuravaShell";

export default function DataLineage({
  active,
  setActive,
  user,
  logout,
}) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    fetchGraph();
  }, []);

  const fetchGraph = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/lineage/graph"
      );

      const data = await res.json();

      setNodes(data.nodes || []);
      setEdges(data.edges || []);
    } catch (err) {
      console.error(err);
    }
  };

  const getNodeIcon = (type) => {
    switch (type) {
      case "SOURCE":
        return <Database size={18} />;
      case "DATASET":
        return <FileText size={18} />;
      case "AI_MODEL":
        return <Bot size={18} />;
      case "TRANSFORMATION":
        return <GitBranch size={18} />;
      default:
        return <Cpu size={18} />;
    }
  };

  return (
    <NeuravaShell
      active={active}
      setActive={setActive}
      user={user}
      logout={logout}
      title="Data Lineage"
      subtitle="Track how enterprise data moves across systems, AI pipelines, and reports."
    >
      <div className="space-y-6">
        {/* Overview */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-3xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Total Nodes
            </p>

            <h2 className="mt-2 text-3xl font-black">
              {nodes.length}
            </h2>
          </div>

          <div className="rounded-3xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Total Relationships
            </p>

            <h2 className="mt-2 text-3xl font-black">
              {edges.length}
            </h2>
          </div>

          <div className="rounded-3xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              AI Connected Assets
            </p>

            <h2 className="mt-2 text-3xl font-black">
              {
                nodes.filter(
                  (n) => n.nodeType === "AI_MODEL"
                ).length
              }
            </h2>
          </div>
        </div>

        {/* Nodes */}
        <div className="rounded-3xl border bg-white shadow-sm overflow-hidden">
          <div className="border-b p-5">
            <h2 className="text-lg font-semibold">
              Lineage Nodes
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
            {nodes.map((node) => (
              <div
                key={node._id}
                className="rounded-2xl border border-slate-200 p-4 transition hover:border-violet-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-violet-50 p-3 text-violet-700">
                      {getNodeIcon(node.nodeType)}
                    </div>

                    <div>
                      <h3 className="font-semibold">
                        {node.name}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {node.nodeType}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-sm text-slate-600">
                  {node.description || "No description available"}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                    {node.owner}
                  </span>

                  <span className="text-xs text-slate-400">
                    Connected
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Relationships */}
        <div className="rounded-3xl border bg-white shadow-sm overflow-hidden">
          <div className="border-b p-5">
            <h2 className="text-lg font-semibold">
              Data Flow Relationships
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr className="text-left text-sm text-slate-500">
                  <th className="p-4">From</th>
                  <th className="p-4">Relationship</th>
                  <th className="p-4">To</th>
                </tr>
              </thead>

              <tbody>
                {edges.map((edge) => (
                  <tr
                    key={edge._id}
                    className="border-t hover:bg-slate-50"
                  >
                    <td className="p-4 font-medium">
                      {edge.fromNode?.name}
                    </td>

                    <td className="p-4">
                      <span className="rounded-lg bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                        {edge.relationshipType}
                      </span>
                    </td>

                    <td className="p-4 font-medium">
                      {edge.toNode?.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </NeuravaShell>
  );
}