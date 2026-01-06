interface SpeedControlProps {
  currentSpeed: number;
  onSpeedChange: (speed: number) => void;
}

export default function SpeedControl({
  currentSpeed,
  onSpeedChange,
}: SpeedControlProps) {
  const speeds = [
    { value: 0.6, label: "Slow", icon: "🐢" },
    { value: 0.8, label: "Normal", icon: "🎯" },
    { value: 1.0, label: "Fast", icon: "🚀" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-3 mb-4">
      <p className="text-xs text-gray-600 font-semibold mb-2 text-center">
        Playback Speed
      </p>
      <div className="flex gap-2 justify-center">
        {speeds.map((speed) => (
          <button
            key={speed.value}
            onClick={() => onSpeedChange(speed.value)}
            className={`
              flex-1 py-2 px-3 rounded-xl text-sm font-semibold
              transition-all duration-200 active:scale-95
              ${
                currentSpeed === speed.value
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            `}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-base">{speed.icon}</span>
              <span className="text-xs">{speed.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
