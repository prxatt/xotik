"use client";

import { LanguageProvider } from "@/context/LanguageContext";
import { CapabilityTierProvider } from "@/context/CapabilityTierContext";
import { TierDevPanel } from "@/components/dev/TierDevPanel";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <CapabilityTierProvider>
        {children}
        {process.env.NODE_ENV === "development" && <TierDevPanel />}
      </CapabilityTierProvider>
    </LanguageProvider>
  );
}
