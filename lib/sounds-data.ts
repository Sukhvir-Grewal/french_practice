// TypeScript interfaces for French sound data

export interface Example {
  french: string;
  english: string;
}

export interface Sound {
  id: number;
  title: string;
  patterns: string[];
  phonetic?: string;
  phoneticSound: string; // The actual sound to pronounce in French
  examples: Example[];
  note?: string;
}

// All French sound categories with examples
export const soundsData: Sound[] = [
  {
    id: 1,
    title: "ô, au, eau",
    patterns: ["ô", "au", "eau"],
    phonetic: "/o/",
    phoneticSound: "eau",
    examples: [
      { french: "eau", english: "water" },
      { french: "jeune", english: "young" },
      { french: "bleu", english: "blue" },
      { french: "faux", english: "false" },
      { french: "homme", english: "man" },
      { french: "revoir", english: "goodbye" },
    ],
  },
  {
    id: 2,
    title: "an, am, en, em",
    patterns: ["an", "am", "en", "em"],
    phonetic: "/ã/",
    phoneticSound: "an",
    examples: [
      { french: "charmant", english: "charming" },
      { french: "vent", english: "wind" },
      { french: "langue", english: "language" },
    ],
  },
  {
    id: 3,
    title: "ch",
    patterns: ["ch"],
    phonetic: "/ʃ/",
    phoneticSound: "ch",
    examples: [
      { french: "chat", english: "cat" },
      { french: "chien", english: "dog" },
    ],
  },
  {
    id: 4,
    title: "ain, aim, ein, em, in, im, yn, ym",
    patterns: ["ain", "aim", "ein", "em", "in", "im", "yn", "ym"],
    phonetic: "/ɛ̃/",
    phoneticSound: "in",
    examples: [
      { french: "vin", english: "wine" },
      { french: "pain", english: "bread" },
      { french: "malin", english: "clever" },
      { french: "matin", english: "morning" },
    ],
  },
  {
    id: 5,
    title: "ui",
    patterns: ["ui"],
    phonetic: "/we/",
    phoneticSound: "oui",
    examples: [
      { french: "oui", english: "yes" },
      { french: "nuit", english: "night" },
    ],
  },
  {
    id: 6,
    title: "ou",
    patterns: ["ou"],
    phonetic: "/u/",
    phoneticSound: "ou",
    examples: [
      { french: "rouge", english: "red" },
      { french: "rue", english: "street" },
      { french: "où", english: "where" },
    ],
  },
  {
    id: 7,
    title: "on, om",
    patterns: ["on", "om"],
    phonetic: "/õ/",
    phoneticSound: "on",
    examples: [
      { french: "ronde", english: "round" },
      { french: "noma", english: "noel" },
    ],
  },
  {
    id: 8,
    title: "oi",
    patterns: ["oi"],
    phonetic: "/wa/",
    phoneticSound: "oi",
    examples: [
      { french: "poisson", english: "fish" },
      { french: "oiseau", english: "bird" },
    ],
    note: "Surrounded by two vowels, it becomes 2 sounds",
  },
];

// Core French prepositions for dedicated training
export const prepositionsData: Example[] = [
  { french: "à", english: "to, at" },
  { french: "avec", english: "with" },
  { french: "pour", english: "for" },
  { french: "dans", english: "in" },
  { french: "en", english: "in (countries)" },
  { french: "devant", english: "in front of" },
  { french: "derrière", english: "behind" },
  { french: "sous", english: "under" },
  { french: "sur", english: "on" },
  { french: "chez", english: "at someone’s place / house / office" },
  { french: "de", english: "of, from" },
  { french: "avant", english: "before" },
  { french: "par", english: "by" },
  { french: "pendant", english: "during" },
  { french: "depuis", english: "since" },
  { french: "vers", english: "towards" },
];

// Helper function to get all words for practice mode
export const getAllWords = (): Example[] => {
  return soundsData.flatMap((sound) => sound.examples);
};

const shuffleExamples = (items: Example[]): Example[] => {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const getUniqueExamples = (items: Example[]): Example[] => {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.french.toLowerCase()}|${item.english.toLowerCase()}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

// Helper function to get a specific sound by id
export const getSoundById = (id: number): Sound | undefined => {
  return soundsData.find((sound) => sound.id === id);
};

// Helper function to get random words
export const getRandomWords = (count: number): Example[] => {
  const allWords = getUniqueExamples(getAllWords());
  const shuffled = shuffleExamples(allWords);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Helper function to get random prepositions for preposition practice mode
export const getRandomPrepositions = (count: number): Example[] => {
  const uniquePrepositions = getUniqueExamples(prepositionsData);
  const shuffled = shuffleExamples(uniquePrepositions);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Numbers data for counting practice
export interface NumberData {
  number: number;
  french: string;
  category: 'basic' | 'tens' | 'special';
}

export const numbersData: NumberData[] = [
  // 1-20 (basic counting)
  { number: 1, french: "un", category: 'basic' },
  { number: 2, french: "deux", category: 'basic' },
  { number: 3, french: "trois", category: 'basic' },
  { number: 4, french: "quatre", category: 'basic' },
  { number: 5, french: "cinq", category: 'basic' },
  { number: 6, french: "six", category: 'basic' },
  { number: 7, french: "sept", category: 'basic' },
  { number: 8, french: "huit", category: 'basic' },
  { number: 9, french: "neuf", category: 'basic' },
  { number: 10, french: "dix", category: 'basic' },
  { number: 11, french: "onze", category: 'basic' },
  { number: 12, french: "douze", category: 'basic' },
  { number: 13, french: "treize", category: 'basic' },
  { number: 14, french: "quatorze", category: 'basic' },
  { number: 15, french: "quinze", category: 'basic' },
  { number: 16, french: "seize", category: 'basic' },
  { number: 17, french: "dix-sept", category: 'basic' },
  { number: 18, french: "dix-huit", category: 'basic' },
  { number: 19, french: "dix-neuf", category: 'basic' },
  { number: 20, french: "vingt", category: 'basic' },
  // Key tens
  { number: 30, french: "trente", category: 'tens' },
  { number: 40, french: "quarante", category: 'tens' },
  { number: 50, french: "cinquante", category: 'tens' },
  { number: 60, french: "soixante", category: 'tens' },
  { number: 70, french: "soixante-dix", category: 'tens' },
  { number: 80, french: "quatre-vingts", category: 'tens' },
  { number: 90, french: "quatre-vingt-dix", category: 'tens' },
  { number: 100, french: "cent", category: 'special' },
  { number: 1000, french: "mille", category: 'special' },
];

// Generate number for a specific range
export const generateNumberInRange = (min: number, max: number): { number: number; french: string } => {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return { number: num, french: convertNumberToFrench(num) };
};

// Convert number to French (simplified for common ranges)
export const convertNumberToFrench = (num: number): string => {
  // Find exact match first
  const exact = numbersData.find(n => n.number === num);
  if (exact) return exact.french;
  
  // For numbers not in our base list, construct them
  if (num >= 1 && num <= 20) {
    return numbersData.find(n => n.number === num)?.french || num.toString();
  }
  
  if (num >= 21 && num <= 69) {
    const tens = Math.floor(num / 10) * 10;
    const ones = num % 10;
    const tensWord = numbersData.find(n => n.number === tens)?.french;
    const onesWord = ones > 0 ? numbersData.find(n => n.number === ones)?.french : '';
    if (ones === 1 && tens !== 10) {
      return `${tensWord}-et-un`;
    }
    return ones > 0 ? `${tensWord}-${onesWord}` : tensWord || num.toString();
  }
  
  if (num >= 70 && num <= 79) {
    const ones = num - 60;
    const onesWord = numbersData.find(n => n.number === ones)?.french || convertNumberToFrench(ones);
    return `soixante-${onesWord}`;
  }
  
  if (num >= 80 && num <= 99) {
    if (num === 80) return "quatre-vingts";
    const ones = num - 80;
    const onesWord = numbersData.find(n => n.number === ones)?.french || convertNumberToFrench(ones);
    return `quatre-vingt-${onesWord}`;
  }
  
  if (num >= 100 && num < 200) {
    const remainder = num - 100;
    if (remainder === 0) return "cent";
    return `cent ${convertNumberToFrench(remainder)}`;
  }
  
  if (num >= 200 && num < 1000) {
    const hundreds = Math.floor(num / 100);
    const remainder = num % 100;
    const hundredsWord = numbersData.find(n => n.number === hundreds)?.french;
    if (remainder === 0) return `${hundredsWord} cents`;
    return `${hundredsWord} cent ${convertNumberToFrench(remainder)}`;
  }
  
  return num.toString();
};

export const numberRanges = [
  { label: '1-10', min: 1, max: 10 },
  { label: '1-20', min: 1, max: 20 },
  { label: '21-50', min: 21, max: 50 },
  { label: '51-100', min: 51, max: 100 },
  { label: '100-200', min: 100, max: 200 },
];
