import React from 'react';
import PersonalDetails from '../widgets/PersonalDetails';
import AdminPermissions from '../widgets/AdminPermissions';
import WorkInformation from '../widgets/WorkInformation';
import RecentActivity from '../widgets/RecentActivity';

const OverviewTab = ({ userData, userRole }) => {
    const userName = userData.name || userData.firstName || 'Testing User';
    const email = userData.email || 'testing@orga.com';
    const phone = userData.phone || userData.mobile || '+91 98765 43210';
    const employeeId = userData.employeeId || userData.id || 'EMP-00421';
    const department = userData.department?.departmentName || userData.department || 'Administration';
    const joinDate = userData.joiningDate ? new Date(userData.joiningDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '10 Aug 2022';
    const location = 'Head Office, Delhi';
    const dob = '15 March 1995'; // Placeholder

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-4 space-y-8">
                <PersonalDetails 
                    userName={userName}
                    email={email}
                    phone={phone}
                    location={location}
                    dob={dob}
                />
                <AdminPermissions />
            </div>

            {/* Right Column */}
            <div className="lg:col-span-8 space-y-8">
                <WorkInformation 
                    employeeId={employeeId}
                    department={department}
                    joinDate={joinDate}
                    userRole={userRole}
                />
                <RecentActivity />
            </div>
        </div>
    );
};

export default OverviewTab;
