# Phase 2 — Scroll media pipeline (st-studio → xotik)

This doc maps how **surface-tension-studio** (`~/Desktop/surface-tension-studio`) can feed the xotik scroll journey once branding is locked.

## Assets we have today

| Asset | Path | Use |
|-------|------|-----|
| Street sea link | `public/assets/hero/street-sea-link.jpg` | Street scene BG |
| Street monsoon | `public/assets/hero/street-monsoon-market.jpg` | Street FG parallax |
| Jeeru can | `public/assets/products/xotik-jeeru-can.jpg` | Product + manifesto traveler |

## Pipeline stages (recommended order)

### 1. Image → video (scroll scrub)

Generate short loops from stills (ChatGPT / Gemini / Runway / Kling):

- `street-sea-link.jpg` → 3–5s orbit / slow push-in (street establishes scene)
- `xotik-jeeru-can.jpg` → can rises from street stall (alpha matte)
- Factory still (TBD) → conveyor / steam loop

Wire in xotik with `<video>` + GSAP `ScrollTrigger` scrub on `currentTime` (same pattern as hero pin).

### 2. Image → 3D (can + props)

**st-studio command:**

```bash
cd ~/Desktop/surface-tension-studio/apps/vision
surface-vision image-to-3d \
  --input /path/to/xotik-jeeru-can.jpg \
  --output ./out/jeeru-can \
  --backend auto
```

Doctor check: `surface-vision image-to-3d-doctor`

Export **GLB** → `public/models/jeeru-can.glb` for React Three Fiber pin (tier 2).

### 3. Street → 4DGS splat

**st-studio** already has `city_4dgs_job` (`apps/vision/src/surface_vision/city_4dgs_job.py`).

For xotik street art (not SF ferry hero):

1. Extract 8–12 synthetic views from `street-sea-link.jpg` (orbit / dolly prompts) or shoot a short phone orbit around a print.
2. Run a **light probe** first (see `docs/HERO_V4W_AGENT_HANDOFF.md` gate-probe pattern).
3. Output `city_splat.ply` → convert for web (splat viewer) or bake to video for tier 1.

**KONSTRUCT preview:** `tools/volumetric/open_splat_in_konstruct.sh`

### 4. Integration tiers

| Tier | Street → factory | Product | Ingredients |
|------|------------------|---------|-------------|
| 0 | Static JPG stack | Static can | Static pills |
| 1 | Scrubbed MP4 crossfade | 2D pin zoom | Scroll ingredient reveals |
| 2 | 4DGS / WebGL splat + 3D can | R3F can + path | Particle spice burst |

## Next code hooks in xotik

- `StreetFactoryScene.tsx` — swap `FactoryVisual` placeholder for factory MP4
- `ProductSection.tsx` — optional `<Canvas>` when `tier === 2` and GLB exists
- `public/media/manifest.json` — declare which clips exist per tier (avoid half-baked loads)

## Honesty rule

Do not ship placeholder gradients when a manifest entry promises video/3D/splat. Tier fallback must downgrade to stills automatically.
