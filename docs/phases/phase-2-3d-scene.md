# Phase 2 — Card Scene (2D)

> **Direction changed (2026-06-05):** originally planned as a 3D Three.js table scene.
> The CSS/3D table was tried on the landing and read as a podium, so the table was removed.
> Cards will be rendered in **2D** and dealt into the empty lower area of the scene.
> Three.js is shelved (see Decision #13); revisit only if 2D proves insufficient.

Goal: the visual centerpiece — cards dealt into the scene, shuffle, deal, flip — in 2D.

## Tasks (2D approach)
- [x] Card component (2D) — face (card art) + back (CSS card back), 3D flip animation (CSS)
- [x] Upright / reversed state (art rotates 180°, plate stays upright + "Reversed" label)
- [ ] Shuffle animation — cards scatter and reassemble
- [x] Deal animation — cards slide/rotate into place one by one (staggered)
- [x] Layout the dealt cards in the lower area where the table used to be
- [~] Integrate into `/` (done) and `/reading/[id]` (pending)
- [x] Decide animation lib: **CSS-only** (perspective + rotateY flip, keyframe deal) — no Framer Motion needed yet

## Notes
- **Card art: Rider-Waite-Smith (public domain).** Source the 78 card images + a card back.
- Mock the card data here — real randomization comes from backend in Phase 4.
- The scene already reserves the lower ~2/3 (empty gloom) for the cards.

## Superseded (original 3D plan, kept for reference)
- ~~R3F Canvas, top-down camera, PlaneGeometry table, BoxGeometry card meshes,
  @react-three/fiber + drei + @react-spring/three~~ — shelved in favor of 2D.

## Done when
- Shuffle → deal → flip plays smoothly for a 3-card spread with placeholder cards, in 2D.
