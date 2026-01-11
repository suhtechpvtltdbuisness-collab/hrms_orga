import Toggle from './Toggle';
import DropdownIcon from './DropdownIcon';

const PayrollSettings = () => {
    return (
        <div className="space-y-8">
            {/* Payroll Frequency */}
            <div className="relative inline-block">
                <select className="appearance-none border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white w-[160px] h-[40px] px-4 pr-10">
                    <option>Monthly</option>
                    <option>Weekly</option>
                    <option>Bi-weekly</option>
                </select>
                <div className="absolute top-1/2 -translate-y-1/2 pointer-events-none right-3">
                    <DropdownIcon />
                </div>
            </div>

            {/* Salary Structure Templates */}
            <div>
                <h3 className="text-sm font-medium text-gray-800 mb-1">Salary Structure Templates</h3>
                <p className="text-sm text-gray-400 mb-4">
                    Create templates for different employee salary structures
                </p>

                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Add new salary template..."
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
                        Add Template +
                    </button>
                </div>
            </div>

            {/* Tax Deducted At Source (TDS) */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-800">Tax Deducted At Source (TDS)</h3>
                        <p className="text-sm text-gray-400 mt-1">
                            Enable automatic TDS calculation on employee salaries
                        </p>
                    </div>
                    <Toggle defaultChecked={true} />
                </div>

                <div className="w-1/3">
                    <label className="block text-sm font-normal text-gray-800 mb-2">
                        Default TDS Rate
                    </label>
                    <div className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-purple-500 w-full bg-white">
                        <input
                            type="text"
                            defaultValue="10"
                            className="w-[22px] text-sm outline-none border-none bg-transparent text-gray-800"
                        />
                        <span className="text-gray-400 text-sm whitespace-nowrap">% of gross salary</span>
                    </div>
                </div>
            </div>

            {/* Provident Fund (PF) */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-800">Provident Fund (PF)</h3>
                        <p className="text-sm text-gray-400 mt-1">
                            Enable provident fund deductions and contribution
                        </p>
                    </div>
                    <Toggle defaultChecked={true} />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-normal text-gray-800 mb-2">
                            Employee Contribution
                        </label>
                        <div className="flex items-center gap-1 px-4 py-2.5 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-purple-500 w-[400px] bg-white">
                            <input
                                type="text"
                                defaultValue="12"
                                className="w-[22px] text-sm outline-none border-none bg-transparent text-gray-800"
                            />
                            <span className="text-gray-400 text-sm">%</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-normal text-gray-800 mb-2">
                            Employer Contribution
                        </label>
                        <div className="flex items-center gap-1 px-4 py-2.5 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-purple-500 w-[400px] bg-white">
                            <input
                                type="text"
                                defaultValue="12"
                                className="w-[22px] text-sm outline-none border-none bg-transparent text-gray-800"
                            />
                            <span className="text-gray-400 text-sm">%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reimbursement Categories */}
            <div>
                <h3 className="text-sm font-medium text-gray-800 mb-1">Reimbursement Categories</h3>
                <p className="text-sm text-gray-400 mb-4">
                    Define expense categories eligible for employee reimbursement
                </p>

                {/* Category Item */}
                <div className="flex items-center gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
                    <input
                        type="text"
                        defaultValue="Medical"
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        readOnly
                    />
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Max:</span>
                        <input
                            type="text"
                            defaultValue="1000"
                            className="w-24 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                    <button className="text-gray-600 hover:text-red-600 transition-colors">×</button>
                </div>

                {/* Add New Category */}
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Add reimbursement category..."
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
                        Add Category +
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PayrollSettings;
