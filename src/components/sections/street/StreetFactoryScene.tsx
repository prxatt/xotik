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

/** Normalized timeline length — hold after crossfade keeps factory visible before unpin. */
const TIMELINE_END = 1;

const SCENE = {
  1: {
    totalVh: 260,
    parallaxEnd: 0.52,
    crossfadeStart: 0.52,
    crossfadeComplete: 0.68,
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
    parallaxEnd: 0.55,
    crossfadeStart: 0.55,
    crossfadeComplete: 0.7,
    bgInset: "20%",
    fgInset: "26%",
    bgY: { from: -3, to: 10 },
    fgY: { from: -5, to: 14 },
    streetCopyY: -8,
    scrub: 0.65,
    factoryVariant: "3d" as const,
  },
} as const;

/** Anchor sits along pin scroll distance (section − viewport), not full section height. */
function factoryAnchorTopVh(totalVh: number, crossfadeComplete: number): number {
  const pinScrollVh = Math.max(totalVh - 100, 0);
  return crossfadeComplete * pinScrollVh;
}

function refreshAfterImages(container: HTMLElement): Promise<void> {
  const images = Array.from(container.querySelectorAll("img"));
  if (images.length === 0) return Promise.resolve();

  return Promise.race([
    Promise.all(
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
    ).then(() => undefined),
    new Promise<void>((resolve) => window.setTimeout(resolve, 1200)),
  ]);
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
    const scene = SCENE[tier];
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

    ctx = gsap.context(() => {
      const crossfadeDuration = scene.crossfadeComplete - scene.crossfadeStart;

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
        bg,
        { yPercent: scene.bgY.from },
        { yPercent: scene.bgY.to, ease: "none", duration: scene.parallaxEnd },
        0,
      );

      tl.fromTo(
        fg,
        { yPercent: scene.fgY.from },
        { yPercent: scene.fgY.to, ease: "none", duration: scene.parallaxEnd },
        0,
      );

      tl.fromTo(
        streetCopy,
        { yPercent: 0, opacity: 1 },
        {
          yPercent: scene.streetCopyY,
          opacity: tier === 2 ? 0.88 : 0.94,
          ease: "none",
          duration: scene.parallaxEnd,
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
        scene.crossfadeStart,
      );

      tl.to(
        factoryGroup,
        { opacity: 1, ease: "none", duration: crossfadeDuration },
        scene.crossfadeStart,
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
        scene.crossfadeStart + crossfadeDuration * 0.2,
      );

      tl.to(
        {},
        { duration: TIMELINE_END - scene.crossfadeComplete, ease: "none" },
        scene.crossfadeComplete,
      );
    }, root);

    refreshAfterImages(root).then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [tier]);

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
            <StreetMonsoonImage priority />
          </div>

          <StreetOverlay />

          <div ref={streetCopyRef} className="relative z-10 will-change-transform">
            <StreetCopy locale={locale} />
          </div>
        </div>

        <div
          ref={factoryCopyRef}
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

      <div
        id="factory"
        tabIndex={-1}
        className="pointer-events-none absolute left-0 h-px w-px opacity-0"
        style={{
          top: `${factoryAnchorTopVh(config.totalVh, config.crossfadeComplete)}vh`,
          scrollMarginTop: "5rem",
        }}
        aria-label="Factory"
      />
    </section>
  );
}
