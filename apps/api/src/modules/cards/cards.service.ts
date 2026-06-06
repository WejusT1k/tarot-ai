import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './card.entity';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private readonly cards: Repository<Card>,
  ) {}

  findAll(): Promise<Card[]> {
    return this.cards.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Card> {
    const card = await this.cards.findOne({ where: { id } });
    if (!card) {
      throw new NotFoundException(`Card ${id} not found`);
    }
    return card;
  }

  count(): Promise<number> {
    return this.cards.count();
  }
}
