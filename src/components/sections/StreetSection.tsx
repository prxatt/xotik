"use client";

import Link from "next/link";
import { useCapabilityTierContext } from "@/context/CapabilityTierContext";
import { copy, t, tLines, type Locale } from "@/lib/copy";
import { StreetParallaxScene } from "@/components/sections/street/StreetParallaxScene";
import { StreetStatic, StreetStaticLayered } from "@/components/sections/street/StreetStatic";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type StreetSectionProps = {
  locale: Locale;
};

export function StreetSection({ locale }: StreetSectionProps) {
  const { tier, isReady } = useCapabilityTierContext();
  const prefersReducedMotion = usePrefersReducedMotion();

  if (!isReady) {
    return <StreetStaticLayered locale={locale} />;
  }

  if (tier === 0 || prefersReducedMotion) {
    return <StreetStatic locale={locale} />;
  }

  if (tier === 1) {
    return <StreetParallaxScene locale={locale} tier={1} />;
  }

  return <StreetParallaxScene locale={locale} tier={2} />;
}

export function HeroIntro({ locale }: { locale: Locale }) {
  const headlines = tLines(copy.hero.headline, locale);

  return (
    <section
      id="hero"
      className="relative flex min-h-[min(100dvh,720px)] flex-col justify-end border-b border-line/40 bg-paper px-[var(--section-pad-x)] pb-12 pt-24 md:px-[var(--section-pad-x-desktop)]"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <h1 className="font-display max-w-[14ch] text-[clamp(2.5rem,8vw,4.5rem)] font-bold leading-[0.95] text-ink">
          {headlines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="font-body mt-6 max-w-md text-base text-ink/75 md:text-lg">
          {t(copy.hero.sub, locale)}
        </p>
        <div className="mt-8">
          <Link href="#product" className="btn-primary">
            {t(copy.hero.cta, locale)}
          </Link>
        </div>
      </div>
    </section>
  );
}
