import React, { useState, useEffect } from 'react';
import { ChevronRight, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService, organizationService } from '../../../service';

const OrganizationsTab = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const limit = 10;
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    companyName: ""
  });

  useEffect(() => {
    fetchOrganizations();
  }, [page, searchTerm]);

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const res = await organizationService.getOrganizations(page, limit, searchTerm);
      if (res.success && res.data) {
        setOrgs(res.data.organizations || []);
        setTotalCount(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      } else {
        toast.error(res.message || "Failed to fetch organizations");
      }
    } catch (err) {
      toast.error("Error loading organizations");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

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
         toast.success("Organization admin registered successfully! Once they onboard, it will appear here.");
         setIsAddModalOpen(false);
         setFormData({ firstName: "", lastName: "", email: "", password: "", companyName: "" });
         setPage(1);
         fetchOrganizations();
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
    <div className="fade-in relative space-y-6">
      <div className="page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <div>
            <h2 className="page-title text-2xl font-bold text-gray-900">Organizations</h2>
            <div className="breadcrumb mt-1 flex items-center text-sm text-gray-500">
               <span className="hover:text-purple-600 cursor-pointer transition-colors">Admin</span>
               <ChevronRight size={14} className="mx-2 text-gray-400" />
               <span className="font-medium text-gray-900">Organizations</span>
            </div>
         </div>
         <button onClick={() => setIsAddModalOpen(true)} className="btn-primary shadow-lg shadow-purple-500/30">
            Add Organization
         </button>
      </div>
      
      <div className="card bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[600px] flex flex-col justify-between">
         <div>
           <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                 <input 
                   type="text" 
                   placeholder="Search organizations..." 
                   className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                   value={searchTerm}
                   onChange={handleSearchChange}
                 />
              </div>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                 <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                       <th className="px-6 py-4 font-semibold text-gray-500">Organization Name</th>
                       <th className="px-6 py-4 font-semibold text-gray-500">Domain</th>
                       <th className="px-6 py-4 font-semibold text-gray-500">Plan</th>
                       <th className="px-6 py-4 font-semibold text-gray-500">Users</th>
                       <th className="px-6 py-4 font-semibold text-gray-500">Status</th>
                       <th className="px-6 py-4 font-semibold text-gray-500 text-right">Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-10 text-center text-gray-500 font-medium">
                          Loading organizations...
                        </td>
                      </tr>
                    ) : orgs.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-10 text-center text-gray-500 font-medium">
                          No organizations found.
                        </td>
                      </tr>
                    ) : (
                      orgs.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                           <td className="px-6 py-4 font-semibold text-gray-900">{item.name}</td>
                           <td className="px-6 py-4 text-gray-500">{item.domain}</td>
                           <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${
                                item.plan === 'Enterprise' 
                                  ? 'bg-purple-50 text-purple-700 ring-purple-600/20' 
                                  : item.plan === 'Starter' || item.plan === 'Growth'
                                  ? 'bg-blue-50 text-blue-700 ring-blue-600/20' 
                                  : 'bg-gray-50 text-gray-600 ring-gray-500/10'
                              }`}>
                                 {item.plan}
                              </span>
                           </td>
                           <td className="px-6 py-4 font-medium text-gray-700">{item.users}</td>
                           <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                item.status === 'Active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : item.status === 'Trial' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                 {item.status}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-right">
                             <button className="text-[#7C3AED] hover:underline font-medium text-sm">Manage</button>
                           </td>
                        </tr>
                      ))
                    )}
                 </tbody>
              </table>
           </div>
         </div>

         {/* Pagination */}
         <div className="p-5 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <div>
              Showing {totalCount > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, totalCount)} of {totalCount} organizations
            </div>
            <div className="flex gap-1">
               <button 
                 onClick={() => setPage(p => Math.max(1, p - 1))}
                 disabled={page === 1}
                 className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
               >
                 Prev
               </button>
               {[...Array(totalPages)].map((_, i) => (
                 <button
                   key={i + 1}
                   onClick={() => setPage(i + 1)}
                   className={`px-3 py-1 rounded-md border ${
                     page === i + 1 
                       ? "bg-purple-50 text-purple-600 border-purple-100 font-medium" 
                       : "border-gray-200 hover:bg-gray-50"
                   }`}
                 >
                   {i + 1}
                 </button>
               ))}
               <button 
                 onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                 disabled={page === totalPages}
                 className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
               >
                 Next
               </button>
            </div>
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
  );
};

export default OrganizationsTab;
