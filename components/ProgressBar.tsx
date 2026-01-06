interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
}

export default function ProgressBar({
  current,
  total,
  showLabel = true,
}: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full">
      {/* Progress Label */}
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-700">
            Progress
          </span>
          <span className="text-sm font-bold text-green-600 transition-all duration-300">
            {current} / {total}
          </span>
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
          style={{ width: `${percentage}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
