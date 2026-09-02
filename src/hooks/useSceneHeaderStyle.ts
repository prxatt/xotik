"use client";

import { useEffect, useState } from "react";
import type { DesiPopScene } from "@/components/layout/DesiPopShell";

export type HeaderStyle = DesiPopScene | "transparent";

const CHAPTER_SCENE: Record<number, HeaderStyle> = {
  1: "street",
  2: "factory",
  3: "product",
  4: "taste",
  5: "manifesto",
  6: "cta",
};

function isInHeroZone() {
  const hero = document.getElementById("hero");
  if (!hero) return window.scrollY < window.innerHeight * 0.85;
  const heroBottom = hero.offsetTop + hero.offsetHeight;
  return window.scrollY < heroBottom - window.innerHeight * 0.12;
}

/**
 * Scene-aware header styling — keeps desi-pop continuity after the hero pin.
 */
export function useSceneHeaderStyle(activeChapter: number): HeaderStyle {
  const [style, setStyle] = useState<HeaderStyle>("hero");

  useEffect(() => {
    function update() {
      if (isInHeroZone()) {
        setStyle("hero");
        return;
      }
      setStyle(CHAPTER_SCENE[activeChapter] ?? "product");
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [activeChapter]);

  return style;
}
