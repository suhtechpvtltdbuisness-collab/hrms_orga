import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, FileUp, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Spinner from '../../components/ui/Spinner';
import { hiringService } from '../../service';

const fileFields = [
  { key: 'idProof', label: 'ID Proof (Aadhaar / PAN / Passport)', required: true },
  { key: 'addressProof', label: 'Address Proof', required: true },
  { key: 'photograph', label: 'Recent Photograph', required: true },
  { key: 'educationCertificate', label: 'Education Certificate', required: false },
  { key: 'bankProof', label: 'Bank Proof / Cancelled Cheque', required: false },
];

export default function CandidateDocumentUpload() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [portal, setPortal] = useState(null);
  const [error, setError] = useState('');
  const [files, setFiles] = useState({});
  const [profile, setProfile] = useState({
    phone: '',
    dateOfBirth: '',
    gender: '',
    currentAddress: '',
    permanentAddress: '',
    bankAccountName: '',
    bankAccountNumber: '',
    bankIfsc: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  });

  const loadPortal = useCallback(async () => {
    if (!token) {
      setError('Invalid document upload link. Please use the link from your email.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    const result = await hiringService.getPublicCandidateDocuments(token);
    if (result.success) {
      setPortal(result.data);
      if (result.data.profile) {
        setProfile((current) => ({ ...current, ...result.data.profile }));
      }
    } else {
      setError(result.message || 'Document portal not found');
      setPortal(null);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    loadPortal();
  }, [loadPortal]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token) return;

    for (const field of fileFields.filter((item) => item.required)) {
      if (!files[field.key] && !portal?.documents?.files?.[field.key]) {
        toast.error(`${field.label} is required`);
        return;
      }
    }
    if (!profile.phone.trim() || !profile.currentAddress.trim()) {
      toast.error('Phone and current address are required');
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append('profile', JSON.stringify(profile));
    fileFields.forEach(({ key }) => {
      if (files[key]) formData.append(key, files[key]);
    });

    const result = await hiringService.submitPublicCandidateDocuments(token, formData);
    setSubmitting(false);

    if (result.success) {
      toast.success('Documents submitted successfully');
      await loadPortal();
    } else {
      toast.error(result.message || 'Failed to submit documents');
    }
  };

  const submitted = portal?.documentsSubmitted;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#a8c0ff] via-[#e0c3fc] to-[#f9f9ff] px-4 py-10">
      <img src="/bg.svg" className="absolute inset-0 h-full w-full object-cover opacity-60" alt="" />
      <div className="relative z-10 mx-auto w-full max-w-3xl">
        <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/95 shadow-xl backdrop-blur">
          <div className="bg-gradient-to-r from-[#7D1EDB] to-[#4f46e5] px-6 py-8 text-white">
            <p className="text-sm font-medium uppercase tracking-wide text-violet-100">ORGA HRMS</p>
            <h1 className="mt-2 text-2xl font-bold">Upload Onboarding Documents</h1>
            <p className="mt-1 text-sm text-violet-100">Submit your documents and personal details securely.</p>
          </div>

          <div className="px-6 py-8">
            {loading ? (
              <div className="flex h-48 items-center justify-center">
                <Spinner size={28} color="#7D1EDB" />
              </div>
            ) : error ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-700">{error}</div>
            ) : submitted ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-800">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={24} className="shrink-0" />
                  <div>
                    <p className="font-semibold">Documents submitted</p>
                    <p className="mt-1 text-sm">Thank you, {portal.candidateName}. Our HR team has received your documents and will review them shortly.</p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  <p><strong>{portal.candidateName}</strong> · {portal.jobTitle}</p>
                  <p className="mt-1">{portal.candidateEmail}</p>
                </div>

                <section>
                  <h2 className="mb-4 text-lg font-bold text-slate-900">Personal details</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Phone *
                      <input required value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="mt-2 block w-full rounded-xl border border-slate-200 px-4 py-2.5 font-normal outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
                    </label>
                    <label className="block text-sm font-semibold text-slate-700">
                      Date of birth
                      <input type="date" value={profile.dateOfBirth} onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })} className="mt-2 block w-full rounded-xl border border-slate-200 px-4 py-2.5 font-normal outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
                    </label>
                    <label className="block text-sm font-semibold text-slate-700">
                      Gender
                      <select value={profile.gender} onChange={(e) => setProfile({ ...profile, gender: e.target.value })} className="mt-2 block w-full rounded-xl border border-slate-200 px-4 py-2.5 font-normal outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100">
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </label>
                    <label className="block text-sm font-semibold text-slate-700 sm:col-span-2">
                      Current address *
                      <textarea required rows={2} value={profile.currentAddress} onChange={(e) => setProfile({ ...profile, currentAddress: e.target.value })} className="mt-2 block w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 font-normal outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
                    </label>
                    <label className="block text-sm font-semibold text-slate-700 sm:col-span-2">
                      Permanent address
                      <textarea rows={2} value={profile.permanentAddress} onChange={(e) => setProfile({ ...profile, permanentAddress: e.target.value })} className="mt-2 block w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 font-normal outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
                    </label>
                  </div>
                </section>

                <section>
                  <h2 className="mb-4 text-lg font-bold text-slate-900">Bank details</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Account holder name
                      <input value={profile.bankAccountName} onChange={(e) => setProfile({ ...profile, bankAccountName: e.target.value })} className="mt-2 block w-full rounded-xl border border-slate-200 px-4 py-2.5 font-normal outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
                    </label>
                    <label className="block text-sm font-semibold text-slate-700">
                      Account number
                      <input value={profile.bankAccountNumber} onChange={(e) => setProfile({ ...profile, bankAccountNumber: e.target.value })} className="mt-2 block w-full rounded-xl border border-slate-200 px-4 py-2.5 font-normal outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
                    </label>
                    <label className="block text-sm font-semibold text-slate-700">
                      IFSC code
                      <input value={profile.bankIfsc} onChange={(e) => setProfile({ ...profile, bankIfsc: e.target.value })} className="mt-2 block w-full rounded-xl border border-slate-200 px-4 py-2.5 font-normal outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
                    </label>
                  </div>
                </section>

                <section>
                  <h2 className="mb-4 text-lg font-bold text-slate-900">Emergency contact</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Contact name
                      <input value={profile.emergencyContactName} onChange={(e) => setProfile({ ...profile, emergencyContactName: e.target.value })} className="mt-2 block w-full rounded-xl border border-slate-200 px-4 py-2.5 font-normal outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
                    </label>
                    <label className="block text-sm font-semibold text-slate-700">
                      Contact phone
                      <input value={profile.emergencyContactPhone} onChange={(e) => setProfile({ ...profile, emergencyContactPhone: e.target.value })} className="mt-2 block w-full rounded-xl border border-slate-200 px-4 py-2.5 font-normal outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
                    </label>
                  </div>
                </section>

                <section>
                  <h2 className="mb-4 text-lg font-bold text-slate-900">Upload documents</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {fileFields.map(({ key, label, required }) => (
                      <label key={key} className="block rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                        <span className="text-sm font-semibold text-slate-700">{label}{required ? ' *' : ''}</span>
                        <div className="mt-3 flex items-center gap-3">
                          <FileUp size={18} className="text-violet-600" />
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => setFiles({ ...files, [key]: e.target.files?.[0] || null })}
                            className="block w-full text-sm text-slate-600"
                          />
                        </div>
                      </label>
                    ))}
                  </div>
                </section>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#7D1EDB] px-6 py-3 text-sm font-bold text-white hover:bg-violet-700 disabled:opacity-60"
                >
                  {submitting ? <Spinner size={16} color="#fff" /> : <Upload size={18} />}
                  {submitting ? 'Submitting...' : 'Submit documents'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
