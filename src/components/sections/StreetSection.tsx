import Image from "next/image";
import Link from "next/link";
import { SectionFallback } from "@/components/fallback/SectionFallback";
import { copy, t, tLines, type Locale } from "@/lib/copy";

const STREET_SEA = "/assets/hero/street-sea-link.jpg";
const STREET_MONSOON = "/assets/hero/street-monsoon-market.jpg";

function StreetBackdrop({ priority = false }: { priority?: boolean }) {
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

function StreetOverlay() {
  return (
    <div
      className="absolute inset-0 bg-gradient-to-t from-paper via-paper/80 to-paper/20"
      aria-hidden
    />
  );
}

function StreetCopy({ locale }: { locale: Locale }) {
  const lines = tLines(copy.street.headline, locale);

  return (
    <div className="relative z-10 mx-auto w-full max-w-[1280px] px-[var(--section-pad-x)] pb-16 pt-24 md:px-[var(--section-pad-x-desktop)] md:pb-24">
      <p className="font-label mb-4 text-j-coral">01 — Street</p>
      <h1 className="font-display max-w-[16ch] text-[clamp(2rem,6vw,3.5rem)] font-bold leading-[0.95] text-ink">
        {lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h1>
      <p className="font-label mt-8 text-[10px] text-ink/50">Scroll ↓</p>
    </div>
  );
}

type StreetSectionProps = {
  locale: Locale;
};

export function StreetSection({ locale }: StreetSectionProps) {
  return (
    <SectionFallback
      id="street"
      aria-label="Indian street scene"
      className="relative min-h-[100dvh]"
      tier0={
        <>
          <div className="absolute inset-0">
            <StreetBackdrop priority />
            <StreetOverlay />
          </div>
          <StreetCopy locale={locale} />
        </>
      }
      tier1={
        <>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 scale-105">
              <StreetBackdrop priority />
            </div>
            <div className="absolute inset-0 scale-110 opacity-40 mix-blend-multiply">
              <Image
                src={STREET_MONSOON}
                alt=""
                fill
                className="object-cover object-center"
                sizes="100vw"
              />
            </div>
            <StreetOverlay />
          </div>
          <StreetCopy locale={locale} />
        </>
      }
      tier2={
        <>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-[-2%] scale-[1.02] motion-safe:animate-[street-drift_24s_ease-in-out_infinite_alternate]">
              <StreetBackdrop priority />
            </div>
            <div className="absolute inset-0 scale-110 opacity-35 mix-blend-multiply motion-safe:animate-[street-drift_30s_ease-in-out_infinite_alternate-reverse]">
              <Image
                src={STREET_MONSOON}
                alt=""
                fill
                className="object-cover object-center"
                sizes="100vw"
              />
            </div>
            <StreetOverlay />
          </div>
          <StreetCopy locale={locale} />
          <p className="font-label absolute bottom-4 right-4 z-10 rounded-full bg-white/80 px-3 py-1 text-[9px] text-ink/50">
            Tier 2 · 2.5D preview
          </p>
        </>
      }
    />
  );
}

export function HeroIntro({ locale }: { locale: Locale }) {
  const headlines = tLines(copy.hero.headline, locale);

  return (
    <section
      id="hero"
      className="relative flex min-h-[min(100dvh,720px)] flex-col justify-end border-b border-line/40 bg-paper px-[var(--section-pad-x)] pb-12 pt-24 md:px-[var(--section-pad-x-desktop)]"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <h2 className="font-display max-w-[14ch] text-[clamp(2.5rem,8vw,4.5rem)] font-bold leading-[0.95] text-ink">
          {headlines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <p className="font-body mt-6 max-w-md text-base text-ink/75 md:text-lg">
          {t(copy.hero.sub, locale)}
        </p>
        <div className="mt-8">
          <Link id="meet-j" href="#product" className="btn-primary">
            {t(copy.hero.cta, locale)}
          </Link>
        </div>
      </div>
    </section>
  );
}
