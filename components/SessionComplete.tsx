interface SessionCompleteProps {
  correctCount: number;
  totalWords: number;
  sessionTime?: number;
  onRestart: () => void;
  onBackHome: () => void;
}

export default function SessionComplete({
  correctCount,
  totalWords,
  sessionTime,
  onRestart,
  onBackHome,
}: SessionCompleteProps) {
  const percentage = Math.round((correctCount / totalWords) * 100);
  
  // Format session time
  const formatTime = (seconds?: number) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };
  
  // Determine emoji and message based on performance
  let emoji = "🎉";
  let message = "Great job!";
  
  if (percentage === 100) {
    emoji = "🏆";
    message = "Perfect score!";
  } else if (percentage >= 80) {
    emoji = "🌟";
    message = "Excellent work!";
  } else if (percentage >= 60) {
    emoji = "👍";
    message = "Good effort!";
  } else {
    emoji = "💪";
    message = "Keep practicing!";
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 text-center animate-celebration relative overflow-hidden">
      {/* Confetti Background Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-3 h-3 bg-yellow-400 rounded-full animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-20 right-20 w-4 h-4 bg-green-400 rounded-full animate-float" style={{ animationDelay: '0.2s' }} />
        <div className="absolute top-32 left-32 w-2 h-2 bg-blue-400 rounded-full animate-float" style={{ animationDelay: '0.4s' }} />
        <div className="absolute top-16 right-12 w-3 h-3 bg-pink-400 rounded-full animate-float" style={{ animationDelay: '0.6s' }} />
        <div className="absolute top-40 left-16 w-4 h-4 bg-purple-400 rounded-full animate-float" style={{ animationDelay: '0.8s' }} />
      </div>

      {/* Emoji */}
      <div className="text-8xl mb-6 animate-bounce relative z-10">{emoji}</div>

      {/* Title */}
      <h2 className="text-4xl font-bold text-gray-800 mb-2">
        {message}
      </h2>
      <p className="text-lg text-gray-500 mb-8">Session Complete</p>

      {/* Stats */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-8 relative z-10">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-xl p-4 shadow-sm animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <p className="text-sm text-gray-600 mb-1">Correct</p>
            <p className="text-3xl font-bold text-green-600">{correctCount}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm animate-slideUp" style={{ animationDelay: '0.3s' }}>
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-3xl font-bold text-blue-600">{totalWords}</p>
          </div>
          {sessionTime && (
            <div className="bg-white rounded-xl p-4 shadow-sm animate-slideUp" style={{ animationDelay: '0.4s' }}>
              <p className="text-sm text-gray-600 mb-1">Time</p>
              <p className="text-2xl font-bold text-purple-600">{formatTime(sessionTime)}</p>
            </div>
          )}
        </div>
        <div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-2xl font-bold text-gray-700 mt-2">{percentage}%</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 relative z-10">
        <button
          onClick={onRestart}
          className="ripple w-full py-4 px-6 min-h-[56px] bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 active:scale-98 shadow-lg hover:shadow-xl"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
            Practice Again
          </span>
        </button>
        <button
          onClick={onBackHome}
          className="ripple w-full py-4 px-6 min-h-[56px] bg-gray-200 text-gray-700 rounded-2xl font-bold text-lg hover:bg-gray-300 transition-all duration-200 active:scale-98 shadow-sm"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Back to Home
          </span>
        </button>
      </div>
    </div>
  );
}
