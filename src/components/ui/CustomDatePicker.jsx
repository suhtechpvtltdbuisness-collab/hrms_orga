import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

const parseDateValue = (val) => {
    if (!val) return null;
    if (typeof val === 'string' && val.includes('/')) {
        const parts = val.split('/');
        if (parts.length === 3) {
            const date = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
            return isNaN(date.getTime()) ? null : date;
        }
    }
    const date = new Date(val);
    return isNaN(date.getTime()) ? null : date;
};

const startOfDay = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const CustomDatePicker = ({
    value,
    onChange,
    placeholder = "Select date",
    className,
    disabled = false,
    allowFuture = false,
    minDate = null,
    maxDate = null,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const dropdownRef = useRef(null);
    const [position, setPosition] = useState('bottom');
    const [currentView, setCurrentView] = useState('calendar'); // 'calendar', 'months', 'years'
    const yearsListRef = useRef(null);

    const minYear = minDate ? minDate.getFullYear() : 1900;
    const currentYear = new Date().getFullYear();
    let maxYear = currentYear;
    if (maxDate) {
        maxYear = maxDate.getFullYear();
    } else if (allowFuture) {
        maxYear = currentYear + 10;
    }
    const years = [];
    for (let y = maxYear; y >= minYear; y--) {
        years.push(y);
    }

    useEffect(() => {
        setPosition('bottom');
    }, [isOpen]);

    // Scroll active year into view
    useEffect(() => {
        if (currentView === 'years' && yearsListRef.current) {
            const activeBtn = yearsListRef.current.querySelector('[data-active="true"]');
            if (activeBtn) {
                activeBtn.scrollIntoView({ block: 'center', behavior: 'auto' });
            }
        }
    }, [currentView]);

    // Initialize selectedDate from props
    useEffect(() => {
        const date = parseDateValue(value);
        if (date) {
            setSelectedDate(date);
            setViewDate(date);
        } else {
            setSelectedDate(null);
        }
    }, [value]);

    const toggleCalendar = (e) => {
        e.stopPropagation();
        if (disabled) return;
        setIsOpen(!isOpen);
        // Reset view state when opening
        if (!isOpen) {
            setCurrentView('calendar');
            if (selectedDate) setViewDate(selectedDate);
            else setViewDate(new Date());
        }
    };

    const handleDayClick = (day) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        setSelectedDate(newDate);
    };

    const handleOk = () => {
        if (selectedDate) {
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            // Format as DD/MM/YYYY
            onChange(`${day}/${month}/${year}`);
        } else {
            onChange('');
        }
        setIsOpen(false);
    };

    const handleClear = () => {
        setSelectedDate(null);
    };

    const handleCancel = () => {
        setIsOpen(false);
        const date = parseDateValue(value);
        setSelectedDate(date);
    };

    const changeMonth = (offset) => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
    };

    // Helpers
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const renderDays = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const days = [];
        const today = startOfDay(new Date());
        const min = minDate ? startOfDay(minDate) : null;
        const max = maxDate ? startOfDay(maxDate) : null;

        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="w-7 h-7" />);
        }

        // Days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = startOfDay(new Date(year, month, day));

            const isSelected = selectedDate &&
                date.getDate() === selectedDate.getDate() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getFullYear() === selectedDate.getFullYear();

            const isToday = today.toDateString() === date.toDateString();
            const isFuture = !allowFuture && date > today;
            const isBeforeMin = min && date < min;
            const isAfterMax = max && date > max;
            const isDisabled = isFuture || isBeforeMin || isAfterMax;

            days.push(
                <div
                    key={day}
                    onClick={() => !isDisabled && handleDayClick(day)}
                    className={`w-7 h-7 flex items-center justify-center rounded-full text-sm transition-colors
                    ${isDisabled
                            ? 'text-gray-300 cursor-not-allowed'
                            : isSelected
                                ? 'bg-[#6750A4] text-white font-medium cursor-pointer'
                                : isToday
                                    ? 'bg-transparent text-[#6750A4] border border-[#6750A4] cursor-pointer'
                                    : 'hover:bg-purple-50 text-[#1E1E1E] cursor-pointer'
                        }`}
                >
                    {day}
                </div>
            );
        }
        return days;
    };

    // Header Date parts
    const headerDateString = selectedDate ? selectedDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    }) : 'Select date';

    // Close outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {/* Input Trigger */}
            <div className={`relative ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`} onClick={toggleCalendar}>
                <input
                    type="text"
                    readOnly
                    disabled={disabled}
                    value={value || ''}
                    placeholder={placeholder}
                    className={`w-full px-4 py-2 rounded-lg text-[#1E1E1E] outline-none focus:ring-1 focus:ring-purple-500 bg-white border border-[#D9D9D9] ${disabled ? 'cursor-not-allowed bg-gray-50 opacity-70' : 'cursor-pointer'} ${className || ''}`}
                    style={{ width: '100%' }}
                />
                <img
                    src="/images/calender.svg"
                    alt="calendar"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none w-5 h-5"
                />
            </div>

            {/* Popup */}
            {isOpen && (
                <div className={`absolute left-0 z-50 bg-white border border-[#D0D0D0] mt-1 rounded-[20px] overflow-hidden w-[260px] shadow-lg ${position === 'bottom' ? 'top-full mb-2' : 'bottom-full mt-2'}`}>
                    {/* Header */}
                    <div className="px-5 pt-4 pb-2 border-b border-[#CAC4D0]">
                        <p className="text-[#49454F] text-xs font-medium mb-1">Select date</p>
                        <div className="flex items-center justify-between">
                            <h2 className="text-[#1D1B20] text-xl font-medium">
                                {headerDateString}
                            </h2>
                        </div>
                    </div>

                    <div className="bg-white px-4 py-2">
                        {/* Month & Year Selectors Header */}
                        <div className="flex items-center justify-between px-1 mb-2">
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => setCurrentView(currentView === 'months' ? 'calendar' : 'months')}
                                    className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${
                                        currentView === 'months'
                                            ? 'bg-[#6750A4] text-white hover:bg-[#5a4490]'
                                            : 'bg-[#F4EFF4] hover:bg-[#EADDFF] text-[#1D1B20]'
                                    }`}
                                >
                                    <span>{months[viewDate.getMonth()]}</span>
                                    <ChevronDown size={14} className={`transform transition-transform ${currentView === 'months' ? 'rotate-180' : ''}`} />
                                </button>
                                <button
                                    onClick={() => setCurrentView(currentView === 'years' ? 'calendar' : 'years')}
                                    className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${
                                        currentView === 'years'
                                            ? 'bg-[#6750A4] text-white hover:bg-[#5a4490]'
                                            : 'bg-[#F4EFF4] hover:bg-[#EADDFF] text-[#1D1B20]'
                                    }`}
                                >
                                    <span>{viewDate.getFullYear()}</span>
                                    <ChevronDown size={14} className={`transform transition-transform ${currentView === 'years' ? 'rotate-180' : ''}`} />
                                </button>
                            </div>
                            
                            {currentView === 'calendar' && (
                                <div className="flex gap-1">
                                    <button onClick={() => changeMonth(-1)} className="text-[#49454F] hover:bg-[#F5F5F5] rounded-full p-1">
                                        <ChevronLeft size={18} />
                                    </button>
                                    <button onClick={() => changeMonth(1)} className="text-[#49454F] hover:bg-[#F5F5F5] rounded-full p-1">
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* View rendering */}
                        {currentView === 'calendar' && (
                            <>
                                {/* Days Grid */}
                                <div className="grid grid-cols-7 gap-y-1 mb-2 text-center justify-items-center">
                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, idx) => (
                                        <div key={idx} className="text-[#49454F] text-xs font-medium w-7 h-7 flex items-center justify-center">{d}</div>
                                    ))}
                                    {renderDays()}
                                </div>

                                {/* Footer Buttons */}
                                <div className="flex justify-between items-center px-1 mt-1 border-t border-gray-100 pt-2">
                                    <button onClick={handleClear} className="text-[#6750A4] text-xs font-medium hover:bg-[#F5F5F5] px-3 py-1 rounded-full transition-colors">
                                        Clear
                                    </button>
                                    <div className="flex gap-1">
                                        <button onClick={handleCancel} className="text-[#6750A4] text-xs font-medium hover:bg-[#F5F5F5] px-3 py-1 rounded-full transition-colors">
                                            Cancel
                                        </button>
                                        <button onClick={handleOk} className="text-[#6750A4] text-xs font-medium hover:bg-[#F5F5F5] px-3 py-1 rounded-full transition-colors">
                                            OK
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {currentView === 'months' && (
                            <div className="grid grid-cols-3 gap-2 py-3 text-center">
                                {months.map((m, idx) => (
                                    <button
                                        key={m}
                                        onClick={() => {
                                            setViewDate(new Date(viewDate.getFullYear(), idx, 1));
                                            setCurrentView('calendar');
                                        }}
                                        className={`py-2 text-xs rounded-lg transition-colors font-medium
                                            ${viewDate.getMonth() === idx
                                                ? 'bg-[#6750A4] text-white'
                                                : 'text-[#1D1B20] hover:bg-purple-50 bg-[#F4EFF4]'
                                            }`}
                                    >
                                        {m.slice(0, 3)}
                                    </button>
                                ))}
                            </div>
                        )}

                        {currentView === 'years' && (
                            <div ref={yearsListRef} className="h-[188px] overflow-y-auto pr-1 py-1 scrollbar-thin">
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    {years.map(y => (
                                        <button
                                            key={y}
                                            data-active={viewDate.getFullYear() === y}
                                            onClick={() => {
                                                setViewDate(new Date(y, viewDate.getMonth(), 1));
                                                setCurrentView('calendar');
                                            }}
                                            className={`py-2 text-xs rounded-lg transition-colors font-medium
                                                ${viewDate.getFullYear() === y
                                                    ? 'bg-[#6750A4] text-white'
                                                    : 'text-[#1D1B20] hover:bg-purple-50 bg-[#F4EFF4]'
                                                }`}
                                        >
                                            {y}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomDatePicker;
