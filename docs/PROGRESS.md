# Progress Log

> Running log of what we actually did each session. Newest first.

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
