import { SectionFallback } from "@/components/fallback/SectionFallback";
import { copy, t, tLines, type Locale } from "@/lib/copy";

function ProductCopy({ locale }: { locale: Locale }) {
  const body = tLines(copy.product.body, locale);

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-col items-center px-[var(--section-pad-x)] py-20 text-center md:px-[var(--section-pad-x-desktop)] md:py-28">
      <p className="font-label mb-4 text-j-orange">03 — J</p>
      <h2 className="font-display text-[clamp(2.5rem,8vw,4rem)] font-bold text-ink">
        {t(copy.product.headline, locale)}
      </h2>
      <div className="font-body mt-4 space-y-1 text-lg text-ink/80">
        {body.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  );
}

function ProductPlaceholder({ label }: { label: string }) {
  return (
    <div
      className="mx-auto flex h-[min(52vh,420px)] w-[min(90vw,280px)] items-center justify-center rounded-[2rem] border border-line bg-gradient-to-b from-white to-paper shadow-lg"
      aria-hidden
    >
      <div className="text-center">
        <div className="mx-auto mb-4 h-40 w-24 rounded-2xl border-2 border-j-coral/40 bg-j-yellow/20" />
        <p className="font-label text-[10px] text-ink/50">{label}</p>
      </div>
    </div>
  );
}

export function ProductSection({ locale }: { locale: Locale }) {
  return (
    <SectionFallback
      id="product"
      aria-label="J product"
      className="relative min-h-[100dvh] border-t border-line/50 bg-white"
      tier0={
        <div className="flex min-h-[100dvh] flex-col justify-center gap-8">
          <ProductPlaceholder label="Product still · Tier 0" />
          <ProductCopy locale={locale} />
        </div>
      }
      tier1={
        <div className="flex min-h-[100dvh] flex-col justify-center gap-8">
          <ProductPlaceholder label="Frame spin · Tier 1" />
          <ProductCopy locale={locale} />
        </div>
      }
      tier2={
        <div className="flex min-h-[100dvh] flex-col justify-center gap-8">
          <ProductPlaceholder label="Live GLB · Phase 1.5" />
          <ProductCopy locale={locale} />
        </div>
      }
    />
  );
}
