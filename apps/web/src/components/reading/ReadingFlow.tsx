"use client";

import { useState } from "react";
import { drawReading } from "@/lib/api";
import { CardSpread, type SpreadCard } from "@/components/cards/CardSpread";
import { QuestionInput } from "@/components/ui/QuestionInput";
import styles from "./ReadingFlow.module.scss";

const MIN_QUESTION_LENGTH = 5;

/**
 * Owns the reading flow: the question, validation, the draw request + loading
 * state, and the resulting spread. The page stays a server component; this is
 * the interactive island.
 */
export function ReadingFlow() {
  const [question, setQuestion] = useState("");
  const [cards, setCards] = useState<SpreadCard[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Bumped per draw so CardSpread remounts and re-plays its deal/reveal.
  const [drawId, setDrawId] = useState(0);

  async function handleSubmit() {
    const trimmed = question.trim();
    if (trimmed.length < MIN_QUESTION_LENGTH) {
      setError(
        `Ask a fuller question — at least ${MIN_QUESTION_LENGTH} characters.`,
      );
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const drawn = await drawReading("three_card");
      setCards(drawn.map((c) => ({ card: c.card, reversed: c.isReversed })));
      setDrawId((n) => n + 1);
    } catch {
      setError("The cards are clouded right now — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.foreground}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>The cards are listening</p>
        <h1 className={styles.title}>Ask, and they will answer</h1>
        <QuestionInput
          value={question}
          onChange={(value) => {
            setQuestion(value);
            if (error) setError(null);
          }}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />
      </div>

      <div className={styles.spread}>
        {cards && <CardSpread key={drawId} cards={cards} />}
      </div>
    </div>
  );
}
