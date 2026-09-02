"use client";

import { useEffect, useState } from "react";

/** Returns true once user has scrolled past the hero threshold. */
export function useHeaderSolid(threshold = 48) {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    function onScroll() {
      setSolid(window.scrollY > threshold);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return solid;
}
