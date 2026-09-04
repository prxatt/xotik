/**
 * Locked scroll story for the J by Jeeru presentation.
 * Placeholders are intentional — final photo / video / Blender come later.
 *
 * Beat order (do not reorder without updating JourneyCan + chapter header):
 *   00 Hero → 01 Street → 02 Factory → 03 Meet J → 04 Taste → 05 Attitude → 06 Find J
 */

export const SCROLL_STORY = {
  id: "j-by-jeeru-presentation",
  version: 1,
  beats: [
    {
      id: "hero",
      chapter: "00",
      role: "Open on J. Cobalt pride. No product photo required.",
      product: "none",
    },
    {
      id: "street",
      chapter: "01",
      role: "After gully cricket / after the ride — scene for the sip.",
      product: "journey-can-placeholder",
    },
    {
      id: "factory",
      chapter: "02",
      role: "Empty bay on the line. Procedural 3D stand-in OK.",
      product: "factory-line-3d",
    },
    {
      id: "product",
      chapter: "03",
      role: "Meet J. Drink placeholders (Jeeru / Cola / Lemon / PET).",
      product: "drink-placeholders",
    },
    {
      id: "ingredients",
      chapter: "04",
      role: "Taste cards — jeera soul of J.",
      product: "shards-then-hide",
    },
    {
      id: "manifesto",
      chapter: "05",
      role: "Attitude path. Traveler can owns motion.",
      product: "manifesto-traveler",
    },
    {
      id: "find-j",
      chapter: "06",
      role: "Honest contact close. Store map = company rebuild later.",
      product: "ghost-behind-type",
    },
  ],
} as const;

/** DOM ids JourneyCan / header chapter tracking depend on. */
export const STORY_SECTION_IDS = [
  "hero",
  "street",
  "factory",
  "product",
  "ingredients",
  "manifesto",
  "find-j",
] as const;

export type StorySectionId = (typeof STORY_SECTION_IDS)[number];
