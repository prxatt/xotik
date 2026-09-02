import Image from "next/image";
import { copy, tLines, type Locale } from "@/lib/copy";

export const STREET_SEA = "/assets/hero/street-sea-link.jpg";
export const STREET_MONSOON = "/assets/hero/street-monsoon-market.jpg";

export function StreetOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-paper via-paper/80 to-paper/20"
      aria-hidden
    />
  );
}

export function StreetCopy({ locale }: { locale: Locale }) {
  const lines = tLines(copy.street.headline, locale);

  return (
    <div className="relative z-10 mx-auto w-full max-w-[1280px] px-[var(--section-pad-x)] pb-16 pt-24 md:px-[var(--section-pad-x-desktop)] md:pb-24">
      <p className="font-label mb-4 text-j-coral">01 — Street</p>
      <h2 className="font-display max-w-[16ch] text-[clamp(2rem,6vw,3.5rem)] font-bold leading-[0.95] text-ink">
        {lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h2>
      <p className="font-label mt-8 text-[10px] text-ink/50">Scroll ↓</p>
    </div>
  );
}

export function StreetSeaImage({ priority = false }: { priority?: boolean }) {
  return (
    <Image
      src={STREET_SEA}
      alt=""
      fill
      priority={priority}
      className="object-cover object-center"
      sizes="100vw"
    />
  );
}

export function StreetMonsoonImage({ priority = false }: { priority?: boolean }) {
  return (
    <Image
      src={STREET_MONSOON}
      alt=""
      fill
      priority={priority}
      className="object-cover object-center"
      sizes="100vw"
    />
  );
}
