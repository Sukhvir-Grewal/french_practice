interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
  isInfinite?: boolean;
}

export default function ProgressBar({
  current,
  total,
  showLabel = true,
  isInfinite = false,
}: ProgressBarProps) {
  const percentage = isInfinite ? 100 : (current / total) * 100;

  return (
    <div className="w-full">
      {/* Progress Label */}
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-700">
            Progress
          </span>
          <span className={`text-sm font-bold transition-all duration-300 ${isInfinite ? "text-red-600" : "text-green-600"}`}>
            {isInfinite ? "∞ Infinite" : `${current} / ${total}`}
          </span>
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden ${
            isInfinite
              ? "bg-gradient-to-r from-red-500 to-red-600"
              : "bg-gradient-to-r from-green-400 to-green-600"
          }`}
          style={{ width: `${percentage}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
