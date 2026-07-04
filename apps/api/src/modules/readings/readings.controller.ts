import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Response } from 'express';
import type { ReadingCard } from '@tarot-ai/types';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard, type AuthedRequest } from '../auth/jwt-auth.guard';
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
    private readonly auth: AuthService,
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
  // The draw is the free hook; the AI answer requires a signed-in user
  // (Decision #11 — auth-gated teaser).
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Stream an AI reading of an already-drawn spread (separate step)',
  })
  @ApiProduces('text/plain')
  @ApiOkResponse({
    description: 'Plain-text reading, streamed as it is generated.',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing / invalid bearer token — sign in first.',
  })
  async interpret(
    @Req() req: AuthedRequest,
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
    // The seeker's voluntary profile personalizes the prompt. A vanished
    // account shouldn't kill the reading — fall back to an anonymous one.
    const seeker = await this.auth.me(req.user.userId).catch(() => null);

    this.interpretation.streamInto(
      {
        question,
        locale: body.locale ?? 'en',
        spreadType: body.spreadType ?? 'three_card',
        cards,
        seeker,
      },
      res,
    );
  }
}
