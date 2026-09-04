"use client";

import type { ReactNode } from "react";
import {
  DesiPopShell,
  type DesiPopChrome,
  type DesiPopScene,
} from "@/components/layout/DesiPopShell";
import { useCapabilityTierContext } from "@/context/CapabilityTierContext";
import type { CapabilityTier } from "@/lib/tier-detection";

export type TierVariants = {
  tier0: ReactNode;
  tier1: ReactNode;
  tier2: ReactNode;
};

const SCENE_CHROME: Record<DesiPopScene, DesiPopChrome> = {
  hero: "full",
  street: "overlay",
  factory: "light",
  product: "none", // matsuri flavor stage — no hero billboard chrome
  taste: "light",
  manifesto: "light",
  cta: "light",
};

type SectionFallbackProps = TierVariants & {
  id?: string;
  className?: string;
  scene?: DesiPopScene;
  overlayChrome?: boolean;
  chrome?: DesiPopChrome;
  ribbonText?: string;
  "aria-label"?: string;
};

function pickVariant(tier: CapabilityTier, variants: TierVariants): ReactNode {
  if (tier === 0) return variants.tier0;
  if (tier === 1) return variants.tier1;
  return variants.tier2;
}

export function SectionFallback({
  id,
  className = "",
  scene,
  overlayChrome = false,
  chrome,
  ribbonText,
  "aria-label": ariaLabel,
  tier0,
  tier1,
  tier2,
}: SectionFallbackProps) {
  const { tier } = useCapabilityTierContext();
  const content = pickVariant(tier, { tier0, tier1, tier2 });
  const chromeLevel = chrome ?? (scene ? SCENE_CHROME[scene] : undefined);

  const inner =
    scene && chromeLevel && chromeLevel !== "none" ? (
      <DesiPopShell
        scene={scene}
        chrome={overlayChrome ? "overlay" : chromeLevel}
        ribbonText={ribbonText}
        className="min-h-full"
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
