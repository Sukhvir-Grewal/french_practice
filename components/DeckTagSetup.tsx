"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

interface DeckTagSetupProps {
  slug: string;
  title: string;
  tags: string[];
}

export function DeckTagSetup({ slug, title, tags }: DeckTagSetupProps) {
  const router = useRouter();
  const uniqueTags = useMemo(() => [...new Set(tags)], [tags]);
  const [selectedTags, setSelectedTags] = useState<string[]>(uniqueTags);

  const toggleTag = (tag: string) => {
    setSelectedTags((previous) => {
      if (previous.includes(tag)) {
        return previous.filter((value) => value !== tag);
      }
      return [...previous, tag];
    });
  };

  const handleStart = () => {
    if (selectedTags.length === 0) {
      return;
    }

    const params = new URLSearchParams();
    params.set("tags", selectedTags.join(","));
    router.push(`/deck/${slug}?${params.toString()}`);
  };

  const handleStartAll = () => {
    const params = new URLSearchParams();
    params.set("tags", uniqueTags.join(","));
    router.push(`/deck/${slug}?${params.toString()}`);
  };

  return (
    <section className="tagSetupCard" aria-label="Deck category filter setup">
      <h2>{title} Category Filter</h2>
      <p>Select one or more categories to focus your study session.</p>

      <div className="tagChipGrid">
        {uniqueTags.map((tag) => (
          <button
            key={tag}
            type="button"
            className={selectedTags.includes(tag) ? "tagChip active" : "tagChip"}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="tagSetupActions">
        <button type="button" className="secondaryAction" onClick={handleStartAll}>
          Start All Categories
        </button>
        <button type="button" className="primaryAction" onClick={handleStart} disabled={selectedTags.length === 0}>
          Start Selected
        </button>
      </div>
    </section>
  );
}
