# Progress Log

> Running log of what we actually did each session. Newest first.

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
