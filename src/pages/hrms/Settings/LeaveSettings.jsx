import Toggle from "./Toggle";
import DropdownIcon from './DropdownIcon';

const LeaveSettings = () => {
    return (
        <div className="max-w-5xl space-y-8">

            {/* Default Leave Policy */}
            <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                    Default Leave Policy
                </label>
                <div className="relative inline-block">
                    <select
                        className="appearance-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white w-[324px] h-[40px] pt-2 pb-2 pl-4 pr-10"
                    >
                        <option>Standard policy</option>
                    </select>
                    <div className="absolute top-1/2 -translate-y-1/2 pointer-events-none right-3">
                        <DropdownIcon />
                    </div>
                </div>
            </div>

            {/* Carry Forward Rules */}
            <div className="space-y-5">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-gray-800">
                            Carry Forward Rules
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">
                            Allow unused leaves to be carried to next year
                        </p>
                    </div>
                    <Toggle defaultChecked />
                </div>

                <div className="w-[324px]">
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                        Maximum Days To Carry Forward
                    </label>
                    <input
                        type="text"
                        defaultValue="15"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                </div>
            </div>

            {/* Encashment Rules */}
            <div className="space-y-5">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-gray-800">
                            Encashment Rules
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">
                            Set rules for encashing leaves during payroll processing
                        </p>
                    </div>
                    <Toggle defaultChecked />
                </div>

                <div className="flex gap-6">
                    <div className="w-[324px]">
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                            Maximum Days For Encashment
                        </label>
                        <input
                            type="text"
                            defaultValue="10"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <div className="w-[324px]">
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                            Minimum Balance Required
                        </label>
                        <input
                            type="text"
                            defaultValue="5"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                </div>
            </div>

            {/* Additional Leave Types */}
            <div className="border border-gray-200 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-800">
                        Additional Leave Types
                    </h3>
                    <button className="px-4 py-2.5 bg-purple-600 text-white rounded-full text-sm hover:bg-purple-700">
                        Add Leave Type
                    </button>
                </div>

                <div className="max-w-2xl">
                    <div className="grid grid-cols-3 items-center bg-white border border-gray-200 px-5 py-4 rounded-xl shadow-sm">
                        <span className="text-sm font-medium text-gray-800">
                            Sick Leave
                        </span>
                        <div className="flex justify-center">
                            <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-4 py-1.5 rounded-full">
                                5 Days
                            </span>
                        </div>
                        <div className="flex justify-end">
                            <button className="text-sm text-gray-400 hover:text-red-600 transition-colors font-medium">
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Company Wide Holiday Calendar */}
            <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                    Company Wide Holder Calendar
                </label>
                <div className="relative inline-block">
                    <select
                        className="appearance-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white w-[324px] h-[40px] pt-2 pb-2 pl-4 pr-10"
                    >
                        <option>Default 2024 calendar</option>
                    </select>
                    <div className="absolute top-1/2 -translate-y-1/2 pointer-events-none right-3">
                        <DropdownIcon />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default LeaveSettings;
