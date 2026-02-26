import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Eye, Pencil, Square } from 'lucide-react';

const OfferLetterAcceptedList = () => {
    const navigate = useNavigate();

    const [acceptedOffers] = useState([
        { id: 1, srNo: '01', name: 'Olivia Rhye', date: '8 Jan, 2026', status: 'Onboarding Completed' },
        { id: 2, srNo: '02', name: 'Olivia Rhye', date: '10 Feb, 2026', status: 'Onboarding In Progress' },
        { id: 3, srNo: '03', name: 'Olivia Rhye', date: '18 Feb, 2026', status: 'Onboarding Completed' },
        { id: 4, srNo: '04', name: 'Olivia Rhye', date: '20 Feb, 2026', status: 'Onboarding In Progress' },
        { id: 5, srNo: '05', name: 'Olivia Rhye', date: '1 March, 2026', status: 'Onboarding Completed' },
        { id: 6, srNo: '06', name: 'Olivia Rhye', date: '20 March, 2026', status: 'Onboarding Completed' },
    ]);

    const getStatusStyle = (status) => {
        const commonStyles = {
            height: '32px',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: '400',
            fontFamily: 'Poppins, sans-serif',
            lineHeight: '140%',
            textTransform: 'capitalize',
            padding: '0 16px'
        };

        if (status === 'Onboarding Completed') {
            return { 
                ...commonStyles,
                width: '192px',
                height: '32px',
                padding: '6px 12px',
                gap: '10px',
                borderRadius: '18px',
                backgroundColor: '#76DB1E33',
                color: '#34C759',
                fontSize: '14px',
                fontWeight: '400',
                lineHeight: '140%',
                opacity: '1'
            };
        } else if (status === 'Onboarding In Progress') {
            return { 
                ...commonStyles,
                width: '189px',
                height: '32px',
                padding: '6px 12px',
                gap: '10px',
                borderRadius: '18px',
                backgroundColor: '#1E5ADB33',
                color: '#0088FF',
                fontSize: '14px',
                fontWeight: '400',
                lineHeight: '140%',
                opacity: '1'
            };
        }
        return commonStyles;
    };

    return (
        <div 
            className="bg-white px-4 sm:px-6 md:px-8 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl min-h-[calc(100vh-6rem)]" 
            style={{ fontFamily: 'Poppins, sans-serif' }}
        >
            {/* Breadcrumb Section */}
            <div className="flex items-center text-sm text-[#7D1EDB] mb-3">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/hrms')}>
                    <ArrowLeft size={14} className="text-gray-900" />
                    <span className="hover:text-purple-500"> HRMS Dashboard</span>
                </div>
                <ChevronRight size={16} className="mx-1 text-[#9CA3AF]" />
                <span className="text-[#667085] text-[14px]">Offer Letter Accepted List</span>
            </div>

            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <h1 className="text-xl font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                    Offer Letter Accepted List
                </h1>
            </div>

            {/* Table Container */}
            <div 
                className="bg-white"
                style={{ 
                    width: '100%', 
                    minHeight: '347px', // Set as minHeight to avoid cutting off data
                    borderRadius: '8px', 
                    border: '1px solid #CECECE',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    marginBottom: '40px' // Add spacing at the bottom
                }}
            >
                <div className="overflow-x-auto shadow-sm flex-1">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                        <tr className="text-gray-500 border-b border-gray-100">
                            <th className="px-4 py-4 font-medium text-[12px] uppercase tracking-wider">SR NO</th>
                            <th className="px-4 py-4 font-medium text-[12px] uppercase tracking-wider">CANDIDATE NAME</th>
                            <th className="px-4 py-4 font-medium text-[12px] uppercase tracking-wider text-center">OFFER LETTER ACCEPTED DATE</th>
                            <th className="px-4 py-4 font-medium text-[12px] uppercase tracking-wider">STATUS</th>
                            <th className="px-4 py-4 font-medium text-[12px] uppercase tracking-wider text-center">ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {acceptedOffers.map((offer) => (
                            <tr key={offer.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-4 text-gray-700">{offer.srNo}</td>
                                <td className="px-4 py-4">
                                    <span 
                                        className="text-[#7268FF] font-medium text-[15px] cursor-pointer hover:underline"
                                        style={{ fontFamily: 'Poppins, sans-serif' }}
                                    >
                                        {offer.name}
                                    </span>
                                </td>
                                <td className="px-4 py-4 text-gray-700 text-center">{offer.date}</td>
                                <td className="px-4 py-4">
                                    <span 
                                        className="inline-flex items-center justify-center font-medium"
                                        style={getStatusStyle(offer.status)}
                                    >
                                        {offer.status}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center justify-center gap-3">
                                        <Eye 
                                            size={24} 
                                            strokeWidth={2}
                                            className="text-[#7D1EDB] cursor-pointer hover:text-purple-700 transition-colors" 
                                        />
                                        <Pencil 
                                            size={18} 
                                            strokeWidth={2}
                                            className="text-[#C6131B] cursor-pointer hover:text-red-700 transition-colors" 
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    );
};

export default OfferLetterAcceptedList;
