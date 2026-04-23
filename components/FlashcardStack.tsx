"use client";

import type { FlashcardItem, FrontLanguage } from "@/types/flashcards";
import { Flashcard } from "@/components/Flashcard";

interface FlashcardStackProps {
  cards: FlashcardItem[];
  frontLanguage: FrontLanguage;
  isFlipped: boolean;
  onFlip: () => void;
  onSwipe: (direction: "left" | "right") => void;
}

export function FlashcardStack({ cards, frontLanguage, isFlipped, onFlip, onSwipe }: FlashcardStackProps) {
  if (cards.length === 0) {
    return (
      <div className="emptyState compact">
        <h3>All cards done</h3>
      </div>
    );
  }

  return (
    <section className="stackStage" aria-label="Flashcard stack">
      {cards
        .slice(0, 3)
        .map((card, index) => (
          <Flashcard
            key={`${card.id}-${index}`}
            card={card}
            frontLanguage={frontLanguage}
            isFlipped={index === 0 ? isFlipped : false}
            isActive={index === 0}
            depth={index}
            onFlip={onFlip}
            onSwipe={onSwipe}
          />
        ))
        .reverse()}
    </section>
  );
}
