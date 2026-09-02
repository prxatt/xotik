"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type SectionRevealOptions = {
  enabled?: boolean;
  /** Drive CSS --progress on the root (CodePen panel pattern) */
  progress?: boolean;
  /** Zoom / scale a media card on enter */
  mediaRef?: RefObject<HTMLElement | null>;
  /** Rise + fade headline words or lines */
  lineSelector?: string;
};

/**
 * Scroll-linked section enter — thumb zoom, line rise, optional --progress.
 * Inspired by Margarita's panel scroll (scrub 0.6) without copying Y2K styling.
 */
export function useSectionReveal(
  rootRef: RefObject<HTMLElement | null>,
  {
    enabled = true,
    progress = true,
    mediaRef,
    lineSelector = ".section-kinetic-line",
  }: SectionRevealOptions = {},
) {
  useEffect(() => {
    if (!enabled) return;

    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const media = mediaRef?.current;
    const lines = root.querySelectorAll<HTMLElement>(lineSelector);

    const ctx = gsap.context(() => {
      if (progress) {
        ScrollTrigger.create({
          trigger: root,
          start: "top 100%",
          end: "bottom 25%",
          scrub: true,
          onUpdate(self) {
            root.style.setProperty("--progress", String(self.progress));
          },
        });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 88%",
          end: "top 32%",
          scrub: 0.6,
        },
      });

      if (media) {
        gsap.set(media, { transformOrigin: "50% 20%" });
        tl.fromTo(
          media,
          { scale: 1.18, yPercent: -4, rotate: -2 },
          { scale: 1, yPercent: 0, rotate: 0, ease: "none" },
          0,
        );
      }

      if (lines.length) {
        tl.fromTo(
          lines,
          { y: 56, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08, ease: "none" },
          0,
        );
      }
    }, root);

    return () => ctx.revert();
  }, [enabled, progress, mediaRef, lineSelector, rootRef]);
}
