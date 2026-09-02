"use client";

import { useEffect, useState } from "react";
import {
  detectCapabilityTier,
  type CapabilityTier,
  type TierDetectionResult,
} from "@/lib/tier-detection";

const STORAGE_KEY = "xotik-capability-tier";

export function useCapabilityTier() {
  const [result, setResult] = useState<TierDetectionResult | null>(null);
  const [override, setOverride] = useState<CapabilityTier | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === "0" || stored === "1" || stored === "2") {
      setOverride(Number(stored) as CapabilityTier);
    }

    let cancelled = false;
    detectCapabilityTier().then((detected) => {
      if (!cancelled) setResult(detected);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const tier: CapabilityTier = override ?? result?.tier ?? 1;

  function forceTier(next: CapabilityTier | null) {
    if (next === null) {
      sessionStorage.removeItem(STORAGE_KEY);
      setOverride(null);
      return;
    }
    sessionStorage.setItem(STORAGE_KEY, String(next));
    setOverride(next);
  }

  return { tier, result, forceTier, isReady: result !== null || override !== null };
}
