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

// French days of the week for learn/practice
export const daysOfWeekData: Example[] = [
  { french: "lundi", english: "Monday" },
  { french: "mardi", english: "Tuesday" },
  { french: "mercredi", english: "Wednesday" },
  { french: "jeudi", english: "Thursday" },
  { french: "vendredi", english: "Friday" },
  { french: "samedi", english: "Saturday" },
  { french: "dimanche", english: "Sunday" },
];

// French months of the year for learn/practice
export const monthsOfYearData: Example[] = [
  { french: "janvier", english: "January" },
  { french: "février", english: "February" },
  { french: "mars", english: "March" },
  { french: "avril", english: "April" },
  { french: "mai", english: "May" },
  { french: "juin", english: "June" },
  { french: "juillet", english: "July" },
  { french: "août", english: "August" },
  { french: "septembre", english: "September" },
  { french: "octobre", english: "October" },
  { french: "novembre", english: "November" },
  { french: "décembre", english: "December" },
];

// French possessive adjectives for learn/practice
export const possessiveAdjectivesData: Example[] = [
  { french: "mon", english: "my (masculine noun)" },
  { french: "ma", english: "my (feminine noun)" },
  { french: "mes", english: "my (plural nouns)" },

  { french: "ton", english: "your informal tu (masculine noun)" },
  { french: "ta", english: "your informal tu (feminine noun)" },
  { french: "tes", english: "your informal tu (plural nouns)" },
  { french: "votre", english: "your formal vous (singular polite)" },
  { french: "vos", english: "your vous (plural nouns)" },

  { french: "nos", english: "our (masculine, feminine, plural)" },

  { french: "leur", english: "their (singular noun)" },
  { french: "leurs", english: "their (plural nouns)" },

  { french: "son", english: "his/her (masculine noun)" },
  { french: "sa", english: "his/her (feminine noun)" },
  { french: "ses", english: "his/her (plural nouns)" },
];

// French disjunctive (stressed) pronouns for learn/practice
export const disjunctivePronounsData: Example[] = [
  { french: "moi", english: "me" },
  { french: "nous", english: "us" },
  { french: "toi", english: "you (informal)" },
  { french: "vous", english: "you (formal or plural)" },
  { french: "lui", english: "him" },
  { french: "elle", english: "her" },
  { french: "eux", english: "them (masculine or mixed group)" },
  { french: "elles", english: "them (all feminine)" },
];

// Aller (to go) present tense for learn/practice
export const allerPresentData: Example[] = [
  { french: "je vais", english: "I go / I am going" },
  { french: "tu vas", english: "you go" },
  { french: "il va", english: "he goes" },
  { french: "elle va", english: "she goes" },
  { french: "nous allons", english: "we go" },
  { french: "vous allez", english: "you go (formal/plural)" },
  { french: "ils vont", english: "they go (masc./mixed)" },
  { french: "elles vont", english: "they go (all feminine)" },
];

// French colors for learn/practice
export const colorsData: Example[] = [
  { french: "rouge", english: "red" },
  { french: "orange", english: "orange" },
  { french: "jaune", english: "yellow" },
  { french: "rose", english: "pink" },
  { french: "vert / verte", english: "green" },
  { french: "bleu / bleue", english: "blue" },
  { french: "violet / violette", english: "purple" },
  { french: "blanc / blanche", english: "white" },
  { french: "brun / brune", english: "brown" },
  { french: "noir / noire", english: "black" },
];

// Common adjectives (masculine/feminine) for learn/practice
export const commonAdjectivesData: Example[] = [
  { french: "grand [m] / grande [f]", english: "Big / Tall" },
  { french: "petit [m] / petite [f]", english: "Small" },
  { french: "haut [m] / haute [f]", english: "High" },
  { french: "bas [m] / basse [f]", english: "Low" },
  { french: "long [m] / longue [f]", english: "Long" },
  { french: "court [m] / courte [f]", english: "Short" },
  { french: "large [m] / large [f]", english: "Wide / Large" },
  { french: "étroit [m] / étroite [f]", english: "Narrow" },
  { french: "gros [m] / grosse [f]", english: "Fat / Big" },
  { french: "mince [m] / mince [f]", english: "Slim / Thin" },
  { french: "carré [m] / carrée [f]", english: "Square" },
  { french: "rectangulaire [m] / rectangulaire [f]", english: "Rectangular" },
  { french: "pointu [m] / pointue [f]", english: "Pointed" },
  { french: "épais [m] / épaisse [f]", english: "Thick" },
  { french: "rond [m] / ronde [f]", english: "Round" },
];

// Adjectives that usually come after the noun
export const postNounAdjectivesData: Example[] = [
  { french: "fier [m] / fière [f]", english: "Proud" },
  { french: "étranger [m] / étrangère [f]", english: "Foreign" },
  { french: "menteur [m] / menteuse [f]", english: "Liar" },
  { french: "franc [m] / franche [f]", english: "Frank / Honest" },
  { french: "malin [m] / maligne [f]", english: "Cunning / Malicious" },
  { french: "supérieur [m] / supérieure [f]", english: "Superior" },
  { french: "meilleur [m] / meilleure [f]", english: "Best / Better" },
  { french: "heureux [m] / heureuse [f]", english: "Happy" },
  { french: "content [m] / contente [f]", english: "Happy / Satisfied" },
  { french: "faux [m] / fausse [f]", english: "False / Wrong" },
  { french: "favori [m] / favorite [f]", english: "Favorite" },
  { french: "frais [m] / fraîche [f]", english: "Fresh" },
];

// Adjectives that come before the noun
export const preNounAdjectivesData: Example[] = [
  { french: "autre [m] / autre [f]", english: "Other" },
  { french: "bon [m] / bonne [f]", english: "Good" },
  { french: "mauvais [m] / mauvaise [f]", english: "Bad" },
  { french: "meilleur [m] / meilleure [f]", english: "Best / Better" },
  { french: "jeune [m] / jeune [f]", english: "Young" },
  { french: "vieux [m] / vieille [f]", english: "Old" },
  { french: "nouveau [m] / nouvelle [f]", english: "New" },
  { french: "grand [m] / grande [f]", english: "Big / Tall" },
  { french: "petit [m] / petite [f]", english: "Small" },
  { french: "large [m] / large [f]", english: "Large / Wide" },
  { french: "beau [m] / belle [f]", english: "Handsome" },
  { french: "joli [m] / jolie [f]", english: "Pretty" },
  { french: "premier [m] / première [f]", english: "First" },
  { french: "dernier [m] / dernière [f]", english: "Last" },
  { french: "vaste [m] / vaste [f]", english: "Vast / Huge" },
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

// Helper function to get random days for days practice mode
export const getRandomDays = (count: number): Example[] => {
  const uniqueDays = getUniqueExamples(daysOfWeekData);
  const shuffled = shuffleExamples(uniqueDays);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Helper function to get random months for months practice mode
export const getRandomMonths = (count: number): Example[] => {
  const uniqueMonths = getUniqueExamples(monthsOfYearData);
  const shuffled = shuffleExamples(uniqueMonths);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Helper function to get random possessive adjectives for practice mode
export const getRandomPossessives = (count: number): Example[] => {
  const uniquePossessives = getUniqueExamples(possessiveAdjectivesData);
  const shuffled = shuffleExamples(uniquePossessives);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Helper function to get random disjunctive pronouns for practice mode
export const getRandomDisjunctives = (count: number): Example[] => {
  const uniqueDisjunctives = getUniqueExamples(disjunctivePronounsData);
  const shuffled = shuffleExamples(uniqueDisjunctives);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Helper function to get random Aller forms for practice mode
export const getRandomAllerForms = (count: number): Example[] => {
  const uniqueAllerForms = getUniqueExamples(allerPresentData);
  const shuffled = shuffleExamples(uniqueAllerForms);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Helper function to get random colors for practice mode
export const getRandomColors = (count: number): Example[] => {
  const uniqueColors = getUniqueExamples(colorsData);
  const shuffled = shuffleExamples(uniqueColors);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Helper function to get random common adjectives for practice mode
export const getRandomAdjectives = (count: number): Example[] => {
  const uniqueAdjectives = getUniqueExamples(commonAdjectivesData);
  const shuffled = shuffleExamples(uniqueAdjectives);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Helper function to get random post-noun adjectives for practice mode
export const getRandomPostNounAdjectives = (count: number): Example[] => {
  const uniqueAdjectives = getUniqueExamples(postNounAdjectivesData);
  const shuffled = shuffleExamples(uniqueAdjectives);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Helper function to get random pre-noun adjectives for practice mode
export const getRandomPreNounAdjectives = (count: number): Example[] => {
  const uniqueAdjectives = getUniqueExamples(preNounAdjectivesData);
  const shuffled = shuffleExamples(uniqueAdjectives);
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
