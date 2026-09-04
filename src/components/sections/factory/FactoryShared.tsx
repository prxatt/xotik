"use client";

import dynamic from "next/dynamic";
import { copy, t, tLines, chapterKicker, type Locale } from "@/lib/copy";

const BottlingLineCanvas = dynamic(
  () => import("@/components/three/BottlingLineCanvas").then((mod) => mod.BottlingLineCanvas),
  { ssr: false },
);

export function FactoryCopy({ locale }: { locale: Locale }) {
  const lines = tLines(copy.factory.headline, locale);

  return (
    <div className="relative z-20 mx-auto flex min-h-[100dvh] w-full max-w-[1280px] flex-col justify-end px-[var(--section-pad-x)] pb-16 pt-28 md:px-[var(--section-pad-x-desktop)] md:pb-24 md:pt-32">
      <p className="font-receipt mb-4 text-[11px] tracking-[0.22em] text-[var(--factory-mikan)]">
        {chapterKicker(1, locale)}
      </p>
      <h2 className="font-condensed max-w-[14ch] text-[clamp(2.75rem,9vw,4.75rem)] leading-[0.88] tracking-wide text-[var(--scene-factory-ink)]">
        {lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h2>
      <p className="font-receipt mt-6 max-w-lg text-[11px] tracking-[0.14em] text-[var(--factory-byakugun)]/90 md:text-xs">
        {t(copy.factory.micro, locale)}
      </p>
    </div>
  );
}

export function FactoryVisual({
  variant,
}: {
  variant: "static" | "motion" | "3d";
}) {
  return <BottlingLineCanvas rolling={variant !== "static"} />;
}
