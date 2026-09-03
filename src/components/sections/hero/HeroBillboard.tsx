import type { ReactNode } from "react";

const RIBBON_REPEAT = 8;

type HeroBillboardProps = {
  children: ReactNode;
  frameRef?: React.RefObject<HTMLDivElement | null>;
  ribbonText?: string;
  garnishTop?: string;
  garnishBox?: string;
  stampText?: string;
  garnishTopRef?: React.RefObject<HTMLParagraphElement | null>;
  garnishBoxRef?: React.RefObject<HTMLParagraphElement | null>;
  stampRef?: React.RefObject<HTMLDivElement | null>;
  handoffRef?: React.RefObject<HTMLDivElement | null>;
  handoffLabel?: string;
  /** Allow type to scale/translate outside frame without clipping */
  clip?: boolean;
};

/**
 * Desi-pop billboard shell — Maaza cobalt + Souk condensed type + PA'LANTE ribbons.
 * Pinning is handled by GSAP in HeroKineticScene.
 */
export function HeroBillboard({
  children,
  frameRef,
  ribbonText = "J BY JEERU · XOTIK FRUJUS · ",
  garnishTop,
  garnishBox,
  stampText,
  garnishTopRef,
  garnishBoxRef,
  stampRef,
  handoffRef,
  handoffLabel,
  clip = true,
}: HeroBillboardProps) {
  const ribbonChunk = ribbonText.repeat(RIBBON_REPEAT);

  return (
    <div
      ref={frameRef}
      className={`hero-pin-frame relative h-[100dvh] min-h-[100dvh] w-full ${
        clip ? "overflow-hidden" : "overflow-visible"
      }`}
    >
      <div className="hero-billboard__bg" aria-hidden />
      <div className="hero-billboard__glow" aria-hidden />
      <div className="hero-billboard__halftone" aria-hidden />
      <div className="hero-billboard__grain" aria-hidden />

      <div className="hero-billboard__frame-line hero-billboard__frame-line--left" aria-hidden />
      <div className="hero-billboard__frame-line hero-billboard__frame-line--right" aria-hidden />

      <div className="hero-billboard__ribbon hero-billboard__ribbon--a" aria-hidden>
        <span>{ribbonChunk}</span>
      </div>
      <div className="hero-billboard__ribbon hero-billboard__ribbon--b" aria-hidden>
        <span>{ribbonChunk}</span>
      </div>

      {garnishTop && (
        <p ref={garnishTopRef} className="hero-garnish hero-garnish--tl">
          {garnishTop}
        </p>
      )}

      {garnishBox && (
        <p ref={garnishBoxRef} className="hero-garnish hero-garnish--br hero-garnish-box">
          {garnishBox}
        </p>
      )}

      {stampText && (
        <div ref={stampRef} className="hero-stamp" aria-hidden>
          {stampText}
        </div>
      )}

      {handoffLabel && (
        <div ref={handoffRef} className="hero-handoff font-condensed" aria-hidden>
          {handoffLabel}
        </div>
      )}

      <div className="relative z-20 flex h-full flex-col justify-center px-[var(--section-pad-x)] pb-10 pt-24 md:px-[var(--section-pad-x-desktop)] md:pb-14 md:pt-28">
        <div className="mx-auto w-full max-w-[1280px]">{children}</div>
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
  cta: ReactNode;
  typeLayerRef?: React.RefObject<HTMLDivElement | null>;
  ghostRef?: React.RefObject<HTMLDivElement | null>;
  accentRef?: React.RefObject<HTMLParagraphElement | null>;
  headlineRef?: React.RefObject<HTMLHeadingElement | null>;
  subRef?: React.RefObject<HTMLParagraphElement | null>;
  ctaRef?: React.RefObject<HTMLDivElement | null>;
  kineticLines?: boolean;
};

export function HeroBillboardCopy({
  locale,
  receipt,
  devanagariAccent,
  headlines,
  sub,
  cta,
  typeLayerRef,
  ghostRef,
  accentRef,
  headlineRef,
  subRef,
  ctaRef,
  kineticLines = false,
}: HeroBillboardCopyProps) {
  const showDevanagariAccent = locale === "en";

  const typeContent = (
    <div className="flex flex-col gap-4 md:gap-6">
      <p className="font-receipt text-[11px] tracking-[0.12em] text-hero-ink/85 md:text-xs">
        {receipt}
      </p>

      {showDevanagariAccent && (
        <p
          ref={accentRef}
          className="hero-kinetic-accent font-devanagari-display hidden text-[clamp(2.75rem,12vw,5.5rem)] leading-[1.08] text-hero-ink sm:block"
        >
          {devanagariAccent}
        </p>
      )}

      <h1
        ref={headlineRef}
        className="hero-kinetic-headline font-condensed text-[clamp(3.25rem,18vw,11rem)] leading-[0.84] tracking-[0.03em] text-hero-ink"
      >
        {headlines.map((line, index) => (
          <span
            key={line}
            className={`hero-kinetic-line block ${
              index === headlines.length - 1 ? "text-hero-accent" : ""
            }`}
            data-line={index}
          >
            {line}
          </span>
        ))}
      </h1>
    </div>
  );

  return (
    <div
      ref={typeLayerRef}
      className={
        kineticLines
          ? "hero-kinetic-type hero-copy-layout relative z-20 will-change-transform"
          : "hero-copy-layout"
      }
    >
      {kineticLines && (
        <div
          ref={ghostRef}
          aria-hidden
          className="hero-kinetic-ghost pointer-events-none absolute inset-0 z-0"
        >
          <h2 className="hero-kinetic-headline font-condensed text-[clamp(4rem,22vw,12.5rem)] leading-[0.82] tracking-[0.03em] opacity-30">
            {headlines.map((line) => (
              <span key={`ghost-${line}`} className="hero-kinetic-line block">
                {line}
              </span>
            ))}
          </h2>
        </div>
      )}

      <div className="hero-copy-layout__headline relative z-10">{typeContent}</div>

      <p
        ref={subRef}
        className="font-body hero-copy-layout__sub max-w-md text-base text-hero-ink/90 md:text-lg"
      >
        {sub}
      </p>

      <div ref={ctaRef} className="hero-copy-layout__cta">
        {cta}
      </div>
    </div>
  );
}
