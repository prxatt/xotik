"use client";

import { useEffect, useState } from "react";

/** Chapter numbers 1–6 map to copy.chapters */
const SECTION_CHAPTERS: { id: string; chapter: number }[] = [
  { id: "street", chapter: 1 },
  { id: "product", chapter: 3 },
  { id: "ingredients", chapter: 4 },
  { id: "manifesto", chapter: 5 },
  { id: "find-j", chapter: 6 },
];

function focalY() {
  return window.scrollY + window.innerHeight * 0.38;
}

/**
 * Tracks homepage chapter for the header.
 * Factory (ch.2) is inferred when the in-scene #factory anchor passes the focal line
 * while #street is still the active scroll region.
 */
export function useScrollChapter() {
  const [activeChapter, setActiveChapter] = useState(1);

  useEffect(() => {
    function resolveChapter() {
      const y = focalY();

      let chapter = 1;

      for (const section of SECTION_CHAPTERS) {
        const el = document.getElementById(section.id);
        if (!el) continue;
        const top = el.offsetTop;
        if (y >= top) chapter = section.chapter;
      }

      if (chapter === 1 || chapter === 2) {
        const street = document.getElementById("street");
        const factoryAnchor = document.getElementById("factory");
        if (street && factoryAnchor) {
          const streetTop = street.offsetTop;
          const streetBottom = streetTop + street.offsetHeight;
          if (y >= streetTop && y < streetBottom) {
            const anchorY =
              factoryAnchor.getBoundingClientRect().top + window.scrollY;
            chapter = y >= anchorY - window.innerHeight * 0.35 ? 2 : 1;
          }
        }
      }

      setActiveChapter(chapter);
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
