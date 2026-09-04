"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/lib/copy";
import {
  StreetCopy,
  StreetMonsoonImage,
  StreetOverlay,
  StreetSeaVideo,
  bindStreetVideoScrub,
  waitForStreetMedia,
} from "@/components/sections/street/StreetShared";

gsap.registerPlugin(ScrollTrigger);

type StreetParallaxSceneProps = {
  locale: Locale;
  tier: 1 | 2;
};

/** Parallax travel must stay within layer overscan to avoid clipped gaps. */
const PARALLAX = {
  1: {
    sectionClass: "h-[160vh] min-h-[160vh]",
    bgInset: "18%",
    fgInset: "22%",
    bgY: { from: -2, to: 7 },
    fgY: { from: -4, to: 11 },
    copyY: { from: 0, to: -4 },
    copyOpacity: 0.94,
    scrub: 1,
  },
  2: {
    sectionClass: "h-[220vh] min-h-[220vh]",
    bgInset: "20%",
    fgInset: "26%",
    bgY: { from: -3, to: 10 },
    fgY: { from: -5, to: 14 },
    copyY: { from: 0, to: -8 },
    copyOpacity: 0.88,
    scrub: 0.65,
  },
} as const;

export function StreetParallaxScene({ locale, tier }: StreetParallaxSceneProps) {
  const rootRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);
  const streetVideoRef = useRef<HTMLVideoElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const config = PARALLAX[tier];

  useEffect(() => {
    const root = rootRef.current;
    const bg = bgRef.current;
    const fg = fgRef.current;
    const copy = copyRef.current;
    if (!root || !bg || !fg || !copy) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    let ctx: gsap.Context | null = null;
    let cancelled = false;

    waitForStreetMedia(root).then(() => {
      if (cancelled) return;

      ctx = gsap.context(() => {
        const scrollConfig = {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: config.scrub,
          invalidateOnRefresh: true,
        };

        const tl = gsap.timeline({ scrollTrigger: scrollConfig });

        tl.fromTo(
          bg,
          { yPercent: config.bgY.from },
          { yPercent: config.bgY.to, ease: "none", duration: 1 },
          0,
        );

        tl.fromTo(
          fg,
          { yPercent: config.fgY.from },
          { yPercent: config.fgY.to, ease: "none", duration: 1 },
          0,
        );

        tl.fromTo(
          copy,
          { yPercent: config.copyY.from, opacity: 1 },
          {
            yPercent: config.copyY.to,
            opacity: config.copyOpacity,
            ease: "none",
            duration: 1,
          },
          0,
        );

        const streetVideo = streetVideoRef.current;
        if (streetVideo) {
          bindStreetVideoScrub(streetVideo, root, 1);
        }
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
      aria-label="Indian street scene"
      className={`relative ${config.sectionClass}`}
    >
      <div className="sticky top-0 h-[100dvh] min-h-[100dvh] overflow-hidden">
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
          <StreetSeaVideo videoRef={streetVideoRef} priority />
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

        <div ref={copyRef} className="relative z-10 will-change-transform">
          <StreetCopy locale={locale} />
        </div>

        {tier === 2 && (
          <p className="font-label absolute bottom-4 right-4 z-10 rounded-full bg-white/80 px-3 py-1 text-[9px] text-ink/50">
            Tier 2 · scroll parallax
          </p>
        )}
      </div>
    </section>
  );
}
