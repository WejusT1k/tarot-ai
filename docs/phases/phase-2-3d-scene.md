# Phase 2 — 3D Card Scene (Three.js)

Goal: the visual centerpiece — cards on a table, shuffle, deal, flip.

## Tasks
- [ ] Install `@react-three/fiber`, `@react-three/drei`, `@react-spring/three` (all latest)
- [ ] `TarotScene.tsx` — R3F Canvas wrapper, top-down camera with slight tilt
- [ ] `TableSurface.tsx` — PlaneGeometry with dark cloth texture
- [ ] `TarotCard.tsx` — thin BoxGeometry mesh
  - [ ] Face texture (card art) + back texture (card back)
  - [ ] Upright / reversed state
  - [ ] Flip animation (back → face)
- [ ] `ShuffleAnimation.tsx` — cards scatter and reassemble
- [ ] `DealAnimation.tsx` — cards slide to positions one by one (3-card spread)
- [ ] Integrate scene into `/` and `/reading/[id]`

## Open Decisions referenced
- #4 Low-end mobile fallback (2D fallback? feature-detect WebGL?)

## Notes
- **Card art: Rider-Waite-Smith (public domain).** Source the 78 card images + a card back,
  use as face/back textures on the card meshes.
- Drive animations with `@react-spring/three`. Physics (`rapier`) is optional, later.
- Mock the card data here — real randomization comes from backend in Phase 4.

## Done when
- Shuffle → deal → flip plays smoothly for a 3-card spread with placeholder cards.
- Scene degrades gracefully (or has a fallback) on devices without good WebGL.
