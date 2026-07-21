import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Mail, UserRound, Briefcase, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Spinner from '../../../../components/ui/Spinner';
import { hiringService } from '../../../../service';

const formatDisplayDate = (value) => {
  if (!value) return '';
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatDateTime = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const isSelectedInterview = (status) => String(status || '').toLowerCase().includes('selected');

export default function ReleaseOfferLetter() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('applicationId');
  const interviewId = searchParams.get('interviewId');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [candidate, setCandidate] = useState(null);
  const [selectedInterviews, setSelectedInterviews] = useState([]);
  const [offerByApplicationId, setOfferByApplicationId] = useState({});
  const [form, setForm] = useState({
    salary: '',
    joiningDate: '',
    department: '',
    designation: '',
    notes: '',
  });

  const loadSelectedInterviews = useCallback(async () => {
    setLoading(true);
    const [interviewsResult, offersResult] = await Promise.all([
      hiringService.getAllInterviews(),
      hiringService.getOfferLetters(),
    ]);

    if (!interviewsResult.success) {
      toast.error(interviewsResult.message || 'Failed to load interview results');
      setSelectedInterviews([]);
      setLoading(false);
      return;
    }

    const offers = offersResult.success ? offersResult.data || [] : [];
    const offerMap = offers.reduce((acc, offer) => {
      if (offer.jobApplicationId) acc[offer.jobApplicationId] = offer;
      return acc;
    }, {});
    setOfferByApplicationId(offerMap);

    const selected = (interviewsResult.data || []).filter((item) => isSelectedInterview(item.status));
    setSelectedInterviews(selected);
    setLoading(false);
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!applicationId) {
        await loadSelectedInterviews();
        return;
      }

      setLoading(true);
      const result = await hiringService.getApplicationById(Number(applicationId));
      if (result.success && result.data) {
        const app = result.data;
        setCandidate(app);
        setForm((prev) => ({
          ...prev,
          department: app.departmentName || '',
          designation: app.jobTitle || '',
        }));
      } else {
        toast.error(result.message || 'Failed to load candidate');
      }
      setLoading(false);
    };
    load();
  }, [applicationId, loadSelectedInterviews]);

  const pendingInterviews = useMemo(
    () => selectedInterviews.filter((item) => {
      const offer = offerByApplicationId[item.jobApplicationId];
      return !offer || !['sent', 'accepted'].includes(offer.status);
    }),
    [selectedInterviews, offerByApplicationId],
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!applicationId) {
      toast.error('Application ID is required');
      return;
    }
    if (!form.salary.trim() || !form.joiningDate) {
      toast.error('Salary and joining date are required');
      return;
    }

    setSubmitting(true);
    const result = await hiringService.createOfferLetter({
      jobApplicationId: Number(applicationId),
      interviewId: interviewId ? Number(interviewId) : undefined,
      salary: form.salary.trim(),
      joiningDate: form.joiningDate,
      department: form.department.trim(),
      designation: form.designation.trim(),
      notes: form.notes.trim(),
      sendEmail: true,
    });
    setSubmitting(false);

    if (result.success) {
      toast.success(result.message || 'Offer letter sent successfully');
      navigate('/hrms/hiring-and-recruitment/offer-letter-list');
    } else {
      toast.error(result.message || 'Failed to issue offer letter');
    }
  };

  return (
    <div className="mx-2 my-4 flex h-[calc(100vh-10rem)] flex-col overflow-hidden rounded-xl border border-[#D9D9D9] bg-white px-4 py-5 sm:mx-4 sm:px-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-3 flex w-fit items-center gap-2 text-sm font-medium text-[#7D1EDB]"
      >
        <ArrowLeft size={16} />
        Back
        <ChevronRight size={15} className="text-slate-400" />
        <span className="font-normal text-slate-500">Release Offer Letter</span>
      </button>

      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Release Offer Letter</h1>
          <p className="mt-1 text-sm text-slate-500">Issue and email the offer letter to the selected candidate.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <Spinner size={28} color="#7D1EDB" />
        </div>
      ) : !applicationId ? (
        <div className="custom-scrollbar flex-1 overflow-y-auto pr-1">
          <div className="flex-1 overflow-auto rounded-xl border border-slate-200">
            {pendingInterviews.length === 0 ? (
              <div className="flex h-56 flex-col items-center justify-center text-center text-sm text-slate-500">
                <FileText size={32} className="mb-3 text-violet-300" />
                <p className="font-semibold text-slate-700">No selected candidates pending offer</p>
                <p className="mt-1">Submit an interview result as &quot;Selected&quot; to issue an offer letter here.</p>
              </div>
            ) : (
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="sticky top-0 bg-slate-50">
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-3 font-semibold">Candidate</th>
                    <th className="px-5 py-3 font-semibold">Position</th>
                    <th className="px-5 py-3 font-semibold">Interview Date</th>
                    <th className="px-5 py-3 font-semibold">Result</th>
                    <th className="px-5 py-3 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingInterviews.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 hover:bg-violet-50/30">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800">{item.candidateName || '—'}</p>
                        <p className="text-xs text-slate-500">{item.candidateEmail || '—'}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{item.jobTitle || '—'}</td>
                      <td className="px-5 py-4 text-slate-600">{formatDateTime(item.scheduledAt)}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
                          {item.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => navigate(
                            `/hrms/hiring-and-recruitment/release-offer-letter?applicationId=${item.jobApplicationId}&interviewId=${item.id}`,
                          )}
                          className="rounded-lg bg-[#7D1EDB] px-4 py-2 text-xs font-semibold text-white hover:bg-violet-700"
                        >
                          Issue Offer Letter
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : !candidate ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
          Could not load candidate details. Go back and choose a selected interview from the list.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="custom-scrollbar flex-1 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => navigate('/hrms/hiring-and-recruitment/release-offer-letter')}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#7D1EDB] hover:text-violet-700"
          >
            <ArrowLeft size={15} />
            Back to selected candidates
          </button>
          <div className="mb-5 grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-3">
            <div className="flex items-start gap-3">
              <UserRound size={18} className="mt-0.5 text-violet-600" />
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Candidate</p>
                <p className="font-semibold text-slate-900">{candidate.applicantName}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail size={18} className="mt-0.5 text-violet-600" />
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Email</p>
                <p className="font-semibold text-slate-900">{candidate.applicantEmail || '—'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Briefcase size={18} className="mt-0.5 text-violet-600" />
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Position</p>
                <p className="font-semibold text-slate-900">{candidate.jobTitle || '—'}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-semibold text-slate-700">
              Salary / CTC *
              <input
                required
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
                placeholder="e.g. ₹8,00,000 per annum"
                className="mt-2 block w-full rounded-xl border border-slate-200 px-4 py-2.5 font-normal outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Joining Date *
              <input
                required
                type="date"
                value={form.joiningDate}
                onChange={(e) => setForm({ ...form, joiningDate: e.target.value })}
                className="mt-2 block w-full rounded-xl border border-slate-200 px-4 py-2.5 font-normal outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Department
              <input
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="mt-2 block w-full rounded-xl border border-slate-200 px-4 py-2.5 font-normal outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Designation
              <input
                value={form.designation}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
                className="mt-2 block w-full rounded-xl border border-slate-200 px-4 py-2.5 font-normal outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </label>
          </div>

          <label className="mt-4 block text-sm font-semibold text-slate-700">
            Additional Notes
            <textarea
              rows={4}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Any additional terms or instructions for the candidate"
              className="mt-2 block w-full resize-none rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
          </label>

          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-bold text-slate-900">Email Preview</h2>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <p>Dear {candidate.applicantName},</p>
              <p>Congratulations! We are pleased to offer you the position of <strong>{form.designation || candidate.jobTitle}</strong>.</p>
              <p><strong>Salary / CTC:</strong> {form.salary || '—'}</p>
              <p><strong>Joining Date:</strong> {formatDisplayDate(form.joiningDate) || '—'}</p>
              <p><strong>Department:</strong> {form.department || 'To be confirmed'}</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-[#7D1EDB] px-6 py-2.5 text-sm font-bold text-white hover:bg-violet-700 disabled:opacity-60"
            >
              {submitting ? <Spinner size={16} color="#fff" /> : null}
              {submitting ? 'Sending Offer...' : 'Issue & Send Offer Letter'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
