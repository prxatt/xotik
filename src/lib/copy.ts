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
    sub: {
      en: "Apple-juice-based fizzy masala drink from Xotik Frujus.",
      hinglish: "Xotik Frujus ka apple-based fizzy masala drink.",
    },
  },
  street: {
    headline: {
      en: ["India doesn't need another flavour.", "It needs more flavour."],
      hinglish: [
        "India ko ek aur flavour nahi chahiye.",
        "India already full flavour hai.",
      ],
    },
  },
  factory: {
    headline: {
      en: ["Big taste.", "Made the modern way."],
      hinglish: ["Bada taste.", "Modern tareeke se bana."],
    },
    micro: {
      en: "Automatic production. Strict quality controls. Built to travel.",
      hinglish: "Automatic production. Strict quality controls. Built to travel.",
    },
  },
  product: {
    headline: { en: "Meet J.", hinglish: "Mil J." },
    body: {
      en: ["Apple juice based.", "Fizzy.", "Masala.", "Very J."],
      hinglish: ["Apple ka twist.", "Masala ka kick.", "Full fizz."],
    },
  },
  ingredients: {
    headline: {
      en: ["Jeera.", "Apple.", "Spice.", "Fizz."],
      hinglish: ["Jeera.", "Seb.", "Masala.", "Full fizz."],
    },
  },
  manifesto: {
    headline: {
      en: ["Six colours.", "One attitude."],
      hinglish: ["Chhe colours.", "Ek attitude."],
    },
    sub: {
      en: ["Born Indian.", "Made to go everywhere."],
      hinglish: ["Desi dil.", "Global scene."],
    },
  },
  cta: {
    primary: { en: "Find J near you", hinglish: "J paas mein kahan milega?" },
    secondary: { en: "Explore Xotik", hinglish: "Explore Xotik" },
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
