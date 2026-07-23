import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Download, FileText, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import CustomDatePicker from '../../../../components/ui/CustomDatePicker';
import { attendanceService, attendanceUtils } from '../../../../service';

const todayDisplay = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
};

const downloadBlob = (blob, fileName) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
};

const UploadAttendance = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [fromDate, setFromDate] = useState(todayDisplay());
    const [toDate, setToDate] = useState(todayDisplay());
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);
    const [importResult, setImportResult] = useState(null);

    const allowedExtensions = ['csv', 'xls', 'xlsx'];

    const handleFileSelect = (file) => {
        if (!file) return;

        const extension = file.name.split('.').pop()?.toLowerCase();
        if (!allowedExtensions.includes(extension)) {
            toast.error('Please upload a CSV, XLS, or XLSX file.');
            return;
        }

        setSelectedFile(file);
        setImportResult(null);
    };

    const handleInputChange = (event) => {
        handleFileSelect(event.target.files?.[0]);
        event.target.value = '';
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFileSelect(event.dataTransfer.files?.[0]);
    };

    const handleDownloadTemplate = async () => {
        const apiFrom = attendanceUtils.toApiDate(fromDate);
        const apiTo = attendanceUtils.toApiDate(toDate);

        if (!apiFrom || !apiTo) {
            toast.error('Please select a valid from and to date.');
            return;
        }
        if (apiFrom > apiTo) {
            toast.error('From date cannot be after to date.');
            return;
        }

        setIsDownloadingTemplate(true);
        const result = await attendanceService.downloadAttendanceTemplate({
            fromDate: apiFrom,
            toDate: apiTo,
        });
        setIsDownloadingTemplate(false);

        if (!result.success) {
            toast.error(result.message || 'Failed to download template.');
            return;
        }

        downloadBlob(result.blob, result.fileName);
        toast.success('Template downloaded.');
    };

    const handleDownloadErrorLog = () => {
        const csv = importResult?.errorLogCsv;
        if (!csv) {
            toast.error('No error log available.');
            return;
        }
        downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), 'attendance-import-errors.csv');
    };

    const handleSave = async () => {
        if (!selectedFile) {
            toast.error('Please select an attendance file first.');
            return;
        }

        setIsImporting(true);
        setImportResult(null);
        const result = await attendanceService.importAttendance({
            file: selectedFile,
            fromDate: attendanceUtils.toApiDate(fromDate),
            toDate: attendanceUtils.toApiDate(toDate),
        });

        const summary = result.data || {};
        setImportResult({
            ok: Boolean(result.success && (summary.failedCount || 0) === 0),
            message: result.message,
            totalRecords: summary.totalRecords || 0,
            successCount: summary.successCount || 0,
            failedCount: summary.failedCount || 0,
            errorLogCsv: summary.errorLogCsv || '',
            errors: summary.errors || [],
        });

        if (result.success && (summary.failedCount || 0) === 0) {
            toast.success(result.message || 'Attendance imported successfully.');
            setSelectedFile(null);
        } else if (result.success && summary.successCount > 0) {
            toast.success(result.message || 'Imported with some errors.');
        } else {
            toast.error(result.message || 'Failed to import attendance.');
        }
        setIsImporting(false);
    };

    return (
        <div className="bg-white px-4 sm:px-4 md:px-6 py-4 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)] xl:h-[calc(100vh-11rem)] flex flex-col font-sans border border-[#D9D9D9]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 shrink-0" style={{ fontFamily: '"Mulish", sans-serif' }}>
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
                 <span className="text-[#6B7280]">Upload Attendance</span>
            </div>

            <div className="flex justify-between items-center mb-6 shrink-0">
                <h1 className="text-[20px] font-semibold text-[#1E1E1E]" style={{ fontFamily: 'Poppins, sans-serif' }}>Upload Attendance</h1>
                <button
                    onClick={handleSave}
                    disabled={isImporting || !selectedFile}
                    className="bg-[#7D1EDB] text-white px-4 py-2 rounded-full font-medium hover:bg-purple-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                    {isImporting ? <Loader2 size={16} className="animate-spin" /> : null}
                    {isImporting ? 'Uploading...' : 'Upload Attendance'}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                <div className="mb-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                    Download the template first, fill Employee ID, Date (DD-MM-YYYY), Check-In/Out, Status, then upload the file.
                </div>

                <div className="border border-[#D6D6D6] rounded-lg p-4 mb-3">
                    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="text-[16px] font-semibold text-[#1E1E1E]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Download Template</h3>
                        <button
                            type="button"
                            onClick={handleDownloadTemplate}
                            disabled={isDownloadingTemplate}
                            className="inline-flex items-center gap-2 rounded-full border border-[#7D1EDB] px-4 py-2 text-sm font-semibold text-[#7D1EDB] hover:bg-violet-50 disabled:opacity-60"
                        >
                            {isDownloadingTemplate ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                            {isDownloadingTemplate ? 'Preparing...' : 'Get Template'}
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 mb-1">
                        <div className="flex flex-col gap-2 w-full md:w-1/3">
                            <label className="text-[14px] font-normal text-[#1E1E1E]" style={{ fontFamily: 'Inter, sans-serif' }}>Attendance From Date</label>
                            <CustomDatePicker
                                value={fromDate}
                                onChange={setFromDate}
                                className="w-full bg-[#FFFFFF] border border-[#D9D9D9] rounded-[8px] px-4 py-2 text-[#1E1E1E] outline-none"
                            />
                        </div>

                         <div className="flex flex-col gap-2 w-full md:w-1/3">
                            <label className="text-[14px] font-normal text-[#1E1E1E]" style={{ fontFamily: 'Inter, sans-serif' }}>Attendance To Date</label>
                            <CustomDatePicker
                                value={toDate}
                                onChange={setToDate}
                                className="w-full bg-[#FFFFFF] border border-[#D9D9D9] rounded-[8px] px-4 py-2 text-[#1E1E1E] outline-none"
                            />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500">Template includes employees for the selected date range. Status values: Present, Absent, Half Day, Leave, WFH, Holiday.</p>
                </div>

                <div className="border border-[#D6D6D6] rounded-lg p-4">
                    <h3 className="text-[16px] font-semibold text-[#1E1E1E] mb-2" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Import Attendance</h3>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.xls,.xlsx"
                        className="hidden"
                        onChange={handleInputChange}
                    />

                    <div
                        role="button"
                        tabIndex={0}
                        onClick={() => fileInputRef.current?.click()}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                fileInputRef.current?.click();
                            }
                        }}
                        onDragOver={(event) => {
                            event.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        className={`border border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors min-h-[160px] ${
                            isDragging
                                ? 'bg-purple-50 border-[#7D1EDB]'
                                : selectedFile
                                    ? 'bg-white border-[#7D1EDB]'
                                    : 'bg-[#F7F7F7] border-[#C5C5C5] hover:bg-gray-50'
                        }`}
                    >
                        <img
                            src="/images/uploadDoc.svg"
                            alt="Upload Document"
                            className="w-12 h-10 mb-4"
                        />
                        <h4 className="text-[16px] font-semibold text-[#1E1E1E] " style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                            {selectedFile ? 'File Selected' : 'Upload Document'}
                        </h4>
                        <p className="text-[12px] text-[#7D1EDB]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                            {selectedFile ? selectedFile.name : 'Drag & Drop Or Click To Browse (.xlsx / .csv)'}
                        </p>
                    </div>

                    {selectedFile && (
                        <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-[#D9D9D9] bg-white px-4 py-3">
                            <div className="flex min-w-0 items-center gap-2">
                                <FileText size={18} className="text-[#7D1EDB] shrink-0" />
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-[#1E1E1E]">{selectedFile.name}</p>
                                    <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedFile(null);
                                    setImportResult(null);
                                }}
                                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-red-500"
                                aria-label="Remove selected file"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    )}
                </div>

                {importResult && (
                    <div
                        className={`mt-3 rounded-lg border px-4 py-3 ${
                            importResult.ok
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                : importResult.successCount > 0
                                    ? 'border-amber-200 bg-amber-50 text-amber-900'
                                    : 'border-rose-200 bg-rose-50 text-rose-800'
                        }`}
                    >
                        <p className="font-semibold">
                            {importResult.ok ? 'Upload Successful' : importResult.successCount > 0 ? 'Upload Completed With Errors' : 'Upload Failed'}
                        </p>
                        <p className="mt-1 text-sm">
                            Total Records: {importResult.totalRecords} · Success: {importResult.successCount} · Failed: {importResult.failedCount}
                        </p>
                        {importResult.failedCount > 0 && (
                            <button
                                type="button"
                                onClick={handleDownloadErrorLog}
                                className="mt-2 text-sm font-semibold underline"
                            >
                                Download Error Log
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadAttendance;
