"use client";

import { useEffect, useState } from "react";

/** Chapter numbers 1–6 map to copy.chapters */
const LATER_SECTIONS: { id: string; chapter: number }[] = [
  { id: "find-j", chapter: 6 },
  { id: "manifesto", chapter: 5 },
  { id: "ingredients", chapter: 4 },
  { id: "product", chapter: 3 },
];

function focalY() {
  return window.scrollY + window.innerHeight * 0.38;
}

function sectionTop(id: string): number | null {
  const el = document.getElementById(id);
  return el ? el.offsetTop : null;
}

/** Tier 1/2: #factory is a 1px anchor inside the street pin. Tier 0: full #factory section. */
function isFactoryAnchorOnly(el: HTMLElement) {
  return el.offsetHeight <= 8 && el.offsetWidth <= 8;
}

/**
 * Tracks homepage chapter for the header.
 * Factory (ch.2) sticks for standalone sections and in-scene pin anchors.
 */
export function useScrollChapter() {
  const [activeChapter, setActiveChapter] = useState(1);

  useEffect(() => {
    function resolveChapter() {
      const y = focalY();

      for (const section of LATER_SECTIONS) {
        const top = sectionTop(section.id);
        if (top !== null && y >= top) {
          setActiveChapter(section.chapter);
          return;
        }
      }

      const factoryEl = document.getElementById("factory");
      const streetEl = document.getElementById("street");

      if (factoryEl && !isFactoryAnchorOnly(factoryEl)) {
        const factoryTop = factoryEl.offsetTop;
        if (y >= factoryTop) {
          setActiveChapter(2);
          return;
        }
      }

      if (streetEl) {
        const streetTop = streetEl.offsetTop;
        if (y >= streetTop) {
          if (factoryEl && isFactoryAnchorOnly(factoryEl)) {
            const anchorY =
              factoryEl.getBoundingClientRect().top + window.scrollY;
            const factoryLine = anchorY - window.innerHeight * 0.22;
            if (y >= factoryLine) {
              setActiveChapter(2);
              return;
            }
          }
          setActiveChapter(1);
          return;
        }
      }

      setActiveChapter(1);
    }

    resolveChapter();
    window.addEventListener("scroll", resolveChapter, { passive: true });
    window.addEventListener("resize", resolveChapter, { passive: true });
    return () => {
      window.removeEventListener("scroll", resolveChapter);
      window.removeEventListener("resize", resolveChapter);
    };
  }, []);

  return activeChapter;
}
