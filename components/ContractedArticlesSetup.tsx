"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ContractedArticlesMode = "de" | "a" | "examples" | "mixed";

interface ContractedArticlesSetupProps {
  slug: string;
  title: string;
}

const CONTRACTED_ARTICLES_OPTIONS: Array<{ value: ContractedArticlesMode; label: string }> = [
  { value: "de", label: "De Forms Only" },
  { value: "a", label: "A Forms Only" },
  { value: "examples", label: "Examples Only" },
  { value: "mixed", label: "Mixed Contracted Articles Practice" },
];

export function ContractedArticlesSetup({ slug, title }: ContractedArticlesSetupProps) {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<ContractedArticlesMode>("de");

  const handleStart = () => {
    const params = new URLSearchParams();
    params.set("contractedArticlesMode", selectedMode);
    router.push(`/deck/${slug}?${params.toString()}`);
  };

  return (
    <section className="numbersSetupCard" aria-label="Contracted articles practice setup">
      <h2>{title} Setup</h2>
      <p>Choose what to practice before starting your session.</p>

      <div className="numbersRangeGrid">
        {CONTRACTED_ARTICLES_OPTIONS.map((option) => (
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
