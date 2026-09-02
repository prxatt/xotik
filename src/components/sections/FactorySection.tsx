import { SectionFallback } from "@/components/fallback/SectionFallback";
import { copy, t, tLines, type Locale } from "@/lib/copy";

function FactoryCopy({ locale }: { locale: Locale }) {
  const lines = tLines(copy.factory.headline, locale);

  return (
    <div className="relative z-10 mx-auto w-full max-w-[1280px] px-[var(--section-pad-x)] py-24 md:px-[var(--section-pad-x-desktop)] md:py-32">
      <p className="font-label mb-4 text-j-blue">02 — Factory</p>
      <h2 className="font-display max-w-[14ch] text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[0.95] text-ink">
        {lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h2>
      <p className="font-body mt-6 max-w-lg text-sm text-ink/70 md:text-base">
        {t(copy.factory.micro, locale)}
      </p>
    </div>
  );
}

function FactoryVisual({ variant }: { variant: "static" | "motion" | "3d" }) {
  const base =
    "absolute inset-0 bg-gradient-to-br from-zinc-200 via-paper to-zinc-300";
  const lines =
    variant === "static"
      ? ""
      : variant === "motion"
        ? " motion-safe:animate-pulse"
        : " motion-safe:animate-[factory-scan_4s_linear_infinite]";

  return (
    <div className={`${base}${lines}`} aria-hidden>
      <div className="absolute inset-x-0 top-1/3 h-px bg-line/60" />
      <div className="absolute inset-x-0 top-1/2 h-px bg-line/40" />
      <div className="absolute inset-x-0 top-2/3 h-px bg-line/60" />
      {variant === "3d" && (
        <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-j-blue/30 bg-white/40 blur-sm" />
      )}
    </div>
  );
}

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
          <p className="font-label absolute bottom-4 right-4 z-10 text-[9px] text-ink/50">
            Tier 2 · factory 3D — Phase 1.4
          </p>
        </>
      }
    />
  );
}
