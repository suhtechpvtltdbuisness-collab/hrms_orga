import React from 'react';

const OrgNode = ({ name, role, isHead }) => (
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
        </div>
    </div>
);

const DesignationOrgStructure = () => {
    return (
        <div className="flex-1 min-h-0 overflow-auto custom-scrollbar pr-4 pl-4 pb-4">
            <h2 className="text-[20px] font-semibold text-[#000000]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
              Structure
            </h2>
            <div className="bg-white rounded-[4px] p-6 overflow-x-auto w-full">
            
            <div className="flex flex-col items-center min-w-fit mx-auto [zoom:0.5] md:[zoom:0.6] lg:[zoom:1] ">
                {/* Level 1: Head */}
                <div className="relative flex flex-col items-center mb-10 font-medium text-[16px]">

                    <OrgNode name="Alice John" role="Manager" isHead={true} />
                    {/* Vertical Line from Head */}
                    <div className="h-13 w-px bg-[#CFCFCF]"></div>
                </div>
                {/* Level 2 Connector: Horizontal Line */}
                <div className="flex justify-center gap-x-2 md:gap-x-5 lg:gap-x-8 relative ">
                    {/* Horizontal bar connecting left and right branches */}
                    <div className="absolute -top-10 left-[292px] right-[292px] h-px bg-[#CFCFCF]"></div>
                    {/* Left Branch */}
                    <div className="flex flex-col items-center relative">
                        {/* Vertical line up to horizontal bar */}
                        <div className="h-11 w-px bg-[#CFCFCF] absolute -top-10"></div>

                        <OrgNode name="Michael Smith" role="Senior Engineer" />

                        {/* Vertical Line down to next level */}
                        <div className="h-8 w-px bg-[#CFCFCF] z-0"></div>

                       {/* Level 3: Left (Now has 2 children: Manisha and John) */}
                         <div className="relative flex justify-center gap-x-6 pt-8">
                            {/* Horizontal Line for siblings */}
                            <div className="absolute top-0 left-[180px] right-[180px] h-px bg-[#CFCFCF] hidden"></div> 
                            
                             {/* Connector logic for Michael's children */}
                             <div className="absolute top-0 left-[24%] right-[24%] h-px bg-[#CFCFCF] mt-0 "></div>

                            <div className="flex flex-col items-center relative">
                                <div className="h-8 w-px bg-[#CFCFCF] absolute -top-8"></div>
                                <OrgNode name="Manisha Gupta" role="Engineer" />
                            </div>
                            <div className="flex flex-col items-center relative">
                                <div className="h-8 w-px bg-[#CFCFCF] absolute -top-8"></div>
                                <OrgNode name="John Smith" role="Junior Engineer" />
                            </div>

                         </div>
                    </div>

                    {/* Right Branch */}
                    <div className="flex flex-col items-center relative" style={{ minWidth: '584px' }}>
                        {/* Vertical line up to horizontal bar */}
                         <div className="h-11 w-px bg-[#CFCFCF] absolute -top-10"></div>

                        <OrgNode name="Nisha Gupta" role="Senior Designer" />

                        {/* Vertical Line down to next level */}
                        <div className="h-16 w-px bg-[#CFCFCF]"></div>
                        
                         {/* Level 3: Right (Now has 1 child: Mike Miller) */}
                        <div className="flex flex-col items-center relative">
                             {/* No horizontal connector needed for single child */}
                            <OrgNode name="Mike Miller" role="UI/UX Designer" />
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
    );
};

export default DesignationOrgStructure;
