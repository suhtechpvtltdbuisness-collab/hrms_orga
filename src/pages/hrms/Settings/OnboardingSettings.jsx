import Toggle from './Toggle';

const OnboardingSettings = () => {
    return (
        <div className="space-y-8">
            {/* Default Onboarding Check List */}
            <div>
                <h3 className="text-sm font-medium text-gray-800 mb-1">Default Onboarding Check List</h3>
                <p className="text-sm text-gray-400 mb-4">
                    Tasks that new employees must complete during onboarding
                </p>

                {/* Task Item */}
                <div className="flex items-center gap-3 mb-4 px-4 py-2.5 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-purple-500 bg-white">
                    <input
                        type="text"
                        defaultValue="Upload required documents"
                        className="flex-1 text-sm bg-transparent outline-none border-none text-gray-800"
                        readOnly
                    />
                    <span className="px-6 py-2.5 bg-purple-600 text-white rounded-full text-xs text-center min-w-[100px]">Employee</span>
                    <button className="text-gray-400 hover:text-red-600 transition-colors text-xl leading-none">×</button>
                </div>

                {/* Add New Task */}
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Add new onboarding task..."
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
                        Add Task +
                    </button>
                </div>
            </div>

            {/* Documents Required for New Employees */}
            <div>
                <h3 className="text-sm font-medium text-gray-800 mb-1">Documents Required for New Employees</h3>
                <p className="text-sm text-gray-400 mb-4">
                    Specify documents that must be uploaded by new hires
                </p>

                {/* Document Item */}
                <div className="flex items-center gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
                    <input type="checkbox" className="w-4 h-4" defaultChecked />
                    <span className="flex-1 text-sm font-medium text-gray-800">PAN Card</span>
                    <span className="text-sm text-gray-600">Mandatory</span>
                    <button className="text-gray-600 hover:text-red-600 transition-colors">×</button>
                </div>

                {/* Add New Document */}
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Add document type..."
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
                        Add Document +
                    </button>
                </div>
            </div>

            {/* Auto-Assign Onboarding Tasks */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-medium text-gray-800">Auto-Assign Onboarding Tasks</h3>
                    <p className="text-sm text-gray-400 mt-1">
                        Automatically assign onboarding tasks to employees and managers
                    </p>
                </div>
                <Toggle defaultChecked={true} />
            </div>

            {/* Welcome Email Template */}
            <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                    Welcome Email Template
                </label>
                <textarea
                    placeholder="Enter mail"
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                ></textarea>
            </div>
        </div>
    );
};

export default OnboardingSettings;
