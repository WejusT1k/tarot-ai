# Phase 1 — Frontend Foundation ← START HERE

Goal: the fantasy shell — layout, fonts, color palette, i18n, empty pages.

## Tasks
- [ ] Install Radix UI primitives (latest) — base for modal, dropdown, etc.
- [ ] i18n setup (`next-intl`, latest) — `[locale]` routing, `en` + `ua` catalogs
- [ ] Locale detection middleware (URL → cookie → Accept-Language → default `en`)
- [ ] Language switcher in header (persists to cookie)
- [ ] Choose fantasy fonts — **must include Cyrillic glyphs** for `ua` (verify charset)
- [ ] Tailwind theme — dark mystical palette (deep purples, golds, blacks)
- [ ] Global layout component (background, ambient styling)
- [ ] Fortune teller artwork on mystical background
- [ ] Fantasy-styled Input component (the single question input)
- [ ] Pages scaffold (all under `[locale]`):
  - [ ] `/` — main page (fortune teller + single input)
  - [ ] `/reading/[id]` — active reading page
  - [ ] `/history` — past readings (protected, wired in Phase 3)
  - [ ] `/sign-in` — auth page (wired in Phase 3)
- [ ] All UI strings come from translation catalogs — no hardcoded text
- [ ] Responsive shell verified on mobile

## Notes
- This phase is pure visual + structural. No 3D yet (Phase 2), no auth (Phase 3),
  no real data (Phase 4). Use placeholders / mock data.
- Keep the single-input concept sacred: one mystical input, fortune teller asking
  the question. No clutter.

## Done when
- Both `en` and `ua` render with translated strings and a working switcher.
- The landing page shows the fortune teller + the single fantasy input.
- Routes exist (even if empty) and navigation works.
