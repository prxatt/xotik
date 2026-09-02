export type Locale = "en" | "hinglish";

export const copy = {
  meta: {
    title: "J by Jeeru | Pocket-Sized Pride",
    description:
      "Apple juice. Masala fizz. Very desi. Very J. The fizzy masala drink from Xotik Frujus.",
  },
  header: {
    logo: "J",
    logoSub: "by Jeeru",
    cta: { en: "Meet J", hinglish: "Mil J" },
    menu: { en: "Menu", hinglish: "Menu" },
    language: { en: "EN", hinglish: "HI" },
  },
  chapters: [
    { id: "street", label: { en: "Street", hinglish: "Gully" } },
    { id: "factory", label: { en: "Factory", hinglish: "Factory" } },
    { id: "product", label: { en: "J", hinglish: "J" } },
    { id: "ingredients", label: { en: "Taste", hinglish: "Taste" } },
    { id: "manifesto", label: { en: "Attitude", hinglish: "Swag" } },
    { id: "find-j", label: { en: "Find", hinglish: "Find" } },
  ],
  hero: {
    devanagariAccent: "जेब में J",
    headline: {
      en: ["POCKET-SIZED", "PRIDE."],
      hinglish: ["जेब में J.", "FULL scene."],
    },
    receipt: { en: "01 · J · Xotik Frujus", hinglish: "01 · J · Xotik Frujus" },
    ribbon: "J BY JEERU · XOTIK FRUJUS · DESI POP · ",
    garnish: {
      top: {
        en: "Gully cricket ke baad, cycle ride ke baad.",
        hinglish: "Gully cricket ke baad, cycle ride ke baad.",
      },
      box: {
        en: "Before fancy drinks… there was J.",
        hinglish: "Fancy drinks se pehle… bas J tha.",
      },
    },
    stamp: { en: "पूरा FIZZ", hinglish: "पूरा FIZZ" },
    cta: { en: "Meet J", hinglish: "Mil J" },
    sub: {
      en: "Apple juice. Masala fizz. Very desi. Very J.",
      hinglish: "Apple ka twist. Masala ka kick. Poora fizz. Poora scene.",
    },
  },
  street: {
    headline: {
      en: ["GULLY CRICKET", "KE BAAD.", "FULL FLAVOUR."],
      hinglish: [
        "Gully cricket ke baad,",
        "cycle ride ke baad,",
        "bas J chahiye.",
      ],
    },
    scroll: { en: "Scroll ↓", hinglish: "Neeche ↓" },
  },
  factory: {
    headline: {
      en: ["BIG TASTE.", "MODERN LINE."],
      hinglish: ["Bada swaad.", "Nayi machine."],
    },
    micro: {
      en: "Warm batch · Strict QC · Built to travel",
      hinglish: "Garam batch · Saf quality · Door tak ready",
    },
  },
  ingredients: {
    headline: {
      en: ["JEERA.", "APPLE.", "SPICE.", "FIZZ."],
      hinglish: ["JEERA.", "SEB.", "MASALA.", "FIZZ."],
    },
    items: [
      {
        id: "jeera",
        name: { en: "Jeera", hinglish: "Jeera" },
        note: { en: "Masala soul", hinglish: "Masala ki jaan" },
        bg: "#6b8e4e",
        ink: "#e5a020",
      },
      {
        id: "apple",
        name: { en: "Apple", hinglish: "Seb" },
        note: { en: "Fruit base", hinglish: "Fruit ka base" },
        bg: "#2d5be3",
        ink: "#ffe94a",
      },
      {
        id: "spice",
        name: { en: "Spice", hinglish: "Masala" },
        note: { en: "Gully kick", hinglish: "Gully wala kick" },
        bg: "#c45a2c",
        ink: "#fff9e9",
      },
      {
        id: "fizz",
        name: { en: "Fizz", hinglish: "Fizz" },
        note: { en: "Full scene", hinglish: "Poora scene" },
        bg: "#ff2d95",
        ink: "#040011",
      },
    ],
  },
  product: {
    headline: { en: "MEET J.", hinglish: "MIL J." },
    body: {
      en: ["FIZZY.", "MASALA.", "VERY J."],
      hinglish: ["FULL FIZZ.", "MASALA KICK.", "BOHOT J."],
    },
    variants: [
      { id: "jeeru", label: { en: "Jeeru Masala", hinglish: "Jeeru Masala" } },
      { id: "cola", label: { en: "Xotik Cola", hinglish: "Xotik Cola" } },
      { id: "lemon", label: { en: "Clear Lemon", hinglish: "Clear Lemon" } },
    ],
  },
  manifesto: {
    headline: {
      en: ["SIX COLOURS.", "ONE ATTITUDE."],
      hinglish: ["CHHE RANG.", "EK SWAG."],
    },
    sub: {
      en: ["DESI BORN.", "GO EVERYWHERE."],
      hinglish: ["DESI DIL.", "GLOBAL SCENE."],
    },
    intro: {
      en: "THE J MANIFESTO",
      hinglish: "J KA MANIFESTO",
    },
    stops: [
      {
        id: "pocket",
        label: { en: "J MANIFESTO · 01 / 05", hinglish: "J MANIFESTO · 01 / 05" },
        title: { en: "POCKET-SIZED PRIDE", hinglish: "JEB MEIN J" },
        body: {
          en: "Small bottle. Big scene. J fits the gully, the ride home, and every pocket that needs fizz.",
          hinglish: "Chhoti bottle. Bada scene. Gully se ghar tak — jeb mein poora fizz.",
        },
      },
      {
        id: "desi",
        label: { en: "J MANIFESTO · 02 / 05", hinglish: "J MANIFESTO · 02 / 05" },
        title: { en: "DESI BORN", hinglish: "DESI DIL" },
        body: {
          en: "Masala memory. Apple twist. Made for streets that never stay quiet.",
          hinglish: "Masala yaad. Apple ka twist. Un gulliyon ke liye jo kabhi chup nahi hoti.",
        },
      },
      {
        id: "colours",
        label: { en: "J MANIFESTO · 03 / 05", hinglish: "J MANIFESTO · 03 / 05" },
        title: { en: "SIX COLOURS", hinglish: "CHHE RANG" },
        body: {
          en: "Coral. Orange. Yellow. Green. Blue. Violet. One brand, full spectrum attitude.",
          hinglish: "Coral se violet tak — ek brand, poora rang, poora swag.",
        },
      },
      {
        id: "fizz",
        label: { en: "J MANIFESTO · 04 / 05", hinglish: "J MANIFESTO · 04 / 05" },
        title: { en: "FULL FIZZ", hinglish: "POORA FIZZ" },
        body: {
          en: "Not shy. Not subtle. Crack the seal — the scene starts now.",
          hinglish: "Sharmao mat. Daba kholo — scene abhi shuru.",
        },
      },
      {
        id: "everywhere",
        label: { en: "J MANIFESTO · 05 / 05", hinglish: "J MANIFESTO · 05 / 05" },
        title: { en: "GO EVERYWHERE", hinglish: "GLOBAL SCENE" },
        body: {
          en: "From Xotik Frujus to your hand. Desi pop that travels.",
          hinglish: "Xotik Frujus se tumhare haath tak. Desi pop jo door jaaye.",
        },
      },
    ],
    oathBridge: {
      label: { en: "✦ PRINCIPLES DONE ✦", hinglish: "✦ RULES KHATAM ✦" },
      headline: { en: "NOW TAKE", hinglish: "AB LE LO" },
      headlineAccent: { en: "THE OATH", hinglish: "J KI KASAM" },
      sub: {
        en: "Hover each line — this is what J stands for.",
        hinglish: "Har line pe hover karo — J ka matlab yahi hai.",
      },
    },
    oath: [
      {
        main: { en: "DRINK IT", hinglish: "PIYO" },
        reveal: { en: "BEFORE IT'S COOL", hinglish: "COOL BANNE SE PEHLE" },
      },
      {
        main: { en: "SHAKE IT", hinglish: "HILAO" },
        reveal: { en: "EVEN IF IT FIZZES OVER", hinglish: "CHAHE BAHAR AA JAYE" },
      },
      {
        main: { en: "SHARE IT", hinglish: "BAANTO" },
        reveal: { en: "ESPECIALLY WITH RIVALS", hinglish: "RIVALS KE SAATH BHI" },
      },
      {
        main: { en: "LOUD IT", hinglish: "CHILLAO" },
        reveal: { en: "THEN DRINK IT AGAIN", hinglish: "PHIR SE PIYO" },
      },
      {
        main: { en: "JUST J", hinglish: "BAS J" },
        reveal: { en: "POCKET-SIZED PRIDE", hinglish: "JEB MEIN FULL SCENE" },
      },
    ],
  },
  cta: {
    primary: { en: "Find J near you", hinglish: "J kahan milega?" },
    secondary: { en: "The Xotik story", hinglish: "Xotik ki baat" },
    stores: {
      en: "Full store map launches in Phase 2. For now, reach us to find J near you.",
      hinglish: "Store map Phase 2 mein. Abhi J dhundhne ke liye humse baat karo.",
    },
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
