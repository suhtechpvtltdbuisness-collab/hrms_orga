/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Bold, Italic, Underline, List, ListOrdered, Link, Quote, AlignLeft, AlignCenter, RemoveFormatting, Upload, Eye, Save, Send } from 'lucide-react';
import { blankAnnouncement } from '../../../features/announcements/data';
import { announcementService } from '../../../features/announcements/services/announcementService';
import { Attachments, Badge, Modal, priorityTone } from '../../../features/announcements/components';
import { departmentService, employeeService } from '../../../service';

const field = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100';
const label = 'mb-1.5 block text-sm font-semibold text-slate-700';
const CONTENT_MAX_LENGTH = 180;

const getContentText = (html = '') => {
  const element = document.createElement('div');
  element.innerHTML = html;
  return element.textContent || '';
};
const formats = [
  ['bold', Bold],
  ['italic', Italic],
  ['underline', Underline],
  ['formatBlock', Quote, 'blockquote'],
  ['insertUnorderedList', List],
  ['insertOrderedList', ListOrdered],
  ['justifyLeft', AlignLeft],
  ['justifyCenter', AlignCenter],
  ['removeFormat', RemoveFormatting],
];

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('userData') || '{}');
  } catch {
    return {};
  }
};

export default function AnnouncementForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editor = useRef(null);
  const user = getCurrentUser();
  const [form, setForm] = useState({ ...blankAnnouncement, author: user.name || blankAnnouncement.author });
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(Boolean(id));
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const adminId = user.id || user._id;
      const [deptRes, empRes] = await Promise.all([
        departmentService.getDepartmentsDropdown(),
        adminId ? employeeService.getAllEmployeesByAdminId(adminId, 1, 200) : Promise.resolve({ success: false }),
      ]);
      if (cancelled) return;
      if (deptRes.success) {
        setDepartments((deptRes.data || []).map((d) => d.name || d.departmentName).filter(Boolean));
      }
      if (empRes.success) {
        const list = Array.isArray(empRes.data)
          ? empRes.data
          : empRes.data?.employees || empRes.data?.users || [];
        setEmployees(
          list
            .map((item) => {
              const u = item.user || item;
              return {
                id: String(u.id || item.userId || item.id || ''),
                name: u.name || item.name || item.fullName || '',
                email: u.email || item.email || '',
              };
            })
            .filter((e) => e.id && e.name),
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user.id, user._id]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const a = await announcementService.get(id);
        if (!cancelled && a) {
          setForm({
            ...blankAnnouncement,
            ...a,
            publishOption: a.status === 'Scheduled' ? 'Schedule' : 'Publish now',
            scheduledAt: a.scheduledAt || '',
            expiryDate: a.expiryDate || '',
            departments: a.departments || [],
            employees: (a.employees || []).map(String),
            attachments: a.attachments || [],
          });
        }
      } catch (err) {
        toast.error(err.message || 'Unable to load announcement');
        navigate('/hrms/announcements');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  useEffect(() => {
    const guard = (e) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    addEventListener('beforeunload', guard);
    return () => removeEventListener('beforeunload', guard);
  }, [dirty]);

  useEffect(() => {
    if (editor.current && document.activeElement !== editor.current) {
      editor.current.innerHTML = form.content || '';
    }
  }, [form.content, loading]);

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setDirty(true);
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Short description is required';
    if (!form.content.replace(/<[^>]*>/g, '').trim()) e.content = 'Announcement content is required';
    if (form.audience === 'Specific Departments' && !form.departments.length) e.departments = 'Select at least one department';
    if (form.audience === 'Specific Employees' && !form.employees.length) e.employees = 'Select at least one employee';
    if (form.publishOption === 'Schedule' && !form.scheduledAt) e.scheduledAt = 'Select a schedule date and time';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const persist = async (status) => {
    if (!validate()) return toast.error('Please complete the required fields.');
    const now = new Date().toISOString();
    const payload = {
      ...form,
      status,
      author: form.author || user.name || 'Admin',
      publishedAt: status === 'Published' ? form.publishedAt || now : null,
      scheduledAt: status === 'Scheduled' ? form.scheduledAt : null,
    };
    try {
      setSaving(true);
      if (id) await announcementService.update(id, payload);
      else await announcementService.create(payload);
      setDirty(false);
      toast.success(status === 'Draft' ? 'Draft saved' : status === 'Scheduled' ? 'Announcement scheduled' : 'Announcement published');
      navigate('/hrms/announcements');
    } catch (err) {
      toast.error(err.message || 'Unable to save announcement');
    } finally {
      setSaving(false);
    }
  };

  const choose = (key) => (e) => {
    const values = [...e.target.selectedOptions].map((x) => x.value);
    set(key, values);
  };

  const upload = async (e) => {
    const files = [...e.target.files];
    e.target.value = '';
    if (!files.length) return;
    if (files.some((file) => file.type !== 'application/pdf')) {
      toast.error('Only PDF attachments are allowed');
      return;
    }
    try {
      setUploading(true);
      const uploadedFiles = await announcementService.uploadAttachments(files);
      set('attachments', [...form.attachments, ...uploadedFiles]);
      toast.success(uploadedFiles.length > 1 ? 'Attachments uploaded' : 'Attachment uploaded');
    } catch (err) {
      toast.error(err.message || 'Unable to upload attachment');
    } finally {
      setUploading(false);
    }
  };

  const exec = (cmd, value) => {
    document.execCommand(cmd, false, value);
    set('content', editor.current.innerHTML);
    editor.current.focus();
  };

  const contentLength = getContentText(form.content).length;

  const updateContent = (e) => {
    const nextContent = e.currentTarget.innerHTML;
    if (getContentText(nextContent).length <= CONTENT_MAX_LENGTH) {
      set('content', nextContent);
      return;
    }

    e.currentTarget.innerHTML = form.content;
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(e.currentTarget);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  if (loading) {
    return <div className="m-6 h-72 animate-pulse rounded-2xl bg-white" />;
  }

  return (
    <div className="min-h-[calc(100vh-88px)] rounded-2xl bg-[#f7f7fa] p-4 sm:p-6">
      <button
        onClick={() => (dirty && !globalThis.confirm('Discard unsaved changes?') ? null : navigate('/hrms/announcements'))}
        className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-violet-700"
      >
        <ArrowLeft size={17} /> Back to announcements
      </button>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{id ? 'Edit' : 'Create'} announcement</h1>
          <p className="mt-1 text-sm text-slate-500">Share a clear, timely update with the right people.</p>
        </div>
        <div className="flex gap-2">
          <button disabled={saving || uploading} onClick={() => { if (validate()) setPreview(true); }} className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-semibold">
            <Eye size={16} /> Preview
          </button>
          <button disabled={saving || uploading} onClick={() => persist('Draft')} className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-semibold">
            <Save size={16} /> Save draft
          </button>
          <button
            disabled={saving || uploading}
            onClick={() => (form.publishOption === 'Schedule' ? persist('Scheduled') : setConfirm(true))}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Send size={16} />
            {form.publishOption === 'Schedule' ? 'Schedule' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="mb-5 font-semibold">Announcement content</h2>
            <label className={label}>Title *</label>
            <input className={field} value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="What do employees need to know?" />
            {errors.title && <p className="mt-1 text-xs text-rose-600">{errors.title}</p>}
            <label className={`${label} mt-4`}>Short description *</label>
            <textarea className={field} rows="2" maxLength="180" value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="A concise summary shown in announcement lists" />
            <div className="mt-3 flex items-center justify-between">
              <label className={`${label} mb-0`}>Content *</label>
              <span className="text-xs text-slate-400">{contentLength}/{CONTENT_MAX_LENGTH}</span>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200 focus-within:border-violet-400">
              <div className="flex flex-wrap gap-1 border-b bg-slate-50 p-2">
                <select onChange={(e) => exec('formatBlock', e.target.value)} className="rounded border bg-white px-2 text-xs">
                  <option value="p">Paragraph</option>
                  <option value="h2">Heading 2</option>
                  <option value="h3">Heading 3</option>
                </select>
                {formats.map(([cmd, Icon, val]) => (
                  <button type="button" key={cmd} onMouseDown={(e) => { e.preventDefault(); exec(cmd, val); }} className="rounded p-2 text-slate-500 hover:bg-violet-100 hover:text-violet-700">
                    <Icon size={16} />
                  </button>
                ))}
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const url = prompt('Enter link URL');
                    if (url) exec('createLink', url);
                  }}
                  className="rounded p-2 text-slate-500 hover:bg-violet-100"
                >
                  <Link size={16} />
                </button>
              </div>
              <div
                ref={editor}
                contentEditable
                suppressContentEditableWarning
                onInput={updateContent}
                className="prose min-h-56 max-w-none p-4 text-sm leading-7 outline-none"
              />
            </div>
            {errors.content && <p className="mt-1 text-xs text-rose-600">{errors.content}</p>}
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex justify-between">
              <div>
                <h2 className="font-semibold">Attachments</h2>
                <p className="mt-1 text-sm text-slate-400">PDF files are stored in the upload volume and linked to the announcement.</p>
              </div>
              <label className={`flex h-fit cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold text-violet-700 ${uploading ? 'pointer-events-none opacity-60' : ''}`}>
                <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload PDF'}
                <input type="file" multiple accept="application/pdf,.pdf" className="hidden" onChange={upload} />
              </label>
            </div>
            <div className="mt-4">
              <Attachments files={form.attachments} editable onRemove={(fileId) => set('attachments', form.attachments.filter((f) => f.id !== fileId))} />
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-semibold">Settings</h2>
            <label className={label}>Type</label>
            <select className={field} value={form.type} onChange={(e) => set('type', e.target.value)}>
              {['Company Update', 'Policy', 'Event', 'Maintenance', 'Benefits', 'Recognition'].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
            <label className={`${label} mt-4`}>Priority</label>
            <div className="grid grid-cols-3 gap-2">
              {['Normal', 'Important', 'Urgent'].map((x) => (
                <button
                  type="button"
                  onClick={() => set('priority', x)}
                  className={`rounded-lg border px-2 py-2 text-xs font-semibold ${form.priority === x ? `${priorityTone[x]} border-current` : 'border-slate-200 text-slate-500'}`}
                  key={x}
                >
                  {x}
                </button>
              ))}
            </div>
            <label className={`${label} mt-4`}>Target audience</label>
            <select className={field} value={form.audience} onChange={(e) => set('audience', e.target.value)}>
              {['All Employees', 'Specific Departments', 'Specific Employees', 'Managers/Admins'].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
            {form.audience === 'Specific Departments' && (
              <>
                <label className={`${label} mt-4`}>Departments *</label>
                <select multiple className={`${field} min-h-28`} value={form.departments} onChange={choose('departments')}>
                  {departments.map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
                {errors.departments && <p className="mt-1 text-xs text-rose-600">{errors.departments}</p>}
              </>
            )}
            {form.audience === 'Specific Employees' && (
              <>
                <label className={`${label} mt-4`}>Employees *</label>
                <select multiple className={`${field} min-h-28`} value={form.employees} onChange={choose('employees')}>
                  {employees.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.name}
                    </option>
                  ))}
                </select>
                {errors.employees && <p className="mt-1 text-xs text-rose-600">{errors.employees}</p>}
              </>
            )}
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-semibold">Publication</h2>
            <div className="space-y-2">
              {['Publish now', 'Schedule'].map((x) => (
                <label key={x} className="flex items-center gap-2 rounded-xl border p-3 text-sm">
                  <input type="radio" name="publish" checked={(form.publishOption || 'Publish now') === x} onChange={() => set('publishOption', x)} className="accent-violet-600" />
                  {x}
                </label>
              ))}
            </div>
            {form.publishOption === 'Schedule' && (
              <>
                <label className={`${label} mt-4`}>Schedule date & time *</label>
                <input
                  type="datetime-local"
                  className={field}
                  value={form.scheduledAt ? String(form.scheduledAt).slice(0, 16) : ''}
                  onChange={(e) => set('scheduledAt', e.target.value)}
                />
                {errors.scheduledAt && <p className="mt-1 text-xs text-rose-600">{errors.scheduledAt}</p>}
              </>
            )}
            <label className={`${label} mt-4`}>Expiry date</label>
            <input type="date" className={field} value={form.expiryDate || ''} onChange={(e) => set('expiryDate', e.target.value)} />
          </section>
        </aside>
      </div>

      {confirm && (
        <Modal
          title="Publish announcement?"
          body="Are you sure you want to publish this announcement? Employees in the selected audience will be able to see it."
          confirm="Publish"
          onClose={() => setConfirm(false)}
          onConfirm={() => persist('Published')}
        />
      )}
      {preview && (
        <Modal
          title="Employee preview"
          confirm="Publish"
          onClose={() => setPreview(false)}
          onConfirm={() => {
            setPreview(false);
            setConfirm(true);
          }}
        >
          <div className="max-h-[55vh] overflow-y-auto rounded-xl bg-slate-50 p-4">
            <Badge className={priorityTone[form.priority]}>{form.priority}</Badge>
            <h2 className="mt-3 text-xl font-bold">{form.title}</h2>
            <p className="mt-1 text-xs text-slate-400">
              By {form.author} · {form.audience}
            </p>
            <div className="prose mt-4 text-sm" dangerouslySetInnerHTML={{ __html: form.content }} />
            <div className="mt-4">
              <Attachments files={form.attachments} />
            </div>
            {form.expiryDate && <p className="mt-3 text-xs text-slate-400">Available until {new Date(form.expiryDate).toLocaleDateString()}</p>}
          </div>
        </Modal>
      )}
    </div>
  );
}
