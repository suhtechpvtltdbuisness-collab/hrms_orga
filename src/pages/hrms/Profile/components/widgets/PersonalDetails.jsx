import React from 'react';
import { FileText, Mail, Phone, MapPin, Calendar } from 'lucide-react';

const PersonalDetails = ({ userName, email, phone, location, dob }) => {
    return (
        <div className="bg-white rounded-[1.5rem] p-7 shadow-sm border border-gray-50">
            <div className="flex items-center gap-3 mb-8">
                <div className="text-[#7D1EDB] bg-[#F3ECFF] p-1.5 rounded-lg">
                    <FileText size={18} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg tracking-tight">Personal Details</h3>
            </div>

            <div className="space-y-6">
                <div>
                    <p className="text-[11px] font-bold text-gray-400 tracking-wider mb-2">FULL NAME</p>
                    <div className="flex items-center gap-3.5">
                        <div className="bg-[#F3ECFF] text-[#7D1EDB] p-2 rounded-[10px]">
                            <FileText size={16} />
                        </div>
                        <p className="font-bold text-gray-900 text-[15px]">{userName}</p>
                    </div>
                </div>
                <div>
                    <p className="text-[11px] font-bold text-gray-400 tracking-wider mb-2">EMAIL</p>
                    <div className="flex items-center gap-3.5">
                        <div className="bg-[#F3ECFF] text-[#7D1EDB] p-2 rounded-[10px]">
                            <Mail size={16} />
                        </div>
                        <p className="font-bold text-gray-900 text-[15px] break-all">{email}</p>
                    </div>
                </div>
                <div>
                    <p className="text-[11px] font-bold text-gray-400 tracking-wider mb-2">PHONE</p>
                    <div className="flex items-center gap-3.5">
                        <div className="bg-[#F3ECFF] text-[#7D1EDB] p-2 rounded-[10px]">
                            <Phone size={16} />
                        </div>
                        <p className="font-bold text-gray-900 text-[15px]">{phone}</p>
                    </div>
                </div>
                <div>
                    <p className="text-[11px] font-bold text-gray-400 tracking-wider mb-2">LOCATION</p>
                    <div className="flex items-center gap-3.5">
                        <div className="bg-[#F3ECFF] text-[#7D1EDB] p-2 rounded-[10px]">
                            <MapPin size={16} />
                        </div>
                        <p className="font-bold text-gray-900 text-[15px]">{location}</p>
                    </div>
                </div>
                <div>
                    <p className="text-[11px] font-bold text-gray-400 tracking-wider mb-2">DATE OF BIRTH</p>
                    <div className="flex items-center gap-3.5">
                        <div className="bg-[#F3ECFF] text-[#7D1EDB] p-2 rounded-[10px]">
                            <Calendar size={16} />
                        </div>
                        <p className="font-bold text-gray-900 text-[15px]">{dob}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalDetails;
