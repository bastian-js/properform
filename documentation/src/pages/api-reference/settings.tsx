import { useState, useEffect, useRef } from "react";

export default function Settings() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved ? JSON.parse(saved) : false;
  });

  const [isClicking, setIsClicking] = useState(false);
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

  const handleToggleClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsClicking(true);
    setSidebarCollapsed(e.target.checked);
    setTimeout(() => setIsClicking(false), 200);
  };

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <style>{`
        @keyframes togglePulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        @keyframes toggleGlow {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          100% { box-shadow: 0 0 0 8px rgba(59, 130, 246, 0); }
        }
        .toggle-click {
          animation: togglePulse 0.3s ease-out;
        }
        .toggle-glow {
          animation: toggleGlow 0.6s ease-out;
        }
      `}</style>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-12">Settings</h1>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between">
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

            <div className="flex items-center gap-4">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={sidebarCollapsed}
                  onChange={handleToggleClick}
                  className="w-0 h-0 opacity-0"
                />
                <div
                  className={`relative w-16 h-8 rounded-full transition-all duration-300 group-hover:shadow-lg ${
                    isClicking && "toggle-click"
                  } ${sidebarCollapsed ? "bg-blue-600" : "bg-gray-700"} ${
                    !isClicking &&
                    "group-hover:scale-110 group-hover:shadow-blue-500/50"
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${
                      sidebarCollapsed ? "translate-x-8" : "translate-x-0"
                    }`}
                  />
                </div>
              </label>
            </div>
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
