"use client";

import type { ReactNode } from "react";
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
  scene?: string;
  "aria-label"?: string;
};

function pickVariant(tier: CapabilityTier, variants: TierVariants): ReactNode {
  if (tier === 0) return variants.tier0;
  if (tier === 1) return variants.tier1;
  return variants.tier2;
}

/**
 * Renders the correct visual variant for the detected capability tier.
 * Same section structure and copy across tiers — only fidelity changes.
 */
export function SectionFallback({
  id,
  className = "",
  scene,
  "aria-label": ariaLabel,
  tier0,
  tier1,
  tier2,
}: SectionFallbackProps) {
  const { tier } = useCapabilityTierContext();

  return (
    <section
      id={id}
      className={`${scene ? "scene-shell texture-grain" : ""} ${className}`}
      data-scene={scene}
      aria-label={ariaLabel}
    >
      {pickVariant(tier, { tier0, tier1, tier2 })}
    </section>
  );
}
