import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import FilterDropdown from '../../../components/ui/FilterDropdown';
import CustomDatePicker from '../../../components/ui/CustomDatePicker';
import {
    appraisalService,
    appraisalTemplateService,
    employeeService,
} from '../../../service';

const NewAppraisal = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        templateId: '',
        empId: '',
        status: 'Draft',
        startDate: '',
        endDate: '',
        remarks: '',
    });
    const [employeeName, setEmployeeName] = useState('');
    const [departmentName, setDepartmentName] = useState('');
    const [goals, setGoals] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [templateOptions, setTemplateOptions] = useState([]);
    const [employeeOptions, setEmployeeOptions] = useState([]);
    const [employeesMap, setEmployeesMap] = useState({});
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            const [templatesRes, userData] = await Promise.all([
                appraisalTemplateService.getDropdown(),
                Promise.resolve(JSON.parse(localStorage.getItem('userData') || '{}')),
            ]);

            if (templatesRes.success) {
                setTemplateOptions(
                    (templatesRes.data || []).map((t) => ({
                        label: t.title,
                        value: String(t.id),
                    })),
                );
            }

            const adminId = userData?.id;
            if (!adminId) return;
            const empRes = await employeeService.getAllEmployeesByAdminId(adminId);
            if (empRes.success && Array.isArray(empRes.data)) {
                const map = {};
                const options = empRes.data
                    .map((item) => {
                        const u = item.user || item;
                        if (!u?.id) return null;
                        map[String(u.id)] = {
                            name: u.name || u.email || `EMP-${u.id}`,
                            department:
                                item.department?.name ||
                                item.department?.departmentName ||
                                '—',
                        };
                        return {
                            label: u.name || u.email || `EMP-${u.id}`,
                            value: String(u.id),
                        };
                    })
                    .filter(Boolean);
                setEmployeeOptions(options);
                setEmployeesMap(map);
            }
        };
        load();
    }, []);

    useEffect(() => {
        if (!formData.templateId) return;
        const loadGoals = async () => {
            const res = await appraisalTemplateService.getTemplateById(formData.templateId);
            if (res.success && res.data) {
                setGoals(
                    (res.data.goals || []).map((g, index) => ({
                        id: g.id || index + 1,
                        templateGoalId: g.id,
                        srNo: g.srNo || String(index + 1).padStart(2, '0'),
                        goal: g.kra || '',
                        weightage: Number(g.weightage) || 0,
                        score: 0,
                        earned: 0,
                    })),
                );
                if (step < 2) setStep(2);
            }
        };
        loadGoals();
    }, [formData.templateId]);

    useEffect(() => {
        if (formData.empId && formData.startDate && formData.endDate && step < 3) {
            setStep(3);
        }
    }, [formData.empId, formData.startDate, formData.endDate, step]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (field === 'empId') {
            const emp = employeesMap[String(value)];
            setEmployeeName(emp?.name || '');
            setDepartmentName(emp?.department || '');
        }
    };

    const handleGoalChange = (id, field, value) => {
        if (field === 'score') {
            if (value === '' || /^\d*\.?\d*$/.test(value)) {
                const numVal = parseFloat(value);
                if (value === '' || value === '.' || (numVal >= 0 && numVal <= 5)) {
                    setGoals((prev) =>
                        prev.map((item) => {
                            if (item.id !== id) return item;
                            const score = value === '' || value === '.' ? 0 : parseFloat(value);
                            const earned = (score / 5) * Number(item.weightage || 0);
                            return { ...item, score: value, earned: earned.toFixed(2) };
                        }),
                    );
                }
            }
        } else if (field === 'weightage') {
            if (value === '' || /^\d*\.?\d*$/.test(value)) {
                setGoals((prev) =>
                    prev.map((item) => {
                        if (item.id !== id) return item;
                        const score = parseFloat(item.score || 0);
                        const newWeightage = value === '' ? 0 : parseFloat(value);
                        const earned = (score / 5) * newWeightage;
                        return { ...item, weightage: value, earned: earned.toFixed(2) };
                    }),
                );
            }
        } else if (field === 'goal') {
            if (value === '' || /^[a-zA-Z\s]*$/.test(value)) {
                setGoals((prev) =>
                    prev.map((item) => (item.id === id ? { ...item, goal: value } : item)),
                );
            }
        } else {
            setGoals((prev) =>
                prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
            );
        }
    };

    const handleAddRow = () => {
        const newId = goals.length > 0 ? Math.max(...goals.map((g) => g.id)) + 1 : 1;
        setGoals([
            ...goals,
            {
                id: newId,
                templateGoalId: null,
                srNo: String(goals.length + 1).padStart(2, '0'),
                goal: '',
                weightage: 0,
                score: 0,
                earned: 0,
            },
        ]);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRows(goals.map((item) => item.id));
        } else {
            setSelectedRows([]);
        }
    };

    const handleSelectRow = (id) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
        );
    };

    const calculateTotalScore = () => {
        return goals
            .reduce((acc, curr) => acc + parseFloat(curr.earned || 0), 0)
            .toFixed(3);
    };

    const handleSave = async () => {
        if (!formData.templateId) {
            setError('Please select an appraisal template');
            return;
        }
        if (!formData.empId) {
            setError('Please select an employee');
            return;
        }
        setSaving(true);
        setError('');
        const payload = {
            templateId: Number(formData.templateId),
            empId: Number(formData.empId),
            status: formData.status || 'Draft',
            startDate: formData.startDate || null,
            endDate: formData.endDate || null,
            remarks: formData.remarks || null,
            goals: goals.map((g, index) => ({
                templateGoalId: g.templateGoalId || null,
                srNo: String(index + 1).padStart(2, '0'),
                goal: g.goal,
                weightage: Number(g.weightage) || 0,
                score: Number(g.score) || 0,
                earned: Number(g.earned) || 0,
            })),
        };
        const res = await appraisalService.createAppraisal(payload);
        setSaving(false);
        if (res.success) {
            navigate('/hrms');
        } else {
            setError(res.message || 'Failed to save appraisal');
        }
    };

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col font-inter" style={{ fontFamily: 'Inter, sans-serif' }}>
            
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 shrink-0" style={{ fontFamily: 'Mulish, sans-serif' }}>
                 <img 
                    src="/images/arrow_left_alt.svg" 
                    alt="Back" 
                    className="w-3 h-3 cursor-pointer hover:scale-110 transition-transform" 
                    onClick={() => navigate('/hrms')}
                />
                <span 
                    className='cursor-pointer text-[#7D1EDB]'
                    onClick={() => navigate('/hrms')}
                >
                    HRMS Dashboard
                </span> 
                <ChevronRight size={14}/> 
                <span className="text-[#6B7280]">New Appraisal</span>
            </div>

            <div className="flex justify-between items-center mb-6 shrink-0">
                <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>New Appraisal</h1>
                
                <button
                    disabled={saving}
                    className="flex items-center justify-center gap-2 rounded-full py-2 px-3 text-white font-normal hover:bg-purple-700 transition-colors bg-[#7D1EDB] disabled:opacity-60"
                    onClick={handleSave}
                >
                    <span className='text-[16px] font-normal text-white' style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {saving ? 'Saving...' : 'Save'}
                    </span>
                </button>
            </div>

            {error && <div className="mb-3 text-sm text-red-500 shrink-0">{error}</div>}

            <div className="flex-1 overflow-y-auto pr-2">
                <div className="border border-[#E0E0E0] rounded-lg p-4 mb-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                         <div>
                            <label className="block text-sm font-normal text-[#1E1E1E] mb-2">Series</label>
                            <input
                                type="text"
                                value="Auto-generated on save"
                                readOnly
                                className="w-full bg-[#F5F5F5] border border-[#D9D9D9] rounded-lg px-4 py-2 text-sm text-[#9CA3AF] outline-none"
                            />
                        </div>
                        <div>
                             <label className="block text-sm font-normal text-[#1E1E1E] mb-2">Appraisal Template</label>
                            <FilterDropdown
                                options={templateOptions}
                                value={formData.templateId}
                                onChange={(val) => handleChange('templateId', val)}
                                className="w-full bg-[#F5F5F5] border border-[#D9D9D9] rounded-lg text-sm text-[#1E1E1E] flex items-center justify-between px-4 py-2"
                                showArrow={true}
                                dropdownWidth="100%"
                                disableAllOption={true}
                                placeholder="Select template"
                            />
                        </div>
                        {step >= 2 && (
                             <div className="animate-fade-in-down">
                                <label className="block text-sm font-normal text-[#1E1E1E] mb-2">For Employee</label>
                                <FilterDropdown
                                    options={employeeOptions}
                                    value={formData.empId}
                                    onChange={(val) => handleChange('empId', val)}
                                    className="w-full bg-[#F5F5F5] border border-[#D9D9D9] rounded-lg text-sm text-[#1E1E1E] flex items-center justify-between px-4 py-2"
                                    showArrow={true}
                                    dropdownWidth="100%"
                                     placeholder="Select employee"
                                     disableAllOption={true}
                                />
                            </div>
                        )}
                        
                        {step >= 2 && (
                            <>
                                 <div className="animate-fade-in-down">
                                    <label className="block text-sm font-normal text-[#1E1E1E] mb-2">Status</label>
                                    <input 
                                        type="text" 
                                        value={formData.status} 
                                        readOnly 
                                        className="w-full bg-[#F5F5F5] border border-[#D9D9D9] rounded-lg px-4 py-2 text-sm text-[#1E1E1E] outline-none"
                                    />
                                </div>
                                <div className="animate-fade-in-down">
                                    <label className="block text-sm font-normal text-[#1E1E1E] mb-2">Start Date</label>
                                    <CustomDatePicker 
                                        value={formData.startDate}
                                        onChange={(date) => handleChange('startDate', date)}
                                        className="w-full bg-[#F5F5F5] border border-[#D9D9D9] rounded-lg px-4 py-2 text-sm text-[#1E1E1E] outline-none"
                                    />
                                </div>
                                <div className="animate-fade-in-down">
                                    <label className="block text-sm font-normal text-[#1E1E1E] mb-2">End Date</label>
                                    <CustomDatePicker 
                                        value={formData.endDate}
                                        onChange={(date) => handleChange('endDate', date)}
                                        className="w-full bg-[#F5F5F5] border border-[#D9D9D9] rounded-lg px-4 py-2 text-sm text-[#1E1E1E] outline-none"
                                    />
                                </div>
                            </>
                        )}
                        
                         {step >= 2 && formData.empId && (
                            <>
                                <div className="animate-fade-in-down">
                                     <label className="block text-sm font-normal text-[#1E1E1E] mb-2">For Employee Name</label>
                                     <input type="text" value={employeeName} readOnly className="w-full border border-[#D9D9D9] rounded-lg px-4 py-2 text-sm text-[#1E1E1E] outline-none"/>
                                </div>
                                <div className="animate-fade-in-down">
                                     <label className="block text-sm font-normal text-[#1E1E1E] mb-2">Department</label>
                                     <input type="text" value={departmentName} readOnly className="w-full border border-[#D9D9D9] rounded-lg px-4 py-2 text-sm text-[#1E1E1E] outline-none"/>
                                </div>
                            </>
                         )}
                     </div>
                </div>

                {step >= 3 && (
                    <>
                        <div className="border border-[#E0E0E0] rounded-lg p-4 mb-4 animate-fade-in-down">
                            <h3 className="text-[16px] font-medium text-[#1E1E1E] mb-4" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>Goals</h3>
                            
                            <div className="border border-[#E0E0E0] rounded-lg overflow-hidden mb-4">
                                <table className="w-full border-collapse">
                                    <thead style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        <tr className="border-b border-[#E0E0E0]">
                                            <th className="py-3 px-6 w-[50px] text-center">
                                                <div className="flex items-center justify-center h-full">
                                                    <div className="relative flex items-center justify-center w-5 h-5 border-2 border-black rounded-[4px]">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={goals.length > 0 && selectedRows.length === goals.length}
                                                            onChange={handleSelectAll}
                                                            className="peer appearance-none w-full h-full cursor-pointer absolute inset-0 z-10 opacity-0"
                                                        />
                                                        {goals.length > 0 && selectedRows.length === goals.length && (
                                                            <svg className="w-3 h-3 text-black pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                </div>
                                            </th>
                                            <th className="py-3 px-4 text-[14px] font-normal text-[#757575] opacity-80 text-center">Sr No.</th>
                                            <th className="py-3 px-4 text-[14px] font-normal text-[#757575] opacity-80 text-center">Goals</th>
                                            <th className="py-3 px-4 text-[14px] font-normal text-[#757575] opacity-80 text-center">Weightage(%)</th>
                                            <th className="py-3 px-4 text-[14px] font-normal text-[#757575] opacity-80 text-center">Score(0-5)</th>
                                            <th className="py-3 px-4 text-[14px] font-normal text-[#757575] opacity-80 text-center">Score Earned</th>
                                            <th className="py-3 px-4 text-[14px] font-normal text-[#757575] opacity-80 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
                                        {goals.map((row, index) => (
                                            <tr key={row.id} className="last:border-b-0 hover:bg-gray-50">
                                                <td className="py-3 px-6 text-center">
                                                    <div className="flex items-center justify-center h-full">
                                                        <div className="relative flex items-center justify-center w-5 h-5 border-2 border-black rounded-[4px]">
                                                            <input 
                                                                type="checkbox" 
                                                                checked={selectedRows.includes(row.id)}
                                                                onChange={() => handleSelectRow(row.id)}
                                                                className="peer appearance-none w-full h-full cursor-pointer absolute inset-0 z-10 opacity-0"
                                                            />
                                                            {selectedRows.includes(row.id) && (
                                                                <svg className="w-3 h-3 text-black pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-center text-sm font-medium text-[#1E1E1E]">
                                                    {String(index + 1).padStart(2, '0')}
                                                </td>
                                                <td className="py-3 px-4 text-center text-sm font-medium text-[#1E1E1E]">
                                                    <input 
                                                        type="text"
                                                        value={row.goal}
                                                        onChange={(e) => handleGoalChange(row.id, 'goal', e.target.value)}
                                                        className="w-full text-center text-sm font-medium text-[#1E1E1E] bg-transparent focus:outline-none"
                                                    />
                                                </td>
                                                <td className="py-3 px-4 text-center text-sm font-medium text-[#1E1E1E]">
                                                    <input 
                                                        type="text"
                                                        value={row.weightage}
                                                        onChange={(e) => handleGoalChange(row.id, 'weightage', e.target.value)}
                                                        className="w-full text-center text-sm font-medium text-[#1E1E1E] bg-transparent focus:outline-none"
                                                    />
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <input 
                                                        type="text"
                                                        value={row.score}
                                                        onChange={(e) => handleGoalChange(row.id, 'score', e.target.value)}
                                                        className="w-16 text-center text-sm font-medium text-[#1E1E1E] bg-transparent focus:outline-none focus:border-[#7D1EDB]"
                                                    />
                                                </td>
                                                <td className="py-3 px-4 text-center text-sm font-medium text-[#1E1E1E]">
                                                    {row.earned}
                                                </td>
                                                <td className="py-3 px-6 text-center">
                                                    <button 
                                                        className="hover:scale-110 transition-transform"
                                                        type="button"
                                                    >
                                                        <img src="/pencil.svg" alt="Edit" className="w-[18px] h-[18px]" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                              <button 
                                onClick={handleAddRow}
                                className="px-3 py-2 rounded-full border border-[#7D1EDB] text-[#7D1EDB] text-sm font-medium hover:bg-purple-50 transition-colors"
                                style={{ fontFamily: 'Poppins, sans-serif' }}
                            >
                                Add Row
                            </button>
                            <div className="mt-4">
                                <label className="block text-sm font-normal text-[#1E1E1E] mb-2">Total Score (out of 5)</label>
                                <input 
                                    type="text" 
                                    value={calculateTotalScore()} 
                                    readOnly
                                    className="w-full sm:w-[320px] border border-[#E0E0E0] rounded-lg px-4 py-2 text-sm text-[#1E1E1E] outline-none"
                                />
                            </div>
                        </div>

                        <div className="border border-[#E0E0E0] rounded-lg p-4 animate-fade-in-down">
                            <h3 className="text-[16px] font-medium text-[#1E1E1E] mb-2" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>Remarks</h3>
                            <textarea 
                                value={formData.remarks}
                                onChange={(e) => handleChange('remarks', e.target.value)}
                                placeholder="Enter remark"
                                className="w-full border border-[#E0E0E0] rounded-lg px-4 py-3 text-sm text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB] min-h-[120px] resize-none"
                            />
                        </div>
                    </>
                )}

            </div>
        </div>
    );
};

export default NewAppraisal;
