"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { soundsData, numbersData, prepositionsData, daysOfWeekData, monthsOfYearData, possessiveAdjectivesData, disjunctivePronounsData, allerPresentData, colorsData, commonAdjectivesData, postNounAdjectivesData, preNounAdjectivesData, getAllWords } from "@/lib/sounds-data";
import SpeedControl from "@/components/SpeedControl";
import {
  getProgress,
  updateLastViewedSound,
  markSoundCompleted,
  getPlaybackSpeed,
  setPlaybackSpeed,
} from "@/lib/progress";

type LearnMode = 'sounds' | 'numbers' | 'vocab' | 'prepositions' | 'days' | 'months' | 'possessives' | 'disjunctive' | 'aller' | 'colors' | 'adjectives' | 'postadjectives' | 'preadjectives';

const subjectVsStressedRows = [
  { subject: "je", stressed: "moi" },
  { subject: "tu", stressed: "toi" },
  { subject: "il", stressed: "lui" },
  { subject: "elle", stressed: "elle" },
  { subject: "nous", stressed: "nous" },
  { subject: "vous", stressed: "vous" },
  { subject: "ils", stressed: "eux" },
  { subject: "elles", stressed: "elles" },
];

const vocabExampleMap: Record<string, { english: string; french: string }> = {
  "eau": { english: "I drink water every day.", french: "Je bois de l'eau tous les jours." },
  "jeune": { english: "He is very young.", french: "Il est très jeune." },
  "bleu": { english: "The sky is blue.", french: "Le ciel est bleu." },
  "faux": { english: "That answer is false.", french: "Cette réponse est fausse." },
  "homme": { english: "The man is here.", french: "L'homme est ici." },
  "revoir": { english: "I say goodbye to my friend.", french: "Je dis au revoir à mon ami." },
  "charmant": { english: "This village is charming.", french: "Ce village est charmant." },
  "vent": { english: "The wind is strong today.", french: "Le vent est fort aujourd'hui." },
  "langue": { english: "French is a beautiful language.", french: "Le français est une belle langue." },
  "chat": { english: "The cat is sleeping.", french: "Le chat dort." },
  "chien": { english: "My dog is friendly.", french: "Mon chien est gentil." },
  "vin": { english: "I drink red wine.", french: "Je bois du vin rouge." },
  "pain": { english: "I eat bread in the morning.", french: "Je mange du pain le matin." },
  "malin": { english: "My cat is clever.", french: "Mon chat est malin." },
  "matin": { english: "I run in the morning.", french: "Je cours le matin." },
  "oui": { english: "Yes, I understand.", french: "Oui, je comprends." },
  "nuit": { english: "Good night!", french: "Bonne nuit !" },
  "rouge": { english: "My bag is red.", french: "Mon sac est rouge." },
  "rue": { english: "I live on this street.", french: "J'habite dans cette rue." },
  "où": { english: "Where is the station?", french: "Où est la gare ?" },
  "ronde": { english: "The table is round.", french: "La table est ronde." },
  "noma": { english: "Christmas is in December.", french: "Noël est en décembre." },
  "poisson": { english: "I cook fish tonight.", french: "Je cuisine du poisson ce soir." },
  "oiseau": { english: "The bird sings in the tree.", french: "L'oiseau chante dans l'arbre." }
};

const getVocabExample = (frenchWord: string, englishWord: string) => {
  const found = vocabExampleMap[frenchWord.toLowerCase()];
  if (found) {
    return found;
  }

  return {
    english: `This is a simple example with "${englishWord}".`,
    french: `Voici un exemple simple avec « ${frenchWord} ».`
  };
};

const prepositionExampleMap: Record<string, { english: string; french: string }> = {
  "à": { english: "I am at school.", french: "Je suis à l'école." },
  "avec": { english: "I go with my friend.", french: "Je vais avec mon ami." },
  "pour": { english: "This gift is for you.", french: "Ce cadeau est pour toi." },
  "dans": { english: "The book is in the bag.", french: "Le livre est dans le sac." },
  "en": { english: "She lives in France.", french: "Elle habite en France." },
  "devant": { english: "The car is in front of the house.", french: "La voiture est devant la maison." },
  "derrière": { english: "The cat is behind the door.", french: "Le chat est derrière la porte." },
  "sous": { english: "The shoes are under the table.", french: "Les chaussures sont sous la table." },
  "sur": { english: "My phone is on the desk.", french: "Mon téléphone est sur le bureau." },
  "chez": { english: "I am at my aunt's house.", french: "Je suis chez ma tante." },
  "de": { english: "He comes from Canada.", french: "Il vient du Canada." },
  "avant": { english: "I eat before class.", french: "Je mange avant le cours." },
  "par": { english: "We travel by train.", french: "Nous voyageons par train." },
  "pendant": { english: "I read during the trip.", french: "Je lis pendant le voyage." },
  "depuis": { english: "I live here since 2020.", french: "J'habite ici depuis 2020." },
  "vers": { english: "We walk toward the park.", french: "Nous marchons vers le parc." }
};

const getPrepositionExample = (frenchWord: string, englishWord: string) => {
  const found = prepositionExampleMap[frenchWord.toLowerCase()];
  if (found) {
    return found;
  }

  return {
    english: `A simple sentence with "${englishWord}".`,
    french: `Une phrase simple avec « ${frenchWord} ».`
  };
};

export default function LearnPage() {
  const [learnMode, setLearnMode] = useState<LearnMode | null>(null);
  const [expandedVocabIndex, setExpandedVocabIndex] = useState<number | null>(null);
  const [expandedPrepositionIndex, setExpandedPrepositionIndex] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playbackSpeed, setSpeed] = useState(0.8);
  const [completedSounds, setCompletedSounds] = useState<number[]>([]);
  const [lastSpokenText, setLastSpokenText] = useState<string>("");
  const speakTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getPracticeModeFromLearnMode = (mode: LearnMode) => {
    if (mode === 'vocab') return 'words';
    return mode;
  };

  // Load saved progress on mount
  useEffect(() => {
    const progress = getProgress();
    setCurrentIndex(progress.lastViewedSound);
    setSpeed(progress.playbackSpeed);
    setCompletedSounds(progress.completedSounds);

    if (typeof window !== 'undefined') {
      const mode = new URLSearchParams(window.location.search).get('mode');
      if (mode === 'sounds' || mode === 'numbers' || mode === 'vocab' || mode === 'prepositions' || mode === 'days' || mode === 'months' || mode === 'possessives' || mode === 'disjunctive' || mode === 'aller' || mode === 'colors' || mode === 'adjectives' || mode === 'postadjectives' || mode === 'preadjectives') {
        setLearnMode(mode);
      }
    }
  }, []);

  // Save progress when sound changes
  useEffect(() => {
    updateLastViewedSound(currentIndex);
  }, [currentIndex]);

  const currentSound = soundsData[currentIndex];
  const totalSounds = soundsData.length;
  const vocabWords = Array.from(
    new Map(
      getAllWords().map((word) => [`${word.french.toLowerCase()}|${word.english.toLowerCase()}`, word])
    ).values()
  );

  const normalizeSpeechText = (text: string) => {
    const normalized = text.trim().toLowerCase();
    if (normalized === "à") return "à Paris";
    if (normalized === "en") return "en France";
    if (normalized === "de") return "de Paris";
    if (normalized === "où") return "où est la gare";
    return text;
  };

  const getColorPreview = (englishColor: string) => {
    const normalized = englishColor.toLowerCase();
    if (normalized.includes("red")) return "#ef4444";
    if (normalized.includes("orange")) return "#f97316";
    if (normalized.includes("yellow")) return "#eab308";
    if (normalized.includes("pink")) return "#ec4899";
    if (normalized.includes("green")) return "#22c55e";
    if (normalized.includes("blue")) return "#3b82f6";
    if (normalized.includes("purple")) return "#a855f7";
    if (normalized.includes("white")) return "#ffffff";
    if (normalized.includes("brown")) return "#8b5a2b";
    if (normalized.includes("black")) return "#111827";
    return "#d1d5db";
  };

  // Text-to-speech function with error handling and vibration
  const speak = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try {
        if (speakTimeoutRef.current) {
          clearTimeout(speakTimeoutRef.current);
          speakTimeoutRef.current = null;
        }
        window.speechSynthesis.cancel();
        const speechText = normalizeSpeechText(text);
        const utterance = new SpeechSynthesisUtterance(speechText);
        utterance.lang = "fr-FR";
        utterance.rate = playbackSpeed;
        
        utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
          const benignErrors = new Set(["canceled", "interrupted", "audio-busy"]);
          if (benignErrors.has(event.error)) {
            return;
          }
          console.warn("Speech synthesis warning:", event.error);
        };
        
        speakTimeoutRef.current = setTimeout(() => {
          window.speechSynthesis.speak(utterance);
          speakTimeoutRef.current = null;
        }, 40);
        setLastSpokenText(speechText);
        
        if ('vibrate' in navigator) {
          navigator.vibrate(10);
        }
      } catch (error) {
        console.error('Failed to speak:', error);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (speakTimeoutRef.current) {
        clearTimeout(speakTimeoutRef.current);
      }
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

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
    if (!learnMode) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case 'q':
          event.preventDefault();
          replayLast();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [learnMode, lastSpokenText]);

  // Preload TTS voices
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.addEventListener('voiceschanged', () => {
        window.speechSynthesis.getVoices();
      });
    }
  }, []);

  if (!learnMode) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 px-4 py-8 page-transition">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">Choose Learn Type</h1>
            <p className="text-gray-600">Pick what you want to learn first</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <button
              onClick={() => setLearnMode('sounds')}
              className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🔊</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Sounds</h2>
                <p className="text-gray-600 mb-6">Learn French pronunciation patterns with examples</p>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-2xl font-bold group-hover:from-blue-600 group-hover:to-blue-700 transition-all">
                  Start Sounds →
                </div>
              </div>
            </button>

            <button
              onClick={() => setLearnMode('numbers')}
              className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🔢</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Numbers</h2>
                <p className="text-gray-600 mb-6">Learn French counting with clear grouped number lists</p>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-2xl font-bold group-hover:from-green-600 group-hover:to-green-700 transition-all">
                  Start Numbers →
                </div>
              </div>
            </button>

            <button
              onClick={() => setLearnMode('vocab')}
              className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">📝</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Vocab</h2>
                <p className="text-gray-600 mb-6">Learn vocabulary in a compact English-first list</p>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-6 rounded-2xl font-bold group-hover:from-purple-600 group-hover:to-purple-700 transition-all">
                  Start Vocab →
                </div>
              </div>
            </button>

            <button
              onClick={() => setLearnMode('prepositions')}
              className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">📌</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Preposition</h2>
                <p className="text-gray-600 mb-6">Learn useful French prepositions in a simple list</p>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-2xl font-bold group-hover:from-orange-600 group-hover:to-orange-700 transition-all">
                  Start Preposition →
                </div>
              </div>
            </button>

            <button
              onClick={() => setLearnMode('days')}
              className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">📅</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Days</h2>
                <p className="text-gray-600 mb-6">Learn days of the week in a simple list</p>
                <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 px-6 rounded-2xl font-bold group-hover:from-teal-600 group-hover:to-teal-700 transition-all">
                  Start Days →
                </div>
              </div>
            </button>

            <button
              onClick={() => setLearnMode('months')}
              className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🗓️</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Months</h2>
                <p className="text-gray-600 mb-6">Learn months of the year in a simple list</p>
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-3 px-6 rounded-2xl font-bold group-hover:from-indigo-600 group-hover:to-indigo-700 transition-all">
                  Start Months →
                </div>
              </div>
            </button>

            <button
              onClick={() => setLearnMode('possessives')}
              className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🧩</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Possessive</h2>
                <p className="text-gray-600 mb-6">Learn mon/ma/mes, ton/ta/tes and more</p>
                <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 px-6 rounded-2xl font-bold group-hover:from-pink-600 group-hover:to-pink-700 transition-all">
                  Start Possessive →
                </div>
              </div>
            </button>

            <button
              onClick={() => setLearnMode('disjunctive')}
              className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🗣️</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Disjunctive</h2>
                <p className="text-gray-600 mb-6">Learn stressed pronouns and when to use them</p>
                <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white py-3 px-6 rounded-2xl font-bold group-hover:from-cyan-600 group-hover:to-cyan-700 transition-all">
                  Start Disjunctive →
                </div>
              </div>
            </button>

            <button
              onClick={() => setLearnMode('aller')}
              className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🚶</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Aller</h2>
                <p className="text-gray-600 mb-6">Learn present tense + à vs chez usage</p>
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-6 rounded-2xl font-bold group-hover:from-emerald-600 group-hover:to-emerald-700 transition-all">
                  Start Aller →
                </div>
              </div>
            </button>

            <button
              onClick={() => setLearnMode('colors')}
              className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🎨</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Colors</h2>
                <p className="text-gray-600 mb-6">Learn colors and agreement rules</p>
                <div className="bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 text-white py-3 px-6 rounded-2xl font-bold group-hover:from-fuchsia-600 group-hover:to-fuchsia-700 transition-all">
                  Start Colors →
                </div>
              </div>
            </button>

            <button
              onClick={() => setLearnMode('adjectives')}
              className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">Aa</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Adjectives</h2>
                <p className="text-gray-600 mb-6">Common [m]/[f] adjective forms</p>
                <div className="bg-gradient-to-r from-amber-500 to-sky-500 text-white py-3 px-6 rounded-2xl font-bold group-hover:from-amber-600 group-hover:to-sky-600 transition-all">
                  Start Adjectives →
                </div>
              </div>
            </button>

            <button
              onClick={() => setLearnMode('postadjectives')}
              className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">A+</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Adj After Noun</h2>
                <p className="text-gray-600 mb-6">Personality, quality and condition adjectives</p>
                <div className="bg-gradient-to-r from-violet-500 to-violet-600 text-white py-3 px-6 rounded-2xl font-bold group-hover:from-violet-600 group-hover:to-violet-700 transition-all">
                  Start Topic →
                </div>
              </div>
            </button>

            <button
              onClick={() => setLearnMode('preadjectives')}
              className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">A-</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Adj Before Noun</h2>
                <p className="text-gray-600 mb-6">BAGS adjectives before nouns</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 pb-20 page-transition">
      {/* Header with Progress */}
      <div className="sticky top-0 z-10 bg-white shadow-md px-4 py-4 transition-all duration-300">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-3 text-center">
            {learnMode === 'sounds' ? 'Learn Sounds' : learnMode === 'numbers' ? 'Learn Numbers' : learnMode === 'vocab' ? 'Learn Vocab' : learnMode === 'days' ? 'Learn Days' : learnMode === 'months' ? 'Learn Months' : learnMode === 'possessives' ? 'Learn Possessive' : learnMode === 'disjunctive' ? 'Learn Disjunctive' : learnMode === 'aller' ? 'Learn Aller' : learnMode === 'colors' ? 'Learn Colors' : learnMode === 'adjectives' ? 'Learn Adjectives' : learnMode === 'postadjectives' ? 'Learn Adjectives After Noun' : learnMode === 'preadjectives' ? 'Learn Adjectives Before Noun' : 'Learn Prepositions'}
          </h1>

          <div className="flex justify-center mb-3">
            <div className="inline-flex rounded-xl bg-gray-100 p-1">
              <button className="px-4 py-1.5 rounded-lg bg-blue-500 text-white text-sm font-semibold">
                Learn
              </button>
              <Link
                href={`/practice?mode=${getPracticeModeFromLearnMode(learnMode)}`}
                className="px-4 py-1.5 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-all duration-200"
              >
                Practice
              </Link>
            </div>
          </div>

          <div className="flex justify-center mb-3">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-semibold transition-all duration-200"
            >
              Go Home
            </Link>
          </div>

        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
        {learnMode === 'sounds' ? (
          <>
            <SpeedControl
              currentSpeed={playbackSpeed}
              onSpeedChange={handleSpeedChange}
            />

            <div className="space-y-4">
              {soundsData.map((sound, index) => (
                <div key={sound.id} className="relative bg-white rounded-2xl shadow-md p-4">
                  <span className="absolute top-3 left-3 w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="pl-8 pt-1">
                      <h3 className="text-xl font-bold text-gray-800">{sound.title}</h3>
                      {sound.phonetic && (
                        <p className="text-sm font-semibold text-blue-600 mt-0.5">{sound.phonetic}</p>
                      )}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {sound.patterns.map((pattern, index) => (
                          <span key={index} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            {pattern}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => speak(sound.phoneticSound)}
                      className="w-11 h-11 min-w-[44px] rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-all duration-200 active:scale-95 shadow-md"
                      aria-label={`Play ${sound.title} pronunciation`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h1.536l4.033 3.796A.75.75 0 0010 16.25V3.75zM12.78 7.22a.75.75 0 10-1.06 1.06L13.44 10l-1.72 1.72a.75.75 0 101.06 1.06l2.25-2.25a.75.75 0 000-1.06l-2.25-2.25z" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {sound.examples.map((example, index) => (
                      <button
                        key={index}
                        onClick={() => speak(example.french)}
                        className="w-full text-left flex items-center justify-between gap-3 bg-gray-50 rounded-xl px-3 py-2 hover:bg-gray-100 transition-all duration-200 active:scale-[0.99]"
                        aria-label={`Play ${example.french}`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-base font-semibold text-gray-900 truncate">{example.french}</p>
                          <p className="text-xs text-gray-600 truncate">{example.english}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {sound.note && (
                    <div className="mt-3 p-2.5 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                      <p className="text-xs text-yellow-800">💡 {sound.note}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

        {/* Keyboard Shortcuts Help */}
        <div className="mt-6 p-4 bg-blue-50 rounded-2xl text-sm text-gray-600">
          <p className="font-semibold text-center mb-2">⌨️ Keyboard Shortcuts</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><kbd className="px-2 py-1 bg-white rounded shadow">Click</kbd> Play selected item</div>
            <div><kbd className="px-2 py-1 bg-white rounded shadow">Q</kbd> Replay last</div>
            <div><kbd className="px-2 py-1 bg-white rounded shadow">Tap</kbd> Listen by example</div>
            <div><kbd className="px-2 py-1 bg-white rounded shadow">Speed</kbd> Control playback rate</div>
          </div>
        </div>
          </>
        ) : (
          learnMode === 'numbers' ? (
          <>
            {/* Numbers Mode */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                French Numbers
              </h2>
              <p className="text-gray-600 mb-6 text-center">
                Learn to count in French. Click any number to hear its pronunciation.
              </p>

              {/* Speed Control */}
              <SpeedControl
                currentSpeed={playbackSpeed}
                onSpeedChange={handleSpeedChange}
              />

              {/* Numbers 1-20 */}
              <div className="bg-white rounded-3xl shadow-md p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🔢</span> Numbers 1-20
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Basic counting from one to twenty - these are essential!
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {numbersData.filter(n => n.category === 'basic').map((num) => (
                    <button
                      key={num.number}
                      onClick={() => speak(num.french)}
                      className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl p-4 transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                    >
                      <div className="text-3xl font-bold text-blue-600 mb-1">{num.number}</div>
                      <div className="text-sm font-semibold text-gray-700">{num.french}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tens (30-90) */}
              <div className="bg-white rounded-3xl shadow-md p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📊</span> Tens (30-90)
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Key tens numbers - note the patterns in French!
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {numbersData.filter(n => n.category === 'tens').map((num) => (
                    <button
                      key={num.number}
                      onClick={() => speak(num.french)}
                      className="bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl p-4 transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                    >
                      <div className="text-3xl font-bold text-green-600 mb-1">{num.number}</div>
                      <div className="text-sm font-semibold text-gray-700">{num.french}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Numbers */}
              <div className="bg-white rounded-3xl shadow-md p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">⭐</span> Special Numbers
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Important milestone numbers
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {numbersData.filter(n => n.category === 'special').map((num) => (
                    <button
                      key={num.number}
                      onClick={() => speak(num.french)}
                      className="bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl p-4 transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                    >
                      <div className="text-3xl font-bold text-purple-600 mb-1">{num.number}</div>
                      <div className="text-sm font-semibold text-gray-700">{num.french}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Learning Tips */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-xl p-4">
                <h4 className="font-bold text-yellow-800 mb-2">💡 Tips for Learning French Numbers</h4>
                <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                  <li>Numbers 1-16 are unique and must be memorized</li>
                  <li>17-19 follow the pattern "dix" + number (ten + number)</li>
                  <li>70 = sixty-ten (soixante-dix), 80 = four-twenties (quatre-vingts)</li>
                  <li>90 = four-twenty-ten (quatre-vingt-dix)</li>
                  <li>Practice with the ranges in Practice mode!</li>
                </ul>
              </div>
            </div>
          </>
          ) : learnMode === 'days' ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                French Days of the Week
              </h2>
              <p className="text-gray-600 mb-6 text-center">
                English first, French below. Tap a row to hear pronunciation.
              </p>

              <SpeedControl
                currentSpeed={playbackSpeed}
                onSpeedChange={handleSpeedChange}
              />

              <div className="space-y-3">
                {daysOfWeekData.map((day, index) => (
                  <button
                    key={`${day.french}-${index}`}
                    onClick={() => speak(day.french)}
                    className="w-full text-left bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-lg font-bold text-gray-900 truncate">{day.english}</p>
                        <p className="text-sm text-teal-700 font-semibold truncate">{day.french}</p>
                      </div>
                      <span className="text-teal-600 text-xs font-semibold">Tap to hear</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
          ) : learnMode === 'months' ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                French Months of the Year
              </h2>
              <p className="text-gray-600 mb-6 text-center">
                English first, French below. Tap a row to hear pronunciation.
              </p>

              <SpeedControl
                currentSpeed={playbackSpeed}
                onSpeedChange={handleSpeedChange}
              />

              <div className="space-y-3">
                {monthsOfYearData.map((month, index) => (
                  <button
                    key={`${month.french}-${index}`}
                    onClick={() => speak(month.french)}
                    className="w-full text-left bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-lg font-bold text-gray-900 truncate">{month.english}</p>
                        <p className="text-sm text-indigo-700 font-semibold truncate">{month.french}</p>
                      </div>
                      <span className="text-indigo-600 text-xs font-semibold">Tap to hear</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
          ) : learnMode === 'possessives' ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                French Possessive Adjectives
              </h2>
              <p className="text-gray-600 mb-6 text-center">
                Depends on the noun form (masculine/feminine/plural), not the owner.
              </p>

              <SpeedControl
                currentSpeed={playbackSpeed}
                onSpeedChange={handleSpeedChange}
              />

              <div className="space-y-5">
                <div className="bg-white rounded-2xl shadow-md p-4">
                  <h3 className="text-lg font-bold text-pink-700 mb-3">A. My</h3>
                  <div className="space-y-2">
                    {possessiveAdjectivesData.filter((item) => item.french === 'mon' || item.french === 'ma' || item.french === 'mes').map((item, index) => (
                      <button key={`my-${index}`} onClick={() => speak(item.french)} className="w-full text-left rounded-xl bg-pink-50 hover:bg-pink-100 p-3 transition-all duration-200">
                        <p className="font-bold text-gray-900">{item.french}</p>
                        <p className="text-sm text-pink-800">{item.english}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-4">
                  <h3 className="text-lg font-bold text-pink-700 mb-3">B. Your</h3>
                  <div className="space-y-2">
                    {possessiveAdjectivesData.filter((item) => item.french === 'ton' || item.french === 'ta' || item.french === 'tes' || item.french === 'votre' || item.french === 'vos').map((item, index) => (
                      <button key={`your-${index}`} onClick={() => speak(item.french)} className="w-full text-left rounded-xl bg-pink-50 hover:bg-pink-100 p-3 transition-all duration-200">
                        <p className="font-bold text-gray-900">{item.french}</p>
                        <p className="text-sm text-pink-800">{item.english}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-4">
                  <h3 className="text-lg font-bold text-pink-700 mb-3">C. Our</h3>
                  <div className="space-y-2">
                    {possessiveAdjectivesData.filter((item) => item.french === 'nos').map((item, index) => (
                      <button key={`our-${index}`} onClick={() => speak(item.french)} className="w-full text-left rounded-xl bg-pink-50 hover:bg-pink-100 p-3 transition-all duration-200">
                        <p className="font-bold text-gray-900">{item.french}</p>
                        <p className="text-sm text-pink-800">{item.english}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-4">
                  <h3 className="text-lg font-bold text-pink-700 mb-3">D. Their</h3>
                  <div className="space-y-2">
                    {possessiveAdjectivesData.filter((item) => item.french === 'leur' || item.french === 'leurs').map((item, index) => (
                      <button key={`their-${index}`} onClick={() => speak(item.french)} className="w-full text-left rounded-xl bg-pink-50 hover:bg-pink-100 p-3 transition-all duration-200">
                        <p className="font-bold text-gray-900">{item.french}</p>
                        <p className="text-sm text-pink-800">{item.english}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-4">
                  <h3 className="text-lg font-bold text-pink-700 mb-3">E. His / Her</h3>
                  <div className="space-y-2">
                    {possessiveAdjectivesData.filter((item) => item.french === 'son' || item.french === 'sa' || item.french === 'ses').map((item, index) => (
                      <button key={`hisher-${index}`} onClick={() => speak(item.french)} className="w-full text-left rounded-xl bg-pink-50 hover:bg-pink-100 p-3 transition-all duration-200">
                        <p className="font-bold text-gray-900">{item.french}</p>
                        <p className="text-sm text-pink-800">{item.english}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
          ) : learnMode === 'disjunctive' ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Disjunctive (Stressed) Pronouns
              </h2>
              <p className="text-gray-600 mb-6 text-center">
                Tap any pronoun to hear pronunciation.
              </p>

              <SpeedControl
                currentSpeed={playbackSpeed}
                onSpeedChange={handleSpeedChange}
              />

              <div className="bg-white rounded-2xl shadow-md p-4 mb-5">
                <h3 className="text-lg font-bold text-cyan-700 mb-3">First Person</h3>
                <div className="space-y-2">
                  {disjunctivePronounsData.filter((item) => item.french === 'moi' || item.french === 'nous').map((item, index) => (
                    <button key={`first-${index}`} onClick={() => speak(item.french)} className="w-full text-left rounded-xl bg-cyan-50 hover:bg-cyan-100 p-3 transition-all duration-200">
                      <p className="font-bold text-gray-900">{item.french}</p>
                      <p className="text-sm text-cyan-800">{item.english}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-4 mb-5">
                <h3 className="text-lg font-bold text-cyan-700 mb-3">Second Person</h3>
                <div className="space-y-2">
                  {disjunctivePronounsData.filter((item) => item.french === 'toi' || item.french === 'vous').map((item, index) => (
                    <button key={`second-${index}`} onClick={() => speak(item.french)} className="w-full text-left rounded-xl bg-cyan-50 hover:bg-cyan-100 p-3 transition-all duration-200">
                      <p className="font-bold text-gray-900">{item.french}</p>
                      <p className="text-sm text-cyan-800">{item.english}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-4 mb-5">
                <h3 className="text-lg font-bold text-cyan-700 mb-3">Third Person</h3>
                <div className="space-y-2">
                  {disjunctivePronounsData.filter((item) => item.french === 'lui' || item.french === 'elle' || item.french === 'eux' || item.french === 'elles').map((item, index) => (
                    <button key={`third-${index}`} onClick={() => speak(item.french)} className="w-full text-left rounded-xl bg-cyan-50 hover:bg-cyan-100 p-3 transition-all duration-200">
                      <p className="font-bold text-gray-900">{item.french}</p>
                      <p className="text-sm text-cyan-800">{item.english}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-4 mb-5">
                <h3 className="text-lg font-bold text-cyan-700 mb-3">Subject vs Stressed Forms</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b border-gray-200">
                        <th className="py-2 pr-3 text-gray-700">Subject</th>
                        <th className="py-2 text-gray-700">Stressed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjectVsStressedRows.map((row) => (
                        <tr key={`${row.subject}-${row.stressed}`} className="border-b border-gray-100">
                          <td className="py-2 pr-3 font-semibold text-gray-900">{row.subject}</td>
                          <td className="py-2">
                            <button onClick={() => speak(row.stressed)} className="px-2 py-1 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-semibold transition-all duration-200">
                              {row.stressed}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-4 mb-5 space-y-4">
                <h3 className="text-lg font-bold text-cyan-700">Learn: What These Pronouns Do</h3>

                <div>
                  <p className="font-semibold text-gray-900">1️⃣ Emphasize the person</p>
                  <p className="text-sm text-gray-700 mb-2">Used to stress who.</p>
                  <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                    <li>C’est moi → It’s me</li>
                    <li>Ce sont eux → It’s them</li>
                    <li>C’est elle → It’s her</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-gray-900">2️⃣ Used alone as an answer</p>
                  <p className="text-sm text-gray-700 mb-2">When the verb is understood.</p>
                  <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                    <li>Qui a raison ? → Who is right?</li>
                    <li>Moi → Me</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-gray-900">3️⃣ Used after prepositions</p>
                  <p className="text-sm text-gray-700 mb-2">After: avec, pour, sans, chez, entre, contre, etc.</p>
                  <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                    <li>Je suis avec toi → I am with you</li>
                    <li>Ces livres sont pour moi → These books are for me</li>
                    <li>Elle vient chez nous → She comes to our place</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-gray-900">4️⃣ Used for emphasis with subject pronoun</p>
                  <p className="text-sm text-gray-700 mb-2">Optional but common in speech.</p>
                  <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                    <li>Moi, je comprends. → Me, I understand.</li>
                    <li>Lui, il travaille beaucoup. → Him, he works a lot.</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-xl p-4">
                <h4 className="font-bold text-yellow-800 mb-2">⚠️ Important Rules</h4>
                <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                  <li>Used only for people</li>
                  <li>Must match gender and number</li>
                  <li>Often used in spoken French for clarity and emphasis</li>
                </ul>
              </div>
            </div>
          </>
          ) : learnMode === 'aller' ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Aller (to go) — Present Tense
              </h2>
              <p className="text-gray-600 mb-6 text-center">
                Tap any form or sentence to hear pronunciation.
              </p>

              <SpeedControl
                currentSpeed={playbackSpeed}
                onSpeedChange={handleSpeedChange}
              />

              <div className="bg-white rounded-2xl shadow-md p-4 mb-5">
                <h3 className="text-lg font-bold text-emerald-700 mb-3">Present Forms</h3>
                <div className="space-y-2">
                  {allerPresentData.map((item, index) => (
                    <button key={`aller-form-${index}`} onClick={() => speak(item.french)} className="w-full text-left rounded-xl bg-emerald-50 hover:bg-emerald-100 p-3 transition-all duration-200">
                      <p className="font-bold text-gray-900">{item.french}</p>
                      <p className="text-sm text-emerald-800">{item.english}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-5">
                <div className="bg-white rounded-2xl shadow-md p-4">
                  <h3 className="text-lg font-bold text-emerald-700 mb-2">Aller + à</h3>
                  <p className="text-sm text-gray-700 mb-2">Used for places and buildings.</p>
                  <div className="space-y-2">
                    {[
                      "Je vais à la maison",
                      "Je vais à l’école",
                      "Je vais au magasin",
                    ].map((line, index) => (
                      <button key={`aller-a-${index}`} onClick={() => speak(line)} className="w-full text-left rounded-xl bg-emerald-50 hover:bg-emerald-100 p-2.5 text-sm text-gray-800 transition-all duration-200">
                        {line}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-4">
                  <h3 className="text-lg font-bold text-emerald-700 mb-2">Aller + chez</h3>
                  <p className="text-sm text-gray-700 mb-2">Used for people or someone’s place.</p>
                  <div className="space-y-2">
                    {[
                      "Je vais chez toi",
                      "Je vais chez lui",
                      "Je vais chez mon ami",
                    ].map((line, index) => (
                      <button key={`aller-chez-${index}`} onClick={() => speak(line)} className="w-full text-left rounded-xl bg-emerald-50 hover:bg-emerald-100 p-2.5 text-sm text-gray-800 transition-all duration-200">
                        {line}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-4 mb-5 space-y-4">
                <h3 className="text-lg font-bold text-emerald-700">Examples</h3>
                <div className="space-y-3 text-sm text-gray-800">
                  <div>
                    <p className="font-semibold">1️⃣ I am going to your house</p>
                    <button onClick={() => speak("Je vais à ta maison")} className="block text-left mt-1 text-emerald-800 hover:text-emerald-900">Je vais à ta maison</button>
                    <button onClick={() => speak("Je vais chez toi")} className="block text-left text-emerald-800 hover:text-emerald-900">Je vais chez toi</button>
                    <p className="text-xs text-gray-600 mt-1">Second one sounds more natural.</p>
                  </div>

                  <div>
                    <p className="font-semibold">2️⃣ I am going to Aarti’s place</p>
                    <button onClick={() => speak("Je vais chez Aarti")} className="block text-left mt-1 text-emerald-800 hover:text-emerald-900">Je vais chez Aarti</button>
                  </div>

                  <div>
                    <p className="font-semibold">3️⃣ I am going to his house</p>
                    <button onClick={() => speak("Je vais à sa maison")} className="block text-left mt-1 text-emerald-800 hover:text-emerald-900">Je vais à sa maison</button>
                    <button onClick={() => speak("Je vais chez lui")} className="block text-left text-emerald-800 hover:text-emerald-900">Je vais chez lui ✅ (more natural)</button>
                  </div>

                  <div>
                    <p className="font-semibold">4️⃣ I am going to my friend’s house</p>
                    <button onClick={() => speak("Je vais chez mon ami")} className="block text-left mt-1 text-emerald-800 hover:text-emerald-900">Je vais chez mon ami</button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-4 mb-5">
                <h3 className="text-lg font-bold text-emerald-700 mb-2">Learn: When to Use “chez”</h3>
                <p className="text-sm text-gray-700 mb-2">Use chez when you mean:</p>
                <ul className="text-sm text-gray-700 list-disc list-inside space-y-1 mb-3">
                  <li>at someone’s home</li>
                  <li>at someone’s business</li>
                  <li>visiting someone</li>
                </ul>
                <div className="space-y-2">
                  {[
                    "chez le médecin",
                    "chez le coiffeur",
                    "chez mes parents",
                  ].map((line, index) => (
                    <button key={`chez-example-${index}`} onClick={() => speak(line)} className="w-full text-left rounded-xl bg-emerald-50 hover:bg-emerald-100 p-2.5 text-sm text-gray-800 transition-all duration-200">
                      {line}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-red-50 border-l-4 border-red-400 rounded-r-xl p-4 mb-4">
                <h4 className="font-bold text-red-800 mb-2">⚠️ Common Mistake</h4>
                <ul className="text-sm text-red-800 space-y-1 list-disc list-inside">
                  <li>❌ Je vais chez la maison</li>
                  <li>✔ Je vais à la maison</li>
                  <li>❌ Je vais à lui</li>
                  <li>✔ Je vais chez lui</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-xl p-4">
                <h4 className="font-bold text-yellow-800 mb-2">🔥 Quick Memory Rule</h4>
                <p className="text-sm text-yellow-800">👉 Place → à</p>
                <p className="text-sm text-yellow-800">👉 Person → chez</p>
              </div>
            </div>
          </>
          ) : learnMode === 'colors' ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Colors in French (Les couleurs)
              </h2>
              <p className="text-gray-600 mb-6 text-center">
                Tap any color or sentence to hear pronunciation.
              </p>

              <SpeedControl
                currentSpeed={playbackSpeed}
                onSpeedChange={handleSpeedChange}
              />

              <div className="bg-white rounded-2xl shadow-md p-4 mb-5">
                <h3 className="text-lg font-bold text-fuchsia-700 mb-3">Basic Colors</h3>
                <div className="space-y-2">
                  {colorsData.map((item, index) => (
                    <button key={`color-${index}`} onClick={() => speak(item.french.split(' / ')[0])} className="w-full text-left rounded-xl bg-fuchsia-50 hover:bg-fuchsia-100 p-3 transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-8 h-8 rounded-lg border border-gray-300 shadow-sm flex-shrink-0"
                          style={{ backgroundColor: getColorPreview(item.english) }}
                        />
                        <div>
                          <p className="font-bold text-gray-900">{item.english}</p>
                          <p className="text-sm text-fuchsia-800">{item.french}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-4 mb-5 space-y-4">
                <h3 className="text-lg font-bold text-fuchsia-700">Learn: Important Rules</h3>

                <div>
                  <p className="font-semibold text-gray-900">1️⃣ Colors come after the noun</p>
                  <div className="mt-2 space-y-1 text-sm text-gray-700">
                    <button onClick={() => speak("une voiture rouge")} className="block text-left text-fuchsia-800 hover:text-fuchsia-900">une voiture rouge → a red car</button>
                    <button onClick={() => speak("un pull bleu")} className="block text-left text-fuchsia-800 hover:text-fuchsia-900">un pull bleu → a blue sweater</button>
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-gray-900">2️⃣ Colors agree with gender</p>
                  <div className="overflow-x-auto mt-2">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left border-b border-gray-200">
                          <th className="py-2 pr-3 text-gray-700">Masculine</th>
                          <th className="py-2 text-gray-700">Feminine</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["vert", "verte"],
                          ["bleu", "bleue"],
                          ["noir", "noire"],
                          ["blanc", "blanche"],
                          ["brun", "brune"],
                          ["violet", "violette"],
                        ].map((row) => (
                          <tr key={`${row[0]}-${row[1]}`} className="border-b border-gray-100">
                            <td className="py-2 pr-3 font-semibold text-gray-900">{row[0]}</td>
                            <td className="py-2 font-semibold text-gray-900">{row[1]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-2 space-y-1 text-sm text-gray-700">
                    <button onClick={() => speak("un sac noir")} className="block text-left text-fuchsia-800 hover:text-fuchsia-900">un sac noir → a black bag</button>
                    <button onClick={() => speak("une robe noire")} className="block text-left text-fuchsia-800 hover:text-fuchsia-900">une robe noire → a black dress</button>
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-gray-900">3️⃣ Colors agree with plural</p>
                  <p className="text-sm text-gray-700 mt-1">Add <span className="font-semibold">s</span> for plural.</p>
                  <div className="mt-2 space-y-1 text-sm text-gray-700">
                    <button onClick={() => speak("un chat noir")} className="block text-left text-fuchsia-800 hover:text-fuchsia-900">un chat noir → a black cat</button>
                    <button onClick={() => speak("deux chats noirs")} className="block text-left text-fuchsia-800 hover:text-fuchsia-900">deux chats noirs → two black cats</button>
                    <button onClick={() => speak("une fleur blanche")} className="block text-left text-fuchsia-800 hover:text-fuchsia-900">une fleur blanche → a white flower</button>
                    <button onClick={() => speak("des fleurs blanches")} className="block text-left text-fuchsia-800 hover:text-fuchsia-900">des fleurs blanches → white flowers</button>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-xl p-4 mb-4">
                <h4 className="font-bold text-yellow-800 mb-2">⚠️ Colors that DO NOT change</h4>
                <p className="text-sm text-yellow-800 mb-2">These stay the same:</p>
                <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside mb-2">
                  <li>orange</li>
                  <li>rose</li>
                  <li>marron</li>
                  <li>beige</li>
                </ul>
                <div className="space-y-1 text-sm text-yellow-900">
                  <button onClick={() => speak("des chemises orange")} className="block text-left hover:underline">des chemises orange</button>
                  <button onClick={() => speak("des chaussures marron")} className="block text-left hover:underline">des chaussures marron</button>
                </div>
              </div>

              <div className="bg-emerald-50 border-l-4 border-emerald-400 rounded-r-xl p-4">
                <h4 className="font-bold text-emerald-800 mb-2">🔥 Quick Memory Tip</h4>
                <p className="text-sm text-emerald-800">👉 If it ends in <span className="font-semibold">-e</span>, usually feminine</p>
                <p className="text-sm text-emerald-800">👉 If noun is plural → add <span className="font-semibold">s</span></p>
                <p className="text-sm text-emerald-800">👉 Some colors never change (orange, rose)</p>
              </div>
            </div>
          </>
          ) : learnMode === 'adjectives' ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Common Adjectives
              </h2>
              <p className="text-gray-600 mb-4 text-center">
                <span className="font-semibold">[m]</span> = Masculine &nbsp; | &nbsp; <span className="font-semibold">[f]</span> = Feminine
              </p>

              <SpeedControl
                currentSpeed={playbackSpeed}
                onSpeedChange={handleSpeedChange}
              />

              <div className="space-y-3">
                {commonAdjectivesData.map((item, index) => {
                  const [masculinePart, femininePart] = item.french.split(" / ");
                  const masculineWord = masculinePart?.replace(" [m]", "") || "";
                  const feminineWord = femininePart?.replace(" [f]", "") || "";
                  return (
                    <div key={`adj-${index}`} className="bg-white rounded-2xl shadow-md p-4">
                      <p className="text-lg font-bold text-gray-900 mb-2">{item.english}</p>
                      <div className="grid md:grid-cols-2 gap-2">
                        <button
                          onClick={() => speak(masculineWord)}
                          className="text-left rounded-xl bg-amber-50 hover:bg-amber-100 p-3 transition-all duration-200"
                        >
                          <p className="font-semibold text-amber-800">{masculinePart}</p>
                        </button>
                        <button
                          onClick={() => speak(feminineWord)}
                          className="text-left rounded-xl bg-sky-50 hover:bg-sky-100 p-3 transition-all duration-200"
                        >
                          <p className="font-semibold text-sky-800">{femininePart}</p>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
          ) : learnMode === 'postadjectives' ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Adjectives (Usually After the Noun)
              </h2>

              <SpeedControl
                currentSpeed={playbackSpeed}
                onSpeedChange={handleSpeedChange}
              />

              <div className="space-y-3 mb-5">
                {postNounAdjectivesData.map((item, index) => {
                  const [masculinePart, femininePart] = item.french.split(" / ");
                  const masculineWord = masculinePart?.replace(" [m]", "") || "";
                  const feminineWord = femininePart?.replace(" [f]", "") || "";
                  return (
                    <div key={`post-adj-${index}`} className="bg-white rounded-2xl shadow-md p-4">
                      <p className="text-lg font-bold text-gray-900 mb-2">{item.english}</p>
                      <div className="grid md:grid-cols-2 gap-2">
                        <button onClick={() => speak(masculineWord)} className="text-left rounded-xl bg-violet-50 hover:bg-violet-100 p-3 transition-all duration-200">
                          <p className="font-semibold text-violet-800">{masculinePart}</p>
                        </button>
                        <button onClick={() => speak(feminineWord)} className="text-left rounded-xl bg-violet-50 hover:bg-violet-100 p-3 transition-all duration-200">
                          <p className="font-semibold text-violet-800">{femininePart}</p>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-emerald-50 border-l-4 border-emerald-400 rounded-r-xl p-4 mb-4">
                <h4 className="font-bold text-emerald-800 mb-2">✔ Notes</h4>
                <ul className="text-sm text-emerald-800 space-y-1 list-disc list-inside">
                  <li>These adjectives normally come after the noun</li>
                  <li>Used to describe personality, condition, truth, quality</li>
                  <li>Many change spelling in feminine form</li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-4">
                <h4 className="font-bold text-violet-800 mb-2">Examples</h4>
                <div className="space-y-1 text-sm text-gray-800">
                  <button onClick={() => speak("un homme fier")} className="block text-left hover:text-violet-700 transition-colors">un homme fier → a proud man</button>
                  <button onClick={() => speak("une femme étrangère")} className="block text-left hover:text-violet-700 transition-colors">une femme étrangère → a foreign woman</button>
                  <button onClick={() => speak("une réponse fausse")} className="block text-left hover:text-violet-700 transition-colors">une réponse fausse → a wrong answer</button>
                  <button onClick={() => speak("du pain frais")} className="block text-left hover:text-violet-700 transition-colors">du pain frais → fresh bread</button>
                </div>
              </div>
            </div>
          </>
          ) : learnMode === 'preadjectives' ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Adjectives That Come Before the Noun
              </h2>

              <SpeedControl
                currentSpeed={playbackSpeed}
                onSpeedChange={handleSpeedChange}
              />

              <div className="space-y-3 mb-5">
                {preNounAdjectivesData.map((item, index) => {
                  const [masculinePart, femininePart] = item.french.split(" / ");
                  const masculineWord = masculinePart?.replace(" [m]", "") || "";
                  const feminineWord = femininePart?.replace(" [f]", "") || "";
                  return (
                    <div key={`pre-adj-${index}`} className="bg-white rounded-2xl shadow-md p-4">
                      <p className="text-lg font-bold text-gray-900 mb-2">{item.english}</p>
                      <div className="grid md:grid-cols-2 gap-2">
                        <button onClick={() => speak(masculineWord)} className="text-left rounded-xl bg-cyan-50 hover:bg-cyan-100 p-3 transition-all duration-200">
                          <p className="font-semibold text-cyan-800">{masculinePart}</p>
                        </button>
                        <button onClick={() => speak(feminineWord)} className="text-left rounded-xl bg-cyan-50 hover:bg-cyan-100 p-3 transition-all duration-200">
                          <p className="font-semibold text-cyan-800">{femininePart}</p>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-emerald-50 border-l-4 border-emerald-400 rounded-r-xl p-4 mb-4">
                <h4 className="font-bold text-emerald-800 mb-2">✔ Why These Come Before the Noun</h4>
                <p className="text-sm text-emerald-800 mb-2">Most belong to the BAGS rule:</p>
                <ul className="text-sm text-emerald-800 space-y-1 list-disc list-inside">
                  <li>Beauty → beau, joli</li>
                  <li>Age → jeune, vieux, nouveau</li>
                  <li>Goodness → bon, mauvais, meilleur</li>
                  <li>Size → grand, petit</li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-4 mb-4">
                <h4 className="font-bold text-cyan-800 mb-2">Examples</h4>
                <div className="space-y-1 text-sm text-gray-800">
                  <button onClick={() => speak("un bon repas")} className="block text-left hover:text-cyan-700 transition-colors">un bon repas → a good meal</button>
                  <button onClick={() => speak("une jeune femme")} className="block text-left hover:text-cyan-700 transition-colors">une jeune femme → a young woman</button>
                  <button onClick={() => speak("un beau jardin")} className="block text-left hover:text-cyan-700 transition-colors">un beau jardin → a beautiful garden</button>
                  <button onClick={() => speak("un petit chat")} className="block text-left hover:text-cyan-700 transition-colors">un petit chat → a small cat</button>
                  <button onClick={() => speak("ma première voiture")} className="block text-left hover:text-cyan-700 transition-colors">ma première voiture → my first car</button>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-xl p-4">
                <h4 className="font-bold text-yellow-800 mb-2">⚠️ Special Forms (before vowel)</h4>
                <div className="space-y-1 text-sm text-yellow-800">
                  <button onClick={() => speak("bel homme")} className="block text-left hover:underline">Beau → bel homme</button>
                  <button onClick={() => speak("nouvel appartement")} className="block text-left hover:underline">Nouveau → nouvel appartement</button>
                  <button onClick={() => speak("vieil homme")} className="block text-left hover:underline">Vieux → vieil homme</button>
                </div>
              </div>
            </div>
          </>
          ) : learnMode === 'vocab' ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                French Vocabulary
              </h2>
              <p className="text-gray-600 mb-6 text-center">
                English first, French below. Click the sound button to hear pronunciation.
              </p>

              <SpeedControl
                currentSpeed={playbackSpeed}
                onSpeedChange={handleSpeedChange}
              />

              <div className="space-y-3">
                {vocabWords.map((word, index) => {
                  const isExpanded = expandedVocabIndex === index;
                  const example = getVocabExample(word.french, word.english);
                  return (
                    <div key={`${word.french}-${index}`} className="bg-white rounded-2xl shadow-md p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-lg font-bold text-gray-900 truncate">{word.english}</p>
                          <p className="text-sm text-blue-700 font-semibold truncate">{word.french}</p>
                        </div>
                        <button
                          onClick={() => speak(word.french)}
                          className="w-10 h-10 min-w-[40px] rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition-all duration-200 active:scale-95"
                          aria-label={`Play ${word.french}`}
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h1.536l4.033 3.796A.75.75 0 0010 16.25V3.75zM12.78 7.22a.75.75 0 10-1.06 1.06L13.44 10l-1.72 1.72a.75.75 0 101.06 1.06l2.25-2.25a.75.75 0 000-1.06l-2.25-2.25z" />
                          </svg>
                        </button>
                      </div>

                      <button
                        onClick={() => setExpandedVocabIndex(isExpanded ? null : index)}
                        className="mt-3 w-full text-left px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition-all duration-200"
                      >
                        {isExpanded ? 'Hide Example ▲' : 'See Example ▼'}
                      </button>

                      {isExpanded && (
                        <div className="mt-2 rounded-xl bg-blue-50 p-3 animate-fadeIn">
                          <p className="text-sm text-gray-800"><span className="font-bold">English:</span> {example.english}</p>
                          <p className="text-sm text-blue-800 mt-1"><span className="font-bold">French:</span> {example.french}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
          ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                French Prepositions
              </h2>
              <p className="text-gray-600 mb-6 text-center">
                Learn common prepositions. English meaning first, French below.
              </p>

              <SpeedControl
                currentSpeed={playbackSpeed}
                onSpeedChange={handleSpeedChange}
              />

              <div className="space-y-3">
                {prepositionsData.map((item, index) => {
                  const isExpanded = expandedPrepositionIndex === index;
                  const example = getPrepositionExample(item.french, item.english);
                  return (
                  <div key={`${item.french}-${index}`} className="bg-white rounded-2xl shadow-md p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-lg font-bold text-gray-900 truncate">{item.english}</p>
                        <p className="text-sm text-blue-700 font-semibold truncate">{item.french}</p>
                      </div>
                      <button
                        onClick={() => speak(item.french)}
                        className="w-10 h-10 min-w-[40px] rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition-all duration-200 active:scale-95"
                        aria-label={`Play ${item.french}`}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h1.536l4.033 3.796A.75.75 0 0010 16.25V3.75zM12.78 7.22a.75.75 0 10-1.06 1.06L13.44 10l-1.72 1.72a.75.75 0 101.06 1.06l2.25-2.25a.75.75 0 000-1.06l-2.25-2.25z" />
                        </svg>
                      </button>
                    </div>

                    <button
                      onClick={() => setExpandedPrepositionIndex(isExpanded ? null : index)}
                      className="mt-3 w-full text-left px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition-all duration-200"
                    >
                      {isExpanded ? 'Hide Example ▲' : 'See Example ▼'}
                    </button>

                    {isExpanded && (
                      <div className="mt-2 rounded-xl bg-blue-50 p-3 animate-fadeIn">
                        <p className="text-sm text-gray-800"><span className="font-bold">English:</span> {example.english}</p>
                        <p className="text-sm text-blue-800 mt-1"><span className="font-bold">French:</span> {example.french}</p>
                        <button
                          onClick={() => speak(example.french)}
                          className="mt-2 px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold transition-all duration-200"
                        >
                          ▶ Play French sentence
                        </button>
                      </div>
                    )}
                  </div>
                )})}
              </div>
            </div>
          </>
          )
        )}
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
