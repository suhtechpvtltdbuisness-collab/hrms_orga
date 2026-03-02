import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';

const InterviewResult = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [outcome, setOutcome] = useState('Selected');
    const [showOutcomeModal, setShowOutcomeModal] = useState(false);

    // Section styles
    const cardStyle = {
        border: '1px solid #E4E4E4',
        borderRadius: '8px',
        backgroundColor: '#FFFFFF',
        padding: '20px',
        marginBottom: '16px',
        boxSizing: 'border-box'
    };

    const sectionTitleStyle = {
        fontSize: '14px',
        fontWeight: 600,
        color: '#111827',
        marginBottom: '16px',
        fontFamily: '"Nunito Sans", sans-serif'
    };

    const labelStyle = {
        fontSize: '13px',
        color: '#344054', // Darker gray for labels
        fontFamily: '"Nunito Sans", sans-serif'
    };

    const valueStyle = {
        fontSize: '14px',
        fontWeight: 500,
        color: '#111827',
        fontFamily: '"Nunito Sans", sans-serif'
    };

    const textareaStyle = {
        width: '100%',
        height: '100px',
        padding: '12px',
        border: '1px solid #D0D5DD',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#111827',
        outline: 'none',
        resize: 'none',
        fontFamily: '"Nunito Sans", sans-serif'
    };

    const RatingItem = ({ label, percentage }) => (
        <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ ...labelStyle, fontWeight: 500 }}>{label}</span>
                <span style={{ fontSize: '12px', color: '#98A2B3', fontFamily: '"Nunito Sans", sans-serif' }}>{percentage}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#F2F4F7', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: '#2E90FA', borderRadius: '4px' }} />
            </div>
        </div>
    );

    const CandidateOutcomeModal = () => {
        const isSelected = outcome === 'Selected';
        
        return (
            <div style={{ 
                position: 'fixed', 
                inset: 0, 
                backgroundColor: 'rgba(16, 24, 40, 0.7)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                zIndex: 1000,
                backdropFilter: 'blur(4px)'
            }}>
                <div style={{ 
                    width: '645px', 
                    height: isSelected ? '655px' : '465px', 
                    backgroundColor: '#FFFFFF', 
                    borderRadius: '16px', 
                    border: '1px solid #D9D9D9',
                    display: 'flex', 
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'height 0.3s ease'
                }}>
                    {/* Header */}
                    <div style={{ padding: '24px 24px 16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#101828', margin: 0 }}>Candidate Outcome</h2>
                        <button 
                            onClick={() => setShowOutcomeModal(false)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#98A2B3' }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>

                    <div style={{ flex: 1, padding: '0 24px 24px 24px', display: 'flex', gap: '24px', overflowY: 'auto' }}>
                        {/* Left Column: Form */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                <img 
                                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" 
                                    alt="Olivia Rhye" 
                                    style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                                />
                                <span style={{ fontSize: '16px', fontWeight: 600, color: '#101828' }}>Olivia Rhye</span>
                            </div>

                            <div>
                                <label style={{ ...labelStyle, display: 'block', marginBottom: '6px' }}>Round</label>
                                <input type="text" defaultValue="Final Round" style={{ width: '100%', padding: '10px 14px', border: '1px solid #D0D5DD', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                            </div>

                            {isSelected ? (
                                <>
                                    <div>
                                        <label style={{ ...labelStyle, display: 'block', marginBottom: '6px' }}>Interview Date</label>
                                        <div style={{ position: 'relative' }}>
                                            <input type="text" defaultValue="12/02/2026" style={{ width: '100%', padding: '10px 14px', border: '1px solid #D0D5DD', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                                            <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ ...labelStyle, display: 'block', marginBottom: '6px' }}>Interviewers</label>
                                        <input type="text" defaultValue="John Smith, Alice John" style={{ width: '100%', padding: '10px 14px', border: '1px solid #D0D5DD', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                                    </div>
                                </>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ ...labelStyle, display: 'block', marginBottom: '6px' }}>Interviewers</label>
                                        <input type="text" defaultValue="John Smith, Alice John" style={{ width: '100%', padding: '10px 14px', border: '1px solid #D0D5DD', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                                    </div>
                                    <div>
                                        <label style={{ ...labelStyle, display: 'block', marginBottom: '6px' }}>Interview Date</label>
                                        <div style={{ position: 'relative' }}>
                                            <input type="text" defaultValue="12/02/2026" style={{ width: '100%', padding: '10px 14px', border: '1px solid #D0D5DD', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                                            <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label style={{ ...labelStyle, display: 'block', marginBottom: '6px' }}>Interview Outcome</label>
                                <div style={{ position: 'relative' }}>
                                    <select 
                                        value={outcome}
                                        onChange={(e) => setOutcome(e.target.value)}
                                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #D0D5DD', borderRadius: '8px', fontSize: '14px', outline: 'none', appearance: 'none', backgroundColor: '#FFF' }}
                                    >
                                        <option value="Selected">Selected</option>
                                        <option value="On Hold">On Hold</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                    <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Email Preview (Only for Selected) */}
                        {isSelected && (
                            <div style={{ width: '280px' }}>
                                <div style={{ border: '1px solid #EAECF0', borderRadius: '12px', padding: '16px', height: '100%', overflowY: 'auto' }}>
                                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#101828', marginTop: 0, marginBottom: '16px' }}>Email Preview</h4>
                                    
                                    <div style={{ border: '1px solid #F2F4F7', borderRadius: '8px', padding: '12px', backgroundColor: '#FFFFFF' }}>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
                                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=50&auto=format&fit=crop" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                                            <div>
                                                <div style={{ fontSize: '12px', fontWeight: 600 }}>Jane.Doe <span style={{ color: '#667085', fontWeight: 400 }}>&lt;jane.doe@company.com&gt;</span></div>
                                                <div style={{ fontSize: '10px', color: '#667085' }}>To: Alice Johnson</div>
                                            </div>
                                        </div>

                                        <div style={{ fontSize: '11px', lineHeight: '1.5', color: '#101828' }}>
                                            <p style={{ fontWeight: 700, fontSize: '12px', marginBottom: '12px' }}>Congratulations! You Have An Offer From [Company Name]</p>
                                            <p>Hi [Candidate Name],</p>
                                            <p>Congratulations! Following your recent interview, we are thrilled to offer you the position of <strong>Senior Product Designer</strong> at [Company Name].</p>
                                            <p>We were all very impressed during the interview process, and we believe your skills and experience will be an excellent match for our team.</p>
                                            <p>Please find the official offer letter attached to this email, which contains details about your role, compensation, and benefits. The proposed <strong>Joining Date is 15/09/2024</strong>.</p>
                                            <p>We are all very excited to have you join us. Please let us know if you have any questions.</p>
                                            <p>Best Regards,<br/>The [Company Name] Team</p>
                                        </div>

                                        <div style={{ marginTop: '16px', padding: '12px', borderRadius: '8px', backgroundColor: '#F9FAFB', border: '1px solid #F2F4F7', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '32px', height: '32px', backgroundColor: '#EAECF0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifySelf: 'center' }}>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" style={{ margin: 'auto' }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '11px', fontWeight: 600 }}>Offer_Letter.Pdf</div>
                                                <div style={{ fontSize: '10px', color: '#667085' }}>128 KB</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div style={{ padding: '24px', borderTop: '1px solid #F2F4F7', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <button 
                            onClick={() => setShowOutcomeModal(false)}
                            style={{ width: '180px', height: '44px', borderRadius: '22px', border: '1px solid #7D1EDB', backgroundColor: '#FFF', color: '#7D1EDB', fontWeight: 600, cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                        <button 
                            style={{ width: '180px', height: '44px', borderRadius: '22px', border: 'none', backgroundColor: '#7D1EDB', color: '#FFF', fontWeight: 600, cursor: 'pointer' }}
                        >
                            {isSelected ? 'Send offer letter' : 'Email Template'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div 
            className="bg-[#F2F2F7] min-h-[calc(100vh-5rem)] overflow-y-auto"
            style={{ fontFamily: 'Poppins, sans-serif' }}
        >
            <div 
                className="bg-white px-4 sm:px-6 md:px-8 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl min-h-[calc(100vh-10rem)] shadow-sm border border-gray-100"
            >
                {/* ── Header Area ── */}
                <div className="mb-6">
                    <div className="flex items-center gap-1 text-sm text-[#7D1EDB] mb-4">
                        <div 
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => navigate(`/hrms/scheduled-interview/${id}`)}
                        >
                            <ArrowLeft size={14} className="text-gray-900" />
                            <span className="hover:text-purple-500 font-medium">Scheduled Interview</span>
                        </div>
                        <ChevronRight size={16} className="text-[#9CA3AF]" />
                        <span className="text-[#667085]">Interview Result</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                            Interview Result
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <button 
                                className="bg-transparent border-none text-[#7D1EDB] font-semibold cursor-pointer hover:underline"
                                style={{ fontSize: '14px', fontFamily: 'Poppins, sans-serif' }}
                            >
                                Save Draft
                            </button>
                            <button 
                                className="h-10 px-8 bg-[#7D1EDB] text-white font-semibold rounded-full hover:bg-purple-700 transition-colors border-none cursor-pointer"
                                style={{ fontSize: '14px', fontFamily: 'Poppins, sans-serif' }}
                            >
                                Submit Result
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Main Content Area ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        
                        {/* Candidate Summary */}
                        <div style={cardStyle}>
                            <h3 style={sectionTitleStyle}>Candidate Summary</h3>
                            <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <img 
                                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" 
                                        alt="Olivia Rhye" 
                                        style={{ width: '48px', height: '48px', borderRadius: '50%' }}
                                    />
                                    <span style={{ fontSize: '16px', fontWeight: 600, color: '#101828', fontFamily: '"Nunito Sans", sans-serif' }}>Olivia Rhye</span>
                                </div>
                                
                                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div>
                                            <span style={labelStyle}>Round</span>
                                            <div style={valueStyle}>Final Round</div>
                                        </div>
                                        <div>
                                            <span style={labelStyle}>Interviewers</span>
                                            <div style={valueStyle}>Jane Doe, John Smith</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-end' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={labelStyle}>Interview Date</span>
                                            <div style={{ ...valueStyle, fontWeight: 700 }}>20-7-2024</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ ...labelStyle, display: 'block', marginBottom: '4px' }}>Resume</span>
                                            <div style={{ ...valueStyle, color: '#7D1EDB', cursor: 'pointer', fontSize: '13px' }}>View Resume</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rating Criteria */}
                        <div style={cardStyle}>
                            <h3 style={sectionTitleStyle}>Rating Criteria</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                                <div>
                                    <RatingItem label="Technical Skills" percentage={70} />
                                    <RatingItem label="Communication" percentage={80} />
                                    <RatingItem label="Problem Solving" percentage={90} />
                                </div>
                                <div>
                                    <RatingItem label="Culture Fit" percentage={60} />
                                    <RatingItem label="Overall Score" percentage={80} />
                                </div>
                            </div>
                        </div>

                        {/* Interview Notes */}
                        <div style={cardStyle}>
                            <h3 style={sectionTitleStyle}>Interview Notes</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                                <div>
                                    <span style={{ ...labelStyle, fontSize: '14px', marginBottom: '8px', display: 'block', color: '#111827', fontWeight: 500 }}>Strengths</span>
                                    <textarea style={textareaStyle} placeholder="Excellent grasp of core concepts, clear communication..." />
                                </div>
                                <div>
                                    <span style={{ ...labelStyle, fontSize: '14px', marginBottom: '8px', display: 'block', color: '#111827', fontWeight: 500 }}>Weaknesses</span>
                                    <textarea style={textareaStyle} placeholder="Lacked depth in system design, could be more concise..." />
                                </div>
                                <div>
                                    <span style={{ ...labelStyle, fontSize: '14px', marginBottom: '8px', display: 'block', color: '#111827', fontWeight: 500 }}>Final Comments</span>
                                    <textarea style={textareaStyle} placeholder="Overall summary and recommendation..." />
                                </div>
                            </div>
                        </div>

                        {/* Select Outcome */}
                        <div style={{ ...cardStyle, width: '400px', marginBottom: 0 }}>
                            <h3 style={sectionTitleStyle}>Select Outcome</h3>
                            <div style={{ display: 'flex', gap: '24px' }}>
                                {['Selected', 'On Hold', 'Rejected'].map((option) => (
                                    <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <div 
                                            onClick={() => {
                                                setOutcome(option);
                                                if (option === 'Selected' || option === 'On Hold') setShowOutcomeModal(true);
                                            }}
                                            style={{ 
                                                width: '20px', 
                                                height: '20px', 
                                                borderRadius: '50%', 
                                                border: `2px solid ${outcome === option ? '#101828' : '#D0D5DD'}`, 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                transition: 'all 0.2s',
                                                backgroundColor: '#FFF'
                                            }}
                                        >
                                            {outcome === option && <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#101828' }} />}
                                        </div>
                                        <span style={{ fontSize: '14px', color: '#111827', fontWeight: 500 }}>{option}</span>
                                    </label>
                                ))}
                            </div>
                    </div>
                </div>

                {showOutcomeModal && <CandidateOutcomeModal />}
            </div>
        </div>
    );
};

export default InterviewResult;
