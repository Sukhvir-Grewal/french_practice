"use client";

import { useState, useEffect } from "react";
import { getRandomWords, soundsData } from "@/lib/sounds-data";
import type { Example, Sound } from "@/lib/sounds-data";
import PracticeCard from "@/components/PracticeCard";
import SoundPracticeCard from "@/components/SoundPracticeCard";
import SessionComplete from "@/components/SessionComplete";
import ProgressBar from "@/components/ProgressBar";
import SpeedControl from "@/components/SpeedControl";
import PracticeModeSelector from "@/components/PracticeModeSelector";
import {
  getPlaybackSpeed,
  setPlaybackSpeed,
  savePracticeSession,
} from "@/lib/progress";

export default function PracticePage() {
  const [practiceMode, setPracticeMode] = useState<'words' | 'sounds'>('words');
  const [words, setWords] = useState<Example[]>([]);
  const [soundsToLearn, setSoundsToLearn] = useState<Sound[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [translationRevealed, setTranslationRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [playbackSpeed, setSpeed] = useState(0.8);
  const [autoPlay, setAutoPlay] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
  const [continuousMode, setContinuousMode] = useState(false);
  const [lastSpokenText, setLastSpokenText] = useState<string>("");

  const WORDS_PER_SESSION = 10;

  // Initialize practice session - runs once on mount and when mode changes
  useEffect(() => {
    // Always generate fresh random data
    if (practiceMode === 'words') {
      const randomWords = getRandomWords(WORDS_PER_SESSION);
      setWords(randomWords);
    } else {
      // For sounds mode, shuffle all sounds with timestamp to ensure uniqueness
      const shuffledSounds = [...soundsData].sort(() => Math.random() - 0.5);
      setSoundsToLearn(shuffledSounds);
    }
    // Load saved speed
    setSpeed(getPlaybackSpeed());
    // Reset state when mode changes
    setCurrentIndex(0);
    setTranslationRevealed(false);
    setCorrectCount(0);
    setSessionComplete(false);
  }, [practiceMode]);

  // Force fresh data on component mount
  useEffect(() => {
    // This runs only once when component mounts
    const randomWords = getRandomWords(WORDS_PER_SESSION);
    setWords(randomWords);
    const shuffledSounds = [...soundsData].sort(() => Math.random() - 0.5);
    setSoundsToLearn(shuffledSounds);
  }, []);

  const currentWord = words[currentIndex];
  const currentSound = soundsToLearn[currentIndex];

  // Text-to-speech function with error handling and vibration
  const speak = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "fr-FR";
        utterance.rate = playbackSpeed;
        
        // Add error handling
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
          // Fallback: try again once
          setTimeout(() => window.speechSynthesis.speak(utterance), 100);
        };
        
        window.speechSynthesis.speak(utterance);
        setLastSpokenText(text);
        
        // Haptic feedback on mobile
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

  // Reveal translation
  const handleRevealTranslation = () => {
    setTranslationRevealed(true);
  };

  // Handle "I Got It!" button
  const handleGotIt = () => {
    setCorrectCount(correctCount + 1);
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 30, 50]); // Success pattern
    }
    moveToNext();
  };

  // Handle "Try Again" button
  const handleTryAgain = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(30); // Short vibration
    }
    moveToNext();
  };

  // Move to next word or complete session
  const moveToNext = () => {
    const totalItems = practiceMode === 'words' ? words.length : soundsToLearn.length;
    if (currentIndex < totalItems - 1) {
      setCurrentIndex(currentIndex + 1);
      setTranslationRevealed(false);
    } else {
      // Save session result
      const sessionSize = practiceMode === 'words' ? WORDS_PER_SESSION : soundsToLearn.length;
      savePracticeSession(correctCount, sessionSize);
      setSessionComplete(true);
    }
  };

  // Restart practice session
  const handleRestart = () => {
    if (practiceMode === 'words') {
      const randomWords = getRandomWords(WORDS_PER_SESSION);
      setWords(randomWords);
    } else {
      const shuffledSounds = [...soundsData].sort(() => Math.random() - 0.5);
      setSoundsToLearn(shuffledSounds);
    }
    setCurrentIndex(0);
    setCorrectCount(0);
    setTranslationRevealed(false);
    setSessionComplete(false);
    setSessionStartTime(Date.now());
  };

  // Auto-play when new card appears
  useEffect(() => {
    if (autoPlay && !sessionComplete && currentWord) {
      const timer = setTimeout(() => {
        if (practiceMode === 'words') {
          speak(currentWord.french);
        } else if (currentSound) {
          speak(currentSound.phoneticSound);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, autoPlay, sessionComplete, practiceMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (sessionComplete) return;

      switch (event.key.toLowerCase()) {
        case ' ':
          event.preventDefault();
          if (practiceMode === 'words' && currentWord) {
            speak(currentWord.french);
          } else if (currentSound) {
            speak(currentSound.phoneticSound);
          }
          break;
        case 'enter':
          event.preventDefault();
          if (translationRevealed || practiceMode === 'sounds') {
            handleGotIt();
          }
          break;
        case 'r':
          event.preventDefault();
          if (translationRevealed || practiceMode === 'sounds') {
            handleTryAgain();
          }
          break;
        case 't':
          event.preventDefault();
          if (practiceMode === 'words' && !translationRevealed) {
            handleRevealTranslation();
          }
          break;
        case 'q':
          event.preventDefault();
          replayLast();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [sessionComplete, translationRevealed, currentIndex, practiceMode, lastSpokenText]);

  // Preload TTS voices
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      
      window.speechSynthesis.addEventListener('voiceschanged', () => {
        window.speechSynthesis.getVoices();
      });
    }
  }, []);

  // Auto-restart in continuous mode (moved outside of conditional)
  useEffect(() => {
    if (continuousMode && sessionComplete) {
      const timer = setTimeout(() => {
        handleRestart();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [continuousMode, sessionComplete, handleRestart]);

  // Loading state
  if ((practiceMode === 'words' && words.length === 0) || 
      (practiceMode === 'sounds' && soundsToLearn.length === 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading practice session...</p>
      </div>
    );
  }

  // Session complete view
  if (sessionComplete) {
    const totalItems = practiceMode === 'words' ? WORDS_PER_SESSION : soundsToLearn.length;
    const sessionTime = Math.floor((Date.now() - sessionStartTime) / 1000);

    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 px-4 py-8 flex items-center page-transition">
        <div className="max-w-2xl mx-auto w-full"
>
          <SessionComplete
            correctCount={correctCount}
            totalWords={totalItems}
            sessionTime={sessionTime}
            onRestart={handleRestart}
            onBackHome={() => (window.location.href = "/")}
          />
          {continuousMode && (
            <div className="mt-4 text-center text-gray-600 animate-pulse-subtle">
              <p>🔄 Continuous mode: Next session starts in 3 seconds...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Calculate totals
  const totalItems = practiceMode === 'words' ? WORDS_PER_SESSION : soundsToLearn.length;

  // Practice view
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 pb-20 page-transition"
>
      {/* Header with Progress */}
      <div className="sticky top-0 z-10 bg-white shadow-md px-4 py-4 transition-all duration-300">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-3 text-center">
            Practice Mode
          </h1>
          
          {/* Mode Selector */}
          <div className="flex justify-center mb-4">
            <PracticeModeSelector 
              selectedMode={practiceMode}
              onModeChange={setPracticeMode}
            />
          </div>
          
          <ProgressBar current={currentIndex + 1} total={totalItems} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
        {/* Controls Row */}
        <div className="flex gap-4 flex-wrap items-center justify-between mb-6">
          <SpeedControl
            currentSpeed={playbackSpeed}
            onSpeedChange={handleSpeedChange}
          />
          
          {/* Auto-play Toggle */}
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ripple ${
              autoPlay
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {autoPlay ? '🔊 Auto-play: ON' : '🔇 Auto-play: OFF'}
          </button>

          {/* Continuous Mode Toggle */}
          <button
            onClick={() => setContinuousMode(!continuousMode)}
            className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ripple ${
              continuousMode
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {continuousMode ? '🔄 Continuous: ON' : '⏸️ Continuous: OFF'}
          </button>
        </div>

        {/* Practice Card with key for smooth transitions */}
        <div key={currentIndex}>
          {practiceMode === 'words' ? (
            <PracticeCard
              french={currentWord.french}
              english={currentWord.english}
              translationRevealed={translationRevealed}
              onSpeak={() => speak(currentWord.french)}
              onRevealTranslation={handleRevealTranslation}
              onGotIt={handleGotIt}
              onTryAgain={handleTryAgain}
              wordNumber={currentIndex + 1}
              totalWords={totalItems}
            />
          ) : (
            <SoundPracticeCard
              soundTitle={currentSound.title}
              phonetic={currentSound.phonetic}
              phoneticSound={currentSound.phoneticSound}
              playbackSpeed={playbackSpeed}
              onGotIt={handleGotIt}
              onTryAgain={handleTryAgain}
            />
          )}
        </div>

        {/* Score Display */}
        <div className="mt-6 text-center">
          <p className="text-gray-700 font-semibold">
            Correct: <span className="text-green-600 font-bold">{correctCount}</span> /{" "}
            {currentIndex + 1}
          </p>
        </div>

        {/* Keyboard Shortcuts Help */}
        <div className="mt-6 p-4 bg-blue-50 rounded-2xl text-sm text-gray-600">
          <p className="font-semibold text-center mb-2">⌨️ Keyboard Shortcuts</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><kbd className="px-2 py-1 bg-white rounded shadow">Space</kbd> - Play sound</div>
            <div><kbd className="px-2 py-1 bg-white rounded shadow">Enter</kbd> - Got It!</div>
            <div><kbd className="px-2 py-1 bg-white rounded shadow">R</kbd> - Try Again</div>
            <div><kbd className="px-2 py-1 bg-white rounded shadow">T</kbd> - Show translation</div>
            <div><kbd className="px-2 py-1 bg-white rounded shadow">Q</kbd> - Replay last</div>
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