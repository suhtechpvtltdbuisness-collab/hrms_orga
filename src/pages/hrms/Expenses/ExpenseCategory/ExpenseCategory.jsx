import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Plus, MoreVertical, Edit, Trash2 } from 'lucide-react';

const ExpenseCategory = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [actionDropdownOpen, setActionDropdownOpen] = useState(null);

    const mockCategories = [
        {
            id: 1,
            name: 'Office Equipment',
            linkedAccount: 'Equipment 6300',
            monthlyBudget: 70000,
            dailyLimit: null,
            approval: 'Not Required'
        },
        {
            id: 2,
            name: 'Travel',
            linkedAccount: 'Travel 6200',
            monthlyBudget: 70000,
            dailyLimit: 10000,
            approval: 'Required'
        },
        {
            id: 3,
            name: 'Meals',
            linkedAccount: 'Meals 6000',
            monthlyBudget: 70000,
            dailyLimit: 10000,
            approval: 'Required'
        },
        {
            id: 4,
            name: 'Other',
            linkedAccount: 'Other 6700',
            monthlyBudget: 70000,
            dailyLimit: 10000,
            approval: 'Required'
        }
    ];

    useEffect(() => {
        const storedCategories = JSON.parse(localStorage.getItem('expenseCategories')) || [];
        
        // Seed mock data if empty (User Request)
        if (storedCategories.length === 0) {
             localStorage.setItem('expenseCategories', JSON.stringify(mockCategories));
             setCategories(mockCategories);
        } else {
             setCategories(storedCategories);
        }
        setLoading(false);
    }, []);

    const toggleActionDropdown = (id) => {
        setActionDropdownOpen(actionDropdownOpen === id ? null : id);
    };

    const handleDelete = (id) => {
        const updatedCategories = categories.filter(cat => cat.id !== id);
        setCategories(updatedCategories);
        localStorage.setItem('expenseCategories', JSON.stringify(updatedCategories));
        setActionDropdownOpen(null);
    };
    
    // Format currency
    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return '-';
        return `₹${Number(amount).toLocaleString()}`;
    };

    const handleEdit = (id) => {
        navigate(`/hrms/expenses/category/${id}`);
    };

    return (
        <div className="bg-white px-4 sm:px-6 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col font-sans border border-[#D9D9D9]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            
            {/* Breadcrumb */}
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
                <span className="text-[#6B7280]">Expense Category</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 shrink-0">
                <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>Expense Category</h1>
                
                <button
                    onClick={() => navigate('/hrms/expenses/category/new')}
                    className="flex items-center justify-center gap-2 text-white font-medium hover:bg-purple-700 transition-colors bg-[#7D1EDB] w-full sm:w-auto px-6 py-2 rounded-full"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                    <span>Add Category</span>
                    <Plus size={18} />
                </button>
            </div>

            {/* Content Area */}
            <div className="overflow-hidden border border-[#E4E4E7] rounded-lg">
                <div className="overflow-x-auto overflow-y-auto h-full">
                
                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7D1EDB]"></div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && categories.length === 0 && (
                     <div className="flex flex-col my-10 items-center justify-center text-center">
                        <img 
                            src="/images/emptyAttendance.png" 
                            alt="No Categories Found" 
                            className="w-[350px] h-auto mb-4"
                        />
                        <h3 className="text-[20px] font-bold text-[#1E1E1E] mb-2" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
                            No Expenses found
                        </h3>
                        <p className="text-[14px] text-[#757575]" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
                            There are no expenses to show at the moment.
                        </p>
                    </div>
                )}

                {/* List View - Table */}
                {!loading && categories.length > 0 && (
                    <table className="w-full table-auto">
                        <thead className="sticky top-0 bg-[#FFFFFF] z-10 border-b border-[#E4E4E7]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            <tr className="text-left">
                                <th className="py-3 px-4 text-[14px] font-normal text-[#8B8B8B]">Category Name</th>
                                <th className="py-3 px-4 text-[14px] font-normal text-[#8B8B8B]">Linked Account</th>
                                <th className="py-3 px-4 text-[14px] font-normal text-[#8B8B8B]">Monthly Budget</th>
                                <th className="py-3 px-4 text-[14px] font-normal text-[#8B8B8B]">Daily Limit</th>
                                <th className="py-3 px-4 text-[14px] font-normal text-[#8B8B8B]">Approval</th>
                                <th className="py-3 px-4 text-[14px] font-normal text-[#8B8B8B] text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
                            {categories.map((category) => (
                                <tr key={category.id} className=" hover:bg-gray-50 transition-colors">
                                    <td className="py-2 px-4 text-[14px] font-semibold text-[#000000]">{category.name}</td>
                                    <td className="py-2 px-4 text-[14px] font-semibold text-[#000000]">{category.linkedAccount}</td>
                                    <td className="py-2 px-4 text-[14px] font-semibold text-[#000000]">{formatCurrency(category.monthlyBudget)}</td>
                                    <td className="py-2 px-4 text-[14px] font-semibold text-[#000000]">{formatCurrency(category.dailyLimit)}</td>
                                    <td className="py-2 px-4">
                                        <span 
                                            className={`inline-flex items-center px-1 rounded-full text-[14px] font-semibold ${
                                                category.approval === 'Required' ? 'bg-[#76DB1E33] text-[#76DB1E]' : 'bg-[#F2F4F7] text-[#344054]'
                                            }`}
                                        >
                                            {category.approval}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 text-center relative">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleActionDropdown(category.id);
                                            }}
                                            className="text-[#000000] hover:text-gray-600 focus:outline-none p-1 rounded-full hover:bg-gray-100 inline-flex items-center justify-center"
                                        >
                                            <MoreVertical size={18} />
                                        </button>
                                        
                                        {/* Dropdown */}
                                        {actionDropdownOpen === category.id && (
                                            <div className="absolute right-8 top-8 z-50 w-32 bg-white rounded-md shadow-lg border border-gray-100 py-1">
                                                <button 
                                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEdit(category.id);
                                                    }}
                                                >
                                                    <Edit size={14} />
                                                    Edit
                                                </button>
                                                <button 
                                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(category.id);
                                                    }}
                                                >
                                                    <Trash2 size={14} />
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                </div>
            </div>
        </div>
    );
};

export default ExpenseCategory;
