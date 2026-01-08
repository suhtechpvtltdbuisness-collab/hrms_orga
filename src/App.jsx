import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import HRMS from './pages/hrms';
import EmployeeList from './pages/hrms/EmployeeList/EmployeeList';
import AddEmployee from './pages/hrms/EmployeeTabs/AddEmployee';
import DepartmentList from './pages/hrms/Department/DepartmentList';

import './App.css';
import DepartmentDetails from './pages/hrms/Department/DepartmentViewDetails/DepartmentDetails';
import EmpPersonalInfo from './pages/hrms/EmployeeViewDetails/EmpPersonalInfo';
import EmpUpdatePersonalInfo from './pages/hrms/EmployeeUpdateDetails/EmpUpdatePersonalInfo';
import ViewEmployee from './pages/hrms/EmployeeViewDetails/ViewEmployee';

function App() {
  return (
    <Router>
      <Toaster />
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/hrms" replace />} />
          <Route path="/hrms" element={<HRMS />} />
          <Route path="/hrms/departments" element={<DepartmentList />} />
          <Route path="/hrms/employees" element={<EmployeeList />} />
          <Route path="/hrms/employees/add" element={<AddEmployee />} />
          {/* <Route path="/hrms/employees-details" element={<EmpPersonalInfo />} /> */}
          <Route path="/hrms/employees-details" element={<Navigate to="/hrms/employees-details/personal-information" />} />
          <Route path="/hrms/employees-details-update" element={<EmpUpdatePersonalInfo />} />
          {/* Add other routes here */}
          <Route path="/hrms/employees/add/:tab" element={<AddEmployee />} />
          <Route path="/hrms/department-details" element={<DepartmentDetails />} />
          <Route path="/hrms/employees-details/:tab" element={<ViewEmployee />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;