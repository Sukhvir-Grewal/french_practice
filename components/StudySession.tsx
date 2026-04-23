"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import type { DeckData, FlashcardItem, FrontLanguage, FrontLanguageOption } from "@/types/flashcards";
import { FlashcardStack } from "@/components/FlashcardStack";
import { ProgressHeader } from "@/components/ProgressHeader";
import { ResultsSummary } from "@/components/ResultsSummary";
import { StudyControls } from "@/components/StudyControls";

interface StudySessionProps {
  deck: DeckData;
  defaultFrontLanguage?: FrontLanguage;
  frontOptions?: FrontLanguageOption[];
  retryHref?: string;
  enableRetryIncorrect?: boolean;
}

function buildCardMap(cards: FlashcardItem[]): Map<number, FlashcardItem> {
  return new Map(cards.map((card) => [card.id, card]));
}

function resolveAudioSource(audioPath: string): string {
  if (!audioPath) {
    return "";
  }
  if (audioPath.startsWith("http://") || audioPath.startsWith("https://") || audioPath.startsWith("/")) {
    return audioPath;
  }
  return `/audio/${audioPath}`;
}

function speakFrenchSequence(lines: string[], sequenceToken: number, speechTokenRef: MutableRefObject<number>) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return;
  }

  const filtered = lines.map((line) => line.trim()).filter((line) => line.length > 0);
  if (filtered.length === 0) {
    return;
  }

  const speakAtIndex = (index: number) => {
    if (speechTokenRef.current !== sequenceToken || index >= filtered.length) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(filtered[index]);
    utterance.lang = "fr-FR";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onend = () => {
      if (speechTokenRef.current !== sequenceToken) {
        return;
      }
      window.setTimeout(() => speakAtIndex(index + 1), 280);
    };
    utterance.onerror = () => {
      if (speechTokenRef.current !== sequenceToken) {
        return;
      }
      window.setTimeout(() => speakAtIndex(index + 1), 180);
    };
    window.speechSynthesis.speak(utterance);
  };

  speakAtIndex(0);
}

export function StudySession({
  deck,
  defaultFrontLanguage,
  frontOptions,
  retryHref,
  enableRetryIncorrect = true,
}: StudySessionProps) {
  const cardMap = useMemo(() => buildCardMap(deck.cards), [deck.cards]);
  const defaultOptions = useMemo<FrontLanguageOption[]>(
    () =>
      deck.slug === "numbers"
        ? [
            { value: "number", label: "Front: Number" },
            { value: "english", label: "Front: English" },
          ]
        : [
            { value: "english", label: "Front: English" },
            { value: "french", label: "Front: French" },
          ],
    [deck.slug],
  );

  const availableFrontOptions = frontOptions ?? defaultOptions;
  const initialFrontLanguage = defaultFrontLanguage ?? availableFrontOptions[0]?.value ?? "english";

  const [queue, setQueue] = useState<number[]>(deck.cards.map((card) => card.id));
  const [flipped, setFlipped] = useState(false);
  const [frontLanguage, setFrontLanguage] = useState<FrontLanguage>(initialFrontLanguage);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [rightAnswers, setRightAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [firstPassRemaining, setFirstPassRemaining] = useState<Set<number>>(new Set(deck.cards.map((card) => card.id)));
  const [requiredPasses, setRequiredPasses] = useState<Record<number, number>>({});
  const [reviewAgainSet, setReviewAgainSet] = useState<Set<number>>(new Set());
  const [incorrectCardIds, setIncorrectCardIds] = useState<Set<number>>(new Set());
  const speechSequenceToken = useRef(0);

  const currentCard = queue.length > 0 ? cardMap.get(queue[0]) ?? null : null;
  const previewCards = queue.map((id) => cardMap.get(id)).filter((card): card is FlashcardItem => Boolean(card));
  const isComplete = queue.length === 0;
  const completedCount = deck.cardCount - firstPassRemaining.size;
  const effectiveFrontLanguage = availableFrontOptions.some((option) => option.value === frontLanguage)
    ? frontLanguage
    : (availableFrontOptions[0]?.value ?? "english");

  const handleLanguageChange = (value: FrontLanguage) => {
    if (!availableFrontOptions.some((option) => option.value === value)) {
      return;
    }
    setFrontLanguage(value);
  };

  useEffect(() => {
    const scrollY = window.scrollY;
    const html = document.documentElement;
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyWidth = document.body.style.width;
    const previousHtmlOverflow = html.style.overflow;
    const previousOverscroll = html.style.overscrollBehavior;

    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      const topOffset = document.body.style.top;
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.width = previousBodyWidth;
      html.style.overflow = previousHtmlOverflow;
      html.style.overscrollBehavior = previousOverscroll;

      if (topOffset) {
        const restoredY = Math.abs(parseInt(topOffset, 10)) || 0;
        window.scrollTo(0, restoredY);
      }
    };
  }, []);

  useEffect(() => {
    if (isComplete) {
      return;
    }

    const timerId = window.setInterval(() => {
      setElapsedSeconds((previous) => previous + 1);
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [isComplete]);

  useEffect(() => {
    return () => {
      speechSequenceToken.current += 1;
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const playPronunciation = (card: FlashcardItem) => {
    const audioSource = resolveAudioSource(card.audio ?? "");
    const sequenceToken = speechSequenceToken.current + 1;
    speechSequenceToken.current = sequenceToken;

    if (audioSource) {
      const audio = new Audio(audioSource);
      void audio.play().catch(() => {
        // Ignore autoplay failures; speech synthesis fallback handles pronunciation.
      });
      return;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const soundExamples = card.kind === "sound" ? card.soundExamples ?? [] : [];
      if (soundExamples.length > 0) {
        const speakExample = (index: number) => {
          if (speechSequenceToken.current !== sequenceToken || index >= soundExamples.length) {
            return;
          }

          const utterance = new SpeechSynthesisUtterance(soundExamples[index].french);
          utterance.lang = "fr-FR";
          utterance.rate = 0.88;
          utterance.pitch = 1;
          utterance.onend = () => {
            if (speechSequenceToken.current !== sequenceToken) {
              return;
            }
            window.setTimeout(() => speakExample(index + 1), 320);
          };
          utterance.onerror = () => {
            if (speechSequenceToken.current !== sequenceToken) {
              return;
            }
            window.setTimeout(() => speakExample(index + 1), 220);
          };
          window.speechSynthesis.speak(utterance);
        };

        speakExample(0);
        return;
      }

      if (card.secondaryFrench || card.tertiaryFrench) {
        speakFrenchSequence(
          [card.french, card.secondaryFrench ?? "", card.tertiaryFrench ?? ""],
          sequenceToken,
          speechSequenceToken,
        );
        return;
      }

      const utterance = new SpeechSynthesisUtterance(card.french);
      utterance.lang = "fr-FR";
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleFlip = () => {
    if (!currentCard) {
      return;
    }

    const nextFlipped = !flipped;
    setFlipped(nextFlipped);

    if (nextFlipped) {
      playPronunciation(currentCard);
    }
  };

  const handleAnswer = (isRight: boolean) => {
    if (!currentCard) {
      return;
    }

    const currentId = queue[0];
    const remaining = queue.slice(1);
    const currentRequirement = requiredPasses[currentId] ?? 1;

    setFirstPassRemaining((previous) => {
      if (!previous.has(currentId)) {
        return previous;
      }
      const updated = new Set(previous);
      updated.delete(currentId);
      return updated;
    });

    if (isRight) {
      setRightAnswers((value) => value + 1);

      const remainingRequirement = currentRequirement - 1;
      setRequiredPasses((previous) => {
        const updated = { ...previous };
        if (remainingRequirement > 0) {
          updated[currentId] = remainingRequirement;
        } else {
          delete updated[currentId];
        }
        return updated;
      });

      setQueue(remainingRequirement > 0 ? [...remaining, currentId] : remaining);
    } else {
      setWrongAnswers((value) => value + 1);
      const nextRequirement = Math.min(currentRequirement + 1, 3);

      setIncorrectCardIds((previous) => {
        const updated = new Set(previous);
        updated.add(currentId);
        return updated;
      });

      setReviewAgainSet((previous) => {
        const updated = new Set(previous);
        updated.add(currentId);
        return updated;
      });

      setRequiredPasses((previous) => ({
        ...previous,
        [currentId]: nextRequirement,
      }));

      setQueue(() => {
        const insertionIndex = Math.min(3, remaining.length);
        return [
          ...remaining.slice(0, insertionIndex),
          currentId,
          ...remaining.slice(insertionIndex),
        ];
      });
    }

    setFlipped(false);
    speechSequenceToken.current += 1;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  if (isComplete) {
    const totalAttempts = rightAnswers + wrongAnswers;
    const accuracy = totalAttempts === 0 ? 0 : Math.round((rightAnswers / totalAttempts) * 100);

    let retryIncorrectHref: string | undefined;
    if (enableRetryIncorrect && deck.slug !== "numbers" && incorrectCardIds.size > 0) {
      const baseHref = retryHref ?? `/deck/${deck.slug}`;
      const hrefUrl = new URL(baseHref, "http://local");
      hrefUrl.searchParams.set("retry", "incorrect");
      hrefUrl.searchParams.set("ids", Array.from(incorrectCardIds).join(","));
      retryIncorrectHref = `${hrefUrl.pathname}${hrefUrl.search}`;
    }

    return (
      <ResultsSummary
        totalCards={deck.cardCount}
        rightAnswers={rightAnswers}
        wrongAnswers={wrongAnswers}
        elapsedSeconds={elapsedSeconds}
        reviewAgainCount={reviewAgainSet.size}
        accuracy={accuracy}
        retryHref={retryHref ?? `/deck/${deck.slug}`}
        retryIncorrectHref={retryIncorrectHref}
      />
    );
  }

  return (
    <div className="studySessionRoot">
      <ProgressHeader
        elapsedSeconds={elapsedSeconds}
        completed={completedCount}
        total={deck.cardCount}
        frontLanguage={effectiveFrontLanguage}
        frontOptions={availableFrontOptions}
        onLanguageChange={handleLanguageChange}
      />

      <FlashcardStack
        cards={previewCards}
        frontLanguage={effectiveFrontLanguage}
        isFlipped={flipped}
        onFlip={handleFlip}
        onSwipe={(direction) => handleAnswer(direction === "right")}
      />

      <StudyControls onWrong={() => handleAnswer(false)} onRight={() => handleAnswer(true)} disabled={!currentCard} />
    </div>
  );
}
