/**
 * Locale copy — single source for EN vs HI.
 *
 * EN (default): clean English. Hindi/Hinglish only as tiny accents.
 *   Keep Pocket-Sized Pride. Keep जेब में J under the hero stack.
 *   Brand words stay: Jeera, J, fizz, masala. Gully is the one street loanword.
 *
 * HI: same layout as EN. Swap key phrases — not a full rewrite.
 *   Hero poster is जेब में J. Chapter labels are Devanagari.
 *
 * Stamp पूरा FIZZ is identical in both modes.
 * Toggle stays EN / HI (HI = Hinglish, not pure Hindi).
 */

export type Locale = "en" | "hinglish";

export const DEFAULT_LOCALE: Locale = "en";

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
    toggle: { en: "EN / HI", hinglish: "HI / EN" },
  },
  chapters: [
    { id: "street", label: { en: "Street", hinglish: "गली" } },
    { id: "factory", label: { en: "Factory", hinglish: "फैक्टरी" } },
    { id: "product", label: { en: "J", hinglish: "J" } },
    { id: "ingredients", label: { en: "Taste", hinglish: "स्वाद" } },
    { id: "manifesto", label: { en: "Attitude", hinglish: "अंदाज़" } },
    { id: "find-j", label: { en: "Find", hinglish: "खोज" } },
  ],
  hero: {
    /** EN-only wink under the English stack. Empty in HI — the headline is already Devanagari. */
    devanagariAccent: { en: "जेब में J", hinglish: "" },
    headline: {
      en: ["POCKET-", "SIZED", "PRIDE."],
      hinglish: ["जेब में J"],
    },
    receipt: { en: "01 · J · Xotik Frujus", hinglish: "01 · J · Xotik Frujus" },
    ribbon: "J BY JEERU · XOTIK FRUJUS · DESI POP · ",
    garnish: {
      top: {
        en: "Gully cricket ke baad, cycle ride ke baad.",
        hinglish: "Gully cricket ke baad, cycle chala ke baad.",
      },
      box: {
        en: "Before fancy drinks… there was J.",
        hinglish: "Fancy drinks se pehle… bas J tha.",
      },
    },
    stamp: { en: "पूरा FIZZ", hinglish: "पूरा FIZZ" },
    cta: { en: "Meet J", hinglish: "Mil J" },
    handoff: { en: "STREET SCENE ↓", hinglish: "GULLY SCENE ↓" },
    sub: {
      en: "Apple juice. Masala fizz. Very desi. Very J.",
      hinglish: "Apple ka twist. Masala ka kick. Poora fizz. Poora scene.",
    },
  },
  street: {
    headline: {
      en: ["AFTER GULLY", "CRICKET.", "AFTER THE RIDE.", "FULL FLAVOUR."],
      hinglish: ["GULLY CRICKET", "KE BAAD.", "RIDE KE BAAD.", "FULL FLAVOUR."],
    },
    scroll: { en: "Keep scrolling", hinglish: "Aage badho" },
    note: {
      en: "The match ends. J opens.",
      hinglish: "Match khatam. J khulo.",
    },
    factoryHandoff: { en: "SCROLL ALONG THE LINE", hinglish: "LINE KE SAATH SCROLL" },
  },
  factory: {
    headline: {
      en: ["BIG TASTE.", "ONE OPEN BAY."],
      hinglish: ["Bada swaad.", "Ek khali jagah."],
    },
    micro: {
      en: "Warm batch. Sealed. One empty bay — then Meet J.",
      hinglish: "Garam batch. Seal band. Ek khali jagah — phir Mil J.",
    },
  },
  ingredients: {
    eyebrow: { en: "TASTE · XOTIK FRUJUS", hinglish: "SWAAD · XOTIK FRUJUS" },
    headline: {
      en: ["JEERA.", "APPLE.", "SPICE.", "FIZZ."],
      hinglish: ["JEERA.", "SEB.", "MASALA.", "FIZZ."],
    },
    lead: {
      en: "Everyone knows Jeeru. This is the masala soul inside every sip of J.",
      hinglish: "Sabko Jeeru pata hai. Har sip mein yahi masala ki jaan hai.",
    },
    jeeruBadge: { en: "★ THE ONE THEY KNOW", hinglish: "★ JO SAB JAANTE HAIN" },
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
        bg: "#e8f0d4",
        ink: "#2a4414",
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
        bg: "#1e4d6b",
        ink: "#add794",
      },
    ],
  },
  product: {
    lineLabel: { en: "The J line", hinglish: "J ki line" },
    variants: [
      {
        id: "jeeru",
        label: { en: "Jeeru Masala", hinglish: "Jeeru Masala" },
        billboard: { en: "JEERU MASALA", hinglish: "JEERU MASALA" },
        tag: { en: "Flagship", hinglish: "Asli" },
      },
      {
        id: "cola",
        label: { en: "Xotik Cola", hinglish: "Xotik Cola" },
        billboard: { en: "XOTIK COLA", hinglish: "XOTIK COLA" },
        tag: { en: "Deep pour", hinglish: "Deep pour" },
      },
      {
        id: "lemon",
        label: { en: "Clear Lemon", hinglish: "Clear Lemon" },
        billboard: { en: "CLEAR LEMON", hinglish: "CLEAR LEMON" },
        tag: { en: "Bright cut", hinglish: "Tez cut" },
      },
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
    hoverHint: {
      en: "HOVER EACH LINE",
      hinglish: "HAR LINE PE HOVER",
    },
    stops: [
      {
        id: "pocket",
        label: { en: "J MANIFESTO · 01 / 05", hinglish: "J MANIFESTO · 01 / 05" },
        title: { en: "POCKET-SIZED PRIDE", hinglish: "जेब में J" },
        body: {
          en: "Small can. Big scene. J fits the gully, the ride home, and every pocket that needs fizz.",
          hinglish: "Chhoti can. Bada scene. Gully se ghar tak — jeb mein poora fizz.",
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
    kicker: { en: "06 · Find · Xotik Frujus", hinglish: "06 · खोज · Xotik Frujus" },
    locator: { en: "Talk to us", hinglish: "Humse baat karo" },
    primary: { en: "Find J near you", hinglish: "J kahan milega?" },
    secondary: { en: "Parent: Xotik", hinglish: "Parent: Xotik" },
    stores: {
      en: "This is the J by Jeeru presentation. Store map lands with the full xotik.co.in rebuild — for now, email or call and we’ll point you to J.",
      hinglish:
        "Yeh J by Jeeru presentation hai. Full store map xotik.co.in rebuild ke saath aayega — abhi email / call karo, hum bata denge.",
    },
  },
  footer: {
    parent: "Xotik Frujus Pvt Ltd",
    email: "info@xotik.co.in",
    phone: "+91-9029991771",
    compliance: "FSSAI license · HALAL · FDA",
  },
} as const;

export function isEnglish(locale: Locale): boolean {
  return locale === "en";
}

export function chapterKicker(chapterIndex: number, locale: Locale): string {
  const chapter = copy.chapters[chapterIndex];
  if (!chapter) return "";
  const n = String(chapterIndex + 1).padStart(2, "0");
  const label = locale === "en" ? chapter.label.en.toUpperCase() : chapter.label[locale];
  return `${n} — ${label}`;
}

export function scriptDisplayClass(text: string): string {
  return /\p{Script=Devanagari}/u.test(text) ? "font-devanagari-display" : "font-condensed";
}

export function t<T extends Record<Locale, string>>(block: T, locale: Locale): string {
  return block[locale];
}

export function tLines<T extends Record<Locale, readonly string[]>>(
  block: T,
  locale: Locale,
): readonly string[] {
  return block[locale];
}
