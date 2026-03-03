import { useEffect, useState } from "react";

type ToggleSwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
};

export default function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  className = "",
  ariaLabel = "Toggle",
}: ToggleSwitchProps) {
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    if (!isClicking) return;
    const t = window.setTimeout(() => setIsClicking(false), 200);
    return () => window.clearTimeout(t);
  }, [isClicking]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    setIsClicking(true);
    onChange(e.target.checked);
  };

  return (
    <>
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
        .toggle-click { animation: togglePulse 0.3s ease-out; }
        .toggle-glow { animation: toggleGlow 0.6s ease-out; }
      `}</style>

      <label
        className={`flex items-center cursor-pointer group select-none ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        } ${className}`}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          aria-label={ariaLabel}
          className="w-0 h-0 opacity-0"
        />
        <div
          className={`relative w-16 h-8 rounded-full transition-all duration-300 group-hover:shadow-lg ${
            isClicking ? "toggle-click toggle-glow" : ""
          } ${checked ? "bg-blue-600" : "bg-gray-700"} ${
            !disabled && !isClicking
              ? "group-hover:scale-110 group-hover:shadow-blue-500/50"
              : ""
          }`}
        >
          <div
            className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${
              checked ? "translate-x-8" : "translate-x-0"
            }`}
          />
        </div>
      </label>
    </>
  );
}
