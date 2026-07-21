import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Briefcase,
    CalendarDays,
    ChevronRight,
    Clock,
    FileText,
    Mail,
    Phone,
    UserRound,
    UsersRound,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Spinner from '../../../../components/ui/Spinner';
import { getProfilePicUrl, hiringService } from '../../../../service';

const EMPTY_VALUE = 'Not available';

const compact = (items) => items.filter((item) => item !== undefined && item !== null && item !== '');

const titleCase = (value) => {
    if (!value) return EMPTY_VALUE;
    return String(value)
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const clampPercent = (value) => {
    const number = Number(value);
    if (!Number.isFinite(number)) return null;
    return Math.min(100, Math.max(0, Math.round(number)));
};

const formatDateTime = (value) => {
    if (!value) return EMPTY_VALUE;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return EMPTY_VALUE;
    return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
};

const splitInstruction = (instruction) => {
    if (!instruction) return { round: EMPTY_VALUE, mode: EMPTY_VALUE };
    const [round, mode] = String(instruction).split(' - ');
    return {
        round: round?.trim() || EMPTY_VALUE,
        mode: mode?.trim() || EMPTY_VALUE,
    };
};

const getInitials = (name) => {
    const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return 'NA';
    return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');
};

const normalizeInterviewers = (interview) => {
    const source =
        interview?.interviewers ||
        interview?.interviewer ||
        interview?.panel ||
        interview?.interviewPanel ||
        interview?.interviewerName ||
        interview?.interviewerNames;

    if (Array.isArray(source)) {
        return source
            .map((person) => {
                if (typeof person === 'string') return person;
                return compact([person?.name, person?.fullName, person?.email]).join(' - ');
            })
            .filter(Boolean)
            .join(', ');
    }

    if (typeof source === 'object' && source) {
        return compact([source.name, source.fullName, source.email]).join(' - ');
    }

    if (source) return String(source);
    if (interview?.interviewerId) return `Panel ${interview.interviewerId}`;
    return EMPTY_VALUE;
};

const normalizeRatings = (interview) => {
    const source =
        interview?.ratings ||
        interview?.ratingCriteria ||
        interview?.scores ||
        interview?.feedback?.ratings ||
        interview?.feedback?.scores ||
        interview?.result?.ratings;

    if (!source) return [];

    if (Array.isArray(source)) {
        return source
            .map((rating) => {
                const label = rating?.label || rating?.name || rating?.criteria || rating?.title;
                const score = clampPercent(rating?.percentage ?? rating?.score ?? rating?.value ?? rating?.rating);
                if (!label || score === null) return null;
                return { label, score };
            })
            .filter(Boolean);
    }

    if (typeof source === 'object') {
        return Object.entries(source)
            .map(([label, value]) => {
                const score = clampPercent(
                    typeof value === 'object'
                        ? value?.percentage ?? value?.score ?? value?.value ?? value?.rating
                        : value
                );
                if (score === null) return null;
                return { label: titleCase(label), score };
            })
            .filter(Boolean);
    }

    return [];
};

const getRemarks = (interview) => ({
    strengths:
        interview?.strengths ||
        interview?.feedback?.strengths ||
        interview?.result?.strengths ||
        '',
    weaknesses:
        interview?.weaknesses ||
        interview?.feedback?.weaknesses ||
        interview?.result?.weaknesses ||
        '',
    finalComments:
        interview?.finalComments ||
        interview?.remarks ||
        interview?.feedback?.finalComments ||
        interview?.feedback?.remarks ||
        interview?.result?.remarks ||
        (typeof interview?.feedback === 'string' ? interview.feedback : '') ||
        '',
});

const getOutcomeFromStatus = (status) => {
    const initialStatus = String(status || '').toLowerCase();
    if (initialStatus.includes('selected')) return 'selected';
    if (initialStatus.includes('reject')) return 'rejected';
    if (initialStatus.includes('hold')) return 'on_hold';
    return '';
};

const isResultSubmitted = (status) => {
    const normalized = String(status || '').toLowerCase();
    return normalized.includes('selected') || normalized.includes('reject') || normalized.includes('hold');
};

const getCandidatePhoto = (interview, application) => {
    const raw =
        interview?.candidatePhoto ||
        interview?.candidateImage ||
        interview?.candidateProfilePic ||
        interview?.profilePic ||
        application?.candidatePhoto ||
        application?.candidateImage ||
        application?.profilePic ||
        application?.photo;
    return raw ? getProfilePicUrl(raw) : '';
};

const buildInterviewDetails = (interview, application) => {
    const { round, mode } = splitInstruction(interview?.instruction);
    const candidateName =
        interview?.candidateName ||
        interview?.candidate?.name ||
        application?.applicantName ||
        EMPTY_VALUE;

    return {
        id: interview?.id,
        candidateName,
        candidatePhoto: getCandidatePhoto(interview, application),
        email:
            interview?.candidateEmail ||
            interview?.candidate?.email ||
            application?.applicantEmail ||
            EMPTY_VALUE,
        phone:
            interview?.candidatePhone ||
            interview?.candidate?.phone ||
            application?.applicantPhone ||
            EMPTY_VALUE,
        appliedPosition:
            interview?.jobTitle ||
            interview?.position ||
            interview?.appliedPosition ||
            application?.jobTitle ||
            EMPTY_VALUE,
        round: interview?.round || interview?.interviewRound || round,
        mode,
        scheduledAt: formatDateTime(interview?.scheduledAt || interview?.interviewDate || interview?.dateTime),
        interviewers: normalizeInterviewers(interview),
        resume: interview?.resume || interview?.candidate?.resume || application?.resume || '',
        ratings: normalizeRatings(interview),
        remarks: getRemarks(interview),
        status: titleCase(interview?.status || interview?.result?.status),
    };
};

const PageShell = ({ children }) => (
    <div
        className="mx-2 mb-4 mt-4 flex h-[calc(100vh-9rem)] flex-col overflow-hidden rounded-xl border border-[#D9D9D9] bg-[#F8FAFC] px-3 py-4 font-sans sm:mx-4 sm:px-4 md:h-[calc(100vh-10rem)] md:px-6 xl:h-[calc(100vh-11rem)]"
        style={{ fontFamily: '"Nunito Sans", sans-serif' }}
    >
        {children}
    </div>
);

const Field = ({ icon: Icon, label, value, children }) => (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {Icon ? <Icon size={15} className="text-[#7D1EDB]" /> : null}
            {label}
        </div>
        <div className="break-words text-sm font-semibold text-slate-900">{children || value || EMPTY_VALUE}</div>
    </div>
);

const StatusBadge = ({ status }) => {
    const normalized = String(status || '').toLowerCase();
    const styles = normalized.includes('selected')
        ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
        : normalized.includes('reject')
          ? 'bg-rose-50 text-rose-700 ring-rose-200'
          : normalized.includes('hold') || normalized.includes('pending')
            ? 'bg-amber-50 text-amber-700 ring-amber-200'
            : normalized.includes('schedule')
              ? 'bg-sky-50 text-sky-700 ring-sky-200'
              : 'bg-slate-100 text-slate-700 ring-slate-200';

    return (
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${styles}`}>
            {status || EMPTY_VALUE}
        </span>
    );
};

const RatingBar = ({ label, score }) => (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="mb-2 flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-slate-800">{label}</span>
            <span className="text-sm font-bold text-[#7D1EDB]">{score}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
                className="h-full rounded-full bg-[#7D1EDB] transition-all"
                style={{ width: `${score}%` }}
            />
        </div>
    </div>
);

const EmptyPanel = ({ title, description }) => (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center">
        <p className="text-sm font-semibold text-slate-700">{title}</p>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
);

const LoadingSkeleton = () => (
    <PageShell>
        <div className="mb-4 h-5 w-64 animate-pulse rounded bg-slate-200" />
        <div className="grid flex-1 gap-4 overflow-hidden lg:grid-cols-[320px_1fr]">
            <div className="rounded-xl bg-white p-5">
                <div className="mx-auto h-24 w-24 animate-pulse rounded-full bg-slate-200" />
                <div className="mx-auto mt-5 h-5 w-44 animate-pulse rounded bg-slate-200" />
                <div className="mx-auto mt-3 h-4 w-56 animate-pulse rounded bg-slate-100" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="h-24 animate-pulse rounded-xl bg-white" />
                ))}
            </div>
        </div>
    </PageShell>
);

const InterviewResult = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [interview, setInterview] = useState(null);
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [outcome, setOutcome] = useState('');
    const [remarks, setRemarks] = useState({ strengths: '', weaknesses: '', finalComments: '' });
    const [submitting, setSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const loadInterview = async () => {
            if (!id) {
                setError('Interview details not found');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError('');
            setInterview(null);
            setApplication(null);

            const result = await hiringService.getInterviewById(id);

            if (!result.success || !result.data) {
                setError(result.message || 'Interview details not found');
                setLoading(false);
                return;
            }

            const selectedInterview = result.data;
            setInterview(selectedInterview);
            setOutcome(getOutcomeFromStatus(selectedInterview.status));
            setRemarks(getRemarks(selectedInterview));
            setIsSubmitted(isResultSubmitted(selectedInterview.status));

            if (selectedInterview.jobApplicationId) {
                const applicationResult = await hiringService.getApplicationById(selectedInterview.jobApplicationId);
                if (applicationResult.success && applicationResult.data) {
                    setApplication(applicationResult.data);
                }
            } else if (selectedInterview.jobApplication || selectedInterview.application) {
                setApplication(selectedInterview.jobApplication || selectedInterview.application);
            }

            setLoading(false);
        };

        loadInterview();
    }, [id]);

    const details = useMemo(() => buildInterviewDetails(interview, application), [interview, application]);

    const handleOpenResume = () => {
        if (!details.resume) return;
        window.open(details.resume, '_blank', 'noopener,noreferrer');
    };

    const handleSubmitResult = async () => {
        if (!outcome) {
            toast.error('Please select an interview status');
            return;
        }

        setSubmitting(true);
        const result = await hiringService.submitFeedback(id, {
            status: outcome,
            strengths: remarks.strengths,
            weaknesses: remarks.weaknesses,
            remarks: remarks.finalComments,
            feedback: remarks.finalComments,
        });

        if (result.success) {
            toast.success('Interview result submitted');
            setInterview((current) => ({ ...current, ...(result.data || {}), status: outcome }));
            setIsSubmitted(true);
        } else {
            toast.error(result.message || 'Failed to submit result');
        }
        setSubmitting(false);
    };

    if (loading) return <LoadingSkeleton />;

    if (error || !interview) {
        return (
            <PageShell>
                <div className="mb-4 flex items-center gap-1 text-sm">
                    <button
                        type="button"
                        onClick={() => navigate('/hrms/hiring-and-recruitment/new-hiring/ats-screening/schedule-interview/scheduled-interview-list')}
                        className="inline-flex items-center gap-2 font-semibold text-[#7D1EDB]"
                    >
                        <ArrowLeft size={15} className="text-slate-900" />
                        Schedule Interview List
                    </button>
                    <ChevronRight size={16} className="text-slate-400" />
                    <span className="text-slate-500">Interview Result</span>
                </div>
                <div className="grid flex-1 place-items-center">
                    <div className="max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-slate-100 text-slate-500">
                            <FileText size={26} />
                        </div>
                        <h1 className="mt-4 text-xl font-bold text-slate-900">Interview details not found</h1>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            The selected interview record could not be loaded. Please go back and choose an interview from the schedule list.
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate('/hrms/hiring-and-recruitment/new-hiring/ats-screening/schedule-interview/scheduled-interview-list')}
                            className="mt-6 rounded-full bg-[#7D1EDB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700"
                        >
                            Back to list
                        </button>
                    </div>
                </div>
            </PageShell>
        );
    }

    return (
        <PageShell>
            <div className="mb-4 shrink-0">
                <div className="mb-3 flex flex-wrap items-center gap-1 text-sm">
                    <button
                        type="button"
                        onClick={() => navigate(`/hrms/hiring-and-recruitment/scheduled-interview/${id}`)}
                        className="inline-flex items-center gap-2 font-semibold text-[#7D1EDB]"
                    >
                        <ArrowLeft size={15} className="text-slate-900" />
                        Scheduled Interview
                    </button>
                    <ChevronRight size={16} className="text-slate-400" />
                    <span className="text-slate-500">Interview Result</span>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Interview Result</h1>
                        <p className="mt-1 text-sm text-slate-500">Interview ID: {details.id}</p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        {isSubmitted && outcome === 'selected' && (
                            <button
                                type="button"
                                onClick={() => navigate(`/hrms/hiring-and-recruitment/release-offer-letter?applicationId=${interview.jobApplicationId}&interviewId=${id}`)}
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#7D1EDB] px-5 py-2.5 text-sm font-semibold text-[#7D1EDB] hover:bg-violet-50"
                            >
                                Issue Offer Letter
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={handleSubmitResult}
                            disabled={submitting || isSubmitted}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#7D1EDB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting ? <Spinner size={16} color="#fff" /> : null}
                            {isSubmitted ? 'Submitted' : submitting ? 'Submitting...' : 'Submit Result'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="custom-scrollbar flex-1 overflow-y-auto pr-1">
                <div className="grid gap-4 xl:grid-cols-[330px_1fr]">
                    <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex flex-col items-center text-center">
                            {details.candidatePhoto ? (
                                <img
                                    src={details.candidatePhoto}
                                    alt={details.candidateName}
                                    className="h-24 w-24 rounded-full border-4 border-purple-50 object-cover"
                                />
                            ) : (
                                <div className="grid h-24 w-24 place-items-center rounded-full border-4 border-purple-50 bg-[#F3E8FF] text-2xl font-bold text-[#7D1EDB]">
                                    {getInitials(details.candidateName)}
                                </div>
                            )}
                            <h2 className="mt-4 text-lg font-bold text-slate-900">{details.candidateName}</h2>
                            <p className="mt-1 text-sm font-medium text-slate-500">{details.appliedPosition}</p>
                            <div className="mt-4"><StatusBadge status={details.status} /></div>
                        </div>

                        <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">
                            <div className="flex items-start gap-3 text-sm text-slate-600">
                                <Mail size={16} className="mt-0.5 text-[#7D1EDB]" />
                                <span className="break-all">{details.email}</span>
                            </div>
                            <div className="flex items-start gap-3 text-sm text-slate-600">
                                <Phone size={16} className="mt-0.5 text-[#7D1EDB]" />
                                <span>{details.phone}</span>
                            </div>
                            <button
                                type="button"
                                onClick={handleOpenResume}
                                disabled={!details.resume}
                                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#7D1EDB] px-4 py-2.5 text-sm font-semibold text-[#7D1EDB] hover:bg-purple-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                            >
                                <FileText size={16} />
                                {details.resume ? 'View Resume' : 'Resume unavailable'}
                            </button>
                        </div>
                    </aside>

                    <main className="space-y-4">
                        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                <h3 className="text-base font-bold text-slate-900">Interview Details</h3>
                                <StatusBadge status={details.status} />
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                <Field icon={Briefcase} label="Applied Position" value={details.appliedPosition} />
                                <Field icon={UserRound} label="Interview Round" value={details.round} />
                                <Field icon={CalendarDays} label="Date & Time" value={details.scheduledAt} />
                                <Field icon={UsersRound} label="Interviewers" value={details.interviewers} />
                                <Field icon={Clock} label="Mode" value={details.mode} />
                                <Field label="Status"><StatusBadge status={details.status} /></Field>
                            </div>
                        </section>

                        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                            <h3 className="mb-4 text-base font-bold text-slate-900">Ratings</h3>
                            {details.ratings.length ? (
                                <div className="grid gap-3 md:grid-cols-2">
                                    {details.ratings.map((rating) => (
                                        <RatingBar key={rating.label} label={rating.label} score={rating.score} />
                                    ))}
                                </div>
                            ) : (
                                <EmptyPanel
                                    title="No ratings recorded"
                                    description="Ratings will appear here once they are saved for this interview."
                                />
                            )}
                        </section>

                        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                <h3 className="text-base font-bold text-slate-900">Remarks</h3>
                                <div className="flex flex-wrap gap-3">
                                    {[
                                        ['selected', 'Selected'],
                                        ['on_hold', 'On Hold'],
                                        ['rejected', 'Rejected'],
                                    ].map(([value, label]) => (
                                        <label key={value} className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-700">
                                            <input
                                                type="radio"
                                                name="interview-outcome"
                                                value={value}
                                                checked={outcome === value}
                                                onChange={() => setOutcome(value)}
                                                className="h-4 w-4 accent-[#7D1EDB]"
                                            />
                                            {label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="grid gap-3 lg:grid-cols-3">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">Strengths</label>
                                    <textarea
                                        value={remarks.strengths}
                                        onChange={(event) => setRemarks((current) => ({ ...current, strengths: event.target.value }))}
                                        className="min-h-28 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#7D1EDB] focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">Weaknesses</label>
                                    <textarea
                                        value={remarks.weaknesses}
                                        onChange={(event) => setRemarks((current) => ({ ...current, weaknesses: event.target.value }))}
                                        className="min-h-28 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#7D1EDB] focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">Final Comments</label>
                                    <textarea
                                        value={remarks.finalComments}
                                        onChange={(event) => setRemarks((current) => ({ ...current, finalComments: event.target.value }))}
                                        className="min-h-28 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#7D1EDB] focus:bg-white"
                                    />
                                </div>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </PageShell>
    );
};

export default InterviewResult;
