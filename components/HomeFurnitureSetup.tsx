"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type HomeFurnitureMode = "house" | "kitchen" | "dining" | "bedroom" | "mixed";

interface HomeFurnitureSetupProps {
  slug: string;
  title: string;
}

const HOME_FURNITURE_OPTIONS: Array<{ value: HomeFurnitureMode; label: string }> = [
  { value: "house", label: "House Basics" },
  { value: "kitchen", label: "Kitchen" },
  { value: "dining", label: "Dining Room" },
  { value: "bedroom", label: "Bedroom" },
  { value: "mixed", label: "Mixed Home Practice" },
];

export function HomeFurnitureSetup({ slug, title }: HomeFurnitureSetupProps) {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<HomeFurnitureMode>("house");

  const handleStart = () => {
    const params = new URLSearchParams();
    params.set("homeFurnitureMode", selectedMode);
    router.push(`/deck/${slug}?${params.toString()}`);
  };

  return (
    <section className="numbersSetupCard" aria-label="Home and furniture practice setup">
      <h2>{title} Setup</h2>
      <p>Choose what to practice before starting your session.</p>

      <div className="numbersRangeGrid">
        {HOME_FURNITURE_OPTIONS.map((option) => (
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
