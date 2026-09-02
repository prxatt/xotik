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

const TIMELINE_END = 1;

const SCENE = {
  1: {
    totalVh: 140,
    scrub: 0.9,
    typeEnd: 0.65,
    wordY: -18,
  },
  2: {
    totalVh: 175,
    scrub: 0.65,
    typeEnd: 0.6,
    wordY: -26,
  },
} as const;

export function HeroKineticScene({ locale, tier }: HeroKineticSceneProps) {
  const rootRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const accentRef = useRef<HTMLParagraphElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const config = SCENE[tier];

  const headlines = tLines(copy.hero.headline, locale);

  useEffect(() => {
    const scene = SCENE[tier];
    const root = rootRef.current;
    const headline = headlineRef.current;
    const accent = accentRef.current;
    const sub = subRef.current;
    const cta = ctaRef.current;

    if (!root || !headline || !sub || !cta) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const headlineWords = headline.querySelectorAll<HTMLElement>(".kinetic-word");

    const ctx = gsap.context(() => {
      gsap.set(headlineWords, { yPercent: 0, opacity: 1 });
      if (accent) gsap.set(accent, { y: 0, opacity: 1 });
      gsap.set(sub, { opacity: 1, y: 0 });
      gsap.set(cta, { opacity: 1, y: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: scene.scrub,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        headlineWords,
        { yPercent: 0, opacity: 1 },
        {
          yPercent: scene.wordY,
          opacity: 0.35,
          ease: "none",
          duration: scene.typeEnd,
          stagger: tier === 2 ? 0.035 : 0.02,
        },
        0.08,
      );

      if (accent) {
        tl.fromTo(
          accent,
          { y: 0, opacity: 1 },
          { y: -20, opacity: 0, ease: "none", duration: scene.typeEnd * 0.5 },
          0,
        );
      }

      tl.fromTo(
        sub,
        { opacity: 1, y: 0 },
        { opacity: 0, y: -16, ease: "none", duration: scene.typeEnd * 0.4 },
        0.12,
      );

      tl.fromTo(
        cta,
        { opacity: 1, y: 0 },
        { opacity: 0, y: -12, ease: "none", duration: scene.typeEnd * 0.35 },
        0.15,
      );

      tl.to({}, { duration: TIMELINE_END - scene.typeEnd, ease: "none" }, scene.typeEnd);

      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, [tier, locale]);

  return (
    <section
      ref={rootRef}
      id="hero"
      aria-label="Hero"
      className="relative"
      style={{ height: `${config.totalVh}vh`, minHeight: `${config.totalVh}vh` }}
    >
      <HeroBillboard pin>
        <HeroBillboardCopy
          locale={locale}
          kinetic
          devanagariAccent={copy.hero.devanagariAccent}
          headlines={headlines}
          sub={t(copy.hero.sub, locale)}
          accentRef={accentRef}
          headlineRef={headlineRef}
          subRef={subRef}
          ctaRef={ctaRef}
          cta={
            <Link href="#product" className="btn-pop">
              {t(copy.hero.cta, locale)}
            </Link>
          }
        />
      </HeroBillboard>

      {tier === 2 && (
        <p className="font-label pointer-events-none absolute bottom-4 right-4 z-20 rounded-full bg-white/10 px-3 py-1 text-[9px] text-paper/60">
          Tier 2 · kinetic hero
        </p>
      )}
    </section>
  );
}
