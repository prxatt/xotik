# Phase 2 — Scroll media pipeline (st-studio → xotik)

This doc maps how **surface-tension-studio** (`~/Desktop/surface-tension-studio`) can feed the xotik scroll journey once branding is locked.

## Assets we have today

| Asset | Path | Use |
|-------|------|-----|
| Street sea link | `public/assets/hero/street-sea-link.jpg` | Street scene BG + video poster |
| Street monsoon | `public/assets/hero/street-monsoon-market.jpg` | Street FG parallax |
| Jeeru can | `public/assets/products/xotik-jeeru-can.jpg` | Product + manifesto traveler |
| Street scroll video | Cloudinary `xotik/media/street/chai-stall-monsoon-breeze` | Tier 1/2 scroll scrub (CDN) |

## Pipeline stages (recommended order)

### 1. Image → video (scroll scrub)

Generate short loops from stills (Kling / Runway) → upload to **Cloudinary** for CDN delivery:

- `street-sea-link.jpg` → Kling rough gen → `xotik/media/street/chai-stall-monsoon-breeze` on Cloudinary
- `xotik-jeeru-can.jpg` → can rises from street stall (alpha matte)
- Factory still (TBD) → conveyor / steam loop

Delivery URL pattern (auto quality, H.264, 1920w cap):

`https://res.cloudinary.com/<cloud>/video/upload/q_auto:good,f_mp4,vc_auto,w_1920/<public_id>`

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

- `StreetFactoryScene.tsx` — street MP4 scrub (Phase 2a: 1:1 `currentTime`, native 1280w). Factory is a real-can belt until a factory MP4 exists — do not add a fake video entry.
- `public/models/j-bottle-draco.glb` — Khronos WaterBottle, Draco + WebP (~81 KB). CDN: `xotik/models/j-bottle-draco.glb` on Cloudinary.
- `BottlingLineCanvas` — real WebGL bottling line (cloned bottles, empty bay, steel belt).
- `JourneyCan` — same GLB travels the scroll, always behind copy.
- `public/media/manifest.json` — declare which clips exist per tier (avoid half-baked loads)

## Phase 2a (in progress)

Done in product: street seek no longer GSAP-tweens `currentTime`; delivery stays at source 1280×720; monsoon overlay is lighter so the clip can read; factory gradient placeholder replaced with a Jeeru conveyor; product chapter pins the can.

Still later: factory MP4, image-to-3D GLB, 4DGS splat.

## Honesty rule

This Phase 2 doc is **later media**. The active product is the **J by Jeeru standalone presentation** — see `docs/PLAN-J-BY-JEERU.md`.

Until Blender / new plates land: use existing Xotik drink stills as placeholders. Do not invent fake factory MP4s or store maps. The full xotik.co.in rebrand is a separate project that will include J; it is not this presentation’s scope.

Do not ship placeholder gradients when a manifest entry promises video/3D/splat. Tier fallback must downgrade to stills automatically.
