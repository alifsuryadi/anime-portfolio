# CLAUDE.md

Portfolio Alif Suryadi, "Neo-Tokyo at Dusk". Next.js 15 App Router (SSG) + R3F. Full context in `README.md`.

## Rules
- All page text must be in the SSG HTML. Three.js only loads via `dynamic(..., { ssr: false })` inside the single global `<Canvas>` (`components/three/Scene.tsx`). Never add a second canvas.
- Never read `window`/`localStorage` during render; use `useEffect`. Per-frame values go through `lib/scroll-state.ts` (mutable, no React state).
- Choreography (pose, expression, camera per section) lives only in `lib/scenes.config.ts`. Sections opt in with `data-scene="<id>"`.
- Respect the three quality modes (`lib/quality.ts`). Every animation must be off under reduced motion (GSAP `matchMedia` with `MOTION_OK`).
- Decorative Japanese: `aria-hidden` + `lang="ja"`, always with a visible or `sr-only` translation. After adding new Japanese glyphs run `npm run fonts`.
- Characters and assets must be original or properly licensed; record licenses in `CREDITS.md`. No copyrighted anime characters.
- Content lives in `content/*.ts`. Don't invent experience dates or employers.

## Commands
`npm run dev` · `npm run build` · `npm run lint` · `npm run typecheck` · `npm run fonts` · `npm run icons`
