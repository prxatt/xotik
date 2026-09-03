"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useCapabilityTierContext } from "@/context/CapabilityTierContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { DESKTOP_MENU_MQ } from "@/lib/breakpoints";

const LERP = 0.28;
const DEFAULT_LABEL = "J";

const RING_IDLE = 1;
const RING_HOT = 1.45;
const RING_PRESS_MUL = 0.82;
const DOT_IDLE = 1;
const DOT_HOT = 1.35;
const DOT_PRESS = 0.65;

function ringScale(hot: boolean, pressing: boolean) {
  const base = hot ? RING_HOT : RING_IDLE;
  return pressing ? base * RING_PRESS_MUL : base;
}

function dotScale(hot: boolean, pressing: boolean) {
  if (pressing) return DOT_PRESS;
  return hot ? DOT_HOT : DOT_IDLE;
}

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

    hotRef.current = false;
    pressingRef.current = false;
    labelStateRef.current = DEFAULT_LABEL;
    setIsHot(false);
    setIsPressing(false);
    setLabel(DEFAULT_LABEL);

    gsap.set(cursor, { left: window.innerWidth / 2, top: window.innerHeight / 2 });
    gsap.set(ring, { scale: RING_IDLE });
    gsap.set(dot, { scale: DOT_IDLE });
    gsap.set(labelEl, {
      left: "50%",
      xPercent: -50,
      opacity: 0,
      y: 8,
      scale: 0.92,
      transformOrigin: "50% 0%",
    });

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: pos.x, y: pos.y };
    const leftSet = gsap.quickSetter(cursor, "left", "px");
    const topSet = gsap.quickSetter(cursor, "top", "px");

    function applyVisuals(options?: { pressingEase?: string; pressingDuration?: number }) {
      const hot = hotRef.current;
      const pressing = pressingRef.current;

      gsap.to(ring, {
        scale: ringScale(hot, pressing),
        duration: options?.pressingDuration ?? 0.24,
        ease: options?.pressingEase ?? "power3.out",
        overwrite: true,
      });
      gsap.to(dot, {
        scale: dotScale(hot, pressing),
        duration: options?.pressingDuration ?? 0.18,
        ease: options?.pressingEase ?? "power2.out",
        overwrite: true,
      });
      gsap.to(labelEl, {
        opacity: hot ? 1 : 0,
        left: "50%",
        xPercent: -50,
        y: hot ? 14 : 8,
        scale: hot ? 1 : 0.92,
        duration: 0.22,
        ease: "power2.out",
        overwrite: true,
      });
    }

    function setHot(nextHot: boolean, nextLabel: string) {
      const displayLabel = nextHot ? nextLabel : DEFAULT_LABEL;
      if (hotRef.current === nextHot && labelStateRef.current === displayLabel) return;

      hotRef.current = nextHot;
      labelStateRef.current = displayLabel;
      setIsHot(nextHot);
      setLabel(displayLabel);
      applyVisuals();
    }

    function setPressing(nextPressing: boolean) {
      if (pressingRef.current === nextPressing) return;
      pressingRef.current = nextPressing;
      setIsPressing(nextPressing);
      applyVisuals({
        pressingDuration: nextPressing ? 0.1 : 0.32,
        pressingEase: nextPressing ? "power2.in" : "elastic.out(1, 0.55)",
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

    applyVisuals();

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
      hotRef.current = false;
      pressingRef.current = false;
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
