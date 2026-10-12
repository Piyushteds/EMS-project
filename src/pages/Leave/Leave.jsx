import { useEffect, useMemo, useState } from "react";
import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    XCircle,
    Plus,
    Pencil,
    Trash2,
    Search,
    RefreshCw,
} from "lucide-react";

import PageHeader from "../../components/molecules/PageHeader/PageHeader";
import Button from "../../components/atoms/Button/Button";
import Badge from "../../components/atoms/Badge/Badge";
import Avatar from "../../components/atoms/Avatar/Avatar";
import Modal from "../../components/molecules/Modal/Modal";
import { useApp } from "../../context/AppContext";
import { authService } from "../../services/authService";
import "./Leave.css";

const emptyForm = {
    employeeId: "",
    leaveType: "Casual Leave",
    startDate: "",
    endDate: "",
    reason: "",
};

export default function Leave() {
    const {
        leaves,
        employees,
        loadLeaves,
        loadEmployees,
        createLeave,
        updateLeave,
        updateLeaveStatus,
        deleteLeave,
        loading,
    } = useApp();

    useEffect(() => {
        loadLeaves();
        loadEmployees();
    }, [loadLeaves, loadEmployees]);

    const canManage =
        authService.getUser()?.role?.toLowerCase();

    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All Statuses");
    const [form, setForm] = useState(emptyForm);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [actionId, setActionId] = useState(null);

    const pending = leaves.filter(
        (x) => x.status === "Pending"
    ).length;

    const approved = leaves.filter(
        (x) => x.status === "Approved"
    ).length;

    const rejected = leaves.filter(
        (x) => x.status === "Rejected"
    ).length;

    const filtered = useMemo(
        () =>
            leaves.filter((x) => {
                const matchesStatus =
                    status === "All Statuses" || x.status === status;

                const matchesSearch =
                    `${x.employeeName || ""} ${x.leaveType || ""} ${x.reason || ""}`
                        .toLowerCase()
                        .includes(search.toLowerCase());

                return matchesStatus && matchesSearch;
            }),
        [leaves, status, search]
    );

    const openCreate = () => {
        setEditingId(null);
        setForm({
            ...emptyForm,
            employeeId: String(employees[0]?.id || ""),
        });
        setError("");
        setOpen(true);
    };

    const openEdit = (leave) => {
        setEditingId(leave.id);
        setForm({
            employeeId: String(leave.employeeId ?? ""),
            leaveType: leave.leaveType || "Casual Leave",
            startDate: String(leave.startDate || "").slice(0, 10),
            endDate: String(leave.endDate || "").slice(0, 10),
            reason: leave.reason || "",
        });
        setError("");
        setOpen(true);
    };

    const closeModal = () => {
        if (saving) return;
        setOpen(false);
        setEditingId(null);
        setError("");
        setForm(emptyForm);
    };

    const save = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.employeeId) {
            setError("Please select an employee.");
            return;
        }

        if (!form.startDate || !form.endDate) {
            setError("Please select both leave dates.");
            return;
        }

        if (form.endDate < form.startDate) {
            setError("End date must be on or after the start date.");
            return;
        }

        setSaving(true);

        try {
            const payload = {
                ...form,
                employeeId: Number(form.employeeId),
            };

            if (editingId !== null) {
                if (typeof updateLeave !== "function") {
                    throw new Error(
                        "Editing leave details is not supported by the current backend. A PUT /Leave/{id} endpoint is required."
                    );
                }

                await updateLeave(editingId, payload);
            } else {
                await createLeave(payload);
            }

            setOpen(false);
            setEditingId(null);
            setForm(emptyForm);
        } catch (err) {
            setError(err.message || "Unable to save leave request.");
        } finally {
            setSaving(false);
        }
    };

    const decide = async (id, value) => {
        setError("");
        setActionId(id);

        try {
            await updateLeaveStatus(id, value);
        } catch (err) {
            setError(err.message || "Unable to update leave status.");
        } finally {
            setActionId(null);
        }
    };

    const remove = async (id) => {
        if (!window.confirm("Are you sure you want to delete this leave request?")) {
            return;
        }

        setError("");
        setActionId(id);

        try {
            await deleteLeave(id);
        } catch (err) {
            setError(err.message || "Unable to delete leave request.");
        } finally {
            setActionId(null);
        }
    };

    return (
        <>
            <PageHeader
                title="Leave Management"
                description="Review requests, approvals and time-off records."
                action={
                    <>
                        <Button
                            variant="secondary"
                            onClick={loadLeaves}
                            disabled={loading}
                        >
                            <RefreshCw size={16} />
                            Refresh
                        </Button>

                        <Button onClick={openCreate}>
                            <Plus size={16} />
                            Apply Leave
                        </Button>
                    </>
                }
            />

            <div className="leave-overview">
                <div>
                    <CalendarDays />
                    <span>Total Requests</span>
                    <strong>{leaves.length}</strong>
                    <small>All leave records</small>
                </div>

                <div>
                    <Clock3 />
                    <span>Pending Requests</span>
                    <strong>{pending}</strong>
                    <small>Awaiting decision</small>
                </div>

                <div>
                    <CheckCircle2 />
                    <span>Approved</span>
                    <strong>{approved}</strong>
                    <small>Approved requests</small>
                </div>

                <div>
                    <XCircle />
                    <span>Rejected</span>
                    <strong>{rejected}</strong>
                    <small>Rejected requests</small>
                </div>
            </div>

            <div className="leave-card">
                <div className="leave-head">
                    <div>
                        <h3>Leave Requests</h3>
                        <p>Review and manage employee time-off</p>
                    </div>

                    <div className="toolbar-controls">
                        <div className="search-inline">
                            <Search size={16} />
                            <input
                                placeholder="Search employee..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            {[
                                "All Statuses",
                                "Pending",
                                "Approved",
                                "Rejected",
                            ].map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {error && !open && (
                    <div className="leave-error">{error}</div>
                )}

                <div className="leave-list">
                    {filtered.map((r) => (
                        <div className="leave-row" key={r.id}>
                            <div className="leave-person">
                                <Avatar name={r.employeeName || "Employee"} />

                                <div>
                                    <strong>{r.employeeName || "Employee"}</strong>
                                    <small>
                                        {r.leaveType} ·{" "}
                                        {String(r.startDate || "").slice(0, 10)}
                                        {" – "}
                                        {String(r.endDate || "").slice(0, 10)}
                                    </small>
                                    <small>
                                        {r.reason || "No reason provided"}
                                    </small>
                                </div>
                            </div>

                            <Badge
                                tone={
                                    r.status === "Approved"
                                        ? "success"
                                        : r.status === "Pending"
                                            ? "warning"
                                            : "danger"
                                }
                            >
                                {r.status}
                            </Badge>

                            <div className="leave-actions">
                                {canManage && (
                                    <>
                                        <button
                                            type="button"
                                            className="leave-icon-action edit"
                                            title="Edit leave"
                                            aria-label="Edit leave"
                                            disabled={actionId === r.id}
                                            onClick={() => openEdit(r)}
                                        >
                                            <Pencil size={16} />
                                        </button>

                                        <button
                                            type="button"
                                            className="leave-icon-action delete"
                                            title="Delete leave"
                                            aria-label="Delete leave"
                                            disabled={actionId === r.id}
                                            onClick={() => remove(r.id)}
                                        >
                                            <Trash2 size={16} />
                                        </button>

                                        {r.status === "Pending" && (
                                            <>
                                                <button
                                                    type="button"
                                                    className="approve-action"
                                                    disabled={actionId === r.id}
                                                    onClick={() => decide(r.id, "Approved")}
                                                >
                                                    Approve
                                                </button>

                                                <button
                                                    type="button"
                                                    className="reject-action"
                                                    disabled={actionId === r.id}
                                                    onClick={() => decide(r.id, "Rejected")}
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    ))}

                    {!filtered.length && (
                        <div className="empty-state">
                            No leave requests match your filters.
                        </div>
                    )}
                </div>
            </div>

            <Modal
                open={open}
                onClose={closeModal}
                title={editingId !== null ? "Edit Leave Request" : "Apply for Leave"}
            >
                <form className="employee-form" onSubmit={save}>
                    <div className="form-grid">
                        <label>
                            Employee
                            <select
                                required
                                value={form.employeeId}
                                onChange={(e) =>
                                    setForm({ ...form, employeeId: e.target.value })
                                }
                            >
                                <option value="">Select employee</option>
                                {employees.map((employee) => (
                                    <option key={employee.id} value={employee.id}>
                                        {employee.name}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Leave Type
                            <select
                                required
                                value={form.leaveType}
                                onChange={(e) =>
                                    setForm({ ...form, leaveType: e.target.value })
                                }
                            >
                                {[
                                    "Annual Leave",
                                    "Sick Leave",
                                    "Casual Leave",
                                    "Marriage Leave",
                                    "Festival Leave",
                                    "Unpaid Leave",
                                    "Family and Medical Leave",
                                    "Other",
                                ].map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Start Date
                            <input
                                type="date"
                                required
                                value={form.startDate}
                                onChange={(e) =>
                                    setForm({ ...form, startDate: e.target.value })
                                }
                            />
                        </label>

                        <label>
                            End Date
                            <input
                                type="date"
                                required
                                min={form.startDate || undefined}
                                value={form.endDate}
                                onChange={(e) =>
                                    setForm({ ...form, endDate: e.target.value })
                                }
                            />
                        </label>

                        <label className="full-field">
                            Reason
                            <textarea
                                rows="3"
                                value={form.reason}
                                onChange={(e) =>
                                    setForm({ ...form, reason: e.target.value })
                                }
                            />
                        </label>
                    </div>

                    {error && <p className="form-error">{error}</p>}

                    <div className="form-actions">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={closeModal}
                            disabled={saving}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" disabled={saving}>
                            {saving
                                ? "Saving..."
                                : editingId !== null
                                    ? "Save Changes"
                                    : "Submit Request"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
