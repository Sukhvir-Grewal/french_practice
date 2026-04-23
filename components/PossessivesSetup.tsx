"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type PossessiveMode = "core" | "examples" | "mixed";

interface PossessivesSetupProps {
  slug: string;
  title: string;
}

const POSSESSIVE_OPTIONS: Array<{ value: PossessiveMode; label: string }> = [
  { value: "core", label: "Core Possessives Only" },
  { value: "examples", label: "Example Phrases Only" },
  { value: "mixed", label: "Mixed Possessives Practice" },
];

export function PossessivesSetup({ slug, title }: PossessivesSetupProps) {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<PossessiveMode>("core");

  const handleStart = () => {
    const params = new URLSearchParams();
    params.set("possessiveMode", selectedMode);
    router.push(`/deck/${slug}?${params.toString()}`);
  };

  return (
    <section className="numbersSetupCard" aria-label="Possessive adjectives practice setup">
      <h2>{title} Setup</h2>
      <p>Choose what to practice before starting your session.</p>

      <div className="numbersRangeGrid">
        {POSSESSIVE_OPTIONS.map((option) => (
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
