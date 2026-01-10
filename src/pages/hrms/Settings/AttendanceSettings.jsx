import Toggle from './Toggle';
import DropdownIcon from './DropdownIcon';

const AttendanceSettings = () => {
    return (
        <div className="space-y-8">
            {/* Grace Period */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-800">Grace Period</h3>
                        <p className="text-sm text-gray-400 mt-1">
                            Allow buffer time for late check-ins and early check-outs
                        </p>
                    </div>
                    <Toggle defaultChecked={true} />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-normal text-gray-800 mb-2">
                            Late check-In grace period
                        </label>
                        <div className="relative inline-block">
                            <select
                                className="appearance-none border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white w-[324px] h-[40px] min-w-[120px] pt-2 pb-2 pl-4 pr-10"
                            >
                                <option>15 minutes</option>
                                <option>30 minutes</option>
                                <option>45 minutes</option>
                                <option>60 minutes</option>
                            </select>
                            <div className="absolute top-1/2 -translate-y-1/2 pointer-events-none right-3">
                                <DropdownIcon />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-normal text-gray-800 mb-2">
                            Early Check-Out Grace Period
                        </label>
                        <input
                            type="text"
                            defaultValue="15 minutes"
                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-fit"
                        />
                    </div>
                </div>
            </div>

            {/* Overtime Calculation */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-800">Overtime Calculation</h3>
                        <p className="text-sm text-gray-400 mt-1">
                            Configure how overtime is calculated and compensated
                        </p>
                    </div>
                    <Toggle defaultChecked={true} />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-normal text-gray-800 mb-2">
                            Overtime Starts After
                        </label>
                        <input
                            type="text"
                            defaultValue="9 hrs of work"
                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-fit"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-normal text-gray-800 mb-2">
                            Overtime Pay Multiplier
                        </label>
                        <input
                            type="text"
                            defaultValue="1.5 by base work"
                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-fit"
                        />
                    </div>
                </div>
            </div>

            {/* Auto Mark Remote Attendance */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-800">Auto Mark Remote Attendance</h3>
                        <p className="text-sm text-gray-400 mt-1">
                            Automatically mark attendance for remote or system users based on login activity
                        </p>
                    </div>
                    <Toggle defaultChecked={true} />
                </div>

                <div>
                    <label className="block text-sm font-normal text-gray-800 mb-2">
                        Auto mark criteria
                    </label>
                    <div className="relative inline-block">
                        <select
                            className="appearance-none border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white w-[324px] h-[40px] min-w-[120px] pt-2 pb-2 pl-4 pr-10"
                        >
                            <option>Based on system login time</option>
                        </select>
                        <div className="absolute top-1/2 -translate-y-1/2 pointer-events-none right-3">
                            <DropdownIcon />
                        </div>
                    </div>
                </div>
            </div>

            {/* Holiday Calendar Selection */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-800">Holiday Calendar Selection</h3>
                        <p className="text-sm text-gray-400 mt-1">
                            Choose which holiday calendar applies to your organizations
                        </p>
                    </div>
                    <Toggle defaultChecked={true} />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-normal text-gray-800 mb-2">
                            Holiday Calendar
                        </label>
                        <div className="relative inline-block">
                            <select
                                className="appearance-none border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white w-[324px] h-[40px] min-w-[120px] pt-2 pb-2 pl-4 pr-10"
                            >
                                <option>Default company calendar</option>
                            </select>
                            <div className="absolute top-1/2 -translate-y-1/2 pointer-events-none right-3">
                                <DropdownIcon />
                            </div>
                        </div>
                    </div>
                    <div>
                        <input
                            type="text"
                            defaultValue="15 minutes"
                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-fit mt-7"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceSettings;
