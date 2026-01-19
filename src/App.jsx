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
import TeamList from './pages/hrms/Employee/ReportingManager/TeamList';
import NewJobOpening from './pages/hrms/NewJobOpening/NewJobOpening';

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
          <Route path="/hrms/team-list" element={<TeamList />} />
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
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;