"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useCapabilityTierContext } from "@/context/CapabilityTierContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { DESKTOP_MENU_MQ } from "@/lib/breakpoints";

function OrbitRing({ label }: { label: string }) {
  const text = `${label}·`.repeat(2).slice(0, 14).toUpperCase();
  const step = 360 / text.length;

  return (
    <span className="desi-cursor__orbit" aria-hidden>
      {text.split("").map((char, index) => (
        <span
          key={`${char}-${index}`}
          className="desi-cursor__orbit-char"
          style={{ transform: `rotate(${index * step}deg) translateY(-18px)` }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}

/**
 * Tier 2 desktop-only cursor — never mounts on touch / narrow viewports.
 */
export function DesiPopCursor() {
  const { tier, isReady } = useCapabilityTierContext();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isDesktop = useMediaQuery(DESKTOP_MENU_MQ);
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [orbitLabel, setOrbitLabel] = useState("CLICK");
  const [isHot, setIsHot] = useState(false);

  const enabled = isReady && tier === 2 && !prefersReducedMotion && isDesktop;

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove("desi-cursor-active");
      return;
    }

    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    document.documentElement.classList.add("desi-cursor-active");

    gsap.set(cursor, { xPercent: -50, yPercent: -50, x: window.innerWidth / 2, y: window.innerHeight / 2 });
    gsap.set(ring, { scale: 1 });

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: pos.x, y: pos.y };
    const xSet = gsap.quickSetter(cursor, "x", "px");
    const ySet = gsap.quickSetter(cursor, "y", "px");

    function onMove(event: MouseEvent) {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    }

    function onOver(event: MouseEvent) {
      const target = (event.target as HTMLElement).closest<HTMLElement>("[data-cursor-label]");
      if (!target) return;
      setOrbitLabel((target.dataset.cursorLabel ?? "CLICK").toUpperCase());
      setIsHot(true);
      gsap.to(ring, { scale: 1.15, duration: 0.2, overwrite: true });
    }

    function onOut(event: MouseEvent) {
      const related = event.relatedTarget as HTMLElement | null;
      if (related?.closest("[data-cursor-label]")) return;
      setOrbitLabel("CLICK");
      setIsHot(false);
      gsap.to(ring, { scale: 1, duration: 0.2, overwrite: true });
    }

    const ticker = () => {
      const dt = 1 - Math.pow(1 - 0.35, gsap.ticker.deltaRatio());
      pos.x += (mouse.x - pos.x) * dt;
      pos.y += (mouse.y - pos.y) * dt;
      xSet(pos.x);
      ySet(pos.y);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    gsap.ticker.add(ticker);

    return () => {
      document.documentElement.classList.remove("desi-cursor-active");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      gsap.ticker.remove(ticker);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={cursorRef} className="desi-cursor" aria-hidden>
      <div ref={ringRef} className={`desi-cursor__ring ${isHot ? "desi-cursor__ring--hot" : ""}`}>
        <OrbitRing label={orbitLabel} />
      </div>
    </div>
  );
}
