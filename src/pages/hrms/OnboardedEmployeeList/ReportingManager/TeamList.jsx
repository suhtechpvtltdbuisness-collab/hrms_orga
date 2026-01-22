import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreVertical, ChevronRight } from 'lucide-react';
import AddProject from './AssignProject/AddProject';
import RemoveProject from './AssignProject/RemoveProject';
import RemoveSuccessModal from './AssignProject/SuccessModal';
import RemoveErrorModal from './AssignProject/ErrorModal';

const TeamList = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Carol John', role: 'Developer', skills: ['HTML', 'CSS', 'Node.js'], status: 'Assigned', isAssigned: false },
    { id: 2, name: 'Mike Miller', role: 'Developer', skills: ['HTML', 'CSS', 'Node.js'], status: 'Assigned', isAssigned: true },
    { id: 3, name: 'Sarah John', role: 'Developer', skills: ['HTML', 'CSS', 'Node.js'], status: 'Assigned', isAssigned: false },
    { id: 4, name: 'Arjun Meheta', role: 'Developer', skills: ['HTML', 'CSS', 'Node.js'], status: 'Assigned', isAssigned: false },
    { id: 5, name: 'Arjun Meheta', role: 'Developer', skills: ['HTML', 'CSS', 'Node.js'], status: 'Assigned', isAssigned: true },
    { id: 6, name: 'Arjun Meheta', role: 'Developer', skills: ['HTML', 'CSS', 'Node.js'], status: 'Assigned', isAssigned: false },
    { id: 7, name: 'Arjun Meheta', role: 'Developer', skills: ['HTML', 'CSS', 'Node.js'], status: 'Assigned', isAssigned: false },
  ]);

  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeActionMenu, setActiveActionMenu] = useState(null);
  const actionMenuRef = useRef(null);

  // Remove Project States
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isRemoveSuccessOpen, setIsRemoveSuccessOpen] = useState(false);
  const [employeeToRemove, setEmployeeToRemove] = useState(null);

  useEffect(() => {
    // ... (no changes to effect)
    const handleClickOutside = (event) => {
        if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
            setActiveActionMenu(null);
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddToProject = (employee) => {
    setSelectedEmployee(employee);
    setIsAddProjectModalOpen(true);
  };

  const handleProjectAdded = (data) => {
    setEmployees(prev => prev.map(emp => 
        emp.id === selectedEmployee.id ? { ...emp, isAssigned: true, startDate: data.startDate } : emp
    ));
    setIsAddProjectModalOpen(false);
    setSelectedEmployee(null);
  };

  const toggleActionMenu = (id, event) => {
    event.stopPropagation();
    setActiveActionMenu(activeActionMenu === id ? null : id);
  };

  const handleRemoveClick = (emp) => {
    setEmployeeToRemove(emp);
    setIsRemoveModalOpen(true);
    setActiveActionMenu(null);
  };

  const handleConfirmRemove = () => {
    if (employeeToRemove) {
        setEmployees(prev => prev.map(emp => 
            emp.id === employeeToRemove.id ? { ...emp, isAssigned: false } : emp
        ));
        setIsRemoveModalOpen(false);
        setIsRemoveSuccessOpen(true);
    }
  };

  return (
    <div className="bg-white mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)] xl:h-[calc(100vh-11rem)] flex flex-col border border-[#D9D9D9] font-sans" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
        
        {/* Header Section (Fixed) */}
        <div className="px-6 pt-6 shrink-0">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[14px] text-[#7D1EDB] mb-6 font-normal" style={{ fontFamily: '"Mulish", sans-serif' }}>
                <img src="/images/arrow_left_alt.svg" alt="Back" className="w-[12px] h-[8px] cursor-pointer" onClick={() => navigate('/hrms/onboarded-employee-list')} />
                 <span className="cursor-pointer hover:text-purple-700" onClick={() => navigate('/hrms/onboarded-employee-list')}>Employee List</span>
                 <ChevronRight size={16} className="text-[#494949]" />
                 <span className="text-[#667085]">My Team</span>
            </div>

            <div className="mb-8">
                <h1 className="text-[20px] font-semibold text-[#494949] mb-6" style={{ fontFamily: '"Poppins", sans-serif' }}>My Team</h1>
            </div>
        </div>

        {/* Scrollable Table Section */}
         <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-6 custom-scrollbar">
           <div className="border border-[#CECECE] rounded-[8px] overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="text-left" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  <th className="py-3 px-4 w-[80px] text-[14px] font-normal text-[#757575] bg-white border-b border-[#CECECE]">Sr no</th>
                  <th className="py-3 px-4 w-[200px] text-[14px] font-normal text-[#757575] bg-white border-b border-[#CECECE]">Employee Name</th>
                  <th className="py-3 px-4 w-[250px] text-[14px] font-normal text-[#757575] bg-white border-b border-[#CECECE]">Skills</th>
                  <th className="py-3 px-4 w-[150px] text-[14px] font-normal text-[#757575] bg-white border-b border-[#CECECE]">Primary Role</th>
                  <th className="py-3 px-4 w-[150px] text-[14px] font-normal text-[#757575] bg-white border-b border-[#CECECE]">Status</th>
                  <th className="py-3 px-4 w-[150px] text-[14px] font-normal text-[#757575] bg-white text-center border-b border-[#CECECE]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, index) => {
                  return (
                  <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-2 px-4 text-[15px] text-[#101828] font-semibold">{(index + 1).toString().padStart(2, '0')}</td>
                    <td className="py-2 px-4 text-[15px] text-[#101828] font-semibold">{emp.name}</td>
                    <td className="py-2 px-4">
                        <div className="flex gap-2 flex-wrap">
                          {emp.skills.map(skill => (
                              <span key={skill} className="px-2 py-1 bg-[#EEECFF] text-[#000000] font-semibold rounded-full text-[13px] border border-[#E2E8F0]">{skill}</span>
                          ))}
                        </div>
                    </td>
                    <td className="py-2 px-2 text-[15px] font-semibold text-[#101828]">{emp.role}</td>
                    <td className="py-2 px-2">
                        <span className="px-2 py-1 bg-[#E4F8D2] text-[#34C759] rounded-[20px] text-[15px] font-semibold">Assigned</span>
                    </td>
                    <td className="py-2 px-2 text-center relative">
                      {!emp.isAssigned ? (
                          <button 
                              onClick={() => handleAddToProject(emp)}
                              className="px-2 py-2 bg-[#7D1EDB] text-white rounded-full text-[13px] font-semibold hover:bg-[#6c1ac0] transition-colors whitespace-nowrap"
                          >
                              Add To Project
                          </button>
                      ) : (
                           <button 
                              onClick={() => handleRemoveClick(emp)}
                              className="px-2 py-2 bg-[#FF3B30] text-white rounded-full text-[13px] font-semibold hover:bg-[#D32F2F] transition-colors whitespace-nowrap"
                          >
                              Remove
                          </button>
                      )}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
           </div>
         </div>


      <AddProject 
        isOpen={isAddProjectModalOpen}
        onClose={() => setIsAddProjectModalOpen(false)}
        onAdd={handleProjectAdded}
        employee={selectedEmployee}
      />

      <RemoveProject 
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        onConfirm={handleConfirmRemove}
      />

      <RemoveSuccessModal
        isOpen={isRemoveSuccessOpen}
        onClose={() => setIsRemoveSuccessOpen(false)}
      />
      {/* <RemoveErrorModal ... /> */}
    </div>
  );
};

export default TeamList;
