# Tarot AI

AI tarot reader: ask a question, watch the cards shuffle and deal in a 3D scene, and an
AI fortune teller interprets them. See [docs/](docs/) for the full plan and architecture.

## Monorepo

```
apps/web      — Next.js frontend (App Router, TypeScript, Tailwind)
apps/api      — NestJS backend (TypeScript, Prisma — added in Phase 4)
packages/types — shared TypeScript types (Card, Reading, User, Locale)
```

Tooling: pnpm workspaces + Turborepo.

## Prerequisites
- Node.js >= 20 (tested on 24)
- pnpm (via `corepack enable pnpm`)

## Setup
```bash
pnpm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

## Develop
```bash
pnpm dev          # runs web (:3000) + api (:3001) together via turbo
```

Individual apps:
```bash
pnpm --filter @tarot-ai/web dev
pnpm --filter @tarot-ai/api dev
```

## Other scripts
```bash
pnpm build        # build all packages in dependency order
pnpm lint         # lint all
pnpm type-check   # type-check all
pnpm format       # prettier write
```

## Health check
With the API running: `curl http://localhost:3001/api/health`
