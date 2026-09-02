import { SectionFallback } from "@/components/fallback/SectionFallback";
import { copy, tLines, type Locale } from "@/lib/copy";

const SWATCHES = [
  "var(--j-coral)",
  "var(--j-orange)",
  "var(--j-yellow)",
  "var(--j-green)",
  "var(--j-blue)",
  "var(--j-violet)",
] as const;

function ManifestoContent({ locale }: { locale: Locale }) {
  const headline = tLines(copy.manifesto.headline, locale);
  const sub = tLines(copy.manifesto.sub, locale);

  return (
    <div className="mx-auto w-full max-w-[1280px] px-[var(--section-pad-x)] py-24 md:px-[var(--section-pad-x-desktop)] md:py-32">
      <p className="font-label mb-6 text-j-coral">05 — Attitude</p>
      <div className="mb-10 flex flex-wrap gap-2">
        {SWATCHES.map((color) => (
          <span
            key={color}
            className="h-10 w-10 rounded-full border border-line md:h-12 md:w-12"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <h2 className="font-display text-[clamp(2.25rem,7vw,4.5rem)] font-bold uppercase leading-[0.9] text-ink">
        {headline.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h2>
      <p className="font-body mt-8 max-w-xl text-lg text-ink/75 md:text-xl">
        {sub.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>
    </div>
  );
}

export function ManifestoSection({ locale }: { locale: Locale }) {
  return (
    <SectionFallback
      id="manifesto"
      aria-label="Brand attitude"
      className="border-t border-line/50 bg-white"
      tier0={<ManifestoContent locale={locale} />}
      tier1={<ManifestoContent locale={locale} />}
      tier2={<ManifestoContent locale={locale} />}
    />
  );
}
