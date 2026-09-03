import Link from "next/link";
import { copy, t, tLines, type Locale } from "@/lib/copy";
import { HeroBillboard, HeroBillboardCopy } from "@/components/sections/hero/HeroBillboard";

type HeroStaticProps = {
  locale: Locale;
};

/** Tier 0 / reduced motion — stamp-cut desi-pop hero. */
export function HeroStatic({ locale }: HeroStaticProps) {
  const headlines = tLines(copy.hero.headline, locale);

  return (
    <section id="hero" aria-label="Hero" className="hero-scroll-zone">
      <HeroBillboard>
        <HeroBillboardCopy
          locale={locale}
          garnishTop={t(copy.hero.garnish.top, locale)}
          stampText={t(copy.hero.stamp, locale)}
          receipt={t(copy.hero.receipt, locale)}
          devanagariAccent={copy.hero.devanagariAccent}
          headlines={headlines}
          sub={t(copy.hero.sub, locale)}
          cta={
            <Link href="#product" className="btn-pop btn-pop--hero" data-cursor-label="MEET J">
              {t(copy.hero.cta, locale)}
            </Link>
          }
        />
      </HeroBillboard>
    </section>
  );
}
