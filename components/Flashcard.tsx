"use client";

import { useRef, useState } from "react";
import type { FlashcardItem, FrontLanguage } from "@/types/flashcards";

interface FlashcardProps {
  card: FlashcardItem;
  frontLanguage: FrontLanguage;
  isFlipped: boolean;
  isActive: boolean;
  depth: number;
  onFlip: () => void;
  onSwipe: (direction: "left" | "right") => void;
}

const SWIPE_THRESHOLD = 90;

export function Flashcard({
  card,
  frontLanguage,
  isFlipped,
  isActive,
  depth,
  onFlip,
  onSwipe,
}: FlashcardProps) {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const pointerId = useRef<number | null>(null);
  const movedFar = useRef(false);

  const handlePointerDown: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (!isActive) {
      return;
    }

    pointerId.current = event.pointerId;
    startX.current = event.clientX;
    movedFar.current = false;
    setIsDragging(true);
    (event.currentTarget as HTMLDivElement).setPointerCapture(event.pointerId);
  };

  const handlePointerMove: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (!isActive || !isDragging || pointerId.current !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - startX.current;
    if (Math.abs(deltaX) > 8) {
      movedFar.current = true;
    }
    setDragX(deltaX);
  };

  const finishDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isActive || pointerId.current !== event.pointerId) {
      return;
    }

    const shouldSwipe = Math.abs(dragX) >= SWIPE_THRESHOLD;
    const direction = dragX > 0 ? "right" : "left";

    pointerId.current = null;
    setIsDragging(false);
    setDragX(0);

    if (shouldSwipe) {
      onSwipe(direction);
      return;
    }

    if (!movedFar.current) {
      onFlip();
    }
  };

  const frontText =
    frontLanguage === "number"
      ? String(card.numericValue ?? card.english)
      : frontLanguage === "english"
        ? card.english
        : card.french;
  const backText =
    frontLanguage === "french"
      ? card.english
      : card.french;
  const isSoundCard = card.kind === "sound" && (card.soundExamples?.length ?? 0) > 0;
  const hasMultiLineAnswer = Boolean(card.secondaryFrench || card.tertiaryFrench);

  return (
    <div
      className="flashcardLayer"
      style={{
        zIndex: 50 - depth,
        transform: `translateY(${depth * 10}px) scale(${1 - depth * 0.03})`,
        opacity: depth > 2 ? 0 : 1,
      }}
    >
      <div
        className={isActive ? "swipeShell active" : "swipeShell"}
        style={{
          transform: isActive ? `translateX(${dragX}px) rotate(${dragX / 18}deg)` : undefined,
          transition: isDragging ? "none" : "transform 220ms ease",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
      >
        <div className={isFlipped ? "flashcard flipped" : "flashcard"}>
          <div className="cardFace cardFront">
            <span className="faceLabel">{isSoundCard ? "Pattern" : "Prompt"}</span>
            <h3>{frontText}</h3>
            <p className="tapHint">Tap to flip</p>
          </div>
          <div className="cardFace cardBack">
            {isSoundCard ? (
              <>
                <span className="faceLabel">Sound</span>
                <h3>{card.soundHint}</h3>
                <ul className="soundExamplesList" aria-label="Sound examples">
                  {card.soundExamples?.map((example) => (
                    <li key={`${card.id}-${example.french}`}>
                      <strong>{example.french}</strong>
                      <span>{example.english}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <span className="faceLabel">Answer</span>
                {hasMultiLineAnswer ? (
                  <div className="multiAnswerBlock" aria-label="French country and nationalities">
                    <div className="answerLineGroup">
                      <h3>{card.french}</h3>
                      <p className="pronunciationText">{card.pronunciation || card.french}</p>
                    </div>

                    {card.secondaryFrench ? (
                      <div className="answerLineGroup">
                        <h4>{card.secondaryFrench}</h4>
                        <p className="pronunciationText">{card.secondaryPronunciation || card.secondaryFrench}</p>
                      </div>
                    ) : null}

                    {card.tertiaryFrench ? (
                      <div className="answerLineGroup">
                        <h4>{card.tertiaryFrench}</h4>
                        <p className="pronunciationText">{card.tertiaryPronunciation || card.tertiaryFrench}</p>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <>
                    <h3>{backText}</h3>
                    <p className="pronunciationText">Pronunciation: {card.pronunciation || card.french}</p>
                    {card.literalMeaning ? <p className="literalMeaningText">{card.literalMeaning}</p> : null}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
