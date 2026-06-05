export type Arcana = 'major' | 'minor';

export type Suit = 'wands' | 'cups' | 'swords' | 'pentacles';

/**
 * A single tarot card from the immutable reference deck (78 cards, Rider-Waite-Smith).
 * Seeded once, never mutated at runtime.
 */
export interface Card {
  id: number; // 1-78
  name: string; // "The Fool", "Ace of Cups"
  arcana: Arcana;
  suit: Suit | null; // null for major arcana
  number: number; // 0-21 major, 1-14 minor
  description: string;
  uprightMeaning: string;
  reversedMeaning: string;
  keywords: string[];
  imageUrl: string;
}
