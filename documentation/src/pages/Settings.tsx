import { useState, useEffect, useRef } from "react";
import ToggleSwitch from "../components/ToggleSwitch";

export default function Settings() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved ? JSON.parse(saved) : false;
  });

  const isSettingsInitiated = useRef(false);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(sidebarCollapsed));
    isSettingsInitiated.current = true;
    window.dispatchEvent(
      new CustomEvent("sidebarStateChanged", {
        detail: { collapsed: sidebarCollapsed },
      }),
    );
  }, [sidebarCollapsed]);

  useEffect(() => {
    const handleSidebarStateChange = (event: Event) => {
      if (isSettingsInitiated.current) {
        isSettingsInitiated.current = false;
        return;
      }
      const customEvent = event as CustomEvent;
      setSidebarCollapsed(customEvent.detail.collapsed);
    };

    window.addEventListener("sidebarStateChanged", handleSidebarStateChange);
    return () => {
      window.removeEventListener(
        "sidebarStateChanged",
        handleSidebarStateChange,
      );
    };
  }, []);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-12">Settings</h1>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-white mb-2">
                Sidebar View
              </h2>
              <p className="text-gray-400">
                {sidebarCollapsed
                  ? "Sidebar is currently collapsed"
                  : "Sidebar is currently expanded"}
              </p>
            </div>

            <ToggleSwitch
              checked={sidebarCollapsed}
              onChange={setSidebarCollapsed}
              ariaLabel="Toggle sidebar collapsed"
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-900 bg-opacity-20 border border-blue-800 rounded-lg">
          <p className="text-blue-300 text-sm">
            💡 Tip: This setting is saved locally and persists after reloading.
          </p>
        </div>
      </div>
    </div>
  );
}
