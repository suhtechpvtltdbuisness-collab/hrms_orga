import React from "react";

const EmployeeProfileCard = () => {
  return (
    <div className="bg-white rounded-3xl border border-[#D9D9D9] h-full overflow-hidden flex flex-col" style={{ fontFamily: '"Inter", sans-serif' }}>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src="/EMP_IMG.svg"
              alt="Employee"
              className="w-24 h-24 rounded-full object-cover"
            />
            <button className="absolute bottom-0 right-0">
              <img src="/EMP_IMG_EDIT.svg" alt="Edit" className="w-8 h-8" />
            </button>
          </div>

          <h2 className="mt-4 text-[16px] font-semibold text-[#1E1E1E]">
            Rohan Patil
          </h2>
          <p className="text-[12px] text-[#525252]">Frontend Developer</p>
          <p className="text-[16px] font-semibold text-[#1E1E1E] mt-1">
            EMP-1001
          </p>
        </div>

        <div className="mt-6 flex flex-col items-center gap-2">
          {[
            ["Mobile", "+91 98453647588"],
            ["Email", "rohanp@company.com"],
            ["Location", "Mumbai"],
            ["Joining Date", "15 Jan 2022"],
            ["Department", "HR"],
            ["Manager", "Priya Sharma"],
            ["Status", "Active"],
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
