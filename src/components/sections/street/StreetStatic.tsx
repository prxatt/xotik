import type { Locale } from "@/lib/copy";
import {
  StreetCopy,
  StreetMonsoonImage,
  StreetOverlay,
  StreetSeaImage,
} from "@/components/sections/street/StreetShared";

export function StreetStatic({ locale }: { locale: Locale }) {
  return (
    <section
      id="street"
      aria-label="Indian street scene"
      className="relative min-h-[100dvh]"
    >
      <div className="absolute inset-0">
        <StreetSeaImage priority />
        <StreetOverlay />
      </div>
      <StreetCopy locale={locale} />
    </section>
  );
}

export function StreetStaticLayered({ locale }: { locale: Locale }) {
  return (
    <section
      id="street"
      aria-label="Indian street scene"
      className="relative min-h-[100dvh]"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 scale-105">
          <StreetSeaImage priority />
        </div>
        <div className="absolute inset-0 scale-110 opacity-40 mix-blend-multiply">
          <StreetMonsoonImage />
        </div>
        <StreetOverlay />
      </div>
      <StreetCopy locale={locale} />
    </section>
  );
}
