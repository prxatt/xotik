"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { copy, t, tLines, type Locale } from "@/lib/copy";
import { WordSplit } from "@/lib/motion/splitWords";

gsap.registerPlugin(ScrollTrigger);

type HeroKineticSceneProps = {
  locale: Locale;
  tier: 1 | 2;
};

const TIMELINE_END = 1;

const SCENE = {
  1: {
    totalVh: 150,
    scrub: 0.85,
    typeEnd: 0.72,
    wordY: -28,
  },
  2: {
    totalVh: 190,
    scrub: 0.6,
    typeEnd: 0.68,
    wordY: -42,
  },
} as const;

export function HeroKineticScene({ locale, tier }: HeroKineticSceneProps) {
  const rootRef = useRef<HTMLElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLParagraphElement>(null);
  const config = SCENE[tier];

  const headlines = tLines(copy.hero.headline, locale);
  const showDevanagariAccent = locale === "en";

  useEffect(() => {
    const scene = SCENE[tier];
    const root = rootRef.current;
    const type = typeRef.current;
    const sub = subRef.current;
    const cta = ctaRef.current;
    const accent = accentRef.current;

    if (!root || !type || !sub || !cta) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const words = type.querySelectorAll<HTMLElement>(".kinetic-word");
    const accentWords = accent?.querySelectorAll<HTMLElement>(".kinetic-word") ?? [];

    const ctx = gsap.context(() => {
      gsap.set(words, { yPercent: 0, opacity: 1 });
      if (accentWords.length > 0) gsap.set(accentWords, { yPercent: 0, opacity: 1 });
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
        words,
        { yPercent: 0, opacity: 1 },
        {
          yPercent: scene.wordY,
          opacity: 0.15,
          ease: "none",
          duration: scene.typeEnd,
          stagger: tier === 2 ? 0.04 : 0.025,
        },
        0,
      );

      if (accentWords.length > 0) {
        tl.fromTo(
          accentWords,
          { yPercent: 0, opacity: 1 },
          {
            yPercent: scene.wordY * 0.7,
            opacity: 0,
            ease: "none",
            duration: scene.typeEnd * 0.85,
            stagger: 0.03,
          },
          0,
        );
      }

      tl.fromTo(
        sub,
        { opacity: 1, y: 0 },
        { opacity: 0, y: -24, ease: "none", duration: scene.typeEnd * 0.45 },
        0,
      );

      tl.fromTo(
        cta,
        { opacity: 1, y: 0 },
        { opacity: 0, y: -16, ease: "none", duration: scene.typeEnd * 0.4 },
        0.05,
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
      <div
        className="scene-shell texture-grain sticky top-0 flex h-[100dvh] min-h-[100dvh] flex-col justify-center overflow-hidden px-[var(--section-pad-x)] pb-12 pt-24 text-paper md:justify-end md:px-[var(--section-pad-x-desktop)]"
        data-scene="manifesto"
      >
        <div ref={typeRef} className="mx-auto w-full max-w-[1280px]">
          {showDevanagariAccent && (
            <p
              ref={accentRef}
              className="font-devanagari-display mb-2 text-[clamp(2rem,9vw,4rem)] text-cine-gold"
            >
              <WordSplit text={copy.hero.devanagariAccent} />
            </p>
          )}
          <h1 className="font-condensed max-w-[12ch] text-[clamp(3.5rem,15vw,8.5rem)] leading-[0.8] text-paper">
            {headlines.map((line) => (
              <span key={line} className="block">
                <WordSplit text={line} />
              </span>
            ))}
          </h1>
        </div>

        <div className="mx-auto w-full max-w-[1280px]">
          <p
            ref={subRef}
            className="font-body mt-6 max-w-md text-base text-cine-olive/90 md:text-lg"
          >
            {t(copy.hero.sub, locale)}
          </p>
          <div ref={ctaRef} className="mt-8">
            <Link href="#product" className="btn-pop">
              {t(copy.hero.cta, locale)}
            </Link>
          </div>
        </div>

        {tier === 2 && (
          <p className="font-label absolute bottom-4 right-4 rounded-full bg-white/10 px-3 py-1 text-[9px] text-paper/60">
            Tier 2 · kinetic hero
          </p>
        )}
      </div>
    </section>
  );
}
