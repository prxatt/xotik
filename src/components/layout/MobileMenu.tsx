"use client";

import Link from "next/link";
import { copy, t } from "@/lib/copy";
import { useLanguage } from "@/context/LanguageContext";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

const links = [
  { href: "/", label: { en: "Home", hinglish: "Home" } },
  { href: "/privacy", label: { en: "Privacy", hinglish: "Privacy" } },
  { href: "/terms", label: { en: "Terms", hinglish: "Terms" } },
  { href: "#meet-j", label: copy.header.cta },
];

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { locale } = useLanguage();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="Close menu"
        onClick={onClose}
      />
      <nav className="absolute right-0 top-0 flex h-full w-[min(100%,280px)] flex-col gap-2 border-l border-line bg-paper p-6 pt-20 shadow-xl">
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
