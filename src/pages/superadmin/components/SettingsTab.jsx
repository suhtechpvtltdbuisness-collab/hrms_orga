import React from 'react';
import { ChevronRight } from 'lucide-react';

const SettingsTab = () => (
  <div className="fade-in">
    <div className="page-header">
       <div>
          <h2 className="page-title text-2xl">Platform Settings</h2>
          <div className="breadcrumb mt-1">
             <span className="bc-link">Admin</span>
             <ChevronRight size={14} />
             <span>Settings</span>
          </div>
       </div>
    </div>
    <div className="card shadow-sm max-w-2xl">
       <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4">Global Configuration</h3>
       <div className="space-y-5">
          <div>
             <label className="form-label font-semibold">Platform Name</label>
             <input type="text" className="form-input bg-gray-50 focus:bg-white" defaultValue="Orga HRMS Platform" />
          </div>
          <div>
             <label className="form-label font-semibold">Support Email</label>
             <input type="email" className="form-input bg-gray-50 focus:bg-white" defaultValue="support@orga.com" />
          </div>
          <div className="pt-4 flex gap-3">
             <button className="btn-primary shadow-md">Save Changes</button>
             <button className="btn-ghost">Cancel</button>
          </div>
       </div>
    </div>
  </div>
);

export default SettingsTab;
