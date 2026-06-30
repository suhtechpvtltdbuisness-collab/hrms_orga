import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ChevronRight, Loader2, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { leaveManagementService } from "../../../service";
import useAsyncAction from "../../../hooks/useAsyncAction";

const HOLIDAY_TYPES = ["National", "Regional", "Company"];
const EMPTY_FORM = { name: "", holidayDate: "", holidayType: "National", description: "" };

const TYPE_COLORS = {
  National: "bg-blue-100 text-blue-700",
  Regional: "bg-green-100 text-green-700",
  Company: "bg-purple-100 text-purple-700",
};

const HolidayList = () => {
  const navigate = useNavigate();
  const [holidays, setHolidays] = useState([]);
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterYear, setFilterYear] = useState(String(new Date().getFullYear()));
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);
  const { activeKey, isLoading, run } = useAsyncAction();

  const loadHolidays = async (year = filterYear) => {
    setLoading(true);
    setError("");
    const res = await leaveManagementService.getHolidays({
      year,
      type: filterType === "All" ? undefined : filterType,
      search: search || undefined,
    });
    if (res.success) {
      setHolidays(res.data?.holidays || []);
      const nextYears = res.data?.years?.map(String) || [];
      if (nextYears.length) {
        setYears(nextYears);
        if (!nextYears.includes(String(year))) {
          setFilterYear(nextYears[0]);
        }
      } else {
        setYears([String(new Date().getFullYear())]);
      }
    } else {
      setError(res.message || "Failed to load holidays");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadHolidays(filterYear);
  }, [filterYear, filterType]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return holidays.filter((item) => {
      if (!q) return true;
      return (
        item.name?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)
      );
    });
  }, [holidays, search]);

  const openAdd = () => {
    setEditItem(null);
    setForm({
      ...EMPTY_FORM,
      holidayDate: `${filterYear}-01-01`,
    });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item.id);
    setForm({
      name: item.name || "",
      holidayDate: item.holidayDate || "",
      holidayType: item.holidayType || "National",
      description: item.description || "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.holidayDate) return;
    const payload = {
      ...form,
      holidayYear: Number(form.holidayDate.slice(0, 4)),
    };
    const actionKey = editItem ? `save-${editItem}` : "save-new";
    const res = await run(
      () =>
        editItem
          ? leaveManagementService.updateHoliday(editItem, payload)
          : leaveManagementService.createHoliday(payload),
      actionKey,
    );
    if (!res) return;
    if (!res.success) {
      setError(res.message || "Failed to save holiday");
      return;
    }
    setShowModal(false);
    await loadHolidays(payload.holidayYear);
    setFilterYear(String(payload.holidayYear));
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const res = await run(
      () => leaveManagementService.deleteHoliday(deleteId),
      `delete-${deleteId}`,
    );
    if (!res) return;
    if (!res.success) {
      setError(res.message || "Failed to delete holiday");
      return;
    }
    setDeleteId(null);
    await loadHolidays(filterYear);
  };

  const formatDate = (value) =>
    value
      ? new Date(value).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  const getDayOfWeek = (value) =>
    value ? new Date(value).toLocaleDateString("en-IN", { weekday: "long" }) : "—";

  return (
    <div
      className="bg-white px-4 sm:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl min-h-[calc(100vh-10rem)] flex flex-col"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
        <span className="cursor-pointer text-[#7D1EDB]" onClick={() => navigate("/hrms")}>
          HRMS Dashboard
        </span>
        <ChevronRight size={14} />
        <span className="text-[#6B7280]">Holiday List</span>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
        <div>
          <h1
            className="text-[20px] font-semibold text-[#494949]"
            style={{ fontFamily: '"Nunito Sans", sans-serif' }}
          >
            Holiday List
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">{filtered.length} holidays in {filterYear}</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#7D1EDB] text-white font-medium hover:bg-purple-700 px-5 py-2.5 rounded-full text-sm"
        >
          <Plus size={16} /> Add Holiday
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {["All", ...HOLIDAY_TYPES].map((type) => {
          const count =
            type === "All"
              ? filtered.length
              : filtered.filter((item) => item.holidayType === type).length;
          return (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`rounded-xl border p-3 text-left ${
                filterType === type ? "border-[#7D1EDB] bg-purple-50" : "border-gray-100"
              }`}
            >
              <p className="text-xs text-gray-400 mb-1">{type}</p>
              <p className="text-2xl font-bold text-[#494949]">{count}</p>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search holiday..."
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#7D1EDB]"
          />
        </div>
        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#7D1EDB]"
        >
          {years.map((year) => (
            <option key={year}>{year}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-auto border border-[#CECECE] rounded-lg">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="border-b border-[#CECECE] text-left">
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Sr No.</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Holiday Name</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Date</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Day</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Type</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Description</th>
              <th className="py-3 px-5 text-sm font-normal text-[#757575]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-400 text-sm">
                  Loading holidays...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-400 text-sm">
                  No holidays found
                </td>
              </tr>
            ) : (
              filtered.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-5 text-sm text-gray-500">{index + 1}</td>
                  <td className="py-3 px-5 text-sm font-medium text-[#1E1E1E]">{item.name}</td>
                  <td className="py-3 px-5 text-sm text-gray-600">{formatDate(item.holidayDate)}</td>
                  <td className="py-3 px-5 text-sm text-gray-500">{getDayOfWeek(item.holidayDate)}</td>
                  <td className="py-3 px-5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        TYPE_COLORS[item.holidayType] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.holidayType}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-sm text-gray-400 max-w-[180px] truncate">
                    {item.description || "—"}
                  </td>
                  <td className="py-3 px-5">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-purple-50 text-[#7D1EDB]">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-[#494949]">
                {editItem ? "Edit Holiday" : "Add Holiday"}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Holiday Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#7D1EDB]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input
                  type="date"
                  value={form.holidayDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, holidayDate: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#7D1EDB]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={form.holidayType}
                  onChange={(e) => setForm((prev) => ({ ...prev, holidayType: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#7D1EDB]"
                >
                  {HOLIDAY_TYPES.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#7D1EDB] resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowModal(false)} disabled={isLoading} className="px-5 py-2 text-sm border border-gray-200 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading || !form.name || !form.holidayDate}
                className="px-5 py-2 text-sm bg-[#7D1EDB] text-white rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="inline-flex items-center gap-2">
                  {activeKey?.startsWith("save-") && <Loader2 size={14} className="animate-spin" />}
                  {activeKey?.startsWith("save-") ? "Saving..." : "Save"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Calendar size={22} className="text-red-500" />
            </div>
            <h3 className="text-base font-semibold text-[#494949] mb-2">Delete Holiday?</h3>
            <p className="text-sm text-gray-400 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteId(null)} disabled={isLoading} className="px-5 py-2 text-sm border border-gray-200 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="px-5 py-2 text-sm bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="inline-flex items-center gap-2">
                  {activeKey === `delete-${deleteId}` && <Loader2 size={14} className="animate-spin" />}
                  {activeKey === `delete-${deleteId}` ? "Deleting..." : "Delete"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HolidayList;
