"use client";

import type { CSSProperties } from "react";
import { useRef } from "react";
import { SectionFallback } from "@/components/fallback/SectionFallback";
import { useCapabilityTierContext } from "@/context/CapabilityTierContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { copy, t, tLines, type Locale } from "@/lib/copy";

function IngredientsPanel({ locale, animated }: { locale: Locale; animated: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { tier } = useCapabilityTierContext();
  const prefersReducedMotion = usePrefersReducedMotion();
  const lines = tLines(copy.ingredients.headline, locale);

  useSectionReveal(rootRef, {
    enabled: animated && !prefersReducedMotion && tier > 0,
    progress: true,
  });

  return (
    <div ref={rootRef} className="section-panel mx-auto w-full max-w-[1280px] px-[var(--section-pad-x)] py-20 md:px-[var(--section-pad-x-desktop)] md:py-28">
      <p className="font-receipt mb-6 text-[11px] tracking-[0.2em] text-scene-accent">
        04 · Taste · Xotik Frujus
      </p>
      <h2 className="font-condensed mb-12 text-[clamp(2.5rem,10vw,5.5rem)] leading-[0.86] text-scene-ink">
        {lines.map((line) => (
          <span key={line} className="section-kinetic-line block">
            {line}
          </span>
        ))}
      </h2>

      <div className="ingredient-pill-grid">
        {copy.ingredients.items.map((item) => (
          <article
            key={item.id}
            className="ingredient-pill"
            style={
              {
                "--pill-bg": item.bg,
                "--pill-ink": item.ink,
              } as CSSProperties
            }
            data-cursor-label={t(item.name, locale).toUpperCase()}
          >
            <p className="ingredient-pill__tag font-receipt">{t(item.note, locale)}</p>
            <h3 className="ingredient-pill__title font-condensed">{t(item.name, locale)}</h3>
            <p className="ingredient-pill__side font-receipt" aria-hidden>
              J · XOTIK
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

export function IngredientsSection({ locale }: { locale: Locale }) {
  return (
    <SectionFallback
      id="ingredients"
      scene="taste"
      aria-label="Ingredients"
      className="relative border-t border-scene-ink/10"
      tier0={<IngredientsPanel locale={locale} animated={false} />}
      tier1={<IngredientsPanel locale={locale} animated />}
      tier2={<IngredientsPanel locale={locale} animated />}
    />
  );
}
