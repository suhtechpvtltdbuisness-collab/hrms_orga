import React, { useState } from 'react';
import { ChevronRight, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../../service';

const OrganizationsTab = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orgs, setOrgs] = useState([
    { id: 1, name: "TechFlow Inc.", domain: "techflow.com", plan: "Enterprise", users: 245, status: "Active" },
    { id: 2, name: "Global Media", domain: "globalmedia.org", plan: "Professional", users: 84, status: "Active" },
    { id: 3, name: "StartUp Hub", domain: "startuphub.io", plan: "Basic", users: 12, status: "Active" },
    { id: 4, name: "Nexus Corp", domain: "nexuscorp.net", plan: "Enterprise", users: 512, status: "Trial" },
    { id: 5, name: "Alpha Designs", domain: "alphadesigns.co", plan: "Basic", users: 45, status: "Inactive" }
  ]);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    companyName: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { ...formData, role: "admin", roleId: 1 };
      const res = await authService.register(payload);
      if (res.success) {
         toast.success("Organization added successfully!");
         setOrgs([{
           id: Date.now(), 
           name: formData.companyName || formData.firstName + "'s Org",
           domain: formData.email.split('@')[1] || "unknown.com",
           plan: "Basic",
           users: 1,
           status: "Active"
         }, ...orgs]);
         setIsAddModalOpen(false);
         setFormData({ firstName: "", lastName: "", email: "", password: "", companyName: "" });
      } else {
         toast.error(res.message || "Failed to add organization.");
      }
    } catch (err) {
      toast.error("Network error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
  <div className="fade-in relative">
    <div className="page-header">
       <div>
          <h2 className="page-title text-2xl">Organizations</h2>
          <div className="breadcrumb mt-1">
             <span className="bc-link">Admin</span>
             <ChevronRight size={14} />
             <span>Organizations</span>
          </div>
       </div>
       <button onClick={() => setIsAddModalOpen(true)} className="btn-primary shadow-lg shadow-purple-500/30">
          Add Organization
       </button>
    </div>
    <div className="card shadow-sm min-h-[600px]">
       <div className="flex items-center justify-between mb-6">
          <div className="search-bar w-72">
             <Search size={16} className="text-[#9CA3AF]" />
             <input type="text" placeholder="Search organizations..." />
          </div>
       </div>
       <div className="overflow-x-auto">
          <table className="data-table">
             <thead>
                <tr>
                   <th>Organization Name</th>
                   <th>Domain</th>
                   <th>Plan</th>
                   <th>Users</th>
                   <th>Status</th>
                   <th>Action</th>
                </tr>
             </thead>
             <tbody>
                {orgs.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                     <td className="font-semibold text-[#111827]">{item.name}</td>
                     <td className="text-gray-500">{item.domain}</td>
                     <td>
                        <span className={`badge ${item.plan === 'Enterprise' ? 'badge-purple' : item.plan === 'Professional' ? 'badge-info' : 'badge-gray'}`}>
                           {item.plan}
                        </span>
                     </td>
                     <td className="font-medium text-gray-700">{item.users}</td>
                     <td>
                        <span className={`badge ${item.status === 'Active' ? 'badge-success' : item.status === 'Trial' ? 'badge-warning' : 'badge-danger'}`}>
                           {item.status}
                        </span>
                     </td>
                     <td><button className="text-[#7C3AED] hover:underline font-medium text-sm">Manage</button></td>
                  </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>

    {/* Add Organization Modal */}
    {isAddModalOpen && (
       <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl relative fade-in">
             <button onClick={() => setIsAddModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition-colors">
                <X size={20} />
             </button>
             <h3 className="text-xl font-bold mb-1 text-gray-900">Add New Organization</h3>
             <p className="text-sm text-gray-500 mb-6">Register a new tenant admin account to access the HRMS platform.</p>
             <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="form-label font-semibold">Company/Organization Name</label>
                  <input required name="companyName" value={formData.companyName} onChange={handleChange} className="form-input bg-gray-50 focus:bg-white" placeholder="e.g. Acme Corp" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label font-semibold">Admin First Name</label>
                    <input required name="firstName" value={formData.firstName} onChange={handleChange} className="form-input bg-gray-50 focus:bg-white" placeholder="John" />
                  </div>
                  <div>
                    <label className="form-label font-semibold">Admin Last Name</label>
                    <input required name="lastName" value={formData.lastName} onChange={handleChange} className="form-input bg-gray-50 focus:bg-white" placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <label className="form-label font-semibold">Admin Email</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className="form-input bg-gray-50 focus:bg-white" placeholder="admin@company.com" />
                </div>
                <div>
                  <label className="form-label font-semibold">Temporary Password</label>
                  <input required type="password" name="password" value={formData.password} onChange={handleChange} className="form-input bg-gray-50 focus:bg-white" placeholder="••••••••" />
                </div>
                <div className="pt-4 flex gap-3">
                   <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 justify-center shadow-md">
                      {isSubmitting ? "Registering..." : "Register Organization"}
                   </button>
                   <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn-ghost flex-1 justify-center bg-gray-100 hover:bg-gray-200 border-transparent">
                      Cancel
                   </button>
                </div>
             </form>
          </div>
       </div>
    )}
  </div>
)};

export default OrganizationsTab;
