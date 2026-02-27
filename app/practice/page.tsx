"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getRandomWords, getRandomPrepositions, getRandomDays, getRandomMonths, getRandomPossessives, getRandomDisjunctives, getRandomAllerForms, getRandomColors, getRandomAdjectives, getRandomPostNounAdjectives, getRandomPreNounAdjectives, soundsData, prepositionsData, daysOfWeekData, monthsOfYearData, possessiveAdjectivesData, disjunctivePronounsData, allerPresentData, colorsData, commonAdjectivesData, postNounAdjectivesData, preNounAdjectivesData, generateNumberInRange, numberRanges } from "@/lib/sounds-data";
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

type PracticeMode = 'words' | 'sounds' | 'prepositions' | 'numbers' | 'days' | 'months' | 'possessives' | 'disjunctive' | 'aller' | 'colors' | 'adjectives' | 'postadjectives' | 'preadjectives';
type NumberRange = { label: string; min: number; max: number };

export default function PracticePage() {
  const [practiceMode, setPracticeMode] = useState<PracticeMode | null>(null);
  const [selectedNumberRange, setSelectedNumberRange] = useState<NumberRange | null>(null);
  const [words, setWords] = useState<Example[]>([]);
  const [numbers, setNumbers] = useState<Array<{ number: number; french: string }>>([]);
  const [soundsToLearn, setSoundsToLearn] = useState<Sound[]>([]);
  const [prepositions, setPrepositions] = useState<Example[]>([]);
  const [days, setDays] = useState<Example[]>([]);
  const [months, setMonths] = useState<Example[]>([]);
  const [possessives, setPossessives] = useState<Example[]>([]);
  const [disjunctives, setDisjunctives] = useState<Example[]>([]);
  const [allerForms, setAllerForms] = useState<Example[]>([]);
  const [colors, setColors] = useState<Example[]>([]);
  const [adjectives, setAdjectives] = useState<Example[]>([]);
  const [postAdjectives, setPostAdjectives] = useState<Example[]>([]);
  const [preAdjectives, setPreAdjectives] = useState<Example[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [translationRevealed, setTranslationRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [infiniteMode, setInfiniteMode] = useState(false);
  const [playbackSpeed, setSpeed] = useState(0.8);
  const [autoPlay, setAutoPlay] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [draftPlaybackSpeed, setDraftPlaybackSpeed] = useState(0.8);
  const [draftAutoPlay, setDraftAutoPlay] = useState(true);
  const [draftContinuousMode, setDraftContinuousMode] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
  const [continuousMode, setContinuousMode] = useState(false);
  const [lastSpokenText, setLastSpokenText] = useState<string>("");

  const WORDS_PER_SESSION = 10;
  const PREPOSITIONS_PER_SESSION = prepositionsData.length;
  const DAYS_PER_SESSION = daysOfWeekData.length;
  const MONTHS_PER_SESSION = monthsOfYearData.length;
  const POSSESSIVES_PER_SESSION = possessiveAdjectivesData.length;
  const DISJUNCTIVES_PER_SESSION = disjunctivePronounsData.length;
  const ALLER_PER_SESSION = allerPresentData.length;
  const COLORS_PER_SESSION = colorsData.length;
  const ADJECTIVES_PER_SESSION = commonAdjectivesData.length;
  const POST_ADJECTIVES_PER_SESSION = postNounAdjectivesData.length;
  const PRE_ADJECTIVES_PER_SESSION = preNounAdjectivesData.length;

  // Load mode from URL query once (e.g. /practice?mode=sounds)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mode = new URLSearchParams(window.location.search).get('mode');
    if (mode === 'sounds' || mode === 'prepositions' || mode === 'words' || mode === 'numbers' || mode === 'days' || mode === 'months' || mode === 'possessives' || mode === 'disjunctive' || mode === 'aller' || mode === 'colors' || mode === 'adjectives' || mode === 'postadjectives' || mode === 'preadjectives') {
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
    } else if (practiceMode === 'days') {
      const randomDays = getRandomDays(DAYS_PER_SESSION);
      setDays(randomDays);
    } else if (practiceMode === 'months') {
      const randomMonths = getRandomMonths(MONTHS_PER_SESSION);
      setMonths(randomMonths);
    } else if (practiceMode === 'possessives') {
      const randomPossessives = getRandomPossessives(POSSESSIVES_PER_SESSION);
      setPossessives(randomPossessives);
    } else if (practiceMode === 'disjunctive') {
      const randomDisjunctives = getRandomDisjunctives(DISJUNCTIVES_PER_SESSION);
      setDisjunctives(randomDisjunctives);
    } else if (practiceMode === 'aller') {
      const randomAllerForms = getRandomAllerForms(ALLER_PER_SESSION);
      setAllerForms(randomAllerForms);
    } else if (practiceMode === 'colors') {
      const randomColors = getRandomColors(COLORS_PER_SESSION);
      setColors(randomColors);
    } else if (practiceMode === 'adjectives') {
      const randomAdjectives = getRandomAdjectives(ADJECTIVES_PER_SESSION);
      setAdjectives(randomAdjectives);
    } else if (practiceMode === 'postadjectives') {
      const randomAdjectives = getRandomPostNounAdjectives(POST_ADJECTIVES_PER_SESSION);
      setPostAdjectives(randomAdjectives);
    } else if (practiceMode === 'preadjectives') {
      const randomAdjectives = getRandomPreNounAdjectives(PRE_ADJECTIVES_PER_SESSION);
      setPreAdjectives(randomAdjectives);
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
      : practiceMode === 'days'
        ? { french: days[currentIndex]?.english, english: days[currentIndex]?.french }
      : practiceMode === 'months'
        ? { french: months[currentIndex]?.english, english: months[currentIndex]?.french }
      : practiceMode === 'possessives'
        ? { french: possessives[currentIndex]?.english, english: possessives[currentIndex]?.french }
      : practiceMode === 'disjunctive'
        ? { french: disjunctives[currentIndex]?.english, english: disjunctives[currentIndex]?.french }
      : practiceMode === 'aller'
        ? { french: allerForms[currentIndex]?.english, english: allerForms[currentIndex]?.french }
      : practiceMode === 'colors'
        ? { french: colors[currentIndex]?.english, english: colors[currentIndex]?.french }
      : practiceMode === 'adjectives'
        ? { french: adjectives[currentIndex]?.english, english: adjectives[currentIndex]?.french }
      : practiceMode === 'postadjectives'
        ? { french: postAdjectives[currentIndex]?.english, english: postAdjectives[currentIndex]?.french }
      : practiceMode === 'preadjectives'
        ? { french: preAdjectives[currentIndex]?.english, english: preAdjectives[currentIndex]?.french }
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
        : practiceMode === 'days'
          ? 'Days'
        : practiceMode === 'months'
          ? 'Months'
        : practiceMode === 'possessives'
          ? 'Possessives'
        : practiceMode === 'disjunctive'
          ? 'Disjunctive'
        : practiceMode === 'aller'
          ? 'Aller'
        : practiceMode === 'colors'
          ? 'Colors'
        : practiceMode === 'adjectives'
          ? 'Adjectives'
        : practiceMode === 'postadjectives'
          ? 'Adjectives After Noun'
        : practiceMode === 'preadjectives'
          ? 'Adjectives Before Noun'
        : practiceMode === 'numbers'
          ? 'Numbers'
          : 'Vocab';

  const getLearnModeFromPracticeMode = (mode: PracticeMode) => {
    if (mode === 'words') return 'vocab';
    return mode;
  };

  const normalizeSpeechText = (text?: string) => {
    if (!text || typeof text !== "string") return "";
    const normalized = text.trim().toLowerCase();
    if (normalized === "à") return "à Paris";
    if (normalized === "en") return "en France";
    if (normalized === "de") return "de Paris";
    if (normalized === "où") return "où est la gare";
    return text;
  };

  // Text-to-speech function with error handling and vibration
  const speak = (text?: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try {
        if (!text || !text.trim()) return;
        window.speechSynthesis.cancel();
        const speechText = normalizeSpeechText(text);
        if (!speechText) return;
        const utterance = new SpeechSynthesisUtterance(speechText);
        utterance.lang = "fr-FR";
        utterance.rate = playbackSpeed;
        
        // Add error handling
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
          // Fallback: try again once
          setTimeout(() => window.speechSynthesis.speak(utterance), 100);
        };
        
        window.speechSynthesis.speak(utterance);
        setLastSpokenText(speechText);
        
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
    if (autoPlay && currentWord?.english) {
      speak(currentWord.english);
    }
  };

  // Handle Next button
  const handleNext = () => {
    setCorrectCount(correctCount + 1);
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 30, 50]); // Success pattern
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
          : practiceMode === 'days'
            ? days.length
          : practiceMode === 'months'
            ? months.length
          : practiceMode === 'possessives'
            ? possessives.length
          : practiceMode === 'disjunctive'
            ? disjunctives.length
          : practiceMode === 'aller'
            ? allerForms.length
          : practiceMode === 'colors'
            ? colors.length
          : practiceMode === 'adjectives'
            ? adjectives.length
          : practiceMode === 'postadjectives'
            ? postAdjectives.length
          : practiceMode === 'preadjectives'
            ? preAdjectives.length
          : practiceMode === 'numbers'
            ? numbers.length
            : prepositions.length;

    if (infiniteMode) {
      if (currentIndex < totalItems - 1) {
        setCurrentIndex(currentIndex + 1);
        setTranslationRevealed(false);
      } else {
        if (practiceMode === 'words') {
          setWords(getRandomWords(WORDS_PER_SESSION));
        } else if (practiceMode === 'sounds') {
          setSoundsToLearn([...soundsData].sort(() => Math.random() - 0.5));
        } else if (practiceMode === 'days') {
          setDays(getRandomDays(DAYS_PER_SESSION));
        } else if (practiceMode === 'months') {
          setMonths(getRandomMonths(MONTHS_PER_SESSION));
        } else if (practiceMode === 'possessives') {
          setPossessives(getRandomPossessives(POSSESSIVES_PER_SESSION));
        } else if (practiceMode === 'disjunctive') {
          setDisjunctives(getRandomDisjunctives(DISJUNCTIVES_PER_SESSION));
        } else if (practiceMode === 'aller') {
          setAllerForms(getRandomAllerForms(ALLER_PER_SESSION));
        } else if (practiceMode === 'colors') {
          setColors(getRandomColors(COLORS_PER_SESSION));
        } else if (practiceMode === 'adjectives') {
          setAdjectives(getRandomAdjectives(ADJECTIVES_PER_SESSION));
        } else if (practiceMode === 'postadjectives') {
          setPostAdjectives(getRandomPostNounAdjectives(POST_ADJECTIVES_PER_SESSION));
        } else if (practiceMode === 'preadjectives') {
          setPreAdjectives(getRandomPreNounAdjectives(PRE_ADJECTIVES_PER_SESSION));
        } else if (practiceMode === 'numbers' && selectedNumberRange) {
          const generatedNumbers = [];
          for (let i = 0; i < 10; i++) {
            generatedNumbers.push(generateNumberInRange(selectedNumberRange.min, selectedNumberRange.max));
          }
          setNumbers(generatedNumbers);
        } else if (practiceMode === 'prepositions') {
          setPrepositions(getRandomPrepositions(PREPOSITIONS_PER_SESSION));
        }
        setCurrentIndex(0);
        setTranslationRevealed(false);
      }
      return;
    }

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
            : practiceMode === 'days'
              ? days.length
            : practiceMode === 'months'
              ? months.length
            : practiceMode === 'possessives'
              ? possessives.length
            : practiceMode === 'disjunctive'
              ? disjunctives.length
            : practiceMode === 'aller'
              ? allerForms.length
            : practiceMode === 'colors'
              ? colors.length
            : practiceMode === 'adjectives'
              ? adjectives.length
            : practiceMode === 'postadjectives'
              ? postAdjectives.length
            : practiceMode === 'preadjectives'
              ? preAdjectives.length
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
    } else if (practiceMode === 'days') {
      const randomDays = getRandomDays(DAYS_PER_SESSION);
      setDays(randomDays);
    } else if (practiceMode === 'months') {
      const randomMonths = getRandomMonths(MONTHS_PER_SESSION);
      setMonths(randomMonths);
    } else if (practiceMode === 'possessives') {
      const randomPossessives = getRandomPossessives(POSSESSIVES_PER_SESSION);
      setPossessives(randomPossessives);
    } else if (practiceMode === 'disjunctive') {
      const randomDisjunctives = getRandomDisjunctives(DISJUNCTIVES_PER_SESSION);
      setDisjunctives(randomDisjunctives);
    } else if (practiceMode === 'aller') {
      const randomAllerForms = getRandomAllerForms(ALLER_PER_SESSION);
      setAllerForms(randomAllerForms);
    } else if (practiceMode === 'colors') {
      const randomColors = getRandomColors(COLORS_PER_SESSION);
      setColors(randomColors);
    } else if (practiceMode === 'adjectives') {
      const randomAdjectives = getRandomAdjectives(ADJECTIVES_PER_SESSION);
      setAdjectives(randomAdjectives);
    } else if (practiceMode === 'postadjectives') {
      const randomAdjectives = getRandomPostNounAdjectives(POST_ADJECTIVES_PER_SESSION);
      setPostAdjectives(randomAdjectives);
    } else if (practiceMode === 'preadjectives') {
      const randomAdjectives = getRandomPreNounAdjectives(PRE_ADJECTIVES_PER_SESSION);
      setPreAdjectives(randomAdjectives);
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (sessionComplete || !practiceMode) return;

      switch (event.key.toLowerCase()) {
        case ' ':
          event.preventDefault();
          if ((practiceMode === 'words' || practiceMode === 'prepositions' || practiceMode === 'numbers' || practiceMode === 'days' || practiceMode === 'months' || practiceMode === 'possessives' || practiceMode === 'disjunctive' || practiceMode === 'aller' || practiceMode === 'colors' || practiceMode === 'adjectives' || practiceMode === 'postadjectives' || practiceMode === 'preadjectives') && currentWord) {
            speak(currentWord.english);
          } else if (currentSound) {
            speak(currentSound.phoneticSound);
          }
          break;
        case 'enter':
          event.preventDefault();
          if (translationRevealed || practiceMode === 'sounds') {
            handleNext();
          }
          break;
        case 'r':
          event.preventDefault();
          if (translationRevealed || practiceMode === 'sounds') {
            handleNext();
          }
          break;
        case 't':
          event.preventDefault();
          if ((practiceMode === 'words' || practiceMode === 'prepositions' || practiceMode === 'numbers' || practiceMode === 'days' || practiceMode === 'months' || practiceMode === 'possessives' || practiceMode === 'disjunctive' || practiceMode === 'aller' || practiceMode === 'colors' || practiceMode === 'adjectives' || practiceMode === 'postadjectives' || practiceMode === 'preadjectives') && !translationRevealed) {
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

            <button
              onClick={() => handleModeChange('days')}
              className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">📅</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Days</h2>
                <p className="text-gray-600 mb-6">Practice days of the week in French</p>
                <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 px-6 rounded-2xl font-bold group-hover:from-teal-600 group-hover:to-teal-700 transition-all">
                  Start Days →
                </div>
              </div>
            </button>

            <button
              onClick={() => handleModeChange('months')}
              className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🗓️</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Months</h2>
                <p className="text-gray-600 mb-6">Practice months of the year in French</p>
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-3 px-6 rounded-2xl font-bold group-hover:from-indigo-600 group-hover:to-indigo-700 transition-all">
                  Start Months →
                </div>
              </div>
            </button>

            <button
              onClick={() => handleModeChange('possessives')}
              className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🧩</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Possessive</h2>
                <p className="text-gray-600 mb-6">Practice mon/ma/mes, ton/ta/tes and more</p>
                <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 px-6 rounded-2xl font-bold group-hover:from-pink-600 group-hover:to-pink-700 transition-all">
                  Start Possessive →
                </div>
              </div>
            </button>

            <button
              onClick={() => handleModeChange('disjunctive')}
              className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🗣️</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Disjunctive</h2>
                <p className="text-gray-600 mb-6">Practice stressed pronouns like moi, toi, lui</p>
                <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white py-3 px-6 rounded-2xl font-bold group-hover:from-cyan-600 group-hover:to-cyan-700 transition-all">
                  Start Disjunctive →
                </div>
              </div>
            </button>

            <button
              onClick={() => handleModeChange('aller')}
              className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🚶</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Aller</h2>
                <p className="text-gray-600 mb-6">Practice present tense forms of aller</p>
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-6 rounded-2xl font-bold group-hover:from-emerald-600 group-hover:to-emerald-700 transition-all">
                  Start Aller →
                </div>
              </div>
            </button>

            <button
              onClick={() => handleModeChange('colors')}
              className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🎨</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Colors</h2>
                <p className="text-gray-600 mb-6">Practice color names and forms in French</p>
                <div className="bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 text-white py-3 px-6 rounded-2xl font-bold group-hover:from-fuchsia-600 group-hover:to-fuchsia-700 transition-all">
                  Start Colors →
                </div>
              </div>
            </button>

            <button
              onClick={() => handleModeChange('adjectives')}
              className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">Aa</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Adjectives</h2>
                <p className="text-gray-600 mb-6">Practice masculine [m] and feminine [f] forms</p>
                <div className="bg-gradient-to-r from-amber-500 to-sky-500 text-white py-3 px-6 rounded-2xl font-bold group-hover:from-amber-600 group-hover:to-sky-600 transition-all">
                  Start Adjectives →
                </div>
              </div>
            </button>

            <button
              onClick={() => handleModeChange('postadjectives')}
              className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">A+</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Adj After Noun</h2>
                <p className="text-gray-600 mb-6">Practice personality and quality adjectives</p>
                <div className="bg-gradient-to-r from-violet-500 to-violet-600 text-white py-3 px-6 rounded-2xl font-bold group-hover:from-violet-600 group-hover:to-violet-700 transition-all">
                  Start Topic →
                </div>
              </div>
            </button>

            <button
              onClick={() => handleModeChange('preadjectives')}
              className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">A-</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Adj Before Noun</h2>
                <p className="text-gray-600 mb-6">Practice BAGS adjectives before nouns</p>
                <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white py-3 px-6 rounded-2xl font-bold group-hover:from-cyan-600 group-hover:to-cyan-700 transition-all">
                  Start Topic →
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
      (practiceMode === 'days' && days.length === 0) ||
      (practiceMode === 'months' && months.length === 0) ||
      (practiceMode === 'possessives' && possessives.length === 0) ||
      (practiceMode === 'disjunctive' && disjunctives.length === 0) ||
      (practiceMode === 'aller' && allerForms.length === 0) ||
      (practiceMode === 'colors' && colors.length === 0) ||
      (practiceMode === 'adjectives' && adjectives.length === 0) ||
      (practiceMode === 'postadjectives' && postAdjectives.length === 0) ||
      (practiceMode === 'preadjectives' && preAdjectives.length === 0) ||
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
          : practiceMode === 'days'
            ? days.length
          : practiceMode === 'months'
            ? months.length
          : practiceMode === 'possessives'
            ? possessives.length
          : practiceMode === 'disjunctive'
            ? disjunctives.length
          : practiceMode === 'aller'
            ? allerForms.length
          : practiceMode === 'colors'
            ? colors.length
          : practiceMode === 'adjectives'
            ? adjectives.length
          : practiceMode === 'postadjectives'
            ? postAdjectives.length
          : practiceMode === 'preadjectives'
            ? preAdjectives.length
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
      : practiceMode === 'days'
          ? days.length
      : practiceMode === 'months'
          ? months.length
      : practiceMode === 'possessives'
          ? possessives.length
      : practiceMode === 'disjunctive'
          ? disjunctives.length
      : practiceMode === 'aller'
          ? allerForms.length
      : practiceMode === 'colors'
          ? colors.length
      : practiceMode === 'adjectives'
          ? adjectives.length
        : practiceMode === 'postadjectives'
          ? postAdjectives.length
          : practiceMode === 'preadjectives'
            ? preAdjectives.length
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

          <div className="flex justify-center mb-3">
            <div className="inline-flex rounded-xl bg-gray-100 p-1">
              <Link
                href={`/learn?mode=${getLearnModeFromPracticeMode(practiceMode)}`}
                className="px-4 py-1.5 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-all duration-200"
              >
                Learn
              </Link>
              <button className="px-4 py-1.5 rounded-lg bg-green-500 text-white text-sm font-semibold">
                Practice
              </button>
            </div>
          </div>

          <div className="flex justify-center mb-3">
            <button
              onClick={() => setInfiniteMode(!infiniteMode)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                infiniteMode
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              ∞ Infinity: {infiniteMode ? "ON" : "OFF"}
            </button>
          </div>

          <div className="flex items-end gap-3">
            <div className="flex-1">
              <ProgressBar
                current={infiniteMode ? totalItems : currentIndex + 1}
                total={totalItems}
                isInfinite={infiniteMode}
              />
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
              showSpeaker={!autoPlay}
              onRevealTranslation={handleRevealTranslation}
              onNext={handleNext}
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
              showSpeaker={!autoPlay}
              onRevealTranslation={handleRevealTranslation}
              onNext={handleNext}
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
              showSpeaker={!autoPlay}
              onRevealTranslation={handleRevealTranslation}
              onNext={handleNext}
              wordNumber={currentIndex + 1}
              totalWords={totalItems}
              itemLabel="Number"
            />
          ) : practiceMode === 'days' ? (
            <PracticeCard
              french={currentWord!.french}
              english={currentWord!.english}
              translationRevealed={translationRevealed}
              onSpeak={() => speak(currentWord!.english)}
              showSpeaker={!autoPlay}
              onRevealTranslation={handleRevealTranslation}
              onNext={handleNext}
              wordNumber={currentIndex + 1}
              totalWords={totalItems}
              itemLabel="Day"
            />
          ) : practiceMode === 'months' ? (
            <PracticeCard
              french={currentWord!.french}
              english={currentWord!.english}
              translationRevealed={translationRevealed}
              onSpeak={() => speak(currentWord!.english)}
              showSpeaker={!autoPlay}
              onRevealTranslation={handleRevealTranslation}
              onNext={handleNext}
              wordNumber={currentIndex + 1}
              totalWords={totalItems}
              itemLabel="Month"
            />
          ) : practiceMode === 'possessives' ? (
            <PracticeCard
              french={currentWord!.french}
              english={currentWord!.english}
              translationRevealed={translationRevealed}
              onSpeak={() => speak(currentWord!.english)}
              showSpeaker={!autoPlay}
              onRevealTranslation={handleRevealTranslation}
              onNext={handleNext}
              wordNumber={currentIndex + 1}
              totalWords={totalItems}
              itemLabel="Possessive"
            />
          ) : practiceMode === 'disjunctive' ? (
            <PracticeCard
              french={currentWord!.french}
              english={currentWord!.english}
              translationRevealed={translationRevealed}
              onSpeak={() => speak(currentWord!.english)}
              showSpeaker={!autoPlay}
              onRevealTranslation={handleRevealTranslation}
              onNext={handleNext}
              wordNumber={currentIndex + 1}
              totalWords={totalItems}
              itemLabel="Pronoun"
            />
          ) : practiceMode === 'aller' ? (
            <PracticeCard
              french={currentWord!.french}
              english={currentWord!.english}
              translationRevealed={translationRevealed}
              onSpeak={() => speak(currentWord!.english)}
              showSpeaker={!autoPlay}
              onRevealTranslation={handleRevealTranslation}
              onNext={handleNext}
              wordNumber={currentIndex + 1}
              totalWords={totalItems}
              itemLabel="Aller"
            />
          ) : practiceMode === 'colors' ? (
            <PracticeCard
              french={currentWord!.french}
              english={currentWord!.english}
              translationRevealed={translationRevealed}
              onSpeak={() => speak(currentWord!.english)}
              showSpeaker={!autoPlay}
              onRevealTranslation={handleRevealTranslation}
              onNext={handleNext}
              wordNumber={currentIndex + 1}
              totalWords={totalItems}
              itemLabel="Color"
            />
          ) : practiceMode === 'adjectives' ? (
            <PracticeCard
              french={currentWord!.french}
              english={currentWord!.english}
              translationRevealed={translationRevealed}
              onSpeak={() => speak(currentWord!.english)}
              showSpeaker={!autoPlay}
              onRevealTranslation={handleRevealTranslation}
              onNext={handleNext}
              wordNumber={currentIndex + 1}
              totalWords={totalItems}
              itemLabel="Adjective"
            />
          ) : practiceMode === 'postadjectives' ? (
            <PracticeCard
              french={currentWord!.french}
              english={currentWord!.english}
              translationRevealed={translationRevealed}
              onSpeak={() => speak(currentWord!.english)}
              showSpeaker={!autoPlay}
              onRevealTranslation={handleRevealTranslation}
              onNext={handleNext}
              wordNumber={currentIndex + 1}
              totalWords={totalItems}
              itemLabel="Adjective"
            />
          ) : practiceMode === 'preadjectives' ? (
            <PracticeCard
              french={currentWord!.french}
              english={currentWord!.english}
              translationRevealed={translationRevealed}
              onSpeak={() => speak(currentWord!.english)}
              showSpeaker={!autoPlay}
              onRevealTranslation={handleRevealTranslation}
              onNext={handleNext}
              wordNumber={currentIndex + 1}
              totalWords={totalItems}
              itemLabel="Adjective"
            />
          ) : (
            <SoundPracticeCard
              soundTitle={currentSound!.title}
              phonetic={currentSound!.phonetic}
              phoneticSound={currentSound!.phoneticSound}
              playbackSpeed={playbackSpeed}
              showSpeaker={!autoPlay}
              onNext={handleNext}
            />
          )}
        </div>

        {/* Score Display */}
        <div className="mt-6 text-center">
          <p className="text-gray-700 font-semibold">
            {infiniteMode ? (
              <>
                Completed: <span className="text-green-600 font-bold">{correctCount}</span> (Infinite)
              </>
            ) : (
              <>
                Completed: <span className="text-green-600 font-bold">{correctCount}</span> /{" "}
                {currentIndex + 1}
              </>
            )}
          </p>
        </div>

        {/* Keyboard Shortcuts Help */}
        <div className="mt-6 p-4 bg-blue-50 rounded-2xl text-sm text-gray-600">
          <p className="font-semibold text-center mb-2">⌨️ Keyboard Shortcuts</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><kbd className="px-2 py-1 bg-white rounded shadow">Space</kbd> - Play sound</div>
            <div><kbd className="px-2 py-1 bg-white rounded shadow">Enter</kbd> - Next</div>
            <div><kbd className="px-2 py-1 bg-white rounded shadow">R</kbd> - Next</div>
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