interface WordItemProps {
  french: string;
  english: string;
  onSpeak?: () => void;
}

export default function WordItem({ french, english, onSpeak }: WordItemProps) {
  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition-all duration-200">
      <div className="flex-1 min-w-0 pr-3">
        <p className="text-xl font-bold text-gray-900 truncate">{french}</p>
        <p className="text-sm text-gray-600 truncate">{english}</p>
      </div>

      {/* Speaker Button Placeholder */}
      <button
        onClick={onSpeak}
        className="ml-2 w-12 h-12 min-w-[48px] flex-shrink-0 flex items-center justify-center bg-green-500 hover:bg-green-600 rounded-full transition-all duration-200 active:scale-90 shadow-md hover:shadow-lg"
        aria-label="Play pronunciation"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h1.536l4.033 3.796A.75.75 0 0010 16.25V3.75zM12.78 7.22a.75.75 0 10-1.06 1.06L13.44 10l-1.72 1.72a.75.75 0 101.06 1.06l2.25-2.25a.75.75 0 000-1.06l-2.25-2.25z" />
        </svg>
      </button>
    </div>
  );
}
