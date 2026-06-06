import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { ReadingCard } from '@tarot-ai/types';
import { ReadingsService } from './readings.service';
import { DrawDto, ReadingCardDto } from './readings.dto';

@ApiTags('readings')
@Controller('readings')
export class ReadingsController {
  constructor(private readonly readingsService: ReadingsService) {}

  @Post('draw')
  @ApiOperation({
    summary: 'Draw the cards for a spread (no question / AI / persistence yet)',
  })
  @ApiOkResponse({ type: ReadingCardDto, isArray: true })
  draw(@Body() body: DrawDto): Promise<ReadingCard[]> {
    return this.readingsService.draw(body?.spread);
  }
}
