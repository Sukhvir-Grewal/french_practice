"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type QuestionWordsMode = "forms" | "examples" | "mixed";

interface QuestionWordsSetupProps {
  slug: string;
  title: string;
}

const QUESTION_WORDS_OPTIONS: Array<{ value: QuestionWordsMode; label: string }> = [
  { value: "forms", label: "Forms Only" },
  { value: "examples", label: "Examples Only" },
  { value: "mixed", label: "Mixed Practice" },
];

export function QuestionWordsSetup({ slug, title }: QuestionWordsSetupProps) {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<QuestionWordsMode>("forms");

  const handleStart = () => {
    const params = new URLSearchParams();
    params.set("questionWordsMode", selectedMode);
    router.push(`/deck/${slug}?${params.toString()}`);
  };

  return (
    <section className="numbersSetupCard" aria-label="Question words practice setup">
      <h2>{title} Setup</h2>
      <p>Choose what to practice before starting your session.</p>

      <div className="numbersRangeGrid">
        {QUESTION_WORDS_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={selectedMode === option.value ? "rangeOption active" : "rangeOption"}
            onClick={() => setSelectedMode(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <button type="button" className="primaryAction" onClick={handleStart}>
        Start Session
      </button>
    </section>
  );
}
