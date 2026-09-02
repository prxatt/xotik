import { SectionFallback } from "@/components/fallback/SectionFallback";
import {
  FactoryCopy,
  FactoryVisual,
} from "@/components/sections/factory/FactoryShared";
import type { Locale } from "@/lib/copy";

export function FactorySection({ locale }: { locale: Locale }) {
  return (
    <SectionFallback
      id="factory"
      aria-label="Manufacturing"
      className="relative min-h-[80dvh] overflow-hidden border-t border-line/50"
      tier0={
        <>
          <FactoryVisual variant="static" />
          <FactoryCopy locale={locale} />
        </>
      }
      tier1={
        <>
          <FactoryVisual variant="motion" />
          <FactoryCopy locale={locale} />
        </>
      }
      tier2={
        <>
          <FactoryVisual variant="3d" />
          <FactoryCopy locale={locale} />
        </>
      }
    />
  );
}
