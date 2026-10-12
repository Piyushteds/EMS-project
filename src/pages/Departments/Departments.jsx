import { useEffect, useState } from "react";
import {
  Building2,
  Plus,
  Users,
  Wallet,
  TrendingUp,
  Pencil,
  Trash2,
} from "lucide-react";

import { useApp } from "../../context/AppContext";
import { authService } from "../../services/authService";
import PageHeader from "../../components/molecules/PageHeader/PageHeader";
import Button from "../../components/atoms/Button/Button";
import Modal from "../../components/molecules/Modal/Modal";
import Input from "../../components/atoms/Input/Input";
import "./Departments.css";

const initialForm = {
  name: "",
  description: "",
  isActive: true,
};

export default function Departments() {
  const {
    departments = [],
    loadDepartments,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    loading,
  } = useApp();

  // Load only the Department GET API when this page opens.
  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  const canManage =
    authService.getUser()?.role?.toLowerCase();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const totalEmployees = departments.reduce(
    (sum, department) =>
      sum + Number(department.employees || 0),
    0
  );

  const openCreate = () => {
    setEditing(null);
    setForm({ ...initialForm });
    setError("");
    setOpen(true);
  };

  const openEdit = (department) => {
    setEditing(department);
    setForm({
      name: department.name || "",
      description: department.description || "",
      isActive: department.isActive !== false,
    });
    setError("");
    setOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setOpen(false);
    setEditing(null);
    setForm({ ...initialForm });
    setError("");
  };

  const save = async (e) => {
    e.preventDefault();
    setError("");

    if (!canManage) {
      setError("Only an Admin can manage departments.");
      return;
    }

    const name = form.name.trim();
    const description = form.description.trim();

    if (!name) {
      setError("Department name is required.");
      return;
    }

    try {
      setSaving(true);

      if (editing) {
        await updateDepartment(editing.id, {
          name,
          description,
          isActive: form.isActive,
        });
      } else {
        await addDepartment({
          name,
          description,
        });
      }

      closeModal();
    } catch (err) {
      setError(
        err.message || "Unable to save department."
      );
    } finally {
      setSaving(false);
    }
  };

  const remove = async (department) => {
    if (!canManage) {
      setError("Only an Admin can delete departments.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${department.name}?`
    );

    if (!confirmed) return;

    setError("");

    try {
      await deleteDepartment(department.id);
    } catch (err) {
      setError(
        err.message || "Unable to delete department."
      );
    }
  };

  return (
    <>
      <PageHeader
        title="Departments"
        description="Organize teams, department ownership and workforce structure."
        action={
          <Button onClick={openCreate}>
            <Plus size={17} />
            Add Department
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="dept-summary">
        <div>
          <Building2 />
          <span>Total Departments</span>
          <strong>{departments.length}</strong>
        </div>

        <div>
          <Users />
          <span>Department Workforce</span>
          <strong>{totalEmployees}</strong>
        </div>

        <div>
          <Wallet />
          <span>Active Teams</span>
          <strong>
            {
              departments.filter(
                (d) => d.isActive !== false
              ).length
            }
          </strong>
        </div>

        <div>
          <TrendingUp />
          <span>Avg. Team Size</span>
          <strong>
            {departments.length
              ? Math.round(
                totalEmployees / departments.length
              )
              : 0}
          </strong>
        </div>
      </div>

      {/* Error Message */}
      {error && !open && (
        <p className="form-error">{error}</p>
      )}

      {/* Department Cards */}
      {loading && departments.length === 0 ? (
        <div className="department-empty">
          <p>Loading departments...</p>
        </div>
      ) : (
        <div className="department-grid">
          {departments.map((d) => {
            const employeeCount = Number(d.employees || 0);
            const allocation = totalEmployees
              ? Math.min(
                100,
                (employeeCount / totalEmployees) * 100
              )
              : 0;

            return (
              <div className="department-card" key={d.id}>
                <div className="dept-card-top">
                  <div className="dept-icon">
                    <Building2 size={20} />
                  </div>

                  {canManage && (
                    <div className="row-actions">
                      <button
                        type="button"
                        title="Edit Department"
                        onClick={() => openEdit(d)}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        title="Delete Department"
                        onClick={() => remove(d)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <h3>{d.name}</h3>

                <p>
                  {d.description ||
                    "No department description available."}
                </p>

                <div className="dept-stats">
                  <span>
                    <Users size={15} />
                    {employeeCount} employees
                  </span>

                  <span>
                    {d.isActive === false
                      ? "Inactive"
                      : "Active"}
                  </span>
                </div>

                <div className="dept-bar">
                  <i
                    style={{
                      width: `${allocation}%`,
                    }}
                  />
                </div>

                <small>
                  Workforce allocation ·{" "}
                  {Math.round(allocation)}%
                </small>
              </div>
            );
          })}

          {departments.length === 0 && !loading && (
            <div className="department-empty">
              <Building2 size={32} />
              <h3>No Departments Found</h3>
              <p>
                Create your first department to organize
                your workforce.
              </p>
              <Button onClick={openCreate}>
                <Plus size={17} />
                Add Department
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        open={open}
        onClose={closeModal}
        title={
          editing ? "Edit Department" : "Add Department"
        }
      >
        <form className="employee-form" onSubmit={save}>
          <Input
            label="Department Name"
            name="name"
            placeholder="Enter department name"
            value={form.name}
            onChange={(e) =>
              setForm((current) => ({
                ...current,
                name: e.target.value,
              }))
            }
            required
          />

          <Input
            label="Description"
            name="description"
            placeholder="Enter department description"
            value={form.description}
            onChange={(e) =>
              setForm((current) => ({
                ...current,
                description: e.target.value,
              }))
            }
          />

          {editing && (
            <label className="checkbox-field">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    isActive: e.target.checked,
                  }))
                }
              />
              Active department
            </label>
          )}

          {error && <p className="form-error">{error}</p>}

          {!canManage && (
            <p className="form-error">
              Only an Admin can save department changes.
            </p>
          )}

          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={closeModal}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={saving || !canManage}
            >
              {saving
                ? "Saving..."
                : editing
                  ? "Save Changes"
                  : "Create Department"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
