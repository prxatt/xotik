"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/lib/copy";
import {
  FactoryCopy,
  FactoryVisual,
} from "@/components/sections/factory/FactoryShared";
import {
  StreetCopy,
  StreetMonsoonImage,
  StreetOverlay,
  StreetSeaImage,
} from "@/components/sections/street/StreetShared";

gsap.registerPlugin(ScrollTrigger);

type StreetFactorySceneProps = {
  locale: Locale;
  tier: 1 | 2;
};

const SCENE = {
  1: {
    totalVh: 260,
    parallaxEnd: 0.615,
    crossfadeStart: 0.55,
    crossfadeEnd: 0.92,
    bgInset: "18%",
    fgInset: "22%",
    bgY: { from: -2, to: 7 },
    fgY: { from: -4, to: 11 },
    streetCopyY: -4,
    scrub: 1,
    factoryVariant: "motion" as const,
  },
  2: {
    totalVh: 340,
    parallaxEnd: 0.647,
    crossfadeStart: 0.58,
    crossfadeEnd: 0.9,
    bgInset: "20%",
    fgInset: "26%",
    bgY: { from: -3, to: 10 },
    fgY: { from: -5, to: 14 },
    streetCopyY: -8,
    scrub: 0.65,
    factoryVariant: "3d" as const,
  },
} as const;

function waitForImages(container: HTMLElement): Promise<void> {
  const images = Array.from(container.querySelectorAll("img"));
  if (images.length === 0) return Promise.resolve();

  return Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) resolve();
          else {
            img.addEventListener("load", () => resolve(), { once: true });
            img.addEventListener("error", () => resolve(), { once: true });
          }
        }),
    ),
  ).then(() => undefined);
}

export function StreetFactoryScene({ locale, tier }: StreetFactorySceneProps) {
  const rootRef = useRef<HTMLElement>(null);
  const streetGroupRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);
  const streetCopyRef = useRef<HTMLDivElement>(null);
  const factoryGroupRef = useRef<HTMLDivElement>(null);
  const factoryCopyRef = useRef<HTMLDivElement>(null);
  const config = SCENE[tier];

  useEffect(() => {
    const root = rootRef.current;
    const streetGroup = streetGroupRef.current;
    const bg = bgRef.current;
    const fg = fgRef.current;
    const streetCopy = streetCopyRef.current;
    const factoryGroup = factoryGroupRef.current;
    const factoryCopy = factoryCopyRef.current;

    if (!root || !streetGroup || !bg || !fg || !streetCopy || !factoryGroup || !factoryCopy) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    let ctx: gsap.Context | null = null;
    let cancelled = false;

    waitForImages(root).then(() => {
      if (cancelled) return;

      ctx = gsap.context(() => {
        const crossfadeDuration = config.crossfadeEnd - config.crossfadeStart;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            scrub: config.scrub,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(
          bg,
          { yPercent: config.bgY.from },
          { yPercent: config.bgY.to, ease: "none", duration: config.parallaxEnd },
          0,
        );

        tl.fromTo(
          fg,
          { yPercent: config.fgY.from },
          { yPercent: config.fgY.to, ease: "none", duration: config.parallaxEnd },
          0,
        );

        tl.fromTo(
          streetCopy,
          { yPercent: 0, opacity: 1 },
          {
            yPercent: config.streetCopyY,
            opacity: tier === 2 ? 0.88 : 0.94,
            ease: "none",
            duration: config.parallaxEnd,
          },
          0,
        );

        tl.to(
          streetGroup,
          {
            opacity: 0,
            filter: "blur(6px)",
            ease: "none",
            duration: crossfadeDuration,
          },
          config.crossfadeStart,
        );

        tl.to(
          factoryGroup,
          { opacity: 1, ease: "none", duration: crossfadeDuration },
          config.crossfadeStart,
        );

        tl.fromTo(
          factoryCopy,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "none",
            duration: crossfadeDuration * 0.75,
          },
          config.crossfadeStart + crossfadeDuration * 0.2,
        );
      }, root);

      ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [tier, config]);

  return (
    <section
      ref={rootRef}
      id="street"
      aria-label="Street to factory transition"
      className="relative"
      style={{ height: `${config.totalVh}vh`, minHeight: `${config.totalVh}vh` }}
    >
      <div className="sticky top-0 h-[100dvh] min-h-[100dvh] overflow-hidden">
        <div ref={factoryGroupRef} className="absolute inset-0 z-0 opacity-0" aria-hidden>
          <FactoryVisual variant={config.factoryVariant} />
        </div>

        <div ref={streetGroupRef} className="absolute inset-0 z-10">
          <div
            ref={bgRef}
            className="absolute will-change-transform"
            style={{
              top: `-${config.bgInset}`,
              right: `-${config.bgInset}`,
              bottom: `-${config.bgInset}`,
              left: `-${config.bgInset}`,
            }}
            aria-hidden
          >
            <StreetSeaImage priority />
          </div>

          <div
            ref={fgRef}
            className={`absolute will-change-transform mix-blend-multiply ${
              tier === 2 ? "opacity-35" : "opacity-40"
            }`}
            style={{
              top: `-${config.fgInset}`,
              right: `-${config.fgInset}`,
              bottom: `-${config.fgInset}`,
              left: `-${config.fgInset}`,
            }}
            aria-hidden
          >
            <StreetMonsoonImage />
          </div>

          <StreetOverlay />

          <div ref={streetCopyRef} className="relative z-10 will-change-transform">
            <StreetCopy locale={locale} />
          </div>
        </div>

        <div
          ref={factoryCopyRef}
          id="factory"
          className="pointer-events-none absolute inset-0 z-20 opacity-0"
        >
          <FactoryCopy locale={locale} />
        </div>

        {tier === 2 && (
          <p className="font-label absolute bottom-4 right-4 z-30 rounded-full bg-white/80 px-3 py-1 text-[9px] text-ink/50">
            Tier 2 · street → factory
          </p>
        )}
      </div>
    </section>
  );
}
