import { notFound } from "next/navigation";
import { getDeckBySlug } from "@/lib/decks";
import { StudySession } from "@/components/StudySession";
import { NumbersPracticeScreen } from "@/components/NumbersPracticeScreen";
import { DeckTagSetup } from "@/components/DeckTagSetup";
import { CalendarSetup } from "@/components/CalendarSetup";
import { GrammarSetup } from "@/components/GrammarSetup";
import { PossessivesSetup } from "@/components/PossessivesSetup";
import { DisjunctiveSetup } from "@/components/DisjunctiveSetup";
import { ColorsSetup } from "@/components/ColorsSetup";
import { QuestionWordsSetup } from "@/components/QuestionWordsSetup";
import { ContractedArticlesSetup } from "@/components/ContractedArticlesSetup";
import { AdjectivesSetup } from "@/components/AdjectivesSetup";
import { AdjectivesAfterNounSetup } from "@/components/AdjectivesAfterNounSetup";
import { AdjectivesBeforeNounSetup } from "@/components/AdjectivesBeforeNounSetup";
import { FamilySetup } from "@/components/FamilySetup";
import { ProfessionsSetup } from "@/components/ProfessionsSetup";
import { SeasonsWeatherSetup } from "@/components/SeasonsWeatherSetup";
import { ClothingSetup } from "@/components/ClothingSetup";
import { TimeSetup } from "@/components/TimeSetup";
import { FoodCategoriesSetup } from "@/components/FoodCategoriesSetup";
import { HomeFurnitureSetup } from "@/components/HomeFurnitureSetup";
import { BodyPartsSetup } from "@/components/BodyPartsSetup";
import { getTimePracticeCards } from "@/lib/timePractice";
import type { FlashcardItem } from "@/types/flashcards";

interface DeckPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function toStringArray(value: string | string[] | undefined): string[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  return [value];
}

function shuffleCards(cards: FlashcardItem[]): FlashcardItem[] {
  const copy = [...cards];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default async function DeckPage({ params, searchParams }: DeckPageProps) {
  const resolvedParams = await params;
  const resolvedSearch = searchParams ? await searchParams : {};

  if (resolvedParams.slug === "numbers") {
    return (
      <main className="studyPageShell">
        <div className="studyContainer">
          <div className="studyHeaderBlock">
            <p className="eyebrow">Practice Deck</p>
            <h1>Numbers</h1>
          </div>
          <NumbersPracticeScreen slug={resolvedParams.slug} />
        </div>
      </main>
    );
  }

  const deck = await getDeckBySlug(resolvedParams.slug);

  if (!deck) {
    notFound();
  }

  const selectedTags = toStringArray(resolvedSearch.tags)
    .flatMap((segment) => segment.split(","))
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
  const calendarModeRaw = toStringArray(resolvedSearch.calendarMode)[0] ?? "";
  const calendarMode =
    calendarModeRaw === "days" ||
    calendarModeRaw === "months" ||
    calendarModeRaw === "days-extra" ||
    calendarModeRaw === "days-question" ||
    calendarModeRaw === "months-question" ||
    calendarModeRaw === "mixed"
      ? calendarModeRaw
      : "";
  const grammarModeRaw = toStringArray(resolvedSearch.grammarMode)[0] ?? "";
  const grammarMode =
    grammarModeRaw === "etre" ||
    grammarModeRaw === "avoir" ||
    grammarModeRaw === "demonstratives" ||
    grammarModeRaw === "aller" ||
    grammarModeRaw === "mixed"
      ? grammarModeRaw
      : "";
  const possessiveModeRaw = toStringArray(resolvedSearch.possessiveMode)[0] ?? "";
  const possessiveMode =
    possessiveModeRaw === "core" || possessiveModeRaw === "examples" || possessiveModeRaw === "mixed"
      ? possessiveModeRaw
      : "";
  const disjunctiveModeRaw = toStringArray(resolvedSearch.disjunctiveMode)[0] ?? "";
  const disjunctiveMode =
    disjunctiveModeRaw === "disjunctive-only" || disjunctiveModeRaw === "comparison" || disjunctiveModeRaw === "mixed"
      ? disjunctiveModeRaw
      : "";
  const colorsModeRaw = toStringArray(resolvedSearch.colorsMode)[0] ?? "";
  const colorsMode = colorsModeRaw === "full" ? colorsModeRaw : "";
  const questionWordsModeRaw = toStringArray(resolvedSearch.questionWordsMode)[0] ?? "";
  const questionWordsMode =
    questionWordsModeRaw === "forms" || questionWordsModeRaw === "examples" || questionWordsModeRaw === "mixed"
      ? questionWordsModeRaw
      : "";
  const contractedArticlesModeRaw = toStringArray(resolvedSearch.contractedArticlesMode)[0] ?? "";
  const contractedArticlesMode =
    contractedArticlesModeRaw === "de" ||
    contractedArticlesModeRaw === "a" ||
    contractedArticlesModeRaw === "examples" ||
    contractedArticlesModeRaw === "mixed"
      ? contractedArticlesModeRaw
      : "";
  const adjectivesModeRaw = toStringArray(resolvedSearch.adjectivesMode)[0] ?? "";
  const adjectivesMode =
    adjectivesModeRaw === "masculine" ||
    adjectivesModeRaw === "feminine" ||
    adjectivesModeRaw === "common" ||
    adjectivesModeRaw === "shapes" ||
    adjectivesModeRaw === "mixed"
      ? adjectivesModeRaw
      : "";
  const adjectivesAfterNounModeRaw = toStringArray(resolvedSearch.adjectivesAfterNounMode)[0] ?? "";
  const adjectivesAfterNounMode =
    adjectivesAfterNounModeRaw === "masculine" ||
    adjectivesAfterNounModeRaw === "feminine" ||
    adjectivesAfterNounModeRaw === "mixed"
      ? adjectivesAfterNounModeRaw
      : "";
  const adjectivesBeforeNounModeRaw = toStringArray(resolvedSearch.adjectivesBeforeNounMode)[0] ?? "";
  const adjectivesBeforeNounMode =
    adjectivesBeforeNounModeRaw === "masculine" ||
    adjectivesBeforeNounModeRaw === "feminine" ||
    adjectivesBeforeNounModeRaw === "common" ||
    adjectivesBeforeNounModeRaw === "mixed"
      ? adjectivesBeforeNounModeRaw
      : "";
  const familyModeRaw = toStringArray(resolvedSearch.familyMode)[0] ?? "";
  const familyMode =
    familyModeRaw === "family-members" ||
    familyModeRaw === "in-laws" ||
    familyModeRaw === "relationship-status" ||
    familyModeRaw === "mixed"
      ? familyModeRaw
      : "";
  const professionsModeRaw = toStringArray(resolvedSearch.professionsMode)[0] ?? "";
  const professionsMode =
    professionsModeRaw === "questions" ||
    professionsModeRaw === "masculine" ||
    professionsModeRaw === "feminine" ||
    professionsModeRaw === "common" ||
    professionsModeRaw === "mixed"
      ? professionsModeRaw
      : "";
  const seasonsWeatherModeRaw = toStringArray(resolvedSearch.seasonsWeatherMode)[0] ?? "";
  const seasonsWeatherMode =
    seasonsWeatherModeRaw === "seasons" ||
    seasonsWeatherModeRaw === "weather" ||
    seasonsWeatherModeRaw === "mixed"
      ? seasonsWeatherModeRaw
      : "";
  const clothingModeRaw = toStringArray(resolvedSearch.clothingMode)[0] ?? "";
  const clothingMode =
    clothingModeRaw === "men" || clothingModeRaw === "women" || clothingModeRaw === "mixed"
      ? clothingModeRaw
      : "";
  const timeModeRaw = toStringArray(resolvedSearch.timeMode)[0] ?? "";
  const timeMode =
    timeModeRaw === "words" || timeModeRaw === "examples" || timeModeRaw === "generated" || timeModeRaw === "mixed"
      ? timeModeRaw
      : "";
  const foodCategoryModeRaw = toStringArray(resolvedSearch.foodCategoryMode)[0] ?? "";
  const foodCategoryMode =
    foodCategoryModeRaw === "fruits" ||
    foodCategoryModeRaw === "vegetables" ||
    foodCategoryModeRaw === "dairy" ||
    foodCategoryModeRaw === "desserts" ||
    foodCategoryModeRaw === "other-foods" ||
    foodCategoryModeRaw === "mixed"
      ? foodCategoryModeRaw
      : "";
  const homeFurnitureModeRaw = toStringArray(resolvedSearch.homeFurnitureMode)[0] ?? "";
  const homeFurnitureMode =
    homeFurnitureModeRaw === "house" ||
    homeFurnitureModeRaw === "kitchen" ||
    homeFurnitureModeRaw === "dining" ||
    homeFurnitureModeRaw === "bedroom" ||
    homeFurnitureModeRaw === "mixed"
      ? homeFurnitureModeRaw
      : "";
  const bodyPartsModeRaw = toStringArray(resolvedSearch.bodyPartsMode)[0] ?? "";
  const bodyPartsMode =
    bodyPartsModeRaw === "basic" ||
    bodyPartsModeRaw === "face" ||
    bodyPartsModeRaw === "internal" ||
    bodyPartsModeRaw === "mixed"
      ? bodyPartsModeRaw
      : "";

  const retryIds = toStringArray(resolvedSearch.ids)
    .flatMap((segment) => segment.split(","))
    .map((value) => Number.parseInt(value.trim(), 10))
    .filter((value) => !Number.isNaN(value));

  const availableTags = [...new Set(deck.cards.flatMap((card) => card.tags ?? []))];
  const setupTags =
    resolvedParams.slug === "sounds"
      ? availableTags.filter((tag) => tag !== "sound")
      : availableTags;
  const shouldShowTagSetup =
    (resolvedParams.slug === "greetings" || resolvedParams.slug === "sounds") &&
    selectedTags.length === 0 &&
    retryIds.length === 0;

  const shouldShowCalendarSetup =
    resolvedParams.slug === "calendar" &&
    calendarMode.length === 0 &&
    retryIds.length === 0;
  const shouldShowGrammarSetup =
    resolvedParams.slug === "grammar-basics" &&
    grammarMode.length === 0 &&
    retryIds.length === 0;
  const shouldShowPossessivesSetup =
    resolvedParams.slug === "possessives" &&
    possessiveMode.length === 0 &&
    retryIds.length === 0;
  const shouldShowDisjunctiveSetup =
    resolvedParams.slug === "disjunctive-pronouns" &&
    disjunctiveMode.length === 0 &&
    retryIds.length === 0;
  const shouldShowColorsSetup =
    resolvedParams.slug === "colors" &&
    colorsMode.length === 0 &&
    retryIds.length === 0;
  const shouldShowQuestionWordsSetup =
    resolvedParams.slug === "question-words" &&
    questionWordsMode.length === 0 &&
    retryIds.length === 0;
  const shouldShowContractedArticlesSetup =
    resolvedParams.slug === "contracted-articles" &&
    contractedArticlesMode.length === 0 &&
    retryIds.length === 0;
  const shouldShowAdjectivesSetup =
    resolvedParams.slug === "adjectives" &&
    adjectivesMode.length === 0 &&
    retryIds.length === 0;
  const shouldShowAdjectivesAfterNounSetup =
    resolvedParams.slug === "adjectives-after-noun" &&
    adjectivesAfterNounMode.length === 0 &&
    retryIds.length === 0;
  const shouldShowAdjectivesBeforeNounSetup =
    resolvedParams.slug === "adjectives-before-noun" &&
    adjectivesBeforeNounMode.length === 0 &&
    retryIds.length === 0;
  const shouldShowFamilySetup =
    resolvedParams.slug === "family" &&
    familyMode.length === 0 &&
    retryIds.length === 0;
  const shouldShowProfessionsSetup =
    resolvedParams.slug === "professions" &&
    professionsMode.length === 0 &&
    retryIds.length === 0;
  const shouldShowSeasonsWeatherSetup =
    resolvedParams.slug === "seasons-weather" &&
    seasonsWeatherMode.length === 0 &&
    retryIds.length === 0;
  const shouldShowClothingSetup =
    resolvedParams.slug === "clothing" &&
    clothingMode.length === 0 &&
    retryIds.length === 0;
  const shouldShowTimeSetup =
    resolvedParams.slug === "time" &&
    timeMode.length === 0 &&
    retryIds.length === 0;
  const shouldShowFoodCategoriesSetup =
    resolvedParams.slug === "food-categories" &&
    foodCategoryMode.length === 0 &&
    retryIds.length === 0;
  const shouldShowHomeFurnitureSetup =
    resolvedParams.slug === "home-furniture" &&
    homeFurnitureMode.length === 0 &&
    retryIds.length === 0;
  const shouldShowBodyPartsSetup =
    resolvedParams.slug === "body-parts" &&
    bodyPartsMode.length === 0 &&
    retryIds.length === 0;

  if (shouldShowTagSetup) {
    return (
      <main className="studyPageShell">
        <div className="studyContainer">
          <div className="studyHeaderBlock">
            <p className="eyebrow">Practice Deck</p>
            <h1>{deck.title}</h1>
          </div>
          <DeckTagSetup slug={resolvedParams.slug} title={deck.title} tags={setupTags} />
        </div>
      </main>
    );
  }

  if (shouldShowCalendarSetup) {
    return (
      <main className="studyPageShell">
        <div className="studyContainer">
          <div className="studyHeaderBlock">
            <p className="eyebrow">Practice Deck</p>
            <h1>{deck.title}</h1>
          </div>
          <CalendarSetup slug={resolvedParams.slug} title={deck.title} />
        </div>
      </main>
    );
  }

  if (shouldShowGrammarSetup) {
    return (
      <main className="studyPageShell">
        <div className="studyContainer">
          <div className="studyHeaderBlock">
            <p className="eyebrow">Practice Deck</p>
            <h1>{deck.title}</h1>
          </div>
          <GrammarSetup slug={resolvedParams.slug} title={deck.title} />
        </div>
      </main>
    );
  }

  if (shouldShowPossessivesSetup) {
    return (
      <main className="studyPageShell">
        <div className="studyContainer">
          <div className="studyHeaderBlock">
            <p className="eyebrow">Practice Deck</p>
            <h1>{deck.title}</h1>
          </div>
          <PossessivesSetup slug={resolvedParams.slug} title={deck.title} />
        </div>
      </main>
    );
  }

  if (shouldShowDisjunctiveSetup) {
    return (
      <main className="studyPageShell">
        <div className="studyContainer">
          <div className="studyHeaderBlock">
            <p className="eyebrow">Practice Deck</p>
            <h1>{deck.title}</h1>
          </div>
          <DisjunctiveSetup slug={resolvedParams.slug} title={deck.title} />
        </div>
      </main>
    );
  }

  if (shouldShowColorsSetup) {
    return (
      <main className="studyPageShell">
        <div className="studyContainer">
          <div className="studyHeaderBlock">
            <p className="eyebrow">Practice Deck</p>
            <h1>{deck.title}</h1>
          </div>
          <ColorsSetup slug={resolvedParams.slug} title={deck.title} />
        </div>
      </main>
    );
  }

  if (shouldShowQuestionWordsSetup) {
    return (
      <main className="studyPageShell">
        <div className="studyContainer">
          <div className="studyHeaderBlock">
            <p className="eyebrow">Practice Deck</p>
            <h1>{deck.title}</h1>
          </div>
          <QuestionWordsSetup slug={resolvedParams.slug} title={deck.title} />
        </div>
      </main>
    );
  }

  if (shouldShowContractedArticlesSetup) {
    return (
      <main className="studyPageShell">
        <div className="studyContainer">
          <div className="studyHeaderBlock">
            <p className="eyebrow">Practice Deck</p>
            <h1>{deck.title}</h1>
          </div>
          <ContractedArticlesSetup slug={resolvedParams.slug} title={deck.title} />
        </div>
      </main>
    );
  }

  if (shouldShowAdjectivesSetup) {
    return (
      <main className="studyPageShell">
        <div className="studyContainer">
          <div className="studyHeaderBlock">
            <p className="eyebrow">Practice Deck</p>
            <h1>{deck.title}</h1>
          </div>
          <AdjectivesSetup slug={resolvedParams.slug} title={deck.title} />
        </div>
      </main>
    );
  }

  if (shouldShowAdjectivesAfterNounSetup) {
    return (
      <main className="studyPageShell">
        <div className="studyContainer">
          <div className="studyHeaderBlock">
            <p className="eyebrow">Practice Deck</p>
            <h1>{deck.title}</h1>
          </div>
          <AdjectivesAfterNounSetup slug={resolvedParams.slug} title={deck.title} />
        </div>
      </main>
    );
  }

  if (shouldShowAdjectivesBeforeNounSetup) {
    return (
      <main className="studyPageShell">
        <div className="studyContainer">
          <div className="studyHeaderBlock">
            <p className="eyebrow">Practice Deck</p>
            <h1>{deck.title}</h1>
          </div>
          <AdjectivesBeforeNounSetup slug={resolvedParams.slug} title={deck.title} />
        </div>
      </main>
    );
  }

  if (shouldShowFamilySetup) {
    return (
      <main className="studyPageShell">
        <div className="studyContainer">
          <div className="studyHeaderBlock">
            <p className="eyebrow">Practice Deck</p>
            <h1>{deck.title}</h1>
          </div>
          <FamilySetup slug={resolvedParams.slug} title={deck.title} />
        </div>
      </main>
    );
  }

  if (shouldShowProfessionsSetup) {
    return (
      <main className="studyPageShell">
        <div className="studyContainer">
          <div className="studyHeaderBlock">
            <p className="eyebrow">Practice Deck</p>
            <h1>{deck.title}</h1>
          </div>
          <ProfessionsSetup slug={resolvedParams.slug} title={deck.title} />
        </div>
      </main>
    );
  }

  if (shouldShowSeasonsWeatherSetup) {
    return (
      <main className="studyPageShell">
        <div className="studyContainer">
          <div className="studyHeaderBlock">
            <p className="eyebrow">Practice Deck</p>
            <h1>{deck.title}</h1>
          </div>
          <SeasonsWeatherSetup slug={resolvedParams.slug} title={deck.title} />
        </div>
      </main>
    );
  }

  if (shouldShowClothingSetup) {
    return (
      <main className="studyPageShell">
        <div className="studyContainer">
          <div className="studyHeaderBlock">
            <p className="eyebrow">Practice Deck</p>
            <h1>{deck.title}</h1>
          </div>
          <ClothingSetup slug={resolvedParams.slug} title={deck.title} />
        </div>
      </main>
    );
  }

  if (shouldShowTimeSetup) {
    return (
      <main className="studyPageShell">
        <div className="studyContainer">
          <div className="studyHeaderBlock">
            <p className="eyebrow">Practice Deck</p>
            <h1>{deck.title}</h1>
          </div>
          <TimeSetup slug={resolvedParams.slug} title={deck.title} />
        </div>
      </main>
    );
  }

  if (shouldShowFoodCategoriesSetup) {
    return (
      <main className="studyPageShell">
        <div className="studyContainer">
          <div className="studyHeaderBlock">
            <p className="eyebrow">Practice Deck</p>
            <h1>{deck.title}</h1>
          </div>
          <FoodCategoriesSetup slug={resolvedParams.slug} title={deck.title} />
        </div>
      </main>
    );
  }

  if (shouldShowHomeFurnitureSetup) {
    return (
      <main className="studyPageShell">
        <div className="studyContainer">
          <div className="studyHeaderBlock">
            <p className="eyebrow">Practice Deck</p>
            <h1>{deck.title}</h1>
          </div>
          <HomeFurnitureSetup slug={resolvedParams.slug} title={deck.title} />
        </div>
      </main>
    );
  }

  if (shouldShowBodyPartsSetup) {
    return (
      <main className="studyPageShell">
        <div className="studyContainer">
          <div className="studyHeaderBlock">
            <p className="eyebrow">Practice Deck</p>
            <h1>{deck.title}</h1>
          </div>
          <BodyPartsSetup slug={resolvedParams.slug} title={deck.title} />
        </div>
      </main>
    );
  }

  const activeTimeMode: "words" | "examples" | "generated" | "mixed" =
    timeMode === "" ? "mixed" : timeMode;
  const timePracticeCards =
    resolvedParams.slug === "time"
      ? await getTimePracticeCards(activeTimeMode)
      : [];

  const calendarFiltered =
    resolvedParams.slug === "calendar" && calendarMode.length > 0 && calendarMode !== "mixed"
      ? deck.cards.filter((card) => (card.tags ?? []).includes(calendarMode))
      : deck.cards;
  const grammarFiltered =
    resolvedParams.slug === "grammar-basics" && grammarMode.length > 0 && grammarMode !== "mixed"
      ? calendarFiltered.filter((card) => (card.tags ?? []).includes(grammarMode))
      : calendarFiltered;
  const possessivesFiltered =
    resolvedParams.slug === "possessives" && possessiveMode.length > 0 && possessiveMode !== "mixed"
      ? grammarFiltered.filter((card) =>
          possessiveMode === "core"
            ? (card.tags ?? []).includes("possessive") && !(card.tags ?? []).includes("example")
            : (card.tags ?? []).includes("example"),
        )
      : grammarFiltered;
  const disjunctiveFiltered =
    resolvedParams.slug === "disjunctive-pronouns" && disjunctiveMode.length > 0 && disjunctiveMode !== "mixed"
      ? possessivesFiltered.filter((card) =>
          disjunctiveMode === "disjunctive-only"
            ? (card.tags ?? []).includes("disjunctive")
            : (card.tags ?? []).includes("comparison"),
        )
      : possessivesFiltered;
  const questionWordsFiltered =
    resolvedParams.slug === "question-words" && questionWordsMode.length > 0 && questionWordsMode !== "mixed"
      ? disjunctiveFiltered.filter((card) =>
          questionWordsMode === "forms"
            ? !(card.tags ?? []).includes("example")
            : (card.tags ?? []).includes("example"),
        )
      : disjunctiveFiltered;
  const contractedArticlesFiltered =
    resolvedParams.slug === "contracted-articles" && contractedArticlesMode.length > 0 && contractedArticlesMode !== "mixed"
      ? questionWordsFiltered.filter((card) => {
          if (contractedArticlesMode === "de") {
            return card.category === "de" || card.category === "de-examples";
          }
          if (contractedArticlesMode === "a") {
            return card.category === "a" || card.category === "a-examples";
          }
          return (card.tags ?? []).includes("example");
        })
      : questionWordsFiltered;
  const adjectivesFiltered =
    resolvedParams.slug === "adjectives" && adjectivesMode.length > 0 && adjectivesMode !== "mixed"
      ? contractedArticlesFiltered.filter((card) => {
          const tags = card.tags ?? [];
          if (adjectivesMode === "masculine") {
            return tags.includes("adjective") && tags.includes("masculine");
          }
          if (adjectivesMode === "feminine") {
            return tags.includes("adjective") && tags.includes("feminine");
          }
          if (adjectivesMode === "common") {
            return tags.includes("adjective") && tags.includes("common") && !tags.includes("shape");
          }
          return tags.includes("shape");
        })
      : contractedArticlesFiltered;
  const adjectivesAfterNounFiltered =
    resolvedParams.slug === "adjectives-after-noun" &&
    adjectivesAfterNounMode.length > 0 &&
    adjectivesAfterNounMode !== "mixed"
      ? adjectivesFiltered.filter((card) => {
          const tags = card.tags ?? [];
          return adjectivesAfterNounMode === "masculine"
            ? tags.includes("adjective") && tags.includes("after-noun") && tags.includes("masculine")
            : tags.includes("adjective") && tags.includes("after-noun") && tags.includes("feminine");
        })
      : adjectivesFiltered;
  const adjectivesBeforeNounFiltered =
    resolvedParams.slug === "adjectives-before-noun" &&
    adjectivesBeforeNounMode.length > 0 &&
    adjectivesBeforeNounMode !== "mixed"
      ? adjectivesAfterNounFiltered.filter((card) => {
          const tags = card.tags ?? [];
          if (adjectivesBeforeNounMode === "masculine") {
            return tags.includes("adjective") && tags.includes("before-noun") && tags.includes("masculine");
          }
          if (adjectivesBeforeNounMode === "feminine") {
            return tags.includes("adjective") && tags.includes("before-noun") && tags.includes("feminine");
          }
          return tags.includes("adjective") && tags.includes("before-noun") && tags.includes("common");
        })
      : adjectivesAfterNounFiltered;
  const familyFiltered =
    resolvedParams.slug === "family" && familyMode.length > 0
      ? adjectivesBeforeNounFiltered.filter((card) => {
          const tags = card.tags ?? [];
          if (familyMode === "family-members") {
            return tags.includes("family-member");
          }
          if (familyMode === "in-laws") {
            return tags.includes("in-law");
          }
          if (familyMode === "relationship-status") {
            return tags.includes("relationship-status");
          }
          return (
            tags.includes("family-member") || tags.includes("in-law") || tags.includes("relationship-status")
          );
        })
      : adjectivesBeforeNounFiltered;
  const professionsFiltered =
    resolvedParams.slug === "professions" && professionsMode.length > 0
      ? familyFiltered.filter((card) => {
          const tags = card.tags ?? [];
          if (professionsMode === "questions") {
            return tags.includes("question") || card.category === "question";
          }
          if (professionsMode === "masculine") {
            return tags.includes("masculine");
          }
          if (professionsMode === "feminine") {
            return tags.includes("feminine");
          }
          if (professionsMode === "common") {
            return tags.includes("common");
          }
          return tags.includes("profession");
        })
      : familyFiltered;
  const seasonsWeatherFiltered =
    resolvedParams.slug === "seasons-weather" && seasonsWeatherMode.length > 0
      ? professionsFiltered.filter((card) => {
          const tags = card.tags ?? [];
          if (seasonsWeatherMode === "seasons") {
            return tags.includes("season") || card.category === "seasons";
          }
          if (seasonsWeatherMode === "weather") {
            return tags.includes("weather") || card.category === "weather" || card.category === "weather-question";
          }
          return tags.includes("season") || tags.includes("weather") || card.category === "seasons" || card.category === "weather" || card.category === "weather-question";
        })
      : professionsFiltered;
  const clothingFiltered =
    resolvedParams.slug === "clothing" && clothingMode.length > 0 && clothingMode !== "mixed"
      ? seasonsWeatherFiltered.filter((card) => card.category === clothingMode)
      : seasonsWeatherFiltered;
  const timeFiltered = resolvedParams.slug === "time" ? timePracticeCards : clothingFiltered;
  const foodCategoriesFiltered =
    resolvedParams.slug === "food-categories" && foodCategoryMode.length > 0 && foodCategoryMode !== "mixed"
      ? timeFiltered.filter((card) => card.category === foodCategoryMode)
      : timeFiltered;
  const homeFurnitureFiltered =
    resolvedParams.slug === "home-furniture" && homeFurnitureMode.length > 0 && homeFurnitureMode !== "mixed"
      ? foodCategoriesFiltered.filter((card) => card.category === homeFurnitureMode)
      : foodCategoriesFiltered;
  const bodyPartsFiltered =
    resolvedParams.slug === "body-parts" && bodyPartsMode.length > 0 && bodyPartsMode !== "mixed"
      ? homeFurnitureFiltered.filter((card) => card.category === bodyPartsMode)
      : homeFurnitureFiltered;

  const filteredByTags =
    selectedTags.length === 0
      ? bodyPartsFiltered
      : bodyPartsFiltered.filter((card) => (card.tags ?? []).some((tag) => selectedTags.includes(tag)));

  const filteredCards =
    retryIds.length === 0
      ? filteredByTags
      : filteredByTags.filter((card) => retryIds.includes(card.id));
  const shouldShuffle =
    resolvedParams.slug === "calendar" ||
    resolvedParams.slug === "grammar-basics" ||
    resolvedParams.slug === "possessives" ||
    resolvedParams.slug === "disjunctive-pronouns" ||
    resolvedParams.slug === "colors" ||
    resolvedParams.slug === "question-words" ||
    resolvedParams.slug === "contracted-articles" ||
    resolvedParams.slug === "adjectives" ||
    resolvedParams.slug === "adjectives-after-noun" ||
    resolvedParams.slug === "adjectives-before-noun" ||
    resolvedParams.slug === "family" ||
    resolvedParams.slug === "professions" ||
    resolvedParams.slug === "seasons-weather" ||
    resolvedParams.slug === "clothing" ||
    resolvedParams.slug === "time" ||
    resolvedParams.slug === "food-categories" ||
    resolvedParams.slug === "home-furniture" ||
    resolvedParams.slug === "transportation" ||
    resolvedParams.slug === "body-parts";
  const sessionCards = shouldShuffle ? shuffleCards(filteredCards) : filteredCards;

  const activeDeck = {
    ...deck,
    cards: sessionCards,
    cardCount: sessionCards.length,
  };

  const retryParams = new URLSearchParams();
  if (selectedTags.length > 0) {
    retryParams.set("tags", selectedTags.join(","));
  }
  if (calendarMode.length > 0) {
    retryParams.set("calendarMode", calendarMode);
  }
  if (grammarMode.length > 0) {
    retryParams.set("grammarMode", grammarMode);
  }
  if (possessiveMode.length > 0) {
    retryParams.set("possessiveMode", possessiveMode);
  }
  if (disjunctiveMode.length > 0) {
    retryParams.set("disjunctiveMode", disjunctiveMode);
  }
  if (colorsMode.length > 0) {
    retryParams.set("colorsMode", colorsMode);
  }
  if (questionWordsMode.length > 0) {
    retryParams.set("questionWordsMode", questionWordsMode);
  }
  if (contractedArticlesMode.length > 0) {
    retryParams.set("contractedArticlesMode", contractedArticlesMode);
  }
  if (adjectivesMode.length > 0) {
    retryParams.set("adjectivesMode", adjectivesMode);
  }
  if (adjectivesAfterNounMode.length > 0) {
    retryParams.set("adjectivesAfterNounMode", adjectivesAfterNounMode);
  }
  if (adjectivesBeforeNounMode.length > 0) {
    retryParams.set("adjectivesBeforeNounMode", adjectivesBeforeNounMode);
  }
  if (familyMode.length > 0) {
    retryParams.set("familyMode", familyMode);
  }
  if (professionsMode.length > 0) {
    retryParams.set("professionsMode", professionsMode);
  }
  if (seasonsWeatherMode.length > 0) {
    retryParams.set("seasonsWeatherMode", seasonsWeatherMode);
  }
  if (clothingMode.length > 0) {
    retryParams.set("clothingMode", clothingMode);
  }
  if (timeMode.length > 0) {
    retryParams.set("timeMode", timeMode);
  }
  if (foodCategoryMode.length > 0) {
    retryParams.set("foodCategoryMode", foodCategoryMode);
  }
  if (homeFurnitureMode.length > 0) {
    retryParams.set("homeFurnitureMode", homeFurnitureMode);
  }
  if (bodyPartsMode.length > 0) {
    retryParams.set("bodyPartsMode", bodyPartsMode);
  }

  const retryHref = retryParams.size > 0 ? `/deck/${resolvedParams.slug}?${retryParams.toString()}` : `/deck/${resolvedParams.slug}`;

  return (
    <main className="studyPageShell">
      <div className="studyContainer">
        <div className="studyHeaderBlock">
          <p className="eyebrow">Practice Deck</p>
          <h1>{deck.title}</h1>
        </div>
        <StudySession
          deck={activeDeck}
          retryHref={retryHref}
          enableRetryIncorrect
          frontOptions={resolvedParams.slug === "sounds" ? [{ value: "english", label: "Front: Pattern" }] : undefined}
          defaultFrontLanguage={resolvedParams.slug === "sounds" ? "english" : undefined}
        />
      </div>
    </main>
  );
}
