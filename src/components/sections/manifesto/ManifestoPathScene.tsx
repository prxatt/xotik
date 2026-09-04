"use client";

import Image from "next/image";
import { useRef } from "react";
import { copy, t, tLines, scriptDisplayClass, type Locale } from "@/lib/copy";
import {
  useManifestoMotionPath,
  useManifestoOathScroll,
} from "@/hooks/useManifestoMotionPath";

type ManifestoPathSceneProps = {
  locale: Locale;
  tier: 1 | 2;
};

function ManifestoStopCard({
  locale,
  index,
  stop,
  initial = false,
}: {
  locale: Locale;
  index: number;
  stop: (typeof copy.manifesto.stops)[number];
  initial?: boolean;
}) {
  return (
    <div
      className={`manifesto-stop ${initial ? "manifesto-stop--initial" : ""} ${
        index % 2 === 0 ? "manifesto-stop--left" : "manifesto-stop--right"
      }`}
    >
      <article className={`manifesto-stop-card ${index % 2 === 0 ? "manifesto-stop-card--gold" : "manifesto-stop-card--red"}`}>
        <span className="manifesto-stop-card__label font-receipt">{t(stop.label, locale)}</span>
        <h2 className={`manifesto-stop-card__title ${scriptDisplayClass(t(stop.title, locale))}`}>{t(stop.title, locale)}</h2>
        <p className="manifesto-stop-card__body font-receipt">{t(stop.body, locale)}</p>
        <div className="manifesto-marker" aria-hidden />
      </article>
    </div>
  );
}

export function ManifestoPathScene({ locale, tier }: ManifestoPathSceneProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const travelerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const oathRef = useRef<HTMLElement>(null);

  useManifestoMotionPath(sectionRef, travelerRef, svgRef, {
    enabled: true,
    scrub: tier === 2 ? true : 1,
  });
  useManifestoOathScroll(oathRef, true);

  return (
    <>
      <section
        ref={sectionRef}
        className="manifesto-path-section scene-shell texture-grain"
        data-scene="manifesto"
        aria-label="J manifesto journey"
      >
        <div className="manifesto-path-intro mx-auto max-w-[1280px] px-[var(--section-pad-x)] pt-20 md:px-[var(--section-pad-x-desktop)]">
          <p className="font-receipt text-[11px] tracking-[0.22em] text-scene-accent">
            05 · {t(copy.manifesto.intro, locale)}
          </p>
          <h2 className="font-condensed mt-4 text-[clamp(2.5rem,10vw,5rem)] leading-[0.88] text-scene-surface">
            {tLines(copy.manifesto.headline, locale).map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </div>

        <svg ref={svgRef} className="manifesto-path-trace" aria-hidden />

        <div ref={travelerRef} className="manifesto-traveler" aria-hidden>
          <Image
            src="/assets/products/xotik-jeeru-can.jpg"
            alt=""
            width={80}
            height={120}
            className="manifesto-traveler__img"
          />
        </div>

        <ManifestoStopCard
          locale={locale}
          index={0}
          stop={copy.manifesto.stops[0]}
          initial
        />

        {copy.manifesto.stops.slice(1).map((stop, index) => (
          <ManifestoStopCard key={stop.id} locale={locale} index={index + 1} stop={stop} />
        ))}

        <div className="manifesto-path-end" aria-hidden />
      </section>

      <div className="manifesto-oath-bridge">
        <div className="manifesto-oath-bridge__left">
          <span className="font-receipt manifesto-oath-bridge__label">
            {t(copy.manifesto.oathBridge.label, locale)}
          </span>
          <h3 className="font-condensed manifesto-oath-bridge__headline">
            {t(copy.manifesto.oathBridge.headline, locale)}
            <br />
            <em>{t(copy.manifesto.oathBridge.headlineAccent, locale)}</em>
          </h3>
        </div>
        <div className="manifesto-oath-bridge__right">
          <p className="font-body manifesto-oath-bridge__sub">
            {t(copy.manifesto.oathBridge.sub, locale)}
          </p>
          <div className="manifesto-oath-arrows" aria-hidden>
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>

      <section ref={oathRef} className="manifesto-oath-clip scene-shell" data-scene="manifesto">
        <span className="font-receipt manifesto-oath-clip__title">
          ✦ {t(copy.manifesto.intro, locale)} — {t(copy.manifesto.hoverHint, locale)} ✦
        </span>
        {copy.manifesto.oath.map((line, index) => (
          <h4 key={line.main.en} className="manifesto-oath-line font-condensed">
            {t(line.main, locale)}
            <span className={index % 2 === 0 ? "manifesto-oath-line__reveal--pink" : "manifesto-oath-line__reveal--gold"}>
              {t(line.reveal, locale)}
            </span>
          </h4>
        ))}
      </section>
    </>
  );
}
