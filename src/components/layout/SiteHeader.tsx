"use client";

import Link from "next/link";
import { copy, t } from "@/lib/copy";
import { useLanguage } from "@/context/LanguageContext";
import { useHeaderTheme } from "@/hooks/useHeaderSolid";
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
  const theme = useHeaderTheme();
  const onDarkHero = theme === "dark-hero";
  const solid = theme === "solid";

  const chapter = copy.chapters[activeChapter - 1];
  const chapterLabel = chapter
    ? `${String(activeChapter).padStart(2, "0")} — ${chapter.label[locale]}`
    : "01 — Street";

  const inkClass = onDarkHero ? "text-hero-ink" : "text-ink";
  const mutedClass = onDarkHero ? "text-hero-ink/75" : "text-ink/70";
  const chapterClass = onDarkHero ? "text-hero-ink/90" : "text-ink/80";
  const chipClass = onDarkHero
    ? "border-hero-ink/35 bg-hero-ink/10 text-hero-ink hover:bg-hero-ink/20"
    : "border-line bg-white/60 text-ink hover:bg-white";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "border-b border-line bg-[var(--header-solid)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-[var(--section-pad-x)] md:px-[var(--section-pad-x-desktop)]">
        <Link href="/" className={`group flex min-w-0 items-center gap-2 no-underline ${inkClass}`}>
          <span
            className={`font-condensed text-[2rem] leading-none tracking-wide ${
              onDarkHero ? "text-hero-surface" : ""
            }`}
          >
            {copy.header.logo}
          </span>
          <span
            className={`font-receipt hidden text-[9px] tracking-[0.22em] sm:inline ${
              onDarkHero ? "text-hero-ink/80" : mutedClass
            }`}
          >
            {copy.header.logoSub.toUpperCase()}
          </span>
        </Link>

        <p
          className={`font-receipt hidden text-[10px] tracking-[0.18em] sm:block ${chapterClass}`}
          aria-live="polite"
        >
          {chapterLabel.toUpperCase()}
        </p>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleLocale}
            className={`font-label rounded-full border px-3 py-2 text-[10px] ${chipClass}`}
            aria-label={`Switch language. Current: ${locale}`}
          >
            {locale === "en" ? "EN / HI" : "HI / EN"}
          </button>

          <Link
            href="#product"
            className={onDarkHero ? "btn-pop hidden min-[420px]:inline-flex text-sm" : "btn-primary hidden min-[420px]:inline-flex"}
            data-cursor-label="MEET J"
          >
            {t(copy.header.cta, locale)}
          </Link>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={onMenuOpen}
            className={`font-label rounded-full border px-3 py-2 text-[10px] md:hidden ${chipClass}`}
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
