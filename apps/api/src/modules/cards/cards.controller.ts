import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CardsService } from './cards.service';
import { Card } from './card.entity';

@ApiTags('cards')
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get()
  @ApiOperation({ summary: 'List the full 78-card deck' })
  @ApiOkResponse({ type: Card, isArray: true })
  findAll(): Promise<Card[]> {
    return this.cardsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single card by id (1–78)' })
  @ApiOkResponse({ type: Card })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Card> {
    return this.cardsService.findOne(id);
  }
}
