"use client";

import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import { copy, t } from "@/lib/copy";
import { useLanguage } from "@/context/LanguageContext";
import { MOBILE_MENU_ID } from "@/components/layout/SiteHeader";
import { DESKTOP_MENU_MQ } from "@/lib/breakpoints";
import type { RefObject } from "react";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  returnFocusRef?: RefObject<HTMLButtonElement | null>;
};

const links = [
  { href: "/", label: { en: "Home", hinglish: "Home" } },
  { href: "/privacy", label: { en: "Privacy", hinglish: "Privacy" } },
  { href: "/terms", label: { en: "Terms", hinglish: "Terms" } },
  { href: "#product", label: copy.header.cta },
];

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileMenu({ open, onClose, returnFocusRef }: MobileMenuProps) {
  const { locale } = useLanguage();
  const titleId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const desktopMq = window.matchMedia(DESKTOP_MENU_MQ);

    function closeOnDesktop(event: MediaQueryListEvent) {
      if (event.matches) onClose();
    }

    if (desktopMq.matches) {
      onClose();
      return;
    }

    desktopMq.addEventListener("change", closeOnDesktop);
    return () => desktopMq.removeEventListener("change", closeOnDesktop);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    if (window.matchMedia(DESKTOP_MENU_MQ).matches) return;

    const previousFocus = document.activeElement as HTMLElement | null;
    const menuButton = returnFocusRef?.current ?? null;

    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusables = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);

      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (menuButton) {
        menuButton.focus();
      } else {
        previousFocus?.focus();
      }
    };
  }, [open, onClose, returnFocusRef]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] md:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="Close menu"
        onClick={onClose}
        tabIndex={-1}
      />
      <nav
        ref={panelRef}
        id={MOBILE_MENU_ID}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute right-0 top-0 flex h-full w-[min(100%,280px)] flex-col gap-2 border-l border-line bg-paper p-6 pt-20 shadow-xl"
      >
        <div className="flex items-center justify-between gap-3 pb-2">
          <h2 id={titleId} className="font-display text-xl font-bold text-ink">
            {t(copy.header.menu, locale)}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="font-label rounded-full border border-line bg-white px-3 py-2 text-[10px] text-ink hover:bg-paper"
          >
            Close
          </button>
        </div>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="font-body rounded-xl px-3 py-3 text-lg font-medium text-ink no-underline hover:bg-white"
          >
            {t(link.label, locale)}
          </Link>
        ))}
      </nav>
    </div>
  );
}
