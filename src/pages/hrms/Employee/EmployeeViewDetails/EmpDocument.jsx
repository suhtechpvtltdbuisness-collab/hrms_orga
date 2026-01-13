import React, { useState } from 'react';
import { ChevronDown, Upload } from 'lucide-react';
import FilterDropdown from '../../../../components/ui/FilterDropdown';

const DocumentCard = ({ title, showView = true }) => {
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

const UploadCard = () => {
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
            <button
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

const DocumentSection = ({ title, documents }) => {
    return (
        <div className="flex flex-col gap-4 mb-2">
            <h3 className="text-base font-normal text-[#1E1E1E] font-['Nunito_Sans']" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>{title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {documents.map((doc, index) => (
                    <DocumentCard key={index} title={doc} />
                ))}
                <UploadCard />
            </div>
        </div>
    );
};

const EmpDocuments = () => {
    const [selectedCategory, setSelectedCategory] = useState("All Documents");

    const categories = [
        "All Documents",
        "Identity Documents",
        "Employment Documents",
        "Payroll And Compliance",
        "Education And Certifications",
        "Other Documents"
    ];

    return (
        <div className="h-full">
            {/* Filter Dropdown */}
            <div className="flex mb-[24px]">
                 <FilterDropdown
                    options={categories}
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    placeholder="All Documents"
                    className="flex items-center justify-between bg-white border border-[#C2C2C2] text-[#1E1E1E] font-['Poppins'] text-[15px] rounded-[13px] px-[12px] py-[5px] h-[34px] min-w-[156px] cursor-pointer"
                    buttonTextClassName="whitespace-nowrap"
                 />
            </div>

            {/* Main Content */}
            <div className="flex flex-col gap-[8px] text-[16px] font-semibold">

                {(selectedCategory === "All Documents" || selectedCategory === "Identity Documents") && (
                    <DocumentSection
                        title="Identity Documents"
                        documents={['Aadhar Card', 'PAN Card', 'Passport']}
                    />
                )}

                {(selectedCategory === "All Documents" || selectedCategory === "Employment Documents") && (
                    <DocumentSection
                        title="Employment Documents"
                        documents={['Offer Letter', 'Appointment Letter', 'Employee contract']}
                    />
                )}

                {(selectedCategory === "All Documents" || selectedCategory === "Payroll And Compliance") && (
                    <DocumentSection
                        title="Payroll And Compliance"
                        documents={['Form 16', 'PDF Declaration']}
                    />
                )}

                {(selectedCategory === "All Documents" || selectedCategory === "Education And Certifications") && (
                    <DocumentSection
                        title="Education And Certifications"
                        documents={['Resume', 'Professional Certificates', 'Degree Certificate', 'PG Certificate']}
                    />
                )}

                {/* Other Documents Section - Just Upload */}
                {(selectedCategory === "All Documents" || selectedCategory === "Other Documents") && (
                    <div className="flex flex-col gap-4 mb-2">
                        <h3 className="text-base font-normal text-[#1E1E1E] font-['Nunito_Sans']" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Other Documents</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                            <UploadCard />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmpDocuments;