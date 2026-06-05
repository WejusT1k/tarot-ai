import { Injectable } from '@nestjs/common';
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@tarot-ai/types';

export interface HealthResponse {
  status: 'ok';
  defaultLocale: Locale;
  supportedLocales: readonly Locale[];
}

@Injectable()
export class AppService {
  getHealth(): HealthResponse {
    return {
      status: 'ok',
      defaultLocale: DEFAULT_LOCALE,
      supportedLocales: LOCALES,
    };
  }
}
