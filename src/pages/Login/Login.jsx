
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Loader2,
} from "lucide-react";

import Button from "../../components/atoms/Button/Button";
import { authService } from "../../services/authService";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();

    if (loading) return;

    setError("");

    const payload = {
      email: email.trim(),
      password: password,
    };

    if (!payload.email || !payload.password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);

    try {
      await authService.login(payload);

      const destination =
        location.state?.from || "/dashboard";

      navigate(destination, { replace: true });
    } catch (err) {
      setError(
        err.message || "Login failed. Please try again."
      );
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
            EMS PRO • ENTERPRISE HR
          </span>

          <h1>
            Manage your people.
            <br />
            <em>Build better teams.</em>
          </h1>

          <p>
            One intelligent workspace for employees,
            attendance, payroll, performance and
            organizational operations.
          </p>

          <div className="auth-points">
            <span>
              <ShieldCheck size={17} />
              Secure JWT authentication
            </span>
            <span>
              <ShieldCheck size={17} />
              Workforce insights
            </span>
            <span>
              <ShieldCheck size={17} />
              .NET API integration
            </span>
          </div>
        </div>

        <div className="auth-glow auth-glow-one" />
        <div className="auth-glow auth-glow-two" />
      </div>

      <div className="auth-panel">
        <div className="auth-form-wrap">
          <div className="mobile-brand">
            <div className="auth-logo">E</div>
            <strong>EMS Pro</strong>
          </div>

          <div className="auth-heading">
            <span>WELCOME BACK</span>
            <h2>Sign in to your workspace</h2>
            <p>
              Use the account created by your EMS
              .NET backend.
            </p>
          </div>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="auth-form">
            <label className="auth-field">
              <span>Email address</span>
              <div className="auth-input">
                <Mail size={17} />
                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="admin@company.com"
                  autoComplete="username"
                  required
                  disabled={loading}
                />
              </div>
            </label>

            <label className="auth-field">
              <span>Password</span>
              <div className="auth-input">
                <LockKeyhole size={17} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  disabled={loading}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <div className="auth-options">
              <span>Secure JWT session</span>
              <span>Session expires automatically</span>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={17} className="spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={17} />
                </>
              )}
            </Button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <p className="auth-switch">
            Don't have an account?{" "}
            <Link to="/register">Create account</Link>
          </p>

          <small className="auth-demo">
            New accounts are registered as Employee.
            Admin access follows your backend role.
          </small>
        </div>
      </div>
    </div>
  );
}