import type { Locale } from './locale.js';

export type AuthProvider = 'google' | 'apple' | 'email';

export const GENDERS = ['female', 'male', 'other'] as const;
export type Gender = (typeof GENDERS)[number];

export const RELATIONSHIP_STATUSES = ['single', 'partnered', 'married', 'complicated'] as const;
export type RelationshipStatus = (typeof RELATIONSHIP_STATUSES)[number];

/** The life areas a reading can lean into — multi-select on the profile. */
export const FOCUS_AREAS = [
  'love',
  'career',
  'finances',
  'health',
  'family',
  'growth',
  'spirituality',
] as const;
export type FocusArea = (typeof FOCUS_AREAS)[number];

/**
 * Optional background the seeker shares to sharpen readings. Everything is
 * voluntary/nullable; the birth date additionally yields the zodiac sign and
 * tarot birth card server-side at interpretation time.
 */
export interface UserProfile {
  birthDate: string | null; // ISO date (YYYY-MM-DD)
  gender: Gender | null;
  about: string | null; // self-description, free text
  occupation: string | null;
  relationshipStatus: RelationshipStatus | null;
  focusAreas: FocusArea[];
}

/** PATCH /auth/profile body — only the provided keys are updated. */
export interface UpdateProfileRequest {
  birthDate?: string | null;
  gender?: Gender | null;
  about?: string | null;
  occupation?: string | null;
  relationshipStatus?: RelationshipStatus | null;
  focusAreas?: FocusArea[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  locale: Locale;
  createdAt: string; // ISO timestamp
  profile: UserProfile;
}

/** OAuth account link — separate from User so one user can link many providers. */
export interface Account {
  id: string;
  userId: string;
  provider: AuthProvider;
  providerAccountId: string;
  createdAt: string;
}

/** Email + password sign-up payload. */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

/** Email + password sign-in payload. */
export interface LoginRequest {
  email: string;
  password: string;
}

/** What /auth/register and /auth/login return: a bearer token + the user. */
export interface AuthResponse {
  token: string;
  user: User;
}
