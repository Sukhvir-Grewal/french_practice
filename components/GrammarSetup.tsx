"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type GrammarMode = "etre" | "avoir" | "demonstratives" | "aller" | "mixed";

interface GrammarSetupProps {
  slug: string;
  title: string;
}

const GRAMMAR_OPTIONS: Array<{ value: GrammarMode; label: string }> = [
  { value: "etre", label: "Etre Only" },
  { value: "avoir", label: "Avoir Only" },
  { value: "demonstratives", label: "Demonstratives Only" },
  { value: "aller", label: "Aller Only" },
  { value: "mixed", label: "Mixed Grammar Practice" },
];

export function GrammarSetup({ slug, title }: GrammarSetupProps) {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<GrammarMode>("etre");

  const handleStart = () => {
    const params = new URLSearchParams();
    params.set("grammarMode", selectedMode);
    router.push(`/deck/${slug}?${params.toString()}`);
  };

  return (
    <section className="numbersSetupCard" aria-label="Grammar basics practice setup">
      <h2>{title} Setup</h2>
      <p>Choose what to practice before starting your session.</p>

      <div className="numbersRangeGrid">
        {GRAMMAR_OPTIONS.map((option) => (
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
