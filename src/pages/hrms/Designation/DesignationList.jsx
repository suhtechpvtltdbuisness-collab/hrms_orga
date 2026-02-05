import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ChevronDown, X, ArrowRight, ArrowLeft, ChevronRight } from "lucide-react";
import SuccessModal from "./SuccessModal";
import ErrorModal from "./ErrorModal";
import FilterDropdown from "../../../components/ui/FilterDropdown";
import DeleteDesignation from "./DesignationViewDetails/DeleteDesignation";
import EditDesignationModal from "./EditDesignationModal";

const DesignationList = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDesignation, setSelectedDesignation] = useState(null);

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
  }, [showModal]);

  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    designationName: "",
    department: "",
    level: "",
    reportingManager: "",
    responsibilities: "",
    description: "",
    status: "",
  });

  const [designations, setDesignations] = useState([
    {
      name: "Software Engineer",
      department: "Engineering",
      level: "L-2",
      employees: 15,
      status: "Active",
    },
    {
      name: "Senior Product Manager",
      department: "Product",
      level: "L-4",
      employees: 4,
      status: "Active",
    },
    {
      name: "Marketing Specialist",
      department: "Product",
      level: "L-4",
      employees: 8,
      status: "Active",
    },
    {
      name: "Office Manager",
      department: "Administration",
      level: "L-2",
      employees: 1,
      status: "Active",
    },
    {
      name: "Sales Development Rep",
      department: "Sales",
      level: "L-1",
      employees: 1,
      status: "Active",
    },
    {
      name: "Accounts Executive",
      department: "Finance",
      level: "L-2",
      employees: 4,
      status: "Active",
    },
    {
      name: "Data Analyst",
      department: "Data & Analysis",
      level: "L-2",
      employees: 8,
      status: "Active",
    },
    {
      name: "HR Manager",
      department: "Human Resources",
      level: "L-3",
      employees: 2,
      status: "Active",
    },
    {
      name: "Legal Counsel",
      department: "Legal",
      level: "L-3",
      employees: 3,
      status: "Active",
    },
    {
      name: "DevOps Engineer",
      department: "Engineering",
      level: "L-3",
      employees: 6,
      status: "Active",
    },
    {
      name: "UX Designer",
      department: "Design",
      level: "L-2",
      employees: 5,
      status: "Inactive",
    },
    {
      name: "QA Engineer",
      department: "Engineering",
      level: "L-2",
      employees: 10,
      status: "Active",
    },
  ]);

  /* Sorting & Search Logic */
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    department: "",
    level: "",
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const DEPARTMENT_OPTIONS = [
    "Engineering",
    "Product",
    "Sales",
    "Finance",
    "Human Resources",
    "Legal",
    "Design",
    "Administration",
    "Data & Analysis",
  ];
  const LEVEL_OPTIONS = ["L-1", "L-2", "L-3", "L-4", "L-5"];
  const MANAGER_OPTIONS = [
    "John Smith",
    "Alice Carol",
    "Robert Fox",
    "Sarah Jones",
  ];

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  /* Filtered Logic */
  const filteredDesignations = React.useMemo(() => {
    return designations.filter((desig) => {
      const matchesSearch =
        !searchQuery ||
        desig.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        desig.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDepartment =
        !filters.department ||
        desig.department.toLowerCase() === filters.department.toLowerCase();
      const matchesLevel =
        !filters.level ||
        desig.level.toLowerCase() === filters.level.toLowerCase();

      return matchesSearch && matchesDepartment && matchesLevel;
    });
  }, [designations, searchQuery, filters]);

  /* Sorted Logic */
  const sortedDesignations = React.useMemo(() => {
    let sortableItems = [...filteredDesignations];
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
  }, [filteredDesignations, sortConfig]);

  const itemsPerPage = 10;
  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedDesignations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(sortedDesignations.length / itemsPerPage);

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

  const handleSubmit = () => {
    if (!formData.designationName || !formData.department || !formData.level) {
      setShowErrorModal(true);
      return;
    }

    const newDesignation = {
      name: formData.designationName,
      department: formData.department,
      level: formData.level,
      employees: 0,
      status: formData.status || "Active",
    };
    setDesignations([...designations, newDesignation]);

    console.log("Form submitted:", formData);
    setShowModal(false);
    setShowSuccessModal(true);
    setFormData({
      designationName: "",
      department: "",
      level: "",
      reportingManager: "",
      responsibilities: "",
      description: "",
      status: "",
    });
  };

  const handleEditClick = (desig) => {
    setSelectedDesignation(desig);
    setShowEditModal(true);
  };

  return (
    <div
      className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col font-popins"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
       {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 shrink-0">
                <img 
                    src="/images/arrow_left_alt.svg" 
                    alt="Back" 
                    className="w-3 h-3 cursor-pointer hover:scale-110 transition-transform" 
                    onClick={() => navigate('/hrms')}
                />
                <span 
                    className='cursor-pointer text-[#7D1EDB]'
                    onClick={() => navigate('/hrms')}
                >
                    HRMS Dashboard
                </span> 
                <ChevronRight size={14}/> 
                <span className="text-[#6B7280]">Designation</span>
            </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h1 className="text-[20px] font-semibold text-[#494949]">
          Designations
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 text-white font-medium hover:bg-purple-700 transition-colors bg-[#7D1EDB]"
          style={{
            width: "195px",
            height: "48px",
            padding: "10px 16px",
            borderRadius: "26px",
          }}
        >
          <span className="text-[16px] cursor-pointer font-medium text-white font-popins">
            Add Designation
          </span>
          <Plus size={20} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4 shrink-0 transition-all">
        {/* Search Bar */}
        <div className="relative w-full md:w-[280px] lg:w-[350px]">
          <div
            className="flex items-center bg-[#F9FAFB] border border-[#F9FAFB] text-[#B3B3B3]"
            style={{
              height: "48px",
              padding: "2px 32px 2px 24px",
              borderRadius: "32px",
              border: "1px solid #EEECFF",
            }}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by designations name..."
              className="bg-transparent w-full outline-none text-gray-700 placeholder-[#B3B3B3] text-[18px] font-light font-popins"
            />
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap gap-3 font-popins w-full md:w-auto">
          {/* Department Filter */}
          <FilterDropdown
            label="Department"
            options={DEPARTMENT_OPTIONS}
            value={filters.department}
            onChange={(val) =>
              setFilters((prev) => ({ ...prev, department: val }))
            }
            minWidth="147px"
          />

          {/* Level Filter */}
          <FilterDropdown
            label="Level"
            options={LEVEL_OPTIONS}
            value={filters.level}
            onChange={(val) => setFilters((prev) => ({ ...prev, level: val }))}
            minWidth="147px"
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <table className="w-full relative border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="text-left text-[14px] font-popins">
              <th
                onClick={() => handleSort("name")}
                className="py-4 px-4 text-[14px] font-normal text-[#707070] uppercase tracking-wider bg-white cursor-pointer select-none"
                style={{ width: "25%" }}
              >
                <div className="flex items-center hover:text-gray-900 transition-colors whitespace-nowrap">
                  DESIGNATION NAME{" "}
                  <img
                    src="/images/sort_arrow.svg"
                    alt="sort"
                    className={`ml-1 transition-transform duration-200 ${
                      sortConfig.key === "name" &&
                      sortConfig.direction === "descending"
                        ? "rotate-180"
                        : ""
                    }`}
                    style={{ width: "10px", height: "16px" }}
                  />
                </div>
              </th>
              <th
                onClick={() => handleSort("department")}
                className="py-4 px-4 text-[14px] font-normal text-[#707070] uppercase tracking-wider bg-white cursor-pointer select-none"
                style={{ width: "20%" }}
              >
                <div className="flex items-center hover:text-gray-900 transition-colors whitespace-nowrap">
                  DEPARTMENT{" "}
                  <img
                    src="/images/sort_arrow.svg"
                    alt="sort"
                    className={`ml-1 transition-transform duration-200 ${
                      sortConfig.key === "department" &&
                      sortConfig.direction === "descending"
                        ? "rotate-180"
                        : ""
                    }`}
                    style={{ width: "10px", height: "16px" }}
                  />
                </div>
              </th>
              <th
                onClick={() => handleSort("level")}
                className="py-4 px-4 text-[14px] font-normal text-[#707070] uppercase tracking-wider bg-white cursor-pointer select-none"
                style={{ width: "10%" }}
              >
                <div className="flex items-center hover:text-gray-900 transition-colors whitespace-nowrap">
                  LEVEL{" "}
                  <img
                    src="/images/sort_arrow.svg"
                    alt="sort"
                    className={`ml-1 transition-transform duration-200 ${
                      sortConfig.key === "level" &&
                      sortConfig.direction === "descending"
                        ? "rotate-180"
                        : ""
                    }`}
                    style={{ width: "10px", height: "16px" }}
                  />
                </div>
              </th>
              <th
                onClick={() => handleSort("employees")}
                className="py-4 px-4 text-[14px] font-normal text-[#707070] uppercase tracking-wider bg-white cursor-pointer select-none"
                style={{ width: "15%" }}
              >
                <div className="flex items-center hover:text-gray-900 transition-colors whitespace-nowrap">
                  TOTAL EMPLOYEES{" "}
                  <img
                    src="/images/sort_arrow.svg"
                    alt="sort"
                    className={`ml-1 transition-transform duration-200 ${
                      sortConfig.key === "employees" &&
                      sortConfig.direction === "descending"
                        ? "rotate-180"
                        : ""
                    }`}
                    style={{ width: "10px", height: "16px" }}
                  />
                </div>
              </th>
              <th
                onClick={() => handleSort("status")}
                className="py-4 px-4 text-[14px] font-normal text-[#707070] uppercase tracking-wider bg-white cursor-pointer select-none"
                style={{ width: "15%" }}
              >
                <div className="flex items-center hover:text-gray-900 transition-colors whitespace-nowrap">
                  STATUS{" "}
                  <img
                    src="/images/sort_arrow.svg"
                    alt="sort"
                    className={`ml-1 transition-transform duration-200 ${
                      sortConfig.key === "status" &&
                      sortConfig.direction === "descending"
                        ? "rotate-180"
                        : ""
                    }`}
                    style={{ width: "10px", height: "16px" }}
                  />
                </div>
              </th>
              <th className="py-4 px-4 text-[14px] font-normal text-[#707070] uppercase tracking-wider bg-white text-center" style={{ width: "10%" }}>
                ACTION
              </th>
            </tr>
          </thead>

          <tbody>
            {currentItems.map((desig, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 group transition-colors text-[16px] font-normal font-Poppins h-[54px]"
              >
                <td className="px-6 py-4">
                  <span
                    className="text-[#7268FF]"
                    onClick={(e) => {
                      e.stopPropagation();
                      // navigate('/hrms/designation-details/overview', { state: { designation: desig } });
                    }}
                  >
                    {desig.name}
                  </span>
                </td>
                <td className="py-2 px-4  text-[#1E1E1E]">
                  {desig.department}
                </td>
                <td className="py-2 px-4  text-[#1E1E1E]">{desig.level}</td>
                <td className="py-2 px-4  text-[#1E1E1E]">
                  {desig.employees}
                </td>
                <td className="py-2 px-4">
                  <span
                    className={`inline-flex items-center justify-center px-4 py-1 rounded-[18px] text-[16px] h-[34px] min-w-[74px] font-normal ${
                      desig.status === "Active"
                        ? "bg-[#76DB1E33] text-[#34C759]"
                        : "bg-[#FF3B301A] text-[#FF3B30]"
                    }`}
                  >
                    {desig.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/hrms/designation-details/overview", {
                          state: { designation: desig },
                        });
                      }}
                      className="text-purple-600 hover:text-purple-800 transition-colors cursor-pointer shrink-0"
                    >
                      <img
                        src="/images/eye.svg"
                        alt="view"
                        className="shrink-0"
                        style={{ height: "20px", width: "20px" }}
                      />
                    </button>
                    <button
                      onClick={() => handleEditClick(desig)}
                      className="text-purple-600 hover:text-purple-800 transition-colors cursor-pointer shrink-0"
                    >
                      <img
                        src="/pencil.svg"
                        alt="edit"
                        className="shrink-0"
                        style={{ height: "20px", width: "20px" }}
                      />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDesignation(desig);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-500 hover:text-red-700 transition-colors cursor-pointer shrink-0"
                    >
                      <img
                        src="/images/bin.svg"
                        alt="delete"
                        className="shrink-0"
                        style={{ height: "18px", width: "18px" }}
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center mt-2 pt-2 text-[16px] font-popins text-[#707070] shrink-0 gap-4">
        <div className="text-center md:text-left">
          Showing {indexOfFirstItem + 1}-
          {Math.min(indexOfLastItem, designations.length)} Of{" "}
          {designations.length}
        </div>
        <div className="flex items-center justify-center md:justify-end lg:justify-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 transition-colors ${
              currentPage === 1
                ? "text-gray-300 cursor-not-allowed"
                : "hover:text-gray-900"
            }`}
          >
            <ArrowLeft size={14} /> Previous
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                    currentPage === number
                      ? "bg-purple-600 text-white font-medium"
                      : "text-[#1E1E1E] hover:bg-gray-100"
                  }`}
                >
                  {number}
                </button>
              )
            )}
          </div>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-1 transition-colors ${
              currentPage === totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "text-[#1E1E1E] hover:text-gray-900"
            }`}
          >
            Next <ArrowRight size={14} />
          </button>
        </div>
        <div className="hidden lg:block"></div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#3B3A3A82] z-50 flex justify-center items-center">
          <div
            className="bg-white rounded-xl p-6 w-[95%] md:w-[700px] shadow-xl relative max-h-[90vh] overflow-y-auto custom-scrollbar"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[18px] font-semibold text-[#393C46]">
                Create Designation
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
              {/* Designation Name */}
              <div className="flex flex-col gap-[8px]">
                <label className="text-[16px] font-base text-[#1E1E1E]">
                  Designation Name
                </label>
                <input
                  type="text"
                  name="designationName"
                  value={formData.designationName}
                  onChange={handleInputChange}
                  placeholder="Enter department name"
                  className="w-full h-[40px] px-4 py-2 border border-[#D9D9D9] rounded-[8px] text-[16px] font-base outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all placeholder:text-[#B8B8B8]"
                />
              </div>

              {/* Department Dropdown */}
              <div className="flex flex-col gap-[8px]">
                <label className="text-[16px] font-base text-[#1E1E1E]">
                  Department
                </label>
                <div className="relative">
                  <FilterDropdown
                    placeholder="Enter department"
                    options={DEPARTMENT_OPTIONS}
                    value={formData.department}
                    onChange={(val) =>
                      setFormData((prev) => ({ ...prev, department: val }))
                    }
                    className="w-full h-[40px] px-4 flex items-center justify-between bg-white border border-[#D9D9D9] rounded-[8px] text-[16px] text-[#1E1E1E] font-base outline-none focus:border-purple-600 transition-all"
                  />
                </div>
              </div>

              {/* Level Dropdown */}
              <div className="flex flex-col gap-[8px]">
                <label className="text-[16px] font-base text-[#1E1E1E]">
                  Level
                </label>
                <div className="relative">
                  <FilterDropdown
                    placeholder="Select level"
                    options={LEVEL_OPTIONS}
                    value={formData.level}
                    onChange={(val) =>
                      setFormData((prev) => ({ ...prev, level: val }))
                    }
                    className="w-full h-[40px] px-4 flex items-center justify-between bg-white border border-[#D9D9D9] rounded-[8px] text-[16px] text-[#1E1E1E] font-base outline-none focus:border-purple-600 transition-all"
                  />
                </div>
              </div>

              {/* Reporting Manager Dropdown */}
              <div className="flex flex-col gap-[8px]">
                <label className="text-[16px] font-base text-[#1E1E1E]">
                  Reporting Manager
                </label>
                <div className="relative">
                  <FilterDropdown
                    placeholder="Enter reporting manager"
                    options={MANAGER_OPTIONS}
                    value={formData.reportingManager}
                    onChange={(val) =>
                      setFormData((prev) => ({ ...prev, reportingManager: val }))
                    }
                    className="w-full h-[40px] px-4 flex items-center justify-between bg-white border border-[#D9D9D9] rounded-[8px] text-[16px] text-[#1E1E1E] font-base outline-none focus:border-purple-600 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-[8px] mb-6">
              <label className="text-[16px] font-base text-[#1E1E1E]">
                Status
              </label>
              <div className="relative">
                <FilterDropdown
                  placeholder="Select status"
                  options={["Active", "Inactive"]}
                  value={formData.status}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, status: val }))
                  }
                  className="w-full h-[40px] px-4 flex items-center justify-between bg-white border border-[#D9D9D9] rounded-[8px] text-[16px] text-[#1E1E1E] font-base outline-none focus:border-purple-600 transition-all"
                />
              </div>
            </div>

            {/* Responsibilities */}
            <div className="flex flex-col gap-[8px] mb-6">
              <label className="text-[16px] font-base text-[#1E1E1E]">
                Responsibilities
              </label>
              <textarea
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleInputChange}
                placeholder="Enter responsibilities"
                rows="3"
                className="w-full h-[80px] px-4 py-2 border border-[#D9D9D9] rounded-[8px] text-[16px] font-base outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all placeholder:text-[#B8B8B8] resize-none"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-[8px] mb-8">
              <label className="text[16px]m font-base text-[#1E1E1E]">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter description"
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

      {/* Edit Modal */}
      <EditDesignationModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        designation={selectedDesignation}
      />

      {/* Delete Modal */}
      {showDeleteModal && (
        <DeleteDesignation
          onCancel={() => setShowDeleteModal(false)}
          onDelete={() => {
            setShowDeleteModal(false);
          }}
        />
      )}
    </div>
  );
};

export default DesignationList;
