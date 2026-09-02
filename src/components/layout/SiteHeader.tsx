"use client";

import Link from "next/link";
import { copy, t } from "@/lib/copy";
import { useLanguage } from "@/context/LanguageContext";
import { useHeaderSolid } from "@/hooks/useHeaderSolid";
import type { RefObject } from "react";

export const MOBILE_MENU_ID = "mobile-menu";

type SiteHeaderProps = {
  activeChapter?: number;
  menuOpen?: boolean;
  menuButtonRef?: RefObject<HTMLButtonElement | null>;
  onMenuOpen?: () => void;
};

export function SiteHeader({
  activeChapter = 1,
  menuOpen = false,
  menuButtonRef,
  onMenuOpen,
}: SiteHeaderProps) {
  const { locale, toggleLocale } = useLanguage();
  const solid = useHeaderSolid();

  const chapter = copy.chapters[activeChapter - 1];
  const chapterLabel = chapter
    ? `${String(activeChapter).padStart(2, "0")} — ${chapter.label[locale]}`
    : "01 — Street";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "border-b border-line bg-[var(--header-solid)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-[var(--section-pad-x)] md:px-[var(--section-pad-x-desktop)]">
        <Link href="/" className="group flex min-w-0 items-baseline gap-1.5 no-underline">
          <span className="font-display text-2xl font-bold leading-none text-ink">
            {copy.header.logo}
          </span>
          <span className="font-label hidden text-[10px] text-ink/70 sm:inline">
            {copy.header.logoSub}
          </span>
        </Link>

        <p
          className="font-label hidden text-[11px] text-ink/80 md:block"
          aria-live="polite"
        >
          {chapterLabel}
        </p>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleLocale}
            className="font-label rounded-full border border-line bg-white/60 px-3 py-2 text-[10px] text-ink hover:bg-white"
            aria-label={`Switch language. Current: ${locale}`}
          >
            {locale === "en" ? "EN / HI" : "HI / EN"}
          </button>

          <Link href="#product" className="btn-primary hidden sm:inline-flex">
            {t(copy.header.cta, locale)}
          </Link>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={onMenuOpen}
            className="font-label rounded-full border border-line bg-white/60 px-3 py-2 text-[10px] text-ink hover:bg-white md:hidden"
            aria-label={t(copy.header.menu, locale)}
            aria-expanded={menuOpen}
            aria-controls={MOBILE_MENU_ID}
          >
            {t(copy.header.menu, locale)}
          </button>
        </div>
      </div>
    </header>
  );
}
