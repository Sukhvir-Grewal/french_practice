import Link from "next/link";
import type { FrontLanguage, FrontLanguageOption } from "@/types/flashcards";

interface ProgressHeaderProps {
  elapsedSeconds: number;
  completed: number;
  total: number;
  frontLanguage: FrontLanguage;
  frontOptions: FrontLanguageOption[];
  onLanguageChange: (value: FrontLanguage) => void;
}

function formatElapsed(elapsedSeconds: number): string {
  const minutes = Math.floor(elapsedSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (elapsedSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function ProgressHeader({
  elapsedSeconds,
  completed,
  total,
  frontLanguage,
  frontOptions,
  onLanguageChange,
}: ProgressHeaderProps) {
  const percentage = total === 0 ? 0 : Math.min(100, Math.round((completed / total) * 100));

  return (
    <header className="progressHeader">
      <div className="topRow">
        <Link href="/" className="closeButton" aria-label="Close study session">
          Close
        </Link>
        <div className="timerPill">{formatElapsed(elapsedSeconds)}</div>
      </div>

      <div className="progressRow">
        <div className="progressTrack" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
          <div className="progressFill" style={{ width: `${percentage}%` }} />
        </div>
        <div className="progressMeta">
          {completed}/{total}
        </div>
      </div>

      <div className="languageToggle" role="group" aria-label="Card front language">
        {frontOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            className={frontLanguage === option.value ? "toggleButton active" : "toggleButton"}
            onClick={() => onLanguageChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </header>
  );
}
