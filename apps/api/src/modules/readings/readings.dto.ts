import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { ReadingCard, SpreadType } from '@tarot-ai/types';
import { Card } from '../cards/card.entity';

export class DrawDto {
  @ApiPropertyOptional({
    enum: ['single', 'three_card', 'celtic_cross'],
    default: 'three_card',
    description: 'Which spread to draw. Defaults to three_card.',
  })
  spread?: SpreadType;
}

/** One drawn card in its spread position. */
export class ReadingCardDto implements ReadingCard {
  @ApiProperty({ type: Card })
  card!: Card;

  @ApiProperty({
    example: 0,
    description: 'Zero-based position index in the spread',
  })
  position!: number;

  @ApiProperty({ example: 'Past' })
  positionName!: string;

  @ApiProperty({
    example: false,
    description: 'true if the card landed reversed',
  })
  isReversed!: boolean;
}
