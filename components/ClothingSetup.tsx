"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ClothingMode = "men" | "women" | "mixed";

interface ClothingSetupProps {
  slug: string;
  title: string;
}

const CLOTHING_OPTIONS: Array<{ value: ClothingMode; label: string }> = [
  { value: "men", label: "Men’s Clothing" },
  { value: "women", label: "Women’s Clothing" },
  { value: "mixed", label: "Mixed" },
];

export function ClothingSetup({ slug, title }: ClothingSetupProps) {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<ClothingMode>("men");

  const handleStart = () => {
    const params = new URLSearchParams();
    params.set("clothingMode", selectedMode);
    router.push(`/deck/${slug}?${params.toString()}`);
  };

  return (
    <section className="numbersSetupCard" aria-label="Clothing practice setup">
      <h2>{title} Setup</h2>
      <p>Choose what to practice before starting your session.</p>

      <div className="numbersRangeGrid">
        {CLOTHING_OPTIONS.map((option) => (
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
