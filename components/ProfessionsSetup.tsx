"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ProfessionsMode = "questions" | "masculine" | "feminine" | "common" | "mixed";

interface ProfessionsSetupProps {
  slug: string;
  title: string;
}

const PROFESSIONS_OPTIONS: Array<{ value: ProfessionsMode; label: string }> = [
  { value: "questions", label: "Questions Only" },
  { value: "masculine", label: "Masculine Jobs Only" },
  { value: "feminine", label: "Feminine Jobs Only" },
  { value: "common", label: "Common-Gender Jobs Only" },
  { value: "mixed", label: "Mixed Professions Practice" },
];

export function ProfessionsSetup({ slug, title }: ProfessionsSetupProps) {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<ProfessionsMode>("questions");

  const handleStart = () => {
    const params = new URLSearchParams();
    params.set("professionsMode", selectedMode);
    router.push(`/deck/${slug}?${params.toString()}`);
  };

  return (
    <section className="numbersSetupCard" aria-label="Professions practice setup">
      <h2>{title} Setup</h2>
      <p>Choose what to practice before starting your session.</p>

      <div className="numbersRangeGrid">
        {PROFESSIONS_OPTIONS.map((option) => (
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
