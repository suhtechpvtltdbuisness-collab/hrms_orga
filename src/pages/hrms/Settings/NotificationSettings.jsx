import Toggle from './Toggle';

const NotificationSettings = () => {
    return (
        <div className="space-y-8">
            {/* Email Notifications */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-medium text-gray-800">Email Notifications</h3>
                    <p className="text-sm text-gray-400 mt-1">
                        Enable or disable email notifications for system events
                    </p>
                </div>
                <Toggle defaultChecked={true} />
            </div>

            {/* Notification Events */}
            <div>
                <h3 className="text-sm font-medium text-gray-800 mb-1">Notification Events</h3>
                <p className="text-sm text-gray-400 mb-4">
                    Select which events should trigger notifications to relevant users
                </p>

                {/* Event Items */}
                <div className="space-y-3">
                    {/* New Hiring */}
                    <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                        <input type="checkbox" className="w-5 h-5 mt-0.5" defaultChecked />
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-800">New Hiring</h4>
                            <p className="text-sm text-gray-400 mt-1">When a new candidate is hired</p>
                        </div>
                    </div>

                    {/* Leave Applied */}
                    <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                        <input type="checkbox" className="w-5 h-5 mt-0.5" defaultChecked />
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-800">Leave Applied</h4>
                            <p className="text-sm text-gray-400 mt-1">When an employee submits a leave request</p>
                        </div>
                    </div>

                    {/* Leave Approved */}
                    <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                        <input type="checkbox" className="w-5 h-5 mt-0.5" defaultChecked />
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-800">Leave Approved</h4>
                            <p className="text-sm text-gray-400 mt-1">When a leave request is approved or rejected</p>
                        </div>
                    </div>

                    {/* Attendance Missed */}
                    <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                        <input type="checkbox" className="w-5 h-5 mt-0.5" defaultChecked />
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-800">Attendance Missed</h4>
                            <p className="text-sm text-gray-400 mt-1">When an employee misses attendance without leave</p>
                        </div>
                    </div>

                    {/* Task Assigned */}
                    <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                        <input type="checkbox" className="w-5 h-5 mt-0.5" defaultChecked />
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-800">Task Assigned</h4>
                            <p className="text-sm text-gray-400 mt-1">When a task is assigned to an employee</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notification Events - Second Section */}
            <div>
                <h3 className="text-sm font-medium text-gray-800 mb-1">Notification Events</h3>
                <p className="text-sm text-gray-400 mb-4">
                    Select which events should trigger notifications to relevant users
                </p>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start gap-4">
                        <input type="checkbox" className="w-5 h-5 mt-0.5" defaultChecked />
                        <div>
                            <h4 className="text-sm font-medium text-gray-800">New Hiring</h4>
                            <p className="text-sm text-gray-400 mt-1">When a new candidate is hired</p>
                        </div>
                    </div>
                    <Toggle defaultChecked={true} />
                </div>
            </div>
        </div>
    );
};

export default NotificationSettings;
