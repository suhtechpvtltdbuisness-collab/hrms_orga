import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Bell, Shield, Camera, Eye, EyeOff, CheckCircle2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService, employeeService, getProfilePicUrl } from '../../../service';

const SectionCard = ({ title, icon, iconColor, children }) => {
  const IconComponent = icon;
  return (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconColor}`}><IconComponent className="w-4 h-4" /></div>
      <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
  );
};

const Toggle = ({ checked, onChange, label, desc }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
    <div>
      <p className="text-sm font-medium text-gray-800">{label}</p>
      {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
    </div>
    <button onClick={onChange} className={`relative w-11 h-6 rounded-full transition-colors ${checked?'bg-violet-600':'bg-gray-200'}`}>
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked?'translate-x-5':''}`} />
    </button>
  </div>
);

export default function EmployeeSettings() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const userData = (() => { try { return JSON.parse(localStorage.getItem('userData')||'{}'); } catch { return {}; } })();
  const preferencesKey = `employee:settings:${userData.id || userData.email || 'default'}`;

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please choose an image file'); e.target.value=''; return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be 5 MB or smaller'); e.target.value=''; return; }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
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
          toast.error('Failed to update profile picture in your account');
        }
      } else {
        toast.error(res.message || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleCancelPhoto = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleRemovePhoto = async () => {
    if (!userData.profilePic) return;
    if (!window.confirm("Are you sure you want to remove your profile picture?")) return;
    setUploading(true);
    try {
      const payload = { profilePic: null };
      const updateRes = await employeeService.updateEmployee(userData.id, payload);
      if (updateRes.success) {
        const updatedUser = { ...userData, profilePic: null };
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        window.location.reload();
      } else {
        toast.error('Failed to remove profile picture');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error removing profile picture');
    } finally {
      setUploading(false);
    }
  };

  const [pwForm, setPwForm] = useState({ current:'', new:'', confirm:'' });
  const [showPw, setShowPw] = useState({ current:false, new:false, confirm:false });
  const [notifs, setNotifs] = useState(() => { try { return {...{ email:true, push:true, leave:true, payroll:true, tasks:true, announcements:true, birthday:false },...JSON.parse(localStorage.getItem(preferencesKey)||'{}')}; } catch { return { email:true, push:true, leave:true, payroll:true, tasks:true, announcements:true, birthday:false }; } });
  const [saved, setSaved] = useState(false);
  const [securityLoading, setSecurityLoading] = useState(false);

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    if (pwForm.current === pwForm.new) { toast.error('New password must differ from current password'); return; }
    if (pwForm.new !== pwForm.confirm) { toast.error('Passwords do not match!'); return; }
    if (pwForm.new.length < 8) { toast.error('Password must be at least 8 characters!'); return; }
    setSaved(true);
    const result = await authService.changePassword({ currentPassword: pwForm.current, newPassword: pwForm.new });
    if (result.success) { toast.success(result.message); setPwForm({current:'',new:'',confirm:''}); }
    else toast.error(result.message);
    setSaved(false);
  };

  const toggle = async (k) => {
    if (k === 'push' && !notifs.push && 'Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') { toast.error('Browser notification permission was not granted'); return; }
    }
    setNotifs(prev => ({ ...prev, [k]: !prev[k] }));
  };
  const savePreferences = () => { localStorage.setItem(preferencesKey, JSON.stringify(notifs)); toast.success('Notification preferences saved'); };
  const signOutAll = async () => {
    if (!window.confirm('Sign out every active session, including this device?')) return;
    setSecurityLoading(true);
    const result = await authService.logoutAllDevices();
    setSecurityLoading(false);
    if (!result.success) { toast.error(result.message); return; }
    toast.success(result.message); navigate('/auth', { replace:true });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your account preferences and security</p>
      </div>

      {/* Profile Picture */}
      <SectionCard title="Profile Picture" icon={Camera} iconColor="bg-violet-100 text-violet-600">
        <div className="flex items-center gap-5">
          <div className="relative">
            {previewUrl || userData?.profilePic ? (
              <img
                src={previewUrl || getProfilePicUrl(userData.profilePic)}
                alt="Profile"
                className="w-20 h-20 rounded-2xl object-cover border border-gray-150 shadow-sm animate-fadeIn"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                {(userData?.name||'E').charAt(0).toUpperCase()}
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
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center text-white hover:bg-violet-700 transition-all cursor-pointer disabled:opacity-50"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{userData?.name || 'Employee'}</p>
            <p className="text-xs text-gray-400 mb-3">{userData?.email || 'employee@company.com'}</p>
            <div className="flex gap-2">
              {previewUrl ? (
                <>
                  <button 
                    onClick={handleSavePhoto}
                    disabled={uploading}
                    className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-all cursor-pointer disabled:opacity-50"
                  >
                    Save Photo
                  </button>
                  <button 
                    onClick={handleCancelPhoto}
                    disabled={uploading}
                    className="px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="px-3 py-1.5 bg-violet-600 text-white text-xs font-semibold rounded-lg hover:bg-violet-700 transition-all cursor-pointer disabled:opacity-50"
                  >
                    Upload Photo
                  </button>
                  {userData?.profilePic && (
                    <button 
                      onClick={handleRemovePhoto}
                      disabled={uploading}
                      className="px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50"
                    >
                      Remove
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Change Password */}
      <SectionCard title="Change Password" icon={Lock} iconColor="bg-red-100 text-red-600">
        <form onSubmit={handlePwSubmit} className="space-y-4">
          {[
            { key:'current', label:'Current Password' },
            { key:'new', label:'New Password' },
            { key:'confirm', label:'Confirm New Password' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">{f.label}</label>
              <div className="relative">
                <input
                  type={showPw[f.key]?'text':'password'}
                  required
                  value={pwForm[f.key]}
                  onChange={e=>setPwForm({...pwForm,[f.key]:e.target.value})}
                  placeholder="••••••••"
                  className="w-full h-10 px-3 pr-10 border border-gray-200 rounded-xl text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
                <button type="button" onClick={()=>setShowPw({...showPw,[f.key]:!showPw[f.key]})} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw[f.key]?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}
                </button>
              </div>
              {f.key==='new' && pwForm.new.length>0 && (
                <div className="flex gap-1 mt-2">
                  {[8,12,16].map(n => <div key={n} className={`h-1 flex-1 rounded-full ${pwForm.new.length>=n?'bg-violet-500':'bg-gray-200'}`}/>)}
                  <span className="text-[10px] text-gray-400 ml-1">{pwForm.new.length<8?'Weak':pwForm.new.length<12?'Fair':'Strong'}</span>
                </div>
              )}
            </div>
          ))}
          <button type="submit" disabled={saved} className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-all disabled:opacity-60">
            {saved?<><CheckCircle2 className="w-4 h-4"/>Updated!</>:'Update Password'}
          </button>
        </form>
      </SectionCard>

      {/* Notifications */}
      <SectionCard title="Notification Preferences" icon={Bell} iconColor="bg-blue-100 text-blue-600">
        <Toggle checked={notifs.email} onChange={()=>toggle('email')} label="Email Notifications" desc="Receive notifications via email" />
        <Toggle checked={notifs.push} onChange={()=>toggle('push')} label="Push Notifications" desc="Browser push notifications" />
        <Toggle checked={notifs.leave} onChange={()=>toggle('leave')} label="Leave Updates" desc="Leave approval/rejection alerts" />
        <Toggle checked={notifs.payroll} onChange={()=>toggle('payroll')} label="Payroll Alerts" desc="When payslip is generated" />
        <Toggle checked={notifs.tasks} onChange={()=>toggle('tasks')} label="Task Reminders" desc="Due date and task update alerts" />
        <Toggle checked={notifs.announcements} onChange={()=>toggle('announcements')} label="Announcements" desc="Company news and policy updates" />
        <Toggle checked={notifs.birthday} onChange={()=>toggle('birthday')} label="Birthday & Anniversaries" desc="Team member celebrations" />
        <button onClick={savePreferences} className="mt-4 px-5 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-all">Save Preferences</button>
      </SectionCard>

      {/* Security */}
      <SectionCard title="Security" icon={Shield} iconColor="bg-green-100 text-green-600">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {[
            { label:'Last Login', val:userData.lastLoginAt ? new Date(userData.lastLoginAt).toLocaleString() : 'Current session', icon:'🕐' },
            { label:'Device', val:navigator.userAgentData?.platform || navigator.platform || 'Unknown device', icon:'💻' },
            { label:'Session', val:localStorage.getItem('authToken') ? 'Authenticated' : 'Not authenticated', icon:'🔐' },
          ].map(i => (
            <div key={i.label} className="bg-gray-50 rounded-xl p-3">
              <p className="text-lg mb-1">{i.icon}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{i.label}</p>
              <p className="text-xs font-semibold text-gray-700 mt-0.5">{i.val}</p>
            </div>
          ))}
        </div>
        <button onClick={signOutAll} disabled={securityLoading} className="text-xs text-red-500 font-semibold border border-red-200 px-3.5 py-2 rounded-lg hover:bg-red-50 transition-all disabled:opacity-50">
          {securityLoading ? 'Signing out…' : 'Sign Out All Devices'}
        </button>
      </SectionCard>
    </div>
  );
}
