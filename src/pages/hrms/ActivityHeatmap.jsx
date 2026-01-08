import React from 'react';

const ActivityHeatmap = () => {
  // Department data with color indicators
  const departments = [
    { name: 'Engineering', color: '#1376DA' },
    { name: 'Product Design', color: '#EC4899' },
    { name: 'Marketing', color: '#F97316' },
    { name: 'Sales', color: '#22C55E' },
    { name: 'HR', color: '#BC9311' }
  ];

  // Day headers (12 days)
  const days = [
    'Mon 1', 'Tue 2', 'Wed 3', 'Thur 4', 'Fri 5', 'Sat 6',
    'Sun 7', 'Mon 8', 'Tue 9', 'Wed 10', 'Thur 11', 'Fri 12'
  ];

  // Activity level colors (from Figma)
  const activityColors = [
    '#CFECE0', // Level 0 - Lightest
    '#A0DAD9', // Level 1
    '#97CCD7', // Level 2
    '#6FBBC5', // Level 3
    '#5BC2C2'  // Level 4 - Darkest
  ];

  // Mock activity data matching the Figma design pattern
  const activityData = [
    // Engineering - Mon1, Tue2, Wed3, Thu4, Fri5, Sat6, Sun7, Mon8, Tue9, Wed10, Thu11, Fri12
    [0, 3, 3, 2, 1, 0, 0, 3, 3, 3, 3, 3],
    // Product Design
    [3, 3, 2, 3, 1, 0, 0, 3, 3, 2, 2, 0],
    // Marketing
    [0, 3, 3, 2, 1, 0, 0, 3, 3, 3, 2, 0],
    // Sales
    [3, 3, 2, 2, 1, 0, 0, 3, 2, 1, 3, 3],
    // HR
    [0, 3, 3, 3, 1, 0, 0, 3, 3, 3, 2, 0]
  ];

  // Legend gradient boxes
  const legendBoxes = [
    { label: 'Low', color: '#CFECE0' },
    { label: '', color: '#A0DAD9' },
    { label: '', color: '#97CCD7' },
    { label: '', color: '#6FBBC5' },
    { label: 'High', color: '#5BC2C2' }
  ];

  return (
    <div className="w-full bg-[#FEFEFE] border border-[#E4E0E0] rounded-xl p-4 sm:p-6 overflow-x-auto mb-4">
      {/* Activity Level Legend */}
      <div className="flex justify-end items-center gap-2 mb-4">
        <span className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Activity Level
        </span>
        <div className="flex items-center gap-1">
          {legendBoxes.map((box, idx) => (
            <div key={idx} className="flex items-center gap-1">
              <div
                className="w-5 h-5 rounded"
                style={{ backgroundColor: box.color }}
              />
              {box.label && (
                <span className="text-xs text-gray-600 ml-0.5" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {box.label}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap Grid Container */}
      <div className="min-w-[900px]">
        {/* Header Row - Days */}
        <div className="grid grid-cols-[160px_repeat(12,1fr)] gap-2 mb-3">
          <div className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Department
          </div>
          {days.map((day, idx) => (
            <div
              key={idx}
              className="text-sm font-medium text-gray-800 text-center"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Department Rows */}
        {departments.map((dept, deptIdx) => (
          <div
            key={deptIdx}
            className="grid grid-cols-[160px_repeat(12,1fr)] gap-2 mb-3"
          >
            {/* Department Label with Color Indicator */}
            <div className="flex items-center gap-2">
              <div
                className="w-1 h-8 rounded"
                style={{ backgroundColor: dept.color }}
              />
              <span className="text-sm font-medium text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {dept.name}
              </span>
            </div>

            {/* Activity Cells */}
            {activityData[deptIdx].map((level, dayIdx) => (
              <div
                key={dayIdx}
                className="h-12 rounded-md transition-all duration-200 hover:opacity-80 cursor-pointer"
                style={{ backgroundColor: activityColors[level] }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityHeatmap;
