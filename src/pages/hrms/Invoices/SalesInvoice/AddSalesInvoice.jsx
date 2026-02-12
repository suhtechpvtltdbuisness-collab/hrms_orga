
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ChevronRight, Plus, Trash2, Calendar } from 'lucide-react';
import CustomDatePicker from '../../../../components/ui/CustomDatePicker';


const AddSalesInvoice = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    
    // Detect mode: 'view', 'edit', or 'create'
    let mode = location.state?.mode;
    if (!mode) {
        if (location.pathname.includes('/view/')) mode = 'view';
        else if (location.pathname.includes('/edit/')) mode = 'edit';
        else mode = 'create';
    }
    
    const invoiceFromState = location.state?.invoice;

    // Form State
    const [invoiceData, setInvoiceData] = useState({
        invoiceNumber: '',
        invoiceDate: '',
        dueDate: '',
        customerName: '',
        items: []
    });

    const [items, setItems] = useState([
        { id: 1, name: '', quantity: '', rate: '', tax: '', amount: 0 }
    ]);

    // Derived State for Totals
    const [subTotal, setSubTotal] = useState(0);
    const [totalTax, setTotalTax] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);

    // Load invoice data for view/edit modes
    useEffect(() => {
        const loadInvoiceData = (invoice) => {
            setInvoiceData({
                invoiceNumber: invoice.invoiceNumber || '',
                invoiceDate: invoice.invoiceDate || '',
                dueDate: invoice.dueDate || '',
                customerName: invoice.customerName || ''
            });
            
            if (invoice.items && invoice.items.length > 0) {
                setItems(invoice.items);
            }
        };

        if (mode !== 'create') {
            if (invoiceFromState) {
                loadInvoiceData(invoiceFromState);
            } else if (id) {
                const storedInvoices = JSON.parse(localStorage.getItem('salesInvoices')) || [];
                const foundInvoice = storedInvoices.find(inv => String(inv.id) === String(id));
                if (foundInvoice) {
                    loadInvoiceData(foundInvoice);
                }
            }
        }
    }, [mode, invoiceFromState, id]);

    useEffect(() => {
        const newSubTotal = items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.rate)), 0);
        const newTotalTax = items.reduce((sum, item) => {
            const itemAmount = Number(item.quantity) * Number(item.rate);
            return sum + (itemAmount * (Number(item.tax) / 100));
        }, 0);
        
        setSubTotal(newSubTotal);
        setTotalTax(newTotalTax);
        setGrandTotal(newSubTotal + newTotalTax);
    }, [items]);

    const handleAddItem = () => {
        const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
        setItems([...items, { id: newId, name: '', quantity: '', rate: '', tax: '', amount: 0 }]);
    };

    const handleRemoveItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    const handleItemChange = (id, field, value) => {
        setItems(items.map(item => {
            if (item.id === id) {
                if (field === 'name') {
                    if (/^[a-zA-Z\s]*$/.test(value)) {
                        return { ...item, [field]: value };
                    }
                    return item;
                } else if (field === 'quantity' || field === 'rate' || field === 'tax') {
                    if (/^\d*\.?\d*$/.test(value)) {
                        return { ...item, [field]: value };
                    }
                    return item;
                }
                return { ...item, [field]: value };
            }
            return item;
        }));
    };

    const handleSave = () => {
        if (!invoiceData.invoiceNumber || !invoiceData.customerName || !invoiceData.invoiceDate) {
            alert("Please fill in all required fields");
            return;
        }

        const newInvoice = {
            id: Date.now(),
            invoiceNumber: invoiceData.invoiceNumber,
            customerName: invoiceData.customerName,
            invoiceDate: invoiceData.invoiceDate,
            dueDate: invoiceData.dueDate,
            amount: grandTotal,
            status: 'Pending',
            items: items
        };

        const existingInvoices = JSON.parse(localStorage.getItem('salesInvoices')) || [];
        localStorage.setItem('salesInvoices', JSON.stringify([newInvoice, ...existingInvoices]));

        console.log("Saving invoice:", newInvoice);
        navigate('/hrms/sales-invoice');
    };

    const handleUpdate = () => {
        if (!invoiceData.invoiceNumber || !invoiceData.customerName || !invoiceData.invoiceDate) {
            alert("Please fill in all required fields");
            return;
        }

        const invoicePayload = {
            id: invoiceFromState.id,
            invoiceNumber: invoiceData.invoiceNumber,
            customerName: invoiceData.customerName,
            invoiceDate: invoiceData.invoiceDate,
            dueDate: invoiceData.dueDate,
            amount: grandTotal,
            status: invoiceFromState.status,
            items: items
        };

        const existingInvoices = JSON.parse(localStorage.getItem('salesInvoices')) || [];
        const updatedInvoices = existingInvoices.map(inv => 
            inv.id === invoicePayload.id ? invoicePayload : inv
        );
        localStorage.setItem('salesInvoices', JSON.stringify(updatedInvoices));

        console.log("Updating invoice:", invoicePayload);
        navigate('/hrms/sales-invoice');
    };

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col font-inter" style={{ fontFamily: 'Inter, sans-serif' }}>
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 shrink-0" style={{ fontFamily: 'Mulish, sans-serif' }}>
                 <img 
                    src="/images/arrow_left_alt.svg" 
                    alt="Back" 
                    className="w-3 h-3 cursor-pointer hover:scale-110 transition-transform" 
                    onClick={() => navigate('/hrms/sales-invoice')}
                />
                 <span 
                    className='cursor-pointer text-[#7D1EDB]'
                    onClick={() => navigate('/hrms/sales-invoice')}
                >
                    Sales Invoice
                </span> 
                <ChevronRight size={14}/> 
                <span className="text-[#6B7280]">
                    {mode === 'create' ? 'Create New Invoice' : invoiceData.invoiceNumber || 'Invoice Details'}
                </span>
            </div>

             {/* Header */}
             <div className="flex justify-between items-center mb-4 shrink-0">
                <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {mode === 'create' ? 'Create New Invoice' : invoiceData.invoiceNumber || 'Invoice Details'}
                </h1>
                
                <div className="flex gap-3">
                    <button
                        className="px-4 py-2 rounded-full border border-[#7D1EDB] text-[#7D1EDB] font-normal hover:bg-purple-50 transition-colors"
                        onClick={() => navigate('/hrms/sales-invoice')}
                    >
                        {mode === 'view' ? 'Back' : 'Cancel'}
                    </button>
                    {mode !== 'view' && (
                        <button
                            className="px-4 py-2 rounded-full bg-[#7D1EDB] text-white font-normal hover:bg-purple-700 transition-colors"
                            onClick={mode === 'edit' ? handleUpdate : handleSave}
                        >
                            {mode === 'edit' ? 'Update' : 'Save'}
                        </button>
                    )}
                </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto pr-2">
                {/* Invoice Details Card */}
                <div className="border border-[#E0E0E0] rounded-lg p-4 mb-4">
                    <h3 className="text-[15px] font-semibold text-[#000000] mb-3" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Invoice Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Invoice Number */}
                        <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Invoice Number</label>
                            <input 
                                type="text"
                                className="w-full border border-[#D9D9D9] rounded-lg px-4 py-2 text-[16px] text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB] placeholder-[#B3B3B3]"
                                placeholder="Enter number"
                                value={invoiceData.invoiceNumber}
                                disabled={mode === 'view'}
                                onChange={(e) => setInvoiceData({...invoiceData, invoiceNumber: e.target.value})}
                            />
                        </div>

                         {/* Invoice Date */}
                         <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Invoice Date</label>
                            <CustomDatePicker
                                value={invoiceData.invoiceDate}
                                onChange={(date) => setInvoiceData({...invoiceData, invoiceDate: date})}
                                placeholder="Select Date"
                                disabled={mode === 'view'}
                            />
                        </div>

                         {/* Due Date */}
                         <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Due Date</label>
                            <CustomDatePicker
                                value={invoiceData.dueDate}
                                onChange={(date) => setInvoiceData({...invoiceData, dueDate: date})}
                                placeholder="Select Date"
                                disabled={mode === 'view'}
                            />
                        </div>

                        {/* Customer Name */}
                        <div>
                            <label className="block text-[16px] font-normal text-[#1E1E1E] mb-1">Customer Name</label>
                            <input 
                                type="text"
                                className="w-full border border-[#D9D9D9] rounded-lg px-4 py-2 text-[16px] text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB] placeholder-[#B3B3B3]"
                                placeholder="Enter customer name"
                                value={invoiceData.customerName}
                                disabled={mode === 'view'}
                                onChange={(e) => setInvoiceData({...invoiceData, customerName: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                {/* Line Items Card */}
                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-[16px] font-medium text-[#1E1E1E]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Line Items</h2>
                        
                    </div>
                    
                    <div className="overflow-x-auto border border-[#CECECE] rounded-lg">
                        <table className="w-full">
                            <thead className="bg-white border-b border-[#CECECE]">
                                <tr>
                                    <th className="px-4 py-3 text-left text-[14px] font-normal text-[#757575] w-16" style={{ fontFamily: '"Poppins", sans-serif' }}>Sr.No.</th>
                                    <th className="px-4 py-3 text-center text-[14px] font-normal text-[#757575]" style={{ fontFamily: '"Poppins", sans-serif' }}>Item Name</th>
                                    <th className="px-4 py-3 text-center text-[14px] font-normal text-[#757575]" style={{ fontFamily: '"Poppins", sans-serif' }}>Quantity</th>
                                    <th className="px-4 py-3 text-center text-[14px] font-normal text-[#757575]" style={{ fontFamily: '"Poppins", sans-serif' }}>Rate</th>
                                    <th className="px-4 py-3 text-center text-[14px] font-normal text-[#757575]" style={{ fontFamily: '"Poppins", sans-serif' }}>Tax %</th>
                                    <th className="px-4 py-3 text-right text-[14px] font-normal text-[#757575] w-24" style={{ fontFamily: '"Poppins", sans-serif' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={item.id} className="last:border-b-0" style={{ fontFamily: '"Inter", sans-serif' }}>
                                        <td className="px-4 py-3 text-[14px] text-[#1E1E1E]">
                                            {String(index + 1).padStart(2, '0')}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <input 
                                                type="text" 
                                                value={item.name}
                                                onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                                                disabled={mode === 'view'}
                                                className="w-full text-center text-[14px] font-normal text-[#1E1E1E] focus:outline-none bg-transparent"
                                                placeholder="Item name"
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <input 
                                                type="text" 
                                                value={item.quantity}
                                                onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                                                disabled={mode === 'view'}
                                                className="w-full text-center text-[14px] font-normal text-[#1E1E1E] focus:outline-none bg-transparent"
                                                placeholder="Quantity"
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <input 
                                                type="text" 
                                                value={item.rate}
                                                onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)}
                                                disabled={mode === 'view'}
                                                className="w-full text-center text-[14px] font-normal text-[#1E1E1E] focus:outline-none bg-transparent"
                                                placeholder="Rate"
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <input 
                                                type="text" 
                                                value={item.tax}
                                                onChange={(e) => handleItemChange(item.id, 'tax', e.target.value)}
                                                disabled={mode === 'view'}
                                                className="w-full text-center text-[14px] font-normal text-[#1E1E1E] focus:outline-none bg-transparent"
                                                placeholder="Tax %"
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {mode !== 'view' && (
                                                <button 
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    className="text-[#1E1E1E] hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {mode !== 'view' && (
                    <button 
                        onClick={handleAddItem}
                        className="bg-white text-[#7D1EDB] py-2 px-3 rounded-full text-[14px] font-normal border border-[#7D1EDB] cursor-pointer hover:bg-purple-100 transition-colors"
                    >
                        Add Item
                    </button>
                )}

                {/* Totals Section */}
                <div className="border border-[#D6D6D6] rounded-lg p-4 mt-4 mb-4"style={{fontFamily: 'Nunito Sans, sans-serif'}}>
                    <div className="flex justify-end items-center gap-46 mb-2 py-2">
                        <span className="text-[14px] font-medium text-[#1E1E1E]">Sub-Total:</span>
                        <span className="text-[14px] font-medium text-[#1E1E1E]">{'\u20B9'}{subTotal.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-end items-center gap-46 mb-2 py-2">
                        <span className="text-[14px] font-medium text-[#1E1E1E]">Tax:</span>
                        <span className="text-[14px] font-medium text-[#1E1E1E]">{'\u20B9'}{totalTax.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-end items-center gap-46 py-2 border-t border-[#E0E0E0] pt-2">
                        <span className="text-[16px] font-semibold text-[#1E1E1E]">Total:</span>
                        <span className="text-[16px] font-semibold text-[#1E1E1E]">{'\u20B9'}{grandTotal.toFixed(0)}</span>
                    </div>
                </div>

                {/* Footer Actions */}
                {mode === 'create' && (
                    <div className="flex gap-3">
                        <button
                            className="px-6 py-2 rounded-full bg-[#7D1EDB] text-white font-medium hover:bg-purple-700 transition-colors"
                            onClick={handleSave}
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                            Create Invoice
                        </button>
                        <button
                            className="px-6 py-2 rounded-full border border-[#7D1EDB] text-[#7D1EDB] font-medium hover:bg-purple-50 transition-colors"
                            onClick={() => navigate('/hrms/sales-invoice')}
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddSalesInvoice;
