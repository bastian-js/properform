import { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [pwFocused, setPwFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = password.length >= 6;
  const canSubmit = emailValid && passwordValid;

  const handleLogin = async () => {
    setError("");
    if (!canSubmit) return;
    setLoading(true);

    try {
      const res = await fetch("https://api.properform.app/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        navigate("/");
      } else {
        if (data.statusCode === 429) {
          setError("Too many login attempts. Please try again later.");
          return;
        }

        setError("Invalid credentials. Only admins can access media.");
      }
    } catch {
      setError("Login failed. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
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
    <div style={{ minHeight: "100vh" }}>
      <div className="login-page">
        <Grain />
        <form
          className="login-card login-card-enter"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div className="login-brand-row">
            <span className="login-dot" />
            <span className="login-brand-name">ProPerform</span>
          </div>

          <div className="login-heading-block">
            <h1 className="login-heading">Media Library</h1>
            <p className="login-sub">Sign in as admin to continue.</p>
          </div>

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
                  paddingRight: 48,
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

          {error && (
            <div className="login-error">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-btn"
            disabled={loading || !canSubmit}
            style={{ opacity: !canSubmit && !loading ? 0.35 : 1 }}
          >
            {loading ? <span className="login-spinner" /> : "Sign in"}
          </button>
        </form>
      </div>
    </div>
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
