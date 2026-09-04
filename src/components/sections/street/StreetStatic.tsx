import type { Locale } from "@/lib/copy";
import {
  StreetCopy,
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
      <div className="street-billboard absolute inset-0">
        <div className="street-billboard__stage">
          <StreetSeaImage priority />
        </div>
        <StreetOverlay />
        <div className="relative z-20">
          <StreetCopy locale={locale} />
        </div>
      </div>
    </section>
  );
}

export function StreetStaticLayered({ locale }: { locale: Locale }) {
  return <StreetStatic locale={locale} />;
}
