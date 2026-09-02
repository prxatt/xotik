import Link from "next/link";
import { copy, t, tLines, type Locale } from "@/lib/copy";
import { HeroBillboard, HeroBillboardCopy } from "@/components/sections/hero/HeroBillboard";

type HeroStaticProps = {
  locale: Locale;
};

/** Tier 0 / reduced motion — full billboard hero. */
export function HeroStatic({ locale }: HeroStaticProps) {
  const headlines = tLines(copy.hero.headline, locale);

  return (
    <section id="hero" aria-label="Hero">
      <HeroBillboard>
        <HeroBillboardCopy
          locale={locale}
          devanagariAccent={copy.hero.devanagariAccent}
          headlines={headlines}
          sub={t(copy.hero.sub, locale)}
          cta={
            <Link href="#product" className="btn-pop">
              {t(copy.hero.cta, locale)}
            </Link>
          }
        />
      </HeroBillboard>
    </section>
  );
}
