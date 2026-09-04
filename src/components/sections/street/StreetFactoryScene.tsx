"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { copy, t, type Locale } from "@/lib/copy";
import {
  FactoryCopy,
  FactoryVisual,
} from "@/components/sections/factory/FactoryShared";
import { DesiPopShell } from "@/components/layout/DesiPopShell";
import {
  StreetCopy,
  StreetOverlay,
  StreetSeaVideo,
  bindStreetVideoScrub,
  waitForStreetMedia,
} from "@/components/sections/street/StreetShared";

gsap.registerPlugin(ScrollTrigger);

type StreetFactorySceneProps = {
  locale: Locale;
  tier: 1 | 2;
};

/** Normalized timeline length — hold + line-pan after crossfade. */
const TIMELINE_END = 1;

const SCENE = {
  2: {
    /** Extra height: settle at bay, then travel the line to the carton. */
    totalVh: 400,
    parallaxEnd: 0.4,
    crossfadeStart: 0.4,
    crossfadeComplete: 0.52,
    /** Clear hold after crossfade so the line doesn’t jump backward on entry. */
    linePanStart: 0.7,
    linePanEnd: 0.88,
    bgInset: "0%",
    fgInset: "6%",
    streetCopyY: -8,
    scrub: 0.15,
    factoryVariant: "3d" as const,
  },
  1: {
    totalVh: 300,
    parallaxEnd: 0.46,
    crossfadeStart: 0.46,
    crossfadeComplete: 0.6,
    linePanStart: 0.72,
    linePanEnd: 0.88,
    bgInset: "0%",
    fgInset: "4%",
    streetCopyY: -6,
    scrub: 0.2,
    factoryVariant: "motion" as const,
  },
} as const;

/** Anchor sits along pin scroll distance (section − viewport), not full section height. */
function factoryAnchorTopVh(totalVh: number, crossfadeComplete: number): number {
  const pinScrollVh = Math.max(totalVh - 100, 0);
  return crossfadeComplete * pinScrollVh;
}

export function StreetFactoryScene({ locale, tier }: StreetFactorySceneProps) {
  const rootRef = useRef<HTMLElement>(null);
  const streetGroupRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const streetVideoRef = useRef<HTMLVideoElement>(null);
  const streetCopyRef = useRef<HTMLDivElement>(null);
  const factoryGroupRef = useRef<HTMLDivElement>(null);
  const factoryCopyRef = useRef<HTMLDivElement>(null);
  const config = SCENE[tier];

  useEffect(() => {
    const scene = SCENE[tier];
    const root = rootRef.current;
    const streetGroup = streetGroupRef.current;
    const bg = bgRef.current;
    const streetCopy = streetCopyRef.current;
    const factoryGroup = factoryGroupRef.current;
    const factoryCopy = factoryCopyRef.current;

    if (!root || !streetGroup || !bg || !streetCopy || !factoryGroup || !factoryCopy) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    let ctx: gsap.Context | null = null;
    let cancelled = false;

    const setLinePan = (progress: number) => {
      const span = scene.linePanEnd - scene.linePanStart;
      const raw = span > 0 ? (progress - scene.linePanStart) / span : 0;
      const pan = Math.min(1, Math.max(0, raw));
      factoryGroup.dataset.linePan = pan.toFixed(4);
      factoryGroup.style.setProperty("--line-pan", String(pan));
      // After line travel finishes, close the carton before the next section.
      const closeSpan = Math.max(0.001, 1 - scene.linePanEnd);
      const closeRaw = (progress - scene.linePanEnd) / closeSpan;
      const cartonClose = Math.min(1, Math.max(0, closeRaw));
      factoryGroup.dataset.cartonClose = cartonClose.toFixed(4);
    };

    ctx = gsap.context(() => {
      const crossfadeDuration = scene.crossfadeComplete - scene.crossfadeStart;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: scene.scrub,
          invalidateOnRefresh: true,
          onUpdate(self) {
            factoryGroup.toggleAttribute("data-on", self.progress >= scene.crossfadeStart - 0.06);
            setLinePan(self.progress);
          },
        },
      });

      tl.fromTo(
        bg,
        { scale: 1.62, transformOrigin: "22% 82%" },
        { scale: 1, ease: "none", duration: scene.parallaxEnd },
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

      const streetVideo = streetVideoRef.current;
      if (streetVideo) {
        bindStreetVideoScrub(streetVideo, root, scene.parallaxEnd);
      }

      tl.to(
        streetGroup,
        {
          yPercent: -8,
          opacity: 0,
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

      // Soften copy while traveling the line so the carton station reads.
      const panDur = scene.linePanEnd - scene.linePanStart;
      tl.to(
        factoryCopy,
        { opacity: 0.22, y: 28, ease: "none", duration: panDur * 0.85 },
        scene.linePanStart,
      );

      tl.to(
        {},
        { duration: TIMELINE_END - scene.crossfadeComplete, ease: "none" },
        scene.crossfadeComplete,
      );
    }, root);

    waitForStreetMedia(root).then(() => {
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
      className="relative z-[2]"
      style={{ height: `${config.totalVh}vh`, minHeight: `${config.totalVh}vh` }}
      data-line-travel
    >
      <div className="sticky top-0 h-[100dvh] min-h-[100dvh] overflow-hidden">
        <DesiPopShell
          scene="street"
          chrome="overlay"
          chromeOnly
          className="pointer-events-none absolute inset-0 z-[5]"
        />

        <div
          ref={factoryGroupRef}
          data-factory-stage
          data-line-pan="0"
          data-carton-close="0"
          className="absolute inset-0 z-0 h-[100dvh] w-full min-h-[100dvh] opacity-0"
          aria-hidden
        >
          <FactoryVisual variant={config.factoryVariant} />
        </div>

        <div ref={streetGroupRef} className="street-billboard absolute inset-0 z-10">
          <div ref={bgRef} className="street-billboard__stage will-change-transform" aria-hidden>
            <StreetSeaVideo videoRef={streetVideoRef} priority />
          </div>

          <StreetOverlay />

          <div ref={streetCopyRef} className="relative z-20 will-change-transform">
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
          <p className="font-receipt absolute bottom-4 right-4 z-30 rounded-full border border-[var(--factory-mikan)]/55 bg-[var(--factory-nasu)]/80 px-3 py-1 text-[9px] tracking-[0.14em] text-[var(--factory-wakatake)]">
            {t(copy.street.factoryHandoff, locale)}
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
