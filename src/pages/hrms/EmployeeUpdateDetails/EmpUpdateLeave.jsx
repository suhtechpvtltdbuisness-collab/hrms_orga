import React from "react";

const Card = ({ title, value, bg = "bg-gray-200" }) => (
  <div className={`rounded-xl border ${bg} p-4 shadow-md w-full sm:w-48`}>
    <p className="text-sm text-black flex flex-col items-center">{title}</p>
    <p className="mt-2 text-2xl font-semibold text-black flex flex-col items-center">
      {value}
    </p>
  </div>
);

export default function EmpUpdateLeave() {
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Leave Summary */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Leave Summary</h2>
        <div className="flex gap-4 ">
          <Card title="Total Leaves Allocated (Year)" value="24" />
          <Card title="Total Leaves Taken" value="10" />
          <Card title="Leave Balance" value="14" />
          <Card title="Loss Of Pay Days" value="0" />
          <Card title="Carry Forward Leaves" value="4" />
          <Card title="Comp Off Earned" value="2" />
          <Card title="Comp Off Availed" value="1" />
        </div>
      </section>

      {/* Leave Balances */}
      <section className="flex flex-wrap gap-4">
        <Card title="Sick Leaves Balance" value="5" />
        <Card title="Casual Leaves Balance" value="6" />
        <Card title="Paid Leaves Balance" value="4" />
      </section>

      {/* Types Of Leaves */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Types Of Leaves</h2>
        <div className="flex gap-4 flex-wrap">
          <Card title="Casual Leave" value="2" bg="bg-white" />
          <Card title="Allocated" value="12" bg="bg-white" />
          <Card title="Used" value="5"  bg="bg-white" />
          <Card title="Balanced" value="7" bg="bg-white"  />
        </div>
      </section>

      {/* Leave History */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Leave History</h2>
          <button className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm hover:bg-gray-100">
            Filters
            <span>☰</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Date From</th>
                <th className="px-4 py-3 text-left">Date To</th>
                <th className="px-4 py-3 text-left">Days</th>
                <th className="px-4 py-3 text-left">Leave Type</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Reason</th>
                <th className="px-4 py-3 text-left">Approved By</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="px-4 py-3">10 Oct 2025</td>
                <td className="px-4 py-3">11 Oct 2025</td>
                <td className="px-4 py-3">2</td>
                <td className="px-4 py-3">Sick Leave</td>
                <td className="px-4 py-3 text-green-600 font-medium">Approved</td>
                <td className="px-4 py-3">Fever</td>
                <td className="px-4 py-3">Priya Sharma</td>
              </tr>
              <tr>
                <td className="px-4 py-3">20 Sept 2025</td>
                <td className="px-4 py-3">20 Sept 2025</td>
                <td className="px-4 py-3">1</td>
                <td className="px-4 py-3">Casual Leave</td>
                <td className="px-4 py-3 text-red-600 font-medium">Rejected</td>
                <td className="px-4 py-3">Family Function</td>
                <td className="px-4 py-3">–</td>
              </tr>
              <tr>
                <td className="px-4 py-3">05 Aug 2025</td>
                <td className="px-4 py-3">06 Aug 2025</td>
                <td className="px-4 py-3">2</td>
                <td className="px-4 py-3">Earned Leave</td>
                <td className="px-4 py-3 text-green-600 font-medium">Approved</td>
                <td className="px-4 py-3">Personal Work</td>
                <td className="px-4 py-3">Priya Sharma</td>
              </tr>
              <tr>
                <td className="px-4 py-3">18 July 2025</td>
                <td className="px-4 py-3">18 July 2025</td>
                <td className="px-4 py-3">1</td>
                <td className="px-4 py-3">Comp Off</td>
                <td className="px-4 py-3 text-green-600 font-medium">Approved</td>
                <td className="px-4 py-3">Worked Weekend</td>
                <td className="px-4 py-3">Priya Sharma</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
