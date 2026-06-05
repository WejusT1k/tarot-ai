import type { Card } from './card.js';
import type { Locale } from './locale.js';

export type SpreadType = 'single' | 'three_card' | 'celtic_cross';

/** A card as it landed in a specific reading — position + orientation. */
export interface ReadingCard {
  card: Card;
  position: number; // 0,1,2...
  positionName: string; // "past" | "present" | "future"
  isReversed: boolean;
}

export interface Reading {
  id: string;
  userId: string | null; // null while guest hasn't logged in yet
  question: string;
  spreadType: SpreadType;
  locale: Locale;
  cards: ReadingCard[];
  aiResponse: string | null; // null until interpretation is generated / unlocked
  createdAt: string; // ISO timestamp
}

/** Payload sent from the frontend to create a reading. */
export interface CreateReadingRequest {
  question: string;
  locale: Locale;
  spreadType?: SpreadType; // defaults to 'three_card'
}
