import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ActivityHeatmap from './ActivityHeatmap';


const HRMS = () => {
    const navigate = useNavigate();

    // Defined shortcuts matching the image
    const shortcuts = [
        { name: 'New Hiring' },
        { name: 'New Onboarding' },
        { name: 'Organization Tree' },
        { name: 'Designation' },
        { name: 'Settings' },
        { name: 'Department', badge: true },
        { name: 'Employee List', badge: true },
        { name: 'Schedule Interview' },
        { name: 'Attendance' },
        { name: 'New Job Opening' },
    ];
    const handleShortcut = (name) => {
        if (name === 'Employee List') {
            navigate('/hrms/employees');
        }
        else if (name === 'Department') {
            navigate('/hrms/departments');  // Navigate to Department List
        }
        else if (name === 'Settings') {
            navigate('/hrms/settings');  // Navigate to Settings
        }
    };

    return (
        <div className="bg-white px-4 sm:px-6 md:px-8 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)] xl:h-[calc(100vh-11rem)] overflow-y-auto border border-[#D9D9D9]">
            {/* Header */}
            <div className="mb-4">
                <h1 className="text-xl font-semibold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>HRMS Dashboard</h1>
            </div>

            {/* Activity Heatmap Section */}
            <ActivityHeatmap />

            {/* Shortcuts */}
            <div>
                <h2 className="text-xl font-medium text-gray-900 mb-6" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Your Shortcuts</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-y-8 gap-x-6 ml-2">
                    {shortcuts.map((shortcut) => (
                        <div
                            key={shortcut.name}
                            className="flex items-center group cursor-pointer"
                            onClick={() => {
                                if (shortcut.name === 'Employee List') {
                                    navigate('/hrms/employees');
                                }
                                else if (shortcut.name === 'Department') {
                                    navigate('/hrms/departments');
                                }
                                else if (shortcut.name === 'Designation') {
                                    navigate('/hrms/designations');
                                }
                                else if (shortcut.name === 'Settings') {
                                    navigate('/hrms/settings');  // Navigate to Settings
                                }
                            }}
                        >
                            <div className="relative flex items-center">
                                <span className="text-base font-semibold text-gray-800 group-hover:text-purple-600 transition-colors whitespace-nowrap" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                    {shortcut.name}
                                </span>
                                <ArrowUpRight
                                    strokeWidth={2.5}
                                    className="w-4 h-4 ml-2 text-gray-900 group-hover:text-purple-600 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
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