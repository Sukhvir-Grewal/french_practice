"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AdjectivesMode = "masculine" | "feminine" | "common" | "shapes" | "mixed";

interface AdjectivesSetupProps {
  slug: string;
  title: string;
}

const ADJECTIVES_OPTIONS: Array<{ value: AdjectivesMode; label: string }> = [
  { value: "masculine", label: "Masculine Adjectives Only" },
  { value: "feminine", label: "Feminine Adjectives Only" },
  { value: "common", label: "Common Adjectives Only" },
  { value: "shapes", label: "Shapes Only" },
  { value: "mixed", label: "Mixed Adjectives Practice" },
];

export function AdjectivesSetup({ slug, title }: AdjectivesSetupProps) {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<AdjectivesMode>("masculine");

  const handleStart = () => {
    const params = new URLSearchParams();
    params.set("adjectivesMode", selectedMode);
    router.push(`/deck/${slug}?${params.toString()}`);
  };

  return (
    <section className="numbersSetupCard" aria-label="Adjectives practice setup">
      <h2>{title} Setup</h2>
      <p>Choose what to practice before starting your session.</p>

      <div className="numbersRangeGrid">
        {ADJECTIVES_OPTIONS.map((option) => (
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
