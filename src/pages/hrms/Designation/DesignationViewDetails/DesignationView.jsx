import React, { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

const DesignationView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);

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

  const [designationInfo, setDesignationInfo] = useState({
    ...defaultDesignation,
    ...(location.state?.designation || {}),
  });

  useEffect(() => {
    if (designationInfo) {
      setFormData(designationInfo);
    }
  }, [designationInfo]);

  const handleDeleteClick = () => {
    // setShowDeleteModal(true);
    console.log("Delete clicked");
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setFormData(designationInfo);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData(designationInfo);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    if (formData) {
      setDesignationInfo(formData);
      console.log("Saving data:", formData);
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
      <div className="px-4 pt-4 shrink-0">
      {/* Breadcrumb */}
      <div
        className="flex items-center text-[14px] text-[#7D1EDB] mb-4 shrink-0"
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8 mb-4 px-2 font-normal shrink-0">
        <div className="w-[calc(100%-200px)]">
          <div className="flex items-center gap-2 mb-1">
            <img src="/images/department.svg" alt="dept" className="w-5 h-5" />
            <p className="text-[#7F7F7F] text-[18px]">Department</p>
          </div>
          <p className="text-[#1E1E1E] text-[17px]">
            {formData?.department || designationInfo.department}
          </p>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <img src="/images/levels.svg" alt="level" className="w-5 h-5" />
            <p className="text-[#7F7F7F] text-[18px]">Level</p>
          </div>
          <p className="text-[#1E1E1E] text-[17px]">
            {formData?.level || designationInfo.level}
          </p>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <img src="/images/report.svg" alt="report" className="w-5 h-5" />
            <p className="text-[#7F7F7F] text-[18px]">Reports To</p>
          </div>
          <p className="text-[#1E1E1E] text-[17px]">
            {formData?.reportsTo || designationInfo.reportsTo}
          </p>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <img src="/images/employees.svg" alt="emp" className="w-5 h-5" />
            <p className="text-[#7F7F7F] text-[18px]">Employees</p>
          </div>
          <p className="text-[#1E1E1E] text-[17px]">
            {formData?.employees || designationInfo.employees}
          </p>
        </div>
        <div className="flex ml-52 h-[24px] mt-4">
          <img src="/images/dots.svg" alt="dots" />
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
      </div>

      <Outlet
        context={{ designationInfo, isEditing, formData, handleInputChange }}
      />
    </div>
  );
};

export default DesignationView;
