"use client";

import { useRef, type CSSProperties } from "react";
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
    progress: false,
  });

  return (
    <div
      ref={rootRef}
      className="mx-auto w-full max-w-[1280px] px-[var(--section-pad-x)] py-20 md:px-[var(--section-pad-x-desktop)] md:py-28"
    >
      <p className="font-receipt mb-4 text-[11px] tracking-[0.2em] text-scene-accent">
        04 · {t(copy.ingredients.eyebrow, locale)}
      </p>
      <h2 className="font-condensed mb-3 text-[clamp(2.25rem,9vw,4.5rem)] leading-[0.9] text-scene-ink">
        {lines.map((line) => (
          <span key={line} className="section-kinetic-line block">
            {line}
          </span>
        ))}
      </h2>
      <p className="font-body mb-10 max-w-lg text-sm text-scene-ink/80 md:text-base">
        {t(copy.ingredients.lead, locale)}
      </p>

      <div className="taste-grid">
        {copy.ingredients.items.map((item) => (
          <article
            key={item.id}
            className={`taste-card ${item.id === "jeera" ? "taste-card--hero" : ""}`}
            style={
              {
                "--taste-bg": item.bg,
                "--taste-ink": item.ink,
              } as CSSProperties
            }
            data-cursor-label={t(item.name, locale).toUpperCase()}
          >
            <p className="taste-card__tag font-receipt">{t(item.note, locale)}</p>
            <h3 className="taste-card__name font-condensed">{t(item.name, locale)}</h3>
            {item.id === "jeera" && (
              <p className="taste-card__badge font-receipt">{t(copy.ingredients.jeeruBadge, locale)}</p>
            )}
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
      aria-label="J by Jeeru taste"
      className="relative border-t border-scene-ink/10"
      tier0={<IngredientsPanel locale={locale} animated={false} />}
      tier1={<IngredientsPanel locale={locale} animated />}
      tier2={<IngredientsPanel locale={locale} animated />}
    />
  );
}
