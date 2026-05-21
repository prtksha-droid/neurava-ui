import { useEffect, useState } from "react";
import NeuravaShell from "../../components/layout/NeuravaShell";
import Badge from "../../components/ui/Badge";

export default function VendorProcessors({
  active,
  setActive,
  user,
  logout,
}) {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const [form, setForm] = useState({
    vendorName: "",
    processorType: "AI_PROVIDER",
    dataProcessed: [],
    country: "",
    contractStatus: "NOT_STARTED",
    dpaStatus: "NOT_STARTED",
    riskLevel: "MEDIUM",
    approvalStatus: "PENDING",
    notes: "",
  });

  const token =
    localStorage.getItem("neuravaToken") ||
    localStorage.getItem("token");

  const fetchVendors = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/vendor-processors", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const data = await res.json();
      setVendors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch vendors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const createVendor = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/vendor-processors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setVendors((prev) => [data, ...prev]);

        setForm({
          vendorName: "",
          processorType: "AI_PROVIDER",
          dataProcessed: [],
          country: "",
          contractStatus: "NOT_STARTED",
          dpaStatus: "NOT_STARTED",
          riskLevel: "MEDIUM",
          approvalStatus: "PENDING",
          notes: "",
        });
      }
    } catch (err) {
      console.error("Failed to create vendor:", err);
    }
  };

  const updateVendorStatus = async (id, patch) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/vendor-processors/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(patch),
        }
      );

      const updated = await res.json();

      if (res.ok) {
        setVendors((prev) =>
          prev.map((item) => (item._id === id ? updated : item))
        );
      }
    } catch (err) {
      console.error("Failed to update vendor:", err);
    }
  };

  const approvedCount = vendors.filter(
    (v) => v.approvalStatus === "APPROVED"
  ).length;

  const signedDpaCount = vendors.filter(
    (v) => v.dpaStatus === "SIGNED"
  ).length;

  const highRiskCount = vendors.filter(
    (v) => v.riskLevel === "HIGH" || v.riskLevel === "CRITICAL"
  ).length;

  return (
    <NeuravaShell
      active={active}
      setActive={setActive}
      user={user}
      logout={logout}
      title=""
      subtitle="Manage AI vendors, processors, DPA status, contract status, country risk, and approval governance."
    >
      <div>
        <h2 className="text-[30px] font-black">Vendor Governance</h2>
        <p className="mt-2 text-slate-500">
          Track third-party processors, AI providers, DPA status, contract
          readiness, approval status, and cross-border governance.
        </p>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Vendors</p>
          <p className="mt-3 text-4xl font-black">{vendors.length}</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Approved</p>
          <p className="mt-3 text-4xl font-black">{approvedCount}</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">DPA Signed</p>
          <p className="mt-3 text-4xl font-black">{signedDpaCount}</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">High Risk</p>
          <p className="mt-3 text-4xl font-black">{highRiskCount}</p>
        </div>
      </div>

      <form
        onSubmit={createVendor}
        className="mt-6 rounded-2xl border bg-white p-5 shadow-sm"
      >
        <h3 className="text-lg font-black">Create Vendor Processor</h3>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <input
            value={form.vendorName}
            onChange={(e) =>
              setForm({ ...form, vendorName: e.target.value })
            }
            placeholder="Vendor name"
            className="rounded-xl border px-4 py-3"
            required
          />

          <input
            value={form.country}
            onChange={(e) =>
              setForm({ ...form, country: e.target.value })
            }
            placeholder="Country"
            className="rounded-xl border px-4 py-3"
          />

          <select
            value={form.processorType}
            onChange={(e) =>
              setForm({ ...form, processorType: e.target.value })
            }
            className="rounded-xl border px-4 py-3"
          >
            <option value="AI_PROVIDER">AI Provider</option>
            <option value="CLOUD">Cloud</option>
            <option value="ANALYTICS">Analytics</option>
            <option value="SECURITY">Security</option>
            <option value="OTHER">Other</option>
          </select>

          <input
            value={form.dataProcessed.join(", ")}
            onChange={(e) =>
              setForm({
                ...form,
                dataProcessed: e.target.value
                  .split(",")
                  .map((v) => v.trim())
                  .filter(Boolean),
              })
            }
            placeholder="Data processed"
            className="rounded-xl border px-4 py-3"
          />

          <select
            value={form.contractStatus}
            onChange={(e) =>
              setForm({ ...form, contractStatus: e.target.value })
            }
            className="rounded-xl border px-4 py-3"
          >
            <option value="NOT_STARTED">Contract Not Started</option>
            <option value="IN_REVIEW">Contract In Review</option>
            <option value="SIGNED">Contract Signed</option>
            <option value="EXPIRED">Contract Expired</option>
          </select>

          <select
            value={form.dpaStatus}
            onChange={(e) =>
              setForm({ ...form, dpaStatus: e.target.value })
            }
            className="rounded-xl border px-4 py-3"
          >
            <option value="NOT_STARTED">DPA Not Started</option>
            <option value="IN_REVIEW">DPA In Review</option>
            <option value="SIGNED">DPA Signed</option>
            <option value="NOT_REQUIRED">DPA Not Required</option>
          </select>

          <select
            value={form.riskLevel}
            onChange={(e) =>
              setForm({ ...form, riskLevel: e.target.value })
            }
            className="rounded-xl border px-4 py-3"
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>

          <select
            value={form.approvalStatus}
            onChange={(e) =>
              setForm({ ...form, approvalStatus: e.target.value })
            }
            className="rounded-xl border px-4 py-3"
          >
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
          </select>

          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Notes"
            className="rounded-xl border px-4 py-3 md:col-span-2"
            rows="4"
          />
        </div>

        <button className="mt-5 rounded-xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white">
          Create Vendor
        </button>
      </form>

      <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
        <h3 className="text-lg font-black">Vendor Register</h3>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead>
              <tr className="border-b text-xs uppercase text-slate-500">
                <th className="py-3">Vendor</th>
                <th className="py-3">Type</th>
                <th className="py-3">Country</th>
                <th className="py-3">Risk</th>
                <th className="py-3">Contract</th>
                <th className="py-3">DPA</th>
                <th className="py-3">Approval</th>
              </tr>
            </thead>

            <tbody>
              {vendors.map((vendor) => (
                <tr
                  key={vendor._id}
                  onClick={() => setSelectedVendor(vendor)}
                  className="cursor-pointer border-b transition hover:bg-slate-50"
                >
                  <td className="py-3 font-semibold">{vendor.vendorName}</td>
                  <td className="py-3">{vendor.processorType}</td>
                  <td className="py-3">{vendor.country || "N/A"}</td>
                  <td className="py-3">
                    <Badge>{vendor.riskLevel}</Badge>
                  </td>
                  <td className="py-3">{vendor.contractStatus}</td>
                  <td className="py-3">{vendor.dpaStatus}</td>
                  <td className="py-3">
                    <select
                      value={vendor.approvalStatus}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateVendorStatus(vendor._id, {
                          approvalStatus: e.target.value,
                          contractStatus: vendor.contractStatus,
                          dpaStatus: vendor.dpaStatus,
                          riskLevel: vendor.riskLevel,
                        })
                      }
                      className="rounded-lg border px-3 py-2"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </td>
                </tr>
              ))}

              {!vendors.length && (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-slate-500">
                    {loading ? "Loading vendors..." : "No vendors found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">
                  Vendor Processor Details
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedVendor.vendorName}
                </p>
              </div>

              <button
                onClick={() => setSelectedVendor(null)}
                className="rounded-xl border px-4 py-2 text-sm hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Detail label="Vendor" value={selectedVendor.vendorName} />
              <Detail label="Type" value={selectedVendor.processorType} />
              <Detail label="Country" value={selectedVendor.country || "N/A"} />
              <Detail label="Risk Level" value={selectedVendor.riskLevel} />
              <Detail
                label="Contract Status"
                value={selectedVendor.contractStatus}
              />
              <Detail label="DPA Status" value={selectedVendor.dpaStatus} />
              <Detail
                label="Approval Status"
                value={selectedVendor.approvalStatus}
              />
              <Detail
                label="Data Processed"
                value={selectedVendor.dataProcessed?.join(", ") || "N/A"}
              />
            </div>

            <div className="mt-5 rounded-2xl border bg-slate-50 p-5">
              <p className="text-xs text-slate-500">Notes</p>
              <p className="mt-2 text-sm leading-6">
                {selectedVendor.notes || "No notes recorded."}
              </p>
            </div>
          </div>
        </div>
      )}
    </NeuravaShell>
  );
}

function Detail({ label, value }) {
  return (
    <div className="rounded-2xl border bg-slate-50 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-2 font-semibold">{value}</p>
    </div>
  );
}