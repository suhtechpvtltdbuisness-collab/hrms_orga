import React, { useState } from 'react';
import { Upload, Download, Eye, File, AlertCircle, Plus, X, CheckCircle2 } from 'lucide-react';

const companyDocs = [
  { name: 'Employee Handbook', size: '2.4 MB', type: 'PDF', category: 'Policy', date: 'Jan 2025', expires: null },
  { name: 'Code of Conduct', size: '1.1 MB', type: 'PDF', category: 'Policy', date: 'Jan 2025', expires: null },
  { name: 'Leave Policy 2025', size: '0.8 MB', type: 'PDF', category: 'Policy', date: 'Jan 2025', expires: null },
  { name: 'IT Asset Usage Policy', size: '1.3 MB', type: 'PDF', category: 'IT', date: 'Mar 2025', expires: null },
];

const myDocs = [
  { name: 'Offer Letter', size: '0.5 MB', type: 'PDF', status: 'verified', expires: null, uploaded: 'Jan 2023' },
  { name: 'Aadhaar Card', size: '0.3 MB', type: 'Image', status: 'verified', expires: null, uploaded: 'Jan 2023' },
  { name: 'PAN Card', size: '0.2 MB', type: 'Image', status: 'pending', expires: null, uploaded: 'Jan 2023' },
  { name: 'Educational Certificate', size: '1.2 MB', type: 'PDF', status: 'verified', expires: '2026-05-30', uploaded: 'Feb 2023' },
];

const catColor = { Policy: 'bg-violet-100 text-violet-700', IT: 'bg-blue-100 text-blue-700', HR: 'bg-green-100 text-green-700' };
const docIcon = { PDF: '📄', Image: '🖼️', DOC: '📝' };

export default function EmployeeDocuments() {
  const [showUpload, setShowUpload] = useState(false);
  const [dragging, setDragging] = useState(false);

  const today = new Date();
  const isExpiringSoon = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const diff = (d - today) / (1000 * 60 * 60 * 24);
    return diff <= 30 && diff >= 0;
  };
  const isExpired = (dateStr) => {
    if (!dateStr) return false;
    return new Date(dateStr) < today;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Documents</h1>
          <p className="text-sm text-gray-500 mt-0.5">View company documents and manage your personal documents</p>
        </div>
        <button onClick={() => setShowUpload(true)} className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-all active:scale-95">
          <Upload className="w-4 h-4" /> Upload Document
        </button>
      </div>

      {/* Expiry Alerts */}
      {myDocs.some(d => isExpiringSoon(d.expires)) && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-700 font-medium">Some documents are expiring soon. Please renew them before the expiry date.</p>
        </div>
      )}

      {/* Company Documents */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Company Documents</h2>
          <p className="text-xs text-gray-400 mt-0.5">Official HR and policy documents</p>
        </div>
        <div className="divide-y divide-gray-50">
          {companyDocs.map((doc, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl shrink-0">{docIcon[doc.type] || '📄'}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">{doc.name}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{doc.type} · {doc.size} · Updated {doc.date}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${catColor[doc.category] || 'bg-gray-100 text-gray-500'}`}>{doc.category}</span>
              <div className="flex items-center gap-2 shrink-0">
                <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200 transition-all"><Eye className="w-3.5 h-3.5" /></button>
                <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all"><Download className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Documents */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">My Documents</h2>
          <p className="text-xs text-gray-400 mt-0.5">Personal documents uploaded by you</p>
        </div>
        <div className="divide-y divide-gray-50">
          {myDocs.map((doc, i) => (
            <div key={i} className={`flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors ${isExpiringSoon(doc.expires) ? 'bg-amber-50/50' : ''}`}>
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-xl shrink-0">{docIcon[doc.type] || '📄'}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-800">{doc.name}</p>
                  {doc.expires && <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">Expires {doc.expires}</span>}
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5">{doc.type} · {doc.size} · Uploaded {doc.uploaded}</p>
              </div>
              <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${doc.status === 'verified' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                {doc.status === 'verified' ? <><CheckCircle2 className="w-2.5 h-2.5" />Verified</> : 'Pending'}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200 transition-all"><Eye className="w-3.5 h-3.5" /></button>
                <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all"><Download className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowUpload(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-900">Upload Document</h2>
              <button onClick={() => setShowUpload(false)} className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200"><X className="w-4 h-4 text-gray-500" /></button>
            </div>
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); }}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${dragging ? 'border-violet-400 bg-violet-50' : 'border-gray-200 hover:border-violet-300 hover:bg-gray-50'}`}
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-700">Drop files here or click to browse</p>
              <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 10MB</p>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Document Type</label>
                <select className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100">
                  <option>ID Proof</option><option>Education Certificate</option><option>Experience Letter</option><option>Other</option>
                </select>
              </div>
              <button onClick={() => setShowUpload(false)} className="w-full py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-all">Upload Document</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
