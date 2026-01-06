interface PracticeCardProps {
  french: string;
  english: string;
  translationRevealed: boolean;
  onSpeak: () => void;
  onRevealTranslation: () => void;
  onGotIt: () => void;
  onTryAgain: () => void;
  wordNumber: number;
  totalWords: number;
}

export default function PracticeCard({
  french,
  english,
  translationRevealed,
  onSpeak,
  onRevealTranslation,
  onGotIt,
  onTryAgain,
  wordNumber,
  totalWords,
}: PracticeCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 animate-scaleIn">
      {/* Word Counter */}
      <div className="text-center mb-6">
        <p className="text-sm text-gray-500 font-semibold">
          Word {wordNumber} of {totalWords}
        </p>
      </div>

      {/* French Word */}
      <div className="text-center mb-8">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          {french}
        </h2>

        {/* Speaker Button */}
        <button
          onClick={onSpeak}
          className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 hover:bg-green-600 transition-all active:scale-90 shadow-lg hover:shadow-xl"
          aria-label="Play pronunciation"
        >
          <svg
            className="w-8 h-8"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h1.536l4.033 3.796A.75.75 0 0010 16.25V3.75zM12.78 7.22a.75.75 0 10-1.06 1.06L13.44 10l-1.72 1.72a.75.75 0 101.06 1.06l2.25-2.25a.75.75 0 000-1.06l-2.25-2.25z" />
          </svg>
        </button>

        {/* Translation (Hidden/Revealed) */}
        <div className="min-h-[80px] flex items-center justify-center">
          {translationRevealed ? (
            <div className="animate-fadeIn">
              <p className="text-2xl text-gray-600 font-medium">
                {english}
              </p>
            </div>
          ) : (
            <button
              onClick={onRevealTranslation}
              className="px-6 py-3 bg-blue-100 text-blue-700 rounded-xl font-semibold hover:bg-blue-200 transition-all active:scale-95 shadow-sm hover:shadow-md"
            >
              👁️ Reveal Translation
            </button>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <button
          onClick={onGotIt}
          className="ripple w-full py-4 px-6 min-h-[56px] bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 active:scale-98 shadow-md hover:shadow-lg"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            I Got It!
          </span>
        </button>
        <button
          onClick={onTryAgain}
          className="ripple w-full py-4 px-6 min-h-[56px] bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-2xl font-bold text-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-200 active:scale-98 shadow-md hover:shadow-lg"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
            Try Again
          </span>
        </button>
      </div>
    </div>
  );
}
