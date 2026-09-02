"use client";

import { useCapabilityTierContext } from "@/context/CapabilityTierContext";
import type { Locale } from "@/lib/copy";
import { HeroKineticScene } from "@/components/sections/hero/HeroKineticScene";
import { HeroStatic } from "@/components/sections/hero/HeroStatic";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type HeroBlockProps = {
  locale: Locale;
};

export function HeroBlock({ locale }: HeroBlockProps) {
  const { tier, isReady } = useCapabilityTierContext();
  const prefersReducedMotion = usePrefersReducedMotion();

  if (!isReady || tier === 0 || prefersReducedMotion) {
    return <HeroStatic locale={locale} />;
  }

  if (tier === 1) {
    return <HeroKineticScene locale={locale} tier={1} />;
  }

  return <HeroKineticScene locale={locale} tier={2} />;
}
