import React from 'react';
import { ArrowUpRight } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const HRMS = () => {
    const navigate = useNavigate();
    // Defined shortcuts matching the image
    const shortcuts = [
        { name: 'New Hiring' },
        { name: 'New Onboarding' },
        { name: 'Organization Tree' },
        { name: 'Designation' },
        { name: 'Department', badge: true },
        { name: 'Employee List', badge: true },
        { name: 'Schedule Interview' },
        { name: 'Attendance' },
    ];

    return (
        <div className="bg-white px-8 py-6 mx-5 mt-5 rounded-xl min-h-screen border border-[#D9D9D9]">
            {/* Header */}
            <div className="mb-4">
                <h1 className="text-xl font-semibold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>Employee Management Dashboard</h1>
            </div>

            {/* Banner / Map Section */}
            <div className="w-full h-96 bg-[#D9D9D9] rounded-xl relative flex items-center justify-center shadow-inner overflow-hidden mb-6"></div>

            {/* Shortcuts */}
            <div>
                <h2 className="text-lg font-medium text-gray-900 mb-6" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Your Shortcuts</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-8 ">
                    {shortcuts.map((shortcut) => (
                        <div
                            key={shortcut.name}
                            className="flex items-center group cursor-pointer"
                            onClick={() => {
                                if (shortcut.name === 'Employee List') {
                                    navigate('/hrms/employees');
                                }
                            }}
                        >
                            <div className="relative flex items-center">
                                <span className="text-base font-semibold text-gray-800 group-hover:text-purple-600 transition-colors whitespace-nowrap" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                    {shortcut.name}
                                </span>
                                <ArrowUpRight
                                    strokeWidth={2.5}
                                    className="w-3 h-3.5 ml-2 text-gray-900 group-hover:text-purple-600 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    );
};

export default HRMS;
