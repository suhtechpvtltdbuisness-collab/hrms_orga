import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  X,
  ChevronRight,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import EditDepartmentModal from './DepartmentUpdate/EditDepartmentModal';
import SuccessModal from './DepartmentUpdate/SuccessModal';
import ErrorModal from './DepartmentUpdate/ErrorModal';
import FilterDropdown from '../../../components/ui/FilterDropdown';
import { departmentService, employeeService } from '../../../service';
import toast from 'react-hot-toast';

const DepartmentList = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [stats, setStats] = useState({
    totalDepartments: 0,
    activeDepartments: 0,
    inactiveDepartments: 0,
    totalEmployeesAssigned: 0,
  });
  
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [managers, setManagers] = useState([]);

  // Query Params
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("departmentName");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [formData, setFormData] = useState({
    departmentName: "",
    departmentCode: "",
    managerId: "",
    description: "",
    status: "Active",
  });

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  // Load managers dropdown list
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const adminId = userData?.id || userData?._id;
        if (adminId) {
          const res = await employeeService.getAllEmployeesByAdminId(adminId);
          if (res.success && res.data) {
            const mapped = res.data.map(item => {
              const u = item.user || item;
              return { label: u.name, value: u.id };
            });
            setManagers(mapped);
          }
        }
      } catch (err) {
        console.error("Failed to load managers:", err);
      }
    };
    fetchManagers();
  }, []);

  // Fetch stats
  const fetchStats = async () => {
    try {
      const res = await departmentService.getDepartmentStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error("Failed to load department stats:", err);
    }
  };

  // Fetch departments data paginated
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await departmentService.getDepartments({
        search: searchQuery,
        status: statusFilter === "All" ? "" : statusFilter,
        sortBy,
        sortOrder,
        page: currentPage,
        limit,
      });
      if (res.success && res.data) {
        setDepartments(res.data.departments || []);
        setTotalCount(res.data.total || 0);
      } else {
        toast.error(res.message || "Failed to load departments");
      }
    } catch (err) {
      toast.error("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchStats();
  }, [searchQuery, statusFilter, sortBy, sortOrder, currentPage]);

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.departmentName) {
      toast.error("Department name is required");
      return;
    }
    try {
      const payload = {
        departmentName: formData.departmentName,
        departmentCode: formData.departmentCode,
        description: formData.description,
        managerId: formData.managerId ? Number(formData.managerId) : null,
        status: formData.status || 'Active',
      };
      const result = await departmentService.createDepartment(payload);
      if (result.success) {
        setShowModal(false);
        setShowSuccessModal(true);
        fetchDepartments();
        fetchStats();
        setFormData({
          departmentName: '',
          departmentCode: '',
          managerId: '',
          description: '',
          status: 'Active',
        });
      } else {
        toast.error(result.message || "Failed to create department");
      }
    } catch {
      toast.error("An error occurred while creating department");
    }
  };

  const handleEditClick = (dept) => {
    setSelectedDepartment(dept);
    setShowEditModal(true);
  };

  const handleEditSave = async (data) => {
    try {
      const payload = {
        departmentName: data.departmentName,
        departmentCode: data.departmentCode,
        description: data.description,
        managerId: data.managerId ? Number(data.managerId) : null,
        status: data.status || 'Active',
      };
      const res = await departmentService.updateDepartment(selectedDepartment.id, payload);
      if (res.success) {
        setShowEditModal(false);
        setShowSuccessModal(true);
        fetchDepartments();
        fetchStats();
      } else {
        toast.error(res.message || "Failed to update department");
      }
    } catch (err) {
      toast.error("An error occurred while updating department");
    }
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="page-wrapper px-6 py-6" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
      {/* Breadcrumb */}
      <div className="breadcrumb flex items-center gap-1.5 text-sm text-[#7D1EDB] mb-4">
        <span className="bc-link cursor-pointer hover:text-purple-700" onClick={() => navigate("/hrms")}>HRMS Dashboard</span>
        <ChevronRight size={13} className="text-gray-400" />
        <span className="text-gray-500 font-medium">Departments</span>
      </div>

      {/* Header */}
      <div className="page-header flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1E1E1E]">Departments</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2 px-5 py-2.5 bg-[#7D1EDB] hover:bg-purple-700 text-white rounded-full font-medium transition-colors shadow-sm"
        >
          <Plus size={16} /> Add Department
        </button>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Total Departments */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-l-[#7D1EDB]">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-[#8E8E8E] uppercase tracking-wider">Total Departments</p>
              <h3 className="text-3xl font-extrabold text-[#1E1E1E] mt-2">{stats.totalDepartments}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#EEECFF] flex items-center justify-center text-[#7D1EDB]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Active Departments */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-l-[#34C759]">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-[#8E8E8E] uppercase tracking-wider">Active Departments</p>
              <h3 className="text-3xl font-extrabold text-[#1E1E1E] mt-2">{stats.activeDepartments}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#76DB1E1A] flex items-center justify-center text-[#34C759]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Inactive Departments */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-l-[#FF3B30]">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-[#8E8E8E] uppercase tracking-wider">Inactive Departments</p>
              <h3 className="text-3xl font-extrabold text-[#1E1E1E] mt-2">{stats.inactiveDepartments}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#FF3B3014] flex items-center justify-center text-[#FF3B30]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Employees Assigned */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-l-[#FF9500]">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-[#8E8E8E] uppercase tracking-wider">Employees Assigned</p>
              <h3 className="text-3xl font-extrabold text-[#1E1E1E] mt-2">{stats.totalEmployeesAssigned}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#FF950014] flex items-center justify-center text-[#FF9500]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search by department name, manager..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#7D1EDB] focus:ring-1 focus:ring-[#7D1EDB] text-sm text-gray-800 placeholder-gray-400 transition-all shadow-sm"
          />
        </div>

        {/* Status Dropdown filter */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <SlidersHorizontal size={14} /> Filter Status:
          </span>
          <FilterDropdown
            label="All Statuses"
            options={["Active", "Inactive"]}
            value={statusFilter}
            onChange={(val) => { setStatusFilter(val || "All"); setCurrentPage(1); }}
            minWidth="140px"
            className="flex items-center justify-between px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 outline-none hover:bg-gray-50 transition-colors shadow-sm"
            disableAllOption={false}
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#EEECFF]/30 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
                <th onClick={() => handleSort("departmentName")} className="px-6 py-4 cursor-pointer hover:bg-purple-50 transition-colors w-[25%] select-none">
                  <div className="flex items-center gap-1.5">
                    Department Name
                    {sortBy === "departmentName" && (sortOrder === "asc" ? " ▴" : " ▾")}
                  </div>
                </th>
                <th onClick={() => handleSort("departmentCode")} className="px-6 py-4 cursor-pointer hover:bg-purple-50 transition-colors w-[15%] select-none">
                  <div className="flex items-center gap-1.5">
                    Code
                    {sortBy === "departmentCode" && (sortOrder === "asc" ? " ▴" : " ▾")}
                  </div>
                </th>
                <th className="px-6 py-4 w-[20%]">Head / Manager</th>
                <th onClick={() => handleSort("employeeCount")} className="px-6 py-4 cursor-pointer hover:bg-purple-50 transition-colors w-[15%] select-none">
                  <div className="flex items-center gap-1.5">
                    Employees
                    {sortBy === "employeeCount" && (sortOrder === "asc" ? " ▴" : " ▾")}
                  </div>
                </th>
                <th className="px-6 py-4 w-[15%]">Status</th>
                <th className="px-6 py-4 w-[10%] text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-[#7D1EDB] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-400 font-medium">Loading departments...</span>
                    </div>
                  </td>
                </tr>
              ) : departments.length > 0 ? (
                departments.map((dept, index) => (
                  <tr key={dept.id || index} className="hover:bg-purple-50/20 transition-colors">
                    <td className="px-6 py-4.5 font-medium">
                      <span
                        onClick={() => navigate(`/hrms/department-details/${dept.id}/overview`, { state: { department: dept } })}
                        className="text-[#7D1EDB] hover:text-purple-900 cursor-pointer font-bold transition-colors"
                      >
                        {dept.departmentName}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 font-mono text-gray-500 font-semibold">{dept.departmentCode}</td>
                    <td className="px-6 py-4.5 text-gray-600 font-medium">{dept.managerName || "—"}</td>
                    <td className="px-6 py-4.5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                        {dept.employeeCount || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4.5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold leading-none ${
                        dept.status === "Active" 
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                          : "bg-rose-50 text-rose-700 border border-rose-100"
                      }`}>
                        {dept.status}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-center">
                      <button
                        onClick={() => handleEditClick(dept)}
                        className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-[#7D1EDB] hover:bg-[#EEECFF] hover:border-purple-200 transition-all"
                      >
                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <h3 className="text-base font-semibold text-gray-800">No departments found</h3>
                      <p className="text-xs text-gray-400">Try adjusting your filters or search criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-150 flex items-center justify-between flex-wrap gap-4 text-xs font-semibold text-gray-500">
            <span>
              Showing {((currentPage - 1) * limit) + 1}–{Math.min(currentPage * limit, totalCount)} of {totalCount} departments
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-3.5 py-1.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => setCurrentPage(n)}
                  className={`w-8 h-8 rounded-lg border transition-all ${
                    currentPage === n 
                      ? "bg-[#7D1EDB] border-[#7D1EDB] text-white" 
                      : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-3.5 py-1.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#3B3A3A82] z-50 flex justify-center items-center">
          <div
            className="bg-white rounded-xl p-6 w-[95%] md:w-[700px] shadow-xl relative"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[18px] font-semibold text-[#393C46]">
                Add New Department
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Department Name */}
              <div className="flex flex-col gap-2">
                <label className="text-[16px] font-base text-[#1E1E1E]">
                  Department Name
                </label>
                <input
                  type="text"
                  name="departmentName"
                  value={formData.departmentName}
                  onChange={handleInputChange}
                  placeholder="Enter department name"
                  className="w-full h-[40px] px-4 py-2 border border-[#D9D9D9] rounded-[8px] text-[16px] font-base outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all placeholder:text-[#B8B8B8]"
                />
              </div>

              {/* Department Code */}
              <div className="flex flex-col gap-2">
                <label className="text-[16px] font-base text-[#1E1E1E]">
                  Department Code
                </label>
                <input
                  type="text"
                  name="departmentCode"
                  value={formData.departmentCode}
                  onChange={handleInputChange}
                  placeholder="Enter department code"
                  className="w-full h-[40px] px-4 py-2 border border-[#D9D9D9] rounded-[8px] text-[16px] font-base outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all placeholder:text-[#B8B8B8]"
                />
              </div>

              {/* Department Head */}
              <div className="flex flex-col gap-2">
                <label className="text-[16px] font-base text-[#1E1E1E]">
                  Department Head
                </label>
                <FilterDropdown
                  options={managers}
                  value={formData.managerId}
                  onChange={(val) =>
                    handleInputChange({
                      target: { name: "managerId", value: val },
                    })
                  }
                  placeholder="Select a department head"
                  className="w-full h-[40px] px-4 py-2 border border-[#D9D9D9] rounded-[8px] text-[16px] font-base outline-none transition-all flex items-center justify-between bg-white text-[#1E1E1E]"
                />
              </div>

              {/* Status */}
              <div className="flex flex-col gap-2">
                <label className="text-[16px] font-base text-[#1E1E1E]">
                  Status
                </label>
                <FilterDropdown
                  options={["Active", "Inactive"]}
                  value={formData.status}
                  onChange={(val) =>
                    handleInputChange({
                      target: { name: "status", value: val },
                    })
                  }
                  placeholder="Select status"
                  className="w-full h-[40px] px-4 py-2 border border-[#D9D9D9] rounded-[8px] text-[16px] font-base outline-none transition-all flex items-center justify-between bg-white text-[#1E1E1E]"
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2 mb-8">
              <label className="text[16px]m font-base text-[#1E1E1E]">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter department description"
                rows="3"
                className="w-full h-[80px] px-4 py-2 border border-[#D9D9D9] rounded-[8px] text-[16px] font-base outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all placeholder:text-[#B8B8B8] resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-8 py-2 border border-[#7D1EDB] rounded-full text-[#7D1EDB] font-medium hover:bg-purple-50 transition-colors"
                style={{ borderRadius: "30px" }}
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-8 py-2 bg-[#7D1EDB] text-white rounded-full font-medium hover:bg-purple-700 transition-colors shadow-sm"
                style={{ borderRadius: "30px" }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <EditDepartmentModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditSave}
          managers={managers}
          initialData={
            selectedDepartment
              ? {
                  departmentName: selectedDepartment.departmentName || "",
                  departmentCode: selectedDepartment.departmentCode || "",
                  managerId: selectedDepartment.managerId || "",
                  description: selectedDepartment.description || "",
                  status: selectedDepartment.status || "",
                }
              : null
          }
        />
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
      />
    </div>
  );
};

export default DepartmentList;
