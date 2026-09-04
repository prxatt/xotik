# Plan — J by Jeeru (standalone presentation)

**Status:** Active build  
**Date:** 2026-09-03

## What this site is

This repo ships a **J by Jeeru–centered presentation site**.

- It lives **separately and independently** from the full company site.
- It is the scroll “movie”: street → factory → Meet J → taste → attitude → Find J.
- **Xotik Frujus** appears as parent credit (footer, compliance, “from Xotik”), not as the homepage brand.
- It is **not** the full rebrand of [xotik.co.in](https://xotik.co.in).

## What xotik.co.in is (later)

`xotik.co.in` is the **bigger rebuild**: company catalog, hospitality, media, e-shop, full SKU wall — and it will **include** J by Jeeru as one line inside that world.

Do **not** block the J presentation on company-site scope (About, Hospitality, Media Room, 20+ SKUs, dual social chrome).

| Now | Later |
|-----|--------|
| J by Jeeru presentation | Full xotik.co.in rebrand |
| One hero product story | Multi-brand / multi-SKU company site |
| Placeholders OK for drinks | Final photography, video, Blender 3D |
| Contact / soft Find J | Real store map + commerce |

## Media honesty (this phase)

| Media | Now | Later |
|-------|-----|--------|
| Drink stills | Use **all Xotik drink placeholders** we have | Retouch / pack shots |
| Street video | Keep current Cloudinary loop if it helps the story | New cricket / street plates |
| 3D factory can | Procedural stand-in is fine | Blender Jeeru can |
| Characters / Gen-Z cast | Optional later | Wire if attitude needs faces |
| New video / 3D pipeline | Planned, not blocking | Phase 2 media doc |

## Chapter acceptance (presentation)

1. **Hero** — J leads. Cobalt desi-pop. Pocket-Sized Pride.
2. **Street** — Own palette. Cricket / ride energy. Not a hero clone.
3. **Factory** — Empty bay. Motion good; final GLB later.
4. **Meet J** — Flagship can + sibling drink placeholders (Cola, Clear Lemon, PET if useful).
5. **Taste** — Ingredient story for Jeeru; cards OK without pour photography yet.
6. **Attitude** — Manifesto path; characters optional later.
7. **Find J** — Presentation-honest: contact / ask us. Full locator belongs with company rebuild or Phase 2.

## Do next (ordered)

1. ~~Lock the scroll story with placeholders~~ — done (`src/lib/scroll-story.ts` + section-aware `JourneyCan`)
2. Optional light factory polish (still procedural OK)
3. Ship / present J site independently
4. Only then: plan full xotik.co.in rebrand that nests J inside

## Locked scroll beats

| Beat | Section id | Product on screen |
|------|------------|-------------------|
| 00 Open | `#hero` | None (type + stamp) |
| 01 Street | `#street` | Journey can placeholder |
| 02 Factory | street pin → `#factory` | 3D line (journey hidden) |
| 03 Meet J | `#product` | Drink placeholders rail |
| 04 Taste | `#ingredients` | Shards then clear |
| 05 Attitude | `#manifesto` | Manifesto traveler |
| 06 Find | `#find-j` | Ghost can behind type |

## Related docs

- `docs/PHASE-2-MEDIA-PIPELINE.md` — later images / video / 3D
- `/shape` — temporary skeleton with reference assets
- Live catalog remains `https://xotik.co.in` until company rebuild
