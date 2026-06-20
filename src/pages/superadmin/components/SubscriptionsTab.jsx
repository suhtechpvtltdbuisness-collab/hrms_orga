import React from 'react';
import { CreditCard, ChevronRight } from 'lucide-react';

const SubscriptionsTab = () => (
  <div className="fade-in">
    <div className="page-header">
       <div>
          <h2 className="page-title text-2xl">Subscriptions</h2>
          <div className="breadcrumb mt-1">
             <span className="bc-link">Admin</span>
             <ChevronRight size={14} />
             <span>Subscriptions</span>
          </div>
       </div>
    </div>
    <div className="card shadow-sm h-[600px] flex items-center justify-center">
       <div className="text-center">
          <CreditCard size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-700">Subscriptions Management</h3>
          <p className="text-sm text-gray-500 mt-2 max-w-sm">View all billing cycles, active plans, and invoice history across all registered organizations here.</p>
       </div>
    </div>
  </div>
);

export default SubscriptionsTab;
