import manifest from "../../public/media/manifest.json";
import { cloudinaryRawUrl } from "@/lib/cloudinary";

export const mediaManifest = manifest;

/** Cloudinary public IDs — see public/media/manifest.json for tier availability. */
export const STREET_SCROLL_VIDEO_ID = manifest.street.scrollVideo.publicId;
export const STREET_SCROLL_VIDEO_DURATION = manifest.street.scrollVideo.durationSeconds;
export const STREET_SCROLL_POSTER = manifest.street.scrollVideo.poster;
export const STREET_SCROLL_FPS = 24;

/** Kept for later Blender swap — not loaded in the current presentation UI. */
export const BOTTLE_GLB_URL = cloudinaryRawUrl(
  manifest.models.bottle.publicId,
  manifest.models.bottle.version,
);
export const BOTTLE_GLB_FALLBACK = "/models/j-bottle-draco.glb";

export const JEERU_CAN = {
  id: "jeeru",
  src: "/assets/products/xotik-jeeru-can.jpg",
  alt: "J by Jeeru Masala slim can",
  label: { en: "Jeeru Masala", hinglish: "Jeeru Masala" },
  role: "flagship" as const,
};

/** Xotik drink placeholders for the J presentation — final art later. */
export const DRINK_PLACEHOLDERS = [
  JEERU_CAN,
  {
    id: "cola",
    src: "/assets/products/xotik_cola_real.jpg",
    alt: "Xotik Cola can",
    label: { en: "Xotik Cola", hinglish: "Xotik Cola" },
    role: "sibling" as const,
  },
  {
    id: "lemon",
    src: "/assets/products/xotik-jeeru-clear-lemon.jpg",
    alt: "Xotik Clear Lemon can",
    label: { en: "Clear Lemon", hinglish: "Clear Lemon" },
    role: "sibling" as const,
  },
  {
    id: "pet",
    src: "/assets/products/Xotic-Jeeru-pet-real-label.png",
    alt: "J by Jeeru PET bottle label",
    label: { en: "Jeeru PET", hinglish: "Jeeru PET" },
    role: "format" as const,
  },
] as const;

export type DrinkPlaceholderId = (typeof DRINK_PLACEHOLDERS)[number]["id"];

export function drinkById(id: DrinkPlaceholderId) {
  return DRINK_PLACEHOLDERS.find((drink) => drink.id === id) ?? JEERU_CAN;
}

export function mediaAvailableForTier(
  entry: { tiers: readonly number[] } | undefined,
  tier: number,
): boolean {
  return Boolean(entry?.tiers.includes(tier));
}
