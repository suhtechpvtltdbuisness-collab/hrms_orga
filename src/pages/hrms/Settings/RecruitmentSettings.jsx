const RecruitmentSettings = () => {
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
                    <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded text-sm font-medium">1</span>
                    <input
                        type="text"
                        defaultValue="Screening"
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <input
                        type="text"
                        defaultValue="2"
                        className="w-20 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <span className="text-sm text-gray-600">days</span>
                    <button className="text-gray-600 hover:text-red-600 transition-colors">×</button>
                </div>

                {/* Add New Stage */}
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Stage Name......"
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <input
                        type="text"
                        defaultValue="1"
                        className="w-20 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
                        Add Stage +
                    </button>
                </div>
            </div>

            {/* Interview Panel Assignment Rules */}
            <div>
                <h3 className="text-sm font-medium text-gray-800 mb-1">Interview Panel Assignment Rules</h3>
                <p className="text-sm text-gray-400 mb-4">
                    Assign interviewers or panels automatically based on job role or department
                </p>

                <div className="flex items-center gap-4">
                    <select className="w-1/3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        <option>Select department</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Interviewer names (coma separated)"
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
                        Add Rule +
                    </button>
                </div>
            </div>

            {/* Automated Email Templates */}
            <div>
                <h3 className="text-sm font-medium text-gray-800 mb-1">Automated Email Templates</h3>
                <p className="text-sm text-gray-400 mb-4">
                    Customize automated emails sent during the recruitment process
                </p>

                {/* Interview Invitation */}
                <div className="mb-6 p-4 border border-gray-200 rounded-xl bg-white space-y-3">
                    <label className="block text-sm font-medium text-gray-800 mb-1">
                        Interview Invitation
                    </label>
                    <input
                        type="text"
                        defaultValue="Interview Invitation- UI/UX Designer"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <textarea
                        placeholder="Enter mail"
                        rows="6"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    ></textarea>
                </div>

                {/* Rejection Email */}
                <div className="p-4 border border-gray-200 rounded-xl bg-white space-y-3">
                    <label className="block text-sm font-normal text-gray-800 mb-1">
                        Rejection Email
                    </label>
                    <input
                        type="text"
                        placeholder="Subject: Rejection Email"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <textarea
                        placeholder="Enter rejection email content..."
                        rows="6"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    ></textarea>
                </div>
            </div>
        </div>
    );
};

export default RecruitmentSettings;
