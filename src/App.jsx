import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./pages/hrms/AuthPage";
import HRMS from "./pages/hrms";

// Only import files that definitely exist
import EmployeeList from "./pages/hrms/Employee/EmployeeList/EmployeeList";
import AddEmployee from "./pages/hrms/Employee/EmployeeTabs/AddEmployee";
import DepartmentList from "./pages/hrms/Department/DepartmentList";
import DesignationList from "./pages/hrms/Designation/DesignationList";
import Settings from "./pages/hrms/Settings/Settings";

import "./App.css";

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

          {/* Department */}
          <Route path="departments" element={<DepartmentList />} />

          {/* Designation */}
          <Route path="designations" element={<DesignationList />} />

          {/* Settings */}
          <Route path="settings" element={<Settings />} />

          {/* 
            ===================================================
            ADD YOUR OTHER ROUTES HERE AS YOU CREATE THE FILES
            ===================================================
            
            Example:
            <Route path="attendance" element={<AttendanceList />} />
            <Route path="notifications" element={<Notifications />} />
            etc.
          */}
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
