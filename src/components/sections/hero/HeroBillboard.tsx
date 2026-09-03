import type { ReactNode } from "react";

const RIBBON_REPEAT = 8;

type HeroBillboardProps = {
  children: ReactNode;
  frameRef?: React.RefObject<HTMLDivElement | null>;
  sheetRef?: React.RefObject<HTMLDivElement | null>;
  ribbonText?: string;
  garnishTop?: string;
  garnishBox?: string;
  handoffRef?: React.RefObject<HTMLDivElement | null>;
  handoffLabel?: string;
};

/**
 * Desi-pop hero: stamp-cut on mobile, full-bleed billboard on desktop.
 */
export function HeroBillboard({
  children,
  frameRef,
  sheetRef,
  ribbonText = "J BY JEERU · XOTIK FRUJUS · DESI POP · ",
  garnishTop,
  garnishBox,
  handoffRef,
  handoffLabel,
}: HeroBillboardProps) {
  const ribbonChunk = ribbonText.repeat(RIBBON_REPEAT);

  return (
    <div ref={frameRef} className="hero-paper">
      <div ref={sheetRef} className="hero-stamp-sheet">
        <div className="hero-billboard__bg" aria-hidden />
        <div className="hero-billboard__glow" aria-hidden />
        <div className="hero-stamp-sheet__grid" aria-hidden />
        <div className="hero-stamp-sheet__perforation" aria-hidden />

        <div className="hero-billboard__ribbon hero-billboard__ribbon--a" aria-hidden>
          <span>{ribbonChunk}</span>
        </div>
        <div className="hero-billboard__ribbon hero-billboard__ribbon--b" aria-hidden>
          <span>{ribbonChunk}</span>
        </div>

        {garnishTop ? (
          <p className="hero-garnish hero-garnish--tl">{garnishTop}</p>
        ) : null}

        {garnishBox ? (
          <p className="hero-garnish hero-garnish--br hero-garnish-box">{garnishBox}</p>
        ) : null}

        {handoffLabel ? (
          <div ref={handoffRef} className="hero-handoff font-condensed" aria-hidden>
            {handoffLabel}
          </div>
        ) : null}

        <div className="hero-stamp-sheet__body">{children}</div>
      </div>
    </div>
  );
}

type HeroBillboardCopyProps = {
  locale: "en" | "hinglish";
  receipt: string;
  devanagariAccent: string;
  headlines: readonly string[];
  sub: string;
  stampText?: string;
  cta: ReactNode;
  typeLayerRef?: React.RefObject<HTMLDivElement | null>;
  headlineRef?: React.RefObject<HTMLHeadingElement | null>;
  subRef?: React.RefObject<HTMLParagraphElement | null>;
  ctaRef?: React.RefObject<HTMLDivElement | null>;
  stampRef?: React.RefObject<HTMLDivElement | null>;
};

function splitHeroSub(sub: string): string[] {
  const parts = sub.split(/(?<=\.)\s+/).filter(Boolean);
  if (parts.length <= 1) return [sub];
  const mid = Math.ceil(parts.length / 2);
  return [parts.slice(0, mid).join(" "), parts.slice(mid).join(" ")];
}

function stampLines(stampText: string): string[] {
  const pieces = stampText.trim().split(/\s+/);
  if (pieces.length <= 1) return [stampText];
  return [pieces[0] ?? stampText, pieces.slice(1).join(" ")];
}

export function HeroBillboardCopy({
  locale,
  receipt,
  devanagariAccent,
  headlines,
  sub,
  stampText,
  cta,
  typeLayerRef,
  headlineRef,
  subRef,
  ctaRef,
  stampRef,
}: HeroBillboardCopyProps) {
  const showDevanagariAccent = locale === "en";
  const subRows = splitHeroSub(sub);
  const fizzRows = stampText ? stampLines(stampText) : [];

  return (
    <div className="hero-copy-layout">
      <div ref={typeLayerRef} className="hero-copy-layout__headline">
        <p className="hero-receipt font-receipt">{receipt}</p>

        <div className="hero-title-row">
          <svg className="hero-swoosh" viewBox="0 0 900 220" preserveAspectRatio="none" aria-hidden>
            <ellipse
              cx="430"
              cy="118"
              rx="410"
              ry="72"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              transform="rotate(-9 430 118)"
            />
          </svg>

          <h1 ref={headlineRef} className="hero-headline font-condensed">
            {headlines.map((line, index) => (
              <span
                key={line}
                className={`hero-headline__line${
                  index === headlines.length - 1 ? " hero-headline__line--accent" : ""
                }`}
              >
                {line}
              </span>
            ))}
          </h1>

          {stampText ? (
            <div ref={stampRef} className="hero-fizz-seal" aria-hidden>
              {fizzRows.map((row) => (
                <span key={row} className="hero-fizz-seal__line">
                  {row}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {showDevanagariAccent ? (
          <p className="hero-devanagari font-devanagari-display">{devanagariAccent}</p>
        ) : null}
      </div>

      <p ref={subRef} className="hero-sub hero-copy-layout__sub font-receipt">
        {subRows.map((row) => (
          <span key={row}>{row}</span>
        ))}
      </p>

      <div ref={ctaRef} className="hero-copy-layout__cta">
        {cta}
      </div>
    </div>
  );
}
