# Factory Phase 0 — Spec freeze

**Status:** COMPLETE (movie of the line locked)  
**Date:** 2026-09-03  
**Code changes in this phase:** none (docs only)

Camera and travel are **locked**:
- Camera ≈ `[5.9, 2.55, 7.1]`, fov `28`, look-at belt center `(0, 0.52, 0)`
- Belt runs along **+X** (viewer’s left → right / into the far case zone)
- Do not change angle or direction without a new approved phase

---

## 1. Line beat sheet (left → right)

One continuous ambient loop. Time below is **relative within one cycle** (not scroll time).

| Beat | Zone (approx X) | What happens | What must NOT happen |
|------|-----------------|--------------|----------------------|
| **B0 Enter** | far left / off-cam → visible | Cans appear from off-camera left, seated on belt, upright | Teleport into frame; scale-pop in |
| **B1 Cruise** | left → mid | Steady belt translate only. Aluminum majority. Every 3rd can shows a placeholder label (Jeeru → Cola → Lemon cycle) | Y-spin, bounce, flicker |
| **B2 Bay pause** | mid (x ≈ 0) | Can under filler/cap head **pauses** briefly (empty-bay story: “one open bay”), then resumes | `scale=0` vanish; jump-cut; can clipping the head volume in a glitchy way |
| **B3 Cruise out** | mid → right | Resume belt motion toward packer | Random station thrashing |
| **B4 Case pack** | far right | **Open** carton waits. Guide/pusher moves can(s) on a **real path** into the case. Flaps stay open until seated | Passing through closed cardboard; jump-cut into box; z-fighting inside walls |
| **B5 Case settle** | far right | Packed unit holds or indexes slightly; next open case ready | Can intersecting carton mesh |
| **B6 Lower pack** | lower third of frame | Tray / multipack action synced to belt timing (visual “bottom does packaging”) | Stealing focus from copy; clutter over factory headline |
| **B7 Recycle** | off-camera only | Instances recycle **outside** frustum (left of enter or past exit) | Mid-frame modulo pop |

### Story copy alignment (already on site)
- Headline: **BIG TASTE. ONE OPEN BAY.** → Beat **B2**
- Micro: empty bay then Meet J → B2 → later scroll to `#product`
- Factory handoff chip: **INTO THE LINE** → user is watching B0–B6

### Composition map (what the camera should “read”)

```
        [ tungsten practicals on belt ]
   LEFT cruise ──► BAY PAUSE ──► CASE (open) ──► RIGHT / exit
                         │
                         ▼
              lower-third TRAY / pack (B6)
        [ cobalt cinematic rim / brand key ]
```

---

## 2. Carton / packaging rules (non‑negotiable)

### Hard rules
1. **Never** allow a can volume to intersect a **closed** carton solid.
2. **Never** jump-cut a can from belt into the interior of a box.
3. Packing always uses an **open** aperture (open top or open flaps).
4. Path is continuous: approach → align → enter → settle.
5. If timing is wrong, the can **waits on the belt** — it does not clip through to “catch up.”

### Allowed carton states
| State | Cans may… |
|-------|-----------|
| Flaps open / top open | Enter along approved path |
| Flaps closing | Only if can is already fully inside free volume |
| Flaps closed / sealed | Not interact; next can waits or next open case indexes in |

### Anti-glitch checklist (Phase 5 acceptance)
- [ ] Slow-mo / scrub: can silhouette never crosses cardboard walls
- [ ] No one-frame teleport into case
- [ ] No `scale` tricks to hide intersections
- [ ] Recycle only off-camera

---

## 3. Motion & animation rules

| Element | Motion |
|---------|--------|
| Belt surface | Continuous loop (scroll does **not** scrub the belt in Tier 2; ambient loop) |
| Cans | Translate with belt; pause at bay; path into open case |
| Filler/cap head | Minimal functional motion only (optional dip/seal cue tied to pause) |
| Case flaps / pusher | Actuate only on pack beats |
| Tray station | Index / form timed to arrivals |
| Camera | Fixed (presentation lock) |

**Forbidden:** decorative spinning cans, scale-pop empty bay, in-frustum instance recycle, path-tracer as live scroll renderer.

---

## 4. Product / label rules (placeholders until Blender)

| Rule | Spec |
|------|------|
| Default can | Brushed aluminum (unlabeled) |
| Labeled cadence | Every **3rd** can |
| Label set (cycle) | Jeeru Masala → Xotik Cola → Clear Lemon (from existing placeholder stills as textures in later phases) |
| Formats later | Slim can (line hero now); PET + glass from Blender track for Meet J / variants later |

---

## 5. Lighting grade (Phase 2 target — freeze look direction)

| Layer | Role |
|-------|------|
| Warm tungsten | Practicals along belt — metal reads expensive |
| Cobalt / brand rim | Hollywood key / edge — J cinematic, not documentary gray |
| Soft contact / soft shadows | Ground the line; avoid harsh acne |
| Controlled fog | Depth only; don’t milk out the packer |

---

## 6. Fallback matrix (capability)

Maps to existing tiers + your low-end / 3G rule.

| Device class | Detection (intent) | Factory delivery |
|--------------|--------------------|------------------|
| **Tier 2** — desktop / strong laptop | Current Tier 2 | Full WebGL line, best DPR/shadows we can afford |
| **Tier 1** — mid mobile / weaker GPU | Current Tier 1 | **Same scene**, reduced DPR, fewer cans, lighter shadows |
| **Tier 0 / 3G / ≈≤₹14k class phones** | Tier 0 or explicit “can’t sustain WebGL” gate | **Scroll-driven MP4** of the **same camera composition** (not a different edit) |
| `prefers-reduced-motion` | OS setting | Static beauty frame or paused first frame of fallback |

### Fallback video requirements (Phase 7)
- Same angle / framing as WebGL
- Seamless loop or long enough to scrub across factory pin
- Scrub via `currentTime` throttled seek (same lesson as street video — no GSAP tween on `currentTime`)
- Poster = first frame matching grade

---

## 7. Asset strategy freeze

| Track | Phase | Asset |
|-------|-------|--------|
| A Code | 1–2, 5–6 | Belt, bay, packer, tray built/upgraded in R3F |
| B Mid can GLB | 3 | Generic slim can (instanced) + label UVs |
| C Kitbash test | 4 | 1–2 free industrial machines — **you view**; keep or kill |
| D Blender parallel | 8 (merge) | Final Jeeru **can** + **PET** + **glass** |
| E Fallback plate | 7 | MP4/WebM from approved look |

---

## 8. Blender brief (parallel — does not block Phase 1)

### Goal
Three hero vessels for J by Jeeru / Xotik Frujus presentation, web-ready later:

1. **Slim can** (factory line + Meet J + journey)  
2. **PET plastic bottle** (format honesty / variants)  
3. **Glass bottle** (premium / legacy format storytelling)

### Design north star — Japanese drink packaging
Use Japanese RTD / convenience-shelf discipline as the **primary** shape and feel reference (not European craft beer cans, not US soda clichés):

- Clean silhouette, confident proportions, pocketable  
- Label as a designed surface (tight registration, strong type hierarchy) — art can be placeholder  
- Material truth: aluminum vs PET translucency vs glass weight/refraction  
- Avoid cartoon taper; avoid Khronos water-bottle silhouette  

Reference homework (mood, not copy): Japanese canned coffee / tea / sparkling RTD, konbini shelf density, matte vs gloss print finishes.

### Technical export (when ready)
- GLB, Draco compressed  
- Reasonable poly for instancing (can) / hero close-up (bottle)  
- UVs for label swaps  
- Cloudinary `xotik/models/…` + `public/media/manifest.json`  
- Apache-safe or original IP only  

### Success test
Side-by-side with current lathe can: silhouette and metal/plastic/glass read as “real product on a shelf,” not a demo primitive.

---

## 9. Phase gate checklist

### Phase 0 done when you say
> **Yes — this is the movie of the line.**

Optional edit replies:
- **PHASE 0 EDITS:** …
- **CHANGE BEAT:** …

### Next (only after that)
**Phase 1 — Kill glitches** on `:6363` (no carton yet, no kitbash yet).

---

## 10. Current vs target (cheat sheet)

| Now | Target after full plan |
|-----|------------------------|
| Scale-pop empty bay | Pause under bay |
| Lathe cans + Y spin | GLB cans, belt translate only |
| Dead floor | Case packer + lower tray |
| Carton risk = clip/jump | Open-case path only |
| One WebGL path | WebGL + same-shot video fallback |
| No Blender brief | Can + PET + glass, JP-inspired |
