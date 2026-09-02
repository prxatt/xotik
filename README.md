# Xotik Frujus — 3D Website Rebrand

Homepage-first rebuild for **J by Jeeru** (Xotik Frujus). Next.js 15, progressive 3D tiers, scroll-driven brand experience.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- Phase 1+: React Three Fiber, GSAP, Blender, img2threejs

## Scripts

```bash
npm run dev      # local dev
npm run build    # production build
npm run lint     # ESLint
```

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Homepage (scroll experience) |
| `/tokens` | Design token verification (dev) |
| `/privacy` | Privacy policy skeleton |
| `/terms` | Terms skeleton |

## Dev: capability tier panel

In development, a bottom-right panel shows detected Tier 0/1/2 and lets you force a tier for testing.

## Assets

See `public/assets/README.md` for the asset inventory and status.

## Phases

- **Phase 0** — Foundation (main)
- **Phase 1.1** — Static shell + header (PR)
- **Phase 1.3** — GSAP scroll parallax on street section (Tier 1/2)
