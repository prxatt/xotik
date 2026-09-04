# Factory hyperreal — phased plan

**Status:** Phase 6 delivered — lower-third tray / pack story (awaiting visual OK)  
**Date:** 2026-09-03  
**Camera / travel:** KEEP current angle + belt direction  
**Phase 0 spec:** `docs/FACTORY-PHASE-0-SPEC.md`

## Locked decisions (from your answers)

| Q | Choice | Meaning |
|---|--------|---------|
| 1 | D | Max realism; weak devices get video fallback of the *same* shot |
| 2 | Hybrid + kitbash test | Code belt/packer + mid-quality can GLB; try free industrial GLBs — you view; keep code if kitbash fails |
| 3 | B + D | Mid-line empty bay story + far-end **carton case packer** + lower-third tray/pack action |
| 4 | Belt-led motion | Nothing random spins. Belt is the hero motion. Stations only move when functionally needed (no toy flailing) |
| 5 | C + D | Mostly aluminum; every 3rd labeled; labels cycle Jeeru / Cola / Lemon placeholders |
| 6 | A | Continuous ambient loop (seamless) |
| 7 | D + A | Hollywood cinematic: warm tungsten on belt + cobalt rim / brand key |
| 8 | Same scene or MP4 | Best WebGL possible; else scroll-driven video of the same composition (3G / phones ~≤₹14k) |
| 9 | One chunk at a time | You approve visually before next chunk |
| 10 | Parallel Blender | Glass bottle + PET bottle + slim can; Japanese drink packaging as primary shape/feel reference |

## Non‑negotiable (your supply-chain note)

**Cans must never glitch through cartons.**  
No jump-cuts into boxes. Packing = real spatial path: approach → align → enter open flap / tray → settle. If a carton is closed, cans go **around / before / after**, never through.

## Motion rules (clarified)

- **Belt moves.** Cans ride it (translate along path). No idle Y-spin.
- **Empty bay:** can **pauses** under the head (your Q4-B), then continues — pause is belt-synced, not a scale-pop.
- **Packer / carton:** only purposeful actuation (flaps, pusher, tray index) timed to can arrival.
- **No** vanishing via `scale=0`, **no** teleport recycle in-frame.

---

## Chunk plan (approve → implement → you review → next)

### Phase 0 — Spec freeze + references *(DONE)*
**Deliverable:** `docs/FACTORY-PHASE-0-SPEC.md` — beat sheet, carton rules, fallback matrix, Blender brief.

### Phase 1 — Kill glitches *(DONE)*
**Goal:** Same camera; belt feels industrial and continuous.  
**Done in code:**
- Continuous endless belt (no pause); stamp dips as cans pass under
- Recycle only at **ENTER_X / EXIT_X** (±7.6, off-camera)
- No decorative Y-spin; upright translate only
- Solid lid + finished stamp head; black bay boxes removed
- Scrolling tread texture + spinning rollers
- Arming hysteresis; can seating on deck

### Phase 2 — Hollywood light + materials *(DONE)*
**Goal:** Cinematic grade without changing angle.  
**Done in code:**
- Warm tungsten practicals along belt
- Cobalt / brand rim key + soft fill
- Stronger metal PBR on cans; darker graded fog
- Contact shadows / ground contact kept

### Phase 3 — Product read on the line *(DONE)*
**Goal:** Cans read as product; seal is a clear beat.  
**Done in code:**
- Dual-hit bay pause (~1.05s): hit1 high rim → hit2 final rim + brand label
- Bay clear nudge — no single-can stamp lock
- Brand wrap labels (Jeeru / Cola / Lemon) + Xotik logo — not product photo stills
- Flat lid (no pop-up innards); can does not squash on hit
- Boosted Phase 2 tungsten + cobalt + denser fog

### Phase 4 — Kitbash machine test *(DONE — kept)*
**Goal:** View industrial filler candidate at the bay.  
**Done in code:**
- Code kitbash filler bay (rails, housing, pipes, tungsten bulbs)
- Side-by-side with stamp head  
**Decision:** Kept (you said it’s what we needed).

---

### Phase 5 — Carton case packer *(in progress — small chunks)*
**Goal:** Open carton at far end; cans pack in for real; never clip cardboard.

#### Chunk 5a — Open carton placement *(DONE — this pass)*
What 5a is:
- Place an **open** cardboard case **beside** the belt (camera side), not behind it / not clipped
- Flaps open; aperture faces the belt (ready for packing later)
- **J by Jeeru** branding on the carton faces (same brand language as can labels)
- Kitbash legs on back rail only (belt free to move)
- Scroll travel along the line to preview the carton (hold at bay first, then pan — no entry snap-back)

What 5a is **not**:
- Cans do **not** enter the box yet
- No pusher / guide animation yet

#### Chunk 5b — Guide & align *(DONE)*
What 5b is:
- **Labeled** sealed cans only divert toward the carton
- Continuous path onto pusher pad
- Visible guide rails + pusher pad

#### Chunk 5c — Enter, flip-jump & close *(DONE — this pass)*
What 5c is:
- Hollow carton cavity (open top + open belt face, no solid front wall)
- From pusher pad: **360° flip + arc jump** into the case; settle upright
- Carton flaps **close on scroll** after line-pan finishes (before next section)
- No new packs while closing

**You confirm 5c:** done — Phase 6 started.

---

### Phase 6 — Lower-third tray / pack story (Q3-D) *(DONE — refined)*
What 6 is:
- Kraft **3-pack trays** in the lower third — **same footprint** as the line carton
- Three can wells at the same pitch as the packer
- Walls fold as trays pass the bay; seal dwell finishes the form
- Line carton holds **3 labeled cans**, then **auto-closes** and applies **J by Jeeru packaging tape**
- After a short hold, pack resets for the next 3-pack loop

**You confirm 6:** “6 LOOKS GOOD” then Phase 7 (or fixes).

---

### Phase 7 — Mobile / video fallback *(gate #7)*
**Goal:** Q8 — same shot for everyone.  
**Do:**
- Capability gate: WebGL scene vs scroll-driven MP4  
- Record/export fallback from the approved WebGL look (or matched render)  
- Scrub on scroll for low-end / 3G  

**Done when:** Weak phone still gets the factory movie, not a broken canvas.

---

### Phase 8 — Blender parallel merge *(when assets ready)*
**Goal:** Q10 — swap generic can → final Jeeru can; PET + glass ready for later chapters / variants.  
**Do:**
- Japanese-inspired silhouette + print feel  
- Draco + Cloudinary  
- Drop into factory instances + Meet J / journey as needed  

**Done when:** Presentation uses final shapes without redoing the line choreography.

---

## Explicitly out of scope until you say so
- Changing camera angle or belt direction  
- Full xotik.co.in company rebuild  
- Path-traced live scroll (stills only if we ever need a poster)  
- Jumping to Phase 5+ before you approve earlier gates  

## How we work
1. ~~Phases 0–4~~ kept.  
2. Phase 5 in **small chunks** (5a → 5b → 5c).  
3. Visual OK each chunk before the next.

## Phase 6 confirmation
Reply with one:
- **6 LOOKS GOOD** — move to Phase 7 (mobile / video fallback)  
- **6 FIX:** …  
- **HOLD**
