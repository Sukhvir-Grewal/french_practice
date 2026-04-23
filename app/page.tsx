import { DeckSelector } from "@/components/DeckSelector";
import { getAvailableDecks } from "@/lib/decks";

export default async function Home() {
  const decks = await getAvailableDecks();

  return (
    <main className="dashboardRoot">
      <div className="heroGlow" aria-hidden="true" />
      <section className="dashboardHeader">
        <p className="eyebrow">French Practice Studio</p>
        <h1>Build Daily Fluency With Focused Card Decks</h1>
        <p className="dashboardLead">
          Pick a deck, flip through cards, and train weak points with repeat scheduling.
        </p>
      </section>

      <DeckSelector decks={decks} />
    </main>
  );
}

