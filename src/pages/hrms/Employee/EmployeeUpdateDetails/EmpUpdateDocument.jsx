import React, { useState, useRef } from 'react';
import { ChevronDown, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import FilterDropdown from '../../../../components/ui/FilterDropdown';

const DocumentCard = ({ title, showView = true, onView, hasDocument }) => {
    return (
        <div className="flex items-center justify-between p-4 bg-white border border-[#D9D9D9] rounded-lg h-[62px]">
            <span
                className="text-[#1E1E1E] font-['Nunito_Sans']"
                style={{
                    fontFamily: '"Nunito Sans", sans-serif',
                    fontWeight: 600,
                    fontSize: '15px',
                    lineHeight: '100%',
                    letterSpacing: '0%'
                }}
            >
                {title}
            </span>
            {showView && (
                <button
                    onClick={onView}
                    className="flex items-center justify-center bg-[#EBD6FF] text-[#7D1EDB] text-sm font-medium hover:bg-purple-300 transition-colors"
                    style={{
                        width: '58px',
                        height: '28px',
                        borderRadius: '3px',
                        padding: '3px 10px',
                        gap: '10px'
                    }}
                >
                    View
                </button>
            )}
        </div>
    );
};

const UploadCard = ({ onUpload }) => {
    const fileInputRef = useRef(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            onUpload(file);
        }
    };

    return (
        <div className="flex items-center justify-between p-4 bg-white border border-[#D9D9D9] rounded-lg h-[62px]">
            <span
                className="text-[#1E1E1E] font-['Nunito_Sans']"
                style={{
                    fontFamily: '"Nunito Sans", sans-serif',
                    fontWeight: 600,
                    fontSize: '15px',
                    lineHeight: '100%',
                    letterSpacing: '0%'
                }}
            >
                Upload new
            </span>
            <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <button
                onClick={handleUploadClick}
                className="flex items-center justify-center border border-[#7D1EDB] text-[#7D1EDB] hover:bg-purple-50 transition-colors"
                style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '8px',
                    padding: '3px 10px',
                    gap: '10px'
                }}
            >
                <Upload size={24} />
            </button>
        </div>
    );
};

const DocumentSection = ({ title, documents, onView, onUpload }) => {
    return (
        <div className="flex flex-col gap-4 mb-2">
            <h3 className="text-base font-normal text-[#1E1E1E] font-['Nunito_Sans']" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>{title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {documents.map((doc, index) => (
                    <DocumentCard
                        key={index}
                        title={doc}
                        onView={() => onView(doc)}
                    />
                ))}
                <UploadCard onUpload={(file) => onUpload(title, file)} />
            </div>
        </div>
    );
};

const EmpUpdateDocument = () => {
    const [uploadedDocuments, setUploadedDocuments] = useState({});
    const [selectedCategory, setSelectedCategory] = useState("All Documents");

    const allSections = [
        {
            title: "Identity Documents",
            documents: ['Aadhar Card', 'PAN Card', 'Passport']
        },
        {
            title: "Employment Documents",
            documents: ['Offer Letter', 'Appointment Letter', 'Employee contract']
        },
        {
            title: "Payroll And Compliance",
            documents: ['Form 16', 'PDF Declaration']
        },
        {
            title: "Education And Certifications",
            documents: ['Resume', 'Professional Certificates', 'Degree Certificate', 'PG Certificate']
        }
    ];

    const filterOptions = ["All Documents", ...allSections.map(s => s.title)];

    const filteredSections = selectedCategory === "All Documents" || !selectedCategory
        ? allSections
        : allSections.filter(section => section.title === selectedCategory);


    const handleView = (documentName) => {
        toast.success(`Viewing: ${documentName}`, {
            duration: 3000,
            position: 'top-right',
        });
    };

    const handleUpload = (category, file) => {
        console.log(`Uploading ${file.name} to ${category}`);

        // Store the uploaded file
        setUploadedDocuments(prev => ({
            ...prev,
            [category]: [...(prev[category] || []), file]
        }));

        // Show success message
        toast.success(`Successfully uploaded: ${file.name}`, {
            duration: 4000,
            position: 'top-right',
        });
    };

    return (
        <div className="h-full">
            {/* Filter Button */}
            <div className="flex">
                <FilterDropdown
                    placeholder="All Documents"
                    options={filterOptions}
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    className="flex items-center justify-between bg-white border border-[#C2C2C2] text-[#1E1E1E] font-['Poppins'] text-[15px] rounded-[13px] px-[12px] py-[5px] h-[34px] min-w-[156px] cursor-pointer"
                    buttonTextClassName="whitespace-nowrap"
                />
            </div>

            {/* Main Content */}
            <div className="mt-[24px] flex flex-col gap-[8px] text-[16px] font-semibold">
                
                {filteredSections.map((section, index) => (
                    <DocumentSection
                        key={index}
                        title={section.title}
                        documents={section.documents}
                        onView={handleView}
                        onUpload={handleUpload}
                    />
                ))}

                 {(selectedCategory === "All Documents" || selectedCategory === "Other Documents") && (
                    <div className="flex flex-col gap-4 mb-2">
                        <h3 className="text-base font-normal text-[#1E1E1E] font-['Nunito_Sans']" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Other Documents</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                            <UploadCard onUpload={(file) => handleUpload('Other Documents', file)} />
                        </div>
                    </div>
                 )}

            </div>
        </div>
    );
};

export default EmpUpdateDocument;
