"use client";

import Link from "next/link";
import { useRef } from "react";
import { SectionFallback } from "@/components/fallback/SectionFallback";
import { useCapabilityTierContext } from "@/context/CapabilityTierContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { copy, t, type Locale } from "@/lib/copy";

function CtaPanel({ locale, animated }: { locale: Locale; animated: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { tier } = useCapabilityTierContext();
  const prefersReducedMotion = usePrefersReducedMotion();

  useSectionReveal(rootRef, {
    enabled: animated && !prefersReducedMotion && tier > 0,
    progress: true,
  });

  return (
    <div
      ref={rootRef}
      className="section-panel mx-auto w-full max-w-[1280px] px-[var(--section-pad-x)] py-24 text-center md:px-[var(--section-pad-x-desktop)] md:py-32"
    >
      <p className="font-receipt mb-4 text-[11px] tracking-[0.2em] text-scene-accent">
        06 · Find · Xotik Frujus
      </p>
      <h2 className="section-kinetic-line font-condensed text-[clamp(2.5rem,10vw,5rem)] leading-[0.88] text-scene-surface">
        {t(copy.cta.primary, locale)}
      </h2>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="#stores"
          className="btn-pop"
          data-cursor-label="FIND J"
        >
          {t(copy.cta.primary, locale)}
        </Link>
        <Link
          href="/tokens"
          className="cta-secondary font-receipt"
          data-cursor-label="STORY"
        >
          {t(copy.cta.secondary, locale)}
        </Link>
      </div>

      <div
        id="stores"
        className="cta-store-card mx-auto mt-12 max-w-md px-6 py-5 text-left"
        data-cursor-label="EMAIL"
      >
        <p className="font-receipt mb-2 text-[10px] tracking-[0.16em] text-scene-accent">
          Store locator
        </p>
        <p className="font-receipt text-sm tracking-[0.06em] text-scene-surface/85">{t(copy.cta.stores, locale)}</p>
        <a
          href={`mailto:${copy.footer.email}`}
          className="mt-3 inline-block font-receipt text-xs tracking-[0.12em] text-scene-surface underline-offset-2 hover:underline"
        >
          {copy.footer.email}
        </a>
      </div>

      <p className="font-receipt mt-12 text-[9px] tracking-[0.22em] text-scene-ink/40">
        FSSAI · HALAL · FDA · DESI POP
      </p>
    </div>
  );
}

export function CtaSection({ locale }: { locale: Locale }) {
  return (
    <SectionFallback
      id="find-j"
      scene="cta"
      aria-label="Find J"
      className="relative overflow-hidden"
      tier0={<CtaPanel locale={locale} animated={false} />}
      tier1={<CtaPanel locale={locale} animated />}
      tier2={<CtaPanel locale={locale} animated />}
    />
  );
}
