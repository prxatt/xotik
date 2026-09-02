"use client";

import type { ReactNode } from "react";
import { DesiPopShell, type DesiPopScene } from "@/components/layout/DesiPopShell";
import { useCapabilityTierContext } from "@/context/CapabilityTierContext";
import type { CapabilityTier } from "@/lib/tier-detection";

export type TierVariants = {
  tier0: ReactNode;
  tier1: ReactNode;
  tier2: ReactNode;
};

type SectionFallbackProps = TierVariants & {
  id?: string;
  className?: string;
  scene?: DesiPopScene;
  /** Photo scenes — rails/ribbons only, no solid grid fill */
  overlayChrome?: boolean;
  ribbonText?: string;
  "aria-label"?: string;
};

function pickVariant(tier: CapabilityTier, variants: TierVariants): ReactNode {
  if (tier === 0) return variants.tier0;
  if (tier === 1) return variants.tier1;
  return variants.tier2;
}

/**
 * Renders the correct visual variant for the detected capability tier.
 * Wraps content in desi-pop billboard chrome when `scene` is set.
 */
export function SectionFallback({
  id,
  className = "",
  scene,
  overlayChrome = false,
  ribbonText,
  "aria-label": ariaLabel,
  tier0,
  tier1,
  tier2,
}: SectionFallbackProps) {
  const { tier } = useCapabilityTierContext();
  const content = pickVariant(tier, { tier0, tier1, tier2 });

  const inner = scene ? (
    <DesiPopShell
      scene={scene}
      ribbonText={ribbonText}
      className={overlayChrome ? "desi-pop-shell--overlay min-h-full" : "min-h-full"}
    >
      {content}
    </DesiPopShell>
  ) : (
    content
  );

  return (
    <section
      id={id}
      className={`scene-shell texture-grain ${className}`}
      data-scene={scene}
      aria-label={ariaLabel}
    >
      {inner}
    </section>
  );
}
