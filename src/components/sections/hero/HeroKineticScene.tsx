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
  const handoffRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    const sheet = sheetRef.current;
    const handoff = handoffRef.current;
    if (!root || !pin || !sheet) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const typeLayer = typeLayerRef.current;
      const headline = headlineRef.current;
      const sub = subRef.current;
      const cta = ctaRef.current;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * 0.12)}`,
          scrub: 0.35,
          pin,
          pinSpacing: true,
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        sheet,
        { y: 0, scale: 1 },
        { y: -18, scale: 0.985, ease: "none", duration: 1 },
        0,
      );

      if (typeLayer) {
        tl.fromTo(
          typeLayer,
          { y: 0 },
          { y: -12, ease: "none", duration: 1 },
          0,
        );
      }

      if (headline && sub && cta) {
        tl.to([headline, sub, cta], { opacity: 0.94, ease: "none", duration: 1 }, 0);
      }

      if (handoff) {
        gsap.set(handoff, { opacity: 0, y: 16 });
        tl.to(handoff, { opacity: 1, y: 0, ease: "none", duration: 0.35 }, 0.45);
        tl.to(handoff, { opacity: 0.85, ease: "none", duration: 0.2 }, 0.85);
      }
    }, root);

    return () => ctx.revert();
  }, [tier, locale]);

  return (
    <section ref={rootRef} id="hero" aria-label="Hero" className="hero-scroll-zone">
      <HeroBillboard
        frameRef={pinRef}
        sheetRef={sheetRef}
        ribbonText={copy.hero.ribbon}
        garnishTop={t(copy.hero.garnish.top, locale)}
        garnishBox={t(copy.hero.garnish.box, locale)}
        handoffRef={handoffRef}
        handoffLabel={t(copy.hero.handoff, locale)}
      >
        <HeroBillboardCopy
          locale={locale}
          stampText={t(copy.hero.stamp, locale)}
          receipt={t(copy.hero.receipt, locale)}
          devanagariAccent={t(copy.hero.devanagariAccent, locale)}
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
