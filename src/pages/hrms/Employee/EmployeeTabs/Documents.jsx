import React, { useState } from 'react';
import { ChevronDown, Upload } from 'lucide-react';
import FilterDropdown from '../../../../components/ui/FilterDropdown';

const DocumentCard = ({ title, showView = true }) => {
    return (
        <div className="flex items-center justify-between p-4 bg-white border border-[#D9D9D9] rounded-lg h-[62px]">
            <span className="text-[#1E1E1E] text-[15px] font-semibold font-['Nunito_Sans']" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>{title}</span>
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
            <span className="text-[#1E1E1E] text-[15px] font-semibold font-['Nunito_Sans']" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Upload new</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {documents.map((doc, index) => (
                    <DocumentCard key={index} title={doc} />
                ))}
                <UploadCard />
            </div>
        </div>
    );
};

const Documents = ({ employeeId, employeeName }) => {
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

    return (
        <div className="h-full">
            {/* Employee Info Banner */}
            {employeeId && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {employeeName?.charAt(0)?.toUpperCase() || 'E'}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">{employeeName}</p>
                            <p className="text-xs text-gray-600">Employee ID: {employeeId}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Filter Button */}
            <div className="flex">
                <FilterDropdown
                    placeholder="All Documents"
                    options={filterOptions}
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    className="flex items-center justify-between bg-white border border-[#C2C2C2] text-[#1E1E1E] font-['Poppins'] text-[15px] rounded-[13px] px-[12px] py-[5px] h-[36px] min-w-[156px] cursor-pointer"
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
                    />
                ))}
                 {(selectedCategory === "All Documents" || selectedCategory === "Other Documents") && (
                    <div className="flex flex-col gap-4 mb-2">
                         <h3 className="text-base font-normal text-[#1E1E1E] font-['Nunito_Sans']" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Other Documents</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <UploadCard />
                        </div>
                    </div>
                 )}

            </div>
        </div>
    );
};

export default Documents;
