'use client';

import { useState } from 'react';

interface SoundPracticeCardProps {
  soundTitle: string;
  phonetic?: string;
  phoneticSound: string;
  playbackSpeed: number;
  showSpeaker?: boolean;
  onNext: () => void;
}

export default function SoundPracticeCard({
  soundTitle,
  phonetic,
  phoneticSound,
  playbackSpeed,
  showSpeaker = false,
  onNext,
}: SoundPracticeCardProps) {
  const [showTitle, setShowTitle] = useState(false);

  const playSound = () => {
    const utterance = new SpeechSynthesisUtterance(phoneticSound);
    utterance.lang = 'fr-FR';
    utterance.rate = playbackSpeed;
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl max-w-2xl mx-auto animate-fadeIn">
      {/* Sound Display */}
      <div className="text-center mb-8">
        <div className="mb-6">
          <div className="text-7xl font-bold text-blue-600 mb-4">
            {phoneticSound}
          </div>
          {showSpeaker && (
            <button
              onClick={playSound}
              className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l.917-3.917A6.959 6.959 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" />
              </svg>
            </button>
          )}
        </div>

        {/* Show Sound Title Button */}
        {!showTitle && (
          <button
            onClick={() => {
              setShowTitle(true);
              playSound();
            }}
            className="text-blue-600 hover:text-blue-700 font-semibold underline text-lg"
          >
            Show Sound Name
          </button>
        )}

        {showTitle && (
          <div className="mt-4 p-6 bg-gray-50 rounded-2xl animate-slideUp">
            <div className="text-2xl font-bold text-gray-800">
              {soundTitle}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <button
          onClick={onNext}
          className="ripple w-full py-4 px-6 min-h-[56px] bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 active:scale-98 shadow-md hover:shadow-lg"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            Next →
          </span>
        </button>
      </div>
    </div>
  );
}
