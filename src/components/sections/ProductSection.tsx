"use client";

import Image from "next/image";
import { useRef } from "react";
import { SectionFallback } from "@/components/fallback/SectionFallback";
import { useCapabilityTierContext } from "@/context/CapabilityTierContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { copy, t, tLines, type Locale } from "@/lib/copy";

const JEERU_CAN = {
  src: "/assets/products/xotik-jeeru-can.jpg",
  alt: "J by Jeeru Masala slim can",
};

function ProductPanel({ locale, animated }: { locale: Locale; animated: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const { tier } = useCapabilityTierContext();
  const prefersReducedMotion = usePrefersReducedMotion();
  const body = tLines(copy.product.body, locale);

  useSectionReveal(rootRef, {
    enabled: animated && !prefersReducedMotion && tier > 0,
    mediaRef: visualRef,
    progress: false,
    lineSelector: ".section-kinetic-line",
  });

  return (
    <div
      ref={rootRef}
      className="product-editorial mx-auto flex min-h-[min(100dvh,920px)] w-full max-w-[1280px] flex-col justify-center px-[var(--section-pad-x)] py-20 md:px-[var(--section-pad-x-desktop)] md:py-24"
    >
      <div className="product-editorial__grid">
        <div className="product-editorial__copy">
          <p className="font-receipt mb-4 text-[11px] tracking-[0.2em] text-scene-surface/90">
            03 · {t(copy.product.eyebrow, locale)}
          </p>
          <h2 className="font-condensed section-kinetic-line text-[clamp(3rem,12vw,6.5rem)] leading-[0.86] text-scene-surface">
            {t(copy.product.headline, locale)}
          </h2>
          <p className="font-body section-kinetic-line mt-5 max-w-md text-base text-scene-surface/90 md:text-lg">
            {t(copy.product.lead, locale)}
          </p>
          <div className="font-condensed mt-6 space-y-1 text-xl tracking-wide text-scene-surface md:text-2xl">
            {body.map((line) => (
              <p key={line} className="section-kinetic-line">
                {line}
              </p>
            ))}
          </div>
          <p className="font-receipt mt-8 inline-block rounded-full border border-scene-surface/40 px-4 py-2 text-[10px] tracking-[0.18em] text-scene-surface">
            {t(copy.product.flagship, locale)}
          </p>
        </div>

        <div ref={visualRef} className="product-editorial__visual" data-cursor-label="JEERU">
          <div className="product-editorial__frame">
            <Image
              src={JEERU_CAN.src}
              alt={JEERU_CAN.alt}
              width={640}
              height={960}
              className="product-editorial__img"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductSection({ locale }: { locale: Locale }) {
  return (
    <SectionFallback
      id="product"
      scene="product"
      aria-label="J by Jeeru product"
      className="relative overflow-hidden text-scene-ink"
      tier0={<ProductPanel locale={locale} animated={false} />}
      tier1={<ProductPanel locale={locale} animated />}
      tier2={<ProductPanel locale={locale} animated />}
    />
  );
}
