"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type FamilyMode = "family-members" | "in-laws" | "relationship-status" | "mixed";

interface FamilySetupProps {
  slug: string;
  title: string;
}

const FAMILY_OPTIONS: Array<{ value: FamilyMode; label: string }> = [
  { value: "family-members", label: "Family Members" },
  { value: "in-laws", label: "In-Laws" },
  { value: "relationship-status", label: "Relationship Status" },
  { value: "mixed", label: "Mixed Practice" },
];

export function FamilySetup({ slug, title }: FamilySetupProps) {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<FamilyMode>("family-members");

  const handleStart = () => {
    const params = new URLSearchParams();
    params.set("familyMode", selectedMode);
    router.push(`/deck/${slug}?${params.toString()}`);
  };

  return (
    <section className="numbersSetupCard" aria-label="Family practice setup">
      <h2>{title} Setup</h2>
      <p>Choose what to practice before starting your session.</p>

      <div className="numbersRangeGrid">
        {FAMILY_OPTIONS.map((option) => (
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
