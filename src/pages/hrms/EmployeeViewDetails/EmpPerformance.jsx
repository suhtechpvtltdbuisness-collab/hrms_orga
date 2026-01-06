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
          <span className="font-nunito-semibold text-black">
            {title}
          </span>
          {isOpen ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
        </button>
      </div>

      {isOpen && <div className="pt-4">{children}</div>}
    </div>
  );
};

/* Inputs */
const InputField = ({ label, value }) => (
  <div>
    <label className="block text-[#757575] mb-1.5 font-nunito-semibold">
      {label}
    </label>
    <input
      value={value}
      disabled
      className="w-full px-4 py-3 border border-[#D9D9D9] rounded-lg bg-[#F5F5F5] text-[#757575] font-nunito-semibold cursor-not-allowed"
    />
  </div>
);

const SelectField = ({ label, value }) => (
  <div>
    <label className="block text-[#757575] mb-1.5 font-nunito-semibold">
      {label}
    </label>
    <input
      value={value}
      disabled
      className="w-full px-4 py-3 border border-[#D9D9D9] rounded-lg bg-[#F5F5F5] text-[#757575] font-nunito-semibold cursor-not-allowed"
    />
  </div>
);

/* Stars */
const StarRating = ({ rating }) => (
  <div>
    <label className="block text-[#757575] mb-1.5 font-nunito-semibold">
      Overall Rating
    </label>
    <div className="flex gap-2 py-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={22}
          className="text-[#A1A1A1]"
          fill="none"
        />
      ))}
    </div>
  </div>
);

/* Main Component */
const EmpPerformance = () => {
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);

  return (
    <div className="flex flex-col gap-6">

      {/* Performance Summary */}
      <AccordionItem
        title="Performance Summary"
        isOpen={isSummaryOpen}
        onToggle={() => setIsSummaryOpen(!isSummaryOpen)}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField label="Last review Date" value="13 Nov 2025" />
          <SelectField label="Performance status" value="Excellent" />
          <StarRating rating={4} />
        </div>
      </AccordionItem>

      {/* Goals & Objectives */}
      <h2 className="font-nunito-semibold text-black">
        Goals & Objectives
      </h2>

      <div className="border border-[#E0E0E0] rounded-xl bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#E0E0E0] text-[#757575]">
              <th className="px-4 py-3 text-left font-nunito-semibold">Sr no</th>
              <th className="px-4 py-3 text-left font-nunito-semibold">Goal</th>
              <th className="px-4 py-3 text-left font-nunito-semibold">Progress</th>
              <th className="px-4 py-3 text-left font-nunito-semibold">Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="px-4 py-3 font-nunito-semibold">01</td>
              <td className="px-4 py-3 font-nunito-semibold">
                Improve UI performance by 30%
              </td>
              <td className="px-4 py-3 font-nunito-semibold">80%</td>
              <td className="px-4 py-3 font-nunito-semibold">On Track</td>
            </tr>

            <tr>
              <td className="px-4 py-3 font-nunito-semibold">02</td>
              <td className="px-4 py-3 font-nunito-semibold">
                Lead the website revamp project
              </td>
              <td className="px-4 py-3 font-nunito-semibold">100%</td>
              <td className="px-4 py-3 font-nunito-semibold">Completed</td>
            </tr>

            <tr>
              <td className="px-4 py-3 font-nunito-semibold">03</td>
              <td className="px-4 py-3 font-nunito-semibold">
                Monitor 2 junior developers
              </td>
              <td className="px-4 py-3 font-nunito-semibold">50%</td>
              <td className="px-4 py-3 font-nunito-semibold">In Progress</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Competency Evaluation */}
      <h2 className="font-nunito-semibold text-black">
        Competency Evaluation
      </h2>

      <div className="border border-[#E0E0E0] rounded-xl bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#E0E0E0] text-[#757575]">
              <th className="px-4 py-3 text-left font-nunito-semibold">Sr no</th>
              <th className="px-4 py-3 text-left font-nunito-semibold">Competency</th>
              <th className="px-4 py-3 text-left font-nunito-semibold">Rating</th>
              <th className="px-4 py-3 text-left font-nunito-semibold">Comments</th>
            </tr>
          </thead>

          <tbody>
            {[
              ["01", "Technical Skills", 4, "Strong in react & dev UI"],
              ["02", "Communication", 4, "Clear & Concise"],
              ["03", "Teamwork", 5, "Excellent Collaboration"],
              ["04", "Problem Solving", 4, "Good analytical approach"],
              ["05", "Leadership", 3, "Improving"],
            ].map((row, i) => (
              <tr key={i}>
                <td className="px-4 py-3 font-nunito-semibold">{row[0]}</td>
                <td className="px-4 py-3 font-nunito-semibold">{row[1]}</td>

                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {[...Array(row[2])].map((_, idx) => (
                      <Star
                        key={idx}
                        size={18}
                        className="text-black"
                        fill="none"
                      />
                    ))}
                  </div>
                </td>

                <td className="px-4 py-3 font-nunito-semibold">{row[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default EmpPerformance;
