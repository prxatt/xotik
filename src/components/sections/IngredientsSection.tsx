import { SectionFallback } from "@/components/fallback/SectionFallback";
import { copy, tLines, type Locale } from "@/lib/copy";

const INGREDIENTS = [
  { name: "Jeera", color: "var(--j-yellow)" },
  { name: "Apple", color: "var(--j-green)" },
  { name: "Spice", color: "var(--j-coral)" },
  { name: "Fizz", color: "var(--j-blue)" },
] as const;

function IngredientsCopy({ locale }: { locale: Locale }) {
  const lines = tLines(copy.ingredients.headline, locale);

  return (
    <div className="relative z-10 mx-auto w-full max-w-[1280px] px-[var(--section-pad-x)] py-20 md:px-[var(--section-pad-x-desktop)]">
      <p className="font-label mb-4 text-j-violet">04 — Taste</p>
      <h2 className="font-display text-[clamp(2rem,6vw,3.5rem)] font-bold leading-[0.95] text-ink">
        {lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h2>
    </div>
  );
}

function IngredientCollage({ animated }: { animated: boolean }) {
  return (
    <div className="mx-auto grid max-w-md grid-cols-2 gap-4 px-6 pb-16">
      {INGREDIENTS.map((item, index) => (
        <div
          key={item.name}
          className={`flex aspect-square items-center justify-center rounded-3xl border border-line font-label text-[11px] text-ink ${
            animated ? "motion-safe:animate-pulse" : ""
          }`}
          style={{
            backgroundColor: item.color,
            animationDelay: animated ? `${index * 200}ms` : undefined,
            opacity: 0.85,
          }}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
}

export function IngredientsSection({ locale }: { locale: Locale }) {
  return (
    <SectionFallback
      id="ingredients"
      aria-label="Ingredients"
      className="relative border-t border-line/50 bg-paper"
      tier0={
        <>
          <IngredientsCopy locale={locale} />
          <IngredientCollage animated={false} />
        </>
      }
      tier1={
        <>
          <IngredientsCopy locale={locale} />
          <IngredientCollage animated />
        </>
      }
      tier2={
        <>
          <IngredientsCopy locale={locale} />
          <IngredientCollage animated />
          <p className="font-label pb-8 text-center text-[9px] text-ink/50">
            Tier 2 · particle field — Phase 1.6
          </p>
        </>
      }
    />
  );
}
