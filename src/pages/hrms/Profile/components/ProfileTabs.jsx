import React from 'react';

const ProfileTabs = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'security', label: 'Security' },
        { id: 'permissions', label: 'Permissions' },
        { id: 'audit', label: 'Audit Log' }
    ];

    return (
        <div className="flex border-b border-gray-200 mb-8 space-x-10 px-4 overflow-x-auto">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`pb-4 text-sm font-bold whitespace-nowrap px-1 transition-colors ${
                        activeTab === tab.id
                            ? 'text-[#7D1EDB] border-b-2 border-[#7D1EDB]'
                            : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default ProfileTabs;
