import { useEffect, useState } from "react";
import NeuravaShell from "../../components/layout/NeuravaShell";

export default function PrivacyNotices({
  active,
  setActive,
  user,
  logout,
}) {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);

  const [form, setForm] = useState({
    noticeTitle: "",
    purpose: "",
    dataCategories: [],
    retentionPeriod: "",
    lawfulBasis: "Consent",
    appliesToSystems: [],
    dataSharingDetails: "",
    grievanceContact: "",
  });

  const token =
    localStorage.getItem("neuravaToken") ||
    localStorage.getItem("token");

  const fetchNotices = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/privacy-notices",
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      const data = await res.json();

      setNotices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch notices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const createNotice = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:5000/api/privacy-notices",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setNotices((prev) => [data, ...prev]);

        setForm({
          noticeTitle: "",
          purpose: "",
          dataCategories: [],
          retentionPeriod: "",
          lawfulBasis: "Consent",
          appliesToSystems: [],
          dataSharingDetails: "",
          grievanceContact: "",
        });
      }
    } catch (err) {
      console.error("Failed to create notice:", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/privacy-notices/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ status }),
        }
      );

      const updated = await res.json();

      if (res.ok) {
        setNotices((prev) =>
          prev.map((item) =>
            item._id === id ? updated : item
          )
        );
      }
    } catch (err) {
      console.error("Failed to update notice:", err);
    }
  };

  const activeNotices = notices.filter(
    (n) => n.status === "ACTIVE"
  ).length;

  return (
    <NeuravaShell
      active={active}
      setActive={setActive}
      user={user}
      logout={logout}
      title=""
      subtitle="Manage privacy notices, lawful purpose disclosures, and transparency obligations under DPDP."
    >
      <div>
        <h2 className="text-[30px] font-black">
          Privacy Notices
        </h2>

        <p className="mt-2 text-slate-500">
          Configure privacy notices, lawful processing
          purposes, transparency disclosures, and
          DPDP notice obligations.
        </p>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Notices
          </p>

          <p className="mt-3 text-4xl font-black">
            {notices.length}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Active Notices
          </p>

          <p className="mt-3 text-4xl font-black">
            {activeNotices}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Lawful Basis
          </p>

          <p className="mt-3 text-2xl font-black">
            Consent
          </p>
        </div>
      </div>

      <form
        onSubmit={createNotice}
        className="mt-6 rounded-2xl border bg-white p-5 shadow-sm"
      >
        <h3 className="text-lg font-black">
          Create Privacy Notice
        </h3>

        <div className="mt-4 grid gap-4 md:grid-cols-2">

          <input
            value={form.noticeTitle}
            onChange={(e) =>
              setForm({
                ...form,
                noticeTitle: e.target.value,
              })
            }
            placeholder="Notice title"
            className="rounded-xl border px-4 py-3"
            required
          />

          <input
            value={form.retentionPeriod}
            onChange={(e) =>
              setForm({
                ...form,
                retentionPeriod: e.target.value,
              })
            }
            placeholder="Retention period"
            className="rounded-xl border px-4 py-3"
          />

          <input
            value={form.dataCategories.join(", ")}
            onChange={(e) =>
              setForm({
                ...form,
                dataCategories: e.target.value
                  .split(",")
                  .map((v) => v.trim()),
              })
            }
            placeholder="Data categories"
            className="rounded-xl border px-4 py-3"
          />

          <input
            value={form.appliesToSystems.join(", ")}
            onChange={(e) =>
              setForm({
                ...form,
                appliesToSystems: e.target.value
                  .split(",")
                  .map((v) => v.trim()),
              })
            }
            placeholder="Applies to systems"
            className="rounded-xl border px-4 py-3"
          />

          <input
            value={form.grievanceContact}
            onChange={(e) =>
              setForm({
                ...form,
                grievanceContact: e.target.value,
              })
            }
            placeholder="Grievance contact"
            className="rounded-xl border px-4 py-3"
          />

          <select
            value={form.lawfulBasis}
            onChange={(e) =>
              setForm({
                ...form,
                lawfulBasis: e.target.value,
              })
            }
            className="rounded-xl border px-4 py-3"
          >
            <option value="Consent">
              Consent
            </option>

            <option value="Legitimate Use">
              Legitimate Use
            </option>
          </select>

          <textarea
            value={form.purpose}
            onChange={(e) =>
              setForm({
                ...form,
                purpose: e.target.value,
              })
            }
            placeholder="Purpose of processing"
            rows="4"
            className="rounded-xl border px-4 py-3 md:col-span-2"
          />

          <textarea
            value={form.dataSharingDetails}
            onChange={(e) =>
              setForm({
                ...form,
                dataSharingDetails: e.target.value,
              })
            }
            placeholder="Data sharing details"
            rows="4"
            className="rounded-xl border px-4 py-3 md:col-span-2"
          />

        </div>

        <button className="mt-5 rounded-xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white">
          Create Notice
        </button>
      </form>

      <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
        <h3 className="text-lg font-black">
          Notice Register
        </h3>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead>
              <tr className="border-b text-xs uppercase text-slate-500">
                <th className="py-3">Notice</th>
                <th className="py-3">Version</th>
                <th className="py-3">Lawful Basis</th>
                <th className="py-3">Retention</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {notices.map((notice) => (
                <tr
                  key={notice._id}
                  onClick={() => setSelectedNotice(notice)}
                  className="cursor-pointer border-b transition hover:bg-slate-50"
                >
                  <td className="py-3 font-semibold">
                    {notice.noticeTitle}
                  </td>

                  <td className="py-3">
                    {notice.version}
                  </td>

                  <td className="py-3">
                    {notice.lawfulBasis}
                  </td>

                  <td className="py-3">
                    {notice.retentionPeriod}
                  </td>

                  <td className="py-3">
                    <select
                      value={notice.status}
                      onClick={(e) =>
                        e.stopPropagation()
                      }
                      onChange={(e) =>
                        updateStatus(
                          notice._id,
                          e.target.value
                        )
                      }
                      className="rounded-lg border px-3 py-2"
                    >
                      <option value="ACTIVE">
                        ACTIVE
                      </option>

                      <option value="INACTIVE">
                        INACTIVE
                      </option>
                    </select>
                  </td>
                </tr>
              ))}

              {!notices.length && (
                <tr>
                  <td
                    colSpan="5"
                    className="py-6 text-center text-slate-500"
                  >
                    {loading
                      ? "Loading notices..."
                      : "No privacy notices found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">
                  Privacy Notice Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedNotice.noticeTitle}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedNotice(null)
                }
                className="rounded-xl border px-4 py-2 text-sm hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">

              <Detail
                label="Version"
                value={selectedNotice.version}
              />

              <Detail
                label="Lawful Basis"
                value={selectedNotice.lawfulBasis}
              />

              <Detail
                label="Retention"
                value={selectedNotice.retentionPeriod}
              />

              <Detail
                label="Status"
                value={selectedNotice.status}
              />

              <Detail
                label="Data Categories"
                value={
                  selectedNotice.dataCategories?.join(", ") ||
                  "N/A"
                }
              />

              <Detail
                label="Systems"
                value={
                  selectedNotice.appliesToSystems?.join(", ") ||
                  "N/A"
                }
              />

              <Detail
                label="Grievance Contact"
                value={
                  selectedNotice.grievanceContact ||
                  "N/A"
                }
              />

            </div>

            <div className="mt-5 rounded-2xl border bg-slate-50 p-5">
              <p className="text-xs text-slate-500">
                Purpose
              </p>

              <p className="mt-2 text-sm leading-6">
                {selectedNotice.purpose}
              </p>
            </div>

            <div className="mt-5 rounded-2xl border bg-slate-50 p-5">
              <p className="text-xs text-slate-500">
                Data Sharing Details
              </p>

              <p className="mt-2 text-sm leading-6">
                {selectedNotice.dataSharingDetails ||
                  "No sharing details provided."}
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
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-2 font-semibold">
        {value}
      </p>
    </div>
  );
}