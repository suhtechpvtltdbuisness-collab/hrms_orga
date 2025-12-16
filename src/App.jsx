import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HRMS from './pages/hrms';
import EmployeeList from './pages/hrms/EmployeeList/EmployeeList';
import AddEmployee from './pages/hrms/EmployeeTabs/AddEmployee';
import DepartmentList from './pages/hrms/Department/DepartmentList';

import './App.css';
import EmpPersonalInfo from './pages/hrms/EmployeeViewDetails/EmpPersonalInfo';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/hrms" replace />} />
          <Route path="/hrms" element={<HRMS />} />
          <Route path="/hrms/departments" element={<DepartmentList />} />
          <Route path="/hrms/employees" element={<EmployeeList />} />
          <Route path="/hrms/employees/add" element={<AddEmployee />} />
          
          <Route path="/hrms/employee-details" element={<EmpPersonalInfo />} />
          {/* Add other routes here */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
