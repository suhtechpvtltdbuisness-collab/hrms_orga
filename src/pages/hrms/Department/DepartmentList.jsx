import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  X,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';
import EditDepartmentModal from './DepartmentUpdate/EditDepartmentModal';
import SuccessModal from './DepartmentUpdate/SuccessModal';
import ErrorModal from './DepartmentUpdate/ErrorModal';
import FilterDropdown from '../../../components/ui/FilterDropdown';
import { departmentService } from '../../../service';
import toast from 'react-hot-toast';

const DepartmentList = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
  }, [showModal]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const result = await departmentService.getDepartments();
        if (result.success && result.data) {
          setDepartments(result.data);
        } else {
          // Keep mock data if API fails or returns empty
          if (result.message) toast.error(result.message);
        }
      } catch {
        toast.error('Failed to load departments');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    departmentName: "",
    departmentCode: "",
    departmentHead: "",
    location: "",
    description: "",
    parentDepartment: "",
    status: "",
  });

  const [departments, setDepartments] = useState([
    { name: 'Finance', head: 'John Smith', employees: 18, location: 'Mumbai', status: 'Active', description: 'Financial Planning, Reporting And Analysis Department', createdOn: '15/01/2023', lastUpdated: '11/10/2024' },
    { name: 'Human Resources', head: 'Alice Carol', employees: 5, location: 'Delhi', status: 'Active', description: 'Employee Relations, Recruitment, and HR Strategy', createdOn: '20/02/2023', lastUpdated: '15/11/2024' },
    { name: 'Marketing', head: 'Amit B', employees: 12, location: 'Pune', status: 'Active', description: 'Brand Management, Digital Marketing, and Advertising', createdOn: '10/03/2023', lastUpdated: '01/12/2024' },
    { name: 'Operations', head: 'Priya Singh', employees: 22, location: 'Kolkata', status: 'Active', description: 'Daily Business Operations and Logistics Management', createdOn: '05/04/2023', lastUpdated: '20/11/2024' },
    { name: 'IT Services', head: 'Raj Kapoor', employees: 30, location: 'Mumbai', status: 'Active', description: 'IT Infrastructure, Support, and Development', createdOn: '12/01/2023', lastUpdated: '10/10/2024' },
    { name: 'Sales', head: 'Neha Gupta', employees: 25, location: 'Mumbai', status: 'Active', description: 'Revenue Generation and Client Relationship Management', createdOn: '01/05/2023', lastUpdated: '05/12/2024' },
    { name: 'Legal', head: 'Pooja Chopra', employees: 28, location: 'Mumbai', status: 'Active', description: 'Legal Compliance and Corporate Affairs Management', createdOn: '18/06/2023', lastUpdated: '15/10/2024' },
    { name: 'R&D', head: 'John Smith', employees: 15, location: 'Mumbai', status: 'Active', description: 'Research and Development of New Products', createdOn: '22/07/2023', lastUpdated: '20/09/2024' },
    { name: 'Logistics', head: 'John Smith', employees: 18, location: 'Mumbai', status: 'Active', description: 'Supply Chain and Transportation Management', createdOn: '30/08/2023', lastUpdated: '11/09/2024' },
    { name: 'Support', head: 'Sarah Jones', employees: 10, location: 'Bangalore', status: 'Active', description: 'Customer Service and Technical Support', createdOn: '14/09/2023', lastUpdated: '25/11/2024' },
    { name: 'Product', head: 'Mike Ross', employees: 8, location: 'Delhi', status: 'Inactive', description: 'Product Roadmap and Lifecycle Management', createdOn: '05/10/2023', lastUpdated: '01/11/2024' },
    { name: 'Design', head: 'Rachel Green', employees: 14, location: 'Pune', status: 'Active', description: 'Creative Design and User Experience', createdOn: '20/11/2023', lastUpdated: '10/12/2024' },
  ]);

  /* Sorting & Search Logic */
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    head: "",
  });

  /* Safe options for demo: Only John Smith is guaranteed to exist. */
  const LOCATION_OPTIONS = ["Delhi", "Mumbai", "Bangalore", "Kolkata"];
  const HEAD_OPTIONS = ["John Smith"]; // Temporarily removed others as they cause error

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  /* Filtered Logic */
  const filteredDepartments = React.useMemo(() => {
    return departments.filter((dept) => {
      const matchesSearch =
        !searchQuery ||
        dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.head.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLocation =
        !filters.location ||
        dept.location.toLowerCase() === filters.location.toLowerCase();
      const matchesHead =
        !filters.head || dept.head.toLowerCase() === filters.head.toLowerCase();

      return matchesSearch && matchesLocation && matchesHead;
    });
  }, [departments, searchQuery, filters]);

  /* Sorted Logic */
  const sortedDepartments = React.useMemo(() => {
    let sortableItems = [...filteredDepartments];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredDepartments, sortConfig]);

  const itemsPerPage = 10;
  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedDepartments.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(sortedDepartments.length / itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.departmentName || !formData.departmentHead) {
      setShowErrorModal(true);
      return;
    }

    const newDepartment = {
      name: formData.departmentName,
      code: formData.departmentCode || '',
      head: formData.departmentHead,
      employees: 0,
      location: formData.location || 'Mumbai',
      status: formData.status || 'Active',
      description: formData.description || '',
    };

    try {
      const result = await departmentService.createDepartment(newDepartment);
      if (result.success) {
        // Add to local list (refresh optional)
        setDepartments(prev => [...prev, result.data || newDepartment]);
      } else {
        // Optimistically add even if API returns error
        setDepartments(prev => [...prev, newDepartment]);
      }
    } catch {
      setDepartments(prev => [...prev, newDepartment]);
    }

    setShowModal(false);
    setShowSuccessModal(true);
    setFormData({
      departmentName: '',
      departmentCode: '',
      departmentHead: '',
      location: '',
      description: '',
      parentDepartment: '',
      status: '',
    });
  };

  const handleEditClick = (dept) => {
    setSelectedDepartment(dept);
    setShowEditModal(true);
  };

  const handleEditSave = (data) => {
    const updatedDept = {
      name: data.departmentName,
      head: data.departmentHead,
      location: data.location,
      status: data.status,
      description: data.description,
    };

    setDepartments((prevData) => {
      const index = prevData.findIndex((d) => d === selectedDepartment);
      if (index !== -1) {
        const newData = [...prevData];
        newData[index] = { ...newData[index], ...updatedDept };
        return newData;
      }
      return prevData;
    });

    console.log("Updated department data:", data);
    setShowEditModal(false);
    setShowSuccessModal(true);
  };

  return (
    <div className="page-wrapper">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="bc-link" onClick={() => navigate("/hrms")}>HRMS Dashboard</span>
        <ChevronRight size={13} />
        <span>Departments</span>
      </div>

      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Departments</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          <Plus size={16} /> Add Department
        </button>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'space-between', alignItems:'center', marginBottom:14, gap:10, flexShrink:0 }}>
        <div className="search-bar" style={{ flex:'1', minWidth:220, maxWidth:320 }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search departments…"
          />
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <FilterDropdown
            label="All Locations"
            options={LOCATION_OPTIONS}
            value={filters.location}
            onChange={(val) => setFilters((prev) => ({ ...prev, location: val }))}
            minWidth="140px"
            className="btn-ghost"
          />
          <FilterDropdown
            label="All Heads"
            options={HEAD_OPTIONS}
            value={filters.head}
            onChange={(val) => setFilters((prev) => ({ ...prev, head: val }))}
            minWidth="130px"
            className="btn-ghost"
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ flex:1, minHeight:0, overflow:'auto', border:'1px solid #E5E7EB', borderRadius:10 }}>
        <table className="data-table" style={{ minWidth:700 }}>
          <thead>
            <tr>
              <th onClick={() => handleSort("name")} style={{ cursor:'pointer', width:'22%' }}>DEPARTMENT NAME</th>
              <th onClick={() => handleSort("head")} style={{ cursor:'pointer', width:'18%' }}>HEAD</th>
              <th onClick={() => handleSort("employees")} style={{ cursor:'pointer', width:'12%' }}>EMPLOYEES</th>
              <th onClick={() => handleSort("location")} style={{ cursor:'pointer', width:'15%' }}>LOCATION</th>
              <th onClick={() => handleSort("status")} style={{ cursor:'pointer', width:'13%' }}>STATUS</th>
              <th style={{ width:'10%' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign:'center', padding:'60px 0' }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
                  <div className="spinner" />
                  <span style={{ color:'#6B7280', fontSize:13 }}>Loading departments…</span>
                </div>
              </td></tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((dept, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 group transition-colors text-[16px] font-normal font-Poppins h-13.5"
              >
                <td style={{ padding:'10px 14px' }}>
                  <span
                    style={{ color:'#7C3AED', cursor:'pointer', fontWeight:600, fontSize:13.5 }}
                    onClick={(e) => { e.stopPropagation(); navigate(`/hrms/department-details/${dept.id || dept._id || dept.name}/overview`, { state: { department: dept } }); }}
                  >
                    {dept.name}
                  </span>
                </td>
                <td style={{ padding:'10px 14px', fontSize:13.5, color:'#374151' }}>{dept.head || '—'}</td>
                <td style={{ padding:'10px 14px', fontSize:13.5, color:'#374151' }}>{dept.employees ?? 0}</td>
                <td style={{ padding:'10px 14px', fontSize:13.5, color:'#374151' }}>{dept.location || '—'}</td>
                <td style={{ padding:'10px 14px' }}>
                  <span className={`badge ${dept.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                    {dept.status}
                  </span>
                </td>
                <td style={{ padding:'10px 14px' }}>
                  <button
                    onClick={() => handleEditClick(dept)}
                    style={{ padding:'5px 8px', border:'1px solid #E5E7EB', borderRadius:6, background:'transparent', cursor:'pointer', color:'#6B7280', transition:'all 0.12s' }}
                    onMouseEnter={e => { e.currentTarget.style.background='#F5F3FF'; e.currentTarget.style.color='#7C3AED'; e.currentTarget.style.borderColor='#C4B5FD'; }}
                    onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#6B7280'; e.currentTarget.style.borderColor='#E5E7EB'; }}
                  >
                    <img src="/pencil.svg" alt="edit" style={{ width:16, height:16 }} />
                  </button>
                </td>
              </tr>
              ))
            ) : (
              <tr><td colSpan={6}>
                <div className="empty-state">
                  <h3>No Departments Found</h3>
                  <p>Add your first department using the button above.</p>
                </div>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:14, flexShrink:0, flexWrap:'wrap', gap:8 }}>
        <span style={{ fontSize:13, color:'#6B7280' }}>
          Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, sortedDepartments.length)} of {sortedDepartments.length}
        </span>
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={handlePrev}>← Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button key={n} className={currentPage === n ? 'active' : ''} onClick={() => paginate(n)}>{n}</button>
          ))}
          <button disabled={currentPage === totalPages} onClick={handleNext}>Next →</button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#3B3A3A82] z-50 flex justify-center items-center">
          <div
            className="bg-white rounded-xl p-6 w-[95%] md:w-175 shadow-xl relative"
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
                  className="w-full h-10 px-4 py-2 border border-[#D9D9D9] rounded-lg text-[16px] font-base outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all placeholder:text-[#B8B8B8]"
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
                  className="w-full h-10 px-4 py-2 border border-[#D9D9D9] rounded-lg text-[16px] font-base outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all placeholder:text-[#B8B8B8]"
                />
              </div>

              {/* Department Head */}
              <div className="flex flex-col gap-2">
                <label className="text-[16px] font-base text-[#1E1E1E]">
                  Department Head
                </label>
                <FilterDropdown
                  options={["John Smith", "Alice Carol"]}
                  value={formData.departmentHead}
                  onChange={(val) =>
                    handleInputChange({
                      target: { name: "departmentHead", value: val },
                    })
                  }
                  placeholder="Select a department head"
                  className="w-full h-10 px-4 py-2 border border-[#D9D9D9] rounded-lg text-[16px] font-base outline-none transition-all flex items-center justify-between bg-white text-[#1E1E1E]"
                />
              </div>

              {/* Location */}
              <div className="flex flex-col gap-2">
                <label className="text-[16px] font-base text-[#1E1E1E]">
                  Location
                </label>
                <FilterDropdown
                  options={["Mumbai", "Delhi"]}
                  value={formData.location}
                  onChange={(val) =>
                    handleInputChange({
                      target: { name: "location", value: val },
                    })
                  }
                  placeholder="Select a location"
                  className="w-full h-10 px-4 py-2 border border-[#D9D9D9] rounded-lg text-[16px] font-base outline-none transition-all flex items-center justify-between bg-white text-[#1E1E1E]"
                />
              </div>

              {/* Parent Department */}
              <div className="flex flex-col gap-2">
                <label className="text-[16px] font-base text-[#1E1E1E]">
                  Parent department
                </label>
                <FilterDropdown
                  options={["Finance", "Marketing"]}
                  value={formData.parentDepartment}
                  onChange={(val) =>
                    handleInputChange({
                      target: { name: "parentDepartment", value: val },
                    })
                  }
                  placeholder="Select parent department"
                  className="w-full h-10 px-4 py-2 border border-[#D9D9D9] rounded-lg text-[16px] font-base outline-none transition-all flex items-center justify-between bg-white text-[#1E1E1E]"
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
                  className="w-full h-10 px-4 py-2 border border-[#D9D9D9] rounded-lg text-[16px] font-base outline-none transition-all flex items-center justify-between bg-white text-[#1E1E1E]"
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
                className="w-full h-20 px-4 py-2 border border-[#D9D9D9] rounded-lg text-[16px] font-base outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all placeholder:text-[#B8B8B8] resize-none"
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
          initialData={
            selectedDepartment
              ? {
                  departmentName: selectedDepartment.name || "",
                  departmentCode: selectedDepartment.code || "",
                  departmentHead: selectedDepartment.head || "",
                  location: selectedDepartment.location || "",
                  description: selectedDepartment.description || "",
                  parentDepartment: selectedDepartment.parentDepartment || "",
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
