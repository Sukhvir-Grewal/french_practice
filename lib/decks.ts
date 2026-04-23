import { promises as fs } from "node:fs";
import path from "node:path";
import type { DeckData, DeckMeta, FlashcardItem } from "@/types/flashcards";
import { getNumberPracticeRanges } from "@/lib/numbers";
import { getTimeBaseCards } from "@/lib/timePractice";

const DATA_DIR = path.join(process.cwd(), "data");

interface SoundDeckEntry {
  id?: number;
  pattern?: string;
  soundHint?: string;
  tags?: string[];
  examples?: Array<{
    french?: string;
    english?: string;
  }>;
}

interface NationalityPronunciation {
  country?: string;
  masc?: string;
  fem?: string;
}

interface NationalityCardEntry {
  id?: number;
  category?: string;
  english?: string;
  french?: string;
  literalMeaning?: string;
  audio?: string;
  tags?: string[];
  englishCountry?: string;
  frenchCountry?: string;
  nationalityMasc?: string;
  nationalityFem?: string;
  pronunciation?: string | NationalityPronunciation;
}

const TITLE_OVERRIDES: Record<string, string> = {
  "adjectives-after-noun": "Adjectives After the Noun",
  "adjectives-before-noun": "Adjectives Before the Noun",
  "expressions-avoir-etre": "Expressions with Avoir & Etre",
  family: "Family & Relationships",
  "home-furniture": "Home & Furniture",
  "seasons-weather": "Seasons & Weather",
  time: "Time",
};

function titleFromSlug(slug: string): string {
  const override = TITLE_OVERRIDES[slug];
  if (override) {
    return override;
  }

  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizeCard(card: Partial<FlashcardItem>, index: number): FlashcardItem {
  const typedCard = card as NationalityCardEntry;
  const pronunciation = typedCard.pronunciation;
  const pronunciationObject =
    typeof pronunciation === "object" && pronunciation !== null ? (pronunciation as NationalityPronunciation) : undefined;

  const englishFromCountry = typeof typedCard.englishCountry === "string" ? typedCard.englishCountry : "";
  const frenchCountry = typeof typedCard.frenchCountry === "string" ? typedCard.frenchCountry : "";
  const mascNationality = typeof typedCard.nationalityMasc === "string" ? typedCard.nationalityMasc : "";
  const femNationality = typeof typedCard.nationalityFem === "string" ? typedCard.nationalityFem : "";

  return {
    id: typeof typedCard.id === "number" ? typedCard.id : index + 1,
    category: typeof typedCard.category === "string" ? typedCard.category : "",
    english: typeof typedCard.english === "string" ? typedCard.english : englishFromCountry,
    french: typeof typedCard.french === "string" ? typedCard.french : frenchCountry,
    pronunciation:
      typeof pronunciation === "string"
        ? pronunciation
        : typeof pronunciationObject?.country === "string"
          ? pronunciationObject.country
          : "",
    literalMeaning: typeof typedCard.literalMeaning === "string" ? typedCard.literalMeaning : "",
    secondaryFrench: mascNationality,
    secondaryPronunciation: typeof pronunciationObject?.masc === "string" ? pronunciationObject.masc : "",
    tertiaryFrench: femNationality,
    tertiaryPronunciation: typeof pronunciationObject?.fem === "string" ? pronunciationObject.fem : "",
    audio: typeof typedCard.audio === "string" ? typedCard.audio : "",
    tags: Array.isArray(typedCard.tags) ? typedCard.tags.filter((item): item is string => typeof item === "string") : [],
  };
}

function normalizeSoundCard(card: SoundDeckEntry, index: number): FlashcardItem {
  const pattern = typeof card.pattern === "string" ? card.pattern.trim() : "";
  const hint = typeof card.soundHint === "string" ? card.soundHint.trim() : "";
  const tags = Array.isArray(card.tags) ? card.tags.filter((item): item is string => typeof item === "string") : [];
  const examples = Array.isArray(card.examples)
    ? card.examples
        .map((entry) => ({
          french: typeof entry.french === "string" ? entry.french.trim() : "",
          english: typeof entry.english === "string" ? entry.english.trim() : "",
        }))
        .filter((entry) => entry.french.length > 0 && entry.english.length > 0)
    : [];

  return {
    id: typeof card.id === "number" ? card.id : index + 1,
    english: pattern,
    french: hint,
    pronunciation: hint || pattern,
    audio: "",
    tags,
    kind: "sound",
    soundPattern: pattern,
    soundHint: hint,
    soundExamples: examples,
  };
}

async function readDeckCards(slug: string): Promise<FlashcardItem[] | null> {
  if (slug === "time") {
    const cards = await getTimeBaseCards();
    return cards.length > 0 ? cards : null;
  }

  try {
    const filePath = path.join(DATA_DIR, `${slug}.json`);
    const file = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(file) as unknown;

    if (!Array.isArray(parsed)) {
      return null;
    }

    if (slug === "sounds") {
      return parsed
        .map((item, index) => normalizeSoundCard((item ?? {}) as SoundDeckEntry, index))
        .filter((item) => item.soundPattern && item.soundHint && (item.soundExamples?.length ?? 0) > 0);
    }

    return parsed
      .map((item, index) => normalizeCard((item ?? {}) as Partial<FlashcardItem>, index))
      .filter((item) => item.english.length > 0 && item.french.length > 0);
  } catch {
    return null;
  }
}

export async function getAvailableDecks(): Promise<DeckMeta[]> {
  const entries = await fs.readdir(DATA_DIR, { withFileTypes: true });
  const jsonFiles = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".json"));

  const deckMeta = await Promise.all(
    jsonFiles.map(async (file) => {
      const fileSlug = file.name.replace(/\.json$/i, "");
      const slug = fileSlug === "time-core" ? "time" : fileSlug;
      const cards = await readDeckCards(slug);

      if (!cards || cards.length === 0) {
        return null;
      }

      return {
        slug,
        title: titleFromSlug(slug),
        category: slug === "sounds" ? "sounds" : cards[0]?.tags?.[0] ?? "vocabulary",
        cardCount: cards.length,
      } satisfies DeckMeta;
    }),
  );

  const dedupedDecks = new Map<string, DeckMeta>();
  deckMeta
    .filter((deck): deck is DeckMeta => deck !== null)
    .forEach((deck) => {
      if (!dedupedDecks.has(deck.slug)) {
        dedupedDecks.set(deck.slug, deck);
      }
    });

  const cleanedDecks = [...dedupedDecks.values()];
  const hasNumbersDeck = cleanedDecks.some((deck) => deck.slug === "numbers");

  if (!hasNumbersDeck) {
    const ranges = getNumberPracticeRanges();
    const maxRange = ranges.reduce((max, range) => Math.max(max, range.max), 0);
    cleanedDecks.push({
      slug: "numbers",
      title: "Numbers",
      category: "numbers",
      cardCount: maxRange,
    });
  }

  return cleanedDecks.sort((a, b) => a.title.localeCompare(b.title));
}

export async function getDeckBySlug(slug: string): Promise<DeckData | null> {
  if (slug === "numbers") {
    return {
      slug: "numbers",
      title: "Numbers",
      category: "numbers",
      cardCount: 1000,
      cards: [],
    };
  }

  const cards = await readDeckCards(slug);

  if (!cards || cards.length === 0) {
    return null;
  }

  return {
    slug,
    title: titleFromSlug(slug),
    category: slug === "sounds" ? "sounds" : cards[0]?.tags?.[0] ?? "vocabulary",
    cardCount: cards.length,
    cards,
  };
}
