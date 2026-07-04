'use client';

import Image from 'next/image';
import type { CSSProperties } from 'react';
import type { Card } from '@tarot-ai/types';
import styles from './TarotCard.module.scss';

interface TarotCardProps {
  card: Card;
  /** Drawn reversed — the art is flipped 180° and the meaning inverts. */
  reversed?: boolean;
  /** Face-up when true; otherwise the card back ("сорочка") faces the viewer. */
  revealed?: boolean;
  /** Click / Enter / Space flips the card. */
  onActivate?: () => void;
  /** Stagger for the deal-in animation, in ms. */
  dealDelay?: number;
}

/**
 * A single 2D tarot card with a 3D flip: starts back-up, rotates to reveal the
 * Rider-Waite-Smith art. Purely presentational — the parent owns reveal state
 * (see CardSpread). Reversed cards rotate the artwork while keeping the plate
 * legible.
 */
export function TarotCard({
  card,
  reversed = false,
  revealed = false,
  onActivate,
  dealDelay = 0,
}: TarotCardProps) {
  const interactive = Boolean(onActivate);

  return (
    <div
      className={styles.card}
      style={{ '--deal-delay': `${dealDelay}ms` } as CSSProperties}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-pressed={interactive ? revealed : undefined}
      aria-label={
        revealed ? `${card.name}${reversed ? ', reversed' : ''}` : 'Face-down card — flip to reveal'
      }
      onClick={onActivate}
      onKeyDown={(e) => {
        if (interactive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onActivate?.();
        }
      }}
    >
      <div className={styles.flipper} data-revealed={revealed || undefined}>
        {/* Back — the deck's сорочка, shown before the reveal */}
        <div className={`${styles.face} ${styles.back}`}>
          <div className={styles.backFrame}>
            <span className={styles.backEmblem} aria-hidden />
            <span className={styles.backFiligree} aria-hidden />
          </div>
        </div>

        {/* Front — the card art and nameplate */}
        <div className={`${styles.face} ${styles.front}`}>
          <article className={styles.frame} data-reversed={reversed || undefined}>
            <div className={styles.imageWrap}>
              <Image
                src={card.imageUrl}
                alt={card.name}
                fill
                sizes="(max-width: 640px) 60vw, 240px"
                className={styles.image}
              />
              <span className={styles.sheen} aria-hidden />
            </div>

            <div className={styles.plate}>
              {card.arcana === 'major' && <span className={styles.number}>{card.number}</span>}
              <h3 className={styles.name}>{card.name}</h3>
              {reversed && <span className={styles.reversed}>Reversed</span>}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
