import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Star } from "lucide-react";
import FilterDropdown from '../../../../components/ui/FilterDropdown';
import CustomDatePicker from '../../../../components/ui/CustomDatePicker';

/* Accordion */
const AccordionItem = ({ title, isOpen, onToggle, children }) => {
  return (
    <div>
      <div
        className={`border rounded-lg ${isOpen
          ? "bg-white border-[#E0E0E0]"
          : "bg-[#F5F5F5] border-[#CBCBCB]"
          }`}
      >
        <button
          onClick={onToggle}
          className="w-full px-6 h-[52px] flex justify-between items-center"
        >
          <span className="text-black" style={{ fontFamily: '"Nunito Sans", sans-serif', fontWeight: 600, fontSize: '15px', lineHeight: '100%', letterSpacing: '0%' }}>
            {title}
          </span>
          {isOpen ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
        </button>
      </div>

      {isOpen && <div className="pt-4">{children}</div>}
    </div>
  );
};


const InputField = ({ label, value, onChange, disabled }) => (
  <div>
    <label className="block text-[#757575] mb-1.5" style={{ fontFamily: '"Nunito Sans", sans-serif', fontWeight: 600, fontSize: '15px', lineHeight: '100%', letterSpacing: '0%' }}>
      {label}
    </label>
    <div className="relative">
      <input
        type="date"
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-3 border border-[#D9D9D9] rounded-lg bg-white text-black focus:outline-none focus:border-purple-500 ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        style={{
          fontFamily: '"Nunito Sans", sans-serif',
          fontWeight: 600,
          fontSize: '15px',
          lineHeight: '100%',
          letterSpacing: '0%'
        }}
      />
      {!disabled && (
        <img
          src="/images/calender.svg"
          alt="calendar"
          className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none w-5 h-5"
        />
      )}
      <style jsx>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          opacity: 0;
          position: absolute;
          right: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
      `}</style>
    </div>
  </div>
);

const SelectField = ({ label, value, onChange, options, disabled }) => (
  <div>
    <label className="block text-[#757575] mb-1.5" style={{ fontFamily: '"Nunito Sans", sans-serif', fontWeight: 600, fontSize: '15px', lineHeight: '100%', letterSpacing: '0%' }}>
      {label}
    </label>
    <div className="relative">
      {disabled ? (
        <div className="w-full px-4 border border-[#D9D9D9] rounded-lg bg-[#F5F5F5] text-gray-500 font-normal text-[15px] h-[44px] flex items-center">
            {value}
        </div>
      ) : (
        <FilterDropdown
            options={options}
            value={value}
            onChange={(val) => onChange(val)}
            placeholder={`Select status`}
            className="w-full px-4 py-3 border border-[#D9D9D9] rounded-lg bg-white text-black outline-none cursor-pointer flex items-center justify-between"
            minWidth="100%"
        />
      )}
    </div>
  </div>
);

/* Interactive Star Rating */
const StarRating = ({ rating, onRatingChange, readOnly = false }) => (
  <div>
    <label className="block text-[#757575] mb-1.5" style={{ fontFamily: '"Nunito Sans", sans-serif', fontWeight: 600, fontSize: '15px', lineHeight: '100%', letterSpacing: '0%' }}>
      {readOnly ? 'Overall Rating' : ''}
    </label>
    <div className="flex items-center" style={{ gap: '2.67px', height: '48px' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          width="26.67"
          height="25.33"
          className={`${!readOnly ? 'cursor-pointer transition-all hover:scale-110' : ''}`}
          fill={i <= rating ? "#FFD700" : "none"}
          stroke={i <= rating ? "#FFD700" : "#B3B3B3"}
          strokeWidth="1.6"
          onClick={() => !readOnly && onRatingChange && onRatingChange(i)}
        />
      ))}
    </div>
  </div>
);

/* Main Component */
const EmpUpdatePerformance = ({ formData, onChange }) => {
  const isControlled = !!(formData && onChange);
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);

  // Default values
  const defaultGoals = [
    { id: 1, goal: "Improve UI performance by 30%", progress: "80%", status: "On Track" },
    { id: 2, goal: "Lead the website revamp project", progress: "100%", status: "Completed" },
    { id: 3, goal: "Monitor 2 junior developers", progress: "50%", status: "In Progress" },
  ];

  const defaultCompetencies = [
    { id: 1, competency: "Technical Skills", rating: 4, comments: "Strong in react & dev UI" },
    { id: 2, competency: "Communication", rating: 4, comments: "Clear & Concise" },
    { id: 3, competency: "Teamwork", rating: 5, comments: "Excellent Collaboration" },
    { id: 4, competency: "Problem Solving", rating: 4, comments: "Good analytical approach" },
    { id: 5, competency: "Leadership", rating: 3, comments: "Improving" },
  ];

  // Helper maps
  const ratingToStatusMap = {
    5: "Excellent",
    4: "Good",
    3: "Average",
    2: "Below Average",
    1: "Poor"
  };

  
  const goals = isControlled && formData.goals ? formData.goals : defaultGoals;
  const competencies = isControlled && formData.competencies ? formData.competencies : defaultCompetencies;
  const lastReviewDate = isControlled ? (formData.lastReviewDate || "") : "";
  const performanceStatus = isControlled ? (formData.performanceStatus || "") : "";
  const overallRating = isControlled ? (formData.overallRating || 0) : 0;


  const calculateAverageRating = (newCompetencies) => {
    if (!newCompetencies || newCompetencies.length === 0) return 0;
    const sum = newCompetencies.reduce((acc, curr) => acc + (curr.rating || 0), 0);
    const avg = Math.round(sum / newCompetencies.length);
    return Math.max(1, Math.min(5, avg)); // Clamp between 1 and 5
  };

  const updateGoal = (id, field, value) => {
    const updatedGoals = goals.map(g => g.id === id ? { ...g, [field]: value } : g);
    if (isControlled) {
        onChange({ target: { name: "goals", value: updatedGoals } });
    }
  };

  const updateCompetency = (id, field, value) => {
    // value for rating comes as number, others string
    const updatedCompetencies = competencies.map(c => c.id === id ? { ...c, [field]: value } : c);
    
    if (isControlled) {
        // Update competencies in parent
        onChange({ target: { name: "competencies", value: updatedCompetencies } });
        
        // If rating changed, recalculate overall
        if (field === 'rating') {
            const newRating = calculateAverageRating(updatedCompetencies);
            const newStatus = ratingToStatusMap[newRating] || "Average";
            
            onChange({ target: { name: "overallRating", value: newRating } });
            onChange({ target: { name: "performanceStatus", value: newStatus } });
        }
    }
  };

  const handleDateChange = (e) => {
    if (isControlled) {
      onChange({ target: { name: "lastReviewDate", value: e.target.value } });
    }
  };


  return (
    <div className="flex flex-col gap-6">

      {/* Performance Summary */}
      <AccordionItem
        title="Performance Summary"
        isOpen={isSummaryOpen}
        onToggle={() => setIsSummaryOpen(!isSummaryOpen)}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-[#757575] mb-1.5" style={{ fontFamily: '"Nunito Sans", sans-serif', fontWeight: 600, fontSize: '15px', lineHeight: '100%', letterSpacing: '0%' }}>
              Last review Date
            </label>
            <div className="relative">
              <CustomDatePicker
                value={lastReviewDate}
                onChange={(val) => handleDateChange({ target: { value: val } })}
                className="bg-white border-[#D9D9D9]"
              />
            </div>
          </div>
          {/* Read Only Status */}
          <SelectField
            label="Performance status"
            value={performanceStatus}
            disabled={true}
          />
          {/* Read Only Rating (Calculated) */}
          <StarRating
            rating={overallRating}
            readOnly={true}
          />
        </div>
      </AccordionItem>

      {/* Goals & Objectives */}
      <h2 className="text-black" style={{ fontFamily: '"Nunito Sans", sans-serif', fontWeight: 600, fontSize: '15px', lineHeight: '100%', letterSpacing: '0%' }}>
        Goals & Objectives
      </h2>

      <div className="overflow-x-auto border border-[#E0E0E0] rounded-xl bg-white">
        <table className="w-full border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-[#E0E0E0] text-[#757575]">
              <th className="px-4 py-3 text-left w-[80px]" style={{ fontFamily: '"Nunito Sans", sans-serif', fontWeight: 600, fontSize: '15px', lineHeight: '100%', letterSpacing: '0%' }}>Sr no</th>
              <th className="px-4 py-3 text-left min-w-[300px]" style={{ fontFamily: '"Nunito Sans", sans-serif', fontWeight: 600, fontSize: '15px', lineHeight: '100%', letterSpacing: '0%' }}>Goal</th>
              <th className="px-4 py-3 text-left w-[150px]" style={{ fontFamily: '"Nunito Sans", sans-serif', fontWeight: 600, fontSize: '15px', lineHeight: '100%', letterSpacing: '0%' }}>Progress</th>
              <th className="px-4 py-3 text-left w-[150px]" style={{ fontFamily: '"Nunito Sans", sans-serif', fontWeight: 600, fontSize: '15px', lineHeight: '100%', letterSpacing: '0%' }}>Status</th>
            </tr>
          </thead>

          <tbody>
            {goals.map((goal, index) => (
              <tr key={goal.id}>
                <td className="px-4 py-3" style={{ fontFamily: '"Nunito Sans", sans-serif', fontWeight: 600, fontSize: '15px', lineHeight: '100%', letterSpacing: '0%' }}>{String(index + 1).padStart(2, '0')}</td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={goal.goal}
                    onChange={(e) => updateGoal(goal.id, 'goal', e.target.value)}
                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                    style={{ fontFamily: '"Nunito Sans", sans-serif', fontWeight: 600, fontSize: '15px', lineHeight: '100%', letterSpacing: '0%' }}
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={goal.progress}
                    onChange={(e) => updateGoal(goal.id, 'progress', e.target.value)}
                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                    style={{ fontFamily: '"Nunito Sans", sans-serif', fontWeight: 600, fontSize: '15px', lineHeight: '100%', letterSpacing: '0%' }}
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={goal.status}
                    onChange={(e) => updateGoal(goal.id, 'status', e.target.value)}
                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                    style={{ fontFamily: '"Nunito Sans", sans-serif', fontWeight: 600, fontSize: '15px', lineHeight: '100%', letterSpacing: '0%' }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Competency Evaluation */}
      <h2 className="text-black" style={{ fontFamily: '"Nunito Sans", sans-serif', fontWeight: 600, fontSize: '15px', lineHeight: '100%', letterSpacing: '0%' }}>
        Competency Evaluation
      </h2>

      <div className="overflow-x-auto border border-[#E0E0E0] rounded-xl bg-white">
        <table className="w-full border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-[#E0E0E0] text-[#757575]">
              <th className="px-4 py-3 text-left" style={{ fontFamily: '"Nunito Sans", sans-serif', fontWeight: 600, fontSize: '15px', lineHeight: '100%', letterSpacing: '0%' }}>Sr no</th>
              <th className="px-4 py-3 text-left" style={{ fontFamily: '"Nunito Sans", sans-serif', fontWeight: 600, fontSize: '15px', lineHeight: '100%', letterSpacing: '0%' }}>Competency</th>
              <th className="px-4 py-3 text-left" style={{ fontFamily: '"Nunito Sans", sans-serif', fontWeight: 600, fontSize: '15px', lineHeight: '100%', letterSpacing: '0%' }}>Rating</th>
              <th className="px-4 py-3 text-left" style={{ fontFamily: '"Nunito Sans", sans-serif', fontWeight: 600, fontSize: '15px', lineHeight: '100%', letterSpacing: '0%' }}>Comments</th>
            </tr>
          </thead>

          <tbody>
            {competencies.map((comp, index) => (
              <tr key={comp.id}>
                <td className="px-4 py-3" style={{ fontFamily: '"Nunito Sans", sans-serif', fontWeight: 600, fontSize: '15px', lineHeight: '100%', letterSpacing: '0%' }}>{String(index + 1).padStart(2, '0')}</td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={comp.competency}
                    onChange={(e) => updateCompetency(comp.id, 'competency', e.target.value)}
                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                    style={{ fontFamily: '"Nunito Sans", sans-serif', fontWeight: 600, fontSize: '15px', lineHeight: '100%', letterSpacing: '0%' }}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex" style={{ gap: '26.5px', paddingTop: '10px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        width="20"
                        height="20"
                        className="cursor-pointer transition-all hover:scale-110"
                        fill={star <= comp.rating ? "#FFD700" : "none"}
                        stroke={star <= comp.rating ? "#FFD700" : "#B3B3B3"}
                        strokeWidth="2.5"
                        onClick={() => updateCompetency(comp.id, 'rating', star)}
                      />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={comp.comments}
                    onChange={(e) => updateCompetency(comp.id, 'comments', e.target.value)}
                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                    style={{ fontFamily: '"Nunito Sans", sans-serif', fontWeight: 600, fontSize: '15px', lineHeight: '100%', letterSpacing: '0%' }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default EmpUpdatePerformance;
