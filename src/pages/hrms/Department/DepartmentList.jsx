import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Pencil,
  Plus,
  ChevronLeft,
  ChevronRight,
  Search,
  ChevronDown,
  X
} from 'lucide-react';
import EditDepartmentModal from './DepartmentUpdate/EditDepartmentModal';
import SuccessModal from './DepartmentUpdate/SuccessModal';
import ErrorModal from './DepartmentUpdate/ErrorModal';

const DepartmentList = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  useEffect(() => {
    document.body.style.overflow = showModal ? 'hidden' : 'auto';
  }, [showModal]);

  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    departmentName: '',
    departmentCode: '',
    departmentHead: '',
    location: '',
    description: '',
    parentDepartment: '',
    status: '',
  });

  const departments = [
    { name: 'Finance', head: 'John Smith', employees: 18, location: 'Mumbai', status: 'Active' },
    { name: 'Human Resources', head: 'Alice Carol', employees: 5, location: 'Delhi', status: 'Active' },
    { name: 'Marketing', head: 'Amit B', employees: 12, location: 'Pune', status: 'Active' },
    { name: 'Operations', head: 'Priya Singh', employees: 22, location: 'Kolkata', status: 'Active' },
    { name: 'IT Services', head: 'Raj Kapoor', employees: 30, location: 'Mumbai', status: 'Active' },
    { name: 'Sales', head: 'Neha Gupta', employees: 25, location: 'Mumbai', status: 'Active' },
    { name: 'Finance', head: 'Pooja Chopra', employees: 28, location: 'Mumbai', status: 'Active' },
    { name: 'Finance', head: 'John Smith', employees: 15, location: 'Mumbai', status: 'Active' },
    { name: 'Finance', head: 'John Smith', employees: 18, location: 'Mumbai', status: 'Active' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    setShowModal(false);
    setFormData({
      departmentName: '',
      departmentCode: '',
      departmentHead: '',
      location: '',
      description: '',
      parentDepartment: '',
      status: '',
    });
  };

  const handleEditClick = (dept) => {
    setSelectedDepartment(dept);
    setShowEditModal(true);
  };

  const handleEditSave = (data) => {
    console.log('Updated department data:', data);
    setShowEditModal(false);
    setShowSuccessModal(true);
    // setShowErrorModal(true); // Uncomment to test error modal
  };

  return (
    <div className="bg-white px-4 sm:px-6 md:px-8 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)] xl:h-[calc(100vh-12rem)] flex flex-col font-popins" style={{ fontFamily: 'Poppins, sans-serif' }}>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h1 className="text-[20px] font-semibold text-[#494949]">Departments</h1>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 text-white font-medium hover:bg-purple-700 transition-colors bg-[#7D1EDB]"
          style={{
            width: '195px',
            height: '48px',
            padding: '10px 16px',
            borderRadius: '26px'
          }}
        >
          <span className='text-[16px] font-medium text-white font-popins'>Add Department</span>
          <Plus size={20} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center mb-4 h-12 shrink-0">
        {/* Search Bar */}
        <div className="relative">
          <div
            className="flex items-center bg-[#F9FAFB] border border-[#F9FAFB] text-[#B3B3B3]"
            style={{
              width: '380px',
              height: '48px',
              padding: '2px 32px 2px 24px',
              borderRadius: '32px',
              border: '1px solid #EEECFF'
            }}
          >
            <input
              type="text"
              placeholder="Search by department name..."
              className="bg-transparent w-full outline-none text-gray-700 placeholder-[#B3B3B3] text-[18px] font-base font-popins"
            />
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex gap-3 font-popins">
          <button
            className="flex items-center gap-2 px-4 py-3 text-[14px] font-base text-[#7D1EDB] rounded-lg hover:bg-purple-100 transition-colors"
            style={{ backgroundColor: '#EEECFF', minWidth: '140px', justifyContent: 'space-between' }}
          >
            All Locations
            <ChevronDown size={16} />
          </button>
          <button
            className="flex items-center gap-2 px-4 py-3 text-[14px] font-base text-[#7D1EDB] rounded-lg hover:bg-purple-100 transition-colors"
            style={{ backgroundColor: '#EEECFF', minWidth: '120px', justifyContent: 'space-between' }}
          >
            All Heads
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <table className="w-full relative border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="text-left text-[14px] font-popins">
              {['DEPARTMENT NAME', 'DEPARTMENT HEAD', 'EMPLOYEES', 'LOCATION', 'STATUS', 'ACTION'].map((head, i) => (
                <th
                  key={i}
                  className="py-4 px-4 text-sm font-normal text-[#707070] uppercase tracking-wider bg-white"
                >
                  <div className="flex items-center cursor-pointer hover:text-gray-700">
                    {head}
                    {head !== 'ACTION' && head !== 'STATUS' && <ChevronDown className="ml-1 w-3 h-3" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {departments.map((dept, index) => (
              <tr key={index} className="hover:bg-gray-50 group transition-colors text-[16px] font-base">
                <td className="py-4 px-4  text-[#7268FF] cursor-pointer" onClick={() => navigate('/hrms/department-details')}>{dept.name}</td>
                <td className="py-4 px-4  text-[#1E1E1E]">{dept.head}</td>
                <td className="py-4 px-4  text-[#1E1E1E]">{dept.employees}</td>
                <td className="py-4 px-4  text-[#1E1E1E]">{dept.location}</td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-[18px] text-[16px] h-[34px] w-[74px] font-normal bg-[#76DB1E33] text-[#34C759]">
                    {dept.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <button onClick={() => handleEditClick(dept)} className="text-purple-600 hover:text-purple-800 transition-colors">
                    <Pencil size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="relative flex items-center justify-center mt-2 pt-2 text-[16px] font-popins text-[#707070] shrink-0">
        <div className="absolute left-0">Showing 1-10 Of 100</div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 hover:text-gray-900 transition-colors">
            <ChevronLeft size={16} /> Previous
          </button>
          <div className="flex gap-1 ">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-600 text-white font-medium">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600">3</button>
            <span className="w-8 h-8 flex items-center justify-center text-gray-400">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600">6</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600">7</button>
          </div>
          <button className="flex items-center gap-1 hover:text-gray-900 transition-colors">
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#3B3A3A82] z-50 flex justify-center items-center">
          <div className="bg-white rounded-xl p-6 w-[95%] md:w-[700px] shadow-xl relative" style={{ fontFamily: 'Inter, sans-serif' }}>

            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[18px] font-semibold text-[#393C46]">Add New Department</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

              {/* Department Name */}
              <div className="flex flex-col gap-[8px]">
                <label className="text-[16px] font-base text-[#1E1E1E]">Department Name</label>
                <input
                  type="text"
                  name="departmentName"
                  value={formData.departmentName}
                  onChange={handleInputChange}
                  placeholder="Enter department name"
                  className="w-full h-[40px] px-4 py-2 border border-[#D9D9D9] rounded-[8px] text-[16px] font-base outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all placeholder:text-[#B8B8B8]"
                />
              </div>

              {/* Department Code */}
              <div className="flex flex-col gap-[8px]">
                <label className="text-[16px] font-base text-[#1E1E1E]">Department Code</label>
                <input
                  type="text"
                  name="departmentCode"
                  value={formData.departmentCode}
                  onChange={handleInputChange}
                  placeholder="Enter department code"
                  className="w-full h-[40px] px-4 py-2 border border-[#D9D9D9] rounded-[8px] text-[16px] font-base outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all placeholder:text-[#B8B8B8]"
                />
              </div>

              {/* Department Head */}
              <div className="flex flex-col gap-[8px]">
                <label className="text-[16px] font-base text-[#1E1E1E]">Department Head</label>
                <div className="relative">
                  <select
                    name="departmentHead"
                    value={formData.departmentHead}
                    onChange={handleInputChange}
                    className="w-full h-[40px] px-4 py-2 border border-[#D9D9D9] rounded-[8px] text-[16px] font-base outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all appearance-none bg-white text-[#1E1E1E]"
                  >
                    <option value="">Select a department head</option>
                    <option value="John Smith">John Smith</option>
                    <option value="Alice Carol">Alice Carol</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1E1E1E] pointer-events-none" />
                </div>
              </div>

              {/* Location */}
              <div className="flex flex-col gap-[8px]">
                <label className="text-[16px] font-base text-[#1E1E1E]">Location</label>
                <div className="relative">
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full h-[40px] px-4 py-2 border border-[#D9D9D9] rounded-[8px] text-[16px] font-base outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all appearance-none bg-white text-[#1E1E1E]"
                  >
                    <option value="">Select a location</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1E1E1E] pointer-events-none" />
                </div>
              </div>

              {/* Parent Department */}
              <div className="flex flex-col gap-[8px]">
                <label className="text-[16px] font-base text-[#1E1E1E]">Parent department</label>
                <div className="relative">
                  <select
                    name="parentDepartment"
                    value={formData.parentDepartment}
                    onChange={handleInputChange}
                    className="w-full h-[40px] px-4 py-2 border border-[#D9D9D9] rounded-[8px] text-[16px] font-base outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all appearance-none bg-white text-[#1E1E1E]"
                  >
                    <option value="">Select parent department</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1E1E1E] pointer-events-none" />
                </div>
              </div>

              {/* Status */}
              <div className="flex flex-col gap-[8px]">
                <label className="text-[16px] font-base text-[#1E1E1E]">Status</label>
                <div className="relative">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full h-[40px] px-4 py-2 border border-[#D9D9D9] rounded-[8px] text-[16px] font-base outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all appearance-none bg-white text-[#1E1E1E]"
                  >
                    <option value="">Select status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1E1E1E] pointer-events-none" />
                </div>
              </div>

            </div>

            {/* Description */}
            <div className="flex flex-col gap-[8px] mb-8">
              <label className="text[16px]m font-base text-[#1E1E1E]">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter department description"
                rows="3"
                className="w-full h-[80px] px-4 py-2 border border-[#D9D9D9] rounded-[8px] text-[16px] font-base outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all placeholder:text-[#B8B8B8] resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-8 py-2 border border-[#7D1EDB] rounded-full text-[#7D1EDB] font-medium hover:bg-purple-50 transition-colors"
                style={{ borderRadius: '30px' }}
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-8 py-2 bg-[#7D1EDB] text-white rounded-full font-medium hover:bg-purple-700 transition-colors shadow-sm"
                style={{ borderRadius: '30px' }}
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
          initialData={selectedDepartment ? {
            departmentName: selectedDepartment.name,
            departmentCode: "DEP-00X", // Mock code since not in initial info
            departmentHead: selectedDepartment.head,
            location: selectedDepartment.location,
            description: "Financial Panning, Reporting And Analysis Department Responsible For Company Finances", // Mock description
            parentDepartment: "Finance", // Mock parent
            status: selectedDepartment.status
          } : null}
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