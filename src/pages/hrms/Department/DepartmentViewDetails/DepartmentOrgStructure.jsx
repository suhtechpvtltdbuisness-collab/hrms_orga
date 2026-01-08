import React from 'react';

const OrgNode = ({ name, role, isHead, footer }) => (
    <div className="flex flex-col items-center">
        <div className={`bg-white border rounded-lg flex flex-col relative z-10 mx-auto ${isHead ? 'border-[#CFCFCF] w-[250px]' : 'border-[#CFCFCF] w-[280px]'}`}>
            {/* Top Content */}
            <div className="p-2 flex items-center gap-4">
                <div className="w-13 h-13 mx-2 rounded-full bg-[#D9D9D9] shrink-0">
                    {/* Image placeholder */}
                </div>
                <div>
                    <p className="text-[#000000] text-[16px] font-normal leading-tight">{name}</p>
                    <p className="text-[#A8A8A8] text-[14px] leading-tight mt-2">{role}</p>
                </div>
            </div>

            {/* Footer Bar */}
            {footer && (
                <div className="border-t border-[#E0E0E0] py-1 text-center bg-white rounded-b-lg">
                    <p className="text-[#CFCFCF] text-[13px] font-medium">{footer}</p>
                </div>
            )}
        </div>
    </div>
);

const DepartmentOrgStructure = () => {
    return (
        <div className="flex-1 min-h-0 overflow-auto custom-scrollbar p-6 bg-white rounded-[4px] flex justify-center">
            <div className="flex flex-col items-center [zoom:0.7] md:[zoom:0.8] lg:[zoom:1] ">
                {/* Level 1: Head */}
                <div className="relative flex flex-col items-center mb-10 font-medium text-[16px]">

                    <OrgNode name="Alice John" role="Department Head" isHead={true} />
                    {/* Vertical Line from Head */}
                    <div className="h-13 w-px bg-[#CFCFCF]"></div>
                </div>
                {/* Level 2 Connector: Horizontal Line */}
                <div className="flex justify-center gap-x-30 md:gap-x-42 lg:gap-x-70 xl:gap-x-100 relative ">
                    {/* Horizontal bar connecting left and right branches */}
                    <div className="absolute -top-10 left-[140px] right-[140px] h-px bg-[#CFCFCF]"></div>
                    {/* Left Branch */}
                    <div className="flex flex-col items-center relative">
                        {/* Vertical line up to horizontal bar */}
                        <div className="h-11 w-px bg-[#CFCFCF] absolute -top-10"></div>

                        <OrgNode name="Team Lead 1" role="Michael Smith" footer="Team Lead" />

                        {/* Vertical Line down to next level */}
                        <div className="h-11 w-px bg-[#CFCFCF]"></div>

                        {/* Level 3 */}
                        <OrgNode name="Employee A" role="Manisha Gupta" footer="Marketing Analyst" />
                    </div>

                    {/* Right Branch */}
                    <div className="flex flex-col items-center relative">
                        {/* Vertical line up to horizontal bar */}
                        <div className="h-11 w-px bg-[#CFCFCF] absolute -top-10"></div>

                        <OrgNode name="Team Lead 2" role="Nisha Gupta" footer="Team Lead" />

                        {/* Vertical Line down to next level */}
                        <div className="h-11 w-px bg-[#CFCFCF]"></div>

                        {/* Level 3 */}
                        <OrgNode name="Employee A" role="Manisha Gupta" footer="Marketing Analyst" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepartmentOrgStructure;
