import Image from "next/image";
import { type RefObject } from "react";
import type gsap from "gsap";
import { copy, t, tLines, type Locale } from "@/lib/copy";
import { cloudinaryVideoUrl } from "@/lib/cloudinary";
import { STREET_SCROLL_VIDEO_ID } from "@/lib/media";

export const STREET_SEA = "/assets/hero/street-sea-link.jpg";
export const STREET_MONSOON = "/assets/hero/street-monsoon-market.jpg";

const STREET_VIDEO_SRC = cloudinaryVideoUrl(STREET_SCROLL_VIDEO_ID);

/** Bind scroll-scrubbed playback to a GSAP timeline segment. */
export function bindStreetVideoScrub(
  video: HTMLVideoElement,
  timeline: gsap.core.Timeline,
  segmentDuration: number,
  position = 0,
) {
  const scrub = () => {
    const end = video.duration;
    if (!Number.isFinite(end) || end <= 0) return;

    timeline.to(
      video,
      { currentTime: end, ease: "none", duration: segmentDuration },
      position,
    );
  };

  if (video.readyState >= 1) scrub();
  else video.addEventListener("loadedmetadata", scrub, { once: true });
}

export function waitForStreetMedia(container: HTMLElement): Promise<void> {
  const images = Array.from(container.querySelectorAll("img"));
  const videos = Array.from(container.querySelectorAll("video"));

  const waits: Promise<void>[] = images.map(
    (img) =>
      new Promise<void>((resolve) => {
        if (img.complete) resolve();
        else {
          img.addEventListener("load", () => resolve(), { once: true });
          img.addEventListener("error", () => resolve(), { once: true });
        }
      }),
  );

  waits.push(
    ...videos.map(
      (video) =>
        new Promise<void>((resolve) => {
          if (video.readyState >= 1) resolve();
          else {
            video.addEventListener("loadedmetadata", () => resolve(), { once: true });
            video.addEventListener("error", () => resolve(), { once: true });
          }
        }),
    ),
  );

  if (waits.length === 0) return Promise.resolve();

  return Promise.race([
    Promise.all(waits).then(() => undefined),
    new Promise<void>((resolve) => window.setTimeout(resolve, 1500)),
  ]);
}

export function StreetOverlay() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#040011]/88 via-[#0f2da8]/45 to-[#1a47eb]/25"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-soft-light"
        style={{
          backgroundImage:
            "linear-gradient(color-mix(in srgb, #ffe94a 18%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, #ffe94a 18%, transparent) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden
      />
    </>
  );
}

export function StreetCopy({ locale }: { locale: Locale }) {
  const lines = tLines(copy.street.headline, locale);

  return (
    <div className="relative z-10 mx-auto w-full max-w-[1280px] px-[var(--section-pad-x)] pb-16 pt-28 md:px-[var(--section-pad-x-desktop)] md:pb-24 md:pt-32">
      <p className="font-receipt mb-4 text-[11px] tracking-[0.22em] text-hero-accent">01 — STREET</p>
      <h2 className="font-condensed max-w-[12ch] text-[clamp(2.75rem,10vw,5.25rem)] leading-[0.88] tracking-wide text-hero-ink">
        {lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h2>
      <p className="font-receipt mt-8 text-[10px] tracking-[0.2em] text-hero-ink/75">
        {t(copy.street.scroll, locale)}
      </p>
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

export function StreetSeaVideo({
  videoRef,
  priority = false,
}: {
  videoRef?: RefObject<HTMLVideoElement | null>;
  priority?: boolean;
}) {
  return (
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover object-center"
      src={STREET_VIDEO_SRC}
      poster={STREET_SEA}
      muted
      playsInline
      preload={priority ? "metadata" : "none"}
      aria-hidden
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
