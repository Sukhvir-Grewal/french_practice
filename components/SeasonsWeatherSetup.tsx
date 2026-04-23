"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SeasonsWeatherMode = "seasons" | "weather" | "mixed";

interface SeasonsWeatherSetupProps {
  slug: string;
  title: string;
}

const SEASONS_WEATHER_OPTIONS: Array<{ value: SeasonsWeatherMode; label: string }> = [
  { value: "seasons", label: "Seasons Only" },
  { value: "weather", label: "Weather Only" },
  { value: "mixed", label: "Mixed Practice" },
];

export function SeasonsWeatherSetup({ slug, title }: SeasonsWeatherSetupProps) {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<SeasonsWeatherMode>("seasons");

  const handleStart = () => {
    const params = new URLSearchParams();
    params.set("seasonsWeatherMode", selectedMode);
    router.push(`/deck/${slug}?${params.toString()}`);
  };

  return (
    <section className="numbersSetupCard" aria-label="Seasons and weather practice setup">
      <h2>{title} Setup</h2>
      <p>Choose what to practice before starting your session.</p>

      <div className="numbersRangeGrid">
        {SEASONS_WEATHER_OPTIONS.map((option) => (
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
