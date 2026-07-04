# Phase 3 — Auth (Frontend + Backend)

Goal: Google login works end-to-end, session persists. Provider-extensible by design.

## Frontend

- [ ] Auth.js (latest) setup
- [ ] Google OAuth provider config
- [ ] `SessionProvider` in root layout
- [ ] Protected route middleware (`middleware.ts`) — guards `/history`
- [ ] Sign-in page UI (fantasy styled, localized)
- [ ] User avatar / logout in header

## Backend

- [ ] `AuthModule` — Passport.js, Google Strategy
- [ ] `AccountsModule` — separate OAuth `accounts` table (extensible for new providers)
- [ ] JWT access + refresh token flow
- [ ] `UsersModule` — create user on first OAuth login, GET profile, store `locale`
- [ ] Auth guards on protected endpoints

## Notes

- `accounts` table separate from `users` → one user can link multiple providers later.
- Adding Apple / GitHub / Email later = new Passport Strategy + enum entry, nothing else.
- Persist user's locale on login so we can default their reading language.

## Open Decisions referenced

- #11 Anonymous readings — allowed or auth-required? affects `readings.user_id` nullability.

## Done when

- A user can sign in with Google, session persists across reloads, logout works.
- `/history` is protected; unauthenticated users are redirected to sign-in.
