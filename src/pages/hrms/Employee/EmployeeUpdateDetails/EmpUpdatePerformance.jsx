import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Star } from "lucide-react";

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


const InputField = ({ label, value, onChange }) => (
  <div>
    <label className="block text-[#757575] mb-1.5" style={{ fontFamily: '"Nunito Sans", sans-serif', fontWeight: 600, fontSize: '15px', lineHeight: '100%', letterSpacing: '0%' }}>
      {label}
    </label>
    <div className="relative">
      <input
        type="date"
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border border-[#D9D9D9] rounded-lg bg-white text-black focus:outline-none focus:border-purple-500"
        style={{
          fontFamily: '"Nunito Sans", sans-serif',
          fontWeight: 600,
          fontSize: '15px',
          lineHeight: '100%',
          letterSpacing: '0%'
        }}
      />
      <img
        src="/images/calender.svg"
        alt="calendar"
        className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none w-5 h-5"
      />
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

const SelectField = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-[#757575] mb-1.5" style={{ fontFamily: '"Nunito Sans", sans-serif', fontWeight: 600, fontSize: '15px', lineHeight: '100%', letterSpacing: '0%' }}>
      {label}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border border-[#D9D9D9] rounded-lg bg-white text-black focus:outline-none focus:border-purple-500 cursor-pointer appearance-none"
        style={{ fontFamily: '"Nunito Sans", sans-serif', fontWeight: 600, fontSize: '15px', lineHeight: '100%', letterSpacing: '0%' }}
      >
        <option value="">Select status</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
    </div>
  </div>
);

/* Interactive Star Rating */
const StarRating = ({ rating, onRatingChange }) => (
  <div>
    <label className="block text-[#757575] mb-1.5" style={{ fontFamily: '"Nunito Sans", sans-serif', fontWeight: 600, fontSize: '15px', lineHeight: '100%', letterSpacing: '0%' }}>
      Overall Rating
    </label>
    <div className="flex" style={{ gap: '2.67px', paddingTop: '4px', paddingBottom: '12px' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          width="26.67"
          height="25.33"
          className="cursor-pointer transition-all hover:scale-110"
          fill={i <= rating ? "#B3B3B3" : "none"}
          stroke="#B3B3B3"
          strokeWidth="1.6"
          onClick={() => onRatingChange(i)}
        />
      ))}
    </div>
  </div>
);

/* Main Component */
const EmpUpdatePerformance = () => {
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);

  // Performance Summary State
  const [lastReviewDate, setLastReviewDate] = useState("2025-11-13");
  const [performanceStatus, setPerformanceStatus] = useState("");
  const [overallRating, setOverallRating] = useState(4);

  // Goals & Objectives State
  const [goals, setGoals] = useState([
    { id: 1, goal: "Improve UI performance by 30%", progress: "80%", status: "On Track" },
    { id: 2, goal: "Lead the website revamp project", progress: "100%", status: "Completed" },
    { id: 3, goal: "Monitor 2 junior developers", progress: "50%", status: "In Progress" },
  ]);

  // Competency Evaluation State
  const [competencies, setCompetencies] = useState([
    { id: 1, competency: "Technical Skills", rating: 4, comments: "Strong in react & dev UI" },
    { id: 2, competency: "Communication", rating: 4, comments: "Clear & Concise" },
    { id: 3, competency: "Teamwork", rating: 5, comments: "Excellent Collaboration" },
    { id: 4, competency: "Problem Solving", rating: 4, comments: "Good analytical approach" },
    { id: 5, competency: "Leadership", rating: 3, comments: "Improving" },
  ]);

  const performanceStatusOptions = ["Excellent", "Good", "Average", "Below Average", "Poor"];

  const updateGoal = (id, field, value) => {
    setGoals(goals.map(g => g.id === id ? { ...g, [field]: value } : g));
  };

  const updateCompetency = (id, field, value) => {
    setCompetencies(competencies.map(c => c.id === id ? { ...c, [field]: value } : c));
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
          <InputField
            label="Last review Date"
            value={lastReviewDate}
            onChange={(e) => setLastReviewDate(e.target.value)}
          />
          <SelectField
            label="Performance status"
            value={performanceStatus}
            onChange={(e) => setPerformanceStatus(e.target.value)}
            options={performanceStatusOptions}
          />
          <StarRating
            rating={overallRating}
            onRatingChange={setOverallRating}
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
                        fill="none"
                        stroke="#1F1F1F"
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
