import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Eye, CheckSquare, Download, Search, RotateCcw } from 'lucide-react';
import { payrollModuleService } from '../../../service';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const formatDate = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
};

const getDisplayUser = (item = {}) => {
    const slip = item.salarySlip || item;
    const snapshot = slip.employeeSnapshot || {};
    const employee = item.employee || item.user || slip.employee || slip.user || {};

    return {
        name: item.employeeName || snapshot.name || employee.name || 'Employee',
        employeeId: snapshot.employeeId || employee.employeeId || employee.id || '—',
        email: snapshot.email || employee.email || '—',
        phone: snapshot.phone || employee.phone || '—',
        department: snapshot.department || employee.department || '—',
        designation: snapshot.designation || employee.designation || '—',
        location: snapshot.location || employee.location || '—',
        salaryStructure: snapshot.salaryStructure || employee.salaryStructure || '—',
    };
};

const getCompanyMeta = () => {
    try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const subscription = JSON.parse(localStorage.getItem('subscription') || '{}');

        return {
            name: userData.companyName || userData.organizationName || subscription.orgName || subscription.companyName || 'Company',
            email: userData.companyEmail || userData.email || subscription.email || '—',
            phone: userData.companyPhone || userData.phone || '—',
            address: userData.companyAddress || userData.organizationAddress || userData.address || '—',
        };
    } catch {
        return {
            name: 'Company',
            email: '—',
            phone: '—',
            address: '—',
        };
    }
};

const SalarySlip = () => {
    const navigate = useNavigate();

    const [slips, setSlips] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSlip, setSelectedSlip] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [companyMeta, setCompanyMeta] = useState(getCompanyMeta());

    useEffect(() => {
        setCompanyMeta(getCompanyMeta());
    }, []);

    // Fetch Slips
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await payrollModuleService.getSalarySlips();
            if (res.success && res.data) {
                setSlips(res.data);
            } else {
                toast.error(res.message || 'Failed to fetch salary slips');
            }
        } catch {
            toast.error('Failed to load salary slips');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Sign off on salary slip
    const handleSignOff = async (id) => {
        setIsActionLoading(true);
        try {
            const res = await payrollModuleService.signOffSalarySlip(id);
            if (res.success) {
                toast.success('Salary slip signed off successfully!');
                fetchData();
                if (selectedSlip && selectedSlip.salarySlip.id === id) {
                    setIsDetailOpen(false);
                }
            } else {
                toast.error(res.message || 'Failed to sign off');
            }
        } catch {
            toast.error('Failed to sign off salary slip');
        } finally {
            setIsActionLoading(false);
        }
    };

    // View Details Modal
    const handleViewDetails = (item) => {
        setSelectedSlip(item);
        setIsDetailOpen(true);
    };

    // Download PDF with jsPDF
    const handleDownloadPDF = (item) => {
        const slip = item.salarySlip || item;
        const entry = item.payrollEntry || {};
        const displayUser = getDisplayUser(item);
        const company = getCompanyMeta();

        const doc = new jsPDF();
        
        // Header
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.setTextColor(125, 30, 219); // #7D1EDB
        doc.text(company.name, 20, 25);
        
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.setFont('helvetica', 'normal');
        doc.text('Corporate Payroll Slip', 20, 32);
        
        // Slip Info right side
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(50, 50, 50);
        doc.text(`Payslip ID: ${slip.slipNumber}`, 130, 25);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated: ${new Date(slip.createdAt).toLocaleDateString()}`, 130, 32);

        // Divider Line
        doc.setDrawColor(220, 220, 220);
        doc.line(20, 38, 190, 38);

        // Metadata block (Employee snapshot)
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Company Details', 20, 48);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`Company: ${company.name}`, 20, 55);
        doc.text(`Email: ${company.email}`, 20, 61);
        doc.text(`Phone: ${company.phone}`, 20, 67);
        doc.text(`Address: ${company.address}`, 20, 73);

        doc.setFont('helvetica', 'bold');
        doc.text('Employee Details', 110, 48);
        doc.setFont('helvetica', 'normal');
        doc.text(`Name: ${displayUser.name}`, 110, 55);
        doc.text(`Employee ID: ${displayUser.employeeId}`, 110, 61);
        doc.text(`Email: ${displayUser.email}`, 110, 67);
        doc.text(`Phone: ${displayUser.phone}`, 110, 73);
        doc.text(`Department: ${displayUser.department}`, 110, 79);
        doc.text(`Designation: ${displayUser.designation}`, 110, 85);
        doc.text(`Salary Structure: ${displayUser.salaryStructure}`, 20, 79);
        doc.text(`Period Start: ${formatDate(entry.periodStart)}`, 20, 85);
        doc.text(`Period End: ${formatDate(entry.periodEnd)}`, 20, 91);
        doc.text(`Paid Days: ${entry.paidDays || '—'} Days`, 20, 97);

        // Earnings and Deductions tables side-by-side or combined
        const earningsRows = (slip.earnings || []).map(e => [e.name || e.componentName || 'Earning', `Rs. ${Number(e.amount).toFixed(2)}`]);
        const deductionsRows = (slip.deductions || []).map(d => [d.name || d.componentName || 'Deduction', `Rs. ${Number(d.amount).toFixed(2)}`]);

        // Draw Earnings Table
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Earnings', 20, 110);
        
        doc.autoTable({
            startY: 115,
            margin: { left: 20, right: 110 },
            head: [['Component', 'Amount']],
            body: earningsRows,
            theme: 'striped',
            headStyles: { fillColor: [125, 30, 219] },
            styles: { fontSize: 9 }
        });

        // Draw Deductions Table
        const earningsTableEndY = doc.lastAutoTable.finalY || 115;
        doc.text('Deductions', 110, 110);
        
        doc.autoTable({
            startY: 115,
            margin: { left: 110, right: 20 },
            head: [['Component', 'Amount']],
            body: deductionsRows,
            theme: 'striped',
            headStyles: { fillColor: [220, 53, 69] },
            styles: { fontSize: 9 }
        });

        const deductionsTableEndY = doc.lastAutoTable.finalY || 115;
        const mainTablesEndY = Math.max(earningsTableEndY, deductionsTableEndY);

        // Summary box
        const summaryY = mainTablesEndY + 15;
        doc.setDrawColor(125, 30, 219);
        doc.setFillColor(248, 245, 255);
        doc.rect(20, summaryY, 170, 30, 'FD');

        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        doc.setFont('helvetica', 'normal');
        doc.text(`Gross Earnings: Rs. ${Number(slip.grossPay).toFixed(2)}`, 25, summaryY + 10);
        doc.text(`Total Deductions: Rs. ${Number(slip.totalDeductions).toFixed(2)}`, 25, summaryY + 18);
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(125, 30, 219);
        doc.text(`Net Take-Home Pay: Rs. ${Number(slip.netPay).toFixed(2)}`, 110, summaryY + 15);

        // Signoff status
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100, 100, 100);
        doc.text(`Status: ${slip.status.toUpperCase()}`, 20, summaryY + 42);
        if (slip.signedOffAt) {
            doc.text(`Signed Off On: ${new Date(slip.signedOffAt).toLocaleString()}`, 20, summaryY + 48);
        }

        // Save PDF
        doc.save(`Payslip_${displayUser.name.replace(/\s+/g, '_')}_${slip.slipNumber}.pdf`);
        toast.success('Payslip PDF downloaded successfully!');
    };

    // Filter
    const filteredSlips = slips.filter(item => {
        const name = item.employeeName || item.salarySlip?.employeeSnapshot?.name || '';
        return !searchQuery || name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col border border-[#D9D9D9]">
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
                <span className="text-[#6B7280]">Salary Slip</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-4 shrink-0">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Salary Slips</h1>
                    <p className="text-sm text-gray-400">View corporate salary slips, download PDFs, and record official sign-offs</p>
                </div>
            </div>

            {/* Search and reload */}
            <div className="flex gap-4 mb-4 items-center flex-wrap shrink-0">
                <div className="relative max-w-xs flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Search by employee..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7D1EDB]"
                    />
                </div>
                <button 
                    onClick={fetchData}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600"
                    title="Reload"
                >
                    <RotateCcw size={16} />
                </button>
            </div>

            {/* List View Table */}
            <div className="flex-1 w-full overflow-y-auto border border-[#CECECE] rounded-lg">
                <table className="w-full border-collapse font-inter">
                    <thead className="bg-white sticky top-0 z-10 border-b border-[#CECECE]">
                        <tr className="text-left font-poppins">
                            <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Slip Number</th>
                            <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Employee</th>
                            <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Period Start</th>
                            <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Period End</th>
                            <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Gross Pay</th>
                            <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Deductions</th>
                            <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Net Pay</th>
                            <th className="px-4 py-3 text-[14px] font-medium text-[#757575]">Status</th>
                            <th className="px-4 py-3 text-[14px] font-medium text-[#757575] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={9} className="py-12 text-center text-gray-500">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7D1EDB] mx-auto mb-2"></div>
                                    Loading salary slips...
                                </td>
                            </tr>
                        ) : filteredSlips.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="py-12 text-center text-gray-400">No salary slips found</td>
                            </tr>
                        ) : (
                            filteredSlips.map((item) => {
                                const slip = item.salarySlip || item;
                                const entry = item.payrollEntry || {};
                                return (
                                    <tr key={slip.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-sm font-semibold text-[#7D1EDB]">{slip.slipNumber}</td>
                                        <td className="px-4 py-3 text-sm font-semibold text-[#1E1E1E]">{item.employeeName || slip.employeeSnapshot?.name || '—'}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {entry.periodStart ? new Date(entry.periodStart).toLocaleDateString() : '—'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {entry.periodEnd ? new Date(entry.periodEnd).toLocaleDateString() : '—'}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">₹{slip.grossPay}</td>
                                        <td className="px-4 py-3 text-sm text-red-600">₹{slip.totalDeductions}</td>
                                        <td className="px-4 py-3 text-sm font-semibold text-green-700">₹{slip.netPay}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                                                slip.status === 'signed_off' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {slip.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex gap-2 justify-end">
                                                <button 
                                                    onClick={() => handleViewDetails(item)} 
                                                    className="p-1.5 rounded-lg hover:bg-purple-50 text-[#7D1EDB]"
                                                    title="View Details"
                                                >
                                                    <Eye size={15} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDownloadPDF(item)} 
                                                    className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"
                                                    title="Download PDF"
                                                >
                                                    <Download size={15} />
                                                </button>
                                                {slip.status !== 'signed_off' && (
                                                    <button 
                                                        onClick={() => handleSignOff(slip.id)} 
                                                        disabled={isActionLoading}
                                                        className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 disabled:opacity-40 disabled:cursor-not-allowed"
                                                        title="Sign Off"
                                                    >
                                                        <CheckSquare size={15} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal for Details View */}
            {isDetailOpen && selectedSlip && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 font-inter">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl flex flex-col max-h-[85vh]">
                        {/* Header */}
                        <div className="flex justify-between items-start border-b pb-3 mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Payslip: {selectedSlip.salarySlip?.slipNumber}</h3>
                                <p className="text-xs text-gray-400">Employee: {getDisplayUser(selectedSlip).name}</p>
                            </div>
                            <button onClick={() => setIsDetailOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <span className="text-xl">×</span>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-[#CECECE] text-sm">
                                <div>
                                    <span className="text-xs text-gray-400 block mb-1">Company Name</span>
                                    <p className="font-semibold text-gray-900">{companyMeta.name}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 block mb-1">Company Email</span>
                                    <p className="font-semibold text-gray-900">{companyMeta.email}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 block mb-1">Company Phone</span>
                                    <p className="font-semibold text-gray-900">{companyMeta.phone}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 block mb-1">Company Address</span>
                                    <p className="font-semibold text-gray-900">{companyMeta.address}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-3 rounded-lg border border-[#CECECE] text-sm">
                                <div>
                                    <span className="text-xs text-gray-400 block mb-1">Employee Name</span>
                                    <p className="font-semibold text-gray-900">{getDisplayUser(selectedSlip).name}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 block mb-1">Employee ID</span>
                                    <p className="font-semibold text-gray-900">{getDisplayUser(selectedSlip).employeeId}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 block mb-1">Employee Email</span>
                                    <p className="font-semibold text-gray-900">{getDisplayUser(selectedSlip).email}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 block mb-1">Employee Phone</span>
                                    <p className="font-semibold text-gray-900">{getDisplayUser(selectedSlip).phone}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 block mb-1">Department</span>
                                    <p className="font-semibold text-gray-900">{getDisplayUser(selectedSlip).department}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 block mb-1">Designation</span>
                                    <p className="font-semibold text-gray-900">{getDisplayUser(selectedSlip).designation}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 block mb-1">Salary Structure</span>
                                    <p className="font-semibold text-gray-900">{getDisplayUser(selectedSlip).salaryStructure}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 block mb-1">Period</span>
                                    <p className="font-semibold text-gray-900">
                                        {formatDate(selectedSlip.payrollEntry?.periodStart)} - {formatDate(selectedSlip.payrollEntry?.periodEnd)}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 block mb-1">Paid Days</span>
                                    <p className="font-semibold text-gray-900">{selectedSlip.payrollEntry?.paidDays || '—'} Days</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="border rounded-lg p-3">
                                    <h4 className="font-semibold text-sm border-b pb-2 mb-2 text-purple-700">Earnings</h4>
                                    <div className="space-y-2">
                                        {(selectedSlip.salarySlip?.earnings || []).map((e, idx) => (
                                            <div key={idx} className="flex justify-between text-sm">
                                                <span>{e.name || e.componentName}</span>
                                                <span className="font-semibold">₹{e.amount}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="border rounded-lg p-3">
                                    <h4 className="font-semibold text-sm border-b pb-2 mb-2 text-red-600">Deductions</h4>
                                    <div className="space-y-2">
                                        {(selectedSlip.salarySlip?.deductions || []).map((d, idx) => (
                                            <div key={idx} className="flex justify-between text-sm">
                                                <span>{d.name || d.componentName}</span>
                                                <span className="font-semibold text-red-600">₹{d.amount}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-purple-50 p-4 rounded-lg border border-[#7D1EDB]/20 flex justify-between items-center">
                                <div>
                                    <span className="text-xs text-purple-700">Net Take-Home Pay</span>
                                    <p className="text-xl font-bold text-[#7D1EDB]">₹{selectedSlip.salarySlip?.netPay}</p>
                                </div>
                                <div className="text-right text-xs text-gray-500">
                                    <p>Gross: ₹{selectedSlip.salarySlip?.grossPay}</p>
                                    <p>Total Deductions: ₹{selectedSlip.salarySlip?.totalDeductions}</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex gap-2 justify-end border-t pt-3 mt-4">
                            <button
                                onClick={() => handleDownloadPDF(selectedSlip)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm flex items-center gap-1"
                            >
                                <Download size={15} /> Download PDF
                            </button>
                            {selectedSlip.salarySlip?.status !== 'signed_off' && (
                                <button
                                    onClick={() => handleSignOff(selectedSlip.salarySlip.id)}
                                    disabled={isActionLoading}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <CheckSquare size={15} /> {isActionLoading ? 'Signing Off...' : 'Sign Off'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalarySlip;
