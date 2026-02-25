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
            🇫🇷 French Sounds
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Master French Pronunciation
          </p>
          <p className="text-sm text-gray-500">
            Learn sounds and train vocabulary + prepositions with interactive practice
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
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {/* Learn Sounds Card */}
          <Link href="/learn">
            <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group">
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                  📚
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">
                  Learn Sounds
                </h2>
                <p className="text-gray-600 mb-6">
                  Browse French sound categories with examples and pronunciations
                </p>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-2xl font-bold text-lg group-hover:from-blue-600 group-hover:to-blue-700 transition-all">
                  Start Learning →
                </div>
              </div>
            </div>
          </Link>

          {/* Practice Words Card */}
          <Link href="/practice?mode=words">
            <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group">
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                  📝
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">
                  Practice Words
                </h2>
                <p className="text-gray-600 mb-6">
                  Test yourself with random French words and translations
                </p>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-2xl font-bold text-lg group-hover:from-green-600 group-hover:to-green-700 transition-all">
                  Train Words →
                </div>
              </div>
            </div>
          </Link>

          {/* Practice Sounds Card */}
          <Link href="/practice?mode=sounds">
            <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group">
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                  🔊
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">
                  Practice Sounds
                </h2>
                <p className="text-gray-600 mb-6">
                  Focus only on sound recognition in a separate practice flow
                </p>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 px-6 rounded-2xl font-bold text-lg group-hover:from-purple-600 group-hover:to-purple-700 transition-all">
                  Train Sounds →
                </div>
              </div>
            </div>
          </Link>

          {/* Prepositions Training Card */}
          <Link href="/practice?mode=prepositions">
            <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group">
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                  📌
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">
                  Train Prepositions
                </h2>
                <p className="text-gray-600 mb-6">
                  Practice essential French prepositions with fast recall drills
                </p>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 rounded-2xl font-bold text-lg group-hover:from-orange-600 group-hover:to-orange-700 transition-all">
                  Start Prepositions →
                </div>
              </div>
            </div>
          </Link>
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

