"use client";

import { CapabilityTierProvider } from "@/context/CapabilityTierContext";
import { TierDevPanel } from "@/components/dev/TierDevPanel";
import type { ReactNode } from "react";

/** Phase 0 foundation providers — LanguageProvider added in Phase 1.1 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <CapabilityTierProvider>
      {children}
      {process.env.NODE_ENV === "development" && <TierDevPanel />}
    </CapabilityTierProvider>
  );
}
