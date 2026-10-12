
import { useEffect, useMemo, useState } from "react";
import {
    CalendarCheck,
    Clock3,
    UserCheck,
    UserX,
    Download,
    Plus,
    Pencil,
    Trash2,
    RefreshCw,
    Search,
} from "lucide-react";

import PageHeader from "../../components/molecules/PageHeader/PageHeader";
import Button from "../../components/atoms/Button/Button";
import Badge from "../../components/atoms/Badge/Badge";
import Avatar from "../../components/atoms/Avatar/Avatar";
import Modal from "../../components/molecules/Modal/Modal";

import { useApp } from "../../context/AppContext";
import { authService } from "../../services/authService";
import { formatDate } from "../../utils/format";

import "./Attendance.css";

const today = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const emptyForm = {
    employeeId: "",
    date: today(),
    checkIn: "",
    checkOut: "",
    status: "Present",
    notes: "",
};

const formatTime = (value) => {
    if (!value) return "—";

    if (typeof value === "string" && /^\d{2}:\d{2}/.test(value)) {
        return value.slice(0, 5);
    }

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) return "—";

    return parsed.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
};

const toTimeSpan = (value) => {
    return value ? `${value}:00` : null;
};

const downloadCsv = (rows) => {
    const escapeCsv = (value) =>
        `"${String(value ?? "").replaceAll('"', '""')}"`;

    const csv = [
        ["Employee", "Date", "Check In", "Check Out", "Status", "Notes"],
        ...rows.map((row) => [
            row.employeeName,
            String(row.date || "").slice(0, 10),
            formatTime(row.checkIn),
            formatTime(row.checkOut),
            row.status,
            row.notes,
        ]),
    ]
        .map((row) => row.map(escapeCsv).join(","))
        .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "ems-attendance.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
};

export default function Attendance() {
    const {
        attendance = [],
        employees = [],
        loadAttendance,
        loadEmployees,
        createAttendance,
        updateAttendance,
        deleteAttendance,
        loading,
    } = useApp();

    const [date, setDate] = useState(today());
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All Statuses");
    const [editingId, setEditingId] = useState(null);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [error, setError] = useState("");
    const [pageError, setPageError] = useState("");
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const isAdmin =
        authService.getUser()?.role?.toLowerCase();

    // Load data when Attendance page opens.
    useEffect(() => {
        const fetchData = async () => {
            try {
                setPageError("");
                await Promise.all([
                    loadAttendance(),
                    loadEmployees(),
                ]);
            } catch (err) {
                setPageError(
                    err.message || "Unable to load attendance data."
                );
            }
        };

        fetchData();
    }, [loadAttendance, loadEmployees]);

    // Filter attendance records.
    const filtered = useMemo(() => {
        return attendance.filter((item) => {
            const matchesDate =
                !date || String(item.date).slice(0, 10) === date;

            const matchesStatus =
                status === "All Statuses" || item.status === status;

            const searchText = [
                item.employeeName,
                item.status,
                item.notes,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const matchesSearch = searchText.includes(
                search.trim().toLowerCase()
            );

            return matchesDate && matchesStatus && matchesSearch;
        });
    }, [attendance, date, status, search]);

    // Statistics for the selected date.
    const dayRows = useMemo(
        () =>
            attendance.filter(
                (item) => String(item.date).slice(0, 10) === date
            ),
        [attendance, date]
    );

    const recordedEmployeeIds = new Set(
        dayRows.map((item) => Number(item.employeeId))
    );

    const present = dayRows.filter(
        (item) => item.status?.toLowerCase() === "present"
    ).length;

    const late = dayRows.filter(
        (item) => item.status?.toLowerCase() === "late"
    ).length;

    const absent = Math.max(
        0,
        employees.length - recordedEmployeeIds.size
    );

    const attendanceRate = employees.length
        ? Math.round(
            (recordedEmployeeIds.size / employees.length) * 100
        )
        : 0;

    // Open Add Record modal.
    const openCreate = () => {
        setEditingId(null);
        setForm({
            ...emptyForm,
            date: date || today(),
            employeeId: String(employees[0]?.id ?? ""),
        });
        setError("");
        setOpen(true);
    };

    // Open Edit modal.
    const openEdit = (item) => {
        setEditingId(item.id);
        setForm({
            employeeId: String(item.employeeId ?? ""),
            date: String(item.date || "").slice(0, 10),
            checkIn: item.checkIn
                ? String(item.checkIn).slice(0, 5)
                : "",
            checkOut: item.checkOut
                ? String(item.checkOut).slice(0, 5)
                : "",
            status: item.status || "Present",
            notes: item.notes || "",
        });
        setError("");
        setOpen(true);
    };

    // Close modal.
    const closeModal = () => {
        if (saving) return;

        setOpen(false);
        setEditingId(null);
        setForm(emptyForm);
        setError("");
    };

    // Add or update attendance.
    const save = async (event) => {
        event.preventDefault();
        setError("");

        if (!isAdmin) {
            setError("Only Admin can manage attendance.");
            return;
        }

        if (!form.employeeId || !form.date) {
            setError("Please select an employee and date.");
            return;
        }

        if (form.date > today()) {
            setError("Attendance cannot be marked for a future date.");
            return;
        }

        if (
            form.checkIn &&
            form.checkOut &&
            form.checkOut <= form.checkIn
        ) {
            setError("Check-out time must be after check-in time.");
            return;
        }

        const payload = {
            employeeId: Number(form.employeeId),
            date: `${form.date}T00:00:00`,
            checkIn: toTimeSpan(form.checkIn),
            checkOut: toTimeSpan(form.checkOut),
            status: form.status,
            notes: form.notes.trim(),
        };

        try {
            setSaving(true);

            if (editingId !== null) {
                await updateAttendance(editingId, payload);
            } else {
                await createAttendance(payload);
            }

            setOpen(false);
            setEditingId(null);
            setForm(emptyForm);
            setError("");
            setPageError("");
        } catch (err) {
            setError(err.message || "Unable to save attendance.");
        } finally {
            setSaving(false);
        }
    };

    // Delete attendance record.
    const remove = async (id) => {
        if (!isAdmin || deletingId !== null) return;

        if (!window.confirm("Delete this attendance record?")) {
            return;
        }

        try {
            setDeletingId(id);
            setPageError("");
            await deleteAttendance(id);
        } catch (err) {
            setPageError(err.message || "Unable to delete attendance.");
        } finally {
            setDeletingId(null);
        }
    };

    const getStatusTone = (value) => {
        switch (value?.toLowerCase()) {
            case "present":
                return "success";
            case "late":
                return "warning";
            case "absent":
                return "danger";
            default:
                return "info";
        }
    };

    return (
        <>
            <PageHeader
                title="Attendance"
                description="Track daily presence, working hours and attendance records."
                action={
                    <>
                        <Button
                            variant="secondary"
                            onClick={loadAttendance}
                            disabled={loading}
                        >
                            <RefreshCw size={16} />
                            Refresh
                        </Button>

                        <Button
                            variant="secondary"
                            onClick={() => downloadCsv(filtered)}
                        >
                            <Download size={16} />
                            Export
                        </Button>

                        {/* Always show Add Record button */}
                        <Button
                            onClick={openCreate}

                            title={
                                isAdmin
                                    ? "Add attendance record"
                                    : "Only Admin can add attendance"
                            }
                        >
                            <Plus size={16} />
                            Add Record
                        </Button>
                    </>
                }
            />

            {pageError && (
                <div className="form-error" >
                    {pageError}
                </div>
            )}

            <div className="attendance-stats">
                <div>
                    <UserCheck />
                    <span>Present</span>
                    <strong>{present}</strong>
                    <small>Selected date</small>
                </div>

                <div>
                    <Clock3 />
                    <span>Late Arrivals</span>
                    <strong>{late}</strong>
                    <small>Selected date</small>
                </div>

                <div>
                    <UserX />
                    <span>No Record</span>
                    <strong>{absent}</strong>
                    <small>Employees without a record</small>
                </div>

                <div>
                    <CalendarCheck />
                    <span>Attendance Rate</span>
                    <strong>{attendanceRate}%</strong>
                    <small>Employees with a record</small>
                </div>
            </div>

            <div className="attendance-card">
                <div className="attendance-toolbar">
                    <div>
                        <h3>Attendance Register</h3>
                        <p>Live records from the EMS API</p>
                    </div>

                    <div className="toolbar-controls">
                        <div className="search-inline">
                            <Search size={16} />
                            <input
                                type="search"
                                placeholder="Search employee..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                            />
                        </div>

                        <input
                            type="date"
                            aria-label="Filter by date"
                            value={date}
                            onChange={(event) =>
                                setDate(event.target.value)
                            }
                        />

                        <select
                            value={status}
                            onChange={(event) =>
                                setStatus(event.target.value)
                            }
                        >
                            {[
                                "All Statuses",
                                "Present",
                                "Late",
                                "Absent",
                            ].map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="attendance-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Date</th>
                                <th>Check In</th>
                                <th>Check Out</th>
                                <th>Status</th>
                                <th>Notes</th>
                                {isAdmin && <th>Actions</th>}
                            </tr>
                        </thead>

                        <tbody>
                            {filtered.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="att-person">
                                            <Avatar
                                                name={
                                                    item.employeeName ||
                                                    "Employee"
                                                }
                                            />
                                            <strong>
                                                {item.employeeName ||
                                                    "Employee"}
                                            </strong>
                                        </div>
                                    </td>

                                    <td>{formatDate(item.date)}</td>
                                    <td>{formatTime(item.checkIn)}</td>
                                    <td>{formatTime(item.checkOut)}</td>

                                    <td>
                                        <Badge
                                            tone={getStatusTone(item.status)}
                                        >
                                            {item.status}
                                        </Badge>
                                    </td>

                                    <td>{item.notes || "—"}</td>

                                    {isAdmin && (
                                        <td>
                                            <div className="row-actions">
                                                <button
                                                    type="button"
                                                    title="Edit"
                                                    aria-label="Edit attendance"
                                                    disabled={
                                                        saving ||
                                                        deletingId === item.id
                                                    }
                                                    onClick={() =>
                                                        openEdit(item)
                                                    }
                                                >
                                                    <Pencil size={16} />
                                                </button>

                                                <button
                                                    type="button"
                                                    title="Delete"
                                                    aria-label="Delete attendance"
                                                    disabled={
                                                        deletingId === item.id
                                                    }
                                                    onClick={() =>
                                                        remove(item.id)
                                                    }
                                                >
                                                    {deletingId === item.id ? (
                                                        <RefreshCw size={16} />
                                                    ) : (
                                                        <Trash2 size={16} />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {!filtered.length && (
                        <div className="empty-state">
                            {loading
                                ? "Loading attendance records..."
                                : "No attendance records found."}
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Attendance Modal */}
            <Modal
                open={open}
                onClose={closeModal}
                title={
                    editingId !== null
                        ? "Edit Attendance"
                        : "Add Attendance Record"
                }
            >
                <form className="employee-form" onSubmit={save}>
                    <div className="form-grid">
                        <label>
                            Employee
                            <select
                                required
                                value={form.employeeId}
                                onChange={(event) =>
                                    setForm((current) => ({
                                        ...current,
                                        employeeId: event.target.value,
                                    }))
                                }
                            >
                                <option value="">Select employee</option>

                                {employees.map((employee) => (
                                    <option
                                        key={employee.id}
                                        value={employee.id}
                                    >
                                        {employee.name}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Date
                            <input
                                type="date"
                                required
                                max={today()}
                                value={form.date}
                                onChange={(event) =>
                                    setForm((current) => ({
                                        ...current,
                                        date: event.target.value,
                                    }))
                                }
                            />
                        </label>

                        <label>
                            Check In
                            <input
                                type="time"
                                value={form.checkIn}
                                onChange={(event) =>
                                    setForm((current) => ({
                                        ...current,
                                        checkIn: event.target.value,
                                    }))
                                }
                            />
                        </label>

                        <label>
                            Check Out
                            <input
                                type="time"
                                value={form.checkOut}
                                onChange={(event) =>
                                    setForm((current) => ({
                                        ...current,
                                        checkOut: event.target.value,
                                    }))
                                }
                            />
                        </label>

                        <label>
                            Status
                            <select
                                value={form.status}
                                onChange={(event) =>
                                    setForm((current) => ({
                                        ...current,
                                        status: event.target.value,
                                    }))
                                }
                            >
                                {["Present", "Late", "Absent"].map(
                                    (item) => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    )
                                )}
                            </select>
                        </label>

                        <label>
                            Notes
                            <input
                                maxLength={500}
                                value={form.notes}
                                onChange={(event) =>
                                    setForm((current) => ({
                                        ...current,
                                        notes: event.target.value,
                                    }))
                                }
                                placeholder="Optional notes"
                            />
                        </label>
                    </div>

                    {error && (
                        <p className="form-error">
                            {error}
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

                        <Button type="submit" disabled={saving || !isAdmin}>
                            {saving
                                ? "Saving..."
                                : editingId !== null
                                    ? "Update Record"
                                    : "Save Record"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}