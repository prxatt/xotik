"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useMemo, useState, type CSSProperties } from "react";
import { SectionFallback } from "@/components/fallback/SectionFallback";
import { useCapabilityTierContext } from "@/context/CapabilityTierContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { copy, t, type Locale } from "@/lib/copy";
import { drinkById } from "@/lib/media";
import type { CanLabelKind } from "@/components/three/createBrandLabelTexture";

const ProductLineCanvas = dynamic(
  () => import("@/components/three/ProductLineCanvas").then((m) => m.ProductLineCanvas),
  { ssr: false },
);

const PRODUCT_LINE = copy.product.variants;

type FlavorId = (typeof PRODUCT_LINE)[number]["id"];

function isFlavorId(id: string): id is FlavorId {
  return PRODUCT_LINE.some((v) => v.id === id);
}

function ProductPanel({
  locale,
  show3d,
}: {
  locale: Locale;
  show3d: boolean;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeId, setActiveId] = useState<FlavorId>("jeeru");
  const active = useMemo(
    () => PRODUCT_LINE.find((v) => v.id === activeId) ?? PRODUCT_LINE[0]!,
    [activeId],
  );
  const photo = drinkById(activeId);
  const billboard = t(active.billboard, locale);
  const nameParts = billboard.trim().split(/\s+/);
  const chars = Math.max(...nameParts.map((p) => p.length), 5);

  return (
    <div className="product-billboard" data-flavor={activeId}>
      <p
        className="font-condensed product-billboard__name"
        aria-hidden
        style={{ "--chars": chars } as CSSProperties}
        key={activeId}
      >
        {nameParts.length > 1 ? (
          nameParts.map((part) => (
            <span key={part} className="product-billboard__name-line">
              {part}
            </span>
          ))
        ) : (
          billboard
        )}
      </p>

      <h2 className="sr-only">{t(active.label, locale)}</h2>

      <div className="product-billboard__stage" data-cursor-label={billboard}>
        {show3d ? (
          <ProductLineCanvas
            kind={activeId as CanLabelKind}
            reducedMotion={prefersReducedMotion}
          />
        ) : (
          <div className="product-billboard__photo">
            <Image
              key={photo.id}
              src={photo.src}
              alt={photo.alt}
              width={640}
              height={960}
              className="product-billboard__photo-img"
              priority={photo.id === "jeeru"}
            />
          </div>
        )}
      </div>

      <nav className="product-billboard__line" aria-label={t(copy.product.lineLabel, locale)}>
        {PRODUCT_LINE.map((item) => {
          const selected = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              className={`product-billboard__sku product-billboard__sku--${item.id}${selected ? " is-active" : ""}`}
              aria-pressed={selected}
              data-cursor-label={t(item.label, locale).toUpperCase()}
              onClick={() => {
                if (isFlavorId(item.id)) setActiveId(item.id);
              }}
            >
              <span className="font-condensed product-billboard__sku-name">
                {t(item.label, locale)}
              </span>
              <span className="font-receipt product-billboard__sku-tag">{t(item.tag, locale)}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export function ProductSection({ locale }: { locale: Locale }) {
  const { tier } = useCapabilityTierContext();

  return (
    <SectionFallback
      id="product"
      scene="product"
      aria-label="J by Jeeru product line"
      className="relative product-scene"
      tier0={<ProductPanel locale={locale} show3d={false} />}
      tier1={<ProductPanel locale={locale} show3d={tier >= 1} />}
      tier2={<ProductPanel locale={locale} show3d />}
    />
  );
}
