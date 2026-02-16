import React from "react";
import { ArrowLeft, Plus, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ================= Reusable Components ================= */

const InfoField = ({ label, value }) => {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <div className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800">
        {value}
      </div>
    </div>
  );
};

const SubItem = ({ name, role, count }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm font-medium text-gray-900">{name}</p>
        <p className="text-xs text-gray-500">{role}</p>
      </div>
      <span className="text-sm font-medium text-gray-800">{count}</span>
    </div>
  );
};

const DesignationItem = ({ title, desc, count }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
      <span className="text-sm font-medium text-gray-800">{count}</span>
    </div>
  );
};

/* ================= Main Component ================= */

const NodeDetails = () => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white px-4 sm:px-6 md:px-8 py-6 mx-2 sm:mx-4 mt-4 mb-4
      rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)]
      xl:h-[calc(100vh-11rem)] flex flex-col border border-gray-200"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* ================= Breadcrumb ================= */}
      <div className="flex items-center text-sm mb-4">
        <div
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-purple-600 cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Add Node</span>
        </div>
        <span className="mx-2 text-gray-400">›</span>
        <span className="text-gray-500">Node Details</span>
      </div>

      {/* ================= Header ================= */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Alexander Chen
          </h1>
          <p className="text-sm text-gray-500">
            Chief Executive Officer
          </p>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-purple-600 text-white px-5 h-10 rounded-full text-sm font-medium hover:bg-purple-700">
            <Plus size={16} />
            Add Sub Node
          </button>

          <button className="flex items-center gap-2 border border-purple-600 text-purple-600 px-5 h-10 rounded-full text-sm font-medium hover:bg-purple-50">
            <Pencil size={16} />
            Edit
          </button>
        </div>
      </div>

      {/* ================= Content ================= */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">

        {/* ===== Profile + Basic Info ===== */}
        <div className="grid grid-cols-12 gap-6">

          {/* Profile Card */}
          <div className="col-span-12 md:col-span-4 border border-gray-200 rounded-xl p-6 flex flex-col items-center text-center">
            <img
              src="/images/girl_orga.svg"
              alt="Profile"
              className="w-20 h-20 rounded-full mb-3"
            />
            <h3 className="font-semibold text-gray-900">
              Alexander Chen
            </h3>
            <p className="text-sm text-gray-500">
              Chief Executive Officer
            </p>
          </div>

          {/* Basic Information */}
          <div className="col-span-12 md:col-span-8 border border-gray-200 rounded-xl p-6">
            <h3 className="text-sm font-semibold mb-4">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InfoField label="Department Name" value="Alexander Chen" />
              <InfoField label="Total Employees" value="2" />
              <InfoField label="Head" value="Chief Executive Officer" />
              <InfoField label="Parent Department" value="Executive" />
            </div>
          </div>
        </div>

        {/* ===== Sub Departments ===== */}
        <div className="border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-semibold mb-4">
            Sub-Departments (2)
          </h3>

          <div className="space-y-4">
            <SubItem
              name="Maria Garcia"
              role="VP Of Engineering"
              count="2 Members"
            />
            <SubItem
              name="Sarah Thomson"
              role="VP Of Operations"
              count="1 Member"
            />
          </div>
        </div>

        {/* ===== Designations ===== */}
        <div className="border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-semibold mb-4">
            Designations
          </h3>

          <div className="space-y-4">
            <DesignationItem
              title="VP Of Engineering"
              desc="Leads Engineering Team"
              count="2 Assigned"
            />
            <DesignationItem
              title="Senior Engineer"
              desc="Technical Leadership Role"
              count="3 Assigned"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default NodeDetails;