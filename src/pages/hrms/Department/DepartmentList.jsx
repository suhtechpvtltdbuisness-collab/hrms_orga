import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  ChevronDown,
  X,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { departmentService } from "../../../service";
import EditDepartmentModal from "./DepartmentUpdate/EditDepartmentModal";
import SuccessModal from "./DepartmentUpdate/SuccessModal";
import ErrorModal from "./DepartmentUpdate/ErrorModal";
import FilterDropdown from "../../../components/ui/FilterDropdown";

const DepartmentList = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
  }, [showModal]);

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

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    const result = await departmentService.getDepartments();
    if (result.success) {
      if (Array.isArray(result.data)) {
        const formattedData = result.data.map((dept) => ({
          id: dept.id,
          name: dept.name || "-",
          code: dept.code || "",
          head: dept.head || "-",
          employees: dept.employees || 0,
          location: dept.location || "-",
          description: dept.description || "",
          status: dept.status ? "Active" : "Inactive",
        }));

        setDepartments(formattedData);
      } else {
        console.error("Expected array of departments but got:", result.data);
        setDepartments([]);
      }
    } else {
      console.error(result.message);
    }
    setLoading(false);
  };

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

  const LOCATION_OPTIONS = ["Delhi", "Mumbai", "Bangalore", "Kolkata"];
  const HEAD_OPTIONS = ["John Smith", "Alice Carol", "Priya Singh"];

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
    if (!formData.departmentName) {
      setShowErrorModal(true);
      return;
    }

    const payload = {
      name: formData.departmentName,
      code: formData.departmentCode,
      head: formData.departmentHead,
      location: formData.location,
      description: formData.description,
      status: formData.status === "Active",
    };

    const result = await departmentService.createDepartment(payload);

    if (result.success) {
      console.log("Department created:", result.data);

      setShowModal(false);
      setShowSuccessModal(true);

      setFormData({
        departmentName: "",
        departmentCode: "",
        departmentHead: "",
        location: "",
        description: "",
        parentDepartment: "",
        status: "",
      });

      fetchDepartments();
    } else {
      console.error(result.message);
      setShowErrorModal(true);
    }
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
          onClick={() => navigate("/hrms")}
        />
        <span
          className="cursor-pointer text-[#7D1EDB]"
          onClick={() => navigate("/hrms")}
        >
          HRMS Dashboard
        </span>
        <ChevronRight size={14} />
        <span className="text-[#6B7280]">Department</span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h1 className="text-[20px] font-semibold text-[#494949]">
          Departments
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
          <span className="text-[16px] font-medium text-white font-popins">
            Add Department
          </span>
          <Plus size={20} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4 shrink-0 transition-all">
        {/* Search Bar */}
        <div className="relative w-full md:w-70 lg:w-87.5">
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
              placeholder="Search by department name..."
              className="bg-transparent w-full outline-none text-gray-700 placeholder-[#B3B3B3] text-[18px] font-light font-popins"
            />
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap gap-3 font-popins w-full md:w-auto">
          {/* Location Filter */}
          <FilterDropdown
            label="All Locations"
            options={LOCATION_OPTIONS}
            value={filters.location}
            onChange={(val) =>
              setFilters((prev) => ({ ...prev, location: val }))
            }
            minWidth="147px"
          />

          {/* Head Filter */}
          <FilterDropdown
            label="All Heads"
            options={HEAD_OPTIONS}
            value={filters.head}
            onChange={(val) => setFilters((prev) => ({ ...prev, head: val }))}
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
                  DEPARTMENT NAME{" "}
                  <img
                    src="/images/sort_arrow.svg"
                    alt="sort"
                    className={`ml-1 transition-transform duration-200 ${sortConfig.key === "name" && sortConfig.direction === "descending" ? "rotate-180" : ""}`}
                    style={{ width: "10px", height: "16px" }}
                  />
                </div>
              </th>
              <th
                onClick={() => handleSort("head")}
                className="py-4 px-4 text-[14px] font-normal text-[#707070] uppercase tracking-wider bg-white cursor-pointer select-none"
                style={{ width: "20%" }}
              >
                <div className="flex items-center hover:text-gray-900 transition-colors whitespace-nowrap">
                  DEPARTMENT HEAD{" "}
                  <img
                    src="/images/sort_arrow.svg"
                    alt="sort"
                    className={`ml-1 transition-transform duration-200 ${sortConfig.key === "head" && sortConfig.direction === "descending" ? "rotate-180" : ""}`}
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
                  EMPLOYEES{" "}
                  <img
                    src="/images/sort_arrow.svg"
                    alt="sort"
                    className={`ml-1 transition-transform duration-200 ${sortConfig.key === "employees" && sortConfig.direction === "descending" ? "rotate-180" : ""}`}
                    style={{ width: "10px", height: "16px" }}
                  />
                </div>
              </th>
              <th
                onClick={() => handleSort("location")}
                className="py-4 px-4 text-[14px] font-normal text-[#707070] uppercase tracking-wider bg-white cursor-pointer select-none"
                style={{ width: "15%" }}
              >
                <div className="flex items-center hover:text-gray-900 transition-colors whitespace-nowrap">
                  LOCATION{" "}
                  <img
                    src="/images/sort_arrow.svg"
                    alt="sort"
                    className={`ml-1 transition-transform duration-200 ${sortConfig.key === "location" && sortConfig.direction === "descending" ? "rotate-180" : ""}`}
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
                    className={`ml-1 transition-transform duration-200 ${sortConfig.key === "status" && sortConfig.direction === "descending" ? "rotate-180" : ""}`}
                    style={{ width: "10px", height: "16px" }}
                  />
                </div>
              </th>
              <th
                className="py-4 px-4 text-[14px] font-normal text-[#707070] uppercase tracking-wider bg-white"
                style={{ width: "10%" }}
              >
                ACTION
              </th>
            </tr>
          </thead>

          <tbody>
            {currentItems.map((dept, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 group transition-colors text-[16px] font-normal font-Poppins h-13.5"
              >
                <td className="px-6 py-4">
                  <span
                    className="text-[#7268FF] cursor-pointer hover:text-[#7D1EDB]"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/hrms/department-details/overview", {
                        state: { department: dept },
                      });
                    }}
                  >
                    {dept.name}
                  </span>
                </td>
                <td className="py-2 px-4  text-[#1E1E1E]">{dept.head}</td>
                <td className="py-2 px-4  text-[#1E1E1E]">{dept.employees}</td>
                <td className="py-2 px-4  text-[#1E1E1E]">{dept.location}</td>
                <td className="py-2 px-4">
                  <span
                    className={`inline-flex items-center justify-center px-4 py-1 rounded-[18px] text-[16px] h-8.5 min-w-18.5 font-normal ${dept.status === true || dept.status === "Active" ? "bg-[#76DB1E33] text-[#34C759]" : "bg-[#FF3B301A] text-[#FF3B30]"}`}
                  >
                    {dept.status === true || dept.status === "Active"
                      ? "Active"
                      : "Inactive"}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => handleEditClick(dept)}
                    className="text-purple-600 hover:text-purple-800 transition-colors cursor-pointer"
                  >
                    <img
                      src="/pencil.svg"
                      alt="edit"
                      style={{ height: "20px", width: "20px" }}
                    />
                  </button>
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
          {Math.min(indexOfLastItem, departments.length)} Of{" "}
          {departments.length}
        </div>
        <div className="flex items-center justify-center md:justify-end lg:justify-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 transition-colors ${currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "hover:text-gray-900"}`}
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
              ),
            )}
          </div>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-1 transition-colors ${currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-[#1E1E1E] hover:text-gray-900"}`}
          >
            Next <ArrowRight size={14} />
          </button>
        </div>
        <div className="hidden lg:block"></div>
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
