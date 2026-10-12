import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

import { employeesService } from "../services/employeeService";
import { departmentsService } from "../services/departmentService";
import { attendanceService } from "../services/attendanceService";
import { leaveService } from "../services/leaveService";
import { payrollService } from "../services/payrollService";
import { performanceService } from "../services/performanceService";
import { notificationsService } from "../services/notificationService";
import { reportsService } from "../services/reportService";

const AppContext = createContext(null);

// ==============================
// DATA MAPPERS
// ==============================

const mapEmployee = (employee) => ({
  ...employee,
  department: employee.departmentName || "Unassigned",
  performanceScore: Number(employee.performanceScore || 0),
});

const mapDepartment = (department) => ({
  ...department,
  employees: Number(department.employeeCount || 0),
});

const mapNotification = (notification) => ({
  ...notification,
  read: Boolean(notification.isRead),
});

// ==============================
// APP PROVIDER
// ==============================

export function AppProvider({ children }) {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [dashboardSummary, setDashboardSummary] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==============================
  // COMMON API LOADER
  // ==============================

  const runLoad = useCallback(
    async (request, setter, mapper = (data) => data) => {
      setLoading(true);
      setError("");

      try {
        const data = await request();

        setter(mapper(data ?? []));

        return data;
      } catch (err) {
        const message =
          err?.message || "Failed to load data.";

        setError(message);

        console.error("API error:", message);

        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ==============================
  // EMPLOYEES
  // ==============================

  const loadEmployees = useCallback(
    () =>
      runLoad(
        () => employeesService.getAll(),
        setEmployees,
        (data) =>
          (Array.isArray(data) ? data : []).map(
            mapEmployee
          )
      ),
    [runLoad]
  );

  // ==============================
  // DEPARTMENTS
  // ==============================

  const loadDepartments = useCallback(
    () =>
      runLoad(
        () => departmentsService.getAll(),
        setDepartments,
        (data) =>
          (Array.isArray(data) ? data : []).map(
            mapDepartment
          )
      ),
    [runLoad]
  );

  // ==============================
  // ATTENDANCE
  // ==============================

  const loadAttendance = useCallback(
    () =>
      runLoad(
        () => attendanceService.getAll(),
        setAttendance
      ),
    [runLoad]
  );

  // ==============================
  // LEAVES
  // ==============================

  const loadLeaves = useCallback(
    () =>
      runLoad(
        () => leaveService.getAll(),
        setLeaves
      ),
    [runLoad]
  );

  // ==============================
  // PAYROLL
  // ==============================

  const loadPayroll = useCallback(
    (pageNumber = 1, pageSize = 10) =>
      runLoad(
        () =>
          payrollService.getAll(
            pageNumber,
            pageSize
          ),
        setPayroll,
        (data) => {
          // New paginated response
          if (
            data &&
            !Array.isArray(data) &&
            Array.isArray(data.items)
          ) {
            return data.items;
          }

          // Old array response
          return Array.isArray(data) ? data : [];
        }
      ),
    [runLoad]
  );

  // ==============================
  // PERFORMANCE
  // ==============================

  const loadPerformance = useCallback(
    () =>
      runLoad(
        () => performanceService.getAll(),
        setPerformance
      ),
    [runLoad]
  );

  // ==============================
  // NOTIFICATIONS
  // ==============================

  const loadNotifications = useCallback(
    () =>
      runLoad(
        () => notificationsService.getAll(),
        setNotifications,
        (data) =>
          (Array.isArray(data) ? data : []).map(
            mapNotification
          )
      ),
    [runLoad]
  );

  // ==============================
  // DASHBOARD SUMMARY
  // ==============================

  const loadDashboardSummary = useCallback(
    () =>
      runLoad(
        () => reportsService.getDashboardSummary(),
        setDashboardSummary,
        (data) => data
      ),
    [runLoad]
  );

  // ==============================
  // EMPLOYEE CRUD
  // ==============================

  const addEmployee = async (form) => {
    const result = await employeesService.create({
      ...form,
      departmentId: Number(form.departmentId),
      salary: Number(form.salary),
      dateOfBirth: form.dateOfBirth || null,
      userId: form.userId
        ? Number(form.userId)
        : null,
    });

    setEmployees((current) => [
      ...current,
      mapEmployee(result),
    ]);

    return result;
  };

  const updateEmployee = async (id, form) => {
    const result = await employeesService.update(id, {
      ...form,
      departmentId: Number(form.departmentId),
      salary: Number(form.salary),
      dateOfBirth: form.dateOfBirth || null,
      userId: form.userId
        ? Number(form.userId)
        : null,
    });

    setEmployees((current) =>
      current.map((employee) =>
        employee.id === Number(id)
          ? mapEmployee(result)
          : employee
      )
    );

    return result;
  };

  const deleteEmployee = async (id) => {
    await employeesService.remove(id);

    setEmployees((current) =>
      current.filter(
        (employee) => employee.id !== Number(id)
      )
    );
  };

  // ==============================
  // DEPARTMENT CRUD
  // ==============================

  const addDepartment = async (form) => {
    const result =
      await departmentsService.create(form);

    setDepartments((current) => [
      ...current,
      mapDepartment(result),
    ]);

    return result;
  };

  const updateDepartment = async (id, form) => {
    const result =
      await departmentsService.update(id, form);

    setDepartments((current) =>
      current.map((department) =>
        department.id === Number(id)
          ? mapDepartment(result)
          : department
      )
    );

    return result;
  };

  const deleteDepartment = async (id) => {
    await departmentsService.remove(id);

    setDepartments((current) =>
      current.filter(
        (department) => department.id !== Number(id)
      )
    );
  };

  // ==============================
  // ATTENDANCE CRUD
  // ==============================

  const createAttendance = async (payload) => {
    const result =
      await attendanceService.create(payload);

    setAttendance((current) => [
      result,
      ...current,
    ]);

    return result;
  };

  const updateAttendance = async (id, payload) => {
    const result =
      await attendanceService.update(id, payload);

    setAttendance((current) =>
      current.map((item) =>
        item.id === Number(id)
          ? result
          : item
      )
    );

    return result;
  };

  const deleteAttendance = async (id) => {
    await attendanceService.remove(id);

    setAttendance((current) =>
      current.filter(
        (item) => item.id !== Number(id)
      )
    );
  };

  // ==============================
  // LEAVE CRUD
  // ==============================

  const createLeave = async (payload) => {
    const result =
      await leaveService.create(payload);

    setLeaves((current) => [
      result,
      ...current,
    ]);

    return result;
  };

  const updateLeaveStatus = async (
    id,
    status
  ) => {
    const result =
      await leaveService.updateStatus(
        id,
        status
      );

    setLeaves((current) =>
      current.map((item) =>
        item.id === Number(id)
          ? {
            ...item,
            ...(result || {}),
            status:
              result?.status ?? status,
          }
          : item
      )
    );

    return result;
  };

  const deleteLeave = async (id) => {
    await leaveService.remove(id);

    setLeaves((current) =>
      current.filter(
        (item) => item.id !== Number(id)
      )
    );
  };

  // ==============================
  // PAYROLL CRUD
  // ==============================

  const createPayroll = async (payload) => {
    const result =
      await payrollService.create(payload);

    setPayroll((current) => [
      result,
      ...current,
    ]);

    return result;
  };

  const updatePayroll = async (
    id,
    payload
  ) => {
    const result =
      await payrollService.update(
        id,
        payload
      );

    setPayroll((current) =>
      current.map((item) =>
        item.id === Number(id)
          ? result
          : item
      )
    );

    return result;
  };

  const deletePayroll = async (id) => {
    await payrollService.remove(id);

    setPayroll((current) =>
      current.filter(
        (item) => item.id !== Number(id)
      )
    );
  };

  // ==============================
  // PERFORMANCE CRUD
  // ==============================

  const createPerformance = async (
    payload
  ) => {
    const result =
      await performanceService.create(
        payload
      );

    setPerformance((current) => [
      result,
      ...current,
    ]);

    return result;
  };

  const updatePerformance = async (
    id,
    payload
  ) => {
    const result =
      await performanceService.update(
        id,
        payload
      );

    setPerformance((current) =>
      current.map((item) =>
        item.id === Number(id)
          ? result
          : item
      )
    );

    return result;
  };

  const deletePerformance = async (id) => {
    await performanceService.remove(id);

    setPerformance((current) =>
      current.filter(
        (item) => item.id !== Number(id)
      )
    );
  };

  // ==============================
  // NOTIFICATIONS
  // ==============================

  const markNotificationRead = async (
    id
  ) => {
    await notificationsService.markAsRead(id);

    setNotifications((current) =>
      current.map((item) =>
        item.id === Number(id)
          ? {
            ...item,
            read: true,
            isRead: true,
          }
          : item
      )
    );
  };

  // ==============================
  // CONTEXT VALUE
  // ==============================

  const value = {
    employees,
    departments,
    attendance,
    leaves,
    payroll,
    performance,
    notifications,
    dashboardSummary,

    loading,
    error,

    // GET
    loadEmployees,
    loadDepartments,
    loadAttendance,
    loadLeaves,
    loadPayroll,
    loadPerformance,
    loadNotifications,
    loadDashboardSummary,

    // Employee CRUD
    addEmployee,
    updateEmployee,
    deleteEmployee,

    // Department CRUD
    addDepartment,
    updateDepartment,
    deleteDepartment,

    // Attendance CRUD
    createAttendance,
    updateAttendance,
    deleteAttendance,

    // Leave CRUD
    createLeave,
    updateLeaveStatus,
    deleteLeave,

    // Payroll CRUD
    createPayroll,
    updatePayroll,
    deletePayroll,

    // Performance CRUD
    createPerformance,
    updatePerformance,
    deletePerformance,

    // Notifications
    markNotificationRead,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// ==============================
// CUSTOM HOOK
// ==============================

export const useApp = () =>
  useContext(AppContext);