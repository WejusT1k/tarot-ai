# Phase 0 — Monorepo Setup

Goal: working skeleton, both apps run, shared types wired up.
Install the **latest stable** version of everything.

Package manager: **pnpm** (via corepack). Versions used: Next 16.2.7, NestJS 11.1.24,
Turbo 2.9.16, TypeScript 6.0.3.

## Tasks
- [x] `git init` + `.gitignore`
- [x] Turborepo init (pnpm workspaces + turbo.json — set up manually, not create-turbo)
- [x] `apps/web` — Next.js (App Router, TypeScript, Tailwind v4, src-dir, @/* alias)
- [x] `apps/api` — NestJS (TypeScript, strict)
- [x] `packages/types` — shared TS interfaces (Card, Reading, User, Locale) → compiled to CJS dist
- [x] Prettier config at root; ESLint configs per app from scaffolders
- [x] `.env.example` files for both apps
- [x] Verify: full `turbo build` passes (types → api → web), both apps boot
- [ ] Prisma setup in `apps/api` — schema + first migration → **deferred to Phase 4**
- [ ] Seed script for 78 tarot cards (`prisma/seed.ts`) → **deferred to Phase 4**

## Notes
- Backend deferred — frontend is being built first. Monorepo shell is up so shared
  `packages/types` is available to the frontend now.
- `packages/types` compiles to CommonJS `dist/` (works for both CJS Nest + bundled Next).
  Relative imports use `.js` extensions (required by nodenext/node16 resolution).
- API runs on **:3001** under global prefix `/api`; web on **:3000**. CORS allows web origin.
- Proof of wiring: `GET /api/health` returns shared-type data
  `{"status":"ok","defaultLocale":"en","supportedLocales":["en","ua"]}`.
- create-next-app dropped a nested `pnpm-workspace.yaml` in apps/web — removed it (it
  conflicted with the root workspace's build allowlist).
- Native build scripts approved in root `pnpm-workspace.yaml` `onlyBuiltDependencies`:
  sharp, unrs-resolver, @nestjs/core.

## Done when
- [x] `turbo` builds both apps without error.
- [x] `packages/types` is importable from both `apps/web` and `apps/api`.
