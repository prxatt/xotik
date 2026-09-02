import type { ReactNode } from "react";
import { WordSplit } from "@/lib/motion/splitWords";

type HeroBillboardProps = {
  children: ReactNode;
  /** Sticky pin frame for kinetic scroll (Tier 1/2) */
  pin?: boolean;
};

/**
 * Shared desi-pop billboard shell — matches /tokens jaguar header.
 * Background layers are absolute so sticky pinning is never overridden.
 */
export function HeroBillboard({ children, pin = false }: HeroBillboardProps) {
  const frameClass = pin
    ? "hero-pin sticky top-0 h-[100dvh] min-h-[100dvh] w-full overflow-hidden"
    : "relative min-h-[100dvh] w-full overflow-hidden";

  return (
    <div className={frameClass}>
      <div className="hero-billboard__bg" aria-hidden />
      <div className="hero-billboard__grain" aria-hidden />
      <div className="hero-billboard__glow" aria-hidden />
      <div className="relative z-10 flex h-full flex-col justify-center px-[var(--section-pad-x)] pb-10 pt-20 md:px-[var(--section-pad-x-desktop)] md:pb-14 md:pt-24">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 md:gap-8">
          {children}
        </div>
      </div>
    </div>
  );
}

type HeroBillboardCopyProps = {
  locale: "en" | "hinglish";
  devanagariAccent: string;
  headlines: readonly string[];
  sub: string;
  cta: ReactNode;
  kinetic?: boolean;
  accentRef?: React.RefObject<HTMLParagraphElement | null>;
  headlineRef?: React.RefObject<HTMLHeadingElement | null>;
  subRef?: React.RefObject<HTMLParagraphElement | null>;
  ctaRef?: React.RefObject<HTMLDivElement | null>;
};

export function HeroBillboardCopy({
  locale,
  devanagariAccent,
  headlines,
  sub,
  cta,
  kinetic = false,
  accentRef,
  headlineRef,
  subRef,
  ctaRef,
}: HeroBillboardCopyProps) {
  const showDevanagariAccent = locale === "en";

  return (
    <>
      <p className="font-receipt text-cine-olive">01 · J · Xotik Frujus</p>

      {showDevanagariAccent && (
        <p
          ref={accentRef}
          className="font-devanagari-display text-[clamp(2.75rem,12vw,5.5rem)] leading-[1.1] text-cine-gold"
        >
          {devanagariAccent}
        </p>
      )}

      <h1
        ref={headlineRef}
        className="font-condensed max-w-[11ch] text-[clamp(4rem,18vw,9.5rem)] leading-[0.82] tracking-[0.01em] text-paper"
      >
        {headlines.map((line, index) => (
          <span
            key={line}
            className={`block ${index === headlines.length - 1 ? "text-cine-gold" : ""}`}
          >
            {kinetic ? <WordSplit text={line} /> : line}
          </span>
        ))}
      </h1>

      <p ref={subRef} className="font-body max-w-md text-base text-cine-olive/95 md:text-lg">
        {sub}
      </p>

      <div ref={ctaRef}>{cta}</div>
    </>
  );
}
