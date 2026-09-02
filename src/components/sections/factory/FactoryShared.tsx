import { copy, t, tLines, type Locale } from "@/lib/copy";

export function FactoryCopy({ locale }: { locale: Locale }) {
  const lines = tLines(copy.factory.headline, locale);

  return (
    <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[1280px] flex-col justify-end px-[var(--section-pad-x)] pb-16 pt-28 md:px-[var(--section-pad-x-desktop)] md:pb-24 md:pt-32">
      <p className="font-receipt mb-4 text-[11px] tracking-[0.22em] text-hero-accent">02 — FACTORY</p>
      <h2 className="font-condensed max-w-[14ch] text-[clamp(2.75rem,9vw,4.75rem)] leading-[0.88] tracking-wide text-hero-ink">
        {lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h2>
      <p className="font-receipt mt-6 max-w-lg text-[11px] tracking-[0.14em] text-hero-ink/80 md:text-xs">
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
      className={`absolute inset-0 bg-gradient-to-br from-[#1a1a22] via-[#0f2da8] to-[#040011]${motionClass}`}
      aria-hidden
    >
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(color-mix(in srgb, #ffe94a 22%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, #ffe94a 22%, transparent) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute inset-x-0 top-1/4 h-px bg-hero-ink/20" />
      <div className="absolute inset-x-0 top-1/3 h-px bg-hero-accent/30" />
      <div className="absolute inset-x-0 top-1/2 h-px bg-hero-ink/15" />
      <div className="absolute inset-x-0 top-2/3 h-px bg-hero-accent/25" />
      <div className="absolute inset-x-[10%] top-[38%] h-8 rounded-full border border-hero-ink/25 bg-hero-ink/10" />
      <div className="absolute inset-x-[18%] top-[52%] h-6 rounded-full border border-hero-accent/30 bg-hero-accent/10" />
      {variant === "3d" && (
        <div className="absolute left-1/2 top-[42%] h-28 w-28 -translate-x-1/2 rounded-full border border-hero-accent/40 bg-hero-ink/15 blur-sm" />
      )}
    </div>
  );
}
