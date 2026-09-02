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

const SCENE = {
  1: {
    scrollVh: 105,
    scaleFrom: 1.04,
    scaleTo: 0.9,
    layerY: -72,
    lineShift: [
      { x: -18, y: -36, rotate: -1 },
      { x: 24, y: -58, rotate: 1.5 },
    ],
    accentY: -48,
    ghostScale: 1.08,
    garnishY: -28,
    stampRotate: -14,
  },
  2: {
    scrollVh: 118,
    scaleFrom: 1.08,
    scaleTo: 0.86,
    layerY: -96,
    lineShift: [
      { x: -36, y: -52, rotate: -2 },
      { x: 48, y: -78, rotate: 2.5 },
    ],
    accentY: -64,
    ghostScale: 1.1,
    garnishY: -40,
    stampRotate: -18,
  },
} as const;

export function HeroKineticScene({ locale, tier }: HeroKineticSceneProps) {
  const scene = SCENE[tier];
  const headlines = tLines(copy.hero.headline, locale);
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const typeLayerRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const accentRef = useRef<HTMLParagraphElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const handoffRef = useRef<HTMLDivElement>(null);
  const garnishTopRef = useRef<HTMLParagraphElement>(null);
  const garnishBoxRef = useRef<HTMLParagraphElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = SCENE[tier];
    const root = rootRef.current;
    const pin = pinRef.current;
    const typeLayer = typeLayerRef.current;
    const ghost = ghostRef.current;
    const headline = headlineRef.current;
    const accent = accentRef.current;
    const sub = subRef.current;
    const cta = ctaRef.current;
    const handoff = handoffRef.current;
    const garnishTop = garnishTopRef.current;
    const garnishBox = garnishBoxRef.current;
    const stamp = stampRef.current;

    if (!root || !pin || !typeLayer || !headline || !sub || !cta) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const lines = headline.querySelectorAll<HTMLElement>(".hero-kinetic-line");
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const scrollVh = isMobile ? Math.min(scene.scrollVh, 100) : scene.scrollVh;

    const ctx = gsap.context(() => {
      const endDistance = () => `+=${window.innerHeight * (scrollVh / 100)}`;

      const scrollConfig = {
        trigger: root,
        start: "top top",
        end: endDistance,
        scrub: true,
        pin,
        pinSpacing: true,
        anticipatePin: 1,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
      };

      const tl = gsap.timeline({ scrollTrigger: scrollConfig });

      // Phase A (0–0.42): gentle kinetic — headline stays readable
      tl.fromTo(
        typeLayer,
        { scale: scene.scaleFrom, y: 0, opacity: 1, transformOrigin: "0% 50%" },
        { scale: scene.scaleTo, y: scene.layerY * 0.55, ease: "none", duration: 0.42 },
        0,
      );

      lines.forEach((line, index) => {
        const shift = scene.lineShift[index] ?? scene.lineShift[scene.lineShift.length - 1];
        tl.fromTo(
          line,
          { x: 0, y: 0, rotation: 0 },
          {
            x: shift.x * 0.6,
            y: shift.y * 0.6,
            rotation: shift.rotate * 0.6,
            ease: "none",
            duration: 0.42,
          },
          0,
        );
      });

      if (ghost) {
        tl.fromTo(
          ghost,
          { opacity: 0.22, scale: 1.01 },
          { opacity: 0, scale: scene.ghostScale, ease: "none", duration: 0.38 },
          0,
        );
      }

      if (accent) {
        tl.fromTo(
          accent,
          { y: 0, opacity: 1 },
          { y: scene.accentY * 0.5, opacity: 0.55, ease: "none", duration: 0.35 },
          0,
        );
      }

      [garnishTop, garnishBox].forEach((el) => {
        if (!el) return;
        tl.fromTo(
          el,
          { y: 0, opacity: 1 },
          { y: scene.garnishY, opacity: 0.35, ease: "none", duration: 0.32 },
          0.04,
        );
      });

      if (stamp) {
        tl.fromTo(
          stamp,
          { y: 0, rotation: -8, opacity: 1, scale: 1 },
          {
            y: -32,
            rotation: scene.stampRotate,
            opacity: 0.4,
            scale: 1.08,
            ease: "none",
            duration: 0.34,
          },
          0.06,
        );
      }

      // Phase B (0.42–0.68): hold — sub/cta stay, handoff appears
      if (handoff) {
        gsap.set(handoff, { opacity: 0, y: 24 });
        tl.to(handoff, { opacity: 1, y: 0, ease: "none", duration: 0.18 }, 0.44);
      }

      // Phase C (0.68–0.88): exit — only now fade supporting copy
      tl.fromTo(
        sub,
        { opacity: 1, y: 0 },
        { opacity: 0, y: -24, ease: "none", duration: 0.14 },
        0.68,
      );

      tl.fromTo(
        cta,
        { opacity: 1, y: 0 },
        { opacity: 0, y: -18, ease: "none", duration: 0.12 },
        0.72,
      );

      tl.fromTo(
        typeLayer,
        { opacity: 1, y: scene.layerY * 0.55 },
        { opacity: 0, y: scene.layerY, ease: "none", duration: 0.18 },
        0.78,
      );

      if (handoff) {
        tl.to(handoff, { opacity: 0, y: -16, ease: "none", duration: 0.1 }, 0.88);
      }

      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, [tier, locale]);

  return (
    <section
      ref={rootRef}
      id="hero"
      aria-label="Hero"
      className="hero-scroll-zone"
      style={{ minHeight: `${scene.scrollVh}vh` }}
    >
      <HeroBillboard
        frameRef={pinRef}
        clip={false}
        ribbonText={copy.hero.ribbon}
        garnishTop={t(copy.hero.garnish.top, locale)}
        garnishBox={t(copy.hero.garnish.box, locale)}
        stampText={t(copy.hero.stamp, locale)}
        garnishTopRef={garnishTopRef}
        garnishBoxRef={garnishBoxRef}
        stampRef={stampRef}
        handoffRef={handoffRef}
        handoffLabel={t(copy.hero.handoff, locale)}
      >
        <HeroBillboardCopy
          locale={locale}
          kineticLines
          receipt={t(copy.hero.receipt, locale)}
          devanagariAccent={copy.hero.devanagariAccent}
          headlines={headlines}
          sub={t(copy.hero.sub, locale)}
          typeLayerRef={typeLayerRef}
          ghostRef={ghostRef}
          accentRef={accentRef}
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
