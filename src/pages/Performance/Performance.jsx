import { useMemo, useState } from "react";
import { Award, Target, TrendingUp, Users, Plus, Pencil, Trash2, RefreshCw, Search, X, AlertCircle, Star, } from "lucide-react";

import PageHeader from "../../components/molecules/PageHeader/PageHeader";
import ProgressBar from "../../components/atoms/ProgressBar/ProgressBar";
import Avatar from "../../components/atoms/Avatar/Avatar";
import Button from "../../components/atoms/Button/Button";
import Modal from "../../components/molecules/Modal/Modal";
import { useApp } from "../../context/AppContext";
import { authService } from "../../services/authService";
import "./Performance.css";

const getBlankForm = (userId = "") => ({
    employeeId: "", score: "", reviewPeriod: "", goalsCompleted: "0", comments: "",
    reviewedByUserId: String(userId || ""),
});

export default function Performance() {
    const {
        performance = [],
        employees = [],
        createPerformance,
        updatePerformance,
        deletePerformance,
        refresh,
        loading,
    } = useApp();

    const currentUser = authService.getUser();
    const isAdmin = currentUser?.role?.toLowerCase() === "admin";

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(() =>
        getBlankForm(currentUser?.userId)
    );
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [search, setSearch] = useState("");
    const [notice, setNotice] = useState("");

    const total = performance.length;

    const avg = total
        ? performance.reduce(
            (sum, item) => sum + Number(item.score || 0),
            0
        ) / total
        : 0;

    const goals = total
        ? performance.reduce(
            (sum, item) => sum + Number(item.goalsCompleted || 0),
            0
        ) / total
        : 0;

    const excellent = performance.filter(
        (p) => Number(p.score) >= 90
    ).length;

    const strong = performance.filter(
        (p) => Number(p.score) >= 80 && Number(p.score) < 90
    ).length;

    const developing = performance.filter(
        (p) => Number(p.score) >= 70 && Number(p.score) < 80
    ).length;

    const needs = Math.max(
        0,
        total - excellent - strong - developing
    );

    const sorted = useMemo(() => {
        const query = search.trim().toLowerCase();

        return [...performance]
            .filter((p) =>
                `${p.employeeName || ""} ${p.reviewPeriod || ""}`
                    .toLowerCase()
                    .includes(query)
            )
            .sort((a, b) => Number(b.score) - Number(a.score));
    }, [performance, search]);

    const openCreate = () => {
        setEditing(null);
        setForm({
            ...getBlankForm(currentUser?.userId),
            employeeId: String(employees[0]?.id || ""),
        });
        setError("");
        setNotice("");
        setOpen(true);
    };

    const openEdit = (item) => {
        setEditing(item);
        setForm({
            employeeId: String(item.employeeId || ""),
            score: String(item.score ?? ""),
            reviewPeriod: item.reviewPeriod || "",
            goalsCompleted: String(item.goalsCompleted ?? 0),
            comments: item.comments || "",
            reviewedByUserId: String(
                item.reviewedByUserId || currentUser?.userId || ""
            ),
        });
        setError("");
        setNotice("");
        setOpen(true);
    };

    const closeModal = () => {
        if (saving) return;
        setOpen(false);
        setEditing(null);
        setError("");
    };

    const save = async (event) => {
        event.preventDefault();
        setError("");
        setNotice("");

        const score = Number(form.score);
        const goalsCompleted = Number(form.goalsCompleted);
        const employeeId = Number(form.employeeId);

        if (!employeeId || !Number.isInteger(employeeId)) {
            setError("Please select a valid employee.");
            return;
        }

        if (!Number.isFinite(score) || score < 0 || score > 100) {
            setError("Score must be between 0 and 100.");
            return;
        }

        if (
            !Number.isInteger(goalsCompleted) ||
            goalsCompleted < 0
        ) {
            setError("Goals completed must be a non-negative whole number.");
            return;
        }

        if (!form.reviewPeriod.trim()) {
            setError("Please enter the review period.");
            return;
        }

        const payload = {
            employeeId,
            score,
            reviewPeriod: form.reviewPeriod.trim(),
            goalsCompleted,
            comments: form.comments.trim(),
            reviewedByUserId: form.reviewedByUserId
                ? Number(form.reviewedByUserId)
                : null,
        };

        try {
            setSaving(true);

            if (editing) {
                await updatePerformance(editing.id, payload);
                setNotice("Performance review updated successfully.");
            } else {
                await createPerformance(payload);
                setNotice("Performance review created successfully.");
            }

            setOpen(false);
            setEditing(null);
            setForm(getBlankForm(currentUser?.userId));
        } catch (err) {
            setError(err?.message || "Unable to save performance review.");
        } finally {
            setSaving(false);
        }
    };

    const remove = async (item) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete the performance review for ${item.employeeName || "this employee"}?`
        );

        if (!confirmed) return;

        setError("");
        setNotice("");
        setDeletingId(item.id);

        try {
            await deletePerformance(item.id);
            setNotice("Performance review deleted successfully.");
        } catch (err) {
            setError(
                err?.message || "Unable to delete performance review."
            );
        } finally {
            setDeletingId(null);
        }
    };

    const distribution = [
        { label: "Excellent", range: "90–100%", value: excellent },
        { label: "Strong", range: "80–89%", value: strong },
        { label: "Developing", range: "70–79%", value: developing },
        { label: "Needs Support", range: "Below 70%", value: needs },
    ];

    return (
        <>
            <PageHeader
                title="Performance"
                description="Review scores, goals and employee performance outcomes."
                action={
                    <div className="employee-header-actions">
                        <Button
                            variant="secondary"
                            onClick={refresh}
                            disabled={loading}
                        >
                            <RefreshCw
                                size={16}
                                className={loading ? "spin-icon" : ""}
                            />
                            {loading ? "Refreshing..." : "Refresh"}
                        </Button>

                        {isAdmin && (
                            <Button onClick={openCreate}>
                                <Plus size={16} />
                                Add Review
                            </Button>
                        )}
                    </div>
                }
            />

            {notice && (
                <div className="employee-notice success-notice" role="status">
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

            {error && !open && (
                <div className="employee-form-error" role="alert">
                    <AlertCircle size={17} />
                    <span>{error}</span>
                </div>
            )}

            <div className="performance-stats">
                <div>
                    <Award />
                    <span>Average Score</span>
                    <strong>{avg.toFixed(0)}%</strong>
                    <small>Across review records</small>
                </div>

                <div>
                    <Target />
                    <span>Avg. Goals Completed</span>
                    <strong>{goals.toFixed(0)}</strong>
                    <small>Goals per review</small>
                </div>

                <div>
                    <TrendingUp />
                    <span>Strong / Excellent</span>
                    <strong>{excellent + strong}</strong>
                    <small>Review records</small>
                </div>

                <div>
                    <Users />
                    <span>Reviews</span>
                    <strong>{total}</strong>
                    <small>Total review records</small>
                </div>
            </div>

            <div className="performance-layout">
                <div className="performance-card">
                    <div className="performance-head">
                        <div>
                            <h3>Performance Reviews</h3>
                            <p>Sorted by review score</p>
                        </div>

                        <div className="search-inline">
                            <Search size={16} />
                            <input
                                type="search"
                                placeholder="Search reviews..."
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                aria-label="Search performance reviews"
                            />
                        </div>
                    </div>

                    {sorted.map((item) => (
                        <div className="performer" key={item.id}>
                            <Avatar name={item.employeeName || "Employee"} />

                            <div className="performer-main">
                                <div>
                                    <strong>
                                        {item.employeeName || "Employee"}
                                    </strong>
                                    <small>
                                        {item.reviewPeriod || "No review period"} ·{" "}
                                        {Number(item.goalsCompleted || 0)} goals completed
                                    </small>
                                </div>

                                <b>{Number(item.score || 0)}%</b>

                                <ProgressBar
                                    value={Math.min(
                                        100,
                                        Math.max(0, Number(item.score || 0))
                                    )}
                                />

                                {isAdmin && (
                                    <div className="row-actions">
                                        <button
                                            type="button"
                                            title="Edit review"
                                            aria-label={`Edit review for ${item.employeeName || "employee"}`}
                                            onClick={() => openEdit(item)}
                                        >
                                            <Pencil size={15} />
                                        </button>

                                        <button
                                            type="button"
                                            title="Delete review"
                                            aria-label={`Delete review for ${item.employeeName || "employee"}`}
                                            disabled={deletingId === item.id}
                                            onClick={() => remove(item)}
                                        >
                                            {deletingId === item.id ? (
                                                <RefreshCw size={15} className="spin-icon" />
                                            ) : (
                                                <Trash2 size={15} />
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {!sorted.length && (
                        <div className="empty-state">
                            {search.trim()
                                ? "No performance reviews match your search."
                                : "No performance reviews available."}
                        </div>
                    )}
                </div>

                <div className="performance-card">
                    <div className="performance-head">
                        <div>
                            <h3>Performance Distribution</h3>
                            <p>Review records by score range</p>
                        </div>
                        <Star size={19} />
                    </div>

                    <div className="distribution">
                        {distribution.map(({ label, range, value }) => (
                            <div key={label}>
                                <div>
                                    <span>{label}</span>
                                    <strong>{value}</strong>
                                </div>

                                <small>{range}</small>

                                <div className="dist-bar">
                                    <i
                                        style={{
                                            width: `${total ? (value / total) * 100 : 0
                                                }%`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Modal
                open={open}
                onClose={closeModal}
                title={
                    editing
                        ? "Edit Performance Review"
                        : "Create Performance Review"
                }
            >
                <form className="employee-form" onSubmit={save}>
                    {error && (
                        <div className="employee-form-error" role="alert">
                            <AlertCircle size={17} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="form-grid">
                        <label>
                            Employee
                            <select
                                required
                                value={form.employeeId}
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        employeeId: event.target.value,
                                    })
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
                            Score (0–100)
                            <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                required
                                value={form.score}
                                onChange={(event) =>
                                    setForm({ ...form, score: event.target.value })
                                }
                            />
                        </label>

                        <label>
                            Review Period
                            <input
                                type="text"
                                maxLength="50"
                                required
                                placeholder="e.g. Q3 2026"
                                value={form.reviewPeriod}
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        reviewPeriod: event.target.value,
                                    })
                                }
                            />
                        </label>

                        <label>
                            Goals Completed
                            <input
                                type="number"
                                min="0"
                                step="1"
                                required
                                value={form.goalsCompleted}
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        goalsCompleted: event.target.value,
                                    })
                                }
                            />
                        </label>

                        <label className="full-field">
                            Comments
                            <textarea
                                rows="3"
                                maxLength="1000"
                                placeholder="Enter performance review comments..."
                                value={form.comments}
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        comments: event.target.value,
                                    })
                                }
                            />
                        </label>
                    </div>

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
                                : editing
                                    ? "Save Changes"
                                    : "Create Review"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}