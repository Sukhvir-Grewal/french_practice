'use client';

import { useState } from 'react';
import SpeakerButton from './SpeakerButton';

interface SoundPracticeCardProps {
  soundTitle: string;
  phonetic?: string;
  phoneticSound: string;
  playbackSpeed: number;
  onGotIt: () => void;
  onTryAgain: () => void;
}

export default function SoundPracticeCard({
  soundTitle,
  phonetic,
  phoneticSound,
  playbackSpeed,
  onGotIt,
  onTryAgain,
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
          <button
            onClick={playSound}
            className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center"
          >
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
              <path d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l.917-3.917A6.959 6.959 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" />
            </svg>
          </button>
        </div>

        {/* Show Sound Title Button */}
        {!showTitle && (
          <button
            onClick={() => setShowTitle(true)}
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
            Got It! ✨
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
            Try Again 🔄
          </span>
        </button>
      </div>
    </div>
  );
}
