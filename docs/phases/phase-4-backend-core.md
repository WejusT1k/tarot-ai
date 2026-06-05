# Phase 4 — Backend Core

Goal: cards API + readings CRUD + AI integration.

## Tasks
- [ ] `CardsModule` — GET /cards (read-only, from seeded immutable table)
- [ ] `ReadingsModule`
  - [ ] POST /readings — create reading (randomize cards, call AI)
  - [ ] GET /readings/:id — get one reading
  - [ ] GET /readings — list user's readings (paginated)
- [ ] Card randomization — pick N distinct cards, assign reversed flag per card
- [ ] `AiModule` — Anthropic Claude integration (latest model)
  - [ ] Build prompt: question + card names + positions + meanings + **locale**
  - [ ] System prompt: mystical fortune-teller tone, answer in user's locale
  - [ ] Stream response to client (transport per Decision #2)

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
