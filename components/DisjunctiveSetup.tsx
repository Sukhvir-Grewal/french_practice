"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DisjunctiveMode = "disjunctive-only" | "comparison" | "mixed";

interface DisjunctiveSetupProps {
  slug: string;
  title: string;
}

const DISJUNCTIVE_OPTIONS: Array<{ value: DisjunctiveMode; label: string }> = [
  { value: "disjunctive-only", label: "Disjunctive Pronouns Only" },
  { value: "comparison", label: "Subject vs Disjunctive Comparison" },
  { value: "mixed", label: "Mixed Pronoun Practice" },
];

export function DisjunctiveSetup({ slug, title }: DisjunctiveSetupProps) {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<DisjunctiveMode>("disjunctive-only");

  const handleStart = () => {
    const params = new URLSearchParams();
    params.set("disjunctiveMode", selectedMode);
    router.push(`/deck/${slug}?${params.toString()}`);
  };

  return (
    <section className="numbersSetupCard" aria-label="Disjunctive pronouns practice setup">
      <h2>{title} Setup</h2>
      <p>Choose what to practice before starting your session.</p>

      <div className="numbersRangeGrid">
        {DISJUNCTIVE_OPTIONS.map((option) => (
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
