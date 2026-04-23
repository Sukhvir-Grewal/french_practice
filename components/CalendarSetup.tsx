"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CalendarMode = "days" | "months" | "days-extra" | "days-question" | "months-question" | "mixed";

interface CalendarSetupProps {
  slug: string;
  title: string;
}

const CALENDAR_OPTIONS: Array<{ value: CalendarMode; label: string }> = [
  { value: "days", label: "Days Only" },
  { value: "months", label: "Months Only" },
  { value: "days-extra", label: "Days Extras" },
  { value: "days-question", label: "Days Question" },
  { value: "months-question", label: "Months Question" },
  { value: "mixed", label: "Mixed Calendar Practice" },
];

export function CalendarSetup({ slug, title }: CalendarSetupProps) {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<CalendarMode>("days");

  const handleStart = () => {
    const params = new URLSearchParams();
    params.set("calendarMode", selectedMode);
    router.push(`/deck/${slug}?${params.toString()}`);
  };

  return (
    <section className="numbersSetupCard" aria-label="Calendar practice setup">
      <h2>{title} Setup</h2>
      <p>Choose what to practice before starting your session.</p>

      <div className="numbersRangeGrid">
        {CALENDAR_OPTIONS.map((option) => (
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
