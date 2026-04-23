"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { buildNumbersDeck, getNumberPracticeRanges } from "@/lib/numbers";
import { StudySession } from "@/components/StudySession";
import { NumbersSetup } from "@/components/NumbersSetup";
import type { NumberSessionSize } from "@/types/numbers";

interface NumbersPracticeScreenProps {
  slug: string;
}

export function NumbersPracticeScreen({ slug }: NumbersPracticeScreenProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ranges = useMemo(() => getNumberPracticeRanges(), []);

  const rangeFromUrl = searchParams.get("range") ?? "";
  const sizeFromUrl = searchParams.get("size") as NumberSessionSize | null;
  const validSize: NumberSessionSize = sizeFromUrl === "10" || sizeFromUrl === "20" || sizeFromUrl === "full" ? sizeFromUrl : "10";
  const hasRangeFromUrl = ranges.some((range) => range.id === rangeFromUrl);
  const fallbackRangeId = ranges[0]?.id ?? "1-10";
  const initialRangeId = hasRangeFromUrl ? rangeFromUrl : fallbackRangeId;

  const [selectedRange, setSelectedRange] = useState<string>(initialRangeId);
  const [selectedSize, setSelectedSize] = useState<NumberSessionSize>(validSize);

  const configuredDeck = useMemo(() => {
    if (!hasRangeFromUrl) {
      return null;
    }
    return buildNumbersDeck(rangeFromUrl, validSize);
  }, [hasRangeFromUrl, rangeFromUrl, validSize]);

  const handleStart = () => {
    const params = new URLSearchParams();
    params.set("range", selectedRange);
    params.set("size", selectedSize);
    router.push(`/deck/${slug}?${params.toString()}`);
  };

  if (!configuredDeck) {
    return (
      <NumbersSetup
        ranges={ranges}
        selectedRangeId={selectedRange}
        selectedSize={selectedSize}
        onRangeChange={setSelectedRange}
        onSizeChange={setSelectedSize}
        onStart={handleStart}
      />
    );
  }

  return (
    <div className="numbersPracticeRoot">
      <button
        type="button"
        className="sizeOption"
        onClick={() => router.push(`/deck/${slug}`)}
      >
        Change Range
      </button>
      <StudySession
        deck={configuredDeck}
        defaultFrontLanguage="number"
        retryHref={`/deck/${slug}?range=${rangeFromUrl}&size=${validSize}`}
        enableRetryIncorrect={false}
      />
    </div>
  );
}
