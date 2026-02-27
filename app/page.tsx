"use client";

import Link from "next/link";
import { getStats } from "@/lib/progress";
import { useState, useEffect } from "react";

export default function Home() {
  const [stats, setStats] = useState({ completedSounds: 0, totalSessions: 0, averageScore: 0 });

  useEffect(() => {
    setStats(getStats());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 py-12 sm:py-20">
        {/* Title */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-800 mb-4">
            French Sounds
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Master French Pronunciation
          </p>
         
        </div>

        {/* Stats Cards (if user has progress) */}
        {stats.totalSessions > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-8 animate-slideUp">
            <div className="bg-white rounded-2xl p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.completedSounds}</div>
              <div className="text-xs text-gray-600 mt-1">Sounds Learned</div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-green-600">{stats.totalSessions}</div>
              <div className="text-xs text-gray-600 mt-1">Practice Sessions</div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.averageScore}%</div>
              <div className="text-xs text-gray-600 mt-1">Avg Score</div>
            </div>
          </div>
        )}

        {/* Main Action Cards */}
        <div className="grid md:grid-cols-2 xl:grid-cols-12 gap-6 mb-8">
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <div className="text-center mb-5">
              <div className="text-5xl mb-3">🔊</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Sounds</h2>
              <p className="text-sm text-gray-600">Pronunciation patterns and listening</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <Link href="/learn?mode=sounds" className="text-center bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-4 rounded-xl font-semibold transition-all duration-200">Open Topic</Link>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6">
            <div className="text-center mb-5">
              <div className="text-5xl mb-3">📝</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Vocab</h2>
              <p className="text-sm text-gray-600">Common words with easy examples</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <Link href="/learn?mode=vocab" className="text-center bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-4 rounded-xl font-semibold transition-all duration-200">Open Topic</Link>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6">
            <div className="text-center mb-5">
              <div className="text-5xl mb-3">📌</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Preposition</h2>
              <p className="text-sm text-gray-600">Useful connectors for daily French</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <Link href="/learn?mode=prepositions" className="text-center bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-4 rounded-xl font-semibold transition-all duration-200">Open Topic</Link>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6">
            <div className="text-center mb-5">
              <div className="text-5xl mb-3">🔢</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Numbers</h2>
              <p className="text-sm text-gray-600">Counting patterns and number drills</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <Link href="/learn?mode=numbers" className="text-center bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-4 rounded-xl font-semibold transition-all duration-200">Open Topic</Link>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6">
            <div className="text-center mb-5">
              <div className="text-5xl mb-3">📅</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Days</h2>
              <p className="text-sm text-gray-600">Days of the week with simple drills</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <Link href="/learn?mode=days" className="text-center bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-4 rounded-xl font-semibold transition-all duration-200">Open Topic</Link>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6">
            <div className="text-center mb-5">
              <div className="text-5xl mb-3">🗓️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Months</h2>
              <p className="text-sm text-gray-600">Months of the year with simple drills</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <Link href="/learn?mode=months" className="text-center bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-4 rounded-xl font-semibold transition-all duration-200">Open Topic</Link>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6">
            <div className="text-center mb-5">
              <div className="text-5xl mb-3">🧩</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Possessive</h2>
              <p className="text-sm text-gray-600">mon/ma/mes, ton/ta/tes and more</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <Link href="/learn?mode=possessives" className="text-center bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-4 rounded-xl font-semibold transition-all duration-200">Open Topic</Link>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6">
            <div className="text-center mb-5">
              <div className="text-5xl mb-3">🗣️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Disjunctive</h2>
              <p className="text-sm text-gray-600">moi/toi/lui/elle/eux/elles</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <Link href="/learn?mode=disjunctive" className="text-center bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-4 rounded-xl font-semibold transition-all duration-200">Open Topic</Link>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6">
            <div className="text-center mb-5">
              <div className="text-5xl mb-3">🚶</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Aller</h2>
              <p className="text-sm text-gray-600">Present tense + à vs chez</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <Link href="/learn?mode=aller" className="text-center bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-4 rounded-xl font-semibold transition-all duration-200">Open Topic</Link>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6">
            <div className="text-center mb-5">
              <div className="text-5xl mb-3">🎨</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Colors</h2>
              <p className="text-sm text-gray-600">Les couleurs + agreement rules</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <Link href="/learn?mode=colors" className="text-center bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-4 rounded-xl font-semibold transition-all duration-200">Open Topic</Link>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6">
            <div className="text-center mb-5">
              <div className="text-5xl mb-3">Aa</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Adjectives</h2>
              <p className="text-sm text-gray-600">[m] and [f] common adjective forms</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <Link href="/learn?mode=adjectives" className="text-center bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-4 rounded-xl font-semibold transition-all duration-200">Open Topic</Link>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6">
            <div className="text-center mb-5">
              <div className="text-5xl mb-3">A+</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Adj After Noun</h2>
              <p className="text-sm text-gray-600">Personality & quality adjectives</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <Link href="/learn?mode=postadjectives" className="text-center bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-4 rounded-xl font-semibold transition-all duration-200">Open Topic</Link>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6">
            <div className="text-center mb-5">
              <div className="text-5xl mb-3">A-</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Adj Before Noun</h2>
              <p className="text-sm text-gray-600">BAGS adjectives and special forms</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <Link href="/learn?mode=preadjectives" className="text-center bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-4 rounded-xl font-semibold transition-all duration-200">Open Topic</Link>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-3 gap-4 text-center">
          <div className="bg-white/50 backdrop-blur rounded-2xl p-4">
            <div className="text-3xl mb-2">🔊</div>
            <div className="font-semibold text-gray-800">Audio Playback</div>
            <div className="text-xs text-gray-600 mt-1">Listen to native pronunciation</div>
          </div>
          <div className="bg-white/50 backdrop-blur rounded-2xl p-4">
            <div className="text-3xl mb-2">📊</div>
            <div className="font-semibold text-gray-800">Track Progress</div>
            <div className="text-xs text-gray-600 mt-1">Save your learning journey</div>
          </div>
          <div className="bg-white/50 backdrop-blur rounded-2xl p-4">
            <div className="text-3xl mb-2">⚡</div>
            <div className="font-semibold text-gray-800">Speed Control</div>
            <div className="text-xs text-gray-600 mt-1">Adjust playback speed</div>
          </div>
        </div>
      </div>
    </div>
  );
}

