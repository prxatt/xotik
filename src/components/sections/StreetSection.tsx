"use client";

import { useCapabilityTierContext } from "@/context/CapabilityTierContext";
import type { Locale } from "@/lib/copy";
import { StreetParallaxScene } from "@/components/sections/street/StreetParallaxScene";
import { StreetStatic, StreetStaticLayered } from "@/components/sections/street/StreetStatic";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type StreetSectionProps = {
  locale: Locale;
};

export function StreetSection({ locale }: StreetSectionProps) {
  const { tier, isReady } = useCapabilityTierContext();
  const prefersReducedMotion = usePrefersReducedMotion();

  if (!isReady) {
    return <StreetStaticLayered locale={locale} />;
  }

  if (tier === 0 || prefersReducedMotion) {
    return <StreetStatic locale={locale} />;
  }

  if (tier === 1) {
    return <StreetParallaxScene locale={locale} tier={1} />;
  }

  return <StreetParallaxScene locale={locale} tier={2} />;
}
