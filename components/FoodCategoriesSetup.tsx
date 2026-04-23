"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type FoodCategoryMode = "fruits" | "vegetables" | "dairy" | "desserts" | "other-foods" | "mixed";

interface FoodCategoriesSetupProps {
  slug: string;
  title: string;
}

const FOOD_CATEGORY_OPTIONS: Array<{ value: FoodCategoryMode; label: string }> = [
  { value: "fruits", label: "Fruits" },
  { value: "vegetables", label: "Vegetables" },
  { value: "dairy", label: "Dairy" },
  { value: "desserts", label: "Desserts" },
  { value: "other-foods", label: "Other Foods" },
  { value: "mixed", label: "Mixed Food Practice" },
];

export function FoodCategoriesSetup({ slug, title }: FoodCategoriesSetupProps) {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<FoodCategoryMode>("fruits");

  const handleStart = () => {
    const params = new URLSearchParams();
    params.set("foodCategoryMode", selectedMode);
    router.push(`/deck/${slug}?${params.toString()}`);
  };

  return (
    <section className="numbersSetupCard" aria-label="Food categories practice setup">
      <h2>{title} Setup</h2>
      <p>Choose what to practice before starting your session.</p>

      <div className="numbersRangeGrid">
        {FOOD_CATEGORY_OPTIONS.map((option) => (
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
