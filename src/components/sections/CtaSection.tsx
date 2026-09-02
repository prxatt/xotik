import Link from "next/link";
import { SectionFallback } from "@/components/fallback/SectionFallback";
import { copy, t, type Locale } from "@/lib/copy";

function CtaContent({ locale }: { locale: Locale }) {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-[var(--section-pad-x)] py-24 text-center md:px-[var(--section-pad-x-desktop)] md:py-32">
      <p className="font-label mb-4 text-j-green">06 — Find</p>
      <h2 className="font-display text-[clamp(2rem,6vw,3.5rem)] font-bold text-ink">
        {t(copy.cta.primary, locale)}
      </h2>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link href="#stores" className="btn-primary">
          {t(copy.cta.primary, locale)} →
        </Link>
        <Link
          href="/tokens"
          className="font-label rounded-full border border-line bg-white px-6 py-3 text-[11px] text-ink no-underline hover:bg-paper"
        >
          {t(copy.cta.secondary, locale)}
        </Link>
      </div>
      <div
        id="stores"
        className="font-body mx-auto mt-12 max-w-md rounded-2xl border border-line bg-white px-6 py-5 text-sm text-ink/75"
      >
        <p className="font-label mb-2 text-[10px] text-j-green">Store locator</p>
        <p>{t(copy.cta.stores, locale)}</p>
        <a
          href={`mailto:${copy.footer.email}`}
          className="mt-3 inline-block font-medium text-ink underline-offset-2 hover:underline"
        >
          {copy.footer.email}
        </a>
      </div>
      <p className="font-label mt-12 text-[10px] text-ink/50">
        FORBES INDIA · ET BRAND EQUITY · YOURSTORY · MONEYCONTROL
      </p>
    </div>
  );
}

export function CtaSection({ locale }: { locale: Locale }) {
  return (
    <SectionFallback
      id="find-j"
      aria-label="Find J"
      className="border-t border-line bg-paper"
      tier0={<CtaContent locale={locale} />}
      tier1={<CtaContent locale={locale} />}
      tier2={<CtaContent locale={locale} />}
    />
  );
}
