import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Plus, Search, Pencil, Trash2, X, Calendar } from "lucide-react";

const HOLIDAY_TYPES = ["National", "Regional", "Company"];

const INITIAL_HOLIDAYS = [
  { id: 1, name: "Republic Day", date: "2026-01-26", type: "National", description: "National holiday" },
  { id: 2, name: "Holi", date: "2026-03-14", type: "National", description: "Festival of Colors" },
  { id: 3, name: "Good Friday", date: "2026-04-03", type: "National", description: "" },
  { id: 4, name: "Independence Day", date: "2026-08-15", type: "National", description: "National holiday" },
  { id: 5, name: "Gandhi Jayanti", date: "2026-10-02", type: "National", description: "" },
  { id: 6, name: "Diwali", date: "2026-10-19", type: "National", description: "Festival of Lights" },
  { id: 7, name: "Christmas", date: "2026-12-25", type: "National", description: "" },
  { id: 8, name: "Company Foundation Day", date: "2026-06-01", type: "Company", description: "Annual company day off" },
];

const TYPE_COLORS = {
  National: "bg-blue-100 text-blue-700",
  Regional: "bg-green-100 text-green-700",
  Company: "bg-purple-100 text-purple-700",
};

const EMPTY_FORM = { name: "", date: "", type: "National", description: "" };

const HolidayList = () => {
  const navigate = useNavigate();
  const [holidays, setHolidays] = useState(INITIAL_HOLIDAYS);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterYear, setFilterYear] = useState("2026");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);

  const years = ["2025", "2026", "2027"];

  const filtered = holidays.filter((h) => {
    const matchYear = h.date.startsWith(filterYear);
    const matchType = filterType === "All" || h.type === filterType;
    const matchSearch = !search || h.name.toLowerCase().includes(search.toLowerCase());
    return matchYear && matchType && matchSearch;
  });

  const openAdd = () => { setForm(EMPTY_FORM); setEditItem(null); setShowModal(true); };
  const openEdit = (h) => { setForm({ name: h.name, date: h.date, type: h.type, description: h.description }); setEditItem(h.id); setShowModal(true); };

  const handleSave = () => {
    if (!form.name || !form.date) return;
    if (editItem) {
      setHolidays(holidays.map(h => h.id === editItem ? { ...h, ...form } : h));
    } else {
      setHolidays([...holidays, { id: Date.now(), ...form }]);
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    setHolidays(holidays.filter(h => h.id !== deleteId));
    setDeleteId(null);
  };

  const formatDate = (d) => {
    if (!d) return "—";
    const dt = new Date(d);
    return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const getDayOfWeek = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-IN", { weekday: "long" });
  };

  return (
    <div className="bg-white px-4 sm:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl min-h-[calc(100vh-10rem)] flex flex-col" style={{ fontFamily: "Poppins, sans-serif" }}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-2 text-sm text-gray-500" style={{ fontFamily: '"Mulish", sans-serif' }}>
        <span className="cursor-pointer text-[#7D1EDB]" onClick={() => navigate("/hrms")}>HRMS Dashboard</span>
        <ChevronRight size={14} />
        <span className="text-[#6B7280]">Holiday List</span>
      </div>

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-5 shrink-0">
        <div>
          <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Holiday List</h1>
          <p className="text-sm text-gray-400 mt-0.5">{filtered.length} holidays in {filterYear}</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#7D1EDB] text-white font-medium hover:bg-purple-700 transition-colors px-5 py-2.5 rounded-full text-sm"
        >
          <Plus size={16} /> Add Holiday
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {["All", ...HOLIDAY_TYPES].map((t) => {
          const count = t === "All" ? filtered.length : filtered.filter(h => h.type === t).length;
          return (
            <div key={t} className={`rounded-xl border p-3 cursor-pointer transition-all ${filterType === t ? "border-[#7D1EDB] bg-purple-50" : "border-gray-100"}`} onClick={() => setFilterType(t)}>
              <p className="text-xs text-gray-400 mb-1">{t}</p>
              <p className="text-2xl font-bold text-[#494949]">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4 shrink-0">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search holiday..." className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#7D1EDB]" />
        </div>
        <select value={filterYear} onChange={e => setFilterYear(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#7D1EDB]">
          {years.map(y => <option key={y}>{y}</option>)}
        </select>
      </div>

      {/* Table */}
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
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="py-12 text-center text-gray-400 text-sm">No holidays found</td></tr>
            ) : filtered.map((h, idx) => (
              <tr key={h.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-5 text-sm text-gray-500">{idx + 1}</td>
                <td className="py-3 px-5 text-sm font-medium text-[#1E1E1E]">{h.name}</td>
                <td className="py-3 px-5 text-sm text-gray-600">{formatDate(h.date)}</td>
                <td className="py-3 px-5 text-sm text-gray-500">{getDayOfWeek(h.date)}</td>
                <td className="py-3 px-5">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${TYPE_COLORS[h.type] || "bg-gray-100 text-gray-600"}`}>{h.type}</span>
                </td>
                <td className="py-3 px-5 text-sm text-gray-400 max-w-[180px] truncate">{h.description || "—"}</td>
                <td className="py-3 px-5">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(h)} className="p-1.5 rounded-lg hover:bg-purple-50 text-[#7D1EDB] transition-colors"><Pencil size={15} /></button>
                    <button onClick={() => setDeleteId(h.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-[#494949]">{editItem ? "Edit Holiday" : "Add Holiday"}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Holiday Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Diwali" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#7D1EDB]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#7D1EDB]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#7D1EDB]">
                  {HOLIDAY_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Optional" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#7D1EDB] resize-none" />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowModal(false)} className="px-5 py-2 text-sm border border-gray-200 rounded-full hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={!form.name || !form.date} className="px-5 py-2 text-sm bg-[#7D1EDB] text-white rounded-full hover:bg-purple-700 disabled:opacity-50">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><Trash2 size={22} className="text-red-500" /></div>
            <h3 className="text-base font-semibold text-[#494949] mb-2">Delete Holiday?</h3>
            <p className="text-sm text-gray-400 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteId(null)} className="px-5 py-2 text-sm border border-gray-200 rounded-full hover:bg-gray-50">Cancel</button>
              <button onClick={handleDelete} className="px-5 py-2 text-sm bg-red-500 text-white rounded-full hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HolidayList;
