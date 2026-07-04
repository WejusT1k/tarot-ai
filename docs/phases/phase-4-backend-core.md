# Phase 4 — Backend Core

Goal: cards API + readings + AI integration. ORM: **TypeORM** + Postgres (Docker Compose).

## Tasks

- [x] Postgres via Docker Compose + TypeORM wiring (data-source, ConfigModule)
- [x] `Card` entity + seed 78 cards (`pnpm seed`, idempotent)
- [x] `CardsModule` — GET /cards, GET /cards/:id (read-only, from seeded immutable table)
- [x] Card draw — pick N distinct cards, assign reversed flag per card
- [x] `ReadingsModule` — POST /readings/draw (shuffle + draw, no persistence yet)
- [x] Swagger / OpenAPI docs at `/docs` (`@nestjs/swagger`, DTOs + entity documented)
- [ ] Persisted readings (needs auth/users): POST /readings (create + store), GET /readings/:id,
      GET /readings (list user's, paginated)
- [ ] `AiModule` — Anthropic Claude integration (latest model)
  - [ ] Build prompt: question + card names + positions + meanings + **locale**
  - [ ] System prompt: mystical fortune-teller tone, answer in user's locale
  - [ ] Stream response to client (transport per Decision #2)
- [ ] Switch `synchronize` → TypeORM migrations before prod (Decision #20)

## Open Decisions referenced

- #2 AI streaming transport (SSE vs WebSocket)
- #6 Localized card text (per-locale in DB vs AI translates) — leaning AI translates
- #11 Anonymous readings — affects whether POST /readings requires auth

## Notes

- Use the latest Claude model. Check the claude-api skill for current model ids/pricing
  before wiring the AI call.
- The reading's `locale` is sent from the frontend and stored on the reading.

## Done when

- POST /readings returns randomized cards + a localized AI interpretation.
- Readings persist and are listable per user.
