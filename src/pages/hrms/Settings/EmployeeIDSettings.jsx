import Toggle from './Toggle';

const EmployeeIDSettings = () => {
    return (
        <div className="space-y-6">
            {/* Employee ID Prefix and Start Form Number */}
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-normal text-gray-800 mb-2">
                        Employee ID Prefix
                    </label>
                    <input
                        type="text"
                        defaultValue="ORG"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>
                <div>
                    <label className="block text-sm font-normal text-gray-800 mb-2">
                        Start Form Number
                    </label>
                    <input
                        type="text"
                        defaultValue="001"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Auto-Increment Toggle */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-medium text-gray-800">Auto-Increment</h3>
                    <p className="text-sm text-gray-400 mt-1">
                        Enable automatic numbering for new employee records
                    </p>
                </div>
                <Toggle defaultChecked={true} />
            </div>

            {/* Employee Code Format */}
            <div className="w-1/3">
                <label className="block text-sm font-normal text-gray-800 mb-2">
                    Employee Code Format
                </label>
                <input
                    type="text"
                    defaultValue="{PREFIX}-{DEPT}-{YY}-{AUTO}"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled
                />
            </div>
        </div>
    );
};

export default EmployeeIDSettings;
