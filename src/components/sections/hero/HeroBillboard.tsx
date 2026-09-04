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
        <div className="hero-stamp-sheet__perforation" aria-hidden />

        <div className="hero-billboard__ribbon hero-billboard__ribbon--a" aria-hidden>
          <div className="hero-billboard__ribbon-track">
            <span>{ribbonChunk}</span>
            <span>{ribbonChunk}</span>
          </div>
        </div>
        <div className="hero-billboard__ribbon hero-billboard__ribbon--b" aria-hidden>
          <div className="hero-billboard__ribbon-track">
            <span>{ribbonChunk}</span>
            <span>{ribbonChunk}</span>
          </div>
        </div>

        {garnishTop ? (
          <p className="hero-garnish hero-garnish--tl">{garnishTop}</p>
        ) : null}

        {garnishBox ? (
          <p className="hero-garnish hero-garnish--br hero-garnish-box">{garnishBox}</p>
        ) : null}

        {handoffLabel ? (
          <div className="hero-handoff">
            <div ref={handoffRef} className="hero-handoff__inner font-condensed" aria-hidden>
              {handoffLabel}
            </div>
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
  stampRef?: React.RefObject<HTMLSpanElement | null>;
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

function stampLineIndex(headlines: readonly string[]): number {
  const sized = headlines.findIndex((line) => /sized/i.test(line));
  if (sized !== -1) return sized;
  const withD = headlines.findIndex((line) => [...line].some((char) => char.toUpperCase() === "D"));
  if (withD !== -1) return withD;
  return 0;
}

function stampAnchorIndex(line: string): number {
  const chars = [...line];
  for (let i = chars.length - 1; i >= 0; i -= 1) {
    if (chars[i]?.toUpperCase() === "D") return i;
  }
  for (let i = chars.length - 1; i >= 0; i -= 1) {
    if (/\p{L}/u.test(chars[i] ?? "")) return i;
  }
  return Math.max(0, chars.length - 1);
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
  const showDevanagariAccent = locale === "en" && Boolean(devanagariAccent);
  const subRows = splitHeroSub(sub);
  const fizzRows = stampText ? stampLines(stampText) : [];
  const fizzLine = stampText ? stampLineIndex(headlines) : -1;

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

          <h1
            ref={headlineRef}
            className={`hero-headline${locale === "hinglish" ? " hero-headline--deva font-devanagari-display" : " font-condensed"}`}
          >
            {headlines.map((line, index) => {
              const accentLast = headlines.length > 1 && index === headlines.length - 1;
              const lineClass = `hero-headline__line${accentLast ? " hero-headline__line--accent" : ""}`;
              const showSeal = index === fizzLine && fizzRows.length > 0;

              if (!showSeal) {
                return (
                  <span key={`${index}-${line}`} className={lineClass}>
                    {line}
                  </span>
                );
              }

              const chars = [...line];
              const anchor = stampAnchorIndex(line);

              return (
                <span key={`${index}-${line}`} className={lineClass}>
                  {chars.slice(0, anchor).join("")}
                  <span className="hero-headline__mark">
                    {chars[anchor]}
                    <span ref={stampRef} className="hero-fizz-seal" aria-hidden>
                      {fizzRows.map((row) => (
                        <span key={row} className="hero-fizz-seal__line">
                          {row}
                        </span>
                      ))}
                    </span>
                  </span>
                  {chars.slice(anchor + 1).join("")}
                </span>
              );
            })}
          </h1>
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
