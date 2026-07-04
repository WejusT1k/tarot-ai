# Tarot AI — Documentation

> Iterative project docs. Update as we go. Always install the **latest stable** version
> of every tool/lib — never pin to old majors.
> Last updated: 2026-06-05

## Idea

Web app where a user asks a question, the system shuffles and deals tarot cards in a
3D scene (top-down view of a table), and an AI fortune teller interprets the cards in
the context of the question and gives an answer.

## Tech Stack

- **Frontend:** Next.js (latest), TypeScript, Tailwind CSS, Three.js via React Three Fiber
- **UI primitives:** Radix UI (modal, dropdown, etc.), styled to fantasy theme
- **i18n:** next-intl — `en` (default) + `ua` from day one
- **Backend:** NestJS (latest), Prisma, PostgreSQL
- **Auth:** Auth.js (frontend) + Passport.js (backend) — Google first, provider-extensible
- **AI:** Anthropic Claude (latest model)
- **Card art:** Rider-Waite-Smith (public domain)
- **Monorepo:** Turborepo (both frontend + backend in this repo)

## Key UX Decision — Auth-gated answer (teaser)

Guests can ask a question and watch the cards shuffle and deal. The AI interpretation is
gated behind a login/register modal — the magic is the hook, the answer requires auth.

## Doc Index

- [Architecture](./ARCHITECTURE.md) — repo layout, modules, data model
- [Decisions](./DECISIONS.md) — open + resolved decisions log
- [Progress](./PROGRESS.md) — running log of what we did each session

### Phases

- [Phase 0 — Monorepo Setup](./phases/phase-0-monorepo.md)
- [Phase 1 — Frontend Foundation](./phases/phase-1-frontend-foundation.md) ← **start here**
- [Phase 2 — 3D Card Scene](./phases/phase-2-3d-scene.md)
- [Phase 3 — Auth](./phases/phase-3-auth.md)
- [Phase 4 — Backend Core](./phases/phase-4-backend-core.md)
- [Phase 5 — Reading Flow Integration](./phases/phase-5-reading-flow.md)
- [Phase 6 — History & Polish](./phases/phase-6-history-polish.md)
- [Phase 7 — Stretch Features](./phases/phase-7-stretch.md)

## Status Legend

- `[ ]` — not started
- `[~]` — in progress
- `[x]` — done
- `[!]` — blocked / needs decision

## Current Focus

Phase 1 scene + input are done. **Next up: Phase 2 — 2D cards** — build the card component
(face / back, flip), then shuffle + deal into the reserved lower area of the scene.
