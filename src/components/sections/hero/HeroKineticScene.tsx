"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { copy, t, tLines, type Locale } from "@/lib/copy";
import { HeroBillboard, HeroBillboardCopy } from "@/components/sections/hero/HeroBillboard";

gsap.registerPlugin(ScrollTrigger);

type HeroKineticSceneProps = {
  locale: Locale;
  tier: 1 | 2;
};

export function HeroKineticScene({ locale, tier }: HeroKineticSceneProps) {
  const headlines = tLines(copy.hero.headline, locale);
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const typeLayerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    const sheet = sheetRef.current;
    if (!root || !pin || !sheet) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * 0.28)}`,
          scrub: true,
          pin,
          pinSpacing: true,
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        sheet,
        { y: 0, opacity: 1 },
        { y: -10, opacity: 1, ease: "none", duration: 0.72 },
        0,
      );

      tl.to(sheet, { opacity: 0, ease: "none", duration: 0.28 }, 0.72);

      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, [tier, locale]);

  return (
    <section ref={rootRef} id="hero" aria-label="Hero" className="hero-scroll-zone">
      <HeroBillboard frameRef={pinRef} sheetRef={sheetRef}>
        <HeroBillboardCopy
          locale={locale}
          garnishTop={t(copy.hero.garnish.top, locale)}
          stampText={t(copy.hero.stamp, locale)}
          receipt={t(copy.hero.receipt, locale)}
          devanagariAccent={copy.hero.devanagariAccent}
          headlines={headlines}
          sub={t(copy.hero.sub, locale)}
          typeLayerRef={typeLayerRef}
          headlineRef={headlineRef}
          subRef={subRef}
          ctaRef={ctaRef}
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
