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
