"use client";

import { useRouter } from "next/navigation";

interface ColorsSetupProps {
  slug: string;
  title: string;
}

export function ColorsSetup({ slug, title }: ColorsSetupProps) {
  const router = useRouter();

  const handleStart = () => {
    const params = new URLSearchParams();
    params.set("colorsMode", "full");
    router.push(`/deck/${slug}?${params.toString()}`);
  };

  return (
    <section className="numbersSetupCard" aria-label="Colors practice setup">
      <h2>{title} Setup</h2>
      <p>Start a full colors practice session.</p>

      <div className="numbersRangeGrid">
        <button type="button" className="rangeOption active" onClick={handleStart}>
          Full Colors Practice
        </button>
      </div>

      <button type="button" className="primaryAction" onClick={handleStart}>
        Start Session
      </button>
    </section>
  );
}
