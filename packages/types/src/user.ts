import type { Locale } from './locale.js';

export type AuthProvider = 'google' | 'apple' | 'email';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  locale: Locale;
  createdAt: string; // ISO timestamp
}

/** OAuth account link — separate from User so one user can link many providers. */
export interface Account {
  id: string;
  userId: string;
  provider: AuthProvider;
  providerAccountId: string;
  createdAt: string;
}
