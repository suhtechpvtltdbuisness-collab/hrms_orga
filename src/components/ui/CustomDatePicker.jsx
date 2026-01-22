import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CustomDatePicker = ({ value, onChange, placeholder = "Select date", className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const dropdownRef = useRef(null);
  const [position, setPosition] = useState('bottom');

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
        const rect = dropdownRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const dropdownHeight = 350; // Estimated height
        
        // Only flip to top if there isn't enough space below AND there IS enough space above
        if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
            setPosition('top');
        } else {
            setPosition('bottom');
        }
    }
  }, [isOpen]);

  // Initialize selectedDate from props
  useEffect(() => {
    if (value) {
      let date;
      // Handle DD/MM/YYYY format
      if (typeof value === 'string' && value.includes('/')) {
         const parts = value.split('/');
         if (parts.length === 3) date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      } else {
         date = new Date(value);
      }

      if (date && !isNaN(date.getTime())) {
        setSelectedDate(date);
        setViewDate(date);
      }
    } else {
        setSelectedDate(null);
    }
  }, [value]);

  const toggleCalendar = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
    // Reset view date to selected or today when opening
    if (!isOpen) {
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
    if (value) {
         // Re-parse value to reset state
         if (typeof value === 'string' && value.includes('/')) {
             const parts = value.split('/');
             if (parts.length === 3) setSelectedDate(new Date(`${parts[2]}-${parts[1]}-${parts[0]}`));
         } else {
             setSelectedDate(new Date(value));
         }
    }
    else setSelectedDate(null);
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

    // Empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="w-7 h-7" />);
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const isSelected = selectedDate && 
            date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear();
        
        const isToday = new Date().toDateString() === date.toDateString();

        days.push(
            <div
                key={day}
                onClick={() => handleDayClick(day)}
                className={`w-7 h-7 flex items-center justify-center rounded-full text-sm cursor-pointer transition-colors
                    ${isSelected 
                        ? 'bg-[#6750A4] text-white font-medium' 
                        : isToday 
                            ? 'bg-transparent text-[#6750A4] border border-[#6750A4]' 
                            : 'hover:bg-purple-50 text-[#1E1E1E]'
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

  const monthYearString = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

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
      <div className="relative cursor-pointer" onClick={toggleCalendar}>
        <input
            type="text"
            readOnly
            value={value || ''}
            placeholder={placeholder}
            className={`w-full px-4 py-2 rounded-lg text-[#1E1E1E] outline-none focus:ring-1 focus:ring-purple-500 bg-[#F2F2F7] border border-[#D9D9D9] cursor-pointer ${className || ''}`}
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
        <div className={`absolute left-0 z-50 bg-white border border-[#D0D0D0] mt-1 rounded-[20px] overflow-hidden w-[230px] shadow-lg ${position === 'bottom' ? 'top-full mb-2' : 'bottom-full mt-2'}`}>
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
                {/* Month Navigation */}
                 <div className="flex items-center justify-between px-1 mb-2">
                     <div className="flex items-center gap-1">
                         <span className="text-[#49454F] text-sm font-medium">{monthYearString}</span>
                     </div>
                     <div className="flex gap-2">
                         <button onClick={() => changeMonth(-1)} className="text-[#49454F] hover:bg-[#F5F5F5] rounded-full p-1">
                             <ChevronLeft size={20} />
                         </button>
                         <button onClick={() => changeMonth(1)} className="text-[#49454F] hover:bg-[#F5F5F5] rounded-full p-1">
                             <ChevronRight size={20} />
                         </button>
                     </div>
                 </div>

                 {/* Days Grid */}
                 <div className="grid grid-cols-7 gap-y-1 mb-2 text-center justify-items-center">
                     {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                         <div key={d} className="text-[#49454F] text-xs font-medium w-7 h-7 flex items-center justify-center">{d}</div>
                     ))}
                     {renderDays()}
                 </div>

                 {/* Footer Buttons */}
                 <div className="flex justify-between items-center px-1 mt-1">
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
            </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;


