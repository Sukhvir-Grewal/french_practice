import Link from "next/link";
import type { DeckMeta } from "@/types/flashcards";

interface DeckSelectorProps {
  decks: DeckMeta[];
}

export function DeckSelector({ decks }: DeckSelectorProps) {
  if (decks.length === 0) {
    return (
      <section className="emptyState">
        <h2>No decks found</h2>
        <p>Add JSON files inside the data folder to populate your dashboard.</p>
      </section>
    );
  }

  return (
    <section className="deckGrid" aria-label="Available practice decks">
      {decks.map((deck, index) => (
        <Link
          key={deck.slug}
          href={`/deck/${deck.slug}`}
          className="deckCard"
          style={{ animationDelay: `${index * 80}ms` }}
        >
          <div className="deckBadge">{deck.category}</div>
          <h2>{deck.title}</h2>
          <p>{deck.cardCount} flashcards</p>
          <span className="deckAction">Start Session</span>
        </Link>
      ))}
    </section>
  );
}
