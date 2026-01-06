interface ModeToggleProps {
  mode: "learn" | "practice";
  onModeChange?: (mode: "learn" | "practice") => void;
}

export default function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex gap-3 w-full max-w-md mx-auto">
      {/* Learn Mode Button */}
      <button
        onClick={() => onModeChange?.("learn")}
        className={`
          flex-1 py-4 px-6 rounded-2xl font-bold text-lg
          transition-all duration-200 active:scale-95
          ${
            mode === "learn"
              ? "bg-blue-500 text-white shadow-lg"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }
        `}
      >
        <div className="flex items-center justify-center gap-2">
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
          </svg>
          Learn
        </div>
      </button>

      {/* Practice Mode Button */}
      <button
        onClick={() => onModeChange?.("practice")}
        className={`
          flex-1 py-4 px-6 rounded-2xl font-bold text-lg
          transition-all duration-200 active:scale-95
          ${
            mode === "practice"
              ? "bg-green-500 text-white shadow-lg"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }
        `}
      >
        <div className="flex items-center justify-center gap-2">
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Practice
        </div>
      </button>
    </div>
  );
}
