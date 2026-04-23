"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type TimeMode = "words" | "examples" | "generated" | "mixed";

interface TimeSetupProps {
  slug: string;
  title: string;
}

const TIME_OPTIONS: Array<{ value: TimeMode; label: string }> = [
  { value: "words", label: "Time Words Only" },
  { value: "examples", label: "Fixed Examples" },
  { value: "generated", label: "Generated Clock Practice" },
  { value: "mixed", label: "Mixed Practice" },
];

export function TimeSetup({ slug, title }: TimeSetupProps) {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<TimeMode>("words");

  const handleStart = () => {
    const params = new URLSearchParams();
    params.set("timeMode", selectedMode);
    router.push(`/deck/${slug}?${params.toString()}`);
  };

  return (
    <section className="numbersSetupCard" aria-label="Time practice setup">
      <h2>{title} Setup</h2>
      <p>Choose what to practice before starting your session.</p>

      <div className="numbersRangeGrid">
        {TIME_OPTIONS.map((option) => (
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
