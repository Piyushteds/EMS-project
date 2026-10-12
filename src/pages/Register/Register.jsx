
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowRight,
    LockKeyhole,
    Mail,
    UserRound,
    Loader2,
} from "lucide-react";

import Button from "../../components/atoms/Button/Button";
import { authService } from "../../services/authService";

import "../Login/Login.css";
import "./Register.css";

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        role: "Employee",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const change = (e) => {
        const { name, value } = e.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Call only the registration API.
            await authService.register(form);

            // Navigate without reloading the application.
            navigate("/login", { replace: true });
        } catch (err) {
            setError(err.message || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-visual">
                <div className="auth-visual-content">
                    <div className="auth-logo">E</div>

                    <span className="auth-kicker">
                        EMS PRO • WORKFORCE PLATFORM
                    </span>

                    <h1>
                        Create your
                        <br />
                        <em>workspace account.</em>
                    </h1>

                    <p>
                        Registration is connected directly to the
                        ASP.NET Core authentication API.
                    </p>
                </div>
            </div>

            <div className="auth-panel">
                <div className="auth-form-wrap">
                    <div className="auth-heading">
                        <span>NEW ACCOUNT</span>
                        <h2>Create your EMS account</h2>
                        <p>
                            Your account will be stored securely in
                            SQL Server through the .NET API.
                        </p>
                    </div>

                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={submit}
                        className="auth-form"
                    >
                        <label className="auth-field">
                            <span>Full name</span>
                            <div className="auth-input">
                                <UserRound size={17} />
                                <input
                                    name="fullName"
                                    type="text"
                                    value={form.fullName}
                                    onChange={change}
                                    required
                                />
                            </div>
                        </label>

                        <label className="auth-field">
                            <span>Email</span>
                            <div className="auth-input">
                                <Mail size={17} />
                                <input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={change}
                                    required
                                />
                            </div>
                        </label>

                        <label className="auth-field">
                            <span>Password</span>
                            <div className="auth-input">
                                <LockKeyhole size={17} />
                                <input
                                    name="password"
                                    type="password"
                                    value={form.password}
                                    onChange={change}
                                    minLength={6}
                                    required
                                />
                            </div>
                        </label>

                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2
                                        size={17}
                                        className="spin"
                                    />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight size={17} />
                                </>
                            )}
                        </Button>
                    </form>

                    <p className="auth-switch">
                        Already have an account?{" "}
                        <Link to="/login">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}