import Link from "next/link";

interface ResultsSummaryProps {
  totalCards: number;
  rightAnswers: number;
  wrongAnswers: number;
  elapsedSeconds: number;
  reviewAgainCount: number;
  accuracy: number;
  retryHref: string;
  retryIncorrectHref?: string;
}

function formatElapsed(elapsedSeconds: number): string {
  const minutes = Math.floor(elapsedSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (elapsedSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function ResultsSummary({
  totalCards,
  rightAnswers,
  wrongAnswers,
  elapsedSeconds,
  reviewAgainCount,
  accuracy,
  retryHref,
  retryIncorrectHref,
}: ResultsSummaryProps) {
  return (
    <section className="resultsCard" aria-label="Session summary">
      <h2>Session Complete</h2>
      <p className="resultsSubtitle">Good momentum. Keep your weak cards in rotation.</p>

      <div className="resultsGrid">
        <div>
          <span>Total Cards</span>
          <strong>{totalCards}</strong>
        </div>
        <div>
          <span>Right Answers</span>
          <strong>{rightAnswers}</strong>
        </div>
        <div>
          <span>Wrong Answers</span>
          <strong>{wrongAnswers}</strong>
        </div>
        <div>
          <span>Elapsed Time</span>
          <strong>{formatElapsed(elapsedSeconds)}</strong>
        </div>
        <div>
          <span>Review Again</span>
          <strong>{reviewAgainCount}</strong>
        </div>
        <div>
          <span>Accuracy</span>
          <strong>{accuracy}%</strong>
        </div>
      </div>

      <div className="resultsActions">
        <Link href={retryHref} className="primaryAction">
          Try Deck Again
        </Link>
        {retryIncorrectHref && (
          <Link href={retryIncorrectHref} className="secondaryAction">
            Retry Incorrect Only
          </Link>
        )}
        <Link href="/" className="secondaryAction">
          Back to Dashboard
        </Link>
      </div>
    </section>
  );
}
