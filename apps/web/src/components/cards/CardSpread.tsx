'use client';

import { useEffect, useState } from 'react';
import type { Card } from '@tarot-ai/types';
import { TarotCard } from './TarotCard';
import styles from './CardSpread.module.scss';

export interface SpreadCard {
  card: Card;
  reversed?: boolean;
}

interface CardSpreadProps {
  cards: SpreadCard[];
  /** Per-card stagger for the deal-in, in ms. */
  dealStagger?: number;
  /** Delay after the deal before cards auto-flip, in ms. */
  revealAfter?: number;
}

/**
 * Deals a row of cards back-up, then auto-reveals them one by one. Each card is
 * also clickable to flip back and forth. Owns the reveal state so TarotCard can
 * stay presentational.
 */
export function CardSpread({ cards, dealStagger = 140, revealAfter = 650 }: CardSpreadProps) {
  const [revealed, setRevealed] = useState<boolean[]>(() => cards.map(() => false));

  // Staggered auto-reveal after the deal settles.
  useEffect(() => {
    const timers = cards.map((_, i) =>
      setTimeout(
        () =>
          setRevealed((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          }),
        revealAfter + i * dealStagger,
      ),
    );
    return () => timers.forEach(clearTimeout);
  }, [cards, dealStagger, revealAfter]);

  const toggle = (i: number) =>
    setRevealed((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });

  return (
    <div className={styles.spread}>
      {cards.map(({ card, reversed }, i) => (
        <TarotCard
          key={card.id}
          card={card}
          reversed={reversed}
          revealed={revealed[i]}
          onActivate={() => toggle(i)}
          dealDelay={i * dealStagger}
        />
      ))}
    </div>
  );
}
