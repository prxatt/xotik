"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

type Point = { x: number; y: number };

function buildSmoothPathD(points: Point[]): string {
  if (points.length === 0) return "";
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cx1 = prev.x + (curr.x - prev.x) * 0.5;
    const cy1 = prev.y;
    const cx2 = prev.x + (curr.x - prev.x) * 0.5;
    const cy2 = curr.y;
    d += ` C ${cx1},${cy1} ${cx2},${cy2} ${curr.x},${curr.y}`;
  }
  return d;
}

type ManifestoMotionPathOptions = {
  enabled?: boolean;
  scrub?: number | boolean;
};

/**
 * Scroll-driven motion path — gem/can travels between manifesto stop markers.
 * Adapted from Margarita's Maker's Manifesto (MotionPathPlugin + SVG trace draw).
 */
export function useManifestoMotionPath(
  sectionRef: RefObject<HTMLElement | null>,
  travelerRef: RefObject<HTMLElement | null>,
  svgRef: RefObject<SVGSVGElement | null>,
  { enabled = true, scrub = 1 }: ManifestoMotionPathOptions = {},
) {
  useEffect(() => {
    if (!enabled) return;

    const pathSection = sectionRef.current;
    const traveler = travelerRef.current;
    const svg = svgRef.current;
    if (!pathSection || !traveler || !svg) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    let ctx: gsap.Context | undefined;

    function buildTimeline() {
      ctx?.revert();
      ctx = gsap.context(() => {
        const initMarker = pathSection!.querySelector<HTMLElement>(
          ".manifesto-stop--initial .manifesto-marker",
        );
        const stops = gsap.utils.toArray<HTMLElement>(
          ".manifesto-stop:not(.manifesto-stop--initial)",
        );
        const pathEnd = pathSection!.querySelector<HTMLElement>(".manifesto-path-end");

        if (!initMarker || stops.length === 0 || !pathEnd) return;

        const mobile = window.innerWidth < 768;

        const psRect = pathSection!.getBoundingClientRect();
        const imRect = initMarker.getBoundingClientRect();

        gsap.set(traveler, {
          top: imRect.top - psRect.top,
          left: imRect.left - psRect.left,
          xPercent: -50,
          yPercent: -50,
        });

        const travelerRect = traveler!.getBoundingClientRect();
        const points: Point[] = [];
        stops.forEach((stop, index) => {
          const marker = stop.querySelector<HTMLElement>(".manifesto-marker");
          if (!marker) return;
          const r = marker.getBoundingClientRect();
          const dest = {
            x: r.left - travelerRect.left,
            y: r.top - travelerRect.top,
          };
          if (mobile) {
            const bulge = (index % 2 === 0 ? 1 : -1) * Math.min(window.innerWidth * 0.32, 120);
            points.push({ x: dest.x + bulge, y: dest.y - 36 });
          }
          points.push(dest);
        });

        drawTrace(svg!, pathSection!, travelerRect, stops, scrub);

        gsap.timeline({
          scrollTrigger: {
            trigger: pathSection!.querySelector(".manifesto-stop--initial"),
            start: "top center",
            endTrigger: pathEnd,
            end: "top center",
            scrub,
            invalidateOnRefresh: true,
          },
        }).to(traveler, {
          duration: 1,
          ease: "none",
          motionPath: {
            path: points,
            curviness: mobile ? 2.2 : 1.5,
          },
        });
      }, pathSection!);
    }

    buildTimeline();

    const onResize = () => {
      buildTimeline();
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      ctx?.revert();
    };
  }, [enabled, scrub, sectionRef, travelerRef, svgRef]);
}

function drawTrace(
  svg: SVGSVGElement,
  pathSection: HTMLElement,
  travelerRect: DOMRect,
  stops: HTMLElement[],
  scrub: number | boolean,
) {
  const psRect = pathSection.getBoundingClientRect();
  const pts: Point[] = [
    {
      x: travelerRect.left - psRect.left,
      y: travelerRect.top - psRect.top,
    },
  ];

  stops.forEach((stop) => {
    const marker = stop.querySelector<HTMLElement>(".manifesto-marker");
    if (!marker) return;
    const r = marker.getBoundingClientRect();
    pts.push({ x: r.left - psRect.left, y: r.top - psRect.top });
  });

  const d = buildSmoothPathD(pts);
  svg.innerHTML = "";

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", d);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "var(--scene-accent)");
  path.setAttribute("stroke-width", "2");
  path.setAttribute("stroke-dasharray", "8 6");
  path.setAttribute("opacity", "0.35");
  svg.appendChild(path);

  const len = path.getTotalLength();
  gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });

  gsap.to(path, {
    strokeDashoffset: 0,
    ease: "none",
    scrollTrigger: {
      trigger: pathSection.querySelector(".manifesto-stop--initial"),
      start: "top center",
      endTrigger: pathSection.querySelector(".manifesto-path-end"),
      end: "top center",
      scrub,
      invalidateOnRefresh: true,
    },
  });
}

export function useManifestoOathScroll(
  rootRef: RefObject<HTMLElement | null>,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled || !rootRef.current) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = rootRef.current;
    const lines = root.querySelectorAll<HTMLElement>(".manifesto-oath-line");
    const tapHandlers: Array<{ el: HTMLElement; fn: () => void }> = [];

    const ctx = gsap.context(() => {
      if (!reducedMotion) {
        lines.forEach((el) => {
          gsap.to(el, {
            backgroundSize: "100% 100%",
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 82%",
              end: "top 18%",
              scrub: true,
            },
          });
        });
      }

      const isTouch = window.matchMedia("(hover: none)").matches;
      if (isTouch) {
        lines.forEach((el) => {
          const fn = () => el.classList.toggle("manifesto-oath-line--tapped");
          el.addEventListener("click", fn);
          tapHandlers.push({ el, fn });
        });
      }
    }, root);

    return () => {
      ctx.revert();
      tapHandlers.forEach(({ el, fn }) => el.removeEventListener("click", fn));
    };
  }, [enabled, rootRef]);
}
