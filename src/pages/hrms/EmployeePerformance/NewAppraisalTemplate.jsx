import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { appraisalTemplateService } from '../../../service';

const NewAppraisalTemplate = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('id');

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [goals, setGoals] = useState([
        { id: 1, srNo: '01', kra: '', weightage: '' },
    ]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(Boolean(editId));
    const [error, setError] = useState('');

    useEffect(() => {
        if (!editId) return;
        const load = async () => {
            setLoading(true);
            const res = await appraisalTemplateService.getTemplateById(editId);
            if (res.success && res.data) {
                setTitle(res.data.title || '');
                setDescription(res.data.description || '');
                setGoals(
                    (res.data.goals || []).map((g, index) => ({
                        id: g.id || index + 1,
                        srNo: g.srNo || String(index + 1).padStart(2, '0'),
                        kra: g.kra || '',
                        weightage: String(g.weightage ?? ''),
                    })),
                );
            } else {
                setError(res.message || 'Failed to load template');
            }
            setLoading(false);
        };
        load();
    }, [editId]);

    const handleAddRow = () => {
        const newId = goals.length > 0 ? Math.max(...goals.map((g) => g.id)) + 1 : 1;
        setGoals([
            ...goals,
            {
                id: newId,
                srNo: String(goals.length + 1).padStart(2, '0'),
                kra: '',
                weightage: '',
            },
        ]);
    };

    const handleGoalChange = (id, field, value) => {
        setGoals(goals.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRows(goals.map((item) => item.id));
        } else {
            setSelectedRows([]);
        }
    };

    const handleSelectRow = (id) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
        );
    };

    const handleSave = async () => {
        if (!title.trim()) {
            setError('Appraisal template title is required');
            return;
        }
        setSaving(true);
        setError('');
        const payload = {
            title: title.trim(),
            description,
            goals: goals
                .filter((g) => g.kra?.trim())
                .map((g, index) => ({
                    srNo: String(index + 1).padStart(2, '0'),
                    kra: g.kra.trim(),
                    weightage: String(g.weightage || '0').replace(/,/g, ''),
                })),
        };

        const res = editId
            ? await appraisalTemplateService.updateTemplate(editId, payload)
            : await appraisalTemplateService.createTemplate(payload);

        setSaving(false);
        if (res.success) {
            navigate('/hrms/appraisal-template');
        } else {
            setError(res.message || 'Failed to save template');
        }
    };

    if (loading) {
        return (
            <div className="bg-white px-4 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex items-center justify-center text-[#757575]">
                Loading...
            </div>
        );
    }

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-6 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-10rem)] flex flex-col font-inter" style={{ fontFamily: 'Inter, sans-serif' }}>
            
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 shrink-0" style={{ fontFamily: 'Mulish, sans-serif' }}>
                <img 
                    src="/images/arrow_left_alt.svg" 
                    alt="Back" 
                    className="w-3 h-3 cursor-pointer hover:scale-110 transition-transform" 
                    onClick={() => navigate('/hrms/appraisal-template')}
                />
                 <span 
                    className='cursor-pointer text-[#7D1EDB]'
                    onClick={() => navigate('/hrms/appraisal-template')}
                >
                    Appraisal Template
                </span> 
                <ChevronRight size={14}/> 
                <span className="text-[#6B7280]">{editId ? 'Edit Appraisal Template' : 'New Appraisal Template'}</span>
            </div>

            <div className="flex justify-between items-center mb-6 shrink-0">
                <h1 className="text-[20px] font-semibold text-[#494949]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                    {editId ? 'Edit Appraisal Template' : 'New Appraisal Template'}
                </h1>
                
                <button
                    disabled={saving}
                    className="flex items-center justify-center gap-2 rounded-full py-2 px-3 text-white font-normal hover:bg-purple-700 transition-colors bg-[#7D1EDB] disabled:opacity-60"
                    onClick={handleSave}
                >
                    <span className='text-[16px] font-normal text-white' style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {saving ? 'Saving...' : 'Save'}
                    </span>
                </button>
            </div>

            {error && <div className="mb-3 text-sm text-red-500 shrink-0">{error}</div>}

            <div className="flex-1 overflow-y-auto pr-2">
                <div className="border border-[#E0E0E0] rounded-lg p-4 mb-2">
                    <div className="mb-4">
                        <label className="block text-sm font-normal text-[#1E1E1E] mb-2">Appraisal Template Title</label>
                        <input 
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full sm:w-[320px] border border-[#E0E0E0] rounded-lg px-4 py-2.5 text-sm text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-normal text-[#1E1E1E] mb-2">Description</label>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-[#E0E0E0] rounded-lg px-4 py-3 text-sm text-[#1E1E1E] focus:outline-none focus:border-[#7D1EDB] min-h-[120px] resize-none"
                        />
                    </div>
                </div>

                <h3 className="text-[16px] font-medium text-[#1E1E1E] mb-4" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>Goals</h3>
                
                <div className="border border-[#E0E0E0] rounded-lg overflow-hidden mb-4">
                    <table className="w-full border-collapse">
                        <thead style={{ fontFamily: 'Poppins, sans-serif' }}>
                            <tr className="border-b border-[#E0E0E0]">
                                <th className="py-3 px-6 w-[50px] text-center">
                                    <div className="flex items-center justify-center h-full">
                                      <div className="relative flex items-center justify-center w-5 h-5 border-2 border-black rounded-[4px]">
                                          <input 
                                              type="checkbox" 
                                              checked={goals.length > 0 && selectedRows.length === goals.length}
                                              onChange={handleSelectAll}
                                              className="peer appearance-none w-full h-full cursor-pointer absolute inset-0 z-10 opacity-0"
                                          />
                                          {goals.length > 0 && selectedRows.length === goals.length && (
                                              <svg className="w-3 h-3 text-black pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                              </svg>
                                          )}
                                      </div>
                                    </div>
                                </th>
                                <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 text-center">Sr No.</th>
                                <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 text-center">KRA</th>
                                <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 text-center">Weightage(%)</th>
                                <th className="py-3 px-6 text-[14px] font-normal text-[#757575] opacity-80 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
                            {goals.map((row, index) => (
                                <tr key={row.id} className="last:border-b-0 hover:bg-gray-50">
                                    <td className="py-3 px-6 text-center">
                                        <div className="flex items-center justify-center h-full">
                                            <div className="relative flex items-center justify-center w-5 h-5 border-2 border-black rounded-[4px]">
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedRows.includes(row.id)}
                                                    onChange={() => handleSelectRow(row.id)}
                                                    className="peer appearance-none w-full h-full cursor-pointer absolute inset-0 z-10 opacity-0"
                                                />
                                                {selectedRows.includes(row.id) && (
                                                    <svg className="w-3 h-3 text-black pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-6 text-center text-sm font-medium text-[#1E1E1E]">
                                        {String(index + 1).padStart(2, '0')}
                                    </td>
                                    <td className="py-3 px-6 text-center">
                                        <input 
                                            type="text"
                                            value={row.kra}
                                            onChange={(e) => handleGoalChange(row.id, 'kra', e.target.value)}
                                            className="w-full text-center text-sm font-medium text-[#1E1E1E] bg-transparent focus:outline-none"
                                        />
                                    </td>
                                    <td className="py-3 px-6 text-center">
                                        <input 
                                            type="text"
                                            value={row.weightage}
                                            onChange={(e) => handleGoalChange(row.id, 'weightage', e.target.value)}
                                            className="w-full text-center text-sm font-medium text-[#1E1E1E] bg-transparent focus:outline-none"
                                        />
                                    </td>
                                    <td className="py-3 px-6 text-center">
                                        <button 
                                            className="hover:scale-110 transition-transform"
                                            type="button"
                                        >
                                            <img src="/pencil.svg" alt="Edit" className="w-[18px] h-[18px]" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <button 
                    onClick={handleAddRow}
                    className="px-3 py-2 rounded-full border border-[#7D1EDB] text-[#7D1EDB] text-sm font-medium hover:bg-purple-50 transition-colors"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                    Add Row
                </button>
            </div>
        </div>
    );
};

export default NewAppraisalTemplate;
