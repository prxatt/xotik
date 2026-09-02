/**
 * Scene-level design tokens for scroll chapters.
 * Phase 1.5a — applied site-wide in Phase 1.7 retrofit.
 */
export const sceneTokens = {
  hero: {
    id: "hero",
    chapter: "00",
    bg: "var(--hero-bg)",
    surface: "var(--hero-surface)",
    ink: "var(--hero-ink)",
    accent: "var(--hero-accent)",
    label: "Open",
  },
  street: {
    id: "street",
    chapter: "01",
    bg: "var(--scene-street-bg)",
    surface: "var(--scene-street-surface)",
    ink: "var(--scene-street-ink)",
    accent: "var(--scene-street-accent)",
    label: "Street",
  },
  factory: {
    id: "factory",
    chapter: "02",
    bg: "var(--scene-factory-bg)",
    surface: "var(--scene-factory-surface)",
    ink: "var(--scene-factory-ink)",
    accent: "var(--scene-factory-accent)",
    label: "Factory",
  },
  product: {
    id: "product",
    chapter: "03",
    bg: "var(--scene-product-bg)",
    surface: "var(--scene-product-surface)",
    ink: "var(--scene-product-ink)",
    accent: "var(--j-coral)",
    label: "J",
  },
  taste: {
    id: "ingredients",
    chapter: "04",
    bg: "var(--scene-taste-bg)",
    surface: "var(--scene-taste-surface)",
    ink: "var(--scene-taste-ink)",
    accent: "var(--retro-fuchsia)",
    label: "Taste",
  },
  manifesto: {
    id: "manifesto",
    chapter: "05",
    bg: "var(--scene-manifesto-bg)",
    surface: "var(--scene-manifesto-gold)",
    ink: "var(--scene-manifesto-ink)",
    accent: "var(--scene-manifesto-accent)",
    label: "Attitude",
  },
  cta: {
    id: "find-j",
    chapter: "06",
    bg: "var(--scene-cta-bg)",
    surface: "var(--paper)",
    ink: "var(--scene-cta-ink)",
    accent: "var(--j-blue)",
    label: "Find",
  },
} as const;

export type SceneKey = keyof typeof sceneTokens;

export const retroPalette = [
  { name: "mustard", var: "--retro-mustard", hex: "#E5A020" },
  { name: "terracotta", var: "--retro-terracotta", hex: "#C45A2C" },
  { name: "avocado", var: "--retro-avocado", hex: "#6B8E4E" },
  { name: "royal", var: "--retro-royal", hex: "#2860C8" },
  { name: "fuchsia", var: "--retro-fuchsia", hex: "#C43A7A" },
  { name: "petrol", var: "--retro-petrol", hex: "#1E4D6B" },
] as const;

export const cinePalette = [
  { name: "jaguar", var: "--cine-jaguar", hex: "#040011" },
  { name: "red", var: "--cine-red", hex: "#BA0101" },
  { name: "gold", var: "--cine-gold", hex: "#E99D25" },
  { name: "olive", var: "--cine-olive", hex: "#ADD794" },
] as const;

export const jSpectrum = [
  { name: "coral", var: "--j-coral", hex: "#E84A3A" },
  { name: "orange", var: "--j-orange", hex: "#F28C28" },
  { name: "yellow", var: "--j-yellow", hex: "#F3C743" },
  { name: "green", var: "--j-green", hex: "#2E9B66" },
  { name: "blue", var: "--j-blue", hex: "#2D5BE3" },
  { name: "violet", var: "--j-violet", hex: "#AE3FB6" },
] as const;
