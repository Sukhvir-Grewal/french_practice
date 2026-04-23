"use client";

import type { NumberPracticeRange, NumberSessionSize } from "@/types/numbers";

interface NumbersSetupProps {
  ranges: NumberPracticeRange[];
  selectedRangeId: string;
  selectedSize: NumberSessionSize;
  onRangeChange: (rangeId: string) => void;
  onSizeChange: (size: NumberSessionSize) => void;
  onStart: () => void;
}

export function NumbersSetup({
  ranges,
  selectedRangeId,
  selectedSize,
  onRangeChange,
  onSizeChange,
  onStart,
}: NumbersSetupProps) {
  return (
    <section className="numbersSetupCard" aria-label="Numbers practice setup">
      <h2>Choose Numbers Practice Range</h2>
      <p>Pick a range and session size, then start a randomized training round.</p>

      <div className="numbersRangeGrid">
        {ranges.map((range) => (
          <button
            key={range.id}
            type="button"
            className={selectedRangeId === range.id ? "rangeOption active" : "rangeOption"}
            onClick={() => onRangeChange(range.id)}
          >
            {range.label}
          </button>
        ))}
      </div>

      <div className="numbersSizeRow" role="group" aria-label="Session size">
        <button
          type="button"
          className={selectedSize === "10" ? "sizeOption active" : "sizeOption"}
          onClick={() => onSizeChange("10")}
        >
          10 Cards
        </button>
        <button
          type="button"
          className={selectedSize === "20" ? "sizeOption active" : "sizeOption"}
          onClick={() => onSizeChange("20")}
        >
          20 Cards
        </button>
        <button
          type="button"
          className={selectedSize === "full" ? "sizeOption active" : "sizeOption"}
          onClick={() => onSizeChange("full")}
        >
          Full Range
        </button>
      </div>

      <button type="button" className="primaryAction" onClick={onStart}>
        Start Session
      </button>
    </section>
  );
}
