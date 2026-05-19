import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import {
  Box,
  CheckCircle,
  Clock,
  Database,
  FileText,
  GitBranch,
  Play,
  Save,
  ShieldCheck,
  Trash2,
  Zap,
} from "lucide-react";

import NeuravaShell from "../../components/layout/NeuravaShell";

const iconMap = {
  database: Database,
  shield: ShieldCheck,
  zap: Zap,
  check: CheckCircle,
  git: GitBranch,
  file: FileText,
  clock: Clock,
  trash: Trash2,
};

const lifecycleComponents = [
  {
    id: "data-ingestion",
    label: "Data Ingestion",
    subtitle: "Ingest data from source systems",
    type: "Amazon S3",
    iconKey: "database",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    id: "data-validation",
    label: "Data Validation",
    subtitle: "Validate schema, format & rules",
    type: "Schema & Rules",
    iconKey: "shield",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    id: "data-processing",
    label: "Data Processing",
    subtitle: "Cleanse, standardize & enrich data",
    type: "Cleansing & Enrichment",
    iconKey: "zap",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
  },
  {
    id: "data-quality",
    label: "Data Quality Check",
    subtitle: "Assess quality & completeness",
    type: "Quality Threshold",
    iconKey: "check",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    id: "data-storage",
    label: "Data Storage",
    subtitle: "Store data in target repositories",
    type: "Snowflake",
    iconKey: "database",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    id: "data-access",
    label: "Data Access",
    subtitle: "Define access & permissions",
    type: "Role-based Access",
    iconKey: "git",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    id: "data-usage",
    label: "Data Usage",
    subtitle: "Enable data for analytics & AI",
    type: "BI / AI / Analytics",
    iconKey: "file",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    id: "data-retention",
    label: "Data Retention",
    subtitle: "Define retention & archival rules",
    type: "7 Years Retention",
    iconKey: "clock",
    color: "text-pink-600",
    bg: "bg-pink-50",
  },
  {
    id: "data-deletion",
    label: "Data Deletion",
    subtitle: "Securely delete or anonymize data",
    type: "Secure Deletion",
    iconKey: "trash",
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    id: "policy-enforcement",
    label: "Policy Enforcement",
    subtitle: "Apply governance and exception handling",
    type: "Data Governance",
    iconKey: "shield",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
];

const initialNodes = [
  {
    id: "1",
    type: "lifecycleNode",
    position: { x: 40, y: 130 },
    data: lifecycleComponents[0],
  },
  {
    id: "2",
    type: "lifecycleNode",
    position: { x: 260, y: 130 },
    data: lifecycleComponents[1],
  },
  {
    id: "3",
    type: "lifecycleNode",
    position: { x: 480, y: 130 },
    data: lifecycleComponents[2],
  },
  {
    id: "4",
    type: "lifecycleNode",
    position: { x: 700, y: 130 },
    data: lifecycleComponents[3],
  },
  {
    id: "5",
    type: "lifecycleNode",
    position: { x: 440, y: 300 },
    data: lifecycleComponents[4],
  },
  {
    id: "6",
    type: "lifecycleNode",
    position: { x: 440, y: 420 },
    data: lifecycleComponents[5],
  },
  {
    id: "7",
    type: "lifecycleNode",
    position: { x: 440, y: 540 },
    data: lifecycleComponents[6],
  },
  {
    id: "8",
    type: "lifecycleNode",
    position: { x: 440, y: 660 },
    data: lifecycleComponents[7],
  },
  {
    id: "9",
    type: "lifecycleNode",
    position: { x: 440, y: 780 },
    data: lifecycleComponents[8],
  },
  {
    id: "10",
    type: "lifecycleNode",
    position: { x: 770, y: 300 },
    data: lifecycleComponents[9],
  },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e2-3", source: "2", target: "3", animated: true },
  { id: "e3-4", source: "3", target: "4", animated: true },
  {
    id: "e4-5",
    source: "4",
    target: "5",
    label: "Pass",
    animated: true,
    style: { strokeDasharray: "6 6" },
  },
  {
    id: "e4-10",
    source: "4",
    target: "10",
    label: "Fail",
    animated: true,
    style: { strokeDasharray: "6 6", stroke: "#ef4444" },
  },
  { id: "e5-6", source: "5", target: "6", animated: true },
  { id: "e6-7", source: "6", target: "7", animated: true },
  { id: "e7-8", source: "7", target: "8", animated: true },
  { id: "e8-9", source: "8", target: "9", animated: true },
  {
    id: "e10-5",
    source: "10",
    target: "5",
    animated: true,
    style: { strokeDasharray: "6 6" },
  },
];

function normalizeNode(node) {
  if (!node?.data) return node;

  return {
    ...node,
    type: "lifecycleNode",
    data: {
      ...node.data,
      iconKey: node.data.iconKey || "database",
    },
  };
}

function LifecycleNode({ data }) {
  const Icon = iconMap[data.iconKey] || Box;

  return (
    <div className="min-w-[170px] rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <Handle type="target" position={Position.Left} />

      <div className="flex items-center gap-3">
        <div className={`rounded-lg ${data.bg || "bg-slate-100"} p-2`}>
          <Icon size={16} className={data.color || "text-slate-600"} />
        </div>

        <div>
          <div className="text-xs font-semibold text-slate-900">
            {data.label}
          </div>
          <div className="text-[10px] text-slate-500">{data.type}</div>
        </div>
      </div>

      <Handle type="source" position={Position.Right} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  );
}

function WorkflowStudioInner({ active, setActive, user, logout, token }) {
  const { screenToFlowPosition } = useReactFlow();

  const [workflowName, setWorkflowName] = useState(
    "Customer 360 Data Lifecycle"
  );
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(initialNodes[3]);
  const [savedWorkflows, setSavedWorkflows] = useState([]);
  const [currentWorkflowId, setCurrentWorkflowId] = useState(null);

  const nodeTypes = useMemo(() => ({ lifecycleNode: LifecycleNode }), []);

  const selectedData = selectedNode?.data;
  const SelectedIcon = iconMap[selectedData?.iconKey] || Box;

  const loadWorkflows = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/workflows");

    const data = await res.json();

    setSavedWorkflows(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Failed to load workflows", err);
  }
};

  useEffect(() => {
    loadWorkflows();
  }, []);

  const onNodesChange = useCallback((changes) => {
    setNodes((current) => applyNodeChanges(changes, current));
  }, []);

  const onEdgesChange = useCallback((changes) => {
    setEdges((current) => applyEdgeChanges(changes, current));
  }, []);

  const onConnect = useCallback((params) => {
    setEdges((current) => addEdge({ ...params, animated: true }, current));
  }, []);

  const onDragStart = (event, component) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(component)
    );
    event.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const raw = event.dataTransfer.getData("application/reactflow");
      if (!raw) return;

      const component = JSON.parse(raw);

      const newNode = {
        id: `${Date.now()}`,
        type: "lifecycleNode",
        position: screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        }),
        data: component,
      };

      setNodes((current) => [...current, newNode]);
      setSelectedNode(newNode);
    },
    [screenToFlowPosition]
  );

 const saveWorkflow = async () => {
  try {
    const cleanNodes = nodes.map((node) => ({
      ...node,
      data: {
        id: node.data?.id,
        label: node.data?.label,
        subtitle: node.data?.subtitle,
        type: node.data?.type,
        iconKey: node.data?.iconKey || "database",
        color: node.data?.color,
        bg: node.data?.bg,
      },
    }));

    const endpoint = currentWorkflowId
      ? `http://localhost:5000/api/workflows/${currentWorkflowId}`
      : "http://localhost:5000/api/workflows";

    const method = currentWorkflowId ? "PUT" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: workflowName,
        nodes: cleanNodes,
        edges,
        status: "DRAFT",
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to save workflow");
    }

    const savedWorkflow = await res.json();

    if (savedWorkflow?._id) {
      setCurrentWorkflowId(savedWorkflow._id);
    }

    alert("Workflow saved successfully");

    loadWorkflows();
  } catch (err) {
    alert(err.message || "Unable to save workflow");
  }
};

  const openSavedWorkflow = (workflow) => {
    const restoredNodes = (workflow.nodes || []).map(normalizeNode);

    setWorkflowName(workflow.name);
    setCurrentWorkflowId(workflow._id);
    setNodes(restoredNodes);
    setEdges(workflow.edges || []);
    setSelectedNode(restoredNodes[0] || null);
  };

  const deleteSelectedNode = () => {
    if (!selectedNode) return;

    setNodes((current) =>
      current.filter((node) => node.id !== selectedNode.id)
    );

    setEdges((current) =>
      current.filter(
        (edge) =>
          edge.source !== selectedNode.id && edge.target !== selectedNode.id
      )
    );

    setSelectedNode(null);
  };

  return (
    <NeuravaShell
      active={active}
      setActive={setActive}
      user={user}
      logout={logout}
    >
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-medium text-violet-700">
              ← All Lifecycles
            </p>

            <div className="mt-3 flex items-center gap-3">
              <input
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="w-full max-w-md bg-transparent text-2xl font-bold text-slate-900 outline-none"
              />

              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Active
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Version 1.0 · Last updated 2h ago by{" "}
              {user?.name || user?.fullName || "Admin"}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={saveWorkflow}
              className="rounded-xl border border-violet-200 bg-white px-5 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-50"
            >
              <Save size={15} className="mr-2 inline" />
              Save as Draft
            </button>

            <button className="rounded-xl border border-violet-200 bg-white px-5 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-50">
              <CheckCircle size={15} className="mr-2 inline" />
              Validate
            </button>

            <button className="rounded-xl bg-violet-700 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-800">
              <Play size={15} className="mr-2 inline" />
              Publish Lifecycle
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          <div className="xl:col-span-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900">
                Lifecycle Components
              </h2>

              <p className="mb-4 text-xs text-slate-500">
                Drag and drop components to the canvas
              </p>

              <div className="space-y-3">
                {lifecycleComponents.map((component) => {
                  const Icon = iconMap[component.iconKey] || Box;

                  return (
                    <div
                      key={component.id}
                      draggable
                      onDragStart={(event) => onDragStart(event, component)}
                      className="cursor-grab rounded-xl border border-slate-200 bg-white p-3 transition hover:border-violet-300 hover:bg-violet-50 active:cursor-grabbing"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`rounded-lg ${component.bg} p-2`}>
                          <Icon size={16} className={component.color} />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {component.label}
                          </p>
                          <p className="text-xs text-slate-500">
                            {component.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <h3 className="mb-3 text-xs font-semibold text-slate-900">
                  Saved Workflows
                </h3>

                <div className="space-y-2">
                  {savedWorkflows.slice(0, 5).map((workflow) => (
                    <button
                      key={workflow._id}
                      onClick={() => openSavedWorkflow(workflow)}
                      className="w-full rounded-lg border border-slate-200 bg-white p-3 text-left hover:border-violet-300 hover:bg-violet-50"
                    >
                      <p className="text-sm font-semibold text-slate-800">
                        {workflow.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {workflow.nodes?.length || 0} steps
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-slate-50 p-3">
                <h3 className="text-xs font-semibold text-slate-900">
                  Connectors
                </h3>

                <p className="mb-3 text-xs text-slate-500">
                  Drag from node handles to create connections
                </p>

                <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-700">
                  <GitBranch size={15} className="mr-2 inline text-violet-600" />
                  Conditional Path
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
                  <span>↶</span>
                  <span>↷</span>
                  <span className="mx-2">−</span>
                  <span>100%</span>
                  <span className="mx-2">+</span>
                </div>

                <label className="flex items-center gap-2 text-xs text-slate-600">
                  <input type="checkbox" defaultChecked />
                  Show labels
                </label>
              </div>

              <div className="h-[650px] overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  nodeTypes={nodeTypes}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onNodeClick={(_, node) => setSelectedNode(node)}
                  nodesDraggable
                  nodesConnectable
                  elementsSelectable
                  fitView
                >
                  <Background gap={18} size={1} />
                  <Controls />
                  <MiniMap zoomable pannable />
                </ReactFlow>
              </div>
            </div>
          </div>

          <div className="xl:col-span-3">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-4">
                <h2 className="text-sm font-bold text-slate-900">
                  Component Properties
                </h2>

                <div className="mt-4 flex gap-6 text-sm">
                  <span className="border-b-2 border-violet-700 pb-2 font-semibold text-violet-700">
                    General
                  </span>
                  <span className="pb-2 text-slate-500">Advanced</span>
                </div>
              </div>

              {selectedData ? (
                <div className="space-y-4 p-4">
                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-lg ${selectedData.bg} p-2`}>
                        <SelectedIcon
                          size={18}
                          className={selectedData.color}
                        />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          {selectedData.label}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {selectedData.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600">
                      Step Name
                    </label>
                    <input
                      value={selectedData.label}
                      readOnly
                      className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600">
                      Description
                    </label>
                    <textarea
                      value={selectedData.subtitle}
                      readOnly
                      className="mt-2 min-h-20 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600">
                      Quality Rules
                    </label>
                    <div className="mt-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700">
                      3 rules selected ›
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600">
                      Success Path
                    </label>
                    <div className="mt-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700">
                      🟢 Data Storage
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600">
                      Failure Path
                    </label>
                    <div className="mt-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700">
                      🔴 Policy Enforcement
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600">
                      Owner
                    </label>
                    <select className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                      <option>Data Governance Team</option>
                      <option>AI Trust Team</option>
                      <option>Security Team</option>
                    </select>
                  </div>

                  <button
                    onClick={deleteSelectedNode}
                    className="w-full rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={15} className="mr-2 inline" />
                    Delete Component
                  </button>
                </div>
              ) : (
                <div className="p-4 text-sm text-slate-500">
                  Select a component from the canvas.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-5">
          <div>
            <p className="text-xs text-slate-500">Validation Status</p>
            <p className="mt-1 text-sm font-semibold text-emerald-600">
              <CheckCircle size={15} className="mr-1 inline" />
              No issues found
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Total Steps</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {nodes.length}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Conditional Paths</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {edges.filter((edge) => edge.label).length}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Last Validated</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">2h ago</p>
          </div>

          <div className="flex gap-3 md:justify-end">
            <button className="rounded-xl border border-violet-200 px-4 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-50">
              Test Workflow
            </button>

            <button className="rounded-xl border border-violet-200 px-4 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-50">
              Execution History
            </button>
          </div>
        </div>
      </div>
    </NeuravaShell>
  );
}

export default function WorkflowStudio(props) {
  return (
    <ReactFlowProvider>
      <WorkflowStudioInner {...props} />
    </ReactFlowProvider>
  );
}