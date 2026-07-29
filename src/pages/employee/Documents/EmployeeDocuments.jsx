import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Upload, Download, Eye, AlertCircle, X, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { employeeService, getSecureFileUrl } from '../../../service';

const companyDocs = [
  { name: 'Employee Handbook', size: '2.4 MB', type: 'PDF', category: 'Policy', date: 'Jan 2025', expires: null },
  { name: 'Code of Conduct', size: '1.1 MB', type: 'PDF', category: 'Policy', date: 'Jan 2025', expires: null },
  { name: 'Leave Policy 2025', size: '0.8 MB', type: 'PDF', category: 'Policy', date: 'Jan 2025', expires: null },
  { name: 'IT Asset Usage Policy', size: '1.3 MB', type: 'PDF', category: 'IT', date: 'Mar 2025', expires: null },
];

const fallbackMyDocs = [
  { name: 'Offer Letter', size: '0.5 MB', type: 'PDF', status: 'verified', expires: null, uploaded: 'Jan 2023' },
  { name: 'Aadhaar Card', size: '0.3 MB', type: 'Image', status: 'verified', expires: null, uploaded: 'Jan 2023' },
  { name: 'PAN Card', size: '0.2 MB', type: 'Image', status: 'pending', expires: null, uploaded: 'Jan 2023' },
  { name: 'Educational Certificate', size: '1.2 MB', type: 'PDF', status: 'verified', expires: '2026-05-30', uploaded: 'Feb 2023' },
];

const catColor = { Policy: 'bg-violet-100 text-violet-700', IT: 'bg-blue-100 text-blue-700', HR: 'bg-green-100 text-green-700' };
const docIcon = { PDF: '📄', Image: '🖼️', DOC: '📝' };
const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024;

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('userData') || '{}');
  } catch {
    return {};
  }
};

const formatSize = (value) => {
  const size = Number(value);
  if (!Number.isFinite(size) || size <= 0) return '';
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const normalizeDocument = (document, index) => {
  const mimeType = document?.mimeType || document?.type || '';
  const name = document?.name || document?.fileName || `Document ${index + 1}`;
  const url = document?.url || document?.fileUrl || document?.documentUrl || '';
  const type = mimeType.includes('image')
    ? 'Image'
    : mimeType.includes('word') || /\.docx?$/i.test(name)
      ? 'DOC'
      : 'PDF';

  return {
    ...document,
    name,
    url,
    type,
    size: formatSize(document?.size || document?.fileSize),
    status: document?.status || 'verified',
    expires: document?.expires || document?.expiryDate || null,
    uploaded: document?.uploaded || document?.createdAt
      ? new Date(document.uploaded || document.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      : '',
  };
};

export default function EmployeeDocuments() {
  const [showUpload, setShowUpload] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('ID Proof');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [employeeDocuments, setEmployeeDocuments] = useState(() => {
    const user = getStoredUser();
    return Array.isArray(user.documents) ? user.documents.map(normalizeDocument) : [];
  });

  useEffect(() => {
    const user = getStoredUser();
    if (!user.id) return;

    let active = true;
    employeeService.getEmployee(user.id).then((result) => {
      if (!active || !result.success) return;
      const documents = result.data?.documents || result.data?.user?.documents;
      if (Array.isArray(documents)) setEmployeeDocuments(documents.map(normalizeDocument));
    });

    return () => {
      active = false;
    };
  }, []);

  const myDocs = useMemo(
    () => employeeDocuments.length ? employeeDocuments : fallbackMyDocs,
    [employeeDocuments],
  );

  const fetchDocument = async (doc, download = false) => {
    if (!doc.url) {
      toast.error(`${doc.name} file is not available`);
      return;
    }

    const previewWindow = download ? null : window.open('', '_blank');
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(getSecureFileUrl(doc.url), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error('Unable to load document');

      const objectUrl = URL.createObjectURL(await response.blob());
      if (download) {
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = doc.name || 'document';
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else if (previewWindow) {
        previewWindow.location.href = objectUrl;
      } else {
        window.open(objectUrl, '_blank');
      }
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
    } catch {
      previewWindow?.close();
      toast.error(`Unable to ${download ? 'download' : 'view'} ${doc.name}`);
    }
  };

  const selectFile = (file) => {
    if (!file) return;
    if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
      toast.error('Select a PDF, JPG, or PNG file');
      return;
    }
    if (file.size > MAX_DOCUMENT_SIZE) {
      toast.error('Document must be smaller than 5 MB');
      return;
    }
    setSelectedFile(file);
  };

  const closeUpload = () => {
    if (uploading) return;
    setShowUpload(false);
    setSelectedFile(null);
    setDocumentType('ID Proof');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Select a document to upload');
      return;
    }

    const user = getStoredUser();
    if (!user.id) {
      toast.error('Employee account not found. Please sign in again.');
      return;
    }

    setUploading(true);
    try {
      const uploadResult = await employeeService.uploadDocuments([selectedFile]);
      if (!uploadResult.success || !uploadResult.files?.length) {
        throw new Error(uploadResult.message || 'Document upload failed');
      }

      const uploaded = uploadResult.files[0];
      const newDocument = {
        type: uploaded.type || selectedFile.type,
        url: uploaded.url,
        fileName: uploaded.name || selectedFile.name,
        mimeType: uploaded.type || selectedFile.type,
        fileSize: uploaded.size || selectedFile.size,
        category: documentType,
        status: 'pending',
      };
      const existingDocuments = employeeDocuments.map((doc) => ({
        type: doc.mimeType || doc.type || 'file',
        url: doc.url,
        fileName: doc.fileName || doc.name,
        mimeType: doc.mimeType || doc.type || '',
        fileSize: doc.fileSize || doc.size || 0,
        category: doc.category,
        status: doc.status,
        expiryDate: doc.expiryDate || doc.expires || null,
      }));
      const documents = [...existingDocuments, newDocument];
      const updateResult = await employeeService.updateEmployee(user.id, { documents });
      if (!updateResult.success) {
        throw new Error(updateResult.message || 'Unable to save document');
      }

      setEmployeeDocuments(documents.map(normalizeDocument));
      localStorage.setItem('userData', JSON.stringify({ ...user, documents }));
      toast.success('Document uploaded successfully');
      setUploading(false);
      closeUpload();
    } catch (error) {
      toast.error(error.message || 'Unable to upload document');
    } finally {
      setUploading(false);
    }
  };

  const today = new Date();
  const isExpiringSoon = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const diff = (d - today) / (1000 * 60 * 60 * 24);
    return diff <= 30 && diff >= 0;
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
                <button type="button" onClick={() => fetchDocument(doc)} aria-label={`View ${doc.name}`} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200 transition-all"><Eye className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={() => fetchDocument(doc, true)} aria-label={`Download ${doc.name}`} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all"><Download className="w-3.5 h-3.5" /></button>
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
                <p className="text-[11px] text-gray-400 mt-0.5">{[doc.type, doc.size, doc.uploaded && `Uploaded ${doc.uploaded}`].filter(Boolean).join(' · ')}</p>
              </div>
              <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${doc.status === 'verified' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                {doc.status === 'verified' ? <><CheckCircle2 className="w-2.5 h-2.5" />Verified</> : 'Pending'}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <button type="button" onClick={() => fetchDocument(doc)} aria-label={`View ${doc.name}`} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200 transition-all"><Eye className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={() => fetchDocument(doc, true)} aria-label={`Download ${doc.name}`} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all"><Download className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeUpload}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-900">Upload Document</h2>
              <button type="button" onClick={closeUpload} disabled={uploading} aria-label="Close upload dialog" className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 disabled:opacity-50"><X className="w-4 h-4 text-gray-500" /></button>
            </div>
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); selectFile(e.dataTransfer.files?.[0]); }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${dragging ? 'border-violet-400 bg-violet-50' : 'border-gray-200 hover:border-violet-300 hover:bg-gray-50'}`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(event) => selectFile(event.target.files?.[0])}
              />
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-700">{selectedFile?.name || 'Drop files here or click to browse'}</p>
              <p className="text-xs text-gray-400 mt-1">{selectedFile ? formatSize(selectedFile.size) : 'PDF, JPG, PNG up to 5 MB'}</p>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Document Type</label>
                <select value={documentType} onChange={(event) => setDocumentType(event.target.value)} className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100">
                  <option>ID Proof</option><option>Education Certificate</option><option>Experience Letter</option><option>Other</option>
                </select>
              </div>
              <button type="button" onClick={handleUpload} disabled={!selectedFile || uploading} className="flex w-full items-center justify-center gap-2 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-all disabled:cursor-not-allowed disabled:opacity-50">
                {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
                {uploading ? 'Uploading...' : 'Upload Document'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
