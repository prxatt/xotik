"use client";

import Link from "next/link";
import { copy, t, chapterKicker } from "@/lib/copy";
import { useLanguage } from "@/context/LanguageContext";
import { useSceneHeaderStyle } from "@/hooks/useSceneHeaderStyle";
import type { RefObject } from "react";

export const MOBILE_MENU_ID = "mobile-menu";

type SiteHeaderProps = {
  activeChapter?: number;
  menuOpen?: boolean;
  menuButtonRef?: RefObject<HTMLButtonElement | null>;
  onMenuOpen?: () => void;
};

const HEADER_CLASS: Record<string, string> = {
  hero: "site-header--hero",
  street: "site-header--street",
  factory: "site-header--factory",
  product: "site-header--product",
  taste: "site-header--taste",
  manifesto: "site-header--manifesto",
  cta: "site-header--cta",
};

export function SiteHeader({
  activeChapter = 1,
  menuOpen = false,
  menuButtonRef,
  onMenuOpen,
}: SiteHeaderProps) {
  const { locale, toggleLocale } = useLanguage();
  const headerStyle = useSceneHeaderStyle(activeChapter);
  const headerMod = HEADER_CLASS[headerStyle] ?? "site-header--product";

  const chapter = copy.chapters[activeChapter - 1];
  const chapterLabel = chapter
    ? `${String(activeChapter).padStart(2, "0")} — ${chapter.label[locale]}`
    : chapterKicker(0, locale);

  return (
    <header className={`site-header ${headerMod}`}>
      <div className="site-header__inner">
        <Link href="/" className="site-header__logo group no-underline">
          <span className="site-header__logo-mark font-condensed">{copy.header.logo}</span>
          <span className="site-header__logo-sub font-receipt hidden sm:inline">
            {copy.header.logoSub.toUpperCase()}
          </span>
        </Link>

        {headerStyle !== "hero" ? (
          <p className="site-header__chapter font-receipt hidden sm:block" aria-live="polite">
            {chapterLabel}
          </p>
        ) : null}

        <div className="site-header__actions">
          <button
            type="button"
            onClick={toggleLocale}
            className="site-header__chip font-label"
            aria-label={`Switch language. Current: ${locale === "en" ? "English" : "Hinglish"}`}
          >
            {t(copy.header.toggle, locale)}
          </button>

          <Link
            href="#product"
            className="btn-pop site-header__cta hidden md:inline-flex"
            data-cursor-label="MEET J"
          >
            {t(copy.header.cta, locale)}
          </Link>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={onMenuOpen}
            className="site-header__chip site-header__menu font-label md:hidden"
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
