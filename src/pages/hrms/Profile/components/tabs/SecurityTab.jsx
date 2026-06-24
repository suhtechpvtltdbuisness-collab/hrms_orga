import React, { useState } from 'react';
import { Shield, KeyRound, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const SecurityTab = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("New passwords don't match!");
            return;
        }
        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters long");
            return;
        }
        // Mock API call
        toast.success("Password updated successfully!");
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="max-w-3xl space-y-8">
            <div className="bg-white rounded-[1.5rem] p-7 shadow-sm border border-gray-50">
                <div className="flex items-center gap-3 mb-6">
                    <div className="text-[#7D1EDB] bg-[#F3ECFF] p-1.5 rounded-lg">
                        <KeyRound size={18} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg tracking-tight">Change Password</h3>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5">CURRENT PASSWORD</label>
                        <input 
                            type="password"
                            required
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7D1EDB] focus:ring-2 focus:ring-violet-100 outline-none transition-all"
                            placeholder="Enter current password"
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">NEW PASSWORD</label>
                            <input 
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7D1EDB] focus:ring-2 focus:ring-violet-100 outline-none transition-all"
                                placeholder="Enter new password"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">CONFIRM NEW PASSWORD</label>
                            <input 
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7D1EDB] focus:ring-2 focus:ring-violet-100 outline-none transition-all"
                                placeholder="Confirm new password"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button 
                            type="submit"
                            className="px-6 py-3 bg-[#7D1EDB] text-white font-bold rounded-xl hover:bg-[#6012a8] transition-colors shadow-sm"
                        >
                            Update Password
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-red-50 rounded-[1.5rem] p-7 border border-red-100">
                <div className="flex items-start gap-4">
                    <div className="bg-red-100 text-red-600 p-2 rounded-xl mt-1">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-red-800 text-lg mb-1">Two-Factor Authentication</h3>
                        <p className="text-red-600 text-sm mb-4">Protect your account by adding an extra layer of security. We highly recommend enabling 2FA.</p>
                        <button className="px-5 py-2.5 bg-white text-red-600 border border-red-200 font-bold rounded-xl hover:bg-red-50 transition-colors shadow-sm text-sm">
                            Enable 2FA
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecurityTab;
