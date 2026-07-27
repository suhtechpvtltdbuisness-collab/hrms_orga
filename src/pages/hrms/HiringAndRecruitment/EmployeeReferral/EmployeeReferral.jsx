import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Copy, Check, Users, Share2, Gift, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Spinner from '../../../../components/ui/Spinner';
import { hiringService } from '../../../../service';

const EmployeeReferral = () => {
    const navigate = useNavigate();
    const [referralCode, setReferralCode] = useState('');
    const [referrals, setReferrals] = useState([]);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        candidateName: '',
        candidateEmail: '',
        candidatePhone: '',
        jobId: '',
        notes: '',
    });
    const [jobs, setJobs] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [loadingJobs, setLoadingJobs] = useState(false);
    const [loadingCode, setLoadingCode] = useState(false);

    useEffect(() => {
        loadReferralCode();
        loadMyReferrals();
        loadJobs();
    }, []);

    const loadReferralCode = async () => {
        setLoadingCode(true);
        const result = await hiringService.generateReferralCode();
        if (result.success) {
            setReferralCode(result.data.referralCode);
        }
        setLoadingCode(false);
    };

    const loadMyReferrals = async () => {
        setLoading(true);
        const result = await hiringService.getMyReferrals();
        if (result.success) {
            setReferrals(result.data || []);
        }
        setLoading(false);
    };

    const loadJobs = async () => {
        setLoadingJobs(true);
        const result = await hiringService.getAllJobs();
        if (result.success) {
            setJobs(result.data?.filter(j => j.isActive) || []);
        }
        setLoadingJobs(false);
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(referralCode);
        setCopied(true);
        toast.success('Referral code copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'candidatePhone' ? value.replace(/\D/g, '').slice(0, 10) : value,
        }));
    };

    const handleSubmitReferral = async (e) => {
        e.preventDefault();
        if (!formData.candidateName) {
            toast.error('Please enter candidate name');
            return;
        }
        if (formData.candidatePhone && !/^\d{10}$/.test(formData.candidatePhone)) {
            toast.error('Enter a valid 10-digit phone number');
            return;
        }
        setSubmitting(true);
        const loadingToast = toast.loading('Submitting referral...');
        const result = await hiringService.createReferral({
            ...formData,
            referralCode,
            jobId: formData.jobId ? Number(formData.jobId) : null,
        });
        toast.dismiss(loadingToast);
        if (result.success) {
            toast.success('Referral submitted successfully!');
            setFormData({ candidateName: '', candidateEmail: '', candidatePhone: '', jobId: '', notes: '' });
            setShowForm(false);
            loadMyReferrals();
        } else {
            toast.error(result.message);
        }
        setSubmitting(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return { bg: '#FFF3E0', color: '#FF9800' };
            case 'shortlisted': return { bg: '#E3F2FD', color: '#2196F3' };
            case 'accepted': return { bg: '#E8F5E9', color: '#4CAF50' };
            case 'rejected': return { bg: '#FFEBEE', color: '#F44336' };
            default: return { bg: '#F5F5F5', color: '#9E9E9E' };
        }
    };

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-4 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)] xl:h-[calc(100vh-11rem)] flex flex-col font-sans border border-[#D9D9D9] overflow-hidden" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
            
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-[#7D1EDB] mb-4 shrink-0">
                <div className="flex items-center gap-3" onClick={() => navigate('/hrms')}>
                    <ArrowLeft size={14} className="text-gray-900 cursor-pointer" />
                    <span className="cursor-pointer hover:text-purple-500">HRMS Dashboard</span>
                </div>
                <ChevronRight size={16} className="mx-1" />
                <span className="text-[#667085] text-[14px] font-base">Employee Referral</span>
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 shrink-0">
                <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Gift size={22} className="text-purple-600" />
                    Employee Referral
                </h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-6 py-2.5 bg-[#7D1EDB] text-white font-medium rounded-full hover:bg-purple-700 transition-colors shadow-sm"
                    style={{ borderRadius: '30px' }}
                >
                    + New Referral
                </button>
            </div>

            <div className="custom-scrollbar pr-2 pb-4" style={{ flex: 1, overflowY: 'auto' }}>
                {/* Referral Code Card */}
                <div className="border border-gray-200 rounded-xl p-6 bg-gradient-to-r from-purple-50 to-white mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-purple-100 rounded-full">
                                <Share2 size={20} className="text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-gray-900">Your Referral Code</h3>
                                <p className="text-sm text-gray-500">Share this code with candidates you refer</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-white border-2 border-purple-300 rounded-lg px-4 py-2.5 flex items-center gap-2">
                                {loadingCode ? (
                                    <Spinner size={18} color="#7D1EDB" />
                                ) : (
                                    <span className="text-lg font-bold text-purple-700 tracking-wider">{referralCode}</span>
                                )}
                            </div>
                            <button
                                onClick={handleCopyCode}
                                className="p-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                title="Copy referral code"
                            >
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* New Referral Form */}
                {showForm && (
                    <div className="border border-gray-200 rounded-xl p-6 bg-white mb-6">
                        <h3 className="text-base font-semibold text-gray-900 mb-4">Refer a Candidate</h3>
                        <form onSubmit={handleSubmitReferral} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Candidate Name *</label>
                                <input
                                    type="tel"
                                    inputMode="numeric"
                                    maxLength={10}
                                    pattern="[0-9]{10}"
                                    name="candidateName"
                                    value={formData.candidateName}
                                    onChange={handleInputChange}
                                    placeholder="Enter candidate name"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Candidate Email</label>
                                <input
                                    type="email"
                                    name="candidateEmail"
                                    value={formData.candidateEmail}
                                    onChange={handleInputChange}
                                    placeholder="Enter candidate email"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Candidate Phone</label>
                                <input
                                    type="text"
                                    name="candidatePhone"
                                    value={formData.candidatePhone}
                                    onChange={handleInputChange}
                                    placeholder="10-digit phone number"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Job Position (Optional)</label>
                                <select
                                    name="jobId"
                                    value={formData.jobId}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white"
                                >
                                    <option value="">{loadingJobs ? 'Loading...' : 'Select a position'}</option>
                                    {jobs.map(job => (
                                        <option key={job.id} value={job.id}>{job.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    placeholder="Any additional notes about the candidate"
                                    rows={2}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm resize-none"
                                />
                            </div>
                            <div className="md:col-span-2 flex gap-3">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-2.5 bg-[#7D1EDB] text-white font-medium rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                                    style={{ borderRadius: '30px' }}
                                >
                                    {submitting ? <Spinner size={16} color="#fff" /> : null}
                                    {submitting ? 'Submitting...' : 'Submit Referral'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors"
                                    style={{ borderRadius: '30px' }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* My Referrals List */}
                <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Users size={18} className="text-purple-600" />
                        My Referrals
                    </h3>
                    {loading ? (
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Spinner size={16} />
                            Loading referrals...
                        </div>
                    ) : referrals.length === 0 ? (
                        <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center">
                            <Gift size={40} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-400">No referrals yet. Start referring candidates!</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto border border-gray-200 rounded-xl">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="text-gray-500 border-b border-gray-200">
                                        <th className="px-4 py-4 font-medium">CANDIDATE</th>
                                        <th className="px-4 py-4 font-medium">EMAIL</th>
                                        <th className="px-4 py-4 font-medium">PHONE</th>
                                        <th className="px-4 py-4 font-medium">POSITION</th>
                                        <th className="px-4 py-4 font-medium">STATUS</th>
                                        <th className="px-4 py-4 font-medium">DATE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {referrals.map((ref) => {
                                        const statusStyle = getStatusColor(ref.status);
                                        return (
                                            <tr key={ref.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                                <td className="px-4 py-4 font-medium text-gray-900">{ref.candidateName || 'N/A'}</td>
                                                <td className="px-4 py-4 text-gray-600">{ref.candidateEmail || '-'}</td>
                                                <td className="px-4 py-4 text-gray-600">{ref.candidatePhone || '-'}</td>
                                                <td className="px-4 py-4 text-gray-600">{ref.jobTitle || '-'}</td>
                                                <td className="px-4 py-4">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                                                        style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
                                                    >
                                                        {ref.status.charAt(0).toUpperCase() + ref.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-gray-500">
                                                    {ref.createdAt ? new Date(ref.createdAt).toLocaleDateString() : '-'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployeeReferral;
