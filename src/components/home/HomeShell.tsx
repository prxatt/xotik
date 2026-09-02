"use client";

import { copy } from "@/lib/copy";
import { useLanguage } from "@/context/LanguageContext";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { HeroIntro, StreetSection } from "@/components/sections/StreetSection";
import { FactorySection } from "@/components/sections/FactorySection";
import { ProductSection } from "@/components/sections/ProductSection";
import { IngredientsSection } from "@/components/sections/IngredientsSection";
import { ManifestoSection } from "@/components/sections/ManifestoSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { useRef, useState } from "react";

export function HomeShell() {
  const { locale } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <SiteHeader
        activeChapter={1}
        menuOpen={menuOpen}
        menuButtonRef={menuButtonRef}
        onMenuOpen={() => setMenuOpen(true)}
      />
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        returnFocusRef={menuButtonRef}
      />

      <main id="main">
        <HeroIntro locale={locale} />
        <StreetSection locale={locale} />
        <FactorySection locale={locale} />
        <ProductSection locale={locale} />
        <IngredientsSection locale={locale} />
        <ManifestoSection locale={locale} />
        <CtaSection locale={locale} />
      </main>

      <footer className="border-t border-line px-[var(--section-pad-x)] py-10 md:px-[var(--section-pad-x-desktop)]">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="font-label text-[10px] text-ink/60">{copy.footer.parent}</p>
          <p className="font-label text-[10px] text-ink/60">{copy.footer.compliance}</p>
          <div className="font-body flex gap-4 text-sm">
            <a
              href={`mailto:${copy.footer.email}`}
              className="text-ink underline-offset-2 hover:underline"
            >
              {copy.footer.email}
            </a>
            <a
              href={`tel:${copy.footer.phone.replace(/\s/g, "")}`}
              className="text-ink underline-offset-2 hover:underline"
            >
              {copy.footer.phone}
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
