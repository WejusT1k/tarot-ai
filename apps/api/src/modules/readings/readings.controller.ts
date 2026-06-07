import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import type { ReadingCard } from '@tarot-ai/types';
import { ReadingsService } from './readings.service';
import { InterpretationService } from './interpretation.service';
import { DrawDto, InterpretDto, ReadingCardDto } from './readings.dto';

const MIN_QUESTION_LENGTH = 5;

@ApiTags('readings')
@Controller('readings')
export class ReadingsController {
  constructor(
    private readonly readingsService: ReadingsService,
    private readonly interpretation: InterpretationService,
  ) {}

  @Post('draw')
  @ApiOperation({
    summary: 'Draw the cards for a spread (no question / AI / persistence yet)',
  })
  @ApiOkResponse({ type: ReadingCardDto, isArray: true })
  draw(@Body() body: DrawDto): Promise<ReadingCard[]> {
    return this.readingsService.draw(body?.spread);
  }

  @Post('interpret')
  @ApiOperation({
    summary: 'Stream an AI reading of an already-drawn spread (separate step)',
  })
  @ApiProduces('text/plain')
  @ApiOkResponse({
    description: 'Plain-text reading, streamed as it is generated.',
  })
  async interpret(
    @Body() body: InterpretDto,
    @Res() res: Response,
  ): Promise<void> {
    const question = body?.question?.trim() ?? '';
    if (question.length < MIN_QUESTION_LENGTH) {
      throw new BadRequestException(
        `Ask a fuller question — at least ${MIN_QUESTION_LENGTH} characters.`,
      );
    }

    const cards = await this.readingsService.resolveInterpretCards(body.cards);

    this.interpretation.streamInto(
      {
        question,
        locale: body.locale ?? 'en',
        spreadType: body.spreadType ?? 'three_card',
        cards,
      },
      res,
    );
  }
}
