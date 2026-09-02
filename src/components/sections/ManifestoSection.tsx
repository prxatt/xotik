"use client";

import { SectionFallback } from "@/components/fallback/SectionFallback";
import { useCapabilityTierContext } from "@/context/CapabilityTierContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { Locale } from "@/lib/copy";
import { ManifestoPathScene } from "@/components/sections/manifesto/ManifestoPathScene";
import { ManifestoStaticPanel } from "@/components/sections/manifesto/ManifestoStaticPanel";

export function ManifestoSection({ locale }: { locale: Locale }) {
  const { tier, isReady } = useCapabilityTierContext();
  const prefersReducedMotion = usePrefersReducedMotion();

  if (!isReady || tier === 0 || prefersReducedMotion) {
    return (
      <SectionFallback
        id="manifesto"
        scene="manifesto"
        aria-label="Brand attitude"
        className="relative border-t border-scene-ink/10"
        tier0={<ManifestoStaticPanel locale={locale} />}
        tier1={<ManifestoStaticPanel locale={locale} />}
        tier2={<ManifestoStaticPanel locale={locale} />}
      />
    );
  }

  if (tier === 1) {
    return (
      <div id="manifesto" aria-label="Brand attitude">
        <ManifestoPathScene locale={locale} tier={1} />
      </div>
    );
  }

  return (
    <div id="manifesto" aria-label="Brand attitude">
      <ManifestoPathScene locale={locale} tier={2} />
    </div>
  );
}
