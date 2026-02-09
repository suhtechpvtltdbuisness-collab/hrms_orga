import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import HRMS from './pages/hrms';
import EmployeeList from './pages/hrms/Employee/EmployeeList/EmployeeList';
import AddEmployee from './pages/hrms/Employee/EmployeeTabs/AddEmployee';
import DepartmentList from './pages/hrms/Department/DepartmentList';
import Settings from './pages/hrms/Settings/Settings';
import DesignationList from './pages/hrms/Designation/DesignationList';

import './App.css';
import DepartmentDetails from './pages/hrms/Department/DepartmentViewDetails/DepartmentDetails';
import DepartmentOverview from './pages/hrms/Department/DepartmentViewDetails/DepartmentOverview';
import DepartmentEmployees from './pages/hrms/Department/DepartmentViewDetails/DepartmentEmployees';
import DepartmentOrgStructure from './pages/hrms/Department/DepartmentViewDetails/DepartmentOrgStructure';
import DepartmentSettings from './pages/hrms/Department/DepartmentViewDetails/DepartmentSettings';
import EmpUpdatePersonalInfo from './pages/hrms/Employee/EmployeeUpdateDetails/EmpUpdatePersonalInfo';
import ViewEmployee from './pages/hrms/Employee/EmployeeViewDetails/ViewEmployee';
import DesignationView from './pages/hrms/Designation/DesignationViewDetails/DesignationView';
import DesignationOverview from './pages/hrms/Designation/DesignationViewDetails/DesignationOverview';
import DesignationEmployees from './pages/hrms/Designation/DesignationViewDetails/DesignationEmployees';
import DesignationOrgStructure from './pages/hrms/Designation/DesignationViewDetails/DesignationOrgStructure';
import DesignationSettings from './pages/hrms/Designation/DesignationViewDetails/DesignationSettings';
// import DesignationUpdate from './pages/hrms/Designation/DesignationUpdateDetails/DesignationUpdate';
import OrganizationTree from './pages/hrms/Organization/OrganizationTree/OrganizationTree';
import NodeDetails from './pages/hrms/Organization/OrganizationTree/NodeDetails';
import Notifications from './pages/hrms/Notifications/Notifications';
import NewJobOpening from './pages/hrms/NewJobOpening/NewJobOpening';
import TeamList from './pages/hrms/OnboardedEmployeeList/ReportingManager/TeamList';
import OnboardedEmployeeList from './pages/hrms/OnboardedEmployeeList/OnboardedEmployeeList';
import AttendanceList from './pages/hrms/Attendance/AttendanceList';
import AddAttendance from './pages/hrms/Attendance/AddAttendance';
import EmployeeAttendanceTool from './pages/hrms/Attendance/EmployeeAttendanceTool';
import UploadAttendance from './pages/hrms/Attendance/UploadAttendance/UploadAttendance';
import RequestAttendance from './pages/hrms/Attendance/RequestAttendance/RequestAttendance';
import LeavePeriod from './pages/hrms/LeaveManagement/LeavePeriod';
import NewLeavePeriod from './pages/hrms/LeaveManagement/NewLeavePeriod';
import ShiftAssignment from './pages/hrms/ShiftManagement/ShiftAssignment';
import ShiftType from './pages/hrms/ShiftManagement/ShiftType';
import ShiftRequest from './pages/hrms/ShiftManagement/ShiftRequest';
import NewShiftRequest from './pages/hrms/ShiftManagement/NewShiftRequest';
import AppraisalTemplate from './pages/hrms/EmployeePerformance/AppraisalTemplate';
import NewAppraisalTemplate from './pages/hrms/EmployeePerformance/NewAppraisalTemplate';
import NewAppraisal from './pages/hrms/EmployeePerformance/NewAppraisal';
import EnergyPointLogList from './pages/hrms/EmployeePerformance/EnergyPointLogList';
import EnergyPointRule from './pages/hrms/EmployeePerformance/EnergyPointRule';
import NewEnergyPointRule from './pages/hrms/EmployeePerformance/NewEnergyPointRule';
import EnergyPointSettings from './pages/hrms/EmployeePerformance/EnergyPointSettings';
import ShiftTypeDetail from './pages/hrms/ShiftManagement/ShiftTypeDetail';
import SalaryComponent from './pages/hrms/Payroll/SalaryComponent';
import SalaryStructure from './pages/hrms/Payroll/SalaryStructure';
import SalaryStructureAssignment from './pages/hrms/Payroll/SalaryStructureAssignment';
import PayrollEntry from './pages/hrms/Payroll/PayrollEntry';
import SalarySlip from './pages/hrms/Payroll/SalarySlip';
import AdditionalSalary from './pages/hrms/Payroll/AdditionalSalary';
import PayrollAccounting from './pages/hrms/Payroll/PayrollAccounting';
import BankIntegration from './pages/hrms/Payroll/BankIntegration';

function App() {
  return (
    <Router>
      <Toaster />
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/hrms" replace />} />
          <Route path="/hrms" element={<HRMS />} />
          <Route path="/hrms/departments" element={<DepartmentList />} />
          <Route path="/hrms/designations" element={<DesignationList />} />
          <Route path="/hrms/employees" element={<EmployeeList />} />
          <Route path="/hrms/employees/add" element={<AddEmployee />} />
          <Route path="/hrms/settings" element={<Settings />} />
          <Route path="/hrms/employees-details" element={<Navigate to="/hrms/employees-details/personal-information" />} />
          <Route path="/hrms/employees-details-update" element={<EmpUpdatePersonalInfo />} />
          <Route path="/hrms/notifications" element={<Notifications />} />
          {/* Add other routes here */}
          <Route path="/hrms/employees/add/:tab" element={<AddEmployee />} />
          <Route path="/hrms/department-details" element={<DepartmentDetails />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<DepartmentOverview />} />
            <Route path="employees" element={<DepartmentEmployees />} />
            <Route path="org-structure" element={<DepartmentOrgStructure />} />
            <Route path="settings" element={<DepartmentSettings />} />

          </Route>

          <Route
            path="/hrms/organization-tree"
            element={<OrganizationTree />}



          />
          <Route
            path="/hrms/organization-tree/node-details"
            element={<NodeDetails />}
          />
          <Route path="/hrms/designation-details" element={<DesignationView />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<DesignationOverview />} />
            <Route path="employees" element={<DesignationEmployees />} />
            <Route path="org-structure" element={<DesignationOrgStructure />} />
            <Route path="settings" element={<DesignationSettings />} />
          </Route>
          <Route path="/hrms/job-opening/new" element={<NewJobOpening />} />
          <Route path="/hrms/employees-details/:tab" element={<ViewEmployee />} />


          {/* Onboarding Employee List */}
          <Route path="/hrms/onboarded-employee-list" element={<OnboardedEmployeeList />} />
          <Route path="/hrms/onboarded-employee-list/team-list" element={<TeamList />} />

          {/* Attendance Route */}
          <Route path="/hrms/attendance" element={<AttendanceList />} />
          <Route path="/hrms/attendance/add" element={<AddAttendance />} />
          <Route path="/hrms/employee-attendance-tool" element={<EmployeeAttendanceTool />} />
          <Route path="/hrms/upload-attendance" element={<UploadAttendance />} />
          <Route path="/hrms/request-attendance" element={<RequestAttendance />} />
          
          {/* Leave Management */}
          <Route path="/hrms/leave-period" element={<LeavePeriod />} />
          <Route path="/hrms/leave-period/new" element={<NewLeavePeriod />} />

          {/* Shift Management */}
          <Route path="/hrms/shift-assignment" element={<ShiftAssignment />} />
          <Route path="/hrms/shift-type" element={<ShiftType />} />
          <Route path="/hrms/shift-type/new" element={<ShiftTypeDetail />} />
          <Route path="/hrms/shift-type/:id" element={<ShiftTypeDetail />} />
          <Route path="/hrms/salary-component" element={<SalaryComponent />} />
          <Route path="/hrms/salary-structure" element={<SalaryStructure />} />

          <Route path="/hrms/salary-structure-assignment" element={<SalaryStructureAssignment />} />
          <Route path="/hrms/payroll-entry" element={<PayrollEntry />} />
          <Route path="/hrms/salary-slip" element={<SalarySlip />} />
          <Route path="/hrms/shift-request" element={<ShiftRequest />} />
          <Route path="/hrms/shift-request/new" element={<NewShiftRequest />} />
          <Route path="/hrms/appraisal-template" element={<AppraisalTemplate />} />
          <Route path="/hrms/appraisal-template/new" element={<NewAppraisalTemplate />} />
          <Route path="/hrms/appraisal/new" element={<NewAppraisal />} />
          <Route path="/hrms/energy-point-log" element={<EnergyPointLogList />} />
          <Route path="/hrms/energy-point-rule" element={<EnergyPointRule />} />
          <Route path="/hrms/energy-point-rule/new" element={<NewEnergyPointRule />} />
          <Route path="/hrms/energy-point-setting" element={<EnergyPointSettings />} />
          <Route path="/hrms/additional-salary" element={<AdditionalSalary />} />
          <Route path="/hrms/payroll-accounting" element={<PayrollAccounting />} />
          <Route path="/hrms/bank-integration" element={<BankIntegration />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;