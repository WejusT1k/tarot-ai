import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type {
  InterpretCard,
  InterpretRequest,
  Locale,
  ReadingCard,
  SpreadType,
} from '@tarot-ai/types';
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

/** A drawn card referenced by id + orientation, sent to the interpret step. */
export class InterpretCardDto implements InterpretCard {
  @ApiProperty({ example: 1, description: 'Card id (1-78)' })
  cardId!: number;

  @ApiProperty({ example: 'Present' })
  positionName!: string;

  @ApiProperty({ example: false })
  isReversed!: boolean;
}

/** Request body for the separate AI-interpretation step. */
export class InterpretDto implements InterpretRequest {
  @ApiProperty({ example: 'Will my new venture flourish?' })
  question!: string;

  @ApiProperty({ enum: ['en', 'ua'], example: 'en' })
  locale!: Locale;

  @ApiProperty({
    enum: ['single', 'three_card', 'celtic_cross'],
    example: 'three_card',
  })
  spreadType!: SpreadType;

  @ApiProperty({ type: InterpretCardDto, isArray: true })
  cards!: InterpretCardDto[];
}
