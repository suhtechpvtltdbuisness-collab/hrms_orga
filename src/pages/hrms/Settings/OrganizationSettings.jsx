const OrganizationSettings = () => {
    return (
        <div className="space-y-8">
            {/* Working Days Per Week */}
            <div>
                <h3 className="text-sm font-medium text-gray-800 mb-1">Working Days Per Week</h3>
                <p className="text-sm text-gray-400 mb-4">
                    Select which days are working days and which are weekends
                </p>

                <div className="flex gap-3 mb-2">
                    <button className="px-6 py-3 bg-purple-100 text-purple-600 rounded-full font-medium">Mon</button>
                    <button className="px-6 py-3 bg-purple-100 text-purple-600 rounded-full font-medium">Tue</button>
                    <button className="px-6 py-3 bg-purple-100 text-purple-600 rounded-full font-medium">Wed</button>
                    <button className="px-6 py-3 bg-purple-100 text-purple-600 rounded-full font-medium">Thur</button>
                    <button className="px-6 py-3 bg-purple-100 text-purple-600 rounded-full font-medium">Fri</button>
                    <button className="px-6 py-3 bg-white border border-gray-300 text-gray-600 rounded-full font-medium">Sat</button>
                    <button className="px-6 py-3 bg-white border border-gray-300 text-gray-600 rounded-full font-medium">Sun</button>
                </div>
                <p className="text-sm text-gray-400">Selected 5 days per week</p>
            </div>

            {/* Week Start Day */}
            <div>
                <h3 className="text-sm font-medium text-gray-800 mb-1">Week Start Day</h3>
                <p className="text-sm text-gray-400 mb-4">
                    Choose whether your week starts on Monday or Sunday
                </p>

                <div className="w-1/4">
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        <option>Monday</option>
                        <option>Sunday</option>
                    </select>
                </div>
            </div>

            {/* Office Locations */}
            <div>
                <h3 className="text-sm font-medium text-gray-800 mb-1">Office Locations</h3>
                <p className="text-sm text-gray-400 mb-4">
                    Add office branches and map them to shifts and holiday calendar
                </p>

                {/* Office Location Card */}
                <div className="p-6 border-2 border-blue-400 rounded-lg mb-4">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                defaultValue="Headquarters"
                                className="text-base font-medium text-gray-800 bg-transparent border-none outline-none mb-2"
                            />
                            <p className="text-sm text-gray-600">123, Main St, Anytown, CA</p>
                        </div>
                        <button className="text-gray-600 hover:text-red-600 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-normal text-gray-800 mb-2">
                                Default Shift
                            </label>
                            <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                                <option>General</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-normal text-gray-800 mb-2">
                                Holiday Calendar
                            </label>
                            <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                                <option>India Holidays</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Add Office Button */}
                <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
                    Add Office +
                </button>
            </div>

            {/* Default Probation Period */}
            <div>
                <h3 className="text-sm font-medium text-gray-800 mb-1">Default Probation Period</h3>
                <p className="text-sm text-gray-400 mb-4">
                    Set the default probation period for new joiners
                </p>
            </div>
        </div>
    );
};

export default OrganizationSettings;
