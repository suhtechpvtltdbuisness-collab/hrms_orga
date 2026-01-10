import ChevronUpIcon from '../../../assets/icons/chevron-up.png'
import ChevronDownIcon from '../../../assets/icons/chevron-down.png';

const SettingsAccordion = ({ title, open, onClick, children }) => {
    return (
        <div>
            {/* Accordion Header */}
            <div className={`rounded-lg border border-[#CBCBCB] transition-colors hover:border-gray-400 ${open ? 'bg-white' : 'bg-[#F5F5F5]'
                }`}>
                <button
                    onClick={onClick}
                    className="w-full flex items-center justify-between text-left transition-colors pt-[5px] pb-[5px] pl-[6px] pr-[6px]"
                >
                    <span className="text-base font-normal text-gray-800">{title}</span>
                    <img
                        src={open ? ChevronUpIcon : ChevronDownIcon}
                        alt={open ? "Collapse" : "Expand"}
                        className="transition-all duration-200 w-[16px] h-[8px]"
                    />
                </button>
            </div>

            {/* Expanded Content - Outside the container */}
            {open && (
                <div className="mt-3 px-6 py-6 bg-white rounded-lg">
                    {children}
                </div>
            )}
        </div>
    );
};

export default SettingsAccordion;
