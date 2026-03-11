import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { apiFetch } from "./helpers/apiFetch";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("no token.");
        navigate("/login");
        return;
      }

      try {
        const response = await apiFetch(
          "https://api.properform.app/auth/verify-token",
        );

        if (!response.ok) {
          console.log("invalid token.");
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (err) {
        console.error("token verification failed:", err);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    verifyToken();
  }, [navigate]);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {location.pathname === "/login" ? null : <Sidebar />}
      <div className="flex flex-col flex-1">
        {location.pathname === "/login" ? null : <Header />}
        <main className="flex-1 px-8 py-2 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
