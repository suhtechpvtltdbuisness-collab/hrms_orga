import React, { useState, useRef } from 'react';
import {
  User, Phone, Mail, MapPin, Shield, Briefcase, Edit3, Camera,
  ChevronRight, Building2, Users, CalendarDays, Award, FileText,
  AlertCircle, CheckCircle2, Save, X, Loader2
} from 'lucide-react';
import { employeeService, getProfilePicUrl } from '../../../service';

const InfoRow = ({ label, value, editable, name, onChange, inputType = 'text' }) => {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value || '');

  return (
    <div className="flex items-start py-3 border-b border-gray-100 last:border-0 gap-4">
      <div className="w-36 shrink-0">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
      </div>
      <div className="flex-1 min-w-0">
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              type={inputType}
              value={val}
              inputMode={inputType === 'tel' ? 'numeric' : undefined}
              maxLength={inputType === 'tel' ? 10 : undefined}
              pattern={inputType === 'tel' ? '[0-9]{10}' : undefined}
              onChange={e => setVal(inputType === 'tel' ? e.target.value.replace(/\D/g, '').slice(0, 10) : e.target.value)}
              className="flex-1 text-sm text-gray-800 border border-violet-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-violet-100"
              autoFocus
            />
            <button onClick={() => {
              if (inputType === 'tel' && !/^\d{10}$/.test(val)) return;
              onChange?.(name, val);
              setEditing(false);
            }} className="w-7 h-7 bg-violet-600 text-white rounded-lg flex items-center justify-center hover:bg-violet-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => { setVal(value || ''); setEditing(false); }} className="w-7 h-7 bg-gray-100 text-gray-500 rounded-lg flex items-center justify-center hover:bg-gray-200">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 group">
            <p className="text-sm text-gray-800 font-medium">{val || <span className="text-gray-400 italic">Not provided</span>}</p>
            {editable && (
              <button onClick={() => setEditing(true)} className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center hover:bg-violet-50 hover:text-violet-600">
                <Edit3 className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const SectionCard = ({ title, icon: Icon, iconColor, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconColor}`}>
        <Icon className="w-4 h-4" />
      </div>
      <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
    </div>
    <div className="px-6 py-2">{children}</div>
  </div>
);

export default function EmployeeProfile() {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const userData = (() => {
    try { return JSON.parse(localStorage.getItem('userData') || '{}'); } catch { return {}; }
  })();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSavePhoto = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const res = await employeeService.uploadImage(selectedFile);
      if (res.success && res.url) {
        const payload = { profilePic: res.url };
        const updateRes = await employeeService.updateEmployee(userData.id, payload);
        if (updateRes.success) {
          const updatedUser = { ...userData, profilePic: res.url };
          localStorage.setItem('userData', JSON.stringify(updatedUser));
          setSelectedFile(null);
          setPreviewUrl(null);
          window.location.reload();
        } else {
          alert('Failed to update profile picture in your account');
        }
      } else {
        alert(res.message || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleCancelPhoto = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const displayName = userData?.name || userData?.fullName || userData?.email?.split('@')[0] || 'Employee';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const [localData, setLocalData] = useState({
    name: displayName,
    email: userData?.email || 'employee@company.com',
    phone: userData?.phone || '+91 98765 43210',
    dob: userData?.dob || '1995-06-15',
    gender: userData?.gender || 'Male',
    address: userData?.address || '123 Main St, Mumbai, Maharashtra',
    emergencyName: 'Rajesh Kumar',
    emergencyRelation: 'Father',
    emergencyPhone: '+91 99887 76655',
    department: userData?.department || 'Engineering',
    designation: userData?.designation || 'Software Engineer',
    empId: userData?.empId || 'EMP-001',
    joiningDate: userData?.joiningDate || '2023-01-15',
    reportingManager: userData?.reportingManager || 'Amit Sharma',
    employmentType: 'Full Time',
    workLocation: 'Bangalore, India',
  });

  const handleChange = (name, value) => setLocalData(prev => ({ ...prev, [name]: value }));

  const completionFields = ['name', 'phone', 'address', 'emergencyName', 'emergencyPhone'];
  const filled = completionFields.filter(f => localData[f]).length;
  const pct = Math.round((filled / completionFields.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Profile Header */}
      <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #756FCC 0%, #9B7FDC 50%, #B58CEC 100%)' }}>
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
          <div className="relative">
            {previewUrl || userData?.profilePic ? (
              <img
                src={previewUrl || getProfilePicUrl(userData.profilePic)}
                alt="Profile"
                className="w-24 h-24 rounded-2xl object-cover border-2 border-white/40 shadow-md bg-white/10"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur border-2 border-white/40 flex items-center justify-center text-3xl font-bold">
                {initials}
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*"
              disabled={uploading}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-lg shadow-lg flex items-center justify-center text-violet-600 hover:bg-violet-50 transition-all cursor-pointer disabled:opacity-50"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-bold">{localData.name}</h1>
            <p className="text-violet-200 text-sm mt-1">{localData.designation} · {localData.department}</p>
            {previewUrl && (
              <div className="flex gap-2 mt-2 justify-center sm:justify-start">
                <button 
                  onClick={handleSavePhoto} 
                  disabled={uploading} 
                  className="px-3 py-1 bg-white text-violet-600 text-xs font-semibold rounded-lg hover:bg-violet-50 transition-all cursor-pointer disabled:opacity-50"
                >
                  Save Photo
                </button>
                <button 
                  onClick={handleCancelPhoto} 
                  disabled={uploading} 
                  className="px-3 py-1 bg-white/20 text-white border border-white/20 text-xs font-semibold rounded-lg hover:bg-white/10 transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            )}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-medium">{localData.empId}</span>
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-medium">{localData.employmentType}</span>
              <span className="flex items-center gap-1 text-xs bg-white/20 px-3 py-1 rounded-full font-medium">
                <MapPin className="w-3 h-3" />{localData.workLocation}
              </span>
            </div>
          </div>
          {/* Profile completion */}
          <div className="text-center bg-white/10 rounded-xl px-5 py-3 backdrop-blur">
            <p className="text-3xl font-bold">{pct}%</p>
            <p className="text-xs text-violet-200">Profile Complete</p>
            <div className="w-16 h-1 bg-white/20 rounded-full mt-2 mx-auto overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {pct < 100 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-700">Complete your profile to unlock all features. Fill in missing information below.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Personal Information */}
        <SectionCard title="Personal Information" icon={User} iconColor="bg-violet-100 text-violet-600">
          <InfoRow label="Full Name" value={localData.name} editable name="name" onChange={handleChange} />
          <InfoRow label="Date of Birth" value={localData.dob} editable name="dob" onChange={handleChange} inputType="date" />
          <InfoRow label="Gender" value={localData.gender} />
          <InfoRow label="Address" value={localData.address} editable name="address" onChange={handleChange} />
        </SectionCard>

        {/* Contact Details */}
        <SectionCard title="Contact Details" icon={Phone} iconColor="bg-blue-100 text-blue-600">
          <InfoRow label="Email" value={localData.email} />
          <InfoRow label="Phone" value={localData.phone} editable name="phone" inputType="tel" onChange={handleChange} />
        </SectionCard>

        {/* Emergency Contact */}
        <SectionCard title="Emergency Contact" icon={Shield} iconColor="bg-red-100 text-red-600">
          <InfoRow label="Name" value={localData.emergencyName} editable name="emergencyName" onChange={handleChange} />
          <InfoRow label="Relation" value={localData.emergencyRelation} editable name="emergencyRelation" onChange={handleChange} />
          <InfoRow label="Phone" value={localData.emergencyPhone} editable name="emergencyPhone" inputType="tel" onChange={handleChange} />
        </SectionCard>

        {/* Employment Information */}
        <SectionCard title="Employment Information" icon={Briefcase} iconColor="bg-green-100 text-green-600">
          <InfoRow label="Employee ID" value={localData.empId} />
          <InfoRow label="Department" value={localData.department} />
          <InfoRow label="Designation" value={localData.designation} />
          <InfoRow label="Joining Date" value={new Date(localData.joiningDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} />
          <InfoRow label="Manager" value={localData.reportingManager} />
          <InfoRow label="Type" value={localData.employmentType} />
        </SectionCard>
      </div>

      {/* Documents */}
      <SectionCard title="Uploaded Documents" icon={FileText} iconColor="bg-indigo-100 text-indigo-600">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-2">
          {[
            { name: 'Offer Letter', date: 'Jan 2023', status: 'Verified' },
            { name: 'ID Proof (Aadhar)', date: 'Jan 2023', status: 'Verified' },
            { name: 'PAN Card', date: 'Jan 2023', status: 'Pending' },
          ].map((doc, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-violet-50/50 hover:border-violet-100 transition-all cursor-pointer">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800 truncate">{doc.name}</p>
                <p className="text-[10px] text-gray-500">{doc.date}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${doc.status === 'Verified' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                {doc.status}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
