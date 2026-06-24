import React, { useState, useEffect } from 'react';
import { getProfilePicUrl } from '../../../service';
import ProfileHeader from './components/ProfileHeader';
import ProfileTabs from './components/ProfileTabs';
import OverviewTab from './components/tabs/OverviewTab';
import SecurityTab from './components/tabs/SecurityTab';
import PermissionsTab from './components/tabs/PermissionsTab';
import AuditLogTab from './components/tabs/AuditLogTab';
import EditProfileModal from './components/modals/EditProfileModal';

const Profile = () => {
    const [userData, setUserData] = useState({});
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('userData') || '{}');
        setUserData(data);
    }, []);

    const userImage = getProfilePicUrl(userData.profilePic || userData.profileImage);
    const userName = userData.name || userData.firstName || 'Testing User';
    const initials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const userRole = userData.isAdmin ? 'Super Admin' : (userData.type ? userData.type.charAt(0).toUpperCase() + userData.type.slice(1) : 'Employee');
    const joinDate = userData.joiningDate ? new Date(userData.joiningDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '10 Aug 2022';
    const location = 'Head Office, Delhi';

    const handleEditSave = (updatedData) => {
        const newData = { ...userData, name: updatedData.name, phone: updatedData.phone };
        setUserData(newData);
        // Ideally we would sync to localStorage or make API call here too:
        // localStorage.setItem('userData', JSON.stringify(newData));
    };

    return (
        <div className="min-h-[calc(100vh-6.5rem)] bg-[#F8F9FA] px-4 py-6 md:px-8 font-poppins pb-10">
            
            <ProfileHeader 
                userData={userData}
                userRole={userRole}
                initials={initials}
                userImage={userImage}
                joinDate={joinDate}
                location={location}
                onEditProfile={() => setIsEditModalOpen(true)}
                onChangePassword={() => setActiveTab('security')}
            />

            <ProfileTabs 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
            />

            <div className="mt-6">
                {activeTab === 'overview' && <OverviewTab userData={userData} userRole={userRole} />}
                {activeTab === 'security' && <SecurityTab />}
                {activeTab === 'permissions' && <PermissionsTab />}
                {activeTab === 'audit' && <AuditLogTab />}
            </div>

            <EditProfileModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                userData={userData}
                onSave={handleEditSave}
            />

        </div>
    );
};

export default Profile;
