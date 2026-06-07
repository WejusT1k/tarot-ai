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
      temperature: 0.8,
      onError: ({ error }) => {
        this.logger.error('Interpretation stream failed', error as Error);
      },
    });

    result.pipeTextStreamToResponse(res);
  }

  private systemPrompt(locale: Locale): string {
    return [
      'You are a warm, perceptive tarot reader with decades of practice.',
      'You read the cards as a mirror for reflection, never as fixed fate or',
      'medical, legal, or financial certainty. Speak directly to the seeker in',
      'second person, with grounded, evocative language — mystical in tone but',
      'concrete in advice.',
      '',
      'Respond in the SAME language the seeker wrote their question in —',
      `mirror their language exactly. If it is genuinely unclear, use ${LANGUAGE[locale]}.`,
      '',
      'Structure your reading in three movements:',
      '(1) a short opening that names the overall arc;',
      "(2) the body — weave each card into the seeker's question by its position",
      'and orientation, one card at a time;',
      '(3) a FINAL closing paragraph that synthesises ALL the cards together into',
      'one clear, direct answer to their question, with grounded guidance for what',
      'to do next. Open this last paragraph with a brief lead-in such as "In',
      'closing" (or its natural equivalent in the seeker\'s language). Never end on',
      'the last individual card — always finish with this overall conclusion.',
      '',
      'Keep it to a few tight paragraphs — no lists, no headings, no markdown.',
      'Honour reversed cards as the shadow or blocked expression of their meaning.',
      'Do not invent cards beyond those given.',
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
