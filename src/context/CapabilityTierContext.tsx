"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useCapabilityTier } from "@/hooks/useCapabilityTier";
import type { CapabilityTier, TierDetectionResult } from "@/lib/tier-detection";

type CapabilityTierContextValue = {
  tier: CapabilityTier;
  result: TierDetectionResult | null;
  forceTier: (tier: CapabilityTier | null) => void;
  isReady: boolean;
};

const CapabilityTierContext = createContext<CapabilityTierContextValue | null>(null);

export function CapabilityTierProvider({ children }: { children: ReactNode }) {
  const value = useCapabilityTier();
  return (
    <CapabilityTierContext.Provider value={value}>
      {children}
    </CapabilityTierContext.Provider>
  );
}

export function useCapabilityTierContext() {
  const ctx = useContext(CapabilityTierContext);
  if (!ctx) {
    throw new Error("useCapabilityTierContext must be used within CapabilityTierProvider");
  }
  return ctx;
}
