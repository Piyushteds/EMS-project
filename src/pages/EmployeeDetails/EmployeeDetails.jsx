import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  CalendarDays,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import Avatar from "../../components/atoms/Avatar/Avatar";
import Badge from "../../components/atoms/Badge/Badge";
import ProgressBar from "../../components/atoms/ProgressBar/ProgressBar";
import { formatCurrency, formatDate } from "../../utils/format";
import "./EmployeeDetails.css";

export default function EmployeeDetails() {
  const { id } = useParams();
  const { employees, performance, attendance, leaves, payroll, loading } =
    useApp();
  const employee = employees.find((x) => x.id === Number(id));
  if (loading && !employee)
    return <div className="empty-state">Loading employee profile...</div>;
  if (!employee)
    return (
      <div className="not-found">
        <h2>Employee not found</h2>
        <Link to="/employees">Back to employees</Link>
      </div>
    );
  const perf = performance.filter((x) => x.employeeId === employee.id),
    att = attendance.filter((x) => x.employeeId === employee.id),
    lev = leaves.filter((x) => x.employeeId === employee.id),
    pay = payroll.filter((x) => x.employeeId === employee.id);
  return (
    <div>
      <Link className="back-link" to="/employees">
        <ArrowLeft size={16} /> Employees
      </Link>
      <div className="profile-hero">
        <Avatar name={employee.name} size="lg" />
        <div>
          <h1>{employee.name}</h1>
          <p>
            {employee.position} · {employee.department}
          </p>
          <Badge
            tone={
              employee.status === "Active" ? "success" : "warning"
            }
          >
            {employee.status}
          </Badge>
        </div>
      </div>
      <div className="detail-grid">
        <div className="detail-card">
          <h3>Personal Information</h3>
          <div className="info-item">
            <Mail /> <span>{employee.email}</span>
          </div>
          <div className="info-item">
            <Phone /> <span>{employee.phone || "—"}</span>
          </div>
          <div className="info-item">
            <MapPin /> <span>{employee.address || "—"}</span>
          </div>
          <div className="info-item">
            <CalendarDays />{" "}
            <span>Born {formatDate(employee.dateOfBirth)}</span>
          </div>
        </div>
        <div className="detail-card">
          <h3>Employment Information</h3>
          <div className="detail-line">
            <span>Join Date</span>
            <strong>{formatDate(employee.joinDate)}</strong>
          </div>
          <div className="detail-line">
            <span>Salary</span>
            <strong>{formatCurrency(employee.salary)}</strong>
          </div>
          <div className="detail-line">
            <span>Position</span>
            <strong>{employee.position}</strong>
          </div>
          <div className="detail-line">
            <span>Department</span>
            <strong>{employee.department}</strong>
          </div>
        </div>
        <div className="detail-card">
          <h3>Performance</h3>
          <div className="score">
            <strong>{employee.performanceScore}%</strong>
            <span>Current score</span>
          </div>
          <ProgressBar value={employee.performanceScore} />
          <p className="muted">
            {perf.length} review record(s) available.
          </p>
        </div>
        <div className="detail-card">
          <h3>Activity Snapshot</h3>
          <div className="detail-line">
            <span>Attendance records</span>
            <strong>{att.length}</strong>
          </div>
          <div className="detail-line">
            <span>Leave requests</span>
            <strong>{lev.length}</strong>
          </div>
          <div className="detail-line">
            <span>Payroll records</span>
            <strong>{pay.length}</strong>
          </div>
          <div className="role-box">
            <Briefcase />
            <div>
              <strong>{employee.position}</strong>
              <p>{employee.department} department</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
