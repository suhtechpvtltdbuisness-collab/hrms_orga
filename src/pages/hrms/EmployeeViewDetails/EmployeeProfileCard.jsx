import React from "react";

const EmployeeProfileCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
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

        <h2 className="mt-4 text-lg font-semibold text-gray-800">
          Rohan Patil
        </h2>
        <p className="text-sm text-gray-500">Frontend Developer</p>
        <p className="text-sm font-semibold text-gray-700 mt-1">
          EMP-1001
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {[
          ["Mobile", "+9198453647588"],
          ["Email", "rohanp@company.com"],
          ["Location", "Mumbai"],
          ["Joining Date", "15 Jan 2022"],
          ["Department", "HR"],
          ["Manager", "Priya Sharma"],
          ["Status", "Active"],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <div className="text-sm text-gray-700 bg-gray-100 p-2 rounded">
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeProfileCard;
