"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AdjectivesAfterNounMode = "masculine" | "feminine" | "mixed";

interface AdjectivesAfterNounSetupProps {
  slug: string;
  title: string;
}

const ADJECTIVES_AFTER_NOUN_OPTIONS: Array<{ value: AdjectivesAfterNounMode; label: string }> = [
  { value: "masculine", label: "Masculine Only" },
  { value: "feminine", label: "Feminine Only" },
  { value: "mixed", label: "Mixed Practice" },
];

export function AdjectivesAfterNounSetup({ slug, title }: AdjectivesAfterNounSetupProps) {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<AdjectivesAfterNounMode>("masculine");

  const handleStart = () => {
    const params = new URLSearchParams();
    params.set("adjectivesAfterNounMode", selectedMode);
    router.push(`/deck/${slug}?${params.toString()}`);
  };

  return (
    <section className="numbersSetupCard" aria-label="Adjectives after noun practice setup">
      <h2>{title} Setup</h2>
      <p>Choose what to practice before starting your session.</p>

      <div className="numbersRangeGrid">
        {ADJECTIVES_AFTER_NOUN_OPTIONS.map((option) => (
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
