import { useThemeStore } from "../store/ThemeStore.js";
// Zustand store to manage and persist the selected theme

import { THEMES } from "../constant/index.js";
// List of available theme names

import { MoveLeft } from "lucide-react";
// Icon for back navigation

import { useNavigate } from "react-router-dom";
// Hook for programmatic navigation

const SettingsPage = () => {
  // Get current theme and setter function from theme store
  const { theme, setTheme } = useThemeStore();

  // Navigation handler
  const navigate = useNavigate();

  return (
    // Main container with centered layout and padding
    <div className="h-full container mx-auto px-4 pt-5 max-w-5xl">
      <div className="space-y-6">
        {/* Header section */}
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold flex gap-2 items-center">
            {/* Back button to navigate to home */}
            <MoveLeft onClick={() => navigate("/home")} size={18} />
            Theme
          </h2>

          {/* Description text */}
          <p className="text-sm text-base-content/70">Choose a theme</p>
        </div>

        {/* Theme selection grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {THEMES.map((t) => (
            // Theme button
            <button
              key={t}
              className={`
                group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
                ${theme === t ? "bg-base-200" : "hover:bg-base-200/50"}
              `}
              // Set selected theme on click
              onClick={() => setTheme(t)}
            >
              {/* Theme color preview */}
              <div
                className="relative h-8 w-full rounded-md overflow-hidden"
                data-theme={t} // Apply theme styles dynamically
              >
                <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                  {/* Sample theme colors */}
                  <div className="rounded bg-primary"></div>
                  <div className="rounded bg-secondary"></div>
                  <div className="rounded bg-accent"></div>
                  <div className="rounded bg-neutral"></div>
                </div>
              </div>

              {/* Theme name label */}
              <span className="text-[11px] font-medium truncate w-full text-center">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
