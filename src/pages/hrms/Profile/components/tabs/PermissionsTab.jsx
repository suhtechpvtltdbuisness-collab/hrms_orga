import React from 'react';
import { ShieldAlert } from 'lucide-react';

const PermissionsTab = () => {
    return (
        <div className="bg-white rounded-[1.5rem] p-12 shadow-sm border border-gray-50 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                <ShieldAlert size={40} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Detailed Permissions</h2>
            <p className="text-gray-500 max-w-md">
                You are currently viewing this page as a Super Admin. Detailed permission management will be available here in a future update.
            </p>
        </div>
    );
};

export default PermissionsTab;
