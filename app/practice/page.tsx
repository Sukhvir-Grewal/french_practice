"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getRandomWords, getRandomPrepositions, soundsData, prepositionsData, generateNumberInRange, numberRanges } from "@/lib/sounds-data";
import type { Example, Sound } from "@/lib/sounds-data";
import PracticeCard from "@/components/PracticeCard";
import SoundPracticeCard from "@/components/SoundPracticeCard";
import SessionComplete from "@/components/SessionComplete";
import ProgressBar from "@/components/ProgressBar";
import SpeedControl from "@/components/SpeedControl";
import {
  getPlaybackSpeed,
  setPlaybackSpeed,
  savePracticeSession,
} from "@/lib/progress";

type PracticeMode = 'words' | 'sounds' | 'prepositions' | 'numbers';
type NumberRange = { label: string; min: number; max: number };

export default function PracticePage() {
  const [practiceMode, setPracticeMode] = useState<PracticeMode | null>(null);
  const [selectedNumberRange, setSelectedNumberRange] = useState<NumberRange | null>(null);
  const [words, setWords] = useState<Example[]>([]);
  const [numbers, setNumbers] = useState<Array<{ number: number; french: string }>>([]);
  const [soundsToLearn, setSoundsToLearn] = useState<Sound[]>([]);
  const [prepositions, setPrepositions] = useState<Example[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [translationRevealed, setTranslationRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [playbackSpeed, setSpeed] = useState(0.8);
  const [autoPlay, setAutoPlay] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [draftPlaybackSpeed, setDraftPlaybackSpeed] = useState(0.8);
  const [draftAutoPlay, setDraftAutoPlay] = useState(false);
  const [draftContinuousMode, setDraftContinuousMode] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
  const [continuousMode, setContinuousMode] = useState(false);
  const [lastSpokenText, setLastSpokenText] = useState<string>("");

  const WORDS_PER_SESSION = 10;
  const PREPOSITIONS_PER_SESSION = prepositionsData.length;

  // Load mode from URL query once (e.g. /practice?mode=sounds)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mode = new URLSearchParams(window.location.search).get('mode');
    if (mode === 'sounds' || mode === 'prepositions' || mode === 'words' || mode === 'numbers') {
      setPracticeMode(mode);
    }
  }, []);

  // Initialize practice session - runs once on mount and when mode changes
  useEffect(() => {
    if (!practiceMode) return;

    // Always generate fresh random data
    if (practiceMode === 'words') {
      const randomWords = getRandomWords(WORDS_PER_SESSION);
      setWords(randomWords);
    } else if (practiceMode === 'sounds') {
      // For sounds mode, shuffle all sounds with timestamp to ensure uniqueness
      const shuffledSounds = [...soundsData].sort(() => Math.random() - 0.5);
      setSoundsToLearn(shuffledSounds);
    } else if (practiceMode === 'prepositions') {
      const randomPrepositions = getRandomPrepositions(PREPOSITIONS_PER_SESSION);
      setPrepositions(randomPrepositions);
    } else if (practiceMode === 'numbers' && selectedNumberRange) {
      // Numbers handled by range selection
      return;
    }
    // Load saved speed
    setSpeed(getPlaybackSpeed());
    // Reset state when mode changes
    setCurrentIndex(0);
    setTranslationRevealed(false);
    setCorrectCount(0);
    setSessionComplete(false);
  }, [practiceMode]);

  const currentWord =
    practiceMode === 'prepositions'
      ? { french: prepositions[currentIndex]?.english, english: prepositions[currentIndex]?.french }
      : practiceMode === 'words'
        ? { french: words[currentIndex]?.english, english: words[currentIndex]?.french }
        : practiceMode === 'numbers'
          ? { french: numbers[currentIndex]?.number.toString(), english: numbers[currentIndex]?.french }
          : undefined;
  const currentSound = practiceMode === 'sounds' ? soundsToLearn[currentIndex] : undefined;
  const practiceTitle =
    practiceMode === 'sounds'
      ? 'Sounds'
      : practiceMode === 'prepositions'
        ? 'Preposition'
        : practiceMode === 'numbers'
          ? 'Numbers'
          : 'Vocab';

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

  const handleModeChange = (mode: PracticeMode) => {
    setPracticeMode(mode);
    setShowSettingsModal(false);
    if (mode !== 'numbers') {
      setSessionStartTime(Date.now());
    }
  };

  const handleNumberRangeSelection = (range: NumberRange) => {
    setSelectedNumberRange(range);
    const generatedNumbers = [];
    for (let i = 0; i < 10; i++) {
      generatedNumbers.push(generateNumberInRange(range.min, range.max));
    }
    setNumbers(generatedNumbers);
    setCurrentIndex(0);
    setCorrectCount(0);
    setTranslationRevealed(false);
    setSessionComplete(false);
    setSessionStartTime(Date.now());
  };

  const openSettingsModal = () => {
    setDraftPlaybackSpeed(playbackSpeed);
    setDraftAutoPlay(autoPlay);
    setDraftContinuousMode(continuousMode);
    setShowSettingsModal(true);
  };

  const handleSaveSettings = () => {
    setSpeed(draftPlaybackSpeed);
    setPlaybackSpeed(draftPlaybackSpeed);
    setAutoPlay(draftAutoPlay);
    setContinuousMode(draftContinuousMode);
    setShowSettingsModal(false);
  };

  const handleCancelSettings = () => {
    setShowSettingsModal(false);
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
    if (!practiceMode) return;

    const totalItems =
      practiceMode === 'words'
        ? words.length
        : practiceMode === 'sounds'
          ? soundsToLearn.length
          : practiceMode === 'numbers'
            ? numbers.length
            : prepositions.length;

    if (currentIndex < totalItems - 1) {
      setCurrentIndex(currentIndex + 1);
      setTranslationRevealed(false);
    } else {
      // Save session result
      const sessionSize =
        practiceMode === 'words'
          ? WORDS_PER_SESSION
          : practiceMode === 'sounds'
            ? soundsToLearn.length
            : practiceMode === 'numbers'
              ? numbers.length
              : prepositions.length;
      savePracticeSession(correctCount, sessionSize);
      setSessionComplete(true);
    }
  };

  // Restart practice session
  const handleRestart = () => {
    if (!practiceMode) return;

    if (practiceMode === 'words') {
      const randomWords = getRandomWords(WORDS_PER_SESSION);
      setWords(randomWords);
    } else if (practiceMode === 'sounds') {
      const shuffledSounds = [...soundsData].sort(() => Math.random() - 0.5);
      setSoundsToLearn(shuffledSounds);
    } else if (practiceMode === 'numbers' && selectedNumberRange) {
      const generatedNumbers = [];
      for (let i = 0; i < 10; i++) {
        generatedNumbers.push(generateNumberInRange(selectedNumberRange.min, selectedNumberRange.max));
      }
      setNumbers(generatedNumbers);
    } else {
      const randomPrepositions = getRandomPrepositions(PREPOSITIONS_PER_SESSION);
      setPrepositions(randomPrepositions);
    }
    setCurrentIndex(0);
    setCorrectCount(0);
    setTranslationRevealed(false);
    setSessionComplete(false);
    setSessionStartTime(Date.now());
  };

  // Auto-play when new card appears
  useEffect(() => {
    if (autoPlay && !sessionComplete && practiceMode && currentWord) {
      const timer = setTimeout(() => {
        if (practiceMode === 'words' || practiceMode === 'prepositions' || practiceMode === 'numbers') {
          speak(currentWord.english);
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
      if (sessionComplete || !practiceMode) return;

      switch (event.key.toLowerCase()) {
        case ' ':
          event.preventDefault();
          if ((practiceMode === 'words' || practiceMode === 'prepositions' || practiceMode === 'numbers') && currentWord) {
            speak(currentWord.english);
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
          if ((practiceMode === 'words' || practiceMode === 'prepositions' || practiceMode === 'numbers') && !translationRevealed) {
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
    if (continuousMode && sessionComplete && practiceMode) {
      const timer = setTimeout(() => {
        handleRestart();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [continuousMode, sessionComplete, handleRestart]);

  if (!practiceMode) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 px-4 py-8 page-transition">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">Choose Practice Mode</h1>
            <p className="text-gray-600">Pick one to start your session</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <button
              onClick={() => handleModeChange('sounds')}
              className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🔊</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Sounds</h2>
                <p className="text-gray-600 mb-6">Practice French sound recognition and pronunciation</p>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-6 rounded-2xl font-bold group-hover:from-purple-600 group-hover:to-purple-700 transition-all">
                  Start Sounds →
                </div>
              </div>
            </button>

            <button
              onClick={() => handleModeChange('words')}
              className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">📝</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Vocab</h2>
                <p className="text-gray-600 mb-6">Train vocabulary with quick translation practice</p>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-2xl font-bold group-hover:from-green-600 group-hover:to-green-700 transition-all">
                  Start Vocab →
                </div>
              </div>
            </button>

            <button
              onClick={() => handleModeChange('prepositions')}
              className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">📌</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Preposition</h2>
                <p className="text-gray-600 mb-6">Practice essential French prepositions with recall drills</p>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-2xl font-bold group-hover:from-orange-600 group-hover:to-orange-700 transition-all">
                  Start Preposition →
                </div>
              </div>
            </button>

            <button
              onClick={() => handleModeChange('numbers')}
              className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🔢</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Numbers</h2>
                <p className="text-gray-600 mb-6">Practice counting in French with customizable ranges</p>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-2xl font-bold group-hover:from-blue-600 group-hover:to-blue-700 transition-all">
                  Start Numbers →
                </div>
              </div>
            </button>
          </div>

          <div className="text-center">
            <Link href="/" className="inline-flex items-center px-4 py-2 rounded-xl bg-white text-gray-700 shadow hover:bg-gray-50 transition-all duration-200">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Range selection for numbers
  if (practiceMode === 'numbers' && !selectedNumberRange) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 px-4 py-8 page-transition">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">Choose Number Range</h1>
            <p className="text-gray-600">Select a range to practice counting</p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {numberRanges.map((range) => (
              <button
                key={range.label}
                onClick={() => handleNumberRangeSelection(range)}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
              >
                <div className="text-center">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🔢</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{range.label}</h3>
                  <p className="text-sm text-gray-600">10 random numbers</p>
                </div>
              </button>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => setPracticeMode(null)}
              className="inline-flex items-center px-4 py-2 rounded-xl bg-white text-gray-700 shadow hover:bg-gray-50 transition-all duration-200"
            >
              ← Back to Modes
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if ((practiceMode === 'words' && words.length === 0) || 
      (practiceMode === 'sounds' && soundsToLearn.length === 0) ||
      (practiceMode === 'numbers' && numbers.length === 0) ||
      (practiceMode === 'prepositions' && prepositions.length === 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading practice session...</p>
      </div>
    );
  }

  // Session complete view
  if (sessionComplete) {
    const totalItems =
      practiceMode === 'words'
        ? WORDS_PER_SESSION
        : practiceMode === 'sounds'
          ? soundsToLearn.length
          : practiceMode === 'numbers'
            ? numbers.length
            : prepositions.length;
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
  const totalItems =
    practiceMode === 'words'
      ? WORDS_PER_SESSION
      : practiceMode === 'sounds'
        ? soundsToLearn.length
        : practiceMode === 'numbers'
          ? numbers.length
          : PREPOSITIONS_PER_SESSION;

  // Practice view
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 pb-20 page-transition"
>
      {/* Header with Progress */}
      <div className="sticky top-0 z-10 bg-white shadow-md px-4 py-4 transition-all duration-300">
        <div className="max-w-2xl mx-auto">
          <div className="mb-3">
            <h1 className="text-2xl font-bold text-gray-800 text-center">
              {practiceTitle}
            </h1>
          </div>

          <div className="flex items-end gap-3">
            <div className="flex-1">
              <ProgressBar current={currentIndex + 1} total={totalItems} />
            </div>
            <button
              onClick={openSettingsModal}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 border ${
                showSettingsModal
                  ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
              aria-label="Open settings"
              aria-expanded={showSettingsModal}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6h10M4 6h2m4 0a2 2 0 11-4 0 2 2 0 014 0zM20 12h-2m-8 0H4m14 0a2 2 0 104 0 2 2 0 00-4 0zM14 18H4m16 0h-2m-4 0a2 2 0 104 0 2 2 0 00-4 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
        {/* Practice Card with key for smooth transitions */}
        <div key={currentIndex}>
          {practiceMode === 'words' ? (
            <PracticeCard
              french={currentWord!.french}
              english={currentWord!.english}
              translationRevealed={translationRevealed}
              onSpeak={() => speak(currentWord!.english)}
              onRevealTranslation={handleRevealTranslation}
              onGotIt={handleGotIt}
              onTryAgain={handleTryAgain}
              wordNumber={currentIndex + 1}
              totalWords={totalItems}
              itemLabel="Word"
            />
          ) : practiceMode === 'prepositions' ? (
            <PracticeCard
              french={currentWord!.french}
              english={currentWord!.english}
              translationRevealed={translationRevealed}
              onSpeak={() => speak(currentWord!.english)}
              onRevealTranslation={handleRevealTranslation}
              onGotIt={handleGotIt}
              onTryAgain={handleTryAgain}
              wordNumber={currentIndex + 1}
              totalWords={totalItems}
              itemLabel="Preposition"
            />
          ) : practiceMode === 'numbers' ? (
            <PracticeCard
              french={currentWord!.french}
              english={currentWord!.english}
              translationRevealed={translationRevealed}
              onSpeak={() => speak(currentWord!.english)}
              onRevealTranslation={handleRevealTranslation}
              onGotIt={handleGotIt}
              onTryAgain={handleTryAgain}
              wordNumber={currentIndex + 1}
              totalWords={totalItems}
              itemLabel="Number"
            />
          ) : (
            <SoundPracticeCard
              soundTitle={currentSound!.title}
              phonetic={currentSound!.phonetic}
              phoneticSound={currentSound!.phoneticSound}
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

      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-white/85 backdrop-blur-md border border-white/70 rounded-3xl shadow-2xl p-5 animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-800 text-center mb-4">Settings</h2>

            <SpeedControl
              currentSpeed={draftPlaybackSpeed}
              onSpeedChange={setDraftPlaybackSpeed}
            />

            <div className="flex gap-3 flex-wrap justify-center mb-5">
              <button
                onClick={() => setDraftAutoPlay(!draftAutoPlay)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ripple ${
                  draftAutoPlay
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {draftAutoPlay ? '🔊 Auto-play: ON' : '🔇 Auto-play: OFF'}
              </button>

              <button
                onClick={() => setDraftContinuousMode(!draftContinuousMode)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ripple ${
                  draftContinuousMode
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {draftContinuousMode ? '🔄 Continuous: ON' : '⏸️ Continuous: OFF'}
              </button>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelSettings}
                className="px-4 py-2 rounded-xl font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="px-4 py-2 rounded-xl font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 shadow-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}