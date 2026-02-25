import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ChevronRight, ArrowLeft } from "lucide-react";

import EmployeeProfileCard from "./EmployeeProfileCard";
import { Toast } from "../../../../components/common/Toast";

// Tabs
import EmpLeave from "./EmpLeave";
import EmpPerformance from "./EmpPerformance";
import EmpDocuments from "./EmpDocument";
import EmpPayroll from "./EmpPayroll";
import EmpTrainingDevelopment from "./EmpTrainingDevelopment";
import EmpOffBoarding from "./EmpOffBoarding";
import EmpActivityLog from "./EmpActivityLog";
import EmpPersonalInfo from "./EmpPersonalInfo";
import EmpEmployment from "./EmpEmployment";
import EmpAttendance from "./EmpAttendance";
import { employeeService } from "../../../../service";

const ViewEmployee = () => {
  const navigate = useNavigate();
  const { id, tab } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabsRef = useRef(null);

  const [employeeData, setEmployeeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Edit mode: driven by ?mode=edit in URL
  const isEditMode = searchParams.get("mode") === "edit";

  // Local editable form state (only used in edit mode)
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const response = await employeeService.getUserById(id);
        if (response.success && response.data) {
          setEmployeeData(response.data);
          // Pre-fill form with fetched data
          const d = response.data;
          setFormData({
            name: d.name || "",
            email: d.email || "",
            phone: d.phone || "",
            gender: d.gender || "",
            dob: d.dob || "",
            bloodGroup: d.bloodGroup || "",
            maritalStatus: d.maritalStatus ? "married" : "single",
            address: d.address || "",
            contactName: d.eContactName || "",
            contactNumber: d.eContactNumber || "",
            relation: d.eRelation || "",
            aadharNumber: d.aadharNo || "",
            panNumber: d.pancardNo || "",
          });
        }
      } catch (error) {
        console.error("Error fetching employee:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployeeData();
  }, [id]);

  // Switch to edit mode
  const handleEdit = () => {
    setSearchParams({ mode: "edit" });
  };

  // Cancel edit — revert & go back to view mode
  const handleCancel = () => {
    // Reset form to original data
    if (employeeData) {
      const d = employeeData;
      setFormData({
        name: d.name || "",
        email: d.email || "",
        phone: d.phone || "",
        gender: d.gender || "",
        dob: d.dob || "",
        bloodGroup: d.bloodGroup || "",
        maritalStatus: d.maritalStatus ? "married" : "single",
        address: d.address || "",
        contactName: d.eContactName || "",
        contactNumber: d.eContactNumber || "",
        relation: d.eRelation || "",
        aadharNumber: d.aadharNo || "",
        panNumber: d.pancardNo || "",
      });
    }
    setSearchParams({});
  };

  // Save — PUT /users/:id
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        dob: formData.dob,
        bloodGroup: formData.bloodGroup,
        maritalStatus: formData.maritalStatus === "married",
        address: formData.address,
        eContactName: formData.contactName,
        eContactNumber: formData.contactNumber,
        eRelation: formData.relation,
        aadharNo: formData.aadharNumber,
        pancardNo: formData.panNumber,
      };

      const response = await employeeService.updateEmployee(id, payload);

      if (response.success) {
        // Update local UI with confirmed data from server
        setEmployeeData(prev => ({ ...prev, ...payload }));
        setSearchParams({}); // exit edit mode
        setToast({
          type: "success",
          title: "Updated!",
          message: `${formData.name}'s details have been updated successfully.`,
        });
      } else {
        setToast({
          type: "error",
          title: "Update Failed",
          message: "The backend update API is not available yet. Please contact the backend team to implement PUT /users/:id.",
        });
      }
    } catch (error) {
      setToast({
        type: "error",
        title: "Error",
        message: "Something went wrong while updating.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const tabConfig = [
    { name: "Personal Information", path: "personal-information", component: <EmpPersonalInfo data={employeeData} isEditMode={isEditMode} formData={formData} onChange={handleFormChange} /> },
    { name: "Employment", path: "employment", component: <EmpEmployment data={employeeData} /> },
    { name: "Attendance", path: "attendance", component: <EmpAttendance data={employeeData} /> },
    { name: "Leave", path: "leave", component: <EmpLeave data={employeeData} /> },
    { name: "Performance", path: "performance", component: <EmpPerformance data={employeeData} /> },
    { name: "Documents", path: "documents", component: <EmpDocuments data={employeeData} /> },
    { name: "Payroll", path: "payroll", component: <EmpPayroll data={employeeData} /> },
    { name: "Training & Development", path: "training-development", component: <EmpTrainingDevelopment data={employeeData} /> },
    { name: "Off Boarding", path: "off-board", component: <EmpOffBoarding data={employeeData} /> },
    { name: "Activity Log", path: "activity-log", component: <EmpActivityLog data={employeeData} /> },
  ];

  const activeTab = tabConfig.find(t => t.path === tab) || tabConfig[0];

  useEffect(() => {
    const el = tabsRef.current?.querySelector('[data-active="true"]');
    el?.scrollIntoView({ behavior: "smooth", inline: "center" });
  }, [tab]);

  const cardData = employeeData ? {
    name: isEditMode ? (formData.name || "-") : (employeeData.name || "-"),
    designation: employeeData.designation || "-",
    empId: `EMP-${String(employeeData.id).padStart(3, '0')}`,
    mobile: isEditMode ? (formData.phone || "-") : (employeeData.phone || "-"),
    email: isEditMode ? (formData.email || "-") : (employeeData.email || "-"),
    location: isEditMode ? (formData.address || "-") : (employeeData.address || "-"),
    joiningDate: employeeData.createdAt ? new Date(employeeData.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "-",
    department: employeeData.department || "-",
    manager: employeeData.manager || "-",
    status: employeeData.active ? "Active" : "Inactive",
    gender: isEditMode ? (formData.gender || "-") : (employeeData.gender || "-"),
    dob: isEditMode ? (formData.dob || "-") : (employeeData.dob || "-"),
    bloodGroup: isEditMode ? (formData.bloodGroup || "-") : (employeeData.bloodGroup || "-"),
    maritalStatus: isEditMode ? (formData.maritalStatus === "married" ? "Married" : "Single") : (employeeData.maritalStatus ? "Married" : "Single"),
    eContactName: isEditMode ? (formData.contactName || "-") : (employeeData.eContactName || "-"),
    eContactNumber: isEditMode ? (formData.contactNumber || "-") : (employeeData.eContactNumber || "-"),
    eRelation: isEditMode ? (formData.relation || "-") : (employeeData.eRelation || "-"),
  } : null;

  if (isLoading) {
    return (
      <div className="bg-white px-4 sm:px-6 md:px-8 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] flex items-center justify-center border border-[#D9D9D9]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7D1EDB] mb-4"></div>
          <p className="text-gray-500">Loading employee details...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="bg-white px-4 sm:px-6 md:px-8 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)] xl:h-[calc(100vh-11rem)] flex flex-col border border-[#D9D9D9] font-sans" style={{ fontFamily: 'Poppins, sans-serif' }}>

        {/* Breadcrumb */}
        <div className="flex items-center text-sm mb-4 shrink-0">
          <span className="text-[#026E78] cursor-pointer hover:text-purple-600"
            onClick={() => navigate("/hrms/employees")}>Employee List</span>
          <ChevronRight size={16} className="mx-1" />
          <span className="text-[#667085] font-base">Employee Details</span>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6 shrink-0">
          <h1 className="text-xl font-bold">
            {isEditMode ? `Editing: ${formData.name || employeeData?.name || "Employee"}` : "Employee Information"}
          </h1>
          <div className="flex items-center gap-3">
            {!isEditMode ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-5 py-2 rounded-full border border-purple-600 text-purple-600 font-medium hover:bg-purple-50 transition-colors"
              >
                <span>Edit</span>
                <img src="/images/pencil_Icon.svg" alt="Edit" className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="px-5 py-2 rounded-full border border-purple-600 text-purple-600 font-medium hover:bg-purple-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-5 py-2 rounded-full bg-[#7D1EDB] text-white font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content Area - Split Layout */}
        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-auto">

          {/* Left Side - Profile Card (only on Personal Info tab) */}
          {activeTab.name === "Personal Information" && (
            <div className="w-full lg:w-[320px] shrink-0 h-auto lg:h-full">
              <EmployeeProfileCard
                data={cardData}
                profileImage={employeeData?.profileImage}
              />
            </div>
          )}

          {/* Right Side - Tabs & Content */}
          <div className="flex-1 min-w-0 h-full">
            <div className="flex flex-col h-full bg-white border border-[#D9D9D9] rounded-[24px] overflow-hidden">

              {/* Tabs Bar */}
              <div className="sticky top-0 z-10 bg-white pt-3 pb-1 px-3 border-b border-gray-100">
                <div ref={tabsRef} className="bg-[#EFEEE7] h-12 shrink-0 rounded-lg overflow-x-auto no-scrollbar flex">
                  {tabConfig.map((t, index) => (
                    <button
                      key={t.path}
                      data-active={activeTab.path === t.path}
                      onClick={() => navigate(`/hrms/employees-details/${id}/${t.path}${isEditMode ? "?mode=edit" : ""}`)}
                      className={`px-4 h-full flex items-center justify-center text-sm font-medium whitespace-nowrap transition-all
                                  ${index === 0 ? 'rounded-lg' : ''} 
                                  ${index === tabConfig.length - 1 ? 'rounded-lg' : ''}
                                  ${activeTab.path === t.path
                          ? "bg-[#7D1EDB] text-white rounded-lg"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}
                              `}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Area - Scrollable */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                {activeTab.component}
              </div>
            </div>
          </div>

        </div>

      </div>
    </>
  );
};

export default ViewEmployee;
