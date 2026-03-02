import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

export default function App() {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 px-8 py-2 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
