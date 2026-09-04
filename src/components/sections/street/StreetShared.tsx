import Image from "next/image";
import { type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { copy, t, tLines, chapterKicker, type Locale } from "@/lib/copy";
import { cloudinaryVideoUrl } from "@/lib/cloudinary";
import {
  STREET_SCROLL_FPS,
  STREET_SCROLL_POSTER,
  STREET_SCROLL_VIDEO_ID,
} from "@/lib/media";

gsap.registerPlugin(ScrollTrigger);

export const STREET_SEA = "/assets/hero/street-sea-link.jpg";
export const STREET_MONSOON = "/assets/hero/street-monsoon-market.jpg";

const STREET_VIDEO_SRC = cloudinaryVideoUrl(STREET_SCROLL_VIDEO_ID);

/** Safari will not paint seeks on a never-played element — kick the decoder once. */
function waitForSeek(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve) => {
    const closeEnough =
      Math.abs(video.currentTime - time) < 0.04 &&
      video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA;

    if (closeEnough) {
      resolve();
      return;
    }

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      video.removeEventListener("seeked", finish);
      resolve();
    };

    video.addEventListener("seeked", finish, { once: true });
    video.currentTime = time;
    window.setTimeout(finish, 500);
  });
}

function primeStreetVideo(video: HTMLVideoElement): Promise<void> {
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";

  return video
    .play()
    .catch(() => undefined)
    .then(() => {
      video.pause();
      return waitForSeek(video, 0);
    });
}

function whenVideoCanScrub(video: HTMLVideoElement, onReady: () => void) {
  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && video.duration > 0) {
    onReady();
    return;
  }

  const ready = () => {
    if (video.duration > 0) onReady();
  };

  video.addEventListener("canplay", ready, { once: true });
  video.addEventListener("loadedmetadata", ready, { once: true });
}

/** Smooth street motion: zoom is the scroll story. Seek only on fine pointers. */
export function bindStreetVideoScrub(
  video: HTMLVideoElement,
  trigger: HTMLElement,
  progressEnd = 1,
) {
  video.muted = true;
  video.playsInline = true;
  video.loop = true;
  video.preload = "auto";

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (coarse) {
    void video.play().catch(() => undefined);
    return;
  }

  let primed = false;
  let duration = 0;
  let lastProgress = 0;
  let lastSeek = 0;

  const seek = (progress: number) => {
    if (!primed || duration <= 0) return;
    const now = performance.now();
    if (now - lastSeek < 48) return;
    lastSeek = now;
    const t = gsap.utils.clamp(0, 1, progress / progressEnd);
    const next =
      Math.round(t * Math.max(duration - 1 / STREET_SCROLL_FPS, 0) * STREET_SCROLL_FPS) /
      STREET_SCROLL_FPS;
    if (Math.abs(video.currentTime - next) < 0.08) return;
    video.currentTime = next;
  };

  ScrollTrigger.create({
    trigger,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate(self) {
      lastProgress = self.progress;
      seek(self.progress);
    },
  });

  void primeStreetVideo(video).then(() => {
    whenVideoCanScrub(video, () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      duration = video.duration;
      primed = true;
      seek(lastProgress);
    });
  });
}

function waitForVideoFrame(video: HTMLVideoElement): Promise<void> {
  return new Promise((resolve) => {
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      resolve();
      return;
    }

    video.addEventListener("canplay", () => resolve(), { once: true });
    video.addEventListener("error", () => resolve(), { once: true });
  });
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

  waits.push(...videos.map((video) => waitForVideoFrame(video)));

  if (waits.length === 0) return Promise.resolve();

  return Promise.race([
    Promise.all(waits).then(() => undefined),
    new Promise<void>((resolve) => window.setTimeout(resolve, 1500)),
  ]);
}

export function StreetOverlay() {
  return (
    <>
      <div className="street-billboard__wash" aria-hidden />
      <div className="street-billboard__grid" aria-hidden />
    </>
  );
}

export function StreetCopy({ locale }: { locale: Locale }) {
  const lines = tLines(copy.street.headline, locale);

  return (
    <div className="street-copy street-copy-layout">
      <p className="street-receipt font-receipt">{chapterKicker(0, locale)}</p>
      <h2 className="street-headline font-condensed">
        {lines.map((line, index) => {
          const accentLast = index === lines.length - 1 && lines.length > 1;
          return (
            <span
              key={line}
              className={`street-headline__line${accentLast ? " street-headline__line--accent" : ""}`}
            >
              {line}
            </span>
          );
        })}
      </h2>
      <p className="street-copy__note font-receipt">{t(copy.street.note, locale)}</p>
      <p className="font-receipt mt-6 text-[10px] tracking-[0.22em] text-[#fff3d4]/70">
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
      className="absolute inset-0 h-full w-full"
      src={STREET_VIDEO_SRC}
      poster={STREET_SCROLL_POSTER}
      muted
      playsInline
      preload={priority ? "auto" : "metadata"}
      disablePictureInPicture
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
