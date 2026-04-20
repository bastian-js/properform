import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Media from "./pages/Media";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Media />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
