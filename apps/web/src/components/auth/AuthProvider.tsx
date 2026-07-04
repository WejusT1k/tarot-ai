'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { LoginRequest, RegisterRequest, UpdateProfileRequest, User } from '@tarot-ai/types';
import { ApiError, fetchMe, loginUser, registerUser, updateProfile } from '@/lib/api';

const TOKEN_KEY = 'tarot-ai.token';

/** guest = definitely signed out; loading = restoring a stored session. */
export type AuthStatus = 'loading' | 'guest' | 'authed';

interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  token: string | null;
  /**
   * Both throw ApiError on failure so forms can show the server's message,
   * and resolve with the fresh bearer token so callers can act on it
   * immediately (context state hasn't re-rendered yet).
   */
  signIn: (request: LoginRequest) => Promise<string>;
  signUp: (request: RegisterRequest) => Promise<string>;
  signOut: () => void;
  /** Persist profile changes and refresh `user`. Throws ApiError on failure. */
  saveProfile: (changes: UpdateProfileRequest) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Client-side session: a JWT in localStorage, validated against /auth/me on
 * load. Purely a UI convenience — the API re-checks the token on every
 * guarded request, so nothing here is trusted server-side.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Restore the stored session once on mount (localStorage is client-only).
  // All setState lands in .then/.catch — nothing synchronous in the effect.
  useEffect(() => {
    let cancelled = false;
    const stored = window.localStorage.getItem(TOKEN_KEY);
    const session = stored
      ? fetchMe(stored).then((me) => ({ token: stored, me }))
      : Promise.resolve(null);

    session
      .then((restored) => {
        if (cancelled) return;
        if (restored) {
          setToken(restored.token);
          setUser(restored.me);
          setStatus('authed');
        } else {
          setStatus('guest');
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        // Only a definite 401 kills the stored token; a network hiccup
        // shouldn't sign the user out — the next load retries.
        if (err instanceof ApiError && err.status === 401) {
          window.localStorage.removeItem(TOKEN_KEY);
        }
        setStatus('guest');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const acceptSession = useCallback((newToken: string, newUser: User) => {
    window.localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(newUser);
    setStatus('authed');
    return newToken;
  }, []);

  const signIn = useCallback(
    async (request: LoginRequest) => {
      const res = await loginUser(request);
      return acceptSession(res.token, res.user);
    },
    [acceptSession],
  );

  const signUp = useCallback(
    async (request: RegisterRequest) => {
      const res = await registerUser(request);
      return acceptSession(res.token, res.user);
    },
    [acceptSession],
  );

  const signOut = useCallback(() => {
    window.localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setStatus('guest');
  }, []);

  const saveProfile = useCallback(
    async (changes: UpdateProfileRequest) => {
      if (!token) throw new ApiError(401, 'Sign in first.');
      setUser(await updateProfile(token, changes));
    },
    [token],
  );

  return (
    <AuthContext.Provider value={{ status, user, token, signIn, signUp, signOut, saveProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
