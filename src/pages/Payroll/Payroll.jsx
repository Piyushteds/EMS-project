import {
    Eye,
    Pencil,
    Trash2,
    Plus,
    Search,
    X,
    WalletCards,
    IndianRupee,
    CheckCircle2,
    Clock3,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { payrollService } from "../../services/payrollService";
import { employeesService } from "../../services/employeeService";

import "./Payroll.css";

const MONTHS = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
];

const emptyForm = {
    employeeId: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    basicSalary: "",
    allowances: "",
    deductions: "",
    paymentStatus: "Pending",
};

function formatCurrency(value) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number(value || 0));
}

function getMonthName(month) {
    return (
        MONTHS.find(
            (item) => item.value === Number(month)
        )?.label || "-"
    );
}

export default function Payroll() {
    const [payrolls, setPayrolls] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    // ==============================
    // PAGINATION
    // ==============================

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [showForm, setShowForm] = useState(false);
    const [showView, setShowView] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const [editingPayroll, setEditingPayroll] =
        useState(null);

    const [selectedPayroll, setSelectedPayroll] =
        useState(null);

    const [deleteId, setDeleteId] = useState(null);

    const [form, setForm] = useState(emptyForm);

    // ==============================
    // LOAD PAYROLL
    // ==============================

    const loadPayroll = async () => {
        try {
            setLoading(true);
            setError("");

            /*
             * Backend:
             * GET /api/Payroll?pageNumber=1&pageSize=10
             */

            const data = await payrollService.getAll(
                currentPage,
                pageSize
            );

            /*
             * Supports both:
             *
             * Old:
             * [ ... ]
             *
             * New:
             * {
             *   items: [],
             *   pageNumber: 1,
             *   pageSize: 10,
             *   totalCount: 50,
             *   totalPages: 5,
             *   hasPreviousPage: false,
             *   hasNextPage: true
             * }
             */

            if (Array.isArray(data)) {
                setPayrolls(data);

                setTotalCount(data.length);

                setTotalPages(
                    data.length > 0
                        ? Math.ceil(data.length / pageSize)
                        : 0
                );
            } else {
                setPayrolls(
                    Array.isArray(data?.items)
                        ? data.items
                        : []
                );

                setTotalCount(
                    Number(data?.totalCount || 0)
                );

                setTotalPages(
                    Number(data?.totalPages || 0)
                );
            }
        } catch (err) {
            setError(
                err.message ||
                "Failed to load payroll records."
            );

            setPayrolls([]);
            setTotalCount(0);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    // ==============================
    // LOAD EMPLOYEES
    // ==============================

    const loadEmployees = async () => {
        try {
            const data =
                await employeesService.getAll();

            setEmployees(
                Array.isArray(data)
                    ? data
                    : Array.isArray(data?.items)
                        ? data.items
                        : []
            );
        } catch (err) {
            console.error(
                "Employee loading error:",
                err
            );
        }
    };

    // ==============================
    // INITIAL / PAGINATION LOAD
    // ==============================

    useEffect(() => {
        loadPayroll();
    }, [currentPage, pageSize]);

    useEffect(() => {
        loadEmployees();
    }, []);

    // ==============================
    // SEARCH / FILTER
    // ==============================

    const filteredPayrolls = useMemo(() => {
        return payrolls.filter((payroll) => {
            const employeeName =
                payroll.employeeName || "";

            const matchesSearch =
                employeeName
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const status =
                payroll.paymentStatus || "Pending";

            const matchesStatus =
                statusFilter === "All" ||
                status === statusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );
        });
    }, [
        payrolls,
        search,
        statusFilter,
    ]);

    // ==============================
    // RESET PAGE WHEN FILTER CHANGES
    // ==============================

    useEffect(() => {
        setCurrentPage(1);
    }, [search, statusFilter]);

    // ==============================
    // FORM CHANGE
    // ==============================

    const handleChange = (event) => {
        const { name, value } =
            event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    // ==============================
    // NET SALARY
    // ==============================

    const netSalary =
        Number(form.basicSalary || 0) +
        Number(form.allowances || 0) -
        Number(form.deductions || 0);

    // ==============================
    // OPEN ADD
    // ==============================

    const openAdd = () => {
        setEditingPayroll(null);

        setForm({
            ...emptyForm,
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
        });

        setError("");
        setSuccess("");
        setShowForm(true);
    };

    // ==============================
    // OPEN EDIT
    // ==============================

    const openEdit = (payroll) => {
        setEditingPayroll(payroll);

        setForm({
            employeeId:
                payroll.employeeId || "",
            month:
                payroll.month || 1,
            year:
                payroll.year ||
                new Date().getFullYear(),
            basicSalary:
                payroll.basicSalary || "",
            allowances:
                payroll.allowances || "",
            deductions:
                payroll.deductions || "",
            paymentStatus:
                payroll.paymentStatus ||
                "Pending",
        });

        setError("");
        setSuccess("");
        setShowForm(true);
    };

    // ==============================
    // SAVE
    // ==============================

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            if (!form.employeeId) {
                throw new Error(
                    "Please select an employee."
                );
            }

            if (
                Number(form.basicSalary) < 0 ||
                Number(form.allowances) < 0 ||
                Number(form.deductions) < 0
            ) {
                throw new Error(
                    "Salary values cannot be negative."
                );
            }

            if (netSalary < 0) {
                throw new Error(
                    "Net salary cannot be negative."
                );
            }

            /*
             * Backend PayrollCreateDto accepts:
             * employeeId
             * month
             * year
             * basicSalary
             * allowances
             * deductions
             *
             * paymentStatus is not sent.
             */

            const payload = {
                employeeId:
                    Number(form.employeeId),
                month:
                    Number(form.month),
                year:
                    Number(form.year),
                basicSalary:
                    Number(
                        form.basicSalary || 0
                    ),
                allowances:
                    Number(
                        form.allowances || 0
                    ),
                deductions:
                    Number(
                        form.deductions || 0
                    ),
            };

            if (editingPayroll) {
                await payrollService.update(
                    editingPayroll.id,
                    payload
                );

                setSuccess(
                    "Payroll updated successfully."
                );
            } else {
                await payrollService.create(
                    payload
                );

                setSuccess(
                    "Payroll created successfully."
                );
            }

            setShowForm(false);
            setEditingPayroll(null);
            setForm(emptyForm);

            await loadPayroll();
        } catch (err) {
            setError(
                err.message ||
                "Unable to save payroll."
            );
        } finally {
            setSaving(false);
        }
    };

    // ==============================
    // VIEW
    // ==============================

    const handleView = async (payroll) => {
        try {
            setError("");

            const data =
                await payrollService.getById(
                    payroll.id
                );

            setSelectedPayroll(data);
            setShowView(true);
        } catch (err) {
            setError(
                err.message ||
                "Unable to load payroll details."
            );
        }
    };

    // ==============================
    // DELETE
    // ==============================

    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowDelete(true);
    };

    const handleDelete = async () => {
        try {
            setSaving(true);
            setError("");

            await payrollService.remove(
                deleteId
            );

            setShowDelete(false);
            setDeleteId(null);

            setSuccess(
                "Payroll deleted successfully."
            );

            /*
             * If last record on current page
             * was deleted, move to previous page.
             */

            if (
                payrolls.length === 1 &&
                currentPage > 1
            ) {
                setCurrentPage(
                    (current) => current - 1
                );
            } else {
                await loadPayroll();
            }
        } catch (err) {
            setError(
                err.message ||
                "Unable to delete payroll."
            );
        } finally {
            setSaving(false);
        }
    };

    // ==============================
    // STATUS BADGE
    // ==============================

    const renderStatus = (status) => {
        const value =
            status || "Pending";

        return (
            <span
                className={`payroll-status ${value.toLowerCase()}`}
            >
                {value === "Paid" ? (
                    <CheckCircle2 size={14} />
                ) : (
                    <Clock3 size={14} />
                )}

                {value}
            </span>
        );
    };

    // ==============================
    // PAGINATION FUNCTIONS
    // ==============================

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(
                (current) => current - 1
            );
        }
    };

    const handleNextPage = () => {
        if (
            currentPage < totalPages
        ) {
            setCurrentPage(
                (current) => current + 1
            );
        }
    };

    const handlePageSizeChange = (event) => {
        setPageSize(
            Number(event.target.value)
        );

        setCurrentPage(1);
    };

    const startRecord =
        totalCount === 0
            ? 0
            : (currentPage - 1) *
            pageSize +
            1;

    const endRecord =
        Math.min(
            currentPage * pageSize,
            totalCount
        );

    return (
        <div className="payroll-page">

            {/* ================= HEADER ================= */}

            <div className="payroll-header">

                <div>
                    <h1>Payroll</h1>

                    <p>
                        Manage employee salary and
                        payroll records.
                    </p>
                </div>

                <button
                    className="payroll-primary-btn"
                    onClick={openAdd}
                >
                    <Plus size={18} />
                    Add Payroll
                </button>

            </div>

            {/* ================= ALERTS ================= */}

            {error && (
                <div className="payroll-alert error">
                    {error}

                    <button
                        onClick={() =>
                            setError("")
                        }
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {success && (
                <div className="payroll-alert success">
                    {success}

                    <button
                        onClick={() =>
                            setSuccess("")
                        }
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* ================= STATS ================= */}

            <div className="payroll-stats">

                <div className="payroll-stat-card">
                    <div className="stat-icon blue">
                        <WalletCards size={20} />
                    </div>

                    <div>
                        <span>
                            Total Records
                        </span>

                        <strong>
                            {totalCount}
                        </strong>
                    </div>
                </div>

                <div className="payroll-stat-card">
                    <div className="stat-icon green">
                        <CheckCircle2 size={20} />
                    </div>

                    <div>
                        <span>Paid</span>

                        <strong>
                            {
                                payrolls.filter(
                                    (p) =>
                                        p.paymentStatus ===
                                        "Paid"
                                ).length
                            }
                        </strong>
                    </div>
                </div>

                <div className="payroll-stat-card">
                    <div className="stat-icon orange">
                        <Clock3 size={20} />
                    </div>

                    <div>
                        <span>Pending</span>

                        <strong>
                            {
                                payrolls.filter(
                                    (p) =>
                                        !p.paymentStatus ||
                                        p.paymentStatus ===
                                        "Pending"
                                ).length
                            }
                        </strong>
                    </div>
                </div>

                <div className="payroll-stat-card">
                    <div className="stat-icon purple">
                        <IndianRupee size={20} />
                    </div>

                    <div>
                        <span>
                            Current Page Net Salary
                        </span>

                        <strong>
                            {formatCurrency(
                                payrolls.reduce(
                                    (sum, p) =>
                                        sum +
                                        Number(
                                            p.netSalary ||
                                            0
                                        ),
                                    0
                                )
                            )}
                        </strong>
                    </div>
                </div>

            </div>

            {/* ================= FILTER ================= */}

            <div className="payroll-toolbar">

                <div className="payroll-search">

                    <Search size={17} />

                    <input
                        type="text"
                        placeholder="Search employee..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />

                </div>

                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(
                            e.target.value
                        )
                    }
                >
                    <option value="All">
                        All Status
                    </option>

                    <option value="Paid">
                        Paid
                    </option>

                    <option value="Pending">
                        Pending
                    </option>
                </select>

                <button
                    className="refresh-btn"
                    onClick={loadPayroll}
                >
                    Refresh
                </button>

            </div>

            {/* ================= TABLE ================= */}

            <div className="payroll-table-card">

                {loading ? (
                    <div className="payroll-loading">
                        Loading payroll records...
                    </div>
                ) : filteredPayrolls.length ===
                    0 ? (
                    <div className="payroll-empty">

                        <WalletCards size={38} />

                        <h3>
                            No payroll records
                        </h3>

                        <p>
                            Create your first payroll
                            record.
                        </p>

                    </div>
                ) : (
                    <div className="payroll-table-wrap">

                        <table className="payroll-table">

                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>
                                        Employee
                                    </th>
                                    <th>
                                        Period
                                    </th>
                                    <th>
                                        Basic Salary
                                    </th>
                                    <th>
                                        Allowances
                                    </th>
                                    <th>
                                        Deductions
                                    </th>
                                    <th>
                                        Net Salary
                                    </th>
                                    <th>
                                        Status
                                    </th>
                                    <th>
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredPayrolls.map(
                                    (
                                        payroll,
                                        index
                                    ) => (
                                        <tr
                                            key={
                                                payroll.id
                                            }
                                        >

                                            <td>
                                                {
                                                    (currentPage -
                                                        1) *
                                                    pageSize +
                                                    index +
                                                    1
                                                }
                                            </td>

                                            <td>

                                                <div className="employee-info">

                                                    <div className="employee-avatar">
                                                        {(
                                                            payroll.employeeName ||
                                                            "E"
                                                        )
                                                            .charAt(
                                                                0
                                                            )
                                                            .toUpperCase()}
                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {payroll.employeeName ||
                                                                "Unknown Employee"}
                                                        </strong>

                                                        <small>
                                                            EMP-
                                                            {String(
                                                                payroll.employeeId
                                                            ).padStart(
                                                                4,
                                                                "0"
                                                            )}
                                                        </small>

                                                    </div>

                                                </div>

                                            </td>

                                            <td>

                                                <div className="period">

                                                    <strong>
                                                        {getMonthName(
                                                            payroll.month
                                                        )}
                                                    </strong>

                                                    <small>
                                                        {
                                                            payroll.year
                                                        }
                                                    </small>

                                                </div>

                                            </td>

                                            <td>
                                                {formatCurrency(
                                                    payroll.basicSalary
                                                )}
                                            </td>

                                            <td className="positive">
                                                +
                                                {formatCurrency(
                                                    payroll.allowances
                                                )}
                                            </td>

                                            <td className="negative">
                                                -
                                                {formatCurrency(
                                                    payroll.deductions
                                                )}
                                            </td>

                                            <td>
                                                <strong>
                                                    {formatCurrency(
                                                        payroll.netSalary
                                                    )}
                                                </strong>
                                            </td>

                                            <td>
                                                {renderStatus(
                                                    payroll.paymentStatus
                                                )}
                                            </td>

                                            <td>

                                                <div className="payroll-actions">

                                                    <button
                                                        title="View"
                                                        onClick={() =>
                                                            handleView(
                                                                payroll
                                                            )
                                                        }
                                                    >
                                                        <Eye size={16} />
                                                    </button>

                                                    <button
                                                        title="Edit"
                                                        onClick={() =>
                                                            openEdit(
                                                                payroll
                                                            )
                                                        }
                                                    >
                                                        <Pencil
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    </button>

                                                    <button
                                                        title="Delete"
                                                        className="danger"
                                                        onClick={() =>
                                                            confirmDelete(
                                                                payroll.id
                                                            )
                                                        }
                                                    >
                                                        <Trash2
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

                {/* ================= PAGINATION ================= */}

                <div className="payroll-pagination">

                    <div className="pagination-info">

                        Showing{" "}
                        <strong>
                            {startRecord}
                        </strong>{" "}
                        -{" "}
                        <strong>
                            {endRecord}
                        </strong>{" "}
                        of{" "}
                        <strong>
                            {totalCount}
                        </strong>{" "}
                        records

                    </div>

                    <div className="pagination-controls">

                        <div className="page-size-control">

                            <span>
                                Rows:
                            </span>

                            <select
                                value={pageSize}
                                onChange={
                                    handlePageSizeChange
                                }
                            >
                                <option value={5}>
                                    5
                                </option>

                                <option value={10}>
                                    10
                                </option>

                                <option value={20}>
                                    20
                                </option>

                                <option value={50}>
                                    50
                                </option>
                            </select>

                        </div>

                        <button
                            className="pagination-btn"
                            disabled={
                                currentPage <=
                                1
                            }
                            onClick={
                                handlePreviousPage
                            }
                        >
                            <ChevronLeft
                                size={17}
                            />

                            Previous
                        </button>

                        <span className="page-number">
                            Page{" "}
                            <strong>
                                {totalPages ===
                                    0
                                    ? 0
                                    : currentPage}
                            </strong>{" "}
                            of{" "}
                            <strong>
                                {totalPages}
                            </strong>
                        </span>

                        <button
                            className="pagination-btn"
                            disabled={
                                currentPage >=
                                totalPages ||
                                totalPages === 0
                            }
                            onClick={
                                handleNextPage
                            }
                        >
                            Next

                            <ChevronRight
                                size={17}
                            />
                        </button>

                    </div>

                </div>

            </div>

            {/* ================= ADD / EDIT MODAL ================= */}

            {showForm && (
                <div className="payroll-modal-overlay">

                    <div className="payroll-modal">

                        <div className="modal-header">

                            <div>

                                <h2>
                                    {editingPayroll
                                        ? "Edit Payroll"
                                        : "Add Payroll"}
                                </h2>

                                <p>
                                    {editingPayroll
                                        ? "Update payroll information."
                                        : "Create a new payroll record."}
                                </p>

                            </div>

                            <button
                                className="modal-close"
                                onClick={() =>
                                    setShowForm(
                                        false
                                    )
                                }
                            >
                                <X size={19} />
                            </button>

                        </div>

                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="payroll-form"
                        >

                            {/* Employee */}

                            <div className="form-group full">

                                <label>
                                    Employee
                                </label>

                                <select
                                    name="employeeId"
                                    value={
                                        form.employeeId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                >
                                    <option value="">
                                        Select employee
                                    </option>

                                    {employees.map(
                                        (
                                            employee
                                        ) => (
                                            <option
                                                key={
                                                    employee.id
                                                }
                                                value={
                                                    employee.id
                                                }
                                            >
                                                {
                                                    employee.name
                                                }
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>

                            {/* Month */}

                            <div className="form-group">

                                <label>
                                    Month
                                </label>

                                <select
                                    name="month"
                                    value={
                                        form.month
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                >
                                    {MONTHS.map(
                                        (
                                            month
                                        ) => (
                                            <option
                                                key={
                                                    month.value
                                                }
                                                value={
                                                    month.value
                                                }
                                            >
                                                {
                                                    month.label
                                                }
                                            </option>
                                        )
                                    )}
                                </select>

                            </div>

                            {/* Year */}

                            <div className="form-group">

                                <label>
                                    Year
                                </label>

                                <input
                                    type="number"
                                    name="year"
                                    min="2000"
                                    max="2100"
                                    value={
                                        form.year
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>

                            {/* Basic */}

                            <div className="form-group">

                                <label>
                                    Basic Salary
                                </label>

                                <input
                                    type="number"
                                    name="basicSalary"
                                    min="0"
                                    step="0.01"
                                    value={
                                        form.basicSalary
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="50000"
                                    required
                                />

                            </div>

                            {/* Allowances */}

                            <div className="form-group">

                                <label>
                                    Allowances
                                </label>

                                <input
                                    type="number"
                                    name="allowances"
                                    min="0"
                                    step="0.01"
                                    value={
                                        form.allowances
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="5000"
                                />

                            </div>

                            {/* Deductions */}

                            <div className="form-group">

                                <label>
                                    Deductions
                                </label>

                                <input
                                    type="number"
                                    name="deductions"
                                    min="0"
                                    step="0.01"
                                    value={
                                        form.deductions
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="2000"
                                />

                            </div>

                            {/* Status Toggle */}

                            <div className="form-group full">

                                <label>
                                    Payment Status
                                </label>

                                <div className="status-toggle-wrapper">

                                    <button
                                        type="button"
                                        className={`status-toggle ${form.paymentStatus ===
                                            "Paid"
                                            ? "active"
                                            : ""
                                            }`}
                                        onClick={() =>
                                            setForm(
                                                (
                                                    current
                                                ) => ({
                                                    ...current,
                                                    paymentStatus:
                                                        current.paymentStatus ===
                                                            "Paid"
                                                            ? "Pending"
                                                            : "Paid",
                                                })
                                            )
                                        }
                                    >
                                        <span className="toggle-circle" />

                                        <span>
                                            {form.paymentStatus ===
                                                "Paid"
                                                ? "Paid"
                                                : "Pending"}
                                        </span>
                                    </button>

                                    <small>
                                        Payment status
                                        is controlled
                                        by the backend.
                                        This toggle is
                                        displayed in
                                        the UI, but the
                                        current
                                        PayrollCreateDto
                                        does not accept
                                        paymentStatus.
                                    </small>

                                </div>

                            </div>

                            {/* Net Salary */}

                            <div className="net-preview full">

                                <div>

                                    <span>
                                        Calculated Net
                                        Salary
                                    </span>

                                    <small>
                                        Basic +
                                        Allowances -
                                        Deductions
                                    </small>

                                </div>

                                <strong>
                                    {formatCurrency(
                                        netSalary
                                    )}
                                </strong>

                            </div>

                            {/* Actions */}

                            <div className="modal-footer full">

                                <button
                                    type="button"
                                    className="secondary-btn"
                                    onClick={() =>
                                        setShowForm(
                                            false
                                        )
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="primary-btn"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingPayroll
                                            ? "Update Payroll"
                                            : "Create Payroll"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

            {/* ================= VIEW MODAL ================= */}

            {showView &&
                selectedPayroll && (
                    <div className="payroll-modal-overlay">

                        <div className="payroll-modal view-modal">

                            <div className="modal-header">

                                <div>

                                    <h2>
                                        Payroll Details
                                    </h2>

                                    <p>
                                        Complete payroll
                                        information.
                                    </p>

                                </div>

                                <button
                                    className="modal-close"
                                    onClick={() =>
                                        setShowView(
                                            false
                                        )
                                    }
                                >
                                    <X size={19} />
                                </button>

                            </div>

                            <div className="view-profile">

                                <div className="large-avatar">
                                    {(
                                        selectedPayroll.employeeName ||
                                        "E"
                                    )
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div>

                                    <h3>
                                        {
                                            selectedPayroll.employeeName
                                        }
                                    </h3>

                                    <span>
                                        Employee ID:{" "}
                                        {
                                            selectedPayroll.employeeId
                                        }
                                    </span>

                                </div>

                            </div>

                            <div className="detail-grid">

                                <div>

                                    <span>
                                        Payroll Period
                                    </span>

                                    <strong>
                                        {getMonthName(
                                            selectedPayroll.month
                                        )}{" "}
                                        {
                                            selectedPayroll.year
                                        }
                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        Status
                                    </span>

                                    {renderStatus(
                                        selectedPayroll.paymentStatus
                                    )}

                                </div>

                                <div>

                                    <span>
                                        Basic Salary
                                    </span>

                                    <strong>
                                        {formatCurrency(
                                            selectedPayroll.basicSalary
                                        )}
                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        Allowances
                                    </span>

                                    <strong>
                                        {formatCurrency(
                                            selectedPayroll.allowances
                                        )}
                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        Deductions
                                    </span>

                                    <strong>
                                        {formatCurrency(
                                            selectedPayroll.deductions
                                        )}
                                    </strong>

                                </div>

                                <div className="net-detail">

                                    <span>
                                        Net Salary
                                    </span>

                                    <strong>
                                        {formatCurrency(
                                            selectedPayroll.netSalary
                                        )}
                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        Paid Date
                                    </span>

                                    <strong>
                                        {selectedPayroll.paidDate
                                            ? new Date(
                                                selectedPayroll.paidDate
                                            ).toLocaleDateString(
                                                "en-IN"
                                            )
                                            : "Not Paid"}
                                    </strong>

                                </div>

                            </div>

                            <div className="modal-footer">

                                <button
                                    className="secondary-btn"
                                    onClick={() =>
                                        setShowView(
                                            false
                                        )
                                    }
                                >
                                    Close
                                </button>

                            </div>

                        </div>

                    </div>
                )}

            {/* ================= DELETE MODAL ================= */}

            {showDelete && (
                <div className="payroll-modal-overlay">

                    <div className="delete-modal">

                        <div className="delete-icon">
                            <Trash2 size={22} />
                        </div>

                        <h2>
                            Delete Payroll?
                        </h2>

                        <p>
                            Are you sure you want to
                            delete this payroll record?
                            This action cannot be undone.
                        </p>

                        <div className="modal-footer">

                            <button
                                className="secondary-btn"
                                onClick={() =>
                                    setShowDelete(
                                        false
                                    )
                                }
                            >
                                Cancel
                            </button>

                            <button
                                className="delete-btn"
                                onClick={
                                    handleDelete
                                }
                                disabled={saving}
                            >
                                {saving
                                    ? "Deleting..."
                                    : "Delete"}
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}