
import { useEffect, useState } from "react";

import Button from "../../atoms/Button/Button";
import Input from "../../atoms/Input/Input";
import Select from "../../atoms/Select/Select";

import { useApp } from "../../../context/AppContext";
import { validateEmployee } from "../../../utils/validation";

import "./EmployeeForm.css";

export default function EmployeeForm({
  employee,
  onSubmit,
  onCancel,
  submitting = false,
  submitLabel = "Save Employee",
}) {
  const { departments = [] } = useApp();

  const createEmptyForm = () => ({
    name: "",
    email: "",
    departmentId: departments[0]?.id ?? "",
    salary: "",
    address: "",
    joinDate: "",
    phone: "",
    position: "",
    status: "Active",
    performanceScore: "0",
    dateOfBirth: "",
    userId: "",
  });

  const [form, setForm] = useState(createEmptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (employee) {
      setForm({
        ...createEmptyForm(),
        ...employee,
        departmentId: employee.departmentId ?? "",
        salary: String(employee.salary ?? ""),
        performanceScore: String(
          employee.performanceScore ?? 0
        ),
        joinDate: employee.joinDate?.slice(0, 10) || "",
        dateOfBirth: employee.dateOfBirth?.slice(0, 10) || "",
        userId: employee.userId ?? "",
      });
    } else {
      setForm(createEmptyForm());
    }

    setErrors({});
    // Reset the form when the selected employee changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee, departments]);

  const update = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };

  const submit = (event) => {
    event.preventDefault();

    const next = validateEmployee(form);

    if (!form.joinDate) {
      next.joinDate = "Join date is required";
    }

    if (
      form.salary === "" ||
      !Number.isFinite(Number(form.salary)) ||
      Number(form.salary) < 0
    ) {
      next.salary = "Enter a valid non-negative salary";
    }

    if (!form.departmentId) {
      next.departmentId = "Department is required";
    }

    const score = Number(form.performanceScore);

    if (
      form.performanceScore === "" ||
      !Number.isFinite(score) ||
      score < 0 ||
      score > 100
    ) {
      next.performanceScore =
        "Performance score must be between 0 and 100";
    }

    setErrors(next);

    if (Object.keys(next).length > 0 || submitting) {
      return;
    }

    const payload = {
      ...form,
      departmentId: Number(form.departmentId),
      salary: Number(form.salary),
      performanceScore: score,
      userId: form.userId
        ? Number(form.userId)
        : null,
    };

    onSubmit(payload);
  };

  return (
    <form className="employee-form" onSubmit={submit}>
      <div className="form-grid">
        <Input
          label="Full Name"
          name="name"
          value={form.name}
          onChange={update}
          error={errors.name}
          required
          maxLength={100}
          placeholder="Enter full name"
        />

        <Input
          label="Email Address"
          name="email"
          type="email"
          value={form.email}
          onChange={update}
          error={errors.email}
          required
          maxLength={150}
          placeholder="name@company.com"
        />

        <Select
          label="Department"
          name="departmentId"
          value={form.departmentId}
          onChange={update}
          options={[
            { value: "", label: "Select department" },
            ...departments.map((department) => ({
              value: department.id,
              label: department.name,
            })),
          ]}
        />

        {errors.departmentId && (
          <small className="field-error">
            {errors.departmentId}
          </small>
        )}

        <Input
          label="Position"
          name="position"
          value={form.position}
          onChange={update}
          error={errors.position}
          maxLength={100}
          placeholder="e.g. Software Developer"
        />

        <Input
          label="Salary"
          name="salary"
          type="number"
          min="0"
          step="0.01"
          value={form.salary}
          onChange={update}
          error={errors.salary}
          required
          placeholder="Enter salary"
        />

        <Input
          label="Phone"
          name="phone"
          value={form.phone}
          onChange={update}
          error={errors.phone}
          maxLength={20}
          placeholder="Phone number"
        />

        <Input
          label="Join Date"
          name="joinDate"
          type="date"
          value={form.joinDate}
          onChange={update}
          error={errors.joinDate}
          required
        />

        <Input
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={form.dateOfBirth}
          onChange={update}
          error={errors.dateOfBirth}
        />

        <Input
          label="Address"
          name="address"
          value={form.address}
          onChange={update}
          error={errors.address}
          maxLength={250}
          placeholder="Enter address"
        />

        <Input
          label="Performance Score (%)"
          name="performanceScore"
          type="number"
          min="0"
          max="100"
          step="0.01"
          value={form.performanceScore}
          onChange={update}
          error={errors.performanceScore}
          placeholder="Enter score (0–100)"
        />

        {employee && (
          <Select
            label="Status"
            name="status"
            value={form.status}
            onChange={update}
            options={["Active", "On Leave", "Inactive"].map(
              (value) => ({
                value,
                label: value,
              })
            )}
          />
        )}
      </div>

      <div className="form-actions">
        <Button
          variant="secondary"
          type="button"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}