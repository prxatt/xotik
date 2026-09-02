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
    scrollVh: 110,
    scaleFrom: 1.1,
    scaleTo: 0.72,
    layerY: -160,
    lineShift: [
      { x: -32, y: -70, rotate: -1.5 },
      { x: 48, y: -130, rotate: 2 },
    ],
    accentY: -100,
    ghostY: -40,
    garnishY: -50,
    stampRotate: -18,
  },
  2: {
    scrollVh: 145,
    scaleFrom: 1.22,
    scaleTo: 0.58,
    layerY: -240,
    lineShift: [
      { x: -72, y: -110, rotate: -3.5 },
      { x: 96, y: -190, rotate: 4.5 },
    ],
    accentY: -150,
    ghostY: -70,
    garnishY: -80,
    stampRotate: -28,
  },
} as const;

export function HeroKineticScene({ locale, tier }: HeroKineticSceneProps) {
  const headlines = tLines(copy.hero.headline, locale);
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const typeLayerRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const accentRef = useRef<HTMLParagraphElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
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
    const garnishTop = garnishTopRef.current;
    const garnishBox = garnishBoxRef.current;
    const stamp = stampRef.current;

    if (!root || !pin || !typeLayer || !headline || !sub || !cta) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const lines = headline.querySelectorAll<HTMLElement>(".hero-kinetic-line");

    const ctx = gsap.context(() => {
      const endDistance = () => `+=${window.innerHeight * (scene.scrollVh / 100)}`;

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

      tl.fromTo(
        typeLayer,
        { scale: scene.scaleFrom, y: 0, transformOrigin: "0% 50%" },
        { scale: scene.scaleTo, y: scene.layerY, ease: "none", duration: 1 },
        0,
      );

      lines.forEach((line, index) => {
        const shift = scene.lineShift[index] ?? scene.lineShift[scene.lineShift.length - 1];
        tl.fromTo(
          line,
          { x: 0, y: 0, rotation: 0 },
          { x: shift.x, y: shift.y, rotation: shift.rotate, ease: "none", duration: 1 },
          0,
        );
      });

      if (ghost) {
        tl.fromTo(
          ghost,
          { y: 0, opacity: 0.28, scale: 1.02 },
          { y: scene.ghostY, opacity: 0, scale: 1.14, ease: "none", duration: 1 },
          0,
        );
      }

      if (accent) {
        tl.fromTo(
          accent,
          { y: 0, opacity: 1 },
          { y: scene.accentY, opacity: 0.15, ease: "none", duration: 0.85 },
          0,
        );
      }

      [garnishTop, garnishBox].forEach((el) => {
        if (!el) return;
        tl.fromTo(
          el,
          { y: 0, opacity: 1 },
          { y: scene.garnishY, opacity: 0, ease: "none", duration: 0.6 },
          0.02,
        );
      });

      if (stamp) {
        tl.fromTo(
          stamp,
          { y: 0, rotation: -8, opacity: 1, scale: 1 },
          {
            y: -60,
            rotation: scene.stampRotate,
            opacity: 0,
            scale: 1.15,
            ease: "none",
            duration: 0.75,
          },
          0.04,
        );
      }

      tl.fromTo(
        sub,
        { opacity: 1, y: 0 },
        { opacity: 0, y: -40, ease: "none", duration: 0.45 },
        0.05,
      );

      tl.fromTo(
        cta,
        { opacity: 1, y: 0 },
        { opacity: 0, y: -28, ease: "none", duration: 0.4 },
        0.08,
      );

      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, [tier, locale]);

  return (
    <section ref={rootRef} id="hero" aria-label="Hero" className="hero-scroll-zone">
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
            <Link href="#product" className="btn-pop">
              {t(copy.hero.cta, locale)}
            </Link>
          }
        />
      </HeroBillboard>
    </section>
  );
}
