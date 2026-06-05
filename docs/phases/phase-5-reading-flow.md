# Phase 5 — Reading Flow Integration

Goal: full user journey works end-to-end (frontend ↔ backend ↔ AI).

## Tasks
- [ ] Frontend calls POST /readings after question submit (sends question + locale)
- [ ] 3D shuffle animation plays while API processes
- [ ] Cards received → deal animation plays
- [ ] Cards flip one by one
- [ ] **Auth gate (teaser):** if guest → show login/register modal (Radix Dialog) instead
      of the interpretation. Cards still deal; the answer is the gated reward.
- [ ] AI response streams in (in user's locale) with reveal animation — for authed users
- [ ] After login mid-reading, resume and reveal the answer for the same reading
- [ ] Save reading button (logged-in users)
- [ ] "Ask another question" reset flow

## Notes
- This is where Phase 1–4 pieces connect. No new infrastructure — wiring + UX timing.
- Tune animation timing so shuffle covers API latency; deal triggers on response.
- Teaser flow: guest sees the full shuffle/deal/flip spectacle, then the modal. The
  delivered magic motivates the signup. Preserve the in-progress reading across login.

## Done when
- A guest asks a question, watches cards deal, hits the login/register modal, signs in,
  and the interpretation reveals — all in their selected language.
- An authed user gets the full flow uninterrupted, with save / ask-again.
