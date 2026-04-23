import numbersCore from "@/data/numbers-core.json";
import type { DeckData, FlashcardItem } from "@/types/flashcards";
import type { NumberCoreData, NumberPracticeRange, NumberSessionSize } from "@/types/numbers";

const coreData = numbersCore as NumberCoreData;
const baseMap = new Map(coreData.base.map((entry) => [entry.number, entry]));

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getBaseFrench(value: number): string {
  const fromBase = baseMap.get(value)?.french;
  if (!fromBase) {
    throw new Error(`Missing base French value for ${value}`);
  }
  return fromBase;
}

function numberToFrenchUnder100(value: number): string {
  if (value <= 20) {
    return getBaseFrench(value);
  }

  if (value < 70) {
    const tens = Math.floor(value / 10) * 10;
    const ones = value % 10;
    const tensWord = getBaseFrench(tens);

    if (ones === 0) {
      return tensWord;
    }

    if (ones === 1) {
      return `${tensWord} et un`;
    }

    return `${tensWord}-${numberToFrenchUnder100(ones)}`;
  }

  if (value < 80) {
    const remainder = value - 60;
    if (remainder === 11) {
      return "soixante et onze";
    }
    return `soixante-${numberToFrenchUnder100(remainder)}`;
  }

  if (value === 80) {
    return "quatre-vingts";
  }

  const remainder = value - 80;
  if (remainder === 1) {
    return "quatre-vingt-un";
  }

  return `quatre-vingt-${numberToFrenchUnder100(remainder)}`;
}

function numberToEnglishUnder100(value: number): string {
  const fromBase = baseMap.get(value)?.english;
  if (fromBase) {
    return fromBase;
  }

  const tensWordMap: Record<number, string> = {
    20: "twenty",
    30: "thirty",
    40: "forty",
    50: "fifty",
    60: "sixty",
    70: "seventy",
    80: "eighty",
    90: "ninety",
  };

  const tens = Math.floor(value / 10) * 10;
  const ones = value % 10;

  if (ones === 0) {
    return tensWordMap[tens] ?? String(value);
  }

  return `${tensWordMap[tens] ?? String(tens)}-${numberToEnglishUnder100(ones)}`;
}

export function numberToFrench(value: number): string {
  if (!Number.isInteger(value) || value < 0 || value > 1000) {
    throw new Error("numberToFrench supports integers from 0 to 1000.");
  }

  if (value <= 99) {
    return numberToFrenchUnder100(value);
  }

  if (value === 100) {
    return "cent";
  }

  if (value < 200) {
    return `cent ${numberToFrenchUnder100(value - 100)}`;
  }

  if (value < 1000) {
    const hundreds = Math.floor(value / 100);
    const remainder = value % 100;
    const hundredPrefix = numberToFrenchUnder100(hundreds);

    if (remainder === 0) {
      return `${hundredPrefix} cents`;
    }

    return `${hundredPrefix} cent ${numberToFrenchUnder100(remainder)}`;
  }

  return "mille";
}

export function numberToEnglish(value: number): string {
  if (!Number.isInteger(value) || value < 0 || value > 1000) {
    throw new Error("numberToEnglish supports integers from 0 to 1000.");
  }

  if (value <= 99) {
    return numberToEnglishUnder100(value);
  }

  if (value === 100) {
    return "one hundred";
  }

  if (value < 1000) {
    const hundreds = Math.floor(value / 100);
    const remainder = value % 100;

    if (remainder === 0) {
      return `${numberToEnglishUnder100(hundreds)} hundred`;
    }

    return `${numberToEnglishUnder100(hundreds)} hundred ${numberToEnglishUnder100(remainder)}`;
  }

  return "one thousand";
}

export function getNumberPracticeRanges(): NumberPracticeRange[] {
  return [...coreData.ranges];
}

export function getNumberPracticeRangeById(rangeId: string): NumberPracticeRange | null {
  return coreData.ranges.find((range) => range.id === rangeId) ?? null;
}

export function resolveSessionCardCount(range: NumberPracticeRange, size: NumberSessionSize): number {
  const rangeCount = range.max - range.min + 1;
  if (size === "full") {
    return rangeCount;
  }

  const parsed = Number.parseInt(size, 10);
  if (Number.isNaN(parsed)) {
    return Math.min(10, rangeCount);
  }

  return Math.max(1, Math.min(parsed, rangeCount));
}

export function buildNumbersDeck(rangeId: string, size: NumberSessionSize): DeckData | null {
  const range = getNumberPracticeRangeById(rangeId);
  if (!range) {
    return null;
  }

  const allNumbers = Array.from({ length: range.max - range.min + 1 }, (_, index) => range.min + index);
  const count = resolveSessionCardCount(range, size);
  const chosen = shuffle(allNumbers).slice(0, count);

  const cards: FlashcardItem[] = chosen.map((value, index) => {
    const basePronunciation = baseMap.get(value)?.pronunciation;

    return {
      id: index + 1,
      english: numberToEnglish(value),
      french: numberToFrench(value),
      pronunciation: basePronunciation ?? numberToFrench(value),
      audio: "",
      tags: ["numbers"],
      numericValue: value,
    };
  });

  return {
    slug: "numbers",
    title: `Numbers ${range.label}`,
    category: "numbers",
    cardCount: cards.length,
    cards,
  };
}
