import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  createGoogleGenerativeAI,
  type GoogleGenerativeAIProvider,
} from '@ai-sdk/google';
import { streamText } from 'ai';
import type { ServerResponse } from 'node:http';
import type { Card, Locale, SpreadType } from '@tarot-ai/types';

/** One card resolved with its full reference data + how it landed in the spread. */
export interface InterpretCardContext {
  card: Card;
  positionName: string;
  isReversed: boolean;
}

export interface InterpretInput {
  question: string;
  locale: Locale;
  spreadType: SpreadType;
  cards: InterpretCardContext[];
}

/** Human-readable language name fed to the model so it answers in the seeker's tongue. */
const LANGUAGE: Record<Locale, string> = {
  en: 'English',
  ua: 'Ukrainian (українською)',
};

const SPREAD_NAME: Record<SpreadType, string> = {
  single: 'a single-card draw',
  three_card: 'a three-card Past / Present / Future spread',
  celtic_cross: 'a ten-card Celtic Cross',
};

/**
 * Wraps the Gemini model (via the Vercel AI SDK) and the tarot-reader prompt.
 * Stateless: builds a prompt from the resolved cards and streams the reading.
 * This is the separate "Interpret with AI" step — it never draws cards itself.
 */
@Injectable()
export class InterpretationService {
  private readonly logger = new Logger(InterpretationService.name);
  private provider: GoogleGenerativeAIProvider | null = null;

  /** Lazily build the provider so a missing key only fails when AI is actually used. */
  private getProvider(): GoogleGenerativeAIProvider {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new ServiceUnavailableException(
        'AI interpretation is not configured (missing GOOGLE_AI_API_KEY).',
      );
    }
    if (!this.provider) {
      this.provider = createGoogleGenerativeAI({ apiKey });
    }
    return this.provider;
  }

  /** Generate the reading and stream it as plain text straight to the response. */
  streamInto(input: InterpretInput, res: ServerResponse): void {
    const provider = this.getProvider();
    const modelId = process.env.GOOGLE_AI_MODEL ?? 'gemini-2.5-flash';

    const result = streamText({
      model: provider(modelId),
      system: this.systemPrompt(input.locale),
      prompt: this.userPrompt(input),
      temperature: 0.7,
      onError: ({ error }) => {
        this.logger.error('Interpretation stream failed', error as Error);
      },
    });

    result.pipeTextStreamToResponse(res);
  }

  private systemPrompt(locale: Locale): string {
    return [
      'You are a tarot reader who talks like a real, grounded person — not a',
      'fortune-teller caricature. No purple prose, no mystical clichés, no',
      'flattering openers like "dear seeker" or "the cards whisper". Talk plainly,',
      'warmly, the way a sharp friend would — contractions, normal sentences, the',
      'point first. The cards are a mirror for reflection, not fixed fate, and',
      'never medical, legal, or financial certainty.',
      '',
      'Respond in the SAME language the person wrote their question in — mirror it',
      `exactly. If it is genuinely unclear, use ${LANGUAGE[locale]}.`,
      '',
      'How to write it:',
      '- No preamble. Do not greet them, and do not restate or summarise their',
      '  question back to them. Start straight on the first card.',
      '- One tight paragraph per card: what it actually means here, given its',
      '  position and orientation, in concrete terms tied to their situation.',
      '  Treat a reversed card as the blocked or shadow side of its meaning.',
      '- Then a CONCLUSION: 2-4 sentences, no more. A direct, honest answer to',
      '  their question and what to actually do about it. No hedging, no filler,',
      '  no recapping what you just said. If the honest answer is uncertain, say',
      '  so plainly instead of padding. Lead it in with a short natural phrase',
      '  meaning "bottom line" WRITTEN IN THE RESPONSE LANGUAGE (never the English',
      '  words "Bottom line" unless the whole answer is in English).',
      '',
      'Plain prose only — no lists, no headings, no markdown, no emoji. Do not',
      'invent cards beyond those given. Cut any sentence that does not add real',
      'meaning — if it sounds like filler, delete it.',
    ].join('\n');
  }

  private userPrompt(input: InterpretInput): string {
    const cards = input.cards
      .map((c, i) => {
        const orientation = c.isReversed ? 'Reversed' : 'Upright';
        const meaning = c.isReversed
          ? c.card.reversedMeaning
          : c.card.uprightMeaning;
        return [
          `${i + 1}. Position "${c.positionName}" — ${c.card.name} (${orientation})`,
          `   Keywords: ${c.card.keywords.join(', ')}`,
          `   Meaning: ${meaning}`,
        ].join('\n');
      })
      .join('\n');

    return [
      `The seeker asks: "${input.question}"`,
      '',
      `Spread: ${SPREAD_NAME[input.spreadType]}.`,
      'Cards drawn:',
      cards,
      '',
      'Give your reading.',
    ].join('\n');
  }
}
