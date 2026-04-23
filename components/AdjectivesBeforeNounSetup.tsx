"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AdjectivesBeforeNounMode = "masculine" | "feminine" | "common" | "mixed";

interface AdjectivesBeforeNounSetupProps {
  slug: string;
  title: string;
}

const ADJECTIVES_BEFORE_NOUN_OPTIONS: Array<{ value: AdjectivesBeforeNounMode; label: string }> = [
  { value: "masculine", label: "Masculine Only" },
  { value: "feminine", label: "Feminine Only" },
  { value: "common", label: "Common Forms Only" },
  { value: "mixed", label: "Mixed Practice" },
];

export function AdjectivesBeforeNounSetup({ slug, title }: AdjectivesBeforeNounSetupProps) {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<AdjectivesBeforeNounMode>("masculine");

  const handleStart = () => {
    const params = new URLSearchParams();
    params.set("adjectivesBeforeNounMode", selectedMode);
    router.push(`/deck/${slug}?${params.toString()}`);
  };

  return (
    <section className="numbersSetupCard" aria-label="Adjectives before noun practice setup">
      <h2>{title} Setup</h2>
      <p>Choose what to practice before starting your session.</p>

      <div className="numbersRangeGrid">
        {ADJECTIVES_BEFORE_NOUN_OPTIONS.map((option) => (
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
