import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { lazy, Suspense } from "react";

import AppShell from "./components/templates/AppShell/AppShell";
import { authService } from "./services/authService";

// ==========================================
// LAZY LOADED PAGES
// ==========================================

const Dashboard = lazy(
  () => import("./pages/Dashboard/Dashboard")
);

const Employees = lazy(
  () => import("./pages/Employees/Employees")
);

const EmployeeDetails = lazy(
  () => import("./pages/EmployeeDetails/EmployeeDetails")
);

const Departments = lazy(
  () => import("./pages/Departments/Departments")
);

const Attendance = lazy(
  () => import("./pages/Attendance/Attendance")
);

const Leave = lazy(
  () => import("./pages/Leave/Leave")
);

const Payroll = lazy(
  () => import("./pages/Payroll/Payroll")
);

const Performance = lazy(
  () => import("./pages/Performance/Performance")
);

const Reports = lazy(
  () => import("./pages/Reports/Reports")
);

const Notifications = lazy(
  () => import("./pages/Notifications/Notifications")
);

const Settings = lazy(
  () => import("./pages/Settings/Settings")
);

const Help = lazy(
  () => import("./pages/Help/Help")
);

const Login = lazy(
  () => import("./pages/Login/Login")
);

const Register = lazy(
  () => import("./pages/Register/Register")
);

const NotFound = lazy(
  () => import("./pages/NotFound/NotFound")
);

// ==========================================
// PAGE LOADING COMPONENT
// ==========================================

function PageLoader() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "14px",
        color: "#64748b",
      }}
    >
      Loading...
    </div>
  );
}

// ==========================================
// PROTECTED ROUTE
// ==========================================

function ProtectedRoute({ children }) {
  const location = useLocation();

  return authService.isAuthenticated() ? (
    children
  ) : (
    <Navigate
      to="/login"
      replace
      state={{
        from: location.pathname,
      }}
    />
  );
}

// ==========================================
// APP
// ==========================================

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>

        {/* ======================================
            PUBLIC ROUTES
        ====================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* ======================================
            PROTECTED ROUTES
        ====================================== */}

        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >

          {/* Default */}
          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* Employees */}
          <Route
            path="/employees"
            element={<Employees />}
          />

          <Route
            path="/employees/:id"
            element={<EmployeeDetails />}
          />

          {/* Departments */}
          <Route
            path="/departments"
            element={<Departments />}
          />

          {/* Attendance */}
          <Route
            path="/attendance"
            element={<Attendance />}
          />

          {/* Leave */}
          <Route
            path="/leave"
            element={<Leave />}
          />

          {/* Payroll */}
          <Route
            path="/payroll"
            element={<Payroll />}
          />

          {/* Performance */}
          <Route
            path="/performance"
            element={<Performance />}
          />

          {/* Reports */}
          <Route
            path="/reports"
            element={<Reports />}
          />

          {/* Notifications */}
          <Route
            path="/notifications"
            element={<Notifications />}
          />

          {/* Settings */}
          <Route
            path="/settings"
            element={<Settings />}
          />

          {/* Help */}
          <Route
            path="/help"
            element={<Help />}
          />

          {/* 404 */}
          <Route
            path="*"
            element={<NotFound />}
          />

        </Route>

      </Routes>
    </Suspense>
  );
}