import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ArrowLeft } from "lucide-react";
import Header from "./Header";
import TreeNode from "./TreeNode";
import DetailsPanel from "./DetailsPanel";

const OrganizationTree = () => {
  const navigate = useNavigate();

  // 🔹 MODAL STATE
  const [showModal, setShowModal] = useState(false);

  // 🔹 FORM STATE
  const [formData, setFormData] = useState({
    departmentName: "",
    departmentCode: "",
    parentDepartment: "",
    status: "",
    description: "",
  });

  // 🔹 HANDLERS
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("New Node Data:", formData);
    setShowModal(false);
  };

  return (
    <div
      className="bg-white px-4 sm:px-6 md:px-8 py-6 mx-2 sm:mx-4 mt-4 mb-4
      rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)]
      xl:h-[calc(100vh-11rem)] flex flex-col border border-gray-200"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center text-sm mb-3 shrink-0">
        <div
          className="flex items-center gap-3 cursor-pointer text-[#7D1EDB]"
          onClick={() => navigate("/hrms")}
        >
          <ArrowLeft size={14} className="text-gray-900" />
          <span className="hover:text-purple-500">HRMS Dashboard</span>
        </div>
        <ChevronRight size={16} className="mx-1 text-gray-400" />
        <span className="text-[#667085] text-[14px]">
          Organization Tree
        </span>
      </div>

      {/* Header */}
      <Header onAddNode={() => setShowModal(true)} />

      {/* Main Container */}
      <div className="border border-gray-200 rounded-3xl p-3 flex-1 min-h-0 flex flex-col">
        <div className="overflow-y-auto custom-scrollbar h-full rounded-[20px]">
          <div className="grid grid-cols-12 gap-6 p-2">

            {/* LEFT TREE */}
            <div className="col-span-7 border border-gray-200 rounded-xl p-4">
              <TreeNode
                name="Alexander Chen"
                role="Chief Executive Officer"
                avatar="/images/girl_orga.svg"
                expanded
              >
                <div className="ml-6 mt-4 space-y-4">
                  <TreeNode
                    name="Maria Garcia"
                    role="VP of Engineering"
                    avatar="/images/girl_orga (1).svg"
                    expanded
                  >
                    <div className="ml-6 mt-3 space-y-3">
                      <TreeNode
                        name="James Wilson"
                        role="Senior Engineer"
                        avatar="/images/girl_orga (2).svg"
                      />
                      <TreeNode
                        name="Emma Rodrigues"
                        role="Senior Engineer"
                        avatar="/images/girl_orga (3).svg"
                      />
                    </div>
                  </TreeNode>

                  <TreeNode
                    name="Sarah Thomson"
                    role="VP of Operations"
                    avatar="/images/girl_orga (4).svg"
                    expanded
                  >
                    <div className="ml-6 mt-3">
                      <TreeNode
                        name="Michal Brown"
                        role="Operations Manager"
                        avatar="/images/girl_orga (5).svg"
                      />
                    </div>
                  </TreeNode>
                </div>
              </TreeNode>
            </div>

            {/* RIGHT DETAILS */}
            <div className="col-span-5 border border-gray-200 rounded-xl">
              <DetailsPanel />
            </div>

          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
     {showModal && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center">
    <div className="bg-white rounded-xl p-6 w-[95%] md:w-[640px] shadow-xl">

      {/* Header */}
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Add New Node
      </h2>

      {/* Form */}
      <div className="space-y-5">

        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Node Type */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Node Type
            </label>
            <select
              name="nodeType"
              value={formData.nodeType}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-purple-600"
            >
              <option value="">Select node</option>
              <option value="Department">Department</option>
              <option value="Employee">Employee</option>
            </select>
          </div>

          {/* Parent Node */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Parent Node
            </label>
            <input
              type="text"
              name="parentNode"
              value={formData.parentNode}
              enabled
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500"
            />
          </div>
        </div>

        {/* Name */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter name"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm"
          />
        </div>

        {/* Head */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Head of Department / Manager
          </label>
          <input
            type="text"
            name="head"
            value={formData.head}
            onChange={handleInputChange}
            placeholder="Enter name"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm"
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="3"
            placeholder="Enter department description"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm resize-none"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 mt-8">
        <button
          onClick={() => setShowModal(false)}
          className="px-8 py-2 border border-purple-600 text-purple-600 rounded-full text-sm font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-8 py-2 bg-purple-600 text-white rounded-full text-sm font-medium hover:bg-purple-700"
        >
          Save
        </button>
      </div>

    </div>
  </div>
)}

    </div>
  );
};

export default OrganizationTree;