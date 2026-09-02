"use client";

import { useEffect, useState } from "react";
import { copy } from "@/lib/copy";

const CHAPTER_IDS = copy.chapters.map((chapter) => chapter.id);

/**
 * Tracks which homepage chapter is in view for the header label.
 * Hero = chapter index 0 (not in chapters array — shows street until #street).
 */
export function useScrollChapter() {
  const [activeChapter, setActiveChapter] = useState(1);

  useEffect(() => {
    const sections = CHAPTER_IDS.map((id) => document.getElementById(id)).filter(
      Boolean,
    ) as HTMLElement[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length === 0) return;

        const id = visible[0].target.id;
        const index = (CHAPTER_IDS as readonly string[]).indexOf(id);
        if (index >= 0) setActiveChapter(index + 1);
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0, 0.15, 0.35, 0.55] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return activeChapter;
}
