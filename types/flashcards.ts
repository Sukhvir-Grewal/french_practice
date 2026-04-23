export interface FlashcardItem {
  id: number;
  category?: string;
  english: string;
  french: string;
  pronunciation?: string;
  literalMeaning?: string;
  secondaryFrench?: string;
  secondaryPronunciation?: string;
  tertiaryFrench?: string;
  tertiaryPronunciation?: string;
  audio?: string;
  tags?: string[];
  numericValue?: number;
  kind?: "standard" | "sound";
  soundPattern?: string;
  soundHint?: string;
  soundExamples?: Array<{
    french: string;
    english: string;
  }>;
}

export interface DeckMeta {
  slug: string;
  title: string;
  category: string;
  cardCount: number;
}

export interface DeckData extends DeckMeta {
  cards: FlashcardItem[];
}

export type FrontLanguage = "english" | "french" | "number";

export interface FrontLanguageOption {
  value: FrontLanguage;
  label: string;
}
