import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    } else {
      setIsAuthorized(true);
    }
  }, [navigate]);

  if (isAuthorized === null) return null;
  if (isAuthorized) return <>{children}</>;
  return null;
}
