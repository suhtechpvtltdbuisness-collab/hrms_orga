import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/layout/Layout";
import HRMS from "./pages/hrms";
import EmployeeList from "./pages/hrms/Employee/EmployeeList/EmployeeList";
import AddEmployee from "./pages/hrms/Employee/EmployeeTabs/AddEmployee";
import DepartmentList from "./pages/hrms/Department/DepartmentList";
import Settings from "./pages/hrms/Settings/Settings";
import DesignationList from "./pages/hrms/Designation/DesignationList";

import "./App.css";
import DepartmentDetails from "./pages/hrms/Department/DepartmentViewDetails/DepartmentDetails";
import DepartmentOverview from "./pages/hrms/Department/DepartmentViewDetails/DepartmentOverview";
import DepartmentEmployees from "./pages/hrms/Department/DepartmentViewDetails/DepartmentEmployees";
import DepartmentOrgStructure from "./pages/hrms/Department/DepartmentViewDetails/DepartmentOrgStructure";
import DepartmentSettings from "./pages/hrms/Department/DepartmentViewDetails/DepartmentSettings";
import EmpUpdatePersonalInfo from "./pages/hrms/Employee/EmployeeUpdateDetails/EmpUpdatePersonalInfo";
import ViewEmployee from "./pages/hrms/Employee/EmployeeViewDetails/ViewEmployee";
import DesignationView from "./pages/hrms/Designation/DesignationViewDetails/DesignationView";
import DesignationOverview from "./pages/hrms/Designation/DesignationViewDetails/DesignationOverview";
import DesignationEmployees from "./pages/hrms/Designation/DesignationViewDetails/DesignationEmployees";
import DesignationOrgStructure from "./pages/hrms/Designation/DesignationViewDetails/DesignationOrgStructure";
import DesignationSettings from "./pages/hrms/Designation/DesignationViewDetails/DesignationSettings";
// import DesignationUpdate from './pages/hrms/Designation/DesignationUpdateDetails/DesignationUpdate';
import OrganizationTree from "./pages/hrms/Organization/OrganizationTree/OrganizationTree";
import NodeDetails from "./pages/hrms/Organization/OrganizationTree/NodeDetails";
import Notifications from "./pages/hrms/Notifications/Notifications";
import NewJobOpening from "./pages/hrms/NewJobOpening/NewJobOpening";
import TeamList from "./pages/hrms/OnboardedEmployeeList/ReportingManager/TeamList";
import OnboardedEmployeeList from "./pages/hrms/OnboardedEmployeeList/OnboardedEmployeeList";
import NewHiring from "./pages/hrms/NewHiring/NewHiring";
import ATSScreening from "./pages/hrms/ATSScreening/ATSScreening";
import ScheduleInterview from "./pages/hrms/ScheduleInterview/ScheduleInterview";
import ScheduleInterviewList from "./pages/hrms/ScheduleInterview/ScheduleInterviewList";
import ScheduledInterviewDetails from "./pages/hrms/ScheduleInterview/ScheduledInterviewDetails";
import InterviewResult from "./pages/hrms/ScheduleInterview/InterviewResult";
import OfferLetterAcceptedList from "./pages/hrms/NewHiring/OfferLetterAcceptedList";
import NewOnboarding from "./pages/hrms/NewHiring/NewOnboarding";
import AttendanceList from "./pages/hrms/Attendance/AttendanceList";
import AddAttendance from "./pages/hrms/Attendance/AddAttendance";
import EmployeeAttendanceTool from "./pages/hrms/Attendance/EmployeeAttendanceTool";
import UploadAttendance from "./pages/hrms/Attendance/UploadAttendance/UploadAttendance";
import RequestAttendance from "./pages/hrms/Attendance/RequestAttendance/RequestAttendance";
import LeavePeriod from "./pages/hrms/LeaveManagement/LeavePeriod";
import NewLeavePeriod from "./pages/hrms/LeaveManagement/NewLeavePeriod";
import ShiftAssignment from "./pages/hrms/ShiftManagement/ShiftAssignment";
import ShiftType from "./pages/hrms/ShiftManagement/ShiftType";
import ShiftRequest from "./pages/hrms/ShiftManagement/ShiftRequest";
import NewShiftRequest from "./pages/hrms/ShiftManagement/NewShiftRequest";
import AppraisalTemplate from "./pages/hrms/EmployeePerformance/AppraisalTemplate";
import NewAppraisalTemplate from "./pages/hrms/EmployeePerformance/NewAppraisalTemplate";
import NewAppraisal from "./pages/hrms/EmployeePerformance/NewAppraisal";
import EnergyPointLogList from "./pages/hrms/EmployeePerformance/EnergyPointLogList";
import EnergyPointRule from "./pages/hrms/EmployeePerformance/EnergyPointRule";
import NewEnergyPointRule from "./pages/hrms/EmployeePerformance/NewEnergyPointRule";
import EnergyPointSettings from "./pages/hrms/EmployeePerformance/EnergyPointSettings";
import ShiftTypeDetail from "./pages/hrms/ShiftManagement/ShiftTypeDetail";
import SalaryComponent from "./pages/hrms/Payroll/SalaryComponent";
import SalaryStructure from "./pages/hrms/Payroll/SalaryStructure";
import SalaryStructureAssignment from "./pages/hrms/Payroll/SalaryStructureAssignment";
import PayrollEntry from "./pages/hrms/Payroll/PayrollEntry";
import SalarySlip from "./pages/hrms/Payroll/SalarySlip";
import AdditionalSalary from "./pages/hrms/Payroll/AdditionalSalary";
import PayrollAccounting from "./pages/hrms/Payroll/PayrollAccounting";
import BankIntegration from "./pages/hrms/Payroll/BankIntegration";
//ACCOUNTS
// Chart of Accounts
import ChartOfAccounts from "./pages/hrms/accounts/chartOfAccounts/ChartOfAccounts";
import AddAccount from "./pages/hrms/accounts/chartOfAccounts/AddAccount";
import AccountLedger from "./pages/hrms/accounts/chartOfAccounts/AccountLedger";
// Bank & Cash
import BankAndCashAccount from "./pages/hrms/accounts/BankAndCash/BankAndCashAccount";
import AddBankAccount from "./pages/hrms/accounts/BankAndCash/AddBankAccount";
// Journal
import JournalEntry from "./pages/hrms/accounts/Journal/JournalEntry";
import AddJournalEntry from "./pages/hrms/accounts/Journal/AddJournalEntry";

// Expense
import Expense from "./pages/hrms/Expenses/Expense/Expense";
import AddExpense from "./pages/hrms/Expenses/Expense/AddExpense";
import ExpenseCategory from "./pages/hrms/Expenses/ExpenseCategory/ExpenseCategory";
import AddExpenseCategory from "./pages/hrms/Expenses/ExpenseCategory/AddExpenseCategory";
import ReimbursementCycle from "./pages/hrms/Expenses/ReimbursementCycle/ReimbursementCycle";
import PendingApprovals from "./pages/hrms/Expenses/PendingApprovals/PendingApprovals";

//Invoice
import SalesInvoice from "./pages/hrms/Invoices/SalesInvoice/SalesInvoice";
import AddSalesInvoice from "./pages/hrms/Invoices/SalesInvoice/AddSalesInvoice";
import PurchaseInvoice from "./pages/hrms/Invoices/PurchaseInvoice/PurchaseInvoice";
import AddPurchaseInvoice from "./pages/hrms/Invoices/PurchaseInvoice/AddPurchaseInvoice";
import RecurringInvoice from "./pages/hrms/Invoices/RecurringInvoice/RecurringInvoice";
import AddRecurringInvoice from "./pages/hrms/Invoices/RecurringInvoice/AddRecurringInvoice";
import InvoicePaymentAllocation from "./pages/hrms/Invoices/InvoicePaymentAllocation/InvoicePaymentAllocation";
import RecordPayment from "./pages/hrms/Invoices/InvoicePaymentAllocation/RecordPayment";

// Auth components
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./pages/hrms/AuthPage";

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        {/* ================= AUTH PAGE ================= */}
        <Route path="/auth" element={<AuthPage />} />

        {/* ================= PROTECTED HRMS ROUTES ================= */}
        <Route
          path="/hrms/*"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route index element={<HRMS />} />

          {/* Employee */}
          <Route path="employees" element={<EmployeeList />} />
          <Route path="employees/add" element={<AddEmployee />} />
          <Route path="employees/add/:tab" element={<AddEmployee />} />
          <Route
            path="employees-details/:id"
            element={
              <Navigate to="personal-information" />
            }
          />
          <Route path="employees-details/:id/:tab" element={<ViewEmployee />} />
          <Route
            path="employees-details-update"
            element={<EmpUpdatePersonalInfo />}
          />

          {/* Department */}
          <Route path="departments" element={<DepartmentList />} />
          <Route path="department-details" element={<DepartmentDetails />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<DepartmentOverview />} />
            <Route path="employees" element={<DepartmentEmployees />} />
            <Route path="org-structure" element={<DepartmentOrgStructure />} />
            <Route path="settings" element={<DepartmentSettings />} />
          </Route>

          {/* Designation */}
          <Route path="designations" element={<DesignationList />} />
          <Route path="designation-details" element={<DesignationView />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<DesignationOverview />} />
            <Route path="employees" element={<DesignationEmployees />} />
            <Route path="org-structure" element={<DesignationOrgStructure />} />
            <Route path="settings" element={<DesignationSettings />} />
          </Route>

          {/* Organization */}
          <Route path="organization-tree" element={<OrganizationTree />} />
          <Route
            path="organization-tree/node-details"
            element={<NodeDetails />}
          />

          {/* Job Opening */}
          <Route path="job-opening/new" element={<NewJobOpening />} />

          {/* New Hiring */}
          <Route path="new-hiring" element={<NewHiring />} />
          <Route path="ats-screening" element={<ATSScreening />} />
          <Route path="schedule-interview" element={<ScheduleInterview />} />
          <Route path="schedule-interview-list" element={<ScheduleInterviewList />} />
          <Route path="scheduled-interview/:id" element={<ScheduledInterviewDetails />} />
          <Route path="interview-result/:id" element={<InterviewResult />} />
          <Route path="offer-letter-accepted-list" element={<OfferLetterAcceptedList />} />
          <Route path="new-onboarding" element={<NewOnboarding />} />

          {/* Onboarding Employee */}
          <Route
            path="onboarded-employee-list"
            element={<OnboardedEmployeeList />}
          />
          <Route
            path="onboarded-employee-list/team-list"
            element={<TeamList />}
          />

          {/* Attendance */}
          <Route path="attendance" element={<AttendanceList />} />
          <Route path="attendance/add" element={<AddAttendance />} />
          <Route
            path="employee-attendance-tool"
            element={<EmployeeAttendanceTool />}
          />
          <Route path="upload-attendance" element={<UploadAttendance />} />
          <Route path="request-attendance" element={<RequestAttendance />} />

          {/* Leave Management */}
          <Route path="leave-period" element={<LeavePeriod />} />
          <Route path="leave-period/new" element={<NewLeavePeriod />} />

          {/* Shift Management */}
          <Route path="shift-assignment" element={<ShiftAssignment />} />
          <Route path="shift-type" element={<ShiftType />} />
          <Route path="shift-type/new" element={<ShiftTypeDetail />} />
          <Route path="shift-type/:id" element={<ShiftTypeDetail />} />
          <Route path="shift-request" element={<ShiftRequest />} />
          <Route path="shift-request/new" element={<NewShiftRequest />} />

          {/* Payroll */}
          <Route path="salary-component" element={<SalaryComponent />} />
          <Route path="salary-structure" element={<SalaryStructure />} />
          <Route
            path="salary-structure-assignment"
            element={<SalaryStructureAssignment />}
          />
          <Route path="payroll-entry" element={<PayrollEntry />} />
          <Route path="salary-slip" element={<SalarySlip />} />
          <Route path="additional-salary" element={<AdditionalSalary />} />
          <Route path="payroll-accounting" element={<PayrollAccounting />} />
          <Route path="bank-integration" element={<BankIntegration />} />

          {/* Employee Performance */}
          <Route path="appraisal-template" element={<AppraisalTemplate />} />
          <Route
            path="appraisal-template/new"
            element={<NewAppraisalTemplate />}
          />
          <Route path="appraisal/new" element={<NewAppraisal />} />
          <Route path="energy-point-log" element={<EnergyPointLogList />} />
          <Route path="energy-point-rule" element={<EnergyPointRule />} />
          <Route
            path="energy-point-rule/new"
            element={<NewEnergyPointRule />}
          />
          <Route
            path="energy-point-setting"
            element={<EnergyPointSettings />}
          />

          {/* Accounts - Chart of Accounts */}
          <Route path="chart-of-accounts" element={<ChartOfAccounts />} />
          <Route path="chart-of-accounts/add" element={<AddAccount />} />
          <Route path="chart-of-accounts/ledger" element={<AccountLedger />} />

          {/* Accounts - Bank and Cash */}
          <Route path="bank-and-cash" element={<BankAndCashAccount />} />
          <Route path="bank-and-cash/add" element={<AddBankAccount />} />

          {/* Accounts - Journal */}
          <Route path="journal-entry" element={<JournalEntry />} />
          <Route path="journal-entry/add" element={<AddJournalEntry />} />
          <Route path="journal-entry/edit/:id" element={<AddJournalEntry />} />

          {/* Expenses */}
          <Route path="expenses/expense" element={<Expense />} />
          <Route path="expenses/expense/new" element={<AddExpense />} />
          <Route path="expenses/expense/:id" element={<AddExpense />} />
          <Route path="expenses/category" element={<ExpenseCategory />} />
          <Route
            path="expenses/category/new"
            element={<AddExpenseCategory />}
          />
          <Route
            path="expenses/category/:id"
            element={<AddExpenseCategory />}
          />
          <Route
            path="expenses/reimbursement"
            element={<ReimbursementCycle />}
          />
          <Route
            path="expenses/pending-approvals"
            element={<PendingApprovals />}
          />

          {/* Sales Invoices */}
          <Route path="sales-invoice" element={<SalesInvoice />} />
          <Route path="sales-invoice/new" element={<AddSalesInvoice />} />
          <Route path="sales-invoice/view/:id" element={<AddSalesInvoice />} />
          <Route path="sales-invoice/edit/:id" element={<AddSalesInvoice />} />

          {/* Purchase Invoices */}
          <Route path="purchase-invoice" element={<PurchaseInvoice />} />
          <Route path="purchase-invoice/new" element={<AddPurchaseInvoice />} />
          <Route
            path="purchase-invoice/view/:id"
            element={<AddPurchaseInvoice />}
          />
          <Route
            path="purchase-invoice/edit/:id"
            element={<AddPurchaseInvoice />}
          />

          {/* Recurring Invoices */}
          <Route path="recurring-invoice" element={<RecurringInvoice />} />
          <Route
            path="recurring-invoice/new"
            element={<AddRecurringInvoice />}
          />
          <Route
            path="recurring-invoice/view/:id"
            element={<AddRecurringInvoice />}
          />
          <Route
            path="recurring-invoice/edit/:id"
            element={<AddRecurringInvoice />}
          />

          {/* Invoice Payment Allocation */}
          <Route
            path="invoice-payment-allocation"
            element={<InvoicePaymentAllocation />}
          />
          <Route
            path="invoice-payment-allocation/new"
            element={<RecordPayment />}
          />
          <Route
            path="invoice-payment-allocation/view/:id"
            element={<RecordPayment />}
          />
          <Route
            path="invoice-payment-allocation/edit/:id"
            element={<RecordPayment />}
          />

          {/* Notifications */}
          <Route path="notifications" element={<Notifications />} />

          {/* Settings */}
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* ================= DEFAULT ROUTE ================= */}
        <Route path="/" element={<Navigate to="/auth" replace />} />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
