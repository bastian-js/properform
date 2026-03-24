import { useState } from "react";
import { Eye, EyeOff, AlertCircle, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const LOGOUT_ALL_LOCK_KEY = "pf_logout_all_locked";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [pwFocused, setPwFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState("");
  const [resetError, setResetError] = useState("");

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = password.length >= 6;
  const canSubmit = emailValid && passwordValid;

  const handleLogin = async () => {
    setError("");
    if (!canSubmit) return;
    setLoading(true);

    try {
      const res = await fetch("https://api.properform.app/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.error || "Login failed.");
      } else {
        // Store tokens
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.removeItem(LOGOUT_ALL_LOCK_KEY);
        // Redirect to account page
        navigate("/");
      }
    } catch {
      setError("Network error. Please try again.");
    }

    setLoading(false);
  };

  const handleForgotPassword = async () => {
    setResetError("");
    setResetSuccess("");

    if (!emailValid) {
      setResetError("Please enter a valid email first.");
      return;
    }

    setResetLoading(true);

    try {
      const res = await fetch(
        "https://api.properform.app/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      let data: { message?: string; error?: string } | null = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        setResetError(
          data?.message || data?.error || "Could not send reset email.",
        );
      } else {
        setResetSuccess(
          data?.message || "Password reset email sent. Check your inbox.",
        );
      }
    } catch {
      setResetError("Network error. Please try again.");
    }

    setResetLoading(false);
  };

  const getBorder = (value: string, valid: boolean, focused: boolean) => {
    if (value.length > 0 && !valid) return "1.5px solid rgba(239,68,68,.6)";
    if (valid) return "1.5px solid rgba(74,222,128,.5)";
    if (focused) return "1.5px solid rgba(31,58,138,.7)";
    return "1.5px solid rgba(255,255,255,.08)";
  };

  const getGlow = (value: string, valid: boolean, focused: boolean) => {
    if (value.length > 0 && !valid) return "0 0 0 3px rgba(239,68,68,.08)";
    if (valid) return "0 0 0 3px rgba(74,222,128,.07)";
    if (focused) return "0 0 0 3px rgba(31,58,138,.18)";
    return "none";
  };

  const getBg = (value: string, valid: boolean) => {
    if (value.length > 0 && !valid) return "rgba(239,68,68,.04)";
    if (valid) return "rgba(74,222,128,.04)";
    return "rgba(255,255,255,.03)";
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          gap: 24,
        }}
      >
        <div className="login-page" style={{ flex: 1 }}>
          <Grain />

          <form
            className="login-card login-card-enter"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            {/* Brand */}
            <div className="login-brand-row">
              <span className="login-dot" />
              <span className="login-brand-name">ProPerform</span>
            </div>

            {/* Heading */}
            <div className="login-heading-block">
              <h1 className="login-heading">Welcome back</h1>
              <p className="login-sub">Sign in to your account to continue.</p>
            </div>

            {/* Email input */}
            <div className="login-field">
              <label className="login-label">Email</label>
              <div style={{ position: "relative" }}>
                <input
                  type="email"
                  className="login-input"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  style={{
                    border: getBorder(email, emailValid, emailFocused),
                    boxShadow: getGlow(email, emailValid, emailFocused),
                    background: getBg(email, emailValid),
                  }}
                />
              </div>
            </div>

            {/* Password input */}
            <div className="login-field">
              <label className="login-label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"}
                  className="login-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPwFocused(true)}
                  onBlur={() => setPwFocused(false)}
                  style={{
                    border: getBorder(password, passwordValid, pwFocused),
                    boxShadow: getGlow(password, passwordValid, pwFocused),
                    background: getBg(password, passwordValid),
                    paddingRight: 72,
                  }}
                />
                <button
                  type="button"
                  className="login-eye"
                  onClick={() => setShowPw((v) => !v)}
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Forgot password link */}
            <div className="login-forgot-row">
              <button
                type="button"
                className="login-link login-link-btn"
                onClick={handleForgotPassword}
                disabled={resetLoading}
              >
                {resetLoading ? "Sending..." : "Forgot password?"}
              </button>
            </div>

            {resetSuccess && (
              <div className="login-success">
                <Check size={14} />
                {resetSuccess}
              </div>
            )}

            {resetError && (
              <div className="login-error">
                <AlertCircle size={14} />
                {resetError}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="login-error">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              className="login-btn"
              disabled={loading || !canSubmit}
              style={{ opacity: !canSubmit && !loading ? 0.35 : 1 }}
            >
              {loading ? <span className="login-spinner" /> : "Sign in"}
            </button>

            {/* Sign up link */}
            <div className="login-signup-row">
              <span className="login-footer-text">
                Don't have an account?{" "}
                <a href="/signup" className="login-link">
                  Sign up
                </a>
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

function Grain() {
  return (
    <svg
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity: 0.03,
        zIndex: 0,
      }}
    >
      <filter id="grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  );
}
