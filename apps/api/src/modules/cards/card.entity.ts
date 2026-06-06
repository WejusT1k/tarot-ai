import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import type { Arcana, Card as CardType, Suit } from '@tarot-ai/types';

/**
 * Immutable reference deck (78 Rider-Waite-Smith cards). Seeded once, never mutated.
 * `id` is a stable 1-78 key assigned by the seed, not auto-generated.
 */
@Entity('cards')
export class Card implements CardType {
  @ApiProperty({ example: 1, description: 'Stable 1–78 id' })
  @PrimaryColumn('int')
  id!: number;

  @ApiProperty({ example: 'The Fool' })
  @Column('varchar')
  name!: string;

  @ApiProperty({ enum: ['major', 'minor'], example: 'major' })
  @Column({ type: 'enum', enum: ['major', 'minor'] })
  arcana!: Arcana;

  @ApiProperty({
    enum: ['wands', 'cups', 'swords', 'pentacles'],
    nullable: true,
    description: 'null for major arcana',
  })
  @Column({
    type: 'enum',
    enum: ['wands', 'cups', 'swords', 'pentacles'],
    nullable: true,
  })
  suit!: Suit | null;

  @ApiProperty({
    example: 0,
    description: '0–21 for major, 1–14 for minor (Ace=1…King=14)',
  })
  @Column('int')
  number!: number;

  @ApiProperty({
    example:
      'A carefree wanderer steps toward a cliff edge, open to the unknown.',
  })
  @Column('text')
  description!: string;

  @ApiProperty({
    example:
      'New beginnings, spontaneity, and a leap of faith into the unknown.',
  })
  @Column('text', { name: 'upright_meaning' })
  uprightMeaning!: string;

  @ApiProperty({
    example: 'Recklessness, naivety, and fear of taking the first step.',
  })
  @Column('text', { name: 'reversed_meaning' })
  reversedMeaning!: string;

  @ApiProperty({
    example: ['beginnings', 'spontaneity', 'innocence'],
    type: [String],
  })
  @Column('text', { array: true })
  keywords!: string[];

  @ApiProperty({ example: '/cards/major/00-the-fool.jpg' })
  @Column('varchar', { name: 'image_url' })
  imageUrl!: string;
}
