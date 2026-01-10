import Toggle from './Toggle';

const DepartmentSettings = () => {
    return (
        <div className="space-y-8">
            {/* Default Hiring Stages */}
            <div>
                <h3 className="text-sm font-medium text-gray-800 mb-1">Default Hiring Stages</h3>
                <p className="text-sm text-gray-400 mb-4">
                    Define the steps in your hiring process (e.g., Screening → Interview → Offer → Onboarding)
                </p>

                {/* Stage Item */}
                <div className="flex items-center gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
                    <input
                        type="text"
                        defaultValue="Interview"
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <input
                        type="text"
                        defaultValue="5"
                        className="w-20 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <span className="text-sm text-gray-600">days</span>
                    <button className="text-gray-600 hover:text-red-600 transition-colors">×</button>
                </div>

                {/* Add New Stage */}
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Department Name......"
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button className="px-6 py-2.5 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                        Code
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
                        Add +
                    </button>
                </div>
            </div>

            {/* Designation Codes */}
            <div>
                <h3 className="text-sm font-medium text-gray-800 mb-1">Designation Codes</h3>
                <p className="text-sm text-gray-400 mb-4">
                    Add, rename, or reorganize designations in the company
                </p>

                {/* Designation Item */}
                <div className="flex items-center gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
                    <input
                        type="text"
                        defaultValue="Engineering Manager"
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Code:</span>
                        <input
                            type="text"
                            defaultValue="EM"
                            className="w-20 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Level</span>
                        <input
                            type="text"
                            defaultValue="4"
                            className="w-16 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                    <button className="text-gray-600 hover:text-red-600 transition-colors">×</button>
                </div>

                {/* Add New Designation */}
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Designation Name......"
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button className="px-6 py-2.5 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                        CODE
                    </button>
                    <input
                        type="text"
                        defaultValue="1"
                        className="w-16 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
                        Add +
                    </button>
                </div>
            </div>

            {/* Hierarchy Mapping */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-800">Hierarchy Mapping</h3>
                        <p className="text-sm text-gray-400 mt-1">
                            Maintain reporting structure and grade levels across the organization
                        </p>
                    </div>
                    <Toggle defaultChecked={true} />
                </div>

                {/* Hierarchy Item */}
                <div className="flex items-center gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
                    <input
                        type="text"
                        defaultValue="L2"
                        className="w-24 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <input
                        type="text"
                        defaultValue="Mid-Level"
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <input
                        type="text"
                        defaultValue="2"
                        className="w-16 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button className="text-gray-600 hover:text-red-600 transition-colors">×</button>
                </div>

                {/* Add New Level */}
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Level name (eg: Executive)"
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <input
                        type="text"
                        defaultValue="1"
                        className="w-16 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
                        Add Level +
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DepartmentSettings;
