# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

AI tarot reader: the user asks a question, watches a 3-card spread shuffle/deal/flip in 2D,
then can ask the AI to interpret it. Turborepo monorepo: `apps/web` (Next.js), `apps/api`
(NestJS), `packages/types` (shared TS interfaces). Plan, architecture, and a running session
log live in `docs/` — `docs/PROGRESS.md` is the source of truth for what actually exists
(newest entry first); `docs/DECISIONS.md` records *why* (and what superseded earlier plans).

## Commands

```bash
pnpm install                          # pnpm 11; native builds approved via allowBuilds in pnpm-workspace.yaml
pnpm dev                              # web (:3000) + api (:3001) together via turbo
pnpm build / lint / type-check        # all packages, in dependency order
pnpm format                           # prettier write

pnpm --filter @tarot-ai/web dev       # one app only
pnpm --filter @tarot-ai/api dev
```

API (run from `apps/api`, requires Postgres — `docker compose up -d` for local Postgres 17):

```bash
pnpm seed                             # build + seed all 78 cards (idempotent upsert by id)
pnpm migration:generate src/database/migrations/<Name>   # diff entities → new migration
pnpm migration:run                    # apply migrations (against dist/)
pnpm db:deploy                        # migration:run + seed — what the deploy build runs
pnpm test                             # jest; *.spec.ts under src/
pnpm test -- cards.controller         # single test file by name pattern
pnpm test:e2e                         # jest with test/jest-e2e.json
```

Swagger/OpenAPI is at `http://localhost:3001/docs`.

## Build ordering gotcha

`packages/types` compiles to `dist/`, which is **gitignored**. Anything that consumes
`@tarot-ai/types` (both apps) needs that dist built first. `turbo` handles this via
`dependsOn: ["^build"]`, so always build through turbo (`pnpm build`, or
`turbo run build --filter=@tarot-ai/web`) rather than calling `next build` / `nest build`
directly — otherwise the type imports won't resolve. Relative imports inside `packages/types`
use explicit `.js` extensions (CommonJS output consumed by both Nest and Next).

## The reading flow is two separate requests

This is the core architecture and it is deliberately split:

1. **Draw** — `POST /api/readings/draw { spread }`. Backend shuffles the seeded deck
   (Fisher-Yates), picks N distinct cards for the spread's positions, assigns random
   orientation, returns `ReadingCard[]`. **The question is not sent here and is not used** —
   it's validated/held client-side only. The draw is the free "hook".
2. **Interpret** — `POST /api/readings/interpret { question, locale, spreadType, cards }`,
   streamed back as **plain text** (not SSE/JSON). The client sends only card *refs*
   (`cardId`, `positionName`, `isReversed`); the backend re-fetches authoritative meanings
   from the DB so the model never reads client-supplied meaning text. This is the on-demand
   "Interpret with AI" step.

Frontend orchestration lives in `apps/web/src/components/reading/ReadingFlow.tsx` (the one
client island; `page.tsx` stays a server component). The streaming client is
`apps/web/src/lib/api.ts` (`drawReading`, `interpretReading` with an `onDelta` callback).

## AI: Google Gemini via the Vercel AI SDK

Interpretation runs through `@ai-sdk/google` + `streamText` in
`apps/api/src/modules/readings/interpretation.service.ts`, **not** Anthropic — despite some
docs/.env mentioning Claude. Model id from `GOOGLE_AI_MODEL` (default `gemini-2.5-flash`),
key from `GOOGLE_AI_API_KEY` (lazily read, so a missing key only fails when AI is invoked).
The service is stateless: it builds the system + user prompt and pipes the text stream
straight to the Express response. The prompt is locale-aware (`en` | `ua`) and tuned for a
grounded, no-mysticism voice — edit the `systemPrompt`/`userPrompt` methods there.

## Database (TypeORM + Postgres, not Prisma)

- `apps/api/src/database/data-source.ts` is the single `DataSource`, shared by the Nest app,
  the seed script, and the TypeORM CLI. `synchronize` is on **only** when
  `NODE_ENV !== 'production'` — locally it builds the schema for zero setup; in production
  migrations own the schema (the deploy build runs `db:deploy`, runtime never syncs/migrates).
- `cards` is an immutable 1–78 reference table (manual integer PK). Major arcana hand-written,
  minor arcana composed from suit × rank in `database/seeds/cards.data.ts`.
- Managed serverless Postgres (Neon) needs `DATABASE_SSL=true`; use the **pooled** connection
  string. See `apps/api/.env.example`.

## Styling convention (web)

Semantic class names in JSX only — **no Tailwind utilities in markup**. Utilities live in
`*.module.scss` files via `@apply`, with `@reference "...globals.css"` at the top of each
module. The theme palette is declared with `@theme static` in `globals.css`; `static` is
required so palette vars reach the SCSS modules (Tailwind's usage scan can't see raw `var()`
in SCSS). Cards are rendered in **2D with CSS** (a 3D Three.js table was tried and removed —
see Decision #13); the card flip is pure CSS `preserve-3d` + `backface-visibility`.

## Deployment

Two Vercel projects from this one repo: **web** (root dir = repo root, `vercel.json` at root,
`outputDirectory: apps/web/.next`) and **api** (root dir = `apps/api`, NestJS as a single
Fluid-compute Function). Each `vercel.json` build command goes through turbo so
`@tarot-ai/types` builds first. CORS `WEB_ORIGIN` is comma-separated (prod + localhost +
preview URLs).

## Note on docs vs. code

`docs/ARCHITECTURE.md` describes the original plan; several pieces have not been built or were
superseded — there is currently **no i18n/next-intl** wiring, **no auth/users**, **no React
Three Fiber 3D scene**, and the AI is Gemini, not Claude. Trust the code and `docs/PROGRESS.md`
over the aspirational sections of `ARCHITECTURE.md`.
