import { copy, t, tLines, type Locale } from "@/lib/copy";

export function FactoryCopy({ locale }: { locale: Locale }) {
  const lines = tLines(copy.factory.headline, locale);

  return (
    <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[1280px] flex-col justify-end px-[var(--section-pad-x)] pb-16 pt-28 md:px-[var(--section-pad-x-desktop)] md:pb-24 md:pt-32">
      <p className="font-receipt mb-4 text-[11px] tracking-[0.2em] text-j-blue">02 — FACTORY</p>
      <h2 className="font-condensed max-w-[14ch] text-[clamp(2.5rem,8vw,4.25rem)] leading-[0.9] tracking-wide text-ink">
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

export function FactoryVisual({
  variant,
}: {
  variant: "static" | "motion" | "3d";
}) {
  const motionClass =
    variant === "static"
      ? ""
      : variant === "motion"
        ? " motion-safe:animate-pulse"
        : " motion-safe:animate-[factory-scan_4s_linear_infinite]";

  return (
    <div
      className={`absolute inset-0 bg-gradient-to-br from-zinc-200 via-paper to-zinc-300${motionClass}`}
      aria-hidden
    >
      <div className="absolute inset-x-0 top-1/4 h-px bg-line/50" />
      <div className="absolute inset-x-0 top-1/3 h-px bg-line/60" />
      <div className="absolute inset-x-0 top-1/2 h-px bg-line/40" />
      <div className="absolute inset-x-0 top-2/3 h-px bg-line/60" />
      <div className="absolute inset-x-[10%] top-[38%] h-8 rounded-full border border-line/40 bg-white/30" />
      <div className="absolute inset-x-[18%] top-[52%] h-6 rounded-full border border-line/30 bg-white/20" />
      {variant === "3d" && (
        <div className="absolute left-1/2 top-[42%] h-28 w-28 -translate-x-1/2 rounded-full border border-j-blue/30 bg-white/40 blur-sm" />
      )}
    </div>
  );
}
