import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const FilterDropdown = ({ label, options, value, onChange, minWidth = '150px', className, placeholder, buttonTextClassName, disabled = false, maxHeight = '320px' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue) => {
        if (disabled) return;
        onChange(optionValue);
        setIsOpen(false);
    };

    const getDisplayValue = () => {
        if (!value) return placeholder || label;
        const selectedOption = options.find(opt => 
            (typeof opt === 'object' ? opt.value === value : opt === value)
        );
        return selectedOption 
            ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption)
            : value;
    };

    return (
        <div className={`relative ${className?.includes('w-full') ? 'w-full' : 'w-fit'}`} ref={dropdownRef}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`${className || "flex items-center justify-between px-4 py-3 bg-[#EEECFF] text-[#7D1EDB] rounded-[12px] text-sm font-normal outline-none hover:bg-purple-100 transition-colors"} ${disabled ? 'opacity-60 cursor-not-allowed hover:bg-[#EEECFF]' : ''}`}
                style={{ minWidth: className ? 'auto' : minWidth }}
            >
                <span className={!value && placeholder ? "text-gray-400" : (buttonTextClassName || "")}>
                    {getDisplayValue()}
                </span>
                <ChevronDown size={20} className={`transition-transform duration-200 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div
                    className="absolute top-full left-0 mt-2 bg-white z-20 flex flex-col font-light space-y-1"
                    style={{
                        width: '100%',
                        minWidth: className ? '100%' : minWidth,
                        borderRadius: '8px',
                        maxHeight: maxHeight,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        boxShadow: '0px 4px 14px 0px #0000001A',
                        fontFamily: 'Montserrat, sans-serif'
                    }}
                >
                    {!placeholder && (
                        <div
                            onClick={() => handleSelect('')}
                            className="px-4 flex items-center cursor-pointer hover:bg-purple-50 transition-colors"
                            style={{ minHeight: '44px', fontSize: '16px', color: '#333333' }}
                        >
                            All
                        </div>
                    )}
                    
                    {options.map((opt, idx) => {
                         const optionLabel = typeof opt === 'object' ? opt.label : opt;
                         const optionValue = typeof opt === 'object' ? opt.value : opt;
                         return (
                            <div
                                key={idx}
                                onClick={() => handleSelect(optionValue)}
                                className="px-4 py-2 flex items-center cursor-pointer hover:bg-purple-50 transition-colors"
                                style={{ minHeight: '44px', fontSize: '16px', color: '#333333', lineHeight: '1.2' }}
                            >
                                {optionLabel}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default FilterDropdown;
