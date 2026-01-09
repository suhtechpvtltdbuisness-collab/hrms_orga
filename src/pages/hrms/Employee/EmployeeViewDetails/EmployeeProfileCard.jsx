import React from "react";

const EmployeeProfileCard = ({ isEditable = false, profileImage = "/EMP_IMG.svg", onImageChange, data }) => {
  const fileInputRef = React.useRef(null);


  const employeeData = data || {
    name: "Rohan Patil",
    designation: "Frontend Developer",
    empId: "EMP-1001",
    mobile: "+91 98453647588",
    email: "rohanp@company.com",
    location: "Mumbai",
    joiningDate: "15 Jan 2022",
    department: "HR",
    manager: "Priya Sharma",
    status: "Active"
  };

  return (
    <div className="bg-white rounded-3xl border border-[#D9D9D9] h-auto lg:h-full overflow-hidden flex flex-col" style={{ fontFamily: '"Inter", sans-serif' }}>
      <div className="flex-1 lg:overflow-y-auto custom-scrollbar p-6">
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={profileImage || "/EMP_IMG.svg"}
              alt="Employee"
              className="w-24 h-24 rounded-full object-cover"
            />
            {isEditable && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={onImageChange}
                />
                <button
                  className="absolute bottom-0 right-0"
                  onClick={() => fileInputRef.current.click()}
                >
                  <img src="/EMP_IMG_EDIT.svg" alt="Edit" className="w-8 h-8" />
                </button>
              </>
            )}
          </div>

          <h2 className="mt-4 text-[16px] font-semibold text-[#1E1E1E]">
            {employeeData.name}
          </h2>
          <p className="text-[12px] text-[#525252]">{employeeData.designation}</p>
          <p className="text-[16px] font-semibold text-[#1E1E1E] mt-1">
            {employeeData.empId}
          </p>
        </div>

        <div className="mt-6 flex flex-col items-center gap-2">
          {[
            ["Mobile", employeeData.mobile],
            ["Email", employeeData.email],
            ["Location", employeeData.location],
            ["Joining Date", employeeData.joiningDate],
            ["Department", employeeData.department],
            ["Manager", employeeData.manager],
            ["Status", employeeData.status],
          ].map(([label, value]) => (
            <div key={label} className="w-[260px]">
              <label className="block text-[14px] text-[#757575] mb-1.5 font-normal">
                {label}
              </label>
              <div className="flex items-center px-3 bg-[#F5F5F5] border border-[#D9D9D9] h-[48px] w-full rounded-[8px] text-[14px] text-[#757575]">
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfileCard;
