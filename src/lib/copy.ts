export type Locale = "en" | "hinglish";

export const copy = {
  meta: {
    title: "J by Jeeru | Xotik Frujus",
    description:
      "Tastes like India. Feels like J. Apple-juice-based fizzy masala drink from Xotik Frujus.",
  },
  header: {
    logo: "J",
    logoSub: "by Jeeru",
    cta: { en: "Meet J", hinglish: "Mil J" },
    menu: { en: "Menu", hinglish: "Menu" },
    language: { en: "EN", hinglish: "HI" },
  },
  chapters: [
    { id: "street", label: { en: "Street", hinglish: "Street" } },
    { id: "factory", label: { en: "Factory", hinglish: "Factory" } },
    { id: "product", label: { en: "J", hinglish: "J" } },
    { id: "ingredients", label: { en: "Taste", hinglish: "Taste" } },
    { id: "attitude", label: { en: "Attitude", hinglish: "Attitude" } },
    { id: "find", label: { en: "Find", hinglish: "Find" } },
  ],
  hero: {
    headline: {
      en: ["Tastes like India.", "Feels like J."],
      hinglish: ["India ka taste.", "J ka mood."],
    },
    cta: { en: "Meet J", hinglish: "Mil J" },
  },
  footer: {
    parent: "Xotik Frujus Pvt Ltd",
    email: "info@xotik.co.in",
    phone: "+91-9029991771",
    compliance: "FSSAI license · HALAL · FDA",
  },
} as const;

export function t<T extends Record<Locale, string>>(block: T, locale: Locale): string {
  return block[locale];
}

export function tLines<T extends Record<Locale, readonly string[]>>(
  block: T,
  locale: Locale,
): readonly string[] {
  return block[locale];
}
