import React from 'react';

const EmpTrainingDevelopment = () => {
  const courses = [
    { id: "01", name: "Course 1", date: "01/01/2024", by: "John Doe", required: "Mandatory", priority: "High", status: "Assigned" },
    { id: "02", name: "Course 2", date: "01/01/2024", by: "John Smith", required: "Mandatory", priority: "High", status: "Completed" },
    { id: "03", name: "Course 3", date: "01/01/2024", by: "Michael", required: "Optional", priority: "Medium", status: "In progress" },
    { id: "04", name: "Course 4", date: "01/01/2024", by: "Mike Miller", required: "Mandatory", priority: "High", status: "Assigned" },
  ];

  const skills = [
    { name: "Design", level: 40, beginner: "Beginner", intermediate: "Intermediate" },
    { name: "Javascript", level: 30, beginner: "Beginner", intermediate: "Intermediate" },
    { name: "Leadership", level: 85, beginner: "Beginner", intermediate: "Intermediate" },
  ];

  const statusStyle = {
    Assigned: "bg-[#76DB1E33] text-[#76DB1E]",
    Completed: "bg-[#00FF5E33] text-[#1E7C21]",
    "In progress": "bg-[#006FFF33] text-[#1E477C]",
  };

  return (
    <div className="space-y-10 font-['Nunito_Sans'] font-semibold">

      {/* ================= COURSE ASSIGNMENT ================= */}
      <div>
        <h2 className="text-[18px] font-semibold mb-4">Course Assignment</h2>

        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-[#757575]">
              <tr>
                <th className="py-4 px-6 text-left font-semibold">Sr no</th>
                <th className="py-4 px-6 text-left font-semibold">Assigned Courses</th>
                <th className="py-4 px-6 text-left font-semibold">Assigned Date</th>
                <th className="py-4 px-6 text-left font-semibold">Assigned By</th>
                <th className="py-4 px-6 text-left font-semibold">Required</th>
                <th className="py-4 px-6 text-left font-semibold">Priority Level</th>
                <th className="py-4 px-6 text-left font-semibold">Status</th>
              </tr>
            </thead>

            <tbody>
              {courses.map((c) => (
                <tr key={c.id}>
                  <td className="px-6 py-4 font-semibold">{c.id}</td>
                  <td className="px-6 py-4">{c.name}</td>
                  <td className="px-6 py-4">{c.date}</td>
                  <td className="px-6 py-4">{c.by}</td>
                  <td className="px-6 py-4">{c.required}</td>
                  <td className="px-6 py-4">{c.priority}</td>
                  <td className="px-6 py-4">
                    <span className={`px-4 py-1 rounded-full font-semibold ${statusStyle[c.status]}`} style={{ fontSize: '12px', fontWeight: 600, lineHeight: '100%', letterSpacing: '0%', fontFamily: '"Nunito Sans", sans-serif' }}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= LEARNING PROCESS ================= */}
      <div>
        <h2 className="text-[18px] font-semibold mb-4">Learning Process</h2>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Course Completion */}
          <div className="border border-gray-200 rounded-2xl p-6">
            <p className="text-sm font-semibold mb-3">Course Completion</p>

            <div className="flex justify-between text-xs text-purple-600 mb-2">
              <span>Course Completion</span>
              <span>62%</span>
            </div>

            <div className="h-[6px] bg-gray-200 rounded-full mb-6">
              <div className="h-[6px] bg-purple-600 rounded-full w-[62%]" />
            </div>

            <p className="text-sm font-semibold mb-4">Modul Wise Progress</p>

            <div className="relative h-[4px] bg-gray-200 rounded-full mb-6">
              <div className="absolute left-0 h-[4px] bg-green-500 rounded-full" style={{ width: '25%' }}></div>
              <span className="absolute left-[25%] -top-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
              <span className="absolute left-[55%] -top-1 w-3 h-3 bg-cyan-400 rounded-full border-2 border-white"></span>
            </div>

            <div className="flex justify-between text-xs text-purple-600 font-semibold">
              <span>Module 1</span>
              <span>Module 2</span>
              <span>Module 3</span>
              <span>Module 4</span>
            </div>
          </div>

          {/* Stats */}
          <div className="border border-gray-200 rounded-2xl p-6 grid grid-cols-2 gap-y-6">
            {[
              { label: "Time Spent", value: "15h 30m" },
              { label: "Learning Score", value: "85" },
              { label: "Passed Assessments", value: "4" },
              { label: "Certificates Earned", value: "85" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-xs text-[#757575]">{item.label}</p>
                <p className="text-xl font-semibold text-purple-600">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= SKILL DEVELOPMENT ================= */}
      <div>
        <h2 className="text-[18px] font-semibold mb-4">Skill Development</h2>

        <div className="border border-gray-200 rounded-2xl p-6 max-w-[70%]">
          {/* Header Row */}
          <div className="grid grid-cols-[180px_1fr] gap-x-8 mb-6">
            <div className="text-sm font-semibold" style={{ fontWeight: 600, lineHeight: '100%', letterSpacing: '0%' }}>Skills</div>
            <div className="text-sm font-semibold" style={{ fontWeight: 600, lineHeight: '100%', letterSpacing: '0%' }}>Skill Level</div>
          </div>

          {/* Skills List */}
          <div className="space-y-6">
            {skills.map((skill) => (
              <div key={skill.name} className="grid grid-cols-[180px_1fr] gap-x-8 items-center">
                {/* Skill Name */}
                <div className="text-sm" style={{ fontWeight: 600, lineHeight: '100%', letterSpacing: '0%' }}>{skill.name}</div>

                {/* Skill Level Bar */}
                <div>
                  <div className="relative h-2 bg-gray-200 rounded-full mb-2">
                    <div
                      className="absolute h-2 bg-purple-500 rounded-full"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400" style={{ fontWeight: 600, lineHeight: '100%', letterSpacing: '0%' }}>
                    <span>{skill.beginner}</span>
                    <span>{skill.intermediate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default EmpTrainingDevelopment;