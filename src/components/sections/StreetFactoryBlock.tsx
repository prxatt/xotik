"use client";

import { useCapabilityTierContext } from "@/context/CapabilityTierContext";
import type { Locale } from "@/lib/copy";
import { FactorySection } from "@/components/sections/FactorySection";
import { StreetFactoryScene } from "@/components/sections/street/StreetFactoryScene";
import { StreetStatic, StreetStaticLayered } from "@/components/sections/street/StreetStatic";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type StreetFactoryBlockProps = {
  locale: Locale;
};

/** Tier 1/2: unified scroll scene. Tier 0: static street + factory sections. */
export function StreetFactoryBlock({ locale }: StreetFactoryBlockProps) {
  const { tier, isReady } = useCapabilityTierContext();
  const prefersReducedMotion = usePrefersReducedMotion();

  if (!isReady) {
    return (
      <>
        <StreetStaticLayered locale={locale} />
        <FactorySection locale={locale} />
      </>
    );
  }

  if (tier === 0 || prefersReducedMotion) {
    return (
      <>
        <StreetStatic locale={locale} />
        <FactorySection locale={locale} />
      </>
    );
  }

  if (tier === 1) {
    return <StreetFactoryScene locale={locale} tier={1} />;
  }

  return <StreetFactoryScene locale={locale} tier={2} />;
}
