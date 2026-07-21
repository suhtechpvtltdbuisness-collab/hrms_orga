import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Briefcase, CalendarDays, CheckCircle2, Mail, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Spinner from '../../components/ui/Spinner';
import { hiringService } from '../../service';

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function AcceptOfferLetter() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState('');
  const [offer, setOffer] = useState(null);
  const [error, setError] = useState('');

  const loadOffer = useCallback(async () => {
    if (!token) {
      setError('Invalid offer link. Please use the link from your email.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    const result = await hiringService.getPublicOfferByToken(token);
    if (result.success) {
      setOffer(result.data);
    } else {
      setError(result.message || 'Offer letter not found');
      setOffer(null);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    loadOffer();
  }, [loadOffer]);

  const handleAccept = async () => {
    setSubmitting('accept');
    const result = await hiringService.acceptPublicOffer(token);
    setSubmitting('');
    if (result.success) {
      toast.success('Offer accepted successfully');
      if (result.data?.documentUploadUrl) {
        setOffer((current) => ({ ...current, status: 'accepted', documentUploadUrl: result.data.documentUploadUrl }));
      }
      await loadOffer();
    } else {
      toast.error(result.message || 'Failed to accept offer');
    }
  };

  const handleDecline = async () => {
    setSubmitting('decline');
    const result = await hiringService.declinePublicOffer(token);
    setSubmitting('');
    if (result.success) {
      toast.success('Offer declined');
      await loadOffer();
    } else {
      toast.error(result.message || 'Failed to decline offer');
    }
  };

  const isAccepted = offer?.status === 'accepted';
  const isDeclined = offer?.status === 'declined';
  const canRespond = offer?.status === 'sent';

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#a8c0ff] via-[#e0c3fc] to-[#f9f9ff] px-4 py-10">
      <img src="/bg.svg" className="absolute inset-0 h-full w-full object-cover opacity-60" alt="" />
      <div className="relative z-10 mx-auto w-full max-w-2xl">
        <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/95 shadow-xl backdrop-blur">
          <div className="bg-gradient-to-r from-[#7D1EDB] to-[#4f46e5] px-6 py-8 text-white">
            <p className="text-sm font-medium uppercase tracking-wide text-violet-100">ORGA HRMS</p>
            <h1 className="mt-2 text-2xl font-bold">Offer Letter</h1>
            <p className="mt-1 text-sm text-violet-100">Review and respond to your job offer</p>
          </div>

          <div className="px-6 py-8">
            {loading ? (
              <div className="flex h-48 items-center justify-center">
                <Spinner size={28} color="#7D1EDB" />
              </div>
            ) : error ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-700">
                {error}
              </div>
            ) : (
              <>
                {isAccepted && (
                  <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
                    <CheckCircle2 size={22} className="mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold">Offer Accepted</p>
                      <p className="mt-1 text-sm">Thank you, {offer.candidateName}. Our HR team will contact you with next steps.</p>
                    </div>
                  </div>
                )}

                {isAccepted && offer.documentUploadUrl && !offer.documentsSubmitted ? (
                  <div className="mb-6 rounded-xl border border-violet-200 bg-violet-50 p-5">
                    <p className="font-semibold text-violet-900">Next step: upload your documents</p>
                    <p className="mt-1 text-sm text-violet-800">
                      Please upload your ID proof, address proof, photograph, bank details, and other required information.
                    </p>
                    <a
                      href={offer.documentUploadUrl}
                      className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#7D1EDB] px-5 py-3 text-sm font-bold text-white hover:bg-violet-700"
                    >
                      Upload documents
                    </a>
                  </div>
                ) : null}

                {isAccepted && offer.documentsSubmitted ? (
                  <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
                    Your onboarding documents have been submitted successfully.
                  </div>
                ) : null}

                {isDeclined && (
                  <div className="mb-6 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-700">
                    <XCircle size={22} className="mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold">Offer Declined</p>
                      <p className="mt-1 text-sm">You have declined this offer. Thank you for your time.</p>
                    </div>
                  </div>
                )}

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm text-slate-600">Dear <strong>{offer.candidateName}</strong>,</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Congratulations! We are pleased to offer you the position of{' '}
                    <strong>{offer.designation || offer.jobTitle}</strong>.
                  </p>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3 rounded-lg bg-white p-4">
                      <Briefcase size={18} className="mt-0.5 text-violet-600" />
                      <div>
                        <p className="text-xs font-semibold uppercase text-slate-500">Position</p>
                        <p className="font-semibold text-slate-900">{offer.jobTitle || '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-lg bg-white p-4">
                      <Mail size={18} className="mt-0.5 text-violet-600" />
                      <div>
                        <p className="text-xs font-semibold uppercase text-slate-500">Department</p>
                        <p className="font-semibold text-slate-900">{offer.department || 'To be confirmed'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-lg bg-white p-4">
                      <CalendarDays size={18} className="mt-0.5 text-violet-600" />
                      <div>
                        <p className="text-xs font-semibold uppercase text-slate-500">Joining Date</p>
                        <p className="font-semibold text-slate-900">{formatDate(offer.joiningDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-lg bg-white p-4">
                      <Briefcase size={18} className="mt-0.5 text-violet-600" />
                      <div>
                        <p className="text-xs font-semibold uppercase text-slate-500">Salary / CTC</p>
                        <p className="font-semibold text-slate-900">{offer.salary || 'As discussed'}</p>
                      </div>
                    </div>
                  </div>

                  {offer.notes ? (
                    <div className="mt-4 rounded-lg bg-white p-4 text-sm text-slate-600">
                      <p className="text-xs font-semibold uppercase text-slate-500">Additional Notes</p>
                      <p className="mt-2">{offer.notes}</p>
                    </div>
                  ) : null}
                </div>

                {canRespond && (
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      disabled={Boolean(submitting)}
                      onClick={handleDecline}
                      className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                    >
                      {submitting === 'decline' ? 'Declining...' : 'Decline Offer'}
                    </button>
                    <button
                      type="button"
                      disabled={Boolean(submitting)}
                      onClick={handleAccept}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7D1EDB] px-6 py-3 text-sm font-bold text-white hover:bg-violet-700 disabled:opacity-60"
                    >
                      {submitting === 'accept' ? <Spinner size={16} color="#fff" /> : null}
                      {submitting === 'accept' ? 'Accepting...' : 'Accept Offer Letter'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
