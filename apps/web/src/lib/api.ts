import type {
  AuthResponse,
  InterpretRequest,
  LoginRequest,
  ReadingCard,
  RegisterRequest,
  SpreadType,
  UpdateProfileRequest,
  User,
} from '@tarot-ai/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

/** A failed API call, keeping the HTTP status so callers can react to 401 etc. */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Build an ApiError from a Nest error body ({ message }), with a fallback. */
async function toApiError(res: Response, fallback: string): Promise<ApiError> {
  try {
    const body: unknown = await res.json();
    const message = (body as { message?: unknown })?.message;
    return new ApiError(res.status, typeof message === 'string' && message ? message : fallback);
  } catch {
    return new ApiError(res.status, fallback);
  }
}

async function postJson<T>(path: string, body: unknown, errorFallback: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await toApiError(res, errorFallback);
  return res.json() as Promise<T>;
}

/**
 * Draw the cards for a spread from the backend. The question is validated and
 * held on the client for now — the draw endpoint doesn't consume it yet (the
 * question + AI interpretation get wired in a later phase).
 */
export async function drawReading(spread: SpreadType = 'three_card'): Promise<ReadingCard[]> {
  return postJson('/readings/draw', { spread }, 'Draw request failed');
}

/** Create an email + password account. Returns a bearer token + the user. */
export async function registerUser(request: RegisterRequest): Promise<AuthResponse> {
  return postJson('/auth/register', request, 'Registration failed');
}

/** Sign in with email + password. Returns a bearer token + the user. */
export async function loginUser(request: LoginRequest): Promise<AuthResponse> {
  return postJson('/auth/login', request, 'Sign-in failed');
}

/** Resolve the user behind a stored token (session restore on page load). */
export async function fetchMe(token: string): Promise<User> {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw await toApiError(res, 'Session check failed');
  return res.json() as Promise<User>;
}

/** Save the seeker's profile (only the provided keys change). Returns the refreshed user. */
export async function updateProfile(token: string, changes: UpdateProfileRequest): Promise<User> {
  const res = await fetch(`${API_URL}/auth/profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(changes),
  });
  if (!res.ok) throw await toApiError(res, 'Profile update failed');
  return res.json() as Promise<User>;
}

/**
 * Ask the backend to interpret an already-drawn spread. The reading streams back
 * as plain text; `onDelta` fires with each chunk so the UI can reveal it as the
 * reader "speaks". This is the separate, on-demand AI step — it requires a
 * signed-in user (bearer `token`); a missing/expired one yields a 401 ApiError.
 */
export async function interpretReading(
  request: InterpretRequest,
  token: string,
  onDelta: (delta: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch(`${API_URL}/readings/interpret`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
    signal,
  });

  if (!res.ok || !res.body) {
    throw await toApiError(res, `Interpret request failed (${res.status})`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onDelta(decoder.decode(value, { stream: true }));
  }
}
