import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NewOnboarding = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-white p-8 rounded-xl m-4 shadow-sm border border-gray-100 min-h-[calc(100vh-10rem)]">
            <div className="flex items-center gap-3 mb-6 cursor-pointer text-[#7D1EDB]" onClick={() => navigate('/hrms')}>
                <ArrowLeft size={18} />
                <span className="font-medium">Back to Dashboard</span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">New Onboarding</h1>
            <div className="p-12 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400">
                <p>This page is under development.</p>
                <p className="text-sm">Functionality for starting new onboarding processes will be added here.</p>
            </div>
        </div>
    );
};

export default NewOnboarding;
