import React, { useState, useEffect } from 'react';
import { Pencil, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const DepartmentList = () => {
  const [showModal, setShowModal] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
        <h1 className="text-2xl font-semibold text-gray-800">Departments</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          Add Department <Plus size={18} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by department name.."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
        />

        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
          <option>All Locations</option>
          <option>Mumbai</option>
          <option>Delhi</option>
          <option>Pune</option>
          <option>Kolkata</option>
        </select>

        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
          <option>All Heads</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full min-w-[650px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Department Name', 'Department Head', 'Employees', 'Location', 'Status', 'Action'].map((head, i) => (
                <th
                  key={i}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {departments.map((dept, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-purple-600">{dept.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{dept.head}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{dept.employees}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{dept.location}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    {dept.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <button className="text-purple-600 hover:text-purple-800">
                    <Pencil size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-6">
        <p className="text-sm text-gray-600">Showing 1-10 of 100</p>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1">
            <ChevronLeft size={16} /> Previous
          </button>

          {[1, 2, 3].map(num => (
            <button
              key={num}
              className={`px-3 py-1 rounded ${num === 1 ? 'bg-purple-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
            >
              {num}
            </button>
          ))}

          <span className="px-2">...</span>

          {[6, 7].map(num => (
            <button key={num} className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
              {num}
            </button>
          ))}

          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1">
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-start pt-10">
          <div className="bg-white rounded-2xl p-4 md:p-6 w-[95%] md:w-[720px] max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200">

            <h2 className="text-xl font-semibold mb-6 text-gray-800">Add Department</h2>

            <div className="space-y-4">
              {[
                { label: 'Department Name', name: 'departmentName', type: 'text' },
                { label: 'Department Code', name: 'departmentCode', type: 'text' }
              ].map((field, i) => (
                <div key={i}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                </div>
              ))}

              {/* Dropdowns */}
              {[
                { label: 'Department Head', name: 'departmentHead', options: ['John Smith', 'Alice Carol', 'Amit B'] },
                { label: 'Location', name: 'location', options: ['Mumbai', 'Delhi', 'Pune', 'Kolkata'] },
                { label: 'Parent department', name: 'parentDepartment', options: ['Finance', 'Human Resources', 'Marketing'] },
                { label: 'Status', name: 'status', options: ['Active', 'Inactive'] }
              ].map((field, i) => (
                <div key={i}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  <select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-500"
                  >
                    <option value="">Select {field.label.toLowerCase()}</option>
                    {field.options.map((opt, i) => (
                      <option key={i} value={opt.toLowerCase()}>{opt}</option>
                    ))}
                  </select>
                </div>
              ))}

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Enter department description"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
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

export default DepartmentList;