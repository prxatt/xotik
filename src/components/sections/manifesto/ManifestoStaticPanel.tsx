import { copy, t, tLines, type Locale } from "@/lib/copy";

const SWATCHES = [
  "var(--j-coral)",
  "var(--j-orange)",
  "var(--j-yellow)",
  "var(--j-green)",
  "var(--j-blue)",
  "var(--j-violet)",
] as const;

/** Tier 0 — stacked manifesto cards, no motion path. */
export function ManifestoStaticPanel({ locale }: { locale: Locale }) {
  const headline = tLines(copy.manifesto.headline, locale);

  return (
    <div className="mx-auto w-full max-w-[1280px] px-[var(--section-pad-x)] py-20 md:px-[var(--section-pad-x-desktop)] md:py-28">
      <p className="font-receipt mb-6 text-[11px] tracking-[0.2em] text-scene-accent">
        05 · {t(copy.manifesto.intro, locale)}
      </p>

      <div className="mb-10 flex flex-wrap gap-3">
        {SWATCHES.map((color) => (
          <span
            key={color}
            className="h-11 w-11 rounded-full border-2 border-scene-ink/20 md:h-14 md:w-14"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <h2 className="font-condensed mb-12 text-[clamp(2.5rem,10vw,5rem)] uppercase leading-[0.86] text-scene-ink">
        {headline.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h2>

      <div className="flex flex-col gap-6">
        {copy.manifesto.stops.map((stop, index) => (
          <article
            key={stop.id}
            className={`manifesto-stop-card ${index % 2 === 0 ? "manifesto-stop-card--gold" : "manifesto-stop-card--red"}`}
          >
            <span className="manifesto-stop-card__label font-receipt">{t(stop.label, locale)}</span>
            <h3 className="manifesto-stop-card__title font-condensed">{t(stop.title, locale)}</h3>
            <p className="manifesto-stop-card__body font-receipt">{t(stop.body, locale)}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
