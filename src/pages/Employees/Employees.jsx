import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Plus,
  RefreshCw,
  SlidersHorizontal,
  Users,
  AlertCircle,
  X,
  Trash2,
} from "lucide-react";

import { useApp } from "../../context/AppContext";
import useDebounce from "../../hooks/useDebounce";

import PageHeader from "../../components/molecules/PageHeader/PageHeader";
import SearchBox from "../../components/molecules/SearchBox/SearchBox";
import Button from "../../components/atoms/Button/Button";
import EmployeeTable from "../../components/organisms/EmployeeTable/EmployeeTable";
import EmployeeForm from "../../components/organisms/EmployeeForm/EmployeeForm";
//import Performance from "../../components/molecules/Performance/Performance";
import "./Employees.css";

export default function Employees() {
  const [params] = useSearchParams();

  const {
    employees,
    loadEmployees,
    loading,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  } = useApp();

  // Load employees only when the Employees page is opened.
  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const [search, setSearch] = useState(
    params.get("search") || ""
  );
  const [status, setStatus] = useState("All Statuses");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [modalMode, setModalMode] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");

  // Keep search synchronized with URL.
  useEffect(() => {
    setSearch(params.get("search") || "");
  }, [params]);

  const debounced = useDebounce(search);

  // Search and status filtering.
  const filtered = useMemo(() => {
    const query = debounced.trim().toLowerCase();

    return employees.filter((employee) => {
      const matchesStatus =
        status === "All Statuses" ||
        employee.status === status;

      const searchable = [
        employee.name,
        employee.email,
        employee.department,
        employee.departmentName,
        employee.position,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && searchable.includes(query);
    });
  }, [employees, debounced, status]);

  // Employee summary.
  const performanceSummary = useMemo(() => {
    return {
      total: filtered.length,
      active: filtered.filter(
        (e) => e.status === "Active"
      ).length,
      onLeave: filtered.filter(
        (e) => e.status === "On Leave"
      ).length,
      inactive: filtered.filter(
        (e) => e.status === "Inactive"
      ).length,
    };
  }, [filtered]);

  // Pagination.
  const pageCount = Math.max(
    1,
    Math.ceil(filtered.length / pageSize)
  );

  // Keep current page valid when records are deleted.
  const safePage = Math.min(currentPage, pageCount);

  useEffect(() => {
    if (currentPage !== safePage) {
      setCurrentPage(safePage);
    }
  }, [currentPage, safePage]);

  // Reset pagination when filters change.
  useEffect(() => {
    setCurrentPage(1);
  }, [debounced, status]);

  const currentItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage]);

  const visiblePages = useMemo(() => {
    const start = Math.max(
      1,
      Math.min(safePage - 2, pageCount - 4)
    );

    return Array.from(
      { length: Math.min(5, pageCount) },
      (_, index) => start + index
    );
  }, [safePage, pageCount]);

  // Add employee.
  const openAdd = () => {
    setSelectedEmployee(null);
    setActionError("");
    setNotice("");
    setModalMode("add");
  };

  // Edit employee.
  const openEdit = (employee) => {
    setSelectedEmployee(employee);
    setActionError("");
    setNotice("");
    setModalMode("edit");
  };

  const closeForm = () => {
    if (saving) return;

    setModalMode(null);
    setSelectedEmployee(null);
    setActionError("");
  };

  const handleSave = async (form) => {
    try {
      setSaving(true);
      setActionError("");
      setNotice("");

      if (modalMode === "edit") {
        await updateEmployee(selectedEmployee.id, form);
        setNotice("Employee updated successfully.");
      } else {
        await addEmployee(form);
        setNotice("Employee added successfully.");
        setCurrentPage(1);
      }

      setModalMode(null);
      setSelectedEmployee(null);
    } catch (error) {
      setActionError(
        error.message || "Unable to save employee."
      );
    } finally {
      setSaving(false);
    }
  };

  // Accept either employee object or ID from EmployeeTable.
  const openDelete = (employeeOrId) => {
    const employee =
      typeof employeeOrId === "object"
        ? employeeOrId
        : employees.find(
          (item) => item.id === Number(employeeOrId)
        );

    if (!employee) return;

    setDeleteTarget(employee);
    setActionError("");
    setNotice("");
  };

  const closeDelete = () => {
    if (deleting) return;

    setDeleteTarget(null);
    setActionError("");
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      setActionError("");
      setNotice("");

      await deleteEmployee(deleteTarget.id);

      setNotice("Employee deleted successfully.");
      setDeleteTarget(null);
    } catch (error) {
      setActionError(
        error.message || "Unable to delete employee."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Employees"
        description="Manage your organization's employee records."
        action={
          <div className="employee-header-actions">
            <Button
              variant="secondary"
              onClick={loadEmployees}
              disabled={loading}
            >
              <RefreshCw
                size={16}
                className={loading ? "spin-icon" : ""}
              />
              {loading ? "Refreshing..." : "Refresh"}
            </Button>

            <Button onClick={openAdd}>
              <Plus size={17} />
              Add Employee
            </Button>
          </div>
        }
      />

      {notice && (
        <div
          className="employee-notice success-notice"
          role="status"
        >
          <span>{notice}</span>
          <button
            type="button"
            aria-label="Dismiss message"
            onClick={() => setNotice("")}
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="employees-card">
        {/* Search and status filter */}
        <div className="employees-toolbar">
          <div className="employees-toolbar-controls">
            <div className="employee-search">
              <SearchBox
                value={search}
                onChange={setSearch}
                placeholder="Search employees..."
              />
            </div>

            <div className="employee-filter">
              <SlidersHorizontal size={16} />

              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
                aria-label="Filter employees by status"
              >
                {[
                  "All Statuses",
                  "Active",
                  "On Leave",
                  "Inactive",
                ].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Employee table */}
        <EmployeeTable
          employees={currentItems}
          onEdit={openEdit}
          onDelete={openDelete}
        />

        {/* Pagination */}
        <div className="employee-pagination">
          <span className="pagination-info">
            Showing{" "}
            {filtered.length === 0
              ? 0
              : (safePage - 1) * pageSize + 1}
            {"–"}
            {Math.min(
              safePage * pageSize,
              filtered.length
            )}
            {" of "}
            {filtered.length} employees
          </span>

          <div className="pagination-controls">
            <button
              type="button"
              className="pagination-arrow"
              disabled={safePage === 1}
              onClick={() =>
                setCurrentPage((page) => page - 1)
              }
              aria-label="Previous page"
            >
              <h2> ‹ </h2>
            </button>

            {visiblePages.map((page) => (
              <button
                type="button"
                key={page}
                className={`pagination-page ${safePage === page ? "active" : ""
                  }`}
                onClick={() => setCurrentPage(page)}
                aria-current={
                  safePage === page ? "page" : undefined
                }
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              className="pagination-arrow"
              disabled={safePage === pageCount}
              onClick={() =>
                setCurrentPage((page) => page + 1)
              }
              aria-label="Next page"
            >
              <h2> ›</h2>
            </button>
          </div>
        </div>

        {loading && (
          <div className="loading-line">
            Loading employee records...
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="employee-empty-hint">
            <Users size={18} />
            <span>
              {search || status !== "All Statuses"
                ? "No employees match your filters."
                : "No employees found. Add your first employee."}
            </span>
          </div>
        )}
      </div>

      {/* Add / Edit modal */}
      {modalMode && (
        <div
          className="employee-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeForm();
            }
          }}
        >
          <section
            className="employee-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="employee-modal-title"
          >
            <div className="employee-modal-header">
              <div>
                <span className="employee-modal-eyebrow">
                  EMPLOYEE MANAGEMENT
                </span>

                <h2 id="employee-modal-title">
                  {modalMode === "edit"
                    ? "Edit Employee"
                    : "Add New Employee"}
                </h2>

                <p>
                  {modalMode === "edit"
                    ? "Update the employee's information."
                    : "Enter the employee's details below."}
                </p>
              </div>

              <button
                type="button"
                className="employee-modal-close"
                onClick={closeForm}
                disabled={saving}
                aria-label="Close form"
              >
                <X size={19} />
              </button>
            </div>

            {actionError && (
              <div
                className="employee-form-error"
                role="alert"
              >
                <AlertCircle size={17} />
                <span>{actionError}</span>
              </div>
            )}

            <EmployeeForm
              key={`${modalMode}-${selectedEmployee?.id || "new"}`}
              employee={selectedEmployee}
              onSubmit={handleSave}
              onCancel={closeForm}
              submitting={saving}
              submitLabel={
                modalMode === "edit"
                  ? "Save Changes"
                  : "Create Employee"
              }
            />
          </section>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div
          className="employee-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDelete();
            }
          }}
        >
          <section
            className="employee-delete-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-employee-title"
          >
            <div className="delete-icon">
              <Trash2 size={23} />
            </div>

            <button
              type="button"
              className="employee-modal-close delete-close"
              onClick={closeDelete}
              disabled={deleting}
              aria-label="Close confirmation"
            >
              <X size={18} />
            </button>

            <h2 id="delete-employee-title">
              Delete employee?
            </h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.name}</strong>?
              This action cannot be undone.
            </p>

            {actionError && (
              <div
                className="employee-form-error"
                role="alert"
              >
                <AlertCircle size={17} />
                <span>{actionError}</span>
              </div>
            )}

            <div className="delete-actions">
              <Button
                variant="secondary"
                onClick={closeDelete}
                disabled={deleting}
              >
                Cancel
              </Button>

              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                <Trash2 size={16} />
                {deleting
                  ? "Deleting..."
                  : "Delete Employee"}
              </Button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}