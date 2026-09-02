"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/lib/copy";
import {
  StreetCopy,
  StreetMonsoonImage,
  StreetOverlay,
  StreetSeaImage,
} from "@/components/sections/street/StreetShared";

gsap.registerPlugin(ScrollTrigger);

type StreetParallaxSceneProps = {
  locale: Locale;
  tier: 1 | 2;
};

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

export function StreetParallaxScene({ locale, tier }: StreetParallaxSceneProps) {
  const rootRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  const scrollHeight = tier === 2 ? "min(220vh, 1800px)" : "min(160vh, 1200px)";
  const bgTravel = tier === 2 ? 16 : 9;
  const fgTravel = tier === 2 ? 26 : 14;
  const copyTravel = tier === 2 ? -10 : -5;

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

    waitForImages(root).then(() => {
      if (cancelled) return;

      ctx = gsap.context(() => {
        const scrollConfig = {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: tier === 2 ? 0.65 : 1,
          invalidateOnRefresh: true,
        };

        gsap.fromTo(
          bg,
          { yPercent: -4 },
          { yPercent: bgTravel, ease: "none", scrollTrigger: scrollConfig },
        );

        gsap.fromTo(
          fg,
          { yPercent: -6 },
          { yPercent: fgTravel, ease: "none", scrollTrigger: scrollConfig },
        );

        gsap.fromTo(
          copy,
          { yPercent: 0, opacity: 1 },
          { yPercent: copyTravel, opacity: tier === 2 ? 0.88 : 0.94, ease: "none", scrollTrigger: scrollConfig },
        );
      }, root);

      ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [tier, bgTravel, fgTravel, copyTravel]);

  return (
    <section
      ref={rootRef}
      id="street"
      aria-label="Indian street scene"
      className="relative"
      style={{ height: scrollHeight }}
    >
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <div
          ref={bgRef}
          className="absolute inset-[-6%] will-change-transform"
          aria-hidden
        >
          <StreetSeaImage priority />
        </div>

        <div
          ref={fgRef}
          className={`absolute inset-[-10%] will-change-transform mix-blend-multiply ${
            tier === 2 ? "opacity-35" : "opacity-40"
          }`}
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
