
import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Avatar from "../../atoms/Avatar/Avatar";
import Badge from "../../atoms/Badge/Badge";
import { formatCurrency } from "../../../utils/format";

import "./EmployeeTable.css";

export default function EmployeeTable({
  employees = [],
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate();

  return (
    <div className="table-wrap">
      <table className="employee-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Department</th>
            <th>Position</th>
            <th>Phone</th>
            <th>Salary</th>
            <th>Status</th>
            <th>Performance</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((employee) => {
            const score = Math.min(
              100,
              Math.max(
                0,
                Number(employee.performanceScore || 0)
              )
            );

            const statusTone =
              employee.status === "Active"
                ? "success"
                : employee.status === "Inactive"
                  ? "danger"
                  : "warning";

            return (
              <tr key={employee.id}>
                <td>
                  <div className="employee-cell">
                    <Avatar name={employee.name || "Employee"} />
                    <div>
                      <strong>{employee.name || "Unnamed"}</strong>
                      <small>{employee.email || "—"}</small>
                    </div>
                  </div>
                </td>

                <td>
                  {employee.departmentName ||
                    employee.department ||
                    "Unassigned"}
                </td>

                <td>{employee.position || "—"}</td>

                <td>{employee.phone || "—"}</td>

                <td>{formatCurrency(employee.salary || 0)}</td>

                <td>
                  <Badge tone={statusTone}>
                    {employee.status || "Unknown"}
                  </Badge>
                </td>


                <td>
                  <div className="performance-cell">
                    <span>{Number(employee.performanceScore || 0)}%</span>
                    <div className="mini-progress">
                      <i
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, Number(employee.performanceScore || 0))
                          )}%`
                        }}
                      />
                    </div>
                  </div>
                </td>

                <td>
                  <div className="row-actions">
                    <button
                      type="button"
                      className="action-view"
                      onClick={() =>
                        navigate(`/employees/${employee.id}`)
                      }
                      title="View employee"
                      aria-label={`View ${employee.name}`}
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      type="button"
                      className="action-edit"
                      onClick={() => onEdit?.(employee)}
                      title="Edit employee"
                      aria-label={`Edit ${employee.name}`}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      className="action-delete"
                      onClick={() => onDelete?.(employee)}
                      title="Delete employee"
                      aria-label={`Delete ${employee.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}

          {employees.length === 0 && (
            <tr>
              <td colSpan="8" className="empty-row">
                No employees found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}