# Phase 2 — Card Scene (2D)

> **Direction changed (2026-06-05):** originally planned as a 3D Three.js table scene.
> The CSS/3D table was tried on the landing and read as a podium, so the table was removed.
> Cards will be rendered in **2D** and dealt into the empty lower area of the scene.
> Three.js is shelved (see Decision #13); revisit only if 2D proves insufficient.

Goal: the visual centerpiece — cards dealt into the scene, shuffle, deal, flip — in 2D.

## Tasks (2D approach)
- [ ] Card component (2D) — face (card art) + back (card back), flip animation (CSS/Framer Motion)
- [ ] Upright / reversed state
- [ ] Shuffle animation — cards scatter and reassemble
- [ ] Deal animation — cards slide to positions one by one (3-card spread)
- [ ] Layout the dealt cards in the lower area where the table used to be
- [ ] Integrate into `/` and `/reading/[id]`
- [ ] Decide animation lib: CSS-only vs Framer Motion (lean Framer Motion for orchestration)

## Notes
- **Card art: Rider-Waite-Smith (public domain).** Source the 78 card images + a card back.
- Mock the card data here — real randomization comes from backend in Phase 4.
- The scene already reserves the lower ~2/3 (empty gloom) for the cards.

## Superseded (original 3D plan, kept for reference)
- ~~R3F Canvas, top-down camera, PlaneGeometry table, BoxGeometry card meshes,
  @react-three/fiber + drei + @react-spring/three~~ — shelved in favor of 2D.

## Done when
- Shuffle → deal → flip plays smoothly for a 3-card spread with placeholder cards, in 2D.
