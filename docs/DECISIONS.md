# Decisions Log

> Resolved and open decisions. Add new rows as questions come up.
> Last updated: 2026-06-05

## Resolved
| # | Decision | Choice | Date |
|---|----------|--------|------|
| 1 | Spread type for MVP | 3-card (past / present / future) | 2026-06-05 |
| 7 | Localization | Frontend i18n via next-intl, `en` (default) + `ua` from day one | 2026-06-05 |
| 8 | Repo layout | Single monorepo (Turborepo), frontend + backend together | 2026-06-05 |
| 9 | Cards storage | Immutable seeded reference table, never mutated at runtime | 2026-06-05 |
| 10 | Build order | Frontend first, then backend | 2026-06-05 |
| 3 | Card images source | **Rider-Waite-Smith (public domain)** — free to use, fast start | 2026-06-05 |
| 11 | Anonymous readings | **Auth-gated answer (teaser):** guest can type a question and the cards deal, but the AI interpretation is gated behind a login/register modal. The shuffle/deal is the hook; the answer requires auth. | 2026-06-05 |
| 12 | UI component library | **Radix UI** (primitives) for modal, dropdown, etc., styled to fantasy theme | 2026-06-05 |

## Open
| # | Decision | Notes |
|---|----------|-------|
| 2 | AI streaming transport | SSE vs WebSocket — decide in Phase 4 |
| 4 | Low-end mobile fallback for Three.js | 2D fallback? feature-detect WebGL? — decide in Phase 2 |
| 5 | Public readings | Anyone with link vs owner-only |
| 6 | Localized card text | Per-locale card text in DB vs AI translates at interpretation time (leaning AI) |
