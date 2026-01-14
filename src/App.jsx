import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";

import HRMS from "./pages/hrms";
import EmployeeList from "./pages/hrms/EmployeeList/EmployeeList";
import AddEmployee from "./pages/hrms/EmployeeTabs/AddEmployee";
import DepartmentList from "./pages/hrms/Department/DepartmentList";
import OrganizationTree from "./pages/hrms/OrganizationTree/OrganizationTree";
import NodeDetails from "./pages/hrms/OrganizationTree/NodeDetails";
import ViewEmployee from "./pages/hrms/EmployeeViewDetails/ViewEmployee";
import EmpUpdatePersonalInfo from "./pages/hrms/EmployeeUpdateDetails/EmpUpdatePersonalInfo";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Root */}
        <Route path="/" element={<Navigate to="/hrms" replace />} />

        {/* Layout wrapper */}
        <Route element={<Layout />}>

          {/* ================= HRMS ================= */}
          <Route path="/hrms" element={<HRMS />} />

          {/* ================= Organization Tree ================= */}
          <Route
            path="/hrms/organization-tree"
            element={<OrganizationTree />}
          />
          <Route
            path="/hrms/organization-tree/node-details"
            element={<NodeDetails />}
          />

          {/* ================= Department ================= */}
          <Route
            path="/hrms/departments"
            element={<DepartmentList />}
          />

          {/* ================= Employee List ================= */}
          <Route
            path="/hrms/employees"
            element={<EmployeeList />}
          />

          {/* ================= Add Employee (TABS) ================= */}
          <Route
            path="/hrms/employees/add"
            element={<AddEmployee />}
          />
          <Route
            path="/hrms/employees/add/:tab"
            element={<AddEmployee />}
          />

          {/* ================= View Employee (TABS) ================= */}
          <Route
            path="/hrms/employees-details"
            element={
              <Navigate
                to="/hrms/employees-details/personal-information"
                replace
              />
            }
          />
          <Route
            path="/hrms/employees-details/:tab"
            element={<ViewEmployee />}
          />

          {/* ================= Update Employee ================= */}
          <Route
            path="/hrms/employees-details-update"
            element={<EmpUpdatePersonalInfo />}
          />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
