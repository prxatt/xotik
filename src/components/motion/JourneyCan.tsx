"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { JEERU_CAN } from "@/lib/media";

gsap.registerPlugin(ScrollTrigger);

type Pose = {
  x: number;
  y: number;
  scale: number;
  rotate: number;
  opacity: number;
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function mix(a: Pose, b: Pose, t: number): Pose {
  const u = gsap.utils.clamp(0, 1, t);
  return {
    x: lerp(a.x, b.x, u),
    y: lerp(a.y, b.y, u),
    scale: lerp(a.scale, b.scale, u),
    rotate: lerp(a.rotate, b.rotate, u),
    opacity: lerp(a.opacity, b.opacity, u),
  };
}

/** How far the viewport focal line has traveled through a section (0–1). */
function sectionT(id: string, focal = 0.42): number {
  const el = document.getElementById(id);
  if (!el) return 0;
  const rect = el.getBoundingClientRect();
  const focus = window.innerHeight * focal;
  const start = rect.top;
  const end = rect.bottom;
  if (end <= focus) return 1;
  if (start >= focus) return 0;
  return gsap.utils.clamp(0, 1, (focus - start) / Math.max(end - start, 1));
}

/**
 * Street+factory share one tall pin. StreetFactoryScene crossfadeStart ≈ 0.4.
 * Journey can must clear as soon as the factory bay takes the frame.
 */
const STREET_FACTORY_CROSS = 0.4;

/**
 * Locked poses for the presentation scroll.
 * Product / manifesto own their own cans — journey yields there.
 */
function poseFromSections(wide: boolean): Pose {
  const street: Pose = {
    x: wide ? 78 : 74,
    y: 68,
    scale: wide ? 0.58 : 0.48,
    rotate: -8,
    opacity: 0.9,
  };
  const streetEnter: Pose = { ...street, opacity: 0, x: 108 };
  const factoryHide: Pose = { x: 50, y: 54, scale: 0.36, rotate: -10, opacity: 0 };
  const taste: Pose = { x: 50, y: 48, scale: 0.2, rotate: 8, opacity: 0.5 };
  const tasteOut: Pose = { ...taste, opacity: 0, scale: 0.06 };
  const cta: Pose = {
    x: 50,
    y: 50,
    scale: wide ? 1.9 : 1.45,
    rotate: -4,
    opacity: 0.12,
  };

  const streetT = sectionT("street");
  const productT = sectionT("product");
  const tasteT = sectionT("ingredients");
  const manifestoT = sectionT("manifesto");
  const findT = sectionT("find-j");

  // 06 Find J — ghost behind type
  if (findT > 0.08) return mix(tasteOut, cta, (findT - 0.08) / 0.55);

  // 05 Attitude — manifesto traveler owns the can
  if (manifestoT > 0.05) return tasteOut;

  // 04 Taste — shrink + shard cue, then clear for manifesto
  if (tasteT > 0.02) {
    if (tasteT < 0.45) return mix(tasteOut, taste, tasteT / 0.45);
    return mix(taste, tasteOut, (tasteT - 0.45) / 0.4);
  }

  // 03 Meet J — drink placeholders own the product
  if (productT > 0.02) return factoryHide;

  // 01–02 Street pin (street → factory crossfade)
  if (streetT > 0) {
    if (streetT < 0.14) return mix(streetEnter, street, streetT / 0.14);
    if (streetT < STREET_FACTORY_CROSS) return street;
    const fade = (streetT - STREET_FACTORY_CROSS) / 0.1;
    return mix(street, factoryHide, fade);
  }

  // 00 Hero — wait for street
  return streetEnter;
}

/** Jeeru can placeholder travels the scroll; yields where chapter media owns the product. */
export function JourneyCan() {
  const canRef = useRef<HTMLDivElement>(null);
  const shardRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const can = canRef.current;
    if (!can) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      can.style.opacity = "0";
      return;
    }

    const apply = () => {
      const wide = window.innerWidth >= 900;
      const pose = poseFromSections(wide);
      can.style.transform = `translate(${pose.x - 50}vw, ${pose.y - 50}vh) scale(${pose.scale}) rotate(${pose.rotate}deg)`;
      can.style.opacity = String(pose.opacity);
      const layer = can.parentElement;
      if (layer) {
        const findT = sectionT("find-j");
        layer.style.zIndex = findT > 0.15 ? "0" : "3";
      }

      const tasteT = sectionT("ingredients");
      const shardOn = tasteT > 0.05 && tasteT < 0.55;
      shardRefs.current.forEach((el, i) => {
        if (!el) return;
        el.style.opacity = shardOn ? "1" : "0";
        const spread = shardOn ? gsap.utils.clamp(0, 1, (tasteT - 0.05) / 0.4) : 0;
        const angle = (i / 4) * Math.PI * 2;
        el.style.translate = `${Math.cos(angle) * 88 * spread}px ${Math.sin(angle) * 64 * spread}px`;
      });
    };

    const st = ScrollTrigger.create({
      trigger: "#hero",
      start: "top top",
      endTrigger: "#find-j",
      end: "bottom bottom",
      scrub: 0.22,
      invalidateOnRefresh: true,
      onUpdate: apply,
      onRefresh: apply,
    });

    apply();
    return () => st.kill();
  }, []);

  return (
    <div className="journey-can" aria-hidden>
      <div ref={canRef} className="journey-can__body">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={JEERU_CAN.src} alt="" className="journey-can__img" />
        {["#6b8e4e", "#e5a020", "#c45a2c", "#1e4d6b"].map((color, index) => (
          <span
            key={color}
            ref={(el) => {
              shardRefs.current[index] = el;
            }}
            className="journey-can__shard"
            style={{ background: color }}
          />
        ))}
      </div>
    </div>
  );
}
