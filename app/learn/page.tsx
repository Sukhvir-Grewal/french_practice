"use client";

import { useState, useEffect } from "react";
import { soundsData } from "@/lib/sounds-data";
import SoundCard from "@/components/SoundCard";
import WordItem from "@/components/WordItem";
import ProgressBar from "@/components/ProgressBar";
import SpeedControl from "@/components/SpeedControl";
import {
  getProgress,
  updateLastViewedSound,
  markSoundCompleted,
  getPlaybackSpeed,
  setPlaybackSpeed,
} from "@/lib/progress";

export default function LearnPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playbackSpeed, setSpeed] = useState(0.8);
  const [completedSounds, setCompletedSounds] = useState<number[]>([]);
  const [lastSpokenText, setLastSpokenText] = useState<string>("");

  // Load saved progress on mount
  useEffect(() => {
    const progress = getProgress();
    setCurrentIndex(progress.lastViewedSound);
    setSpeed(progress.playbackSpeed);
    setCompletedSounds(progress.completedSounds);
  }, []);

  // Save progress when sound changes
  useEffect(() => {
    updateLastViewedSound(currentIndex);
  }, [currentIndex]);

  const currentSound = soundsData[currentIndex];
  const totalSounds = soundsData.length;

  // Text-to-speech function with error handling and vibration
  const speak = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "fr-FR";
        utterance.rate = playbackSpeed;
        
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
          setTimeout(() => window.speechSynthesis.speak(utterance), 100);
        };
        
        window.speechSynthesis.speak(utterance);
        setLastSpokenText(text);
        
        if ('vibrate' in navigator) {
          navigator.vibrate(10);
        }
      } catch (error) {
        console.error('Failed to speak:', error);
      }
    }
  };

  // Quick replay last sound
  const replayLast = () => {
    if (lastSpokenText) {
      speak(lastSpokenText);
    }
  };

  // Handle speed change
  const handleSpeedChange = (speed: number) => {
    setSpeed(speed);
    setPlaybackSpeed(speed);
  };

  // Mark sound as completed when user moves forward
  const handleMarkCompleted = () => {
    if (!completedSounds.includes(currentSound.id)) {
      markSoundCompleted(currentSound.id);
      setCompletedSounds([...completedSounds, currentSound.id]);
    }
  };

  // Navigation handlers
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalSounds - 1) {
      handleMarkCompleted();
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case 'arrowleft':
          event.preventDefault();
          handlePrevious();
          break;
        case 'arrowright':
          event.preventDefault();
          handleNext();
          break;
        case ' ':
          event.preventDefault();
          speak(currentSound.phoneticSound);
          break;
        case 'q':
          event.preventDefault();
          replayLast();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, lastSpokenText]);

  // Preload TTS voices
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.addEventListener('voiceschanged', () => {
        window.speechSynthesis.getVoices();
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 pb-20 page-transition">
      {/* Header with Progress */}
      <div className="sticky top-0 z-10 bg-white shadow-md px-4 py-4 transition-all duration-300">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-3 text-center">
            Learn French Sounds
          </h1>
          <ProgressBar current={currentIndex + 1} total={totalSounds} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
        {/* Speed Control */}
        <SpeedControl
          currentSpeed={playbackSpeed}
          onSpeedChange={handleSpeedChange}
        />

        {/* Sound Card with transition */}
        <div
          key={currentSound.id}
          className="animate-fadeIn"
        >
          {/* Completion Badge */}
          {completedSounds.includes(currentSound.id) && (
            <div className="mb-3 text-center">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                ✓ Completed
              </span>
            </div>
          )}


          <SoundCard
            title={currentSound.title}
            phonetic={currentSound.phonetic}
            patterns={currentSound.patterns}
          >
            {/* Main Sound Pronunciation */}
            <div className="mb-6 pb-6 border-b-2 border-gray-200">
              <h3 className="text-lg font-bold text-gray-700 mb-4 text-center">
                Listen to the Sound
              </h3>
              <div className="flex justify-center">
                <button
                  onClick={() => speak(currentSound.phoneticSound)}
                  className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center hover:from-blue-600 hover:to-blue-700 transition-all duration-200 active:scale-90 shadow-lg hover:shadow-xl"
                  aria-label="Play sound pronunciation"
                >
                  <svg
                    className="w-10 h-10"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h1.536l4.033 3.796A.75.75 0 0010 16.25V3.75zM12.78 7.22a.75.75 0 10-1.06 1.06L13.44 10l-1.72 1.72a.75.75 0 101.06 1.06l2.25-2.25a.75.75 0 000-1.06l-2.25-2.25z" />
                  </svg>
                </button>
              </div>
              <p className="text-center text-sm text-gray-600 mt-3">
                This is the common sound you'll hear in all the examples below
              </p>
            </div>

            {/* Examples Section */}
            <div>
              <h3 className="text-lg font-bold text-gray-700 mb-4">
                📝 Examples
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Listen to each word - they all contain the same sound you just heard:
              </p>
              <div className="space-y-3">
                {currentSound.examples.map((example, index) => (
                  <WordItem
                    key={index}
                    french={example.french}
                    english={example.english}
                    onSpeak={() => speak(example.french)}
                  />
                ))}
              </div>
            </div>

            {/* Optional Note */}
            {currentSound.note && (
              <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-xl">
                <p className="text-sm text-yellow-800 italic">
                  💡 {currentSound.note}
                </p>
              </div>
            )}
          </SoundCard>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`
              ripple flex-1 py-4 px-6 min-h-[56px] rounded-2xl font-bold text-lg
              transition-all duration-200 active:scale-98
              ${
                currentIndex === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600 shadow-lg hover:shadow-xl"
              }
            `}
          >
            ← Previous
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === totalSounds - 1}
            className={`
              ripple flex-1 py-4 px-6 min-h-[56px] rounded-2xl font-bold text-lg
              transition-all duration-200 active:scale-98
              ${
                currentIndex === totalSounds - 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600 shadow-lg hover:shadow-xl"
              }
            `}
          >
            Next →
          </button>
        </div>

        {/* Sound Counter and Keyboard Shortcuts */}
        <div className="text-center mt-4">
          <p className="text-gray-600 font-semibold">
            Sound {currentIndex + 1} of {totalSounds}
          </p>
        </div>

        {/* Keyboard Shortcuts Help */}
        <div className="mt-6 p-4 bg-blue-50 rounded-2xl text-sm text-gray-600">
          <p className="font-semibold text-center mb-2">⌨️ Keyboard Shortcuts</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><kbd className="px-2 py-1 bg-white rounded shadow">←</kbd> Previous sound</div>
            <div><kbd className="px-2 py-1 bg-white rounded shadow">→</kbd> Next sound</div>
            <div><kbd className="px-2 py-1 bg-white rounded shadow">Space</kbd> Play main sound</div>
            <div><kbd className="px-2 py-1 bg-white rounded shadow">Q</kbd> Replay last</div>
          </div>
        </div>
      </div>

      {/* Floating Quick Replay Button */}
      {lastSpokenText && (
        <button
          onClick={replayLast}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-200 active:scale-95 flex items-center justify-center z-50 ripple animate-pulse-subtle"
          title="Replay last sound (Q)"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
}
