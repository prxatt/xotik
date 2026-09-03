"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useCapabilityTierContext } from "@/context/CapabilityTierContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { DESKTOP_MENU_MQ } from "@/lib/breakpoints";

const LERP = 0.28;
const DEFAULT_LABEL = "J";

/**
 * Tier 2 desktop-only cursor — dot + ring + hover label pill.
 */
export function DesiPopCursor() {
  const { tier, isReady } = useCapabilityTierContext();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isDesktop = useMediaQuery(DESKTOP_MENU_MQ);
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const hotRef = useRef(false);
  const pressingRef = useRef(false);
  const labelStateRef = useRef(DEFAULT_LABEL);
  const [label, setLabel] = useState(DEFAULT_LABEL);
  const [isHot, setIsHot] = useState(false);
  const [isPressing, setIsPressing] = useState(false);

  const enabled = isReady && tier === 2 && !prefersReducedMotion && isDesktop;

  useEffect(() => {
    const root = document.documentElement;
    if (!enabled) {
      root.classList.remove("desi-cursor-active");
      return;
    }

    root.classList.add("desi-cursor-active");

    return () => {
      root.classList.remove("desi-cursor-active");
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const cursor = rootRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    const labelEl = labelRef.current;
    if (!cursor || !ring || !dot || !labelEl) return;

    labelStateRef.current = DEFAULT_LABEL;

    gsap.set(cursor, { left: window.innerWidth / 2, top: window.innerHeight / 2 });
    gsap.set(ring, { scale: 1 });
    gsap.set(dot, { scale: 1 });
    gsap.set(labelEl, { opacity: 0, y: 8, scale: 0.92 });

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: pos.x, y: pos.y };
    const leftSet = gsap.quickSetter(cursor, "left", "px");
    const topSet = gsap.quickSetter(cursor, "top", "px");

    function setHot(nextHot: boolean, nextLabel: string) {
      const displayLabel = nextHot ? nextLabel : DEFAULT_LABEL;
      if (hotRef.current === nextHot && labelStateRef.current === displayLabel) return;

      hotRef.current = nextHot;
      labelStateRef.current = displayLabel;
      setIsHot(nextHot);
      setLabel(displayLabel);

      const pressScale = pressingRef.current ? 0.88 : 1;
      gsap.to(ring, {
        scale: (nextHot ? 1.45 : 1) * pressScale,
        duration: 0.28,
        ease: "power3.out",
        overwrite: true,
      });
      gsap.to(dot, {
        scale: nextHot ? 1.35 : 1,
        duration: 0.22,
        ease: "power2.out",
        overwrite: true,
      });
      gsap.to(labelEl, {
        opacity: nextHot ? 1 : 0,
        y: nextHot ? 14 : 8,
        scale: nextHot ? 1 : 0.92,
        duration: 0.24,
        ease: "power2.out",
        overwrite: true,
      });
    }

    function setPressing(nextPressing: boolean) {
      if (pressingRef.current === nextPressing) return;
      pressingRef.current = nextPressing;
      setIsPressing(nextPressing);

      const base = hotRef.current ? 1.45 : 1;
      gsap.to(ring, {
        scale: nextPressing ? base * 0.82 : base,
        duration: nextPressing ? 0.1 : 0.32,
        ease: nextPressing ? "power2.in" : "elastic.out(1, 0.55)",
        overwrite: true,
      });
      gsap.to(dot, {
        scale: nextPressing ? 0.65 : hotRef.current ? 1.35 : 1,
        duration: 0.12,
        ease: "power2.out",
        overwrite: true,
      });
    }

    function onMove(event: MouseEvent) {
      mouse.x = event.clientX;
      mouse.y = event.clientY;

      const hit = document.elementFromPoint(event.clientX, event.clientY);
      const target = hit?.closest<HTMLElement>("[data-cursor-label]");
      if (target) {
        setHot(true, (target.dataset.cursorLabel ?? DEFAULT_LABEL).toUpperCase());
      } else {
        setHot(false, DEFAULT_LABEL);
      }
    }

    function onDown() {
      setPressing(true);
    }

    function onUp() {
      setPressing(false);
    }

    function onBlur() {
      setPressing(false);
    }

    const ticker = () => {
      const dt = 1 - Math.pow(1 - LERP, gsap.ticker.deltaRatio());
      pos.x += (mouse.x - pos.x) * dt;
      pos.y += (mouse.y - pos.y) * dt;
      leftSet(pos.x);
      topSet(pos.y);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("blur", onBlur);
    gsap.ticker.add(ticker);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("blur", onBlur);
      gsap.ticker.remove(ticker);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={rootRef} className="desi-cursor" aria-hidden>
      <div
        ref={ringRef}
        className={`desi-cursor__ring ${isHot ? "desi-cursor__ring--hot" : ""} ${
          isPressing ? "desi-cursor__ring--press" : ""
        }`}
      >
        <span ref={dotRef} className="desi-cursor__dot" />
      </div>
      <span ref={labelRef} className="desi-cursor__label font-receipt">
        {label}
      </span>
    </div>
  );
}
