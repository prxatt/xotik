import Link from "next/link";
import { copy, t, tLines, type Locale } from "@/lib/copy";
import { WordSplit } from "@/lib/motion/splitWords";

type HeroStaticProps = {
  locale: Locale;
};

/** Tier 0 / reduced motion — bold static billboard hero. */
export function HeroStatic({ locale }: HeroStaticProps) {
  const headlines = tLines(copy.hero.headline, locale);
  const showDevanagariAccent = locale === "en";

  return (
    <section
      id="hero"
      className="scene-shell texture-grain relative flex min-h-[100dvh] flex-col justify-end bg-cine-jaguar px-[var(--section-pad-x)] pb-12 pt-24 text-paper md:px-[var(--section-pad-x-desktop)]"
      data-scene="manifesto"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        {showDevanagariAccent && (
          <p className="font-devanagari-display mb-3 text-[clamp(2rem,8vw,3.5rem)] text-cine-gold">
            {copy.hero.devanagariAccent}
          </p>
        )}
        <h1 className="font-condensed max-w-[12ch] text-[clamp(3.5rem,14vw,7.5rem)] leading-[0.82] text-paper">
          {headlines.map((line) => (
            <span key={line} className="block">
              <WordSplit text={line} />
            </span>
          ))}
        </h1>
        <p className="font-body mt-6 max-w-md text-base text-cine-olive/90 md:text-lg">
          {t(copy.hero.sub, locale)}
        </p>
        <div className="mt-8">
          <Link href="#product" className="btn-pop">
            {t(copy.hero.cta, locale)}
          </Link>
        </div>
      </div>
    </section>
  );
}
