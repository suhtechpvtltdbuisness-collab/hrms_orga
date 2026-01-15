import { useNavigate } from "react-router-dom";

export default function DetailsPanel() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="flex flex-col items-center text-center">
        <img
          src="/images/girl_orga.svg"
          alt=""
          className="w-20 h-20 rounded-full mb-3"
        />
        <h2 className="font-semibold text-gray-900">
          Alexander Chen
        </h2>
        <p className="text-sm text-gray-500">
          Chief Executive Officer
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <Stat label="Type" value="Department" />
        <Stat label="Direct Reports" value="2" />
        <Stat label="Sub Departments" value="2" />
      </div>

      <div className="mt-6 space-y-4">
        <Field label="Contact information" value="alexchan01@gmail.com" />
        <Field label="Department" value="Executive" />
      </div>

      <div className="mt-6">
        <button
          onClick={() => navigate("/hrms/organization-tree/node-details")}
          className="w-full bg-purple-600 text-white py-2.5 rounded-full font-medium hover:bg-purple-700"
        >
          View Details
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="border border-gray-200 rounded-lg p-3 text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <div className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
        {value}
      </div>
    </div>
  );
}