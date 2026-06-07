# Progress Log

> Running log of what we actually did each session. Newest first.

## 2026-06-07 — Wire frontend → backend draw + deploy prep (Vercel)
- API client `apps/web/src/lib/api.ts`: `drawReading()` → `POST /readings/draw`, base URL from
  `NEXT_PUBLIC_API_URL` (fallback `http://localhost:3001/api`).
- `QuestionInput` is now controlled (value/onChange/onSubmit/loading/error) with a gold "Reveal the
  spread" button: CSS spinner + "Consulting the cards…" while drawing, inline error text,
  field disabled in flight, a11y (aria-busy/aria-invalid).
- `ReadingFlow` (client island, `components/reading/`): owns question/cards/loading/error, validates
  question (**≥5 chars after trim** — empty/short blocked, no request), maps `ReadingCard[]` →
  spread (`isReversed → reversed`), remounts `CardSpread` per draw (`key={drawId}`) to replay the
  deal. `page.tsx` stays a server component (scene + overlays + `<ReadingFlow/>`).
- Layout bug fixed: header + deal were absolutely positioned, so the new button overlapped the
  cards. Moved to a normal flex-column flow (`.foreground` → `.header` + `.spread` flex-1). Cards
  self-size via `width: min(11rem, 27vw, 26dvh)` to fit one screen. Title/eyebrow given explicit
  `width:100%` so they wrap instead of overflowing (the `@apply w-full` wasn't constraining them).
- Verified live: API `/readings/draw` returns 3 cards w/ valid imageUrls; CORS allows :3000;
  card images exist in `public/`; web renders input+button, no cards until drawn.
- Deploy prep: `next build` (prod) is green via `turbo run build --filter=@tarot-ai/web` (builds
  `@tarot-ai/types` dist first — dist is gitignored). Added root `vercel.json` (framework nextjs,
  turbo build command, `outputDirectory: apps/web/.next`) so Vercel builds the monorepo correctly.
- Note: `/readings/draw` still ignores the question text (random draw); question is client-validated
  only.
- **Backend → Vercel prep** (NestJS *is* supported on Vercel now — one Fluid-compute Function;
  Postgres via Neon on the Vercel Marketplace, since Vercel Postgres → Neon in Dec 2024):
  - `apps/api/vercel.json`: `buildCommand` = `cd ../.. && pnpm turbo run build --filter=@tarot-ai/api`
    so `@tarot-ai/types` (dist is gitignored) builds before the Nest function is bundled.
  - `data-source.ts`: `synchronize` now `DB_SYNCHRONIZE === 'true' || NODE_ENV !== 'production'`
    (OFF on the serverless function; opt-in `DB_SYNCHRONIZE=true` for the one-time Neon schema+seed).
    Added env-gated TLS (`DATABASE_SSL=true` for Neon).
  - `main.ts`: CORS `WEB_ORIGIN` is now comma-separated (prod + localhost).
  - `.env.example`: documented Neon pooled string, `DATABASE_SSL`, `DB_SYNCHRONIZE`.
  - Verified: `turbo run build --filter=@tarot-ai/api` green; local API still serves /cards + /draw.
  - Deploy = 2 Vercel projects from this repo (web: root dir = repo root; api: root dir = `apps/api`).
- Deferred: mobile responsive cards as a scrollable vertical list (see phase-2 doc).

## 2026-06-06 — Phase 2 (2D cards): TarotCard component + flip + deal
- `TarotCard` (`apps/web/src/components/cards/`): presentational 2D card. Classic tarot ratio,
  ornate gold/velvet frame, RWS art via `next/image` (fill). Major arcana shows its number on the
  nameplate; minors don't.
- Reversed state: artwork rotates 180°, nameplate stays upright with a "Reversed" label.
- 3D flip (CSS-only, no Framer Motion): `.card` holds the `perspective`, `.flipper` is
  `preserve-3d` + `rotateY`, two `backface-visibility: hidden` faces. Back = the deck's "сорочка"
  drawn in pure CSS (velvet field, gold rim, diamond filigree, conic-gradient occult emblem).
- Deal-in entrance: each card slides/rotates up with a per-card stagger (keyframe `deal`).
- `CardSpread` (client): owns reveal state — deals cards back-up, auto-reveals one by one, and each
  card is clickable / keyboard-accessible (role=button, Enter/Space) to flip back and forth.
  `page.tsx` stays a server component, just passes sample cards.
- Sample 3-card spread on `/`: The Fool (upright), The Star (reversed), Ace of Cups — data mirrors
  the backend seed. Real draw wiring comes in Phase 5.
- Bug fixed: hover put `filter: drop-shadow` on the `preserve-3d` flipper, which flattens the 3D
  context and breaks `backface-visibility` (front leaked through the back on hover). Moved the lift
  to `.card` and the glow to per-face `box-shadow`.
- `prefers-reduced-motion`: deal + flip transitions disabled.
- Next: shuffle animation + `/reading/[id]`, or wire the input → `/readings/draw` (Phase 5).

## 2026-06-06 — Backend: cards + draw (Phase 4 core started)
- DB: Postgres 17 via Docker Compose (`docker-compose.yml`, service `tarot-postgres`, volume `tarot-pgdata`).
- ORM: **TypeORM** chosen over Prisma (native NestJS, decorator entities). Installed @nestjs/typeorm,
  typeorm 1.0, pg, @nestjs/config, dotenv.
- TypeORM wiring: `src/database/data-source.ts` (shared by app + seed), `synchronize: true` in dev
  (switch to migrations before prod — Decision #20). Card `id` is a manual 1–78 PK.
- `Card` entity (id, name, arcana enum, suit enum nullable, number, description, upright/reversed
  meaning, keywords text[], image_url). Implements shared `Card` type.
- `CardsModule`: GET /api/cards, GET /api/cards/:id.
- `ReadingsModule`: POST /api/readings/draw — shuffles deck, draws N distinct cards per spread
  (single / three_card / celtic_cross), assigns random orientation. No question/AI/persistence yet.
- Swagger/OpenAPI at `/docs` (`@nestjs/swagger`); Card entity + DrawDto + ReadingCardDto documented.
- Seed: 78 cards (`src/database/seeds/`). Majors hand-written; minors composed from suit × rank
  archetypes. `pnpm seed` (idempotent upsert by id). Verified endpoints return correct data.
- Card images: store files in `apps/web/public/cards/`, DB holds the relative path (Decision #17),
  format jpg (#18). Fetch script `apps/web/scripts/fetch-cards.sh` pulls the public-domain RWS deck
  from Wikimedia. 68/78 down; 11 hit Wikimedia's 429 rate limit — re-runnable script finishes them.
- Next: finish image fetch; then wire the frontend to the draw endpoint (Phase 5) or add auth/AI.

## 2026-06-05 — Phase 1 UI: gloomy fantasy scene + mystical input
- Built the landing scene with pure CSS: deep gloomy fantasy background (arcane purple haze,
  warm low glow), heavy vignette, film grain. Fonts: Cinzel (display) + EB Garamond (body, has
  Cyrillic for future ua).
- Single mystical `QuestionInput` component (placeholder, focus glow). Wired no-op submit for now.
- Fixed a focus bug: overlays were painted above the input (stealing clicks + dimming it). Now
  interactive content sits above overlays; decorative layers are pointer-events-none.
- Refactored styling: JSX uses semantic class names only; Tailwind utilities live in SCSS modules
  via @apply (@reference + installed `sass`). Theme must be `@theme static` so palette vars reach
  the modules — see [[tailwind-scss-setup]] memory.
- Scene gloom dialed up per user (very dark; only text + (former) table glow out of the pitch).
- Table exploration: tried velvet (purple), dark wood, stone, and a draped red tablecloth with a
  skirt + contact shadow. The 3D-ish table read as a "podium" → **table removed**. Cards will be
  rendered in **2D** in the reserved lower area (Decisions #13). Phase 2 rewritten from 3D→2D.
- Current landing: gloomy bg + title + single input; lower ~2/3 empty, reserved for 2D cards.
- **Next session → Phase 2: 2D cards** — card component (face/back, flip), then shuffle + deal.

## 2026-06-05 — Phase 0 done (monorepo skeleton)
- pnpm chosen as package manager (enabled via corepack). Node 24.
- Set up Turborepo monorepo manually: root package.json, pnpm-workspace.yaml, turbo.json,
  tsconfig.base.json, .prettierrc, .gitignore, .npmrc, root README.
- `packages/types`: shared Card/Reading/User/Locale types, compiled to CommonJS dist
  (works for both CJS Nest and bundled Next). `.js` extensions in relative imports.
- `apps/web`: Next.js 16.2.7 (App Router, TS, Tailwind v4, src-dir). transpilePackages
  includes @tarot-ai/types. Runs on :3000.
- `apps/api`: NestJS 11.1.24 (strict). Global prefix /api, CORS to web origin, port :3001.
  `GET /api/health` uses shared types as proof of wiring.
- Approved native builds (sharp, unrs-resolver, @nestjs/core) in onlyBuiltDependencies.
  Removed a stray nested pnpm-workspace.yaml that create-next-app added in apps/web.
- Verified: `turbo build` = 3/3 success; API boots + health returns locales; web returns 200.
- Prisma + card seed deferred to Phase 4 (frontend-first).
- Next: Phase 1 — Frontend Foundation (i18n en/ua, fantasy theme, fortune teller + input).

## 2026-06-05 — Planning kickoff
- Defined the idea: AI tarot reader with 3D card scene + fantasy fortune-teller UI.
- Chose stack: Next.js + NestJS + Prisma/Postgres, Turborepo monorepo, Three.js (R3F), Claude AI.
- Decided: cards = immutable seeded table; frontend i18n (en/ua) from day one; build frontend first.
- Wrote docs: README, ARCHITECTURE, DECISIONS, and per-phase files (Phase 0–7).
- Resolved: card art = Rider-Waite-Smith (public domain); UI primitives = Radix UI.
- Resolved: anonymous = **teaser auth-gate** — guests can ask + watch cards deal, but the
  AI answer is gated behind a login/register modal (Radix Dialog); reading preserved across login.
- Next: start Phase 1 — Frontend Foundation.
