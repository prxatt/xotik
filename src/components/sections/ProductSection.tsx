"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionFallback } from "@/components/fallback/SectionFallback";
import { useCapabilityTierContext } from "@/context/CapabilityTierContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { copy, t, tLines, type Locale } from "@/lib/copy";

gsap.registerPlugin(ScrollTrigger);

const PRODUCT_IMAGES = [
  {
    src: "/assets/products/xotik-jeeru-can.jpg",
    alt: "J by Jeeru slim can",
    key: "jeeru",
  },
  {
    src: "/assets/products/xotik_cola_real.jpg",
    alt: "Xotik Cola bottle",
    key: "cola",
  },
  {
    src: "/assets/products/xotik-jeeru-clear-lemon.jpg",
    alt: "J clear lemon PET",
    key: "lemon",
  },
] as const;

function ProductCopy({ locale }: { locale: Locale }) {
  const body = tLines(copy.product.body, locale);

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-col items-center px-[var(--section-pad-x)] py-12 text-center md:px-[var(--section-pad-x-desktop)] md:py-16">
      <p className="font-receipt mb-4 text-[11px] tracking-[0.2em] text-scene-surface/90">
        03 · J · Xotik Frujus
      </p>
      <h2 className="font-condensed text-[clamp(3rem,14vw,7rem)] leading-[0.85] text-scene-surface">
        <span className="section-kinetic-line block">{t(copy.product.headline, locale)}</span>
      </h2>
      <div className="font-condensed mt-4 space-y-1 text-xl tracking-wide text-scene-surface/90 md:text-2xl">
        {body.map((line) => (
          <p key={line} className="section-kinetic-line">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

function ProductShowcase({
  locale,
  zoom,
}: {
  locale: Locale;
  zoom: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const { tier } = useCapabilityTierContext();
  const prefersReducedMotion = usePrefersReducedMotion();

  useSectionReveal(rootRef, {
    enabled: !prefersReducedMotion && tier > 0,
    mediaRef: imageRef,
    progress: true,
  });

  useEffect(() => {
    if (!zoom || prefersReducedMotion) return;

    const root = rootRef.current;
    const card = cardRef.current;
    const image = imageRef.current;
    if (!root || !card || !image) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: () => `+=${window.innerHeight * (tier === 2 ? 0.9 : 0.65)}`,
        pin: card,
        pinSpacing: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });

      gsap.fromTo(
        image,
        { scale: 1.22, yPercent: -8 },
        {
          scale: 1,
          yPercent: 4,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${window.innerHeight * (tier === 2 ? 0.9 : 0.65)}`,
            scrub: true,
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [zoom, prefersReducedMotion, tier]);

  return (
    <div ref={rootRef} className="section-panel relative min-h-[100dvh]">
      <div
        ref={cardRef}
        className="flex min-h-[100dvh] flex-col items-center justify-center gap-8 px-[var(--section-pad-x)] pb-16 pt-24 md:px-[var(--section-pad-x-desktop)]"
      >
        <div
          ref={imageRef}
          className="product-thumb relative mx-auto w-[min(88vw,320px)] will-change-transform"
          data-cursor-label="MEET J"
        >
          <div className="product-thumb__frame">
            <Image
              src={PRODUCT_IMAGES[0].src}
              alt={PRODUCT_IMAGES[0].alt}
              width={640}
              height={960}
              className="product-thumb__img"
              priority
            />
          </div>
          <p className="font-receipt mt-4 text-center text-[10px] tracking-[0.18em] text-scene-surface/80">
            {t(copy.product.variants[0].label, locale)}
          </p>
        </div>

        <div className="grid w-full max-w-lg grid-cols-3 gap-3">
          {PRODUCT_IMAGES.map((item, index) => (
            <div
              key={item.key}
              className="product-pill-mini overflow-hidden rounded-2xl border-2 border-scene-surface/30"
              style={{ opacity: index === 0 ? 1 : 0.75 }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={200}
                height={280}
                className="h-24 w-full object-cover object-top md:h-28"
              />
            </div>
          ))}
        </div>

        <ProductCopy locale={locale} />
      </div>
    </div>
  );
}

function ProductStatic({ locale }: { locale: Locale }) {
  const rootRef = useRef<HTMLDivElement>(null);
  useSectionReveal(rootRef, { enabled: false });

  return (
    <div ref={rootRef} className="flex min-h-[100dvh] flex-col items-center justify-center gap-8 px-6 py-24">
      <div className="product-thumb relative w-[min(80vw,280px)]">
        <div className="product-thumb__frame">
          <Image
            src={PRODUCT_IMAGES[0].src}
            alt={PRODUCT_IMAGES[0].alt}
            width={560}
            height={840}
            className="product-thumb__img"
          />
        </div>
      </div>
      <ProductCopy locale={locale} />
    </div>
  );
}

export function ProductSection({ locale }: { locale: Locale }) {
  return (
    <SectionFallback
      id="product"
      scene="product"
      aria-label="J product"
      className="relative overflow-hidden text-scene-ink"
      tier0={<ProductStatic locale={locale} />}
      tier1={<ProductShowcase locale={locale} zoom />}
      tier2={<ProductShowcase locale={locale} zoom />}
    />
  );
}
