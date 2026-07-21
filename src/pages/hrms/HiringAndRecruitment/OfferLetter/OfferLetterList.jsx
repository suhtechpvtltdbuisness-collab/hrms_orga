import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Mail, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Spinner from '../../../../components/ui/Spinner';
import { hiringService } from '../../../../service';

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const statusStyle = {
  draft: 'bg-slate-100 text-slate-700',
  sent: 'bg-blue-50 text-blue-700',
  accepted: 'bg-emerald-50 text-emerald-700',
  declined: 'bg-rose-50 text-rose-700',
};

export default function OfferLetterList() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadOffers = useCallback(async () => {
    setLoading(true);
    const result = await hiringService.getOfferLetters();
    if (result.success) {
      setOffers(result.data || []);
    } else {
      toast.error(result.message || 'Failed to load offer letters');
      setOffers([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadOffers();
  }, [loadOffers]);

  const handleMarkAccepted = async (id) => {
    setUpdatingId(id);
    const result = await hiringService.updateOfferLetterStatus(id, 'accepted');
    setUpdatingId(null);
    if (result.success) {
      toast.success('Offer marked as accepted');
      loadOffers();
    } else {
      toast.error(result.message || 'Failed to update offer status');
    }
  };

  const handleMarkDeclined = async (id) => {
    setUpdatingId(id);
    const result = await hiringService.updateOfferLetterStatus(id, 'declined');
    setUpdatingId(null);
    if (result.success) {
      toast.success('Offer marked as declined');
      loadOffers();
    } else {
      toast.error(result.message || 'Failed to update offer status');
    }
  };

  return (
    <div className="mx-2 my-4 flex h-[calc(100vh-10rem)] flex-col overflow-hidden rounded-xl border border-[#D9D9D9] bg-white px-4 py-5 sm:mx-4 sm:px-6">
      <button
        type="button"
        onClick={() => navigate('/hrms')}
        className="mb-3 flex w-fit items-center gap-2 text-sm font-medium text-[#7D1EDB]"
      >
        <ArrowLeft size={16} />
        HRMS Dashboard
        <ChevronRight size={15} className="text-slate-400" />
        <span className="font-normal text-slate-500">Offer Letter List</span>
      </button>

      <div className="mb-5">
        <h1 className="text-xl font-semibold text-slate-900">Offer Letter List</h1>
        <p className="mt-1 text-sm text-slate-500">Track issued offer letters and update candidate responses.</p>
      </div>

      <div className="flex-1 overflow-auto rounded-xl border border-slate-200">
        {loading ? (
          <div className="flex h-56 items-center justify-center">
            <Spinner size={28} color="#7D1EDB" />
          </div>
        ) : offers.length === 0 ? (
          <div className="flex h-56 flex-col items-center justify-center text-center text-sm text-slate-500">
            <Mail size={32} className="mb-3 text-violet-300" />
            <p className="font-semibold text-slate-700">No offer letters issued yet</p>
            <p className="mt-1">Issue an offer from a selected interview result.</p>
          </div>
        ) : (
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="sticky top-0 bg-slate-50">
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3 font-semibold">Candidate</th>
                <th className="px-5 py-3 font-semibold">Position</th>
                <th className="px-5 py-3 font-semibold">Joining Date</th>
                <th className="px-5 py-3 font-semibold">Sent On</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => (
                <tr key={offer.id} className="border-b border-slate-100 hover:bg-violet-50/30">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">{offer.candidateName}</p>
                    <p className="text-xs text-slate-500">{offer.candidateEmail}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{offer.jobTitle || offer.designation || '—'}</td>
                  <td className="px-5 py-4 text-slate-600">{formatDate(offer.joiningDate)}</td>
                  <td className="px-5 py-4 text-slate-600">{formatDate(offer.sentAt)}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle[offer.status] || statusStyle.draft}`}>
                      {offer.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      {offer.status === 'sent' && (
                        <>
                          <button
                            type="button"
                            disabled={updatingId === offer.id}
                            onClick={() => handleMarkAccepted(offer.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 disabled:opacity-50"
                          >
                            <CheckCircle size={14} />
                            Mark Accepted
                          </button>
                          <button
                            type="button"
                            disabled={updatingId === offer.id}
                            onClick={() => handleMarkDeclined(offer.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 disabled:opacity-50"
                          >
                            <XCircle size={14} />
                            Decline
                          </button>
                        </>
                      )}
                      {offer.status === 'accepted' && (
                        <button
                          type="button"
                          onClick={() => navigate(`/hrms/hiring-and-recruitment/offer-letter-accepted-list/${offer.id}`)}
                          className="rounded-lg border border-violet-200 px-3 py-1.5 text-xs font-semibold text-violet-700 hover:bg-violet-50"
                        >
                          View Onboarding
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
