import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock } from "lucide-react";
import { API_BASE_URL } from "../config/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) return alert("Bitte alles ausfüllen!");
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/trainers/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem("accessToken", data.token);
        localStorage.setItem("trainerId", data.tid.toString());
        localStorage.setItem("inviteCode", data.code);
        setTimeout(() => navigate("/dashboard", { replace: true }), 10);
      } else {
        alert(data.message || "Email oder Passwort ist falsch.");
      }
    } catch {
      alert("Verbindung zum Server nicht möglich.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#1E3A8A] dark:text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 transition-all";

  return (
    <div className="bg-[#f8fafc] dark:bg-[#0F172A] min-h-[calc(100vh-64px)] flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#F97316]/10 flex items-center justify-center mx-auto mb-4">
            <LogIn size={22} className="text-[#F97316]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1E3A8A] dark:text-white mb-1">
            Willkommen zurück
          </h1>
          <p className="text-sm text-[#64748b] dark:text-[#94A3B8]">
            Logge dich in dein Trainer-Konto ein
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#1E3A8A] dark:text-slate-300 flex items-center gap-1.5">
                <Mail size={12} />
                E-Mail Adresse
              </label>
              <input
                className={inputCls}
                placeholder="trainer@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#1E3A8A] dark:text-slate-300 flex items-center gap-1.5">
                <Lock size={12} />
                Passwort
              </label>
              <input
                className={inputCls}
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>

            <button
              className={`mt-2 w-full flex items-center justify-center gap-2 bg-[#F97316] text-white font-semibold py-3 rounded-xl border-0 transition-colors ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-orange-500 cursor-pointer"}`}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-[spin_0.8s_linear_infinite]" />
              ) : (
                <>
                  <LogIn size={15} />
                  Anmelden
                </>
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-[#64748b] dark:text-[#94A3B8] mt-5">
          Nur für autorisierte Trainer
        </p>
      </div>
    </div>
  );
}
