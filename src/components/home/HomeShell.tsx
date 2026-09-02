"use client";

import Link from "next/link";
import { copy, t, tLines } from "@/lib/copy";
import { useLanguage } from "@/context/LanguageContext";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { useState } from "react";

export function HomeShell() {
  const { locale } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const headlines = tLines(copy.hero.headline, locale);

  return (
    <>
      <SiteHeader activeChapter={1} onMenuOpen={() => setMenuOpen(true)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main id="main">
        <section
          id="hero"
          className="relative flex min-h-[100dvh] flex-col justify-end px-[var(--section-pad-x)] pb-16 pt-24 md:px-[var(--section-pad-x-desktop)] md:pb-24"
        >
          <div className="mx-auto w-full max-w-[1280px]">
            <p className="font-label mb-4 text-j-coral">01 — Street</p>
            <h1
              className={`font-display max-w-[14ch] text-[clamp(2.5rem,8vw,4.5rem)] font-bold leading-[0.95] text-ink ${
                locale === "hinglish" ? "font-hindi" : ""
              }`}
            >
              {headlines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="font-body mt-6 max-w-md text-base text-ink/75 md:text-lg">
              {locale === "en"
                ? "Apple-juice-based fizzy masala drink from Xotik Frujus."
                : "Xotik Frujus ka apple-based fizzy masala drink."}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link id="meet-j" href="#meet-j" className="btn-primary">
                {t(copy.hero.cta, locale)}
              </Link>
              <p className="font-label text-[10px] text-ink/50">Scroll ↓</p>
            </div>
          </div>
        </section>

        <section
          aria-hidden="true"
          className="h-[120vh] border-t border-line/50 bg-gradient-to-b from-paper to-white"
        />
      </main>

      <footer className="border-t border-line px-[var(--section-pad-x)] py-10 md:px-[var(--section-pad-x-desktop)]">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="font-label text-[10px] text-ink/60">{copy.footer.parent}</p>
          <p className="font-label text-[10px] text-ink/60">{copy.footer.compliance}</p>
          <div className="font-body flex gap-4 text-sm">
            <a href={`mailto:${copy.footer.email}`} className="text-ink underline-offset-2 hover:underline">
              {copy.footer.email}
            </a>
            <a href={`tel:${copy.footer.phone.replace(/\s/g, "")}`} className="text-ink underline-offset-2 hover:underline">
              {copy.footer.phone}
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
