"use client";

import { useEffect, useState } from "react";

export type HeaderTheme = "dark-hero" | "solid" | "transparent";

/**
 * dark-hero: inverted marks on jaguar hero (top of page)
 * transparent: dark marks, transparent bar (post-hero, pre-solid)
 * solid: cream bar after scroll threshold
 */
export function useHeaderTheme(solidThreshold = 48, heroThresholdVh = 0.72) {
  const [theme, setTheme] = useState<HeaderTheme>("dark-hero");

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      const heroCutoff = window.innerHeight * heroThresholdVh;

      if (y > solidThreshold) {
        setTheme("solid");
      } else if (y < heroCutoff) {
        setTheme("dark-hero");
      } else {
        setTheme("transparent");
      }
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [solidThreshold, heroThresholdVh]);

  return theme;
}

/** @deprecated Use useHeaderTheme */
export function useHeaderSolid(threshold = 48) {
  const theme = useHeaderTheme(threshold);
  return theme === "solid";
}
