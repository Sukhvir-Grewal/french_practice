import { promises as fs } from "node:fs";
import path from "node:path";
import type { FlashcardItem } from "@/types/flashcards";

type TimeMode = "words" | "examples" | "generated" | "mixed";

interface TimeCoreQuestion {
  english: string;
  french: string;
  pronunciation: string;
}

interface TimeCoreEntry {
  id: number;
  english: string;
  french: string;
  pronunciation: string;
}

interface TimeCoreFile {
  question?: TimeCoreQuestion;
  terms?: TimeCoreEntry[];
  examples?: TimeCoreEntry[];
}

const TIME_CORE_PATH = path.join(process.cwd(), "data", "time-core.json");

const HOUR_WORDS: string[] = [
  "zero",
  "une",
  "deux",
  "trois",
  "quatre",
  "cinq",
  "six",
  "sept",
  "huit",
  "neuf",
  "dix",
  "onze",
  "douze",
  "treize",
  "quatorze",
  "quinze",
  "seize",
  "dix-sept",
  "dix-huit",
  "dix-neuf",
  "vingt",
  "vingt et une",
  "vingt-deux",
  "vingt-trois",
  "vingt-quatre",
];

function padTime(value: number): string {
  return value.toString().padStart(2, "0");
}

function toFrenchNumber(value: number): string {
  if (value <= 24) {
    return HOUR_WORDS[value] ?? String(value);
  }

  if (value < 30) {
    return `vingt-${toFrenchNumber(value - 20)}`;
  }

  if (value === 30) {
    return "trente";
  }

  if (value < 40) {
    return value === 31 ? "trente et une" : `trente-${toFrenchNumber(value - 30)}`;
  }

  if (value === 40) {
    return "quarante";
  }

  if (value < 50) {
    return value === 41 ? "quarante et une" : `quarante-${toFrenchNumber(value - 40)}`;
  }

  if (value === 50) {
    return "cinquante";
  }

  return value === 51 ? "cinquante et une" : `cinquante-${toFrenchNumber(value - 50)}`;
}

function toFrenchHour(hour24: number): string {
  if (hour24 === 0) {
    return "minuit";
  }

  if (hour24 === 12) {
    return "midi";
  }

  return `${toFrenchNumber(hour24)} heure${hour24 > 1 ? "s" : ""}`;
}

function buildGeneratedCard(id: number, hour24: number, minute: number, pattern: number): FlashcardItem {
  const digital = `${padTime(hour24)}:${padTime(minute)}`;

  if (pattern === 0) {
    const french = `il est ${toFrenchHour(hour24)}`;
    return {
      id,
      category: "time-generated",
      english: digital,
      french,
      pronunciation: french,
      tags: ["time", "generated", "exact-hour"],
    };
  }

  if (pattern === 1) {
    const french = `il est ${toFrenchHour(hour24)} et demie`;
    return {
      id,
      category: "time-generated",
      english: digital,
      french,
      pronunciation: french,
      tags: ["time", "generated", "half-past"],
    };
  }

  if (pattern === 2) {
    const french = `il est ${toFrenchHour(hour24)} et quart`;
    return {
      id,
      category: "time-generated",
      english: digital,
      french,
      pronunciation: french,
      tags: ["time", "generated", "quarter-past"],
    };
  }

  if (pattern === 3) {
    const french = `il est ${toFrenchHour(hour24)} trois quarts`;
    return {
      id,
      category: "time-generated",
      english: digital,
      french,
      pronunciation: french,
      tags: ["time", "generated", "three-quarters"],
    };
  }

  if (pattern === 4) {
    const nextHour = (hour24 + 1) % 24;
    const french = `il est ${toFrenchHour(nextHour)} moins le quart`;
    return {
      id,
      category: "time-generated",
      english: digital,
      french,
      pronunciation: french,
      tags: ["time", "generated", "quarter-to"],
    };
  }

  const minuteWords = toFrenchNumber(minute);
  const french = `il est ${toFrenchHour(hour24)} ${minuteWords}`;
  return {
    id,
    category: "time-generated",
    english: digital,
    french,
    pronunciation: french,
    tags: ["time", "generated", "minute-based"],
  };
}

function randomInt(maxExclusive: number): number {
  return Math.floor(Math.random() * maxExclusive);
}

function generateClockCards(count: number, startId: number): FlashcardItem[] {
  const minuteOptions = [5, 10, 20, 25, 35, 40, 50, 55];
  const cards: FlashcardItem[] = [];

  for (let i = 0; i < count; i += 1) {
    const pattern = i % 6;
    const hour24 = randomInt(24);
    const minute =
      pattern === 0 ? 0 : pattern === 1 ? 30 : pattern === 2 ? 15 : pattern === 3 || pattern === 4 ? 45 : minuteOptions[randomInt(minuteOptions.length)];

    cards.push(buildGeneratedCard(startId + i, hour24, minute, pattern));
  }

  return cards;
}

function toQuestionCard(question: TimeCoreQuestion, id: number): FlashcardItem {
  return {
    id,
    category: "time-question",
    english: question.english,
    french: question.french,
    pronunciation: question.pronunciation,
    tags: ["time", "question"],
  };
}

function toTermCards(entries: TimeCoreEntry[]): FlashcardItem[] {
  return entries.map((entry) => ({
    id: 1000 + entry.id,
    category: "time-word",
    english: entry.english,
    french: entry.french,
    pronunciation: entry.pronunciation,
    tags: ["time", "word"],
  }));
}

function toExampleCards(entries: TimeCoreEntry[]): FlashcardItem[] {
  return entries.map((entry) => ({
    id: 2000 + entry.id,
    category: "time-example",
    english: entry.english,
    french: entry.french,
    pronunciation: entry.pronunciation,
    tags: ["time", "example"],
  }));
}

async function readTimeCore(): Promise<TimeCoreFile> {
  try {
    const file = await fs.readFile(TIME_CORE_PATH, "utf-8");
    const parsed = JSON.parse(file) as TimeCoreFile;
    return parsed ?? {};
  } catch {
    return {};
  }
}

export async function getTimeBaseCards(): Promise<FlashcardItem[]> {
  const core = await readTimeCore();
  const question = core.question ? [toQuestionCard(core.question, 900)] : [];
  const terms = Array.isArray(core.terms) ? toTermCards(core.terms) : [];
  const examples = Array.isArray(core.examples) ? toExampleCards(core.examples) : [];

  return [...question, ...terms, ...examples];
}

export async function getTimePracticeCards(mode: TimeMode): Promise<FlashcardItem[]> {
  const core = await readTimeCore();
  const questionCard = core.question ? [toQuestionCard(core.question, 900)] : [];
  const terms = Array.isArray(core.terms) ? toTermCards(core.terms) : [];
  const examples = Array.isArray(core.examples) ? toExampleCards(core.examples) : [];
  const generated = generateClockCards(24, 5000);

  if (mode === "words") {
    return [...questionCard, ...terms];
  }

  if (mode === "examples") {
    return [...questionCard, ...examples];
  }

  if (mode === "generated") {
    return [...questionCard, ...generated];
  }

  return [...questionCard, ...terms, ...examples, ...generated];
}
