interface SoundCardProps {
  title: string;
  phonetic?: string;
  patterns: string[];
  children?: React.ReactNode;
}

export default function SoundCard({
  title,
  phonetic,
  patterns,
  children,
}: SoundCardProps) {
  return (
    <div className="w-full bg-white rounded-3xl shadow-xl p-6 mb-4 animate-scaleIn">
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
        {phonetic && (
          <div className="text-2xl text-blue-600 font-semibold mb-3">
            {phonetic}
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {patterns.map((pattern, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
            >
              {pattern}
            </span>
          ))}
        </div>
      </div>

      {/* Examples Section */}
      <div className="space-y-3">{children}</div>
    </div>
  );
}
