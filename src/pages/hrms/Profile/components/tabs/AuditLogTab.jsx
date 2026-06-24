import React from 'react';
import { ClipboardList } from 'lucide-react';

const AuditLogTab = () => {
    return (
        <div className="bg-white rounded-[1.5rem] p-12 shadow-sm border border-gray-50 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                <ClipboardList size={40} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Audit Logs</h2>
            <p className="text-gray-500 max-w-md">
                System and security audit logs are being recorded. The UI to view and export these logs will be available soon.
            </p>
        </div>
    );
};

export default AuditLogTab;
