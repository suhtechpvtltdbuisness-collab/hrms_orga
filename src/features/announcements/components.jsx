/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { toast } from 'react-hot-toast';
import { X, AlertTriangle, Paperclip, Download, FileText } from 'lucide-react';
import { getSecureFileUrl } from '../../service';

export const statusTone = {Published:'bg-emerald-50 text-emerald-700',Draft:'bg-slate-100 text-slate-600',Scheduled:'bg-blue-50 text-blue-700',Archived:'bg-amber-50 text-amber-700'};
export const priorityTone = {Urgent:'bg-rose-50 text-rose-700',Important:'bg-amber-50 text-amber-700',Normal:'bg-violet-50 text-violet-700'};
export const Badge=({children,className=''})=><span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${className}`}>{children}</span>;
const downloadAttachment = async (file) => {
  if (!file?.url) {
    toast.error(`${file?.name || 'Attachment'} is not available`);
    return;
  }
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(getSecureFileUrl(file.url), {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!response.ok) throw new Error('Unable to download attachment');
    const objectUrl = URL.createObjectURL(await response.blob());
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = file.name || 'attachment';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
  } catch {
    toast.error(`Unable to download ${file?.name || 'attachment'}`);
  }
};
export const Attachments=({files=[],editable=false,onRemove}) => files.length ? <div className="space-y-2">{files.map(file=><div key={file.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"><div className="rounded-lg bg-violet-50 p-2 text-violet-600"><FileText size={18}/></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-slate-700">{file.name}</p><p className="text-xs text-slate-400">{file.type} · {file.size}</p></div>{editable?<button type="button" onClick={()=>onRemove(file.id)} className="text-slate-400 hover:text-rose-600"><X size={17}/></button>:<button type="button" onClick={()=>downloadAttachment(file)} className="text-violet-600"><Download size={17}/></button>}</div>)}</div>:<p className="text-sm text-slate-400">No attachments</p>;
export function Modal({title,body,confirm='Confirm',tone='violet',onConfirm,onClose,children}) { return <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/40 p-4" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><div className="mb-4 flex items-start gap-3"><div className={`rounded-xl p-2 ${tone==='danger'?'bg-rose-50 text-rose-600':'bg-violet-50 text-violet-600'}`}><AlertTriangle size={20}/></div><div className="flex-1"><h3 className="font-semibold text-slate-900">{title}</h3>{body&&<p className="mt-1 text-sm text-slate-500">{body}</p>}</div><button onClick={onClose}><X size={18}/></button></div>{children}<div className="mt-6 flex justify-end gap-2"><button onClick={onClose} className="rounded-lg border px-4 py-2 text-sm font-medium">Cancel</button><button onClick={onConfirm} className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${tone==='danger'?'bg-rose-600':'bg-violet-600'}`}>{confirm}</button></div></div></div> }
export const EmptyState=({title='No announcements found',message='Try adjusting your search or filters.'})=><div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center"><div className="mx-auto mb-3 w-fit rounded-2xl bg-violet-50 p-3 text-violet-500"><Paperclip size={24}/></div><h3 className="font-semibold text-slate-700">{title}</h3><p className="mt-1 text-sm text-slate-400">{message}</p></div>;
