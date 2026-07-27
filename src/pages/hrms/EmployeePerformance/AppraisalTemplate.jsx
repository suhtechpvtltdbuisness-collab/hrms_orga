import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Plus } from 'lucide-react';
import { appraisalTemplateService } from '../../../service';

const AppraisalTemplate = () => {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadTemplates = async () => {
        setLoading(true);
        setError('');
        const res = await appraisalTemplateService.getTemplates({ page: 1, limit: 100 });
        if (res.success) {
            setTemplates(res.data?.templates || []);
        } else {
            setError(res.message || 'Failed to load templates');
            setTemplates([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadTemplates();
    }, []);

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col font-inter" style={{ fontFamily: 'Inter, sans-serif' }}>
            
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 shrink-0">
                <img 
                    src="/images/arrow_left_alt.svg" 
                    alt="Back" 
                    className="w-3 h-3 cursor-pointer hover:scale-110 transition-transform" 
                    onClick={() => navigate('/hrms')}
                />
                <span 
                    className='cursor-pointer text-[#7D1EDB]'
                    onClick={() => navigate('/hrms')}
                >
                    HRMS Dashboard
                </span> 
                <ChevronRight size={14}/> 
                <span className="text-[#6B7280]">Appraisal Template</span>
            </div>

            <div className="flex justify-between items-center mb-6 shrink-0">
                <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Appraisal Template</h1>

                <button
                    className="flex items-center justify-center gap-2 rounded-full py-3 px-4 text-white font-medium hover:bg-purple-700 transition-colors bg-[#7D1EDB]"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                    onClick={() => navigate('/hrms/appraisal-template/new')}
                >
                    <span className='text-[16px] font-normal text-white'>Add Appraisal Template</span>
                    <Plus size={18} />
                </button>
            </div>

            {error && (
                <div className="mb-4 text-sm text-red-500 shrink-0">{error}</div>
            )}

            {loading ? (
                <div className="flex-1 flex items-center justify-center text-[#757575]">Loading...</div>
            ) : templates.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto min-h-0 w-full">
                    <div className="flex flex-col items-center justify-center text-center py-4">
                        <img 
                            src="/images/emptyAttendance.png" 
                            alt="No Appraisal Templates" 
                            className="mb-6 w-[280px] md:w-[320px]" 
                        />
                        <h3 className="text-[16px] font-semibold text-[#757575] mb-4" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>You haven't created appraisal template yet</h3>
                        
                        <button
                            className="flex items-center justify-center px-4 py-3 bg-[#7D1EDB] text-white rounded-full font-medium hover:bg-purple-700 transition-all shadow-sm"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                            onClick={() => navigate('/hrms/appraisal-template/new')}
                        >
                            Create appraisal template
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {templates.map(template => (
                            <div key={template.id} className="border border-[#E0E0E0] rounded-xl p-5 flex flex-col hover:shadow-md transition-shadow bg-white pb-6 relative group overflow-hidden min-h-[220px]">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-[18px] font-semibold text-[#1E1E1E]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>{template.title}</h3>
                                </div>
                                <p className="text-[14px] text-[#757575] mb-6 flex-1 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', fontFamily: '"Nunito Sans", sans-serif'}}>{template.description}</p>
                                
                                <div className="flex justify-between items-center mt-auto pt-4 border-t border-[#F0F0F0]">
                                   <div className="text-[13px] text-[#7D1EDB] bg-purple-50 rounded-full px-3 py-1 font-medium border border-purple-100 flex items-center gap-1">
                                       <span className="w-1.5 h-1.5 rounded-full bg-[#7D1EDB]"></span>
                                       {template.goals?.length || 0} Goals
                                   </div>
                                    <button 
                                        className="text-[#7D1EDB] hover:text-purple-700 font-medium text-[14px] flex items-center transition-colors"
                                        style={{ fontFamily: '"Nunito Sans", sans-serif' }}
                                        onClick={() => navigate(`/hrms/appraisal-template/new?id=${template.id}`)}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppraisalTemplate;
