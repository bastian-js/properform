import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { apiFetch } from "./helpers/apiFetch";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refresh_token");

      if (!token && !refreshToken) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const res = await apiFetch("https://api.properform.app/users/me");

        if (!res.ok) {
          navigate("/login", { replace: true });
        }
      } catch {
        navigate("/login", { replace: true });
      }
    };

    if (location.pathname !== "/login") {
      initAuth();
    }
  }, [navigate, location.pathname]);

  return (
    <div className="flex h-screen w-full max-w-full overflow-x-hidden bg-gray-900 text-white">
      {location.pathname === "/login" ? null : <Sidebar />}
      <div className="flex min-w-0 flex-1 flex-col">
        {location.pathname === "/login" ? null : <Header />}
        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-4 py-2 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
