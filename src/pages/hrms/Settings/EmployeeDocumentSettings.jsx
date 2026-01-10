const EmployeeDocumentSettings = () => {
    return (
        <div className="space-y-8">
            {/* Required Document Types */}
            <div>
                <h3 className="text-sm font-medium text-gray-800 mb-1">Required Document Types</h3>
                <p className="text-sm text-gray-400 mb-4">
                    Define documents required for joining and periodic verification
                </p>

                {/* Document Item */}
                <div className="flex items-center gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
                    <input
                        type="text"
                        defaultValue="Aadhar Card"
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <label className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4" defaultChecked />
                        <span className="text-sm text-gray-600">Mandatory</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4" />
                        <span className="text-sm text-gray-600">Periodic</span>
                    </label>
                    <button className="text-gray-600 hover:text-red-600 transition-colors">×</button>
                </div>

                {/* Add New Document */}
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Document Name (eg: Aadhar, PAN, Resume)"
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
                        Add Document +
                    </button>
                </div>
            </div>

            {/* Expiry Reminder Settings */}
            <div>
                <h3 className="text-sm font-medium text-gray-800 mb-1">Expiry Reminder Settings</h3>
                <p className="text-sm text-gray-400 mb-4">
                    Set reminders for documents that need renewal (Contract, Visa, ID proof)
                </p>

                {/* Reminder Item */}
                <div className="flex items-center gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
                    <input
                        type="text"
                        defaultValue="Passport"
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Remind</span>
                        <input
                            type="text"
                            defaultValue="60"
                            className="w-20 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <span className="text-sm text-gray-600">days before</span>
                    </div>
                    <button className="text-gray-600 hover:text-red-600 transition-colors">×</button>
                </div>

                {/* Add New Reminder */}
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Document Type(eg: Contract, Visa, Passport)"
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <input
                        type="text"
                        defaultValue="30"
                        className="w-20 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
                        Add Document +
                    </button>
                </div>
            </div>

            {/* File Upload Restrictions */}
            <div>
                <h3 className="text-sm font-medium text-gray-800 mb-1">File Upload Restrictions</h3>
                <p className="text-sm text-gray-400 mb-4">
                    Define allowed file formats and maximum file size limits
                </p>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-normal text-gray-800 mb-2">
                            Allowed File Formats
                        </label>
                        <input
                            type="text"
                            defaultValue="pdf, docx, jpg, png"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-normal text-gray-800 mb-2">
                            Minimum File Size
                        </label>
                        <input
                            type="text"
                            defaultValue="5"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDocumentSettings;
