'use client';

interface PracticeModeSelectorProps {
  selectedMode: 'words' | 'sounds' | 'prepositions';
  onModeChange: (mode: 'words' | 'sounds' | 'prepositions') => void;
}

export default function PracticeModeSelector({ selectedMode, onModeChange }: PracticeModeSelectorProps) {
  return (
    <div className="w-full md:w-auto bg-white rounded-2xl md:rounded-3xl p-1.5 md:p-2 shadow-lg inline-flex gap-1.5 md:gap-2 flex-wrap justify-center">
      <button
        onClick={() => onModeChange('words')}
        className={`px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl font-bold text-sm md:text-base transition-all duration-200 ${
          selectedMode === 'words'
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
            : 'bg-transparent text-gray-600 hover:bg-gray-100'
        }`}
      >
        📝 Practice Words
      </button>
      <button
        onClick={() => onModeChange('sounds')}
        className={`px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl font-bold text-sm md:text-base transition-all duration-200 ${
          selectedMode === 'sounds'
            ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
            : 'bg-transparent text-gray-600 hover:bg-gray-100'
        }`}
      >
        🔊 Practice Sounds
      </button>
      <button
        onClick={() => onModeChange('prepositions')}
        className={`px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl font-bold text-sm md:text-base transition-all duration-200 ${
          selectedMode === 'prepositions'
            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
            : 'bg-transparent text-gray-600 hover:bg-gray-100'
        }`}
      >
        📌 Practice Prepositions
      </button>
    </div>
  );
}
