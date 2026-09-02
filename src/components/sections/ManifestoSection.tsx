"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionFallback } from "@/components/fallback/SectionFallback";
import { useCapabilityTierContext } from "@/context/CapabilityTierContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { copy, tLines, type Locale } from "@/lib/copy";

gsap.registerPlugin(ScrollTrigger);

const SWATCHES = [
  "var(--j-coral)",
  "var(--j-orange)",
  "var(--j-yellow)",
  "var(--j-green)",
  "var(--j-blue)",
  "var(--j-violet)",
] as const;

function ManifestoPanel({ locale, kinetic }: { locale: Locale; kinetic: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const swatchRef = useRef<HTMLDivElement>(null);
  const { tier } = useCapabilityTierContext();
  const prefersReducedMotion = usePrefersReducedMotion();
  const headline = tLines(copy.manifesto.headline, locale);
  const sub = tLines(copy.manifesto.sub, locale);

  useSectionReveal(rootRef, {
    enabled: kinetic && !prefersReducedMotion,
    progress: true,
  });

  useEffect(() => {
    if (!kinetic || prefersReducedMotion) return;

    const swatches = swatchRef.current?.querySelectorAll<HTMLElement>(".manifesto-swatch");
    if (!swatches?.length || !rootRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        swatches,
        { scale: 0.6, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.06,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 75%",
            end: "top 40%",
            scrub: 0.5,
          },
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, [kinetic, prefersReducedMotion, tier]);

  return (
    <div
      ref={rootRef}
      className="section-panel mx-auto w-full max-w-[1280px] px-[var(--section-pad-x)] py-24 md:px-[var(--section-pad-x-desktop)] md:py-32"
    >
      <p className="font-receipt mb-6 text-[11px] tracking-[0.2em] text-scene-accent">
        05 · Attitude · J
      </p>

      <div ref={swatchRef} className="mb-10 flex flex-wrap gap-3">
        {SWATCHES.map((color) => (
          <span
            key={color}
            className="manifesto-swatch h-11 w-11 rounded-full border-2 border-scene-ink/20 md:h-14 md:w-14"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <h2 className="font-condensed text-[clamp(2.75rem,12vw,6.5rem)] uppercase leading-[0.84] text-scene-ink">
        {headline.map((line) => (
          <span key={line} className="section-kinetic-line block">
            {line}
          </span>
        ))}
      </h2>

      <p className="font-body mt-8 max-w-xl text-lg text-scene-ink/80 md:text-xl">
        {sub.map((line) => (
          <span key={line} className="section-kinetic-line block">
            {line}
          </span>
        ))}
      </p>
    </div>
  );
}

export function ManifestoSection({ locale }: { locale: Locale }) {
  return (
    <SectionFallback
      id="manifesto"
      scene="manifesto"
      aria-label="Brand attitude"
      className="relative border-t border-scene-ink/10"
      tier0={<ManifestoPanel locale={locale} kinetic={false} />}
      tier1={<ManifestoPanel locale={locale} kinetic />}
      tier2={<ManifestoPanel locale={locale} kinetic />}
    />
  );
}
