import React, { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { designationService, departmentService, employeeService } from "../../../../service";

const DesignationView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [managers, setManagers] = useState([]);

  const defaultDesignation = {
    name: "Senior Product Manager",
    department: "Product",
    level: "5",
    reportsTo: "Director Of Product",
    employees: "5",
    createdOn: "2023-01-15 10:30 AM",
    lastUpdated: "2024-11-20 02:45 PM",
    description:
      "The Senior Product Manager is responsible for the product planning and execution throughout the Product Lifecycle, including: gathering and prioritizing product and customer requirements, defining the product vision, and working closely with engineering, sales, marketing and support to ensure revenue and customer satisfaction goals are met.",
    responsibilities: [
      "Define the product strategy and roadmap.",
      "Deliver MRDs and PRDs with prioritized features.",
      "Work with external third parties.",
    ],
    status: "Active",
    head: "John Smith",
    location: "Delhi",
  };

  const initialDesignation = location.state?.designation || {};
  const [designationInfo, setDesignationInfo] = useState({
    ...defaultDesignation,
    ...initialDesignation,
    department: initialDesignation.department || initialDesignation.departmentName || defaultDesignation.department,
    reportsTo: initialDesignation.reportingToName || initialDesignation.reportsTo || defaultDesignation.reportsTo,
  });

  useEffect(() => {
    const loadOptions = async () => {
      const deptRes = await departmentService.getDepartmentsDropdown();
      if (deptRes.success && Array.isArray(deptRes.data)) {
        setDepartmentOptions(deptRes.data);
      }

      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const adminId = userData?.id || userData?._id;
      if (adminId) {
        const empRes = await employeeService.getAllEmployeesByAdminId(adminId);
        if (empRes.success && Array.isArray(empRes.data)) {
          const mapped = empRes.data.map((item) => {
            const u = item.user || item;
            return {
              id: u.id,
              name: u.name,
              label: u.name,
              value: u.id,
            };
          });
          setManagers(mapped);
        }
      }
    };
    loadOptions();
  }, []);

  useEffect(() => {
    if (designationInfo) {
      setFormData(designationInfo);
    }
  }, [designationInfo]);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setFormData(designationInfo);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData(designationInfo);
  };

  const handleSaveClick = async () => {
    if (!formData) return;

    const selectedDept = departmentOptions.find(
      (d) => d.name === formData.department
    );
    const departmentId = selectedDept ? selectedDept.id : designationInfo.departmentId;

    const levelMap = {
      "L-1": 1, "L-2": 2, "L-3": 3, "L-4": 4, "L-5": 5,
      "1": 1, "2": 2, "3": 3, "4": 4, "5": 5
    };
    const levelInt = levelMap[formData.level] || 1;

    const selectedManager = managers.find(
      (m) => (m.name || m.label) === formData.reportsTo
    );
    const reportingTo = selectedManager ? selectedManager.id : designationInfo.reportingTo;

    const payload = {
      name: formData.name,
      departmentId,
      level: levelInt,
      reportingTo,
      status: formData.status === "Active" || formData.status === true,
      responsibility: Array.isArray(formData.responsibilities)
        ? formData.responsibilities.join("\n")
        : formData.responsibilities,
      description: formData.description,
    };

    try {
      const res = await designationService.updateDesignation(designationInfo.id, payload);
      if (res.success) {
        setDesignationInfo({
          ...designationInfo,
          ...formData,
          status: payload.status ? "Active" : "Inactive",
        });
        setIsEditing(false);
      } else {
        alert(res.message || "Failed to save designation");
      }
    } catch (err) {
      alert("Something went wrong");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const currentTab = location.pathname.split("/").pop().toLowerCase();

  const tabs = [
    { label: "Overview", path: "overview" },
    { label: "Employees", path: "employees" },
    { label: "Org Structure", path: "org-structure" },
    { label: "Settings", path: "settings" },
  ];

  const activeTabObj = tabs.find((t) => t.path === currentTab) || tabs[0];
  const activeTab = activeTabObj.label;

  const handleTabClick = (path) => {
    navigate(path, {
      state: { designation: isEditing ? formData : designationInfo },
    });
  };

  return (
    <div
      className="bg-white mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)] xl:h-[calc(100vh-11rem)] flex flex-col border border-[#D9D9D9] font-sans"
      style={{ fontFamily: '"Nunito Sans", sans-serif' }}
    >
      {/* Fixed Breadcrumb Section */}
      <div className="px-4 pt-4 shrink-0">
        <div
          className="flex items-center text-[14px] text-[#7D1EDB] mb-4"
          style={{ fontFamily: "Mulish, sans-serif" }}
        >
          <div
            className="flex items-center gap-3"
            onClick={() => navigate("/hrms/designations")}
          >
            <img
              src="/images/arrow_left_alt.svg"
              alt="Back"
              className="cursor-pointer"
            />
            <span className="font-normal cursor-pointer hover:text-purple-500">
              Designation List
            </span>
          </div>
          <ChevronLeft size={16} className="mx-1 rotate-180" />
          <span className="text-[#667085] text-[14px] font-normal">
            Designation Details
          </span>
        </div>
      </div>

      {/* Scrollable Content Section */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">

      {/* Header */}
      <div className="flex justify-between items-start shrink-0">
        <div>
          <h1 className="text-[20px] font-semibold text-[#494949]">
            {formData?.name || designationInfo.name}
          </h1>
        </div>
        <div className="flex gap-4">
          {isEditing ? (
            <>
              <button
                onClick={handleCancelClick}
                className="flex items-center justify-center text-[16px] font-medium mt-1 pt-0.5 w-[100px] h-[48px] border border-[#7D1EDB] text-[#7D1EDB] rounded-full hover:bg-[#EEECFF] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveClick}
                className="flex items-center justify-center text-[16px] font-medium mt-1 pt-0.5 w-[100px] h-[48px] bg-[#7D1EDB] text-white rounded-full hover:bg-[#6c1ac0] transition-colors"
              >
                Save
              </button>
            </>
          ) : (
            <button
              onClick={handleEditClick}
              className="flex items-center justify-center text-[16px] font-medium mt-1 pt-0.5 gap-[14px] w-[100px] h-[48px] border border-[#7D1EDB] text-[#7D1EDB] rounded-full hover:bg-[#EEECFF] transition-colors"
            >
              <span>Edit</span>
              <img
                src="/images/pencil_Icon.svg"
                alt="Edit"
                style={{ height: "14px", width: "14px" }}
              />
            </button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-4 px-2 font-normal shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <img src="/images/department.svg" alt="dept" className="w-5 h-5" />
            <p className="text-[#7F7F7F] text-[16px] md:text-[18px]">Department</p>
          </div>
          <p className="text-[#1E1E1E] text-[16px] md:text-[17px] wrap-break-word">
            {formData?.department || designationInfo.department}
          </p>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <img src="/images/levels.svg" alt="level" className="w-5 h-5" />
            <p className="text-[#7F7F7F] text-[16px] md:text-[18px] pr-2">Level</p>
          </div>
          <p className="text-[#1E1E1E] text-[16px] md:text-[17px]">
            {formData?.level || designationInfo.level}
          </p>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <img src="/images/report.svg" alt="report" className="w-5 h-5" />
            <p className="text-[#7F7F7F] text-[16px] md:text-[18px]">Reports To</p>
          </div>
          <p className="text-[#1E1E1E] text-[16px] md:text-[17px] wrap-break-word">
            {formData?.reportsTo || designationInfo.reportsTo}
          </p>
        </div>
        
        {/* merged Employees + Dots */}
        <div className="flex justify-between items-start lg:col-span-2">
             <div>
                <div className="flex items-center gap-2 mb-1">
                    <img src="/images/employees.svg" alt="emp" className="w-5 h-5" />
                    <p className="text-[#7F7F7F] text-[16px] md:text-[18px]">Employees</p>
                </div>
                <p className="text-[#1E1E1E] text-[16px] md:text-[17px]">
                    {formData?.employees || designationInfo.employees}
                </p>
            </div>

        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 mb-6 bg-[#EEECFF] py-[7px] px-[9px] rounded-lg shrink-0"
        style={{ width: "550px", height: "49.93px" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => handleTabClick(tab.path)}
            className={`px-5 py-2 rounded-[11px] text-[16px] font-medium cursor-pointer transition-all ${
              activeTab === tab.label
                ? "bg-[#7D1EDB] text-white "
                : "text-[#000000] hover:text-[#1E1E1E]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Outlet
        context={{ designationInfo, isEditing, formData, handleInputChange }}
      />
      </div>
    </div>
  );
};

export default DesignationView;
