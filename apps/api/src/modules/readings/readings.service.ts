import { BadRequestException, Injectable } from '@nestjs/common';
import type { InterpretCard, ReadingCard, SpreadType } from '@tarot-ai/types';
import { CardsService } from '../cards/cards.service';
import type { InterpretCardContext } from './interpretation.service';

/** Position labels per spread. The drawn cards map onto these in order. */
const SPREAD_POSITIONS: Record<SpreadType, string[]> = {
  single: ['Present'],
  three_card: ['Past', 'Present', 'Future'],
  celtic_cross: [
    'Present',
    'Challenge',
    'Past',
    'Future',
    'Above',
    'Below',
    'Advice',
    'External',
    'Hopes & Fears',
    'Outcome',
  ],
};

@Injectable()
export class ReadingsService {
  constructor(private readonly cardsService: CardsService) {}

  /** Draw distinct random cards for a spread, each with a random orientation. */
  async draw(spread: SpreadType = 'three_card'): Promise<ReadingCard[]> {
    const positions = SPREAD_POSITIONS[spread];
    if (!positions) {
      throw new BadRequestException(`Unknown spread type: ${spread}`);
    }

    const deck = await this.cardsService.findAll();
    const drawn = this.shuffle(deck).slice(0, positions.length);

    return drawn.map((card, index) => ({
      card,
      position: index,
      positionName: positions[index],
      isReversed: Math.random() < 0.5,
    }));
  }

  /**
   * Resolve client-sent card refs into full card context for interpretation,
   * preserving order. The meanings come from the DB, not the client, so the AI
   * always reads the authoritative deck. Throws NotFound on an unknown id.
   */
  async resolveInterpretCards(
    cards: InterpretCard[],
  ): Promise<InterpretCardContext[]> {
    if (!cards?.length) {
      throw new BadRequestException('No cards provided to interpret.');
    }
    return Promise.all(
      cards.map(async (c) => ({
        card: await this.cardsService.findOne(c.cardId),
        positionName: c.positionName,
        isReversed: c.isReversed,
      })),
    );
  }

  /** Fisher-Yates shuffle on a copy. */
  private shuffle<T>(items: T[]): T[] {
    const a = [...items];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}
