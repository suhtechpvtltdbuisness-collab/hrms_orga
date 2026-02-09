import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Trash2 } from 'lucide-react';
import CustomDatePicker from '../../../components/ui/CustomDatePicker';

const SalaryStructure = () => {
    const navigate = useNavigate();

    // Initial State
    const [formData, setFormData] = useState({
        structureName: '',
        company: '',
        isActive: true,
        taxSlab: '',
        effectiveFrom: '26/01/2026',
        basedOnPaymentDays: true
    });

    // Mock
    const [earnings, setEarnings] = useState([
        { id: 1, component: 'Basic', amount: '4000' },
        { id: 2, component: 'House Rent Allowance', amount: '16000' },
        { id: 3, component: 'Medical Allowance', amount: '10000' }
    ]);

    const [deductions, setDeductions] = useState([
        { id: 1, component: 'Provident Fund', amount: '4000' }
    ]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleDateChange = (date) => {
        setFormData(prev => ({ ...prev, effectiveFrom: date }));
    };

    const addEarning = () => {
        const newId = earnings.length > 0 ? Math.max(...earnings.map(e => e.id)) + 1 : 1;
        setEarnings([...earnings, { id: newId, component: '', amount: '' }]);
    };

    const removeEarning = (id) => {
        setEarnings(earnings.filter(e => e.id !== id));
    };

    const addDeduction = () => {
        const newId = deductions.length > 0 ? Math.max(...deductions.map(d => d.id)) + 1 : 1;
        setDeductions([...deductions, { id: newId, component: '', amount: '' }]);
    };

    const removeDeduction = (id) => {
        setDeductions(deductions.filter(d => d.id !== id));
    };

    const handleTableChange = (type, id, field, value) => {
        const updater = type === 'earning' ? setEarnings : setDeductions;
        const list = type === 'earning' ? earnings : deductions;
        
        if (field === 'component') {
            // Allow only alphabets and spaces
            if (/^[a-zA-Z\s]*$/.test(value)) {
                updater(list.map(item => 
                    item.id === id ? { ...item, [field]: value } : item
                ));
            }
        } else if (field === 'amount') {
            // Allow only numbers
            if (/^[0-9]*$/.test(value)) {
                updater(list.map(item => 
                    item.id === id ? { ...item, [field]: value } : item
                ));
            }
        }
    };

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 shrink-0" style={{ fontFamily: '"Mulish", sans-serif' }}>
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
                <span className="text-[#6B7280]">Salary Structure</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-4 shrink-0">
                <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Salary Structure</h1>
                
                <button
                    className="flex items-center justify-center gap-2 rounded-full py-2 px-3 text-white font-normal hover:bg-purple-700 transition-colors bg-[#7D1EDB]"
                    onClick={() => {}}
                >
                    <span className='text-[16px] font-normal text-white cursor-pointer'style={{ fontFamily: 'Poppins, sans-serif' }}>Save</span>
                </button>
            </div>

            {/* Form Content - Scrollable Area */}
            <div className="flex-1 w-full max-w-full overflow-y-auto pr-2">
                
                {/* Basic Information */}
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                    <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Basic Information</h2>
                    <div className="w-full lg:w-[66%] grid grid-cols-1 md:grid-cols-2 gap-3 mb-3" style={{ fontFamily: '"Inter", sans-serif' }}>
                        {/* Salary Structure Name */}
                        <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Salary Structure Name</label>
                            <input 
                                type="text"
                                name="structureName"
                                value={formData.structureName}
                                onChange={handleChange}
                                placeholder="Enter name"
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[16px] font-normal text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                            />
                        </div>
                        {/* Company */}
                        <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Company</label>
                            <input 
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="Enter company name"
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[16px] font-normal text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                            />
                        </div>
                    </div>
                    {/* Is Active Toggle */}
                    <div className="w-full lg:w-[66%] grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center justify-between max-w-sm">
                            <span className="text-[16px] font-normal text-[#1E1E1E]">Is Active</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    name="isActive"
                                    checked={formData.isActive} 
                                    onChange={handleChange} 
                                    className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7D1EDB]"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Earnings Table */}
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-[16px] font-medium text-[#1E1E1E]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Earnings Table</h2>
                        <button 
                            onClick={addEarning}
                            className="bg-[#7D1EDB] text-white py-2 px-3 rounded-full text-[14px] font-normal cursor-pointer hover:bg-purple-700 transition-colors"
                        >
                            Add Earnings
                        </button>
                    </div>
                    
                    <div className="overflow-x-auto border border-[#CECECE] rounded-lg">
                        <table className="w-full">
                            <thead className="bg-white border-b border-[#CECECE]">
                                <tr>
                                    <th className="px-4 py-3 text-left text-[14px] font-normal text-[#757575] w-16" style={{ fontFamily: '"Poppins", sans-serif' }}>Sr.No.</th>
                                    <th className="px-4 py-3 text-center text-[14px] font-normal text-[#757575]" style={{ fontFamily: '"Poppins", sans-serif' }}>Salary Component</th>
                                    <th className="px-4 py-3 text-center text-[14px] font-normal text-[#757575]" style={{ fontFamily: '"Poppins", sans-serif' }}>Amount/Formula</th>
                                    <th className="px-4 py-3 text-right text-[14px] font-normal text-[#757575] w-24" style={{ fontFamily: '"Poppins", sans-serif' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {earnings.map((row, index) => (
                                    <tr key={row.id} className="last:border-b-0"style={{ fontFamily: '"Inter", sans-serif' }}>
                                        <td className="px-4 py-3 text-[14px] text-[#1E1E1E]">
                                            {String(index + 1).padStart(2, '0')}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <input 
                                                type="text" 
                                                value={row.component}
                                                onChange={(e) => handleTableChange('earning', row.id, 'component', e.target.value)}
                                                className="w-full text-center text-[14px] font-normal text-[#1E1E1E] focus:outline-none bg-transparent"
                                                placeholder="Component"
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <input 
                                                type="text" 
                                                value={row.amount}
                                                onChange={(e) => handleTableChange('earning', row.id, 'amount', e.target.value)}
                                                className="w-full text-center text-[14px] font-normal text-[#1E1E1E] focus:outline-none bg-transparent"
                                                placeholder="Amount"
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button 
                                                onClick={() => removeEarning(row.id)}
                                                className="text-[#1E1E1E] hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Deduction Table */}
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-[16px] font-medium text-[#1E1E1E]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Deduction Table</h2>
                        <button 
                            onClick={addDeduction}
                            className="bg-[#7D1EDB] text-white py-2 px-3 rounded-full text-[14px] font-normal cursor-pointer hover:bg-purple-700 transition-colors"
                        >
                            Add Deductions
                        </button>
                    </div>
                    
                    <div className="overflow-x-auto border border-[#CECECE] rounded-lg">
                        <table className="w-full">
                            <thead className="bg-white border-b border-[#CECECE]">
                                <tr>
                                    <th className="px-4 py-3 text-left text-[14px] font-normal text-[#757575] w-16" style={{ fontFamily: '"Poppins", sans-serif' }}>Sr.No.</th>
                                    <th className="px-4 py-3 text-center text-[14px] font-normal text-[#757575]" style={{ fontFamily: '"Poppins", sans-serif' }}>Salary Component</th>
                                    <th className="px-4 py-3 text-center text-[14px] font-normal text-[#757575]" style={{ fontFamily: '"Poppins", sans-serif' }}>Amount/Formula</th>
                                    <th className="px-4 py-3 text-right text-[14px] font-normal text-[#757575] w-24" style={{ fontFamily: '"Poppins", sans-serif' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deductions.map((row, index) => (
                                    <tr key={row.id} className="last:border-b-0"style={{ fontFamily: '"Inter", sans-serif' }}>
                                        <td className="px-4 py-3 text-[14px] text-[#1E1E1E]">
                                            {String(index + 1).padStart(2, '0')}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <input 
                                                type="text" 
                                                value={row.component}
                                                onChange={(e) => handleTableChange('deduction', row.id, 'component', e.target.value)}
                                                className="w-full text-center text-[14px] font-normal text-[#1E1E1E] focus:outline-none bg-transparent"
                                                placeholder="Component"
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <input 
                                                type="text" 
                                                value={row.amount}
                                                onChange={(e) => handleTableChange('deduction', row.id, 'amount', e.target.value)}
                                                className="w-full text-center text-[14px] font-normal text-[#1E1E1E] focus:outline-none bg-transparent"
                                                placeholder="Amount"
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button 
                                                onClick={() => removeDeduction(row.id)}
                                                className="text-[#1E1E1E] hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Conditions */}
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                    <h2 className="text-[16px] font-medium text-[#1E1E1E] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Conditions</h2>
                    <div className="w-full lg:w-[66%] grid grid-cols-1 md:grid-cols-2 gap-3 mb-3"style={{ fontFamily: '"Inter", sans-serif' }}>
                        {/* Tax Slab */}
                        <div>
                            <label className="block text-[16px] font-normal font-inter text-[#1E1E1E] mb-1">Tax Slab</label>
                            <input 
                                type="text"
                                name="taxSlab"
                                value={formData.taxSlab}
                                onChange={handleChange}
                                placeholder="Enter tax slab"
                                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-[16px] font-normal  text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                            />
                        </div>
                        {/* Effective From */}
                        <div>
                            <label className="block text-[16px] font-normal  text-[#1E1E1E] mb-1 bg-white">Effective From</label>
                            <CustomDatePicker 
                                value={formData.effectiveFrom}
                                onChange={handleDateChange}
                                className="w-full bg-white"
                            />
                        </div>
                    </div>
                    {/* Based On Payment Days Toggle */}
                    <div className="w-full lg:w-[66%] grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center justify-between max-w-sm">
                            <span className="text-[16px] font-normal text-[#1E1E1E]"style={{ fontFamily: '"Inter", sans-serif' }}>Based On Payment Days</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    name="basedOnPaymentDays"
                                    checked={formData.basedOnPaymentDays} 
                                    onChange={handleChange} 
                                    className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7D1EDB]"></div>
                            </label>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SalaryStructure;
