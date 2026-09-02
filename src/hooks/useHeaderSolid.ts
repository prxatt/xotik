"use client";

import { useEffect, useState } from "react";

export type HeaderTheme = "dark-hero" | "solid" | "transparent";

const HERO_TRANSITION_PX = 96;

function getHeroCutoff(heroThresholdVh: number) {
  const heroEl = document.getElementById("hero");
  const vhCutoff = window.innerHeight * heroThresholdVh;

  if (!heroEl) return vhCutoff;

  // Pinned heroes extend past one viewport — use full section height.
  const sectionCutoff = Math.max(0, heroEl.offsetHeight - window.innerHeight * 0.08);
  return Math.max(vhCutoff, sectionCutoff);
}

/**
 * dark-hero: inverted marks on desi-pop cobalt hero (top of page)
 * transparent: dark marks, transparent bar (post-hero, pre-solid)
 * solid: cream bar after scroll threshold
 */
export function useHeaderTheme(solidThreshold = 48, heroThresholdVh = 0.72) {
  const [theme, setTheme] = useState<HeaderTheme>("dark-hero");

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      const heroEl = document.getElementById("hero");

      if (!heroEl) {
        setTheme(y > solidThreshold ? "solid" : "transparent");
        return;
      }

      const heroCutoff = getHeroCutoff(heroThresholdVh);

      if (y < heroCutoff) {
        setTheme("dark-hero");
      } else if (y < heroCutoff + HERO_TRANSITION_PX) {
        setTheme("transparent");
      } else if (y > solidThreshold) {
        setTheme("solid");
      } else {
        setTheme("transparent");
      }
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [solidThreshold, heroThresholdVh]);

  return theme;
}

/** @deprecated Use useHeaderTheme */
export function useHeaderSolid(threshold = 48) {
  const theme = useHeaderTheme(threshold);
  return theme === "solid";
}
