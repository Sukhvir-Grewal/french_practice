export interface NumberCoreEntry {
  number: number;
  french: string;
  english: string;
  pronunciation?: string;
}

export interface NumberPracticeRange {
  id: string;
  label: string;
  min: number;
  max: number;
}

export type NumberSessionSize = "10" | "20" | "full";

export interface NumberCoreData {
  deck: string;
  language: string;
  base: NumberCoreEntry[];
  ranges: NumberPracticeRange[];
}
