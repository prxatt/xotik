"use client";

import { useCapabilityTierContext } from "@/context/CapabilityTierContext";
import type { CapabilityTier } from "@/lib/tier-detection";

const labels: Record<CapabilityTier, string> = {
  0: "Tier 0 — Static",
  1: "Tier 1 — Light",
  2: "Tier 2 — Full 3D",
};

export function TierDevPanel() {
  const { tier, result, forceTier, isReady } = useCapabilityTierContext();

  return (
    <div
      className="fixed bottom-4 right-4 z-[100] max-w-xs rounded-2xl border border-line bg-white/95 p-3 shadow-lg backdrop-blur-sm font-label text-ink"
      aria-label="Capability tier dev panel"
    >
      <p className="mb-2 text-[10px] text-ink/70">Dev: capability tier</p>
      <p className="mb-1 font-body text-sm font-semibold normal-case tracking-normal">
        {isReady ? labels[tier] : "Detecting…"}
      </p>
      {result && (
        <p className="mb-2 font-body text-[11px] font-normal normal-case tracking-normal text-ink/60">
          score {result.score} · {result.reasons.slice(0, 3).join(", ")}
        </p>
      )}
      <div className="flex flex-wrap gap-1">
        {([0, 1, 2] as CapabilityTier[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => forceTier(t)}
            className={`rounded-full px-2 py-1 font-label text-[10px] ${
              tier === t ? "bg-ink text-paper" : "bg-paper text-ink border border-line"
            }`}
          >
            T{t}
          </button>
        ))}
        <button
          type="button"
          onClick={() => forceTier(null)}
          className="rounded-full px-2 py-1 font-label text-[10px] border border-line bg-paper text-ink"
        >
          Auto
        </button>
      </div>
    </div>
  );
}
